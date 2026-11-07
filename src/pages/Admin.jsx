import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  getProductDisplayName,
  getStoredProductName,
  isBestSellerProduct,
  normalizeCategory,
  PRODUCT_CATEGORIES,
} from "../data/productOptions";

const API_BASE = "https://auth-backend-gules.vercel.app/api/v1";

const emptyForm = {
  productName: "",
  category: "Suit",
  price: "",
  description: "",
  url: "",
  isBestSeller: false,
};

const readApiResponse = async (response, operation) => {
  const body = await response.text();
  try {
    return body ? JSON.parse(body) : {};
  } catch {
    throw new Error(`${operation} returned a non-JSON response (HTTP ${response.status}). Check the backend deployment and API URL.`);
  }
};

const getAuthHeaders = (json = false) => ({
  ...(json ? { "Content-Type": "application/json" } : {}),
  Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
});

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, authLoading } = useAuth();
  const { refreshProducts } = useCart();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [uploadMode, setUploadMode] = useState("category");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/login");
  }, [authLoading, user, isAdmin, navigate]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/products`, { credentials: "include" });
      const payload = await readApiResponse(response, "Loading products");
      if (!response.ok) throw new Error(payload.message || "Failed to load products");
      setProducts(payload.data || []);
    } catch (error) {
      setMessage(error.message);
    }
  }, []);

  useEffect(() => {
    if (user && isAdmin) fetchProducts();
  }, [user, isAdmin, fetchProducts]);

  const uploadToCloudinary = async (file) => {
    const signatureResponse = await fetch(`${API_BASE}/upload-signature`, {
      credentials: "include",
    });
    const signaturePayload = await readApiResponse(signatureResponse, "Getting the image upload signature");
    if (!signatureResponse.ok || !signaturePayload.signature) {
      throw new Error(signaturePayload.message || "Failed to get Cloudinary signature");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signaturePayload.apiKey);
    formData.append("timestamp", String(signaturePayload.timestamp));
    formData.append("signature", signaturePayload.signature);
    formData.append("folder", "ellegancesuit/products");

    const response = await fetch(`https://api.cloudinary.com/v1_1/${signaturePayload.cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const payload = await readApiResponse(response, "Uploading an image to Cloudinary");
    if (!response.ok || !payload.secure_url) {
      throw new Error(payload.error?.message || "Cloudinary upload failed");
    }
    return payload.secure_url;
  };

  const compressImage = (file) => new Promise((resolve, reject) => {
    if (file.size <= 5 * 1024 * 1024) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDimension = 1600;
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Image compression is not supported by this browser"));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Image compression failed"));
            return;
          }
          resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }));
        }, "image/jpeg", 0.75);
      };
      image.onerror = () => reject(new Error("Image read failed"));
      image.src = reader.result;
    };
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage("Uploading product image...");
    try {
      const image = await compressImage(file);
      const url = await uploadToCloudinary(image);
      setForm((previous) => ({ ...previous, url }));
      setMessage("Product image uploaded successfully.");
    } catch (error) {
      setMessage(error.message || "Product image upload failed.");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  const handleInputChange = (event) => {
    const { checked, name, type, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.url) {
      setMessage("Upload one product image before saving.");
      return;
    }

    setLoading(true);
    setMessage("");
    const payload = {
      productName: getStoredProductName(
        form.productName.trim(),
        editingId ? form.isBestSeller : uploadMode === "bestSeller"
      ),
      category: form.category,
      price: Number(form.price),
      description: form.description.trim(),
      url: form.url,
      images: [form.url],
      isBestSeller: editingId ? form.isBestSeller : uploadMode === "bestSeller",
    };

    try {
      const response = await fetch(
        editingId ? `${API_BASE}/products/${editingId}` : `${API_BASE}/products`,
        {
          method: editingId ? "PATCH" : "POST",
          credentials: "include",
          headers: getAuthHeaders(true),
          body: JSON.stringify(payload),
        }
      );
      const result = await readApiResponse(response, editingId ? "Updating product" : "Adding product");
      if (!response.ok) throw new Error(result.message || "Product could not be saved");

      setMessage(editingId ? "Product updated successfully." : "Product added successfully.");
      resetForm();
      await Promise.all([fetchProducts(), refreshProducts()]);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id || product.id);
    setForm({
      productName: getProductDisplayName(product.productName || product.name),
      category: normalizeCategory(product.category),
      price: String(product.price ?? ""),
      description: product.description || "",
      url: product.url || product.images?.[0] || "",
      isBestSeller: isBestSellerProduct(product),
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const response = await fetch(`${API_BASE}/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const result = await readApiResponse(response, "Deleting product");
      if (!response.ok) throw new Error(result.message || "Product could not be deleted");
      setMessage("Product deleted successfully.");
      await Promise.all([fetchProducts(), refreshProducts()]);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleToggleBestSeller = async (product) => {
    const shouldBeBestSeller = !isBestSellerProduct(product);
    try {
      const response = await fetch(`${API_BASE}/products/${product._id || product.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: getAuthHeaders(true),
        body: JSON.stringify({
          productName: getStoredProductName(product.productName || product.name, shouldBeBestSeller),
          isBestSeller: shouldBeBestSeller,
        }),
      });
      const result = await readApiResponse(response, "Updating Best Sellers");
      if (!response.ok) throw new Error(result.message || "Best Seller status could not be updated");
      setMessage(shouldBeBestSeller ? "Product added to Best Sellers." : "Product removed from Best Sellers.");
      await Promise.all([fetchProducts(), refreshProducts()]);
    } catch (error) {
      setMessage(error.message || "Best Seller status could not be updated.");
    }
  };

  const productSummary = useMemo(() => ({
    totalProducts: products.length,
    totalInventory: products.reduce((sum, product) => sum + (Number(product.totalQuantity) || 0), 0),
  }), [products]);

  if (authLoading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-rose-900">Loading admin dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fff8fa] p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-3xl border border-pink-200 bg-white p-6 shadow-lg sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-600">Shop owner</p>
              <h1 className="mt-2 text-3xl font-bold text-rose-950">Admin Product Dashboard</h1>
            </div>
            <button
              onClick={() => navigate("/")}
              className="rounded-full border border-rose-900 bg-white px-4 py-2 text-sm font-semibold text-rose-900 hover:bg-rose-50"
            >
              Back to storefront
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-pink-100 bg-pink-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-pink-600">Products</p>
              <p className="mt-3 text-3xl font-bold text-rose-950">{productSummary.totalProducts}</p>
            </div>
            <div className="rounded-2xl border border-pink-100 bg-pink-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-pink-600">Inventory</p>
              <p className="mt-3 text-3xl font-bold text-rose-950">{productSummary.totalInventory}</p>
            </div>
            <div className="rounded-2xl border border-pink-100 bg-pink-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-pink-600">Admin</p>
              <p className="mt-3 truncate text-lg font-semibold text-rose-950">{user.email}</p>
            </div>
          </div>
        </div>

        {message && (
          <div className="rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-sm text-rose-900">
            {message}
          </div>
        )}

        <div className="rounded-3xl border border-pink-200 bg-white p-6 shadow-sm">
          {!editingId && (
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setUploadMode("category");
                  setForm((previous) => ({ ...previous, isBestSeller: false }));
                  setMessage("");
                }}
                aria-pressed={uploadMode === "category"}
                className={`rounded-2xl border p-5 text-left transition ${
                  uploadMode === "category"
                    ? "border-rose-900 bg-pink-50 shadow-sm"
                    : "border-pink-200 bg-white hover:bg-pink-50"
                }`}
              >
                <span className="block text-lg font-bold text-rose-950">Upload Products by Category</span>
                <span className="mt-1 block text-sm text-rose-700">Add one product to the selected category.</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUploadMode("bestSeller");
                  setForm((previous) => ({ ...previous, isBestSeller: true }));
                  setMessage("");
                }}
                aria-pressed={uploadMode === "bestSeller"}
                className={`rounded-2xl border p-5 text-left transition ${
                  uploadMode === "bestSeller"
                    ? "border-rose-900 bg-pink-50 shadow-sm"
                    : "border-pink-200 bg-white hover:bg-pink-50"
                }`}
              >
                <span className="block text-lg font-bold text-rose-950">Upload Best Sellers</span>
                <span className="mt-1 block text-sm text-rose-700">Add one product directly to Best Sellers.</span>
              </button>
            </div>
          )}
          <h2 className="text-2xl font-bold text-rose-950">
            {editingId
              ? "Edit Product"
              : uploadMode === "bestSeller"
                ? "Upload Best Seller"
                : "Upload Products by Category"}
          </h2>
          <p className="mt-1 text-sm text-rose-700">
            {editingId ? "Update this product's details." : "Add one product at a time with its name, category, price, and image."}
          </p>
          <form onSubmit={handleSubmit} className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-medium text-rose-900">
              Product name
              <input
                name="productName"
                value={form.productName}
                onChange={handleInputChange}
                required
                maxLength={120}
                className="mt-2 w-full rounded-xl border border-pink-200 bg-pink-50 px-3 py-3"
              />
            </label>
            <label className="block text-sm font-medium text-rose-900">
              Category
              <select
                name="category"
                value={form.category}
                onChange={handleInputChange}
                required
                className="mt-2 w-full rounded-xl border border-pink-200 bg-pink-50 px-3 py-3"
              >
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-rose-900">
              Price (₹)
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleInputChange}
                required
                className="mt-2 w-full rounded-xl border border-pink-200 bg-pink-50 px-3 py-3"
              />
            </label>
            <label className="block text-sm font-medium text-rose-900">
              Product image (one image)
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                className="mt-2 block w-full rounded-xl border border-pink-200 bg-pink-50 p-3"
              />
            </label>
            <label className="block text-sm font-medium text-rose-900 md:col-span-2">
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                rows="3"
                className="mt-2 w-full rounded-xl border border-pink-200 bg-pink-50 px-3 py-3"
              />
            </label>
            {form.url && (
              <div className="md:col-span-2">
                <img src={form.url} alt="Product preview" className="h-40 w-32 rounded-xl object-cover" />
              </div>
            )}
            {editingId && (
              <label className="flex items-center gap-3 text-sm font-medium text-rose-900 md:col-span-2">
                <input
                  type="checkbox"
                  name="isBestSeller"
                  checked={form.isBestSeller}
                  onChange={handleInputChange}
                  className="h-4 w-4 accent-rose-900"
                />
                Show in Best Sellers
              </label>
            )}
            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-rose-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-70"
              >
                {loading
                  ? "Saving..."
                  : editingId
                    ? "Save changes"
                    : uploadMode === "bestSeller"
                      ? "Upload Best Seller"
                      : "Upload Product"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-pink-300 px-6 py-3 text-sm font-semibold text-rose-900"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="rounded-3xl border border-pink-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-2xl font-bold text-rose-950">Inventory</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {products.length === 0 ? (
              <p className="text-sm text-rose-700">No products yet. Add your first product.</p>
            ) : products.map((product) => (
              <div key={product._id || product.id} className="rounded-2xl border border-pink-200 bg-pink-50 p-3">
                <div className="flex gap-3">
                  <img
                    src={product.url || product.images?.[0]}
                    alt={product.productName || product.name}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-rose-950">
                      {getProductDisplayName(product.productName || product.name)}
                    </p>
                    <p className="text-sm text-rose-700">{normalizeCategory(product.category)}</p>
                    <p className="text-sm text-rose-900">₹{Number(product.price || 0).toLocaleString()}</p>
                    <p className="text-xs text-rose-700">Stock: {Number(product.totalQuantity || 0)}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(product)}
                    className="rounded-full bg-rose-900 px-2 py-2 text-xs font-semibold text-white"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleBestSeller(product)}
                    className="rounded-full border border-pink-300 bg-white px-2 py-2 text-xs font-semibold text-rose-900"
                  >
                    {isBestSellerProduct(product) ? "Remove best" : "Add best"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product._id || product.id)}
                    className="rounded-full border border-rose-200 bg-white px-2 py-2 text-xs font-semibold text-rose-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
