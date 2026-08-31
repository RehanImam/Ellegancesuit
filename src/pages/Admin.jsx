import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE = "https://auth-backend-gules.vercel.app/api/v1";

const emptyForm = {
  productName: "",
  category: "Frocks",
  price: "",
  description: "",
  url: "",
  images: ["", "", "", "", ""],
  sizeStock: [
    { size: "S", quantity: 0 },
    { size: "M", quantity: 0 },
    { size: "L", quantity: 0 },
    { size: "XL", quantity: 0 },
    { size: "XXL", quantity: 0 },
  ],
};

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (index, value) => {
    setForm((prev) => {
      const nextImages = [...prev.images];
      nextImages[index] = value;
      return {
        ...prev,
        images: nextImages,
        url: value || prev.url,
      };
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

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const sourceFile = await compressImage(file);
      const uploadLabel = sourceFile.size > 5 * 1024 * 1024 ? "Compressing and uploading image..." : "Uploading image to Cloudinary...";
      setMessage(uploadLabel);
      const uploadedUrl = await uploadToCloudinary(sourceFile);
      setForm((prev) => ({
        ...prev,
        url: uploadedUrl,
        images: [uploadedUrl, ...prev.images.slice(1, 5)].slice(0, 5),
      }));
      setMessage("Image uploaded successfully.");
    } catch (error) {
      setMessage(error.message || "Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSizeChange = (size, quantity) => {
    setForm((prev) => ({
      ...prev,
      sizeStock: prev.sizeStock.map((item) =>
        item.size === size ? { ...item, quantity: Number(quantity) } : item
      ),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const imageList = [...form.images].map((item) => item.trim()).filter(Boolean).slice(0, 5);
      const payload = {
        ...form,
        url: form.url || imageList[0] || "",
        images: imageList,
        price: Number(form.price),
        sizeStock: form.sizeStock.filter((item) => item.quantity > 0),
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
      category: product.category || "Frocks",
      price: product.price || "",
      description: product.description || "",
      url: product.url || product.images?.[0] || "",
      images: Array.isArray(product.images) && product.images.length > 0
        ? [...product.images, ...Array(5).fill("")].slice(0, 5)
        : [product.url || product.images?.[0] || "", "", "", "", ""],
      sizeStock: (product.sizeStock && product.sizeStock.length > 0)
        ? ["S", "M", "L", "XL", "XXL"].map((size) => {
            const match = product.sizeStock.find((item) => item.size === size);
            return { size, quantity: match ? Number(match.quantity) : 0 };
          })
        : [
            { size: "S", quantity: 0 },
            { size: "M", quantity: 0 },
            { size: "L", quantity: 0 },
            { size: "XL", quantity: 0 },
            { size: "XXL", quantity: 0 },
          ],
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
                  Product Name
                  <input
                    type="text"
                    name="productName"
                    value={form.productName}
                    onChange={handleInputChange}
                    required
                    className="mt-2 w-full rounded-xl border border-pink-200 bg-pink-50 px-3 py-3 outline-none focus:border-rose-800"
                  />
                </label>

                <label className="block text-sm font-medium text-rose-900">
                  Category
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-xl border border-pink-200 bg-pink-50 px-3 py-3 outline-none focus:border-rose-800"
                  >
                    <option value="Frocks">Frocks</option>
                    <option value="Suits">Suits</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </label>

                <label className="block text-sm font-medium text-rose-900">
                  Price
                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={form.price}
                    onChange={handleInputChange}
                    required
                    className="mt-2 w-full rounded-xl border border-pink-200 bg-pink-50 px-3 py-3 outline-none focus:border-rose-800"
                  />
                </label>

                <label className="block text-sm font-medium text-rose-900">
                  Image URL
                  <input
                    type="url"
                    name="url"
                    value={form.url}
                    onChange={handleInputChange}
                    required
                    className="mt-2 w-full rounded-xl border border-pink-200 bg-pink-50 px-3 py-3 outline-none focus:border-rose-800"
                  />
                </label>
              </div>

              <label className="block text-sm font-medium text-rose-900">
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                  className="mt-2 w-full rounded-xl border border-pink-200 bg-pink-50 px-3 py-3 outline-none focus:border-rose-800"
                />
              </label>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-700">Images (up to 5)</h3>
                  <label className="cursor-pointer rounded-full bg-rose-900 px-4 py-2 text-xs font-semibold text-white">
                    Upload from device
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {form.images.map((image, index) => (
                    <label key={`image-${index}`} className="block text-sm font-medium text-rose-900">
                      Image {index + 1}
                      <input
                        type="url"
                        value={image}
                        onChange={(event) => handleImageUrlChange(index, event.target.value)}
                        placeholder="Cloudinary URL or image link"
                        className="mt-2 w-full rounded-xl border border-pink-200 bg-pink-50 px-3 py-3 outline-none focus:border-rose-800"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-700">Stock by size</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {form.sizeStock.map((item) => (
                    <label key={item.size} className="flex items-center justify-between rounded-xl border border-pink-200 bg-pink-50 px-3 py-2">
                      <span className="font-medium text-rose-900">{item.size}</span>
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => handleSizeChange(item.size, e.target.value)}
                        className="ml-3 w-20 rounded-lg border border-pink-200 bg-white px-2 py-2 text-right outline-none focus:border-rose-800"
                      />
                    </label>
                  ))}
                </div>
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
                        <p className="text-sm text-rose-700">{product.category}</p>
                        <p className="text-sm text-rose-900">₹{Number(product.price || 0).toLocaleString()}</p>
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