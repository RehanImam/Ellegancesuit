import { useState, useEffect, useCallback } from "react";
import {
  Edit2,
  X,
  Check,
  Loader2,
  Plus,
  Trash2,
  MapPin,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AddressSection = ({ activeTab, setActiveTab }) => {
  const {
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    addressType: "HOME",
    isDefault: false,
  });

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAddresses();
      setAddresses(response.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  }, [getAddresses]);

  useEffect(() => {
    if (activeTab === "addresses") {
      fetchAddresses();
    }
  }, [activeTab, fetchAddresses]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.street ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await updateAddress(editingId, formData);
        setSuccess("Address updated successfully!");
      } else {
        await createAddress(formData);
        setSuccess("Address added successfully!");
      }

      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        addressType: "HOME",
        isDefault: false,
      });
      setEditingId(null);
      setShowForm(false);
      await fetchAddresses();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = (address) => {
    setFormData(address);
    setEditingId(address._id);
    setShowForm(true);
    setError("");
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      setLoading(true);
      await deleteAddress(addressId);
      setSuccess("Address deleted successfully!");
      await fetchAddresses();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to delete address");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      setLoading(true);
      await setDefaultAddress(addressId);
      setSuccess("Default address updated!");
      await fetchAddresses();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to set default address");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      addressType: "HOME",
      isDefault: false,
    });
    setError("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm tracking-wider uppercase text-gray-900">
          MY ADDRESSES
        </h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 border border-black px-3 py-1 rounded text-xs font-semibold hover:bg-gray-50 transition-colors"
          >
            <Plus size={14} />
            Add Address
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          {success}
        </p>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <form onSubmit={handleAddAddress} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                required
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                required
              />
            </div>

            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              placeholder="Street Address"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              required
            />

            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                required
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="State"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                required
              />
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="Pincode"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Country"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              />
              <select
                name="addressType"
                value={formData.addressType}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition bg-white"
              >
                <option value="HOME">Home</option>
                <option value="OFFICE">Office</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-xs font-medium text-gray-700">
                Set as default address
              </span>
            </label>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded text-xs font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Check size={12} />
                )}
                {editingId ? "Update" : "Add"} Address
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex items-center gap-1 border border-gray-300 px-4 py-2 rounded text-xs font-semibold hover:bg-gray-50 transition-colors"
              >
                <X size={12} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses List */}
      {loading && !showForm ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <MapPin size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600 text-sm">No addresses added yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-xs font-semibold text-black underline hover:text-gray-600"
          >
            Add your first address
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`border rounded-lg p-4 transition-all ${
                address.isDefault
                  ? "border-[#4CD0A0] bg-emerald-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {address.firstName} {address.lastName}
                    </h4>
                    <span className="text-[10px] font-medium text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                      {address.addressType}
                    </span>
                    {address.isDefault && (
                      <span className="text-[10px] font-medium text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    {address.street}, {address.city}, {address.state}{" "}
                    {address.pincode}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    {address.country} • Phone: {address.phoneNumber}
                  </p>
                  <p className="text-xs text-gray-600">{address.email}</p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleEditAddress(address)}
                    disabled={loading}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                    title="Edit"
                  >
                    <Edit2 size={14} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address._id)}
                    disabled={loading}
                    className="p-2 border border-gray-300 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address._id)}
                      disabled={loading}
                      className="text-xs font-medium text-black underline hover:text-gray-600 disabled:opacity-50 whitespace-nowrap"
                    >
                      Set Default
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressSection;