import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CATEGORY_PRICES, normalizeCategory, PRODUCT_CATEGORIES } from "../data/productOptions";

const API_BASE = "https://auth-backend-gules.vercel.app/api/v1";

const emptyForm = {
  category: "Lehnga",
  price: CATEGORY_PRICES.Lehnga,
  url: "",
  images: [],
  isBestSeller: false,
};

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [bulkCategory, setBulkCategory] = useState("Lehnga");
  const [bulkBestSeller, setBulkBestSeller] = useState(false);
  const [bulkFiles, setBulkFiles] = useState([]);
  const [bulkProgress, setBulkProgress] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/login");
    }
  }, [authLoading, user, isAdmin, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`, { credentials: "include" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Failed to load products");
      setProducts(payload.data || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchProducts();
    }
  }, [user, isAdmin]);

  const handleInputChange = (event) => {
    const { checked, name, type, value } = event.target;
    setForm((prev) => {
      if (name === "category") {
        return {
          ...prev,
          category: value,
          price: CATEGORY_PRICES[value],
        };
      }

      return { ...prev, [name]: type === "checkbox" ? checked : value };
    });
  };

  const uploadToCloudinary = async (file) => {
    const signatureResponse = await fetch(`${API_BASE}/upload-signature`, {
      credentials: "include",
    });
    const signaturePayload = await signatureResponse.json();

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

    const payload = await response.json();
    if (!response.ok || !payload.secure_url) {
      throw new Error(payload.error?.message || "Cloudinary upload failed");
    }

    return payload.secure_url;
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file || file.size <= 5 * 1024 * 1024) {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDimension = 1600;
          let { width, height } = img;

          if (width > height) {
            if (width > maxDimension) {
              height = (height * maxDimension) / width;
              width = maxDimension;
            }
          } else if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Image compression failed"));
                return;
              }

              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/jpeg",
            0.75
          );
        };
        img.onerror = () => reject(new Error("Image read failed"));
        img.src = reader.result;
      };
      reader.onerror = () => reject(new Error("File read failed"));
      reader.readAsDataURL(file);
    });
  };

  const handleFrontImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const sourceFile = await compressImage(file);
      setMessage("Uploading product image...");
      const uploadedUrl = await uploadToCloudinary(sourceFile);
      setForm((prev) => ({
        ...prev,
        url: uploadedUrl,
        images: [uploadedUrl],
      }));
      setMessage("Product image uploaded successfully.");
    } catch (error) {
      setMessage(error.message || "Front image upload failed");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  const handleBulkFilesChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 100) {
      setMessage("Please select no more than 100 images at a time.");
      setBulkFiles([]);
    } else {
      setMessage("");
      setBulkFiles(files);
    }
    event.target.value = "";
  };

  const handleBulkUpload = async () => {
    if (bulkFiles.length === 0) {
      setMessage("Please select at least one product image.");
      return;
    }

    setLoading(true);
    setMessage("");
    setBulkProgress(`Preparing ${bulkFiles.length} images...`);

    try {
      const uploadedUrls = Array(bulkFiles.length);
      const uploadErrors = [];
      let nextIndex = 0;
      let completed = 0;

      const uploadWorker = async () => {
        while (nextIndex < bulkFiles.length) {
          const index = nextIndex;
          nextIndex += 1;
          try {
            const file = await compressImage(bulkFiles[index]);
            uploadedUrls[index] = await uploadToCloudinary(file);
          } catch (error) {
            uploadErrors.push(`Image ${index + 1}: ${error.message}`);
          } finally {
            completed += 1;
            setBulkProgress(`Uploading images: ${completed} of ${bulkFiles.length}`);
          }
        }
      };

      await Promise.all(
        Array.from({ length: Math.min(3, bulkFiles.length) }, () => uploadWorker())
      );

      if (uploadErrors.length > 0) {
        throw new Error(`${uploadErrors.length} image(s) could not be uploaded. ${uploadErrors[0]}`);
      }

      setBulkProgress(`Creating ${uploadedUrls.length} products...`);
      const response = await fetch(`${API_BASE}/products/bulk`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `******"accessToken") || ""}`,
        },
        body: JSON.stringify({
          category: bulkCategory,
          images: uploadedUrls,
          isBestSeller: bulkBestSeller,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Bulk product creation failed");

      setMessage(`${result.data.length} products added to ${bulkCategory}.`);
      setBulkFiles([]);
      setBulkProgress("");
      await fetchProducts();
    } catch (error) {
      setMessage(error.message || "Bulk image upload failed.");
      setBulkProgress("");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const imageList = [...form.images].map((item) => item.trim()).filter(Boolean).slice(0, 1);
      const payload = {
        ...form,
        url: form.url || imageList[0] || "",
        images: imageList,
        price: CATEGORY_PRICES[form.category],
        originalPrice: 999,
        sizeStock: [],
      };

      const method = editingId ? "PATCH" : "POST";
      const url = editingId ? `${API_BASE}/products/${editingId}` : `${API_BASE}/products`;

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Product save failed");

      setMessage(editingId ? "Product updated successfully." : "Product added successfully.");
      setForm(emptyForm);
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id || product.id);
    setForm({
      productName: product.productName || product.name || "",
      category: normalizeCategory(product.category),
      price: CATEGORY_PRICES[normalizeCategory(product.category)],
      url: product.url || product.images?.[0] || "",
      images: [product.url || product.images?.[0] || ""].filter(Boolean),
      isBestSeller: Boolean(product.isBestSeller),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const response = await fetch(`${API_BASE}/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Delete failed");
      setMessage("Product deleted successfully.");
      fetchProducts();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const productSummary = useMemo(() => {
    const totalInventory = products.reduce((sum, product) => sum + (Number(product.totalQuantity) || 0), 0);
    return { totalProducts: products.length, totalInventory };
  }, [products]);

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-rose-900">Loading admin dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fff8fa] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl shadow-lg border border-pink-200 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-pink-600 font-semibold">Shop owner</p>
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
            <div className="rounded-2xl bg-pink-50 border border-pink-100 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-pink-600">Products</p>
              <p className="mt-3 text-3xl font-bold text-rose-950">{productSummary.totalProducts}</p>
            </div>
            <div className="rounded-2xl bg-pink-50 border border-pink-100 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-pink-600">Inventory</p>
              <p className="mt-3 text-3xl font-bold text-rose-950">{productSummary.totalInventory}</p>
            </div>
            <div className="rounded-2xl bg-pink-50 border border-pink-100 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-pink-600">Admin</p>
              <p className="mt-3 text-lg font-semibold text-rose-950 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-white border border-pink-200 rounded-3xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-rose-950">{editingId ? "Edit Product" : "Add Product"}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block text-sm font-medium text-rose-900">
                  Category
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-xl border border-pink-200 bg-pink-50 px-3 py-3 outline-none focus:border-rose-800"
                  >
                    {PRODUCT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-medium text-rose-900">
                  Price (category based)
                  <p className="mt-2 rounded-xl border border-pink-200 bg-pink-50 px-3 py-3 text-rose-900">
                    ₹{CATEGORY_PRICES[form.category]}
                  </p>
                </label>
              </div>

              <label className="flex items-center gap-3 text-sm font-medium text-rose-900">
                <input
                  type="checkbox"
                  name="isBestSeller"
                  checked={form.isBestSeller}
                  onChange={handleInputChange}
                  className="h-4 w-4 accent-rose-900"
                />
                Show in Best Sellers
              </label>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-700">Product Image</h3>
                  <label className="cursor-pointer rounded-full bg-rose-900 px-4 py-2 text-xs font-semibold text-white">
                    Upload one image
                    <input type="file" accept="image/*" onChange={handleFrontImageUpload} className="hidden" />
                  </label>
                </div>

                {form.url && (
                  <div className="overflow-hidden rounded-2xl border border-pink-200 bg-pink-50 p-2">
                    <img src={form.url} alt="Product preview" className="h-32 w-full object-cover rounded-xl" />
                  </div>
                )}
              </div>

              {message && (
                <div className="rounded-xl border border-pink-200 bg-pink-50 px-3 py-2 text-sm text-rose-900">
                  {message}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-rose-900 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-800 disabled:opacity-70"
                >
                  {loading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm(emptyForm);
                      setMessage("");
                    }}
                    className="rounded-full border border-pink-300 bg-white px-6 py-3 text-sm font-semibold text-rose-900"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {!editingId && (
              <div className="mt-8 border-t border-pink-100 pt-6">
                <h3 className="text-xl font-semibold text-rose-950">Bulk upload products</h3>
                <p className="mt-1 text-sm text-rose-700">
                  Select multiple images. Each image will become a separate product in the selected category.
                </p>

                <label className="mt-4 block text-sm font-medium text-rose-900">
                  Category for all images
                  <select
                    value={bulkCategory}
                    onChange={(event) => setBulkCategory(event.target.value)}
                    disabled={loading}
                    className="mt-2 w-full rounded-xl border border-pink-200 bg-pink-50 px-3 py-3 outline-none focus:border-rose-800"
                  >
                    {PRODUCT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>

                <label className="mt-4 block text-sm font-medium text-rose-900">
                  Select product images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={loading}
                    onChange={handleBulkFilesChange}
                    className="mt-2 block w-full rounded-xl border border-pink-200 bg-pink-50 p-3 text-sm"
                  />
                </label>

                {bulkFiles.length > 0 && (
                  <p className="mt-2 text-sm text-rose-700">
                    {bulkFiles.length} image(s) selected · ₹{CATEGORY_PRICES[bulkCategory]} each
                  </p>
                )}

                <label className="mt-4 flex items-center gap-3 text-sm font-medium text-rose-900">
                  <input
                    type="checkbox"
                    checked={bulkBestSeller}
                    onChange={(event) => setBulkBestSeller(event.target.checked)}
                    disabled={loading}
                    className="h-4 w-4 accent-rose-900"
                  />
                  Show all uploaded products in Best Sellers
                </label>

                {bulkProgress && (
                  <p className="mt-3 text-sm font-medium text-rose-700">{bulkProgress}</p>
                )}

                <button
                  type="button"
                  onClick={handleBulkUpload}
                  disabled={loading || bulkFiles.length === 0}
                  className="mt-4 rounded-full bg-rose-900 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Uploading..." : `Upload ${bulkFiles.length || ""} Products`}
                </button>
              </div>
            )}
          </div>

          <div className="bg-white border border-pink-200 rounded-3xl shadow-sm p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-rose-950">Inventory</h2>
            </div>

            <div className="space-y-3 max-h-[760px] overflow-y-auto pr-2">
              {products.length === 0 ? (
                <p className="text-sm text-rose-700">No products yet. Add your first product.</p>
              ) : (
                products.map((product) => (
                  <div key={product._id || product.id} className="rounded-2xl border border-pink-200 bg-pink-50 p-3">
                    <div className="flex gap-3">
                      <img
                        src={product.url || product.images?.[0]}
                        alt={product.productName || product.name}
                        className="h-20 w-20 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-rose-950">{product.productName || product.name}</p>
                                        <p className="text-sm text-rose-700">{normalizeCategory(product.category)}</p>
                                        <p className="text-sm text-rose-900">₹{CATEGORY_PRICES[normalizeCategory(product.category)].toLocaleString()}</p>
                        <p className="text-xs text-rose-700">Stock: {Number(product.totalQuantity || 0)}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        className="flex-1 rounded-full bg-rose-900 px-3 py-2 text-xs font-semibold text-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product._id || product.id)}
                        className="flex-1 rounded-full border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;