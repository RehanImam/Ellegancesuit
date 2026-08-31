import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Loader2,
  Eye,
  X,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const OrdersSection = ({ activeTab, setActiveTab }) => {
  const { getOrderHistory, cancelOrder } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrderHistory();
      setOrders(response.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (
      !window.confirm("Are you sure you want to cancel this order?")
    )
      return;

    try {
      setCancellingOrderId(orderId);
      await cancelOrder(orderId);
      setSuccess("Order cancelled successfully!");
      await fetchOrders();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to cancel order");
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "text-emerald-600 bg-emerald-50";
      case "SHIPPED":
        return "text-blue-600 bg-blue-50";
      case "CONFIRMED":
        return "text-blue-600 bg-blue-50";
      case "CANCELLED":
        return "text-red-600 bg-red-50";
      case "PENDING":
        return "text-amber-600 bg-amber-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "text-emerald-600 bg-emerald-50";
      case "FAILED":
        return "text-red-600 bg-red-50";
      case "REFUNDED":
        return "text-amber-600 bg-amber-50";
      case "PENDING":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const canCancelOrder = (order) => {
    return !["SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"].includes(
      order.orderStatus
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm tracking-wider uppercase text-gray-900">
          MY ORDERS
        </h3>
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

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <ShoppingBag size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600 text-sm">No orders yet</p>
          <p className="text-gray-500 text-xs mt-1">
            Start shopping to see your orders here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-gray-300 transition-colors"
            >
              {/* Order Header */}
              <button
                onClick={() =>
                  setExpandedOrderId(
                    expandedOrderId === order._id ? null : order._id
                  )
                }
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1 text-left">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-semibold text-gray-900">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h4>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {formatDate(order.orderDate)} • {order.items.length} item
                      {order.items.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      ₹{order.total?.toFixed(2)}
                    </p>
                    {order.estimatedDelivery && (
                      <p className="text-xs text-gray-600 mt-1">
                        Est. {formatDate(order.estimatedDelivery)}
                      </p>
                    )}
                  </div>
                </div>

                {expandedOrderId === order._id ? (
                  <ChevronUp size={18} className="text-gray-400 ml-2" />
                ) : (
                  <ChevronDown size={18} className="text-gray-400 ml-2" />
                )}
              </button>

              {/* Order Details (Expanded) */}
              {expandedOrderId === order._id && (
                <div className="border-t border-gray-200 p-4 space-y-4 bg-gray-50">
                  {/* Items */}
                  <div>
                    <h5 className="text-xs font-semibold text-gray-900 mb-3">
                      ORDER ITEMS
                    </h5>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-xs bg-white p-2 rounded border border-gray-100"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {item.productName}
                            </p>
                            <p className="text-gray-600">
                              Size: {item.size} • Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            ₹{item.totalPrice?.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-white p-3 rounded border border-gray-100 text-xs space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{order.subtotal?.toFixed(2)}</span>
                    </div>
                    {order.shippingCost > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>₹{order.shippingCost?.toFixed(2)}</span>
                      </div>
                    )}
                    {order.tax > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Tax (GST)</span>
                        <span>₹{order.tax?.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-900">
                      <span>Total</span>
                      <span>₹{order.total?.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h5 className="text-xs font-semibold text-gray-900 mb-2">
                      SHIPPING ADDRESS
                    </h5>
                    <div className="bg-white p-3 rounded border border-gray-100 text-xs text-gray-600">
                      <p className="font-medium text-gray-900 mb-1">
                        {order.shippingAddress?.firstName}{" "}
                        {order.shippingAddress?.lastName}
                      </p>
                      <p>{order.shippingAddress?.street}</p>
                      <p>
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.state}{" "}
                        {order.shippingAddress?.pincode}
                      </p>
                      <p>{order.shippingAddress?.country}</p>
                      <p className="mt-1">
                        Ph: {order.shippingAddress?.phoneNumber}
                      </p>
                    </div>
                  </div>

                  {/* Payment & Delivery Info */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded border border-gray-100">
                      <p className="text-gray-600 mb-1">Payment Method</p>
                      <p className="font-semibold text-gray-900">
                        {order.paymentMethod?.replace("_", " ")}
                      </p>
                    </div>
                    {order.deliveredDate && (
                      <div className="bg-white p-3 rounded border border-gray-100">
                        <p className="text-gray-600 mb-1">Delivered On</p>
                        <p className="font-semibold text-emerald-600">
                          {formatDate(order.deliveredDate)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    {canCancelOrder(order) && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingOrderId === order._id}
                        className="flex items-center gap-1 border border-red-300 text-red-600 px-3 py-2 rounded text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {cancellingOrderId === order._id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <X size={12} />
                        )}
                        Cancel Order
                      </button>
                    )}
                    {order.orderStatus === "DELIVERED" && (
                      <button className="flex items-center gap-1 border border-blue-300 text-blue-600 px-3 py-2 rounded text-xs font-semibold hover:bg-blue-50 transition-colors">
                        <AlertCircle size={12} />
                        Request Return
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersSection;
