import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { CATEGORY_PRICES, normalizeCategory, PRODUCT_CATEGORIES } from "../data/productOptions";

const API_BASE = "https://auth-backend-gules.vercel.app/api/v1";

const emptyForm = {
  category: "Lehnga",
  url: "",
  images: [],
  isBestSeller: false,
};

const uploadImageBatch = async (files, startIndex, compressImage, uploadToCloudinary) =>
  Promise.all(files.map(async (imageFile, batchIndex) => {
    const index = startIndex + batchIndex;
    try {
      const file = await compressImage(imageFile);
      return { index, url: await uploadToCloudinary(file) };
    } catch (error) {
      return { index, error: `Image ${index + 1}: ${error.message}` };
    }
  }));

const readApiResponse = async (response, operation) => {
  const body = await response.text();
  try {
    return body ? JSON.parse(body) : {};
  } catch {
    throw new Error(`${operation} returned a non-JSON response (HTTP ${response.status}). Check the backend deployment and API URL.`);
  }
};

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, authLoading } = useAuth();
  const { refreshProducts } = useCart();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeUpload, setActiveUpload] = useState("");
  const [message, setMessage] = useState("");
  const [categoryUpload, setCategoryUpload] = useState({
    category: "Lehnga",
    files: [],
    progress: "",
  });
  const [bestSellerUpload, setBestSellerUpload] = useState({
    category: "Lehnga",
    files: [],
    progress: "",
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/login");
    }
  }, [authLoading, user, isAdmin, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`, { credentials: "include" });
      const payload = await readApiResponse(response, "Loading products");
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
        return { ...prev, category: value };
      }

      return { ...prev, [name]: type === "checkbox" ? checked : value };
    });
  };

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

  const handleBulkFilesChange = (event, setUpload) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 100) {
      setMessage("Please select no more than 100 images at a time.");
      setUpload((prev) => ({ ...prev, files: [] }));
    } else {
      setMessage("");
      setUpload((prev) => ({ ...prev, files }));
    }
  };

  const handleBulkUpload = async (uploadType, upload, setUpload, isBestSeller) => {
    if (upload.files.length === 0) {
      setMessage("Please select at least one product image.");
      return;
    }

    setLoading(true);
    setActiveUpload(uploadType);
    setMessage("");
    setUpload((prev) => ({ ...prev, progress: `Preparing ${upload.files.length} images...` }));

    try {
      const uploadedUrls = Array(upload.files.length);
      const uploadErrors = [];
      let completed = 0;

      for (let start = 0; start < upload.files.length; start += 3) {
        const batch = upload.files.slice(start, start + 3);
        const batchResults = await uploadImageBatch(batch, start, compressImage, uploadToCloudinary);
        for (const result of batchResults) {
          if (result.error) {
            uploadErrors.push(result.error);
          } else {
            uploadedUrls[result.index] = result.url;
          }
        }
        completed += batch.length;
        const progress = `Uploading images: ${completed} of ${upload.files.length}`;
        setUpload({ ...upload, progress });
      }

      if (uploadErrors.length > 0) {
        throw new Error(`${uploadErrors.length} image(s) could not be uploaded. ${uploadErrors[0]}`);
      }

      setUpload((prev) => ({ ...prev, progress: `Saving ${uploadedUrls.length} products...` }));

      const usedNames = new Set(
        products.map((product) => String(product.productName || product.name || "").toLowerCase())
      );
      const categoryPrefix = upload.category.toLowerCase();
      let nextSuffix = 1;
      const productPayloads = uploadedUrls.map((url, index) => {
        let productName = `${categoryPrefix} ${nextSuffix}`;
        while (usedNames.has(productName)) {
          nextSuffix += 1;
          productName = `${categoryPrefix} ${nextSuffix}`;
        }
        usedNames.add(productName);
        nextSuffix += 1;

        return {
          index,
          payload: {
            productName,
            category: upload.category,
            description: `Beautiful ${upload.category.toLowerCase()} design for festive and special occasions.`,
            url,
            images: [url],
            price: CATEGORY_PRICES[upload.category],
            originalPrice: 999,
            totalQuantity: 0,
            sizeStock: [],
            isBestSeller,
          },
        };
      });

      const results = [];
      for (let start = 0; start < productPayloads.length; start += 3) {
        const batch = productPayloads.slice(start, start + 3);
        setUpload((prev) => ({
          ...prev,
          progress: `Saving products: ${Math.min(start + batch.length, productPayloads.length)} of ${productPayloads.length}`,
        }));

        const batchResults = await Promise.all(batch.map(async ({ index, payload }) => {
          try {
            const response = await fetch(`${API_BASE}/products`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                Authorization: `******"accessToken") || ""}`,
              },
              body: JSON.stringify(payload),
            });
            const result = await readApiResponse(response, `Saving product ${index + 1}`);
            if (!response.ok) throw new Error(result.message || `Product ${index + 1} could not be saved`);
            return { index, success: true };
          } catch (error) {
            return { index, success: false, error };
          }
        }));
        results.push(...batchResults);
      }

      const successfulResults = results.filter((result) => result.success);
      const failedResults = results.filter((result) => !result.success);
      const failedFiles = failedResults.map((result) => upload.files[result.index]);

      if (successfulResults.length > 0) {
        await Promise.all([fetchProducts(), refreshProducts()]);
      }
      if (failedResults.length > 0) {
        setMessage(
          `${successfulResults.length} of ${uploadedUrls.length} products added. ${failedResults.length} failed: ${failedResults[0].error.message}`
        );
      } else {
        setMessage(`${successfulResults.length} ${upload.category} products added${isBestSeller ? " to Best Sellers" : ""}.`);
      }
      setUpload((prev) => ({ ...prev, files: failedFiles, progress: "" }));
    } catch (error) {
      setMessage(error.message || "Bulk image upload failed.");
      setUpload((prev) => ({ ...prev, progress: "" }));
    } finally {
      setActiveUpload("");
      setLoading(false);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const imageList = [...form.images].map((item) => item.trim()).filter(Boolean).slice(0, 1);
      const payload = {
        category: form.category,
        url: form.url || imageList[0] || "",
        images: imageList,
        price: CATEGORY_PRICES[form.category],
        originalPrice: 999,
        isBestSeller: form.isBestSeller,
      };

      const response = await fetch(`${API_BASE}/products/${editingId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Product save failed");

      setMessage("Product updated successfully.");
      setForm(emptyForm);
      setEditingId(null);
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
      category: normalizeCategory(product.category),
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
      await Promise.all([fetchProducts(), refreshProducts()]);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const renderBulkUploader = (title, uploadType, upload, setUpload, isBestSeller) => {
    const isUploading = activeUpload === uploadType;
    return (
    <div className="rounded-3xl border border-pink-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-rose-950">{title}</h2>
      <p className="mt-1 text-sm text-rose-700">
        Select multiple photos. Each photo becomes one product at the category price.
      </p>

      <label className="mt-4 block text-sm font-medium text-rose-900">
        Category
        <select
          value={upload.category}
          onChange={(event) => setUpload((prev) => ({ ...prev, category: event.target.value }))}
          disabled={loading}
          className="mt-2 w-full rounded-xl border border-pink-200 bg-pink-50 px-3 py-3 outline-none focus:border-rose-800"
        >
          {PRODUCT_CATEGORIES.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </label>

      <p className="mt-2 text-sm font-semibold text-rose-900">
        Price: ₹{CATEGORY_PRICES[upload.category]} · Original price: ₹999
      </p>

      <label className="mt-4 block text-sm font-medium text-rose-900">
        Product photos (up to 100; use Ctrl+A to select all)
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={Boolean(activeUpload)}
          onChange={(event) => handleBulkFilesChange(event, setUpload)}
          className="mt-2 block w-full rounded-xl border border-pink-200 bg-pink-50 p-3 text-sm"
        />
      </label>

      {upload.files.length > 0 && (
        <p className="mt-2 text-sm text-rose-700">{upload.files.length} photo(s) selected.</p>
      )}
      {upload.progress && (
        <p className="mt-3 text-sm font-medium text-rose-700">{upload.progress}</p>
      )}

      <button
        type="button"
        onClick={() => handleBulkUpload(uploadType, upload, setUpload, isBestSeller)}
        disabled={Boolean(activeUpload) || upload.files.length === 0}
        className="mt-4 rounded-full bg-rose-900 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isUploading ? "Uploading..." : `Upload ${upload.files.length || ""} Products`}
      </button>
    </div>
    );
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

        {message && (
          <div className="rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-sm text-rose-900">
            {message}
          </div>
        )}

        {editingId ? (
          <div className="rounded-3xl border border-pink-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-rose-950">Edit Product</h2>
            <form onSubmit={handleEditSubmit} className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-medium text-rose-900">
                Category
                <select
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-xl border border-pink-200 bg-pink-50 px-3 py-3"
                >
                  {PRODUCT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>
              <div className="text-sm font-medium text-rose-900">
                Fixed price
                <p className="mt-2 rounded-xl border border-pink-200 bg-pink-50 px-3 py-3">
                  ₹{CATEGORY_PRICES[form.category]} (original ₹999)
                </p>
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
              <label className="block text-sm font-medium text-rose-900">
                Replace product photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFrontImageUpload}
                  disabled={loading}
                  className="mt-2 block w-full rounded-xl border border-pink-200 bg-pink-50 p-3"
                />
              </label>
              {form.url && (
                <img src={form.url} alt="Product preview" className="h-40 w-32 rounded-xl object-cover" />
              )}
              <div className="flex gap-3 md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-rose-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-70"
                >
                  {loading ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                    setMessage("");
                  }}
                  className="rounded-full border border-pink-300 px-6 py-3 text-sm font-semibold text-rose-900"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {renderBulkUploader("Upload Products by Category", "category", categoryUpload, setCategoryUpload, false)}
            {renderBulkUploader("Upload Best Sellers", "bestSeller", bestSellerUpload, setBestSellerUpload, true)}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
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