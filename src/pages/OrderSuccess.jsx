import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Phone,
  Printer,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { useAddress } from "../context/AddressContext";


const OrderSuccess = () => {
  const { orderId } = useParams();

  const { orders, getOrderById } = useAddress();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      const found = getOrderById(orderId);
      if (found) {
        setOrder(found);
      } else if (orders.length > 0) {
        // Fallback to most recent order if ID mismatch
        setOrder(orders[0]);
      }
    } else if (orders.length > 0) {
      setOrder(orders[0]);
    }
  }, [orderId, orders, getOrderById]);

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <main className="min-h-[75vh] bg-[#fff8fa] flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl shadow-sm border border-pink-100">
          <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto text-maroon-800">
            <ShoppingBag size={28} />
          </div>
          <h2 className="font-serif text-2xl text-maroon-950 mt-5 font-bold">
            No Recent Order Found
          </h2>
          <p className="text-gray-500 text-xs mt-2">
            You don't have any pending or recent orders in this session.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-maroon-800 hover:bg-maroon-900 text-white font-medium px-6 py-3 rounded-full mt-6 text-xs transition"
          >
            Start Shopping
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    );
  }

  const { items, shippingAddress, paymentMethod, paymentDetails, pricing, createdAt, estimatedDelivery } = order;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="bg-[#fff8fa] min-h-screen py-10 sm:py-14 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Celebration Header Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-pink-100 text-center relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -right-24 w-52 h-52 bg-pink-200/50 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />

          {/* Success Check Icon */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-maroon-900 to-rose-700 text-white flex items-center justify-center mx-auto shadow-xl shadow-maroon-900/20 mb-5 animate-in zoom-in duration-300">
            <CheckCircle2 size={42} strokeWidth={2.5} />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-maroon-900 font-semibold text-xs uppercase tracking-wider mb-2">
            <Sparkles size={13} className="text-maroon-700" />
            Order Confirmed & Placed
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-950 mt-2">
            Thank You for Your Order!
          </h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto mt-2">
            Your luxury order has been received and is now being lovingly prepared by our master artisans at Jannat Elegance.
          </p>

          {/* Order Details Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 pt-6 border-t border-pink-100 text-xs">
            <div className="bg-pink-50/70 border border-pink-200/70 px-4 py-2 rounded-2xl">
              <span className="text-gray-500 block text-[10px] uppercase font-semibold">
                Order ID
              </span>
              <span className="font-bold text-maroon-950 font-mono">
                #{order.orderId}
              </span>
            </div>

            <div className="bg-pink-50/70 border border-pink-200/70 px-4 py-2 rounded-2xl">
              <span className="text-gray-500 block text-[10px] uppercase font-semibold">
                Order Date
              </span>
              <span className="font-semibold text-maroon-950">
                {formattedDate}
              </span>
            </div>

            <div className="bg-pink-50/70 border border-pink-200/70 px-4 py-2 rounded-2xl">
              <span className="text-gray-500 block text-[10px] uppercase font-semibold">
                Estimated Delivery
              </span>
              <span className="font-bold text-emerald-800">
                {estimatedDelivery}
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ORDER TRACKING TIMELINE */}
        {/* ============================================================ */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-pink-100 mt-8">
          <div className="flex items-center justify-between gap-3 mb-6 pb-3 border-b border-pink-100">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-maroon-800" />
              <h2 className="font-serif text-lg font-bold text-maroon-950">
                Delivery Tracker
              </h2>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Status: In Atelier Preparation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {/* Step 1 */}
            <div className="flex sm:flex-col items-center sm:text-center gap-3 relative">
              <div className="w-10 h-10 rounded-full bg-maroon-800 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-maroon-900/20 shrink-0 z-10">
                ✓
              </div>
              <div>
                <p className="text-xs font-bold text-maroon-950">
                  Order Placed
                </p>
                <p className="text-[11px] text-gray-400">Payment Verified</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex sm:flex-col items-center sm:text-center gap-3 relative">
              <div className="w-10 h-10 rounded-full bg-pink-200 text-maroon-900 border-2 border-maroon-800 flex items-center justify-center font-bold text-sm shrink-0 z-10 animate-pulse">
                2
              </div>
              <div>
                <p className="text-xs font-bold text-maroon-950">
                  Quality Inspection
                </p>
                <p className="text-[11px] text-maroon-700 font-medium">
                  In Progress
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex sm:flex-col items-center sm:text-center gap-3 relative opacity-60">
              <div className="w-10 h-10 rounded-full bg-pink-100 text-gray-400 flex items-center justify-center font-bold text-sm shrink-0 z-10">
                3
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700">
                  Dispatched
                </p>
                <p className="text-[11px] text-gray-400">Velvet Packaging</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex sm:flex-col items-center sm:text-center gap-3 relative opacity-60">
              <div className="w-10 h-10 rounded-full bg-pink-100 text-gray-400 flex items-center justify-center font-bold text-sm shrink-0 z-10">
                4
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700">
                  Delivered
                </p>
                <p className="text-[11px] text-gray-400">By {estimatedDelivery}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ORDER DETAILS & SUMMARY GRID */}
        {/* ============================================================ */}
        <div className="grid sm:grid-cols-2 gap-6 mt-8">
          {/* Shipping Address */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-pink-100 text-maroon-950">
              <MapPin size={17} className="text-maroon-800" />
              <h3 className="font-serif text-base font-bold">
                Shipping Address
              </h3>
            </div>

            {shippingAddress && (
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-maroon-950">
                    {shippingAddress.name}
                  </p>
                  <span className="text-[10px] font-bold uppercase bg-pink-100 text-maroon-900 px-2 py-0.5 rounded">
                    {shippingAddress.type || "HOME"}
                  </span>
                </div>
                <p className="pt-1">
                  {shippingAddress.addressLine1}, {shippingAddress.addressLine2}
                </p>
                {shippingAddress.landmark && (
                  <p className="text-gray-500">
                    Landmark: {shippingAddress.landmark}
                  </p>
                )}
                <p className="font-medium text-maroon-900">
                  {shippingAddress.city}, {shippingAddress.state} -{" "}
                  <span className="font-bold">{shippingAddress.pincode}</span>
                </p>
                <div className="flex items-center gap-2 pt-2 text-gray-500">
                  <Phone size={12} className="text-maroon-700" />
                  <span>+91 {shippingAddress.phone}</span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-pink-100 text-maroon-950">
              <ShieldCheck size={17} className="text-maroon-800" />
              <h3 className="font-serif text-base font-bold">
                Payment Summary
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Payment Mode:</span>
                <span className="font-bold text-maroon-950 uppercase">
                  {paymentDetails?.mode || paymentMethod}
                </span>
              </div>

              {paymentDetails?.upiId && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">UPI ID / VPA:</span>
                  <span className="font-mono text-gray-700">
                    {paymentDetails.upiId}
                  </span>
                </div>
              )}

              {paymentDetails?.last4 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Card Used:</span>
                  <span className="font-mono text-gray-700">
                    •••• •••• •••• {paymentDetails.last4}
                  </span>
                </div>
              )}

              {paymentDetails?.bank && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Bank:</span>
                  <span className="font-semibold text-gray-700">
                    {paymentDetails.bank}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Payment Status:</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {paymentMethod === "cod" ? "Pay on Delivery" : "Paid Successfully ✓"}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-pink-100">
                <span className="text-gray-500">Courier Speed:</span>
                <span className="font-medium text-maroon-950">
                  {pricing?.shippingMethod === "express"
                    ? "Express Priority Dispatch (1-2 Days)"
                    : "Standard Shipping (3-5 Days)"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ORDERED ITEMS LIST */}
        {/* ============================================================ */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-pink-100 mt-8">
          <h3 className="font-serif text-lg font-bold text-maroon-950 mb-4 pb-3 border-b border-pink-100 flex items-center justify-between">
            <span>Ordered Items ({items.length})</span>
            <span className="text-xs text-gray-400 font-sans font-normal">
              All items individually inspected
            </span>
          </h3>

          <div className="divide-y divide-pink-100">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="py-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-16 sm:w-20 aspect-[4/5] object-cover rounded-2xl bg-pink-50 border border-pink-100 shadow-sm shrink-0"
                  />
                  <div>
                    <h4 className="font-serif text-sm sm:text-base font-bold text-maroon-950">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: <span className="font-semibold text-maroon-900">{item.size}</span> · Quantity: <span className="font-semibold text-maroon-900">{item.quantity}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Category: {item.category || "Designer Wear"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-sm sm:text-base text-maroon-800">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    ₹{item.price.toLocaleString()} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown Invoice Footnote */}
          <div className="mt-6 pt-5 border-t border-pink-100 space-y-2 text-xs text-gray-600 max-w-sm ml-auto">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-gray-800">
                ₹{pricing?.subtotal?.toLocaleString()}
              </span>
            </div>

            {pricing?.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Coupon Discount ({pricing?.appliedCoupon}):</span>
                <span>- ₹{pricing?.discount?.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping & Handling:</span>
              <span>
                {pricing?.shipping === 0
                  ? "FREE"
                  : `₹${pricing?.shipping?.toLocaleString()}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Luxury Box Packaging:</span>
              <span className="text-emerald-700 font-bold">COMPLIMENTARY</span>
            </div>

            <div className="flex justify-between text-base font-bold text-maroon-950 pt-2 border-t border-pink-100">
              <span>Total Paid:</span>
              <span className="text-maroon-800">
                ₹{pricing?.total?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ACTION BUTTONS */}
        {/* ============================================================ */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-pink-50 text-maroon-900 border border-pink-200 font-semibold px-6 py-3.5 rounded-full text-xs transition shadow-sm"
          >
            <Printer size={16} />
            Print Receipt / Invoice
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/shop"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-maroon-800 hover:bg-maroon-900 text-white font-semibold px-8 py-3.5 rounded-full text-xs transition shadow-lg shadow-maroon-800/20"
            >
              Continue Shopping
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Luxury Support Promise Note */}
        <div className="text-center text-xs text-gray-500 mt-10 print:hidden">
          <p>
            Have special alteration requests or need styling advice? WhatsApp our fashion concierge at{" "}
            <strong className="text-maroon-900">+91 98765 43210</strong>
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            Jannat Elegance · Handcrafted Luxury Suits & Festive Frocks
          </p>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccess;
