import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Edit3,
  Home,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  Tag,
  Trash2,
  Truck,
  X,
  AlertCircle,
  Building2,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAddress } from "../context/AddressContext";

const COUPONS = [
  {
    code: "ELEGANCE10",
    discountPercent: 10,
    minOrder: 0,
    description: "10% off on your entire luxury order",
  },
  {
    code: "FIRST100",
    discountFlat: 100,
    minOrder: 1500,
    description: "Flat ₹100 off on orders above ₹1,500",
  },
  {
    code: "FESTIVE15",
    discountPercent: 15,
    minOrder: 3500,
    description: "15% off on festive orders above ₹3,500",
  },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, subtotal } = useCart();
  const {
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    getSelectedAddress,
    addAddress,
    updateAddress,
    deleteAddress,
  } = useAddress();

  // Navigation redirect if cart is empty
  const isCartEmpty = !cart || cart.length === 0;

  // Address Modal / Form State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressFormData, setAddressFormData] = useState({
    name: "",
    phone: "",
    altPhone: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "Telangana",
    pincode: "",
    type: "HOME",
    isDefault: false,
  });
  const [addressErrors, setAddressErrors] = useState({});

  // Shipping Method
 
  const shippingCost = 149;

  // Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const [orderError, setOrderError] = useState("");

  // Calculate Discounts & Totals
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountFlat) {
      discountAmount = appliedCoupon.discountFlat;
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  // Address Modal Helpers
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressFormData({
      name: "",
      phone: "",
      altPhone: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      state: "Telangana",
      pincode: "",
      type: "HOME",
      isDefault: addresses.length === 0,
    });
    setAddressErrors({});
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr, e) => {
    e.stopPropagation();
    setEditingAddressId(addr.id);
    setAddressFormData({
      name: addr.name,
      phone: addr.phone,
      altPhone: addr.altPhone || "",
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2,
      landmark: addr.landmark || "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      type: addr.type || "HOME",
      isDefault: addr.isDefault || false,
    });
    setAddressErrors({});
    setIsAddressModalOpen(true);
  };

  const validateAddressForm = () => {
    const errors = {};
    if (!addressFormData.name.trim()) errors.name = "Full Name is required";
    if (!addressFormData.phone.trim()) {
      errors.phone = "Mobile Number is required";
    } else if (!/^[6-9]\d{9}$/.test(addressFormData.phone.trim())) {
      errors.phone = "Enter a valid 10-digit Indian mobile number";
    }
    if (addressFormData.altPhone.trim() && !/^[6-9]\d{9}$/.test(addressFormData.altPhone.trim())) {
      errors.altPhone = "Enter a valid 10-digit number";
    }
    if (!addressFormData.pincode.trim()) {
      errors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(addressFormData.pincode.trim())) {
      errors.pincode = "Pincode must be 6 digits";
    }
    if (!addressFormData.addressLine1.trim()) {
      errors.addressLine1 = "Flat / House No. / Building is required";
    }
    if (!addressFormData.addressLine2.trim()) {
      errors.addressLine2 = "Area / Street / Colony is required";
    }
    if (!addressFormData.city.trim()) errors.city = "City is required";
    if (!addressFormData.state.trim()) errors.state = "State is required";

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!validateAddressForm()) return;

    if (editingAddressId) {
      updateAddress(editingAddressId, addressFormData);
    } else {
      addAddress(addressFormData);
    }
    setIsAddressModalOpen(false);
  };

  // Coupon Logic
  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    setCouponError("");
    setCouponSuccess("");

    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    const found = COUPONS.find((c) => c.code === code);
    if (!found) {
      setCouponError("Invalid coupon code. Try 'ELEGANCE10' or 'FIRST100'");
      return;
    }

    if (subtotal < found.minOrder) {
      setCouponError(
        `This coupon requires a minimum cart value of ₹${found.minOrder.toLocaleString()}`
      );
      return;
    }

    setAppliedCoupon(found);
    setCouponSuccess(`Coupon '${found.code}' applied successfully!`);
    setCouponInput("");
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess("");
    setCouponError("");
  };

  const handleProceedToPayment = () => {
    const selectedAddress = getSelectedAddress();
    if (!selectedAddress) {
      setOrderError("Please select or add a delivery address to proceed");
      window.scrollTo({ top: 100, behavior: "smooth" });
      return;
    }

    navigate("/payment", {
      state: {
        discountAmount,
        appliedCouponCode: appliedCoupon?.code || null,
      },
    });
  };

  if (isCartEmpty) {
    return (
      <main className="min-h-[75vh] bg-[#fff8fa] flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-pink-100">
          <h2 className="font-serif text-3xl text-maroon-950 mt-5 font-bold">
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            You don't have any luxury outfits in your cart to checkout.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-maroon-800 hover:bg-maroon-900 text-white font-medium px-7 py-3 rounded-full mt-6 text-sm transition"
          >
            Explore Collection
          </Link>
        </div>
      </main>
    );
  }

  const selectedAddr = getSelectedAddress();

  return (
    <main className="bg-[#fff8fa] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-pink-200/70">
          <div>
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-maroon-800 hover:text-maroon-950 transition mb-2"
            >
              <ArrowLeft size={14} /> Back to Bag
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-950">
              Secure Checkout
            </h1>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5 text-maroon-800 font-semibold">
              <span className="w-6 h-6 rounded-full bg-maroon-800 text-white flex items-center justify-center text-[11px]">
                ✓
              </span>
              <span>Bag</span>
            </div>
            <span className="w-6 h-px bg-pink-300"></span>
            <div className="flex items-center gap-1.5 text-maroon-900 font-bold">
              <span className="w-6 h-6 rounded-full bg-maroon-800 text-white flex items-center justify-center text-[11px]">
                2
              </span>
              <span>Address</span>
            </div>
            <span className="w-6 h-px bg-pink-300"></span>
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="w-6 h-6 rounded-full bg-pink-200 text-gray-500 flex items-center justify-center text-[11px]">
                3
              </span>
              <span>Payment</span>
            </div>
          </div>
        </div>

        {/* Global Error Banner if any */}
        {orderError && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0 text-red-600" />
            <p className="text-sm font-medium">{orderError}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-10 mt-8">
          {/* LEFT COLUMN: Steps (Address + Delivery + Payment) */}
          <div className="space-y-8">
            {/* ============================================================ */}
            {/* STEP 1: DELIVERY ADDRESS (OLD + NEW) */}
            {/* ============================================================ */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-pink-100">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-pink-50 text-maroon-800 flex items-center justify-center font-serif font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-maroon-950">
                      Delivery Address
                    </h2>
                    <p className="text-xs text-gray-500">
                      Select a saved address or add a new delivery destination
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddAddress}
                  className="inline-flex items-center gap-2 bg-pink-50 hover:bg-pink-100 text-maroon-800 text-xs font-semibold py-2.5 px-4 rounded-full transition border border-pink-200"
                >
                  <Plus size={15} /> Add New Address
                </button>
              </div>

              {/* Saved Addresses Grid */}
              {addresses.length === 0 ? (
                <div className="text-center py-8 bg-pink-50/50 rounded-2xl border border-dashed border-pink-200 p-6">
                  <MapPin className="mx-auto text-maroon-700 mb-2" size={32} />
                  <p className="text-sm text-gray-600 font-medium">
                    No addresses found. Add an address to continue.
                  </p>
                  <button
                    onClick={handleOpenAddAddress}
                    className="mt-3 bg-maroon-800 text-white text-xs font-semibold px-5 py-2.5 rounded-full"
                  >
                    + Add New Address
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => {
                    const isSelected = addr.id === selectedAddressId;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`relative rounded-2xl p-5 cursor-pointer transition-all duration-200 border-2 flex flex-col justify-between ${
                          isSelected
                            ? "border-maroon-800 bg-pink-50/40 shadow-md shadow-pink-100"
                            : "border-pink-100 hover:border-pink-300 bg-white"
                        }`}
                      >
                        <div>
                          {/* Card Header with Badges & Radio */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs transition ${
                                  isSelected
                                    ? "bg-maroon-800 border-maroon-800 text-white"
                                    : "border-gray-300 bg-white"
                                }`}
                              >
                                {isSelected && <Check size={12} />}
                              </span>
                              <span className="text-xs font-bold uppercase tracking-wider text-maroon-900 bg-pink-100/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                                {addr.type === "WORK" ? (
                                  <Building2 size={11} />
                                ) : (
                                  <Home size={11} />
                                )}
                                {addr.type}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                  Default
                                </span>
                              )}
                            </div>

                            {/* Actions: Edit & Delete */}
                            <div className="flex items-center gap-1 text-gray-400">
                              <button
                                type="button"
                                onClick={(e) => handleOpenEditAddress(addr, e)}
                                className="p-1.5 hover:text-maroon-800 hover:bg-pink-100/50 rounded-lg transition"
                                title="Edit Address"
                              >
                                <Edit3 size={14} />
                              </button>
                              {addresses.length > 1 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteAddress(addr.id);
                                  }}
                                  className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                  title="Delete Address"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Contact Info */}
                          <p className="font-semibold text-sm text-maroon-950 mt-2">
                            {addr.name}
                          </p>

                          {/* Address Details */}
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed line-clamp-2">
                            {addr.addressLine1}, {addr.addressLine2}
                            {addr.landmark ? `, Near ${addr.landmark}` : ""}
                          </p>
                          <p className="text-xs text-gray-600 font-medium mt-0.5">
                            {addr.city}, {addr.state} -{" "}
                            <span className="font-bold text-maroon-950">
                              {addr.pincode}
                            </span>
                          </p>

                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2.5">
                            <Phone size={12} className="text-maroon-700" />
                            <span>+91 {addr.phone}</span>
                            {addr.altPhone && (
                              <span className="text-gray-400">
                                / +91 {addr.altPhone}
                              </span>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="mt-4 pt-3 border-t border-pink-200/60 flex items-center justify-between text-xs text-maroon-800 font-semibold">
                            <span>Deliver to this Address</span>
                            <CheckCircle2 size={15} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>


         
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: ORDER SUMMARY & PROMO CODES */}
          {/* ============================================================ */}
          <div className="space-y-6">
            {/* Order Items Preview */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100">
              <h3 className="font-serif text-lg font-bold text-maroon-950 mb-4 pb-3 border-b border-pink-100 flex items-center justify-between">
                <span>Items in Order ({cart.length})</span>
                <Link
                  to="/cart"
                  className="text-xs text-maroon-700 hover:underline font-sans font-medium"
                >
                  Edit Bag
                </Link>
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex items-center gap-3 py-2 border-b border-pink-50 last:border-0"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-14 h-16 object-cover rounded-xl bg-pink-50"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-maroon-950 truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Size: <span className="font-medium">{item.size}</span> ·
                        Qty: <span className="font-medium">{item.quantity}</span>
                      </p>
                      <p className="text-xs font-bold text-maroon-800 mt-1">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Code / Voucher Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={16} className="text-maroon-800" />
                <h3 className="font-serif text-base font-bold text-maroon-950">
                  Coupons & Offers
                </h3>
              </div>

              {appliedCoupon ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                      ✓
                    </span>
                    <div>
                      <p className="text-xs font-bold text-emerald-900">
                        {appliedCoupon.code}
                      </p>
                      <p className="text-[10px] text-emerald-700">
                        Saved ₹{discountAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs text-red-600 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter Promo Code"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      className="flex-1 bg-pink-50/40 border border-pink-200 text-maroon-950 text-xs rounded-xl py-2.5 px-3 uppercase outline-none focus:border-maroon-800 transition"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      className="bg-maroon-800 hover:bg-maroon-900 text-white text-xs font-semibold px-4 rounded-xl transition"
                    >
                      Apply
                    </button>
                  </div>

                  {couponError && (
                    <p className="text-[11px] text-red-600 mt-1.5">{couponError}</p>
                  )}
                  {couponSuccess && (
                    <p className="text-[11px] text-emerald-600 mt-1.5 font-medium">
                      {couponSuccess}
                    </p>
                  )}

                  {/* Clickable Quick Coupon suggestions */}
                  <div className="mt-3 pt-3 border-t border-pink-100 flex flex-wrap gap-1.5">
                    {COUPONS.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleApplyCoupon(c.code)}
                        className="text-[10px] font-semibold bg-pink-100/60 hover:bg-pink-100 text-maroon-900 px-2.5 py-1 rounded-full border border-pink-200 transition"
                      >
                        {c.code} ({c.discountPercent ? `${c.discountPercent}%` : `₹${c.discountFlat}`} OFF)
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price Details & Proceed to Payment */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-pink-100 sticky top-28">
              <h3 className="font-serif text-lg font-bold text-maroon-950 mb-5">
                Price Breakdown
              </h3>

              <div className="space-y-3 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Bag Subtotal ({cart.length} items)</span>
                  <span className="font-semibold text-gray-800">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span>- ₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span
                    className={
                      shippingCost === 0
                        ? "text-emerald-700 font-bold"
                        : "font-semibold text-gray-800"
                    }
                  >
                    {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Luxury Box Packaging</span>
                  <span className="text-emerald-700 font-bold">COMPLIMENTARY</span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Estimated GST</span>
                  <span>Included</span>
                </div>

                <div className="h-px bg-pink-100 my-2" />

                <div className="flex justify-between text-base font-bold text-maroon-950 pt-1">
                  <span>Total Amount</span>
                  <span className="text-maroon-800 text-lg">
                    ₹{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Selected Shipping destination quick summary */}
              {selectedAddr && (
                <div className="mt-5 p-3 rounded-xl bg-pink-50/50 border border-pink-100 text-[11px] text-gray-600">
                  <span className="font-bold text-maroon-950 block">
                    Shipping To:
                  </span>
                  <span className="truncate block">
                    {selectedAddr.name}, {selectedAddr.city} ({selectedAddr.pincode})
                  </span>
                </div>
              )}

              {/* PROCEED TO PAYMENT BUTTON */}
              <button
                type="button"
                onClick={handleProceedToPayment}
                className="w-full mt-6 bg-maroon-800 hover:bg-maroon-900 text-white py-4 rounded-full font-semibold text-sm transition shadow-lg shadow-maroon-800/20 flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Payment · ₹{finalTotal.toLocaleString()}</span>
                <ShieldCheck size={18} className="group-hover:scale-110 transition-transform" />
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-pink-100 text-center">
                <div className="flex flex-col items-center">
                  <ShieldCheck size={18} className="text-maroon-700 mb-1" />
                  <span className="text-[10px] font-semibold text-maroon-950">
                    100% Secure Checkout
                  </span>
                  <span className="text-[9px] text-gray-400">
                    SSL Encrypted Payment
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <Truck size={18} className="text-maroon-700 mb-1" />
                  <span className="text-[10px] font-semibold text-maroon-950">
                    7 Days Easy Return
                  </span>
                  <span className="text-[9px] text-gray-400">
                    Hassle-free guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ADDRESS FORM MODAL (ADD / EDIT ADDRESS) */}
      {/* ============================================================ */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[120] bg-maroon-950/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-pink-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-pink-50 hover:bg-pink-100 text-maroon-900 flex items-center justify-center transition"
            >
              <X size={18} />
            </button>

            <div className="mb-6">
              <h3 className="font-serif text-2xl font-bold text-maroon-950">
                {editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Please enter accurate shipping information for smooth delivery
              </p>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
              {/* Name & Phone */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-maroon-900 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ayesha Khan"
                    value={addressFormData.name}
                    onChange={(e) =>
                      setAddressFormData({
                        ...addressFormData,
                        name: e.target.value,
                      })
                    }
                    className="w-full bg-pink-50/40 border border-pink-200 text-maroon-950 text-xs rounded-xl py-2.5 px-3 outline-none focus:border-maroon-800 transition"
                  />
                  {addressErrors.name && (
                    <p className="text-red-600 mt-1">{addressErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-maroon-900 uppercase tracking-wider mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile"
                    value={addressFormData.phone}
                    onChange={(e) =>
                      setAddressFormData({
                        ...addressFormData,
                        phone: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className="w-full bg-pink-50/40 border border-pink-200 text-maroon-950 text-xs rounded-xl py-2.5 px-3 outline-none focus:border-maroon-800 transition"
                  />
                  {addressErrors.phone && (
                    <p className="text-red-600 mt-1">{addressErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Pincode & City */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-maroon-900 uppercase tracking-wider mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="6-digit pincode"
                    value={addressFormData.pincode}
                    onChange={(e) =>
                      setAddressFormData({
                        ...addressFormData,
                        pincode: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className="w-full bg-pink-50/40 border border-pink-200 text-maroon-950 text-xs rounded-xl py-2.5 px-3 outline-none focus:border-maroon-800 transition font-mono"
                  />
                  {addressErrors.pincode && (
                    <p className="text-red-600 mt-1">{addressErrors.pincode}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-maroon-900 uppercase tracking-wider mb-1">
                    City / District *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad"
                    value={addressFormData.city}
                    onChange={(e) =>
                      setAddressFormData({
                        ...addressFormData,
                        city: e.target.value,
                      })
                    }
                    className="w-full bg-pink-50/40 border border-pink-200 text-maroon-950 text-xs rounded-xl py-2.5 px-3 outline-none focus:border-maroon-800 transition"
                  />
                  {addressErrors.city && (
                    <p className="text-red-600 mt-1">{addressErrors.city}</p>
                  )}
                </div>
              </div>

              {/* Flat / House No / Building */}
              <div>
                <label className="block font-semibold text-maroon-900 uppercase tracking-wider mb-1">
                  Flat, House No., Building, Apartment *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 402, Royal Palms Residency"
                  value={addressFormData.addressLine1}
                  onChange={(e) =>
                    setAddressFormData({
                      ...addressFormData,
                      addressLine1: e.target.value,
                    })
                  }
                  className="w-full bg-pink-50/40 border border-pink-200 text-maroon-950 text-xs rounded-xl py-2.5 px-3 outline-none focus:border-maroon-800 transition"
                />
                {addressErrors.addressLine1 && (
                  <p className="text-red-600 mt-1">
                    {addressErrors.addressLine1}
                  </p>
                )}
              </div>

              {/* Area / Street / Colony */}
              <div>
                <label className="block font-semibold text-maroon-900 uppercase tracking-wider mb-1">
                  Area, Colony, Street, Sector *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jubilee Hills, Road No. 36"
                  value={addressFormData.addressLine2}
                  onChange={(e) =>
                    setAddressFormData({
                      ...addressFormData,
                      addressLine2: e.target.value,
                    })
                  }
                  className="w-full bg-pink-50/40 border border-pink-200 text-maroon-950 text-xs rounded-xl py-2.5 px-3 outline-none focus:border-maroon-800 transition"
                />
                {addressErrors.addressLine2 && (
                  <p className="text-red-600 mt-1">
                    {addressErrors.addressLine2}
                  </p>
                )}
              </div>

              {/* Landmark & State */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-maroon-900 uppercase tracking-wider mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near Olive Bistro"
                    value={addressFormData.landmark}
                    onChange={(e) =>
                      setAddressFormData({
                        ...addressFormData,
                        landmark: e.target.value,
                      })
                    }
                    className="w-full bg-pink-50/40 border border-pink-200 text-maroon-950 text-xs rounded-xl py-2.5 px-3 outline-none focus:border-maroon-800 transition"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-maroon-900 uppercase tracking-wider mb-1">
                    State *
                  </label>
                  <select
                    value={addressFormData.state}
                    onChange={(e) =>
                      setAddressFormData({
                        ...addressFormData,
                        state: e.target.value,
                      })
                    }
                    className="w-full bg-pink-50/40 border border-pink-200 text-maroon-950 text-xs rounded-xl py-2.5 px-3 outline-none focus:border-maroon-800 transition"
                  >
                    <option value="Telangana">Telangana</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Punjab">Punjab</option>
                  </select>
                </div>
              </div>

              {/* Address Type selection chips */}
              <div>
                <label className="block font-semibold text-maroon-900 uppercase tracking-wider mb-2">
                  Address Type
                </label>
                <div className="flex gap-2">
                  {["HOME", "WORK", "OTHER"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setAddressFormData({ ...addressFormData, type })
                      }
                      className={`flex-1 py-2 rounded-xl font-semibold border transition text-center ${
                        addressFormData.type === type
                          ? "bg-maroon-800 text-white border-maroon-800 shadow-sm"
                          : "bg-pink-50/50 text-gray-700 border-pink-200 hover:bg-pink-100/50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Default Address Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={addressFormData.isDefault}
                  onChange={(e) =>
                    setAddressFormData({
                      ...addressFormData,
                      isDefault: e.target.checked,
                    })
                  }
                  className="rounded text-maroon-800 focus:ring-maroon-700"
                />
                <span className="text-xs text-gray-700 font-medium">
                  Make this my default delivery address
                </span>
              </label>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-maroon-800 hover:bg-maroon-900 text-white font-semibold shadow-md transition"
                >
                  Save & Deliver Here
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Checkout;
