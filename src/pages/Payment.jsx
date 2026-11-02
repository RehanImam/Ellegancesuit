import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  QrCode,
  CreditCard,
  Building2,
  Banknote,
  Package,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAddress } from "../context/AddressContext";

const POPULAR_BANKS = [
  { id: "hdfc", name: "HDFC Bank", short: "HDFC" },
  { id: "icici", name: "ICICI Bank", short: "ICICI" },
  { id: "sbi", name: "State Bank of India", short: "SBI" },
  { id: "axis", name: "Axis Bank", short: "AXIS" },
  { id: "kotak", name: "Kotak Mahindra", short: "KOTAK" },
];

const OTHER_BANKS = [
  "Bank of Baroda",
  "Punjab National Bank",
  "Union Bank of India",
  "Canara Bank",
  "IndusInd Bank",
  "Federal Bank",
  "IDBI Bank",
  "Yes Bank",
];

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, subtotal, clearCart } = useCart();
  const { getSelectedAddress, createOrder } = useAddress();
  const { discountAmount = 0, appliedCouponCode = null } = location.state || {};
  const shippingCost = 149;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const [paymentMethod, setPaymentMethod] = useState("upi"); // 'upi' | 'card' | 'netbanking' | 'cod'

  // UPI States
  const [upiOption, setUpiOption] = useState("id"); // 'id' | 'qr'
  const [upiId, setUpiId] = useState("");
  const [isUpiVerified, setIsUpiVerified] = useState(false);
  const [upiError, setUpiError] = useState("");
  const [orderError, setOrderError] = useState("");

  // Card States
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [cardErrors, setCardErrors] = useState({});

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState("hdfc");

  // COD States
  const [codCaptcha, setCodCaptcha] = useState("");
  const [generatedCaptcha] = useState(() =>
    Math.floor(1000 + Math.random() * 9000).toString()
  );
  const [codError, setCodError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
    setCardData({ ...cardData, number: formatted });
    if (cardErrors.number) setCardErrors({ ...cardErrors, number: null });
  };

  const handleCardExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    setCardData({ ...cardData, expiry: value });
    if (cardErrors.expiry) setCardErrors({ ...cardErrors, expiry: null });
  };

  const handleCardCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCardData({ ...cardData, cvv: value });
    if (cardErrors.cvv) setCardErrors({ ...cardErrors, cvv: null });
  };

  const verifyUpi = () => {
    setUpiError("");
    if (!upiId.trim()) {
      setUpiError("Enter your UPI ID");
      setIsUpiVerified(false);
      return;
    }
    if (!upiId.includes("@")) {
      setUpiError("Enter a valid UPI ID (e.g. mobile@upi or name@oksbi)");
      setIsUpiVerified(false);
      return;
    }
    setIsUpiVerified(true);
  };

  // Validate Payment Method before Order Creation (Can be exposed via ref or lifted state if needed by parent)
  const validatePayment = () => {
    setOrderError("");

    if (paymentMethod === "upi") {
      if (upiOption === "id") {
        if (!upiId.trim() || !upiId.includes("@")) {
          setUpiError("Please enter and verify a valid UPI ID");
          return false;
        }
      }
      return true;
    }

    if (paymentMethod === "card") {
      const errors = {};
      const rawNumber = cardData.number.replace(/\s/g, "");
      if (rawNumber.length < 15) {
        errors.number = "Enter a valid 16-digit card number";
      }
      if (!cardData.name.trim()) {
        errors.name = "Enter cardholder name";
      }
      if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
        errors.expiry = "Use MM/YY format";
      }
      if (cardData.cvv.length < 3) {
        errors.cvv = "Enter 3 or 4 digit CVV";
      }
      setCardErrors(errors);
      return Object.keys(errors).length === 0;
    }

    if (paymentMethod === "cod") {
      if (codCaptcha.trim() !== generatedCaptcha) {
        setCodError("Incorrect verification code");
        return false;
      }
      setCodError("");
      return true;
    }

    return true;
  };

  const handlePlaceOrder = () => {
    const selectedAddress = getSelectedAddress();
    setOrderError("");

    if (!selectedAddress) {
      setOrderError("Please return to checkout and select a delivery address");
      return;
    }

    if (!validatePayment()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      let paymentDetails = {};
      if (paymentMethod === "upi") {
        paymentDetails = { upiId: upiOption === "id" ? upiId : "QR_SCAN_SIMULATED", mode: "UPI" };
      } else if (paymentMethod === "card") {
        paymentDetails = {
          last4: cardData.number.slice(-4),
          cardholder: cardData.name,
          mode: "Credit / Debit Card",
        };
      } else if (paymentMethod === "netbanking") {
        paymentDetails = { bank: selectedBank.toUpperCase(), mode: "Net Banking" };
      } else {
        paymentDetails = { mode: "Cash on Delivery", status: "Payable on Delivery" };
      }

      const createdOrder = createOrder({
        items: cart,
        address: selectedAddress,
        paymentMethod,
        paymentDetails,
        pricing: {
          subtotal,
          discount: discountAmount,
          shipping: shippingCost,
          total: finalTotal,
          appliedCoupon: appliedCouponCode,
        },
      });

      clearCart();
      navigate(`/order-success/${createdOrder.orderId}`);
    }, 1500);
  };

  if (!cart || cart.length === 0) {
    return (
      <main className="min-h-[75vh] bg-[#fff8fa] flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl shadow-sm border border-pink-100">
          <Package size={28} className="mx-auto text-maroon-700" />
          <h2 className="font-serif text-2xl text-maroon-950 mt-5 font-bold">Your Cart is Empty</h2>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-maroon-800 text-white px-6 py-3 rounded-full mt-6 text-xs">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#fff8fa] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-pink-200/70">
        <div>
          <Link to="/checkout" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-maroon-800 mb-2">
            <ArrowLeft size={14} /> Back to Address
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-950">Secure Payment</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-medium">
          <span className="text-maroon-800">1. Bag</span>
          <span className="w-6 h-px bg-pink-300" />
          <span className="text-maroon-800">2. Address</span>
          <span className="w-6 h-px bg-pink-300" />
          <span className="font-bold text-maroon-900">3. Payment</span>
        </div>
      </div>

      {orderError && <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">{orderError}</div>}

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 mt-8">
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-pink-100">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-50 text-maroon-800 flex items-center justify-center font-serif font-bold text-lg">
            3
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-maroon-950">
              Payment Method
            </h2>
            <p className="text-xs text-gray-500">
              100% Encrypted & Safe Payments
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {/* 1. UPI */}
        <button
          type="button"
          onClick={() => setPaymentMethod("upi")}
          className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 border transition ${
            paymentMethod === "upi"
              ? "border-maroon-800 bg-maroon-800 text-white shadow-md shadow-maroon-900/10"
              : "border-pink-100 bg-pink-50/40 text-gray-700 hover:bg-pink-100/50"
          }`}
        >
          <QrCode size={20} />
          <span className="text-xs font-semibold">UPI / QR</span>
        </button>

        {/* 2. Cards */}
        <button
          type="button"
          onClick={() => setPaymentMethod("card")}
          className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 border transition ${
            paymentMethod === "card"
              ? "border-maroon-800 bg-maroon-800 text-white shadow-md shadow-maroon-900/10"
              : "border-pink-100 bg-pink-50/40 text-gray-700 hover:bg-pink-100/50"
          }`}
        >
          <CreditCard size={20} />
          <span className="text-xs font-semibold">Cards</span>
        </button>

        {/* 3. Net Banking */}
        <button
          type="button"
          onClick={() => setPaymentMethod("netbanking")}
          className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 border transition ${
            paymentMethod === "netbanking"
              ? "border-maroon-800 bg-maroon-800 text-white shadow-md shadow-maroon-900/10"
              : "border-pink-100 bg-pink-50/40 text-gray-700 hover:bg-pink-100/50"
          }`}
        >
          <Building2 size={20} />
          <span className="text-xs font-semibold">Net Banking</span>
        </button>

        {/* 4. COD */}
        <button
          type="button"
          onClick={() => setPaymentMethod("cod")}
          className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 border transition ${
            paymentMethod === "cod"
              ? "border-maroon-800 bg-maroon-800 text-white shadow-md shadow-maroon-900/10"
              : "border-pink-100 bg-pink-50/40 text-gray-700 hover:bg-pink-100/50"
          }`}
        >
          <Banknote size={20} />
          <span className="text-xs font-semibold">Cash On Delivery</span>
        </button>
      </div>

      {/* Payment Method Content Forms */}
      <div className="bg-pink-50/30 rounded-2xl p-5 border border-pink-100">
        
        {/* --- TAB 1: UPI & QR CODE --- */}
        {paymentMethod === "upi" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 border-b border-pink-200/60 pb-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-maroon-950">
                <input
                  type="radio"
                  name="upi_option"
                  checked={upiOption === "id"}
                  onChange={() => setUpiOption("id")}
                  className="text-maroon-800 focus:ring-maroon-700"
                />
                <span>Enter UPI ID / VPA</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-maroon-950">
                <input
                  type="radio"
                  name="upi_option"
                  checked={upiOption === "qr"}
                  onChange={() => setUpiOption("qr")}
                  className="text-maroon-800 focus:ring-maroon-700"
                />
                <span>Instant QR Code Scan</span>
              </label>
            </div>

            {upiOption === "id" ? (
              <div>
                <label className="block text-xs font-semibold text-maroon-900 uppercase tracking-wider mb-2">
                  UPI ID / Virtual Payment Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. mobile@upi or name@oksbi"
                    value={upiId}
                    onChange={(e) => {
                      setUpiId(e.target.value);
                      setIsUpiVerified(false);
                      setUpiError("");
                    }}
                    className="flex-1 bg-white border border-pink-200 text-maroon-950 text-sm rounded-xl py-3 px-4 outline-none focus:border-maroon-800 transition"
                  />
                  <button
                    type="button"
                    onClick={verifyUpi}
                    className={`px-5 py-3 rounded-xl text-xs font-semibold transition ${
                      isUpiVerified
                        ? "bg-emerald-700 text-white"
                        : "bg-maroon-800 hover:bg-maroon-900 text-white"
                    }`}
                  >
                    {isUpiVerified ? "Verified ✓" : "Verify UPI"}
                  </button>
                </div>
                {upiError && (
                  <p className="text-xs text-red-600 mt-1.5">{upiError}</p>
                )}

                <div className="flex items-center gap-2 mt-4 text-[11px] text-gray-500">
                  <span>Supported apps:</span>
                  <span className="font-semibold text-gray-700">
                    Google Pay · PhonePe · Paytm · BHIM · CRED
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl border border-pink-200 shadow-inner flex flex-col items-center justify-center">
                  <QrCode size={130} className="text-maroon-950" />
                  <span className="text-[10px] text-gray-400 mt-1">
                    Scan with any UPI App
                  </span>
                </div>
                <p className="text-xs font-semibold text-maroon-900 mt-3">
                  Total to pay: ₹{finalTotal.toLocaleString()}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Open your camera or UPI app (PhonePe/GPay/Paytm) to scan
                </p>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 2: CREDIT / DEBIT CARDS --- */}
        {paymentMethod === "card" && (
          <div className="space-y-4">
            <div className="bg-gradient-to-tr from-maroon-950 via-maroon-900 to-rose-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden max-w-sm mx-auto mb-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium tracking-widest text-pink-200">
                  JANNAT ELEGANCE CARD
                </span>
                <CreditCard size={24} className="text-pink-300" />
              </div>

              <div className="mt-5">
                <div className="text-lg sm:text-xl font-mono tracking-wider">
                  {cardData.number || "•••• •••• •••• ••••"}
                </div>
              </div>

              <div className="flex justify-between items-end mt-4 text-xs">
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-pink-300">
                    Cardholder
                  </div>
                  <div className="font-semibold uppercase tracking-wide">
                    {cardData.name || "YOUR NAME"}
                  </div>
                </div>

                <div>
                  <div className="text-[9px] uppercase tracking-wider text-pink-300">
                    Expires
                  </div>
                  <div className="font-semibold">
                    {cardData.expiry || "MM/YY"}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-maroon-900 uppercase tracking-wider mb-1.5">
                Card Number
              </label>
              <input
                type="text"
                placeholder="4532 8920 1234 5678"
                value={cardData.number}
                onChange={handleCardNumberChange}
                className="w-full bg-white border border-pink-200 text-maroon-950 text-sm rounded-xl py-3 px-4 outline-none focus:border-maroon-800 transition font-mono"
              />
              {cardErrors.number && (
                <p className="text-xs text-red-600 mt-1">{cardErrors.number}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-maroon-900 uppercase tracking-wider mb-1.5">
                Name on Card
              </label>
              <input
                type="text"
                placeholder="As printed on card"
                value={cardData.name}
                onChange={(e) =>
                  setCardData({ ...cardData, name: e.target.value })
                }
                className="w-full bg-white border border-pink-200 text-maroon-950 text-sm rounded-xl py-3 px-4 outline-none focus:border-maroon-800 transition"
              />
              {cardErrors.name && (
                <p className="text-xs text-red-600 mt-1">{cardErrors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-maroon-900 uppercase tracking-wider mb-1.5">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardData.expiry}
                  onChange={handleCardExpiryChange}
                  className="w-full bg-white border border-pink-200 text-maroon-950 text-sm rounded-xl py-3 px-4 outline-none focus:border-maroon-800 transition text-center"
                />
                {cardErrors.expiry && (
                  <p className="text-xs text-red-600 mt-1">
                    {cardErrors.expiry}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-maroon-900 uppercase tracking-wider mb-1.5">
                  CVV / CVC
                </label>
                <input
                  type="password"
                  placeholder="•••"
                  value={cardData.cvv}
                  onChange={handleCardCvvChange}
                  maxLength={4}
                  className="w-full bg-white border border-pink-200 text-maroon-950 text-sm rounded-xl py-3 px-4 outline-none focus:border-maroon-800 transition text-center"
                />
                {cardErrors.cvv && (
                  <p className="text-xs text-red-600 mt-1">{cardErrors.cvv}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: NET BANKING --- */}
        {paymentMethod === "netbanking" && (
          <div className="space-y-4">
            <label className="block text-xs font-semibold text-maroon-900 uppercase tracking-wider mb-1.5">
              Popular Banks
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {POPULAR_BANKS.map((bank) => (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => setSelectedBank(bank.id)}
                  className={`p-3 rounded-xl border text-sm font-medium transition ${
                    selectedBank === bank.id
                      ? "border-maroon-800 bg-maroon-50 text-maroon-900"
                      : "border-pink-200 bg-white text-gray-700 hover:border-maroon-300"
                  }`}
                >
                  {bank.short}
                </button>
              ))}
            </div>
            
            <div className="mt-4">
              <label className="block text-xs font-semibold text-maroon-900 uppercase tracking-wider mb-1.5">
                Other Banks
              </label>
              <select
                value={OTHER_BANKS.includes(selectedBank) ? selectedBank : ""}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full bg-white border border-pink-200 text-maroon-950 text-sm rounded-xl py-3 px-4 outline-none focus:border-maroon-800 transition"
              >
                <option value="" disabled>Select your bank</option>
                {OTHER_BANKS.map((bank, index) => (
                  <option key={index} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* --- TAB 4: CASH ON DELIVERY (COD) --- */}
        {paymentMethod === "cod" && (
          <div className="space-y-4">
             <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
              <Banknote className="text-amber-600 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-medium text-amber-900">
                  Pay on Delivery
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  You can pay via Cash or UPI when your luxury order arrives at your doorstep.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-maroon-900 uppercase tracking-wider mb-1.5">
                Verify Purchase
              </label>
              <p className="text-xs text-gray-600 mb-2">
                Please enter the code shown below to confirm your cash on delivery order:
              </p>
              <div className="flex gap-3">
                <div className="flex-shrink-0 bg-maroon-100 border border-maroon-200 text-maroon-900 font-mono font-bold text-lg tracking-widest px-4 py-2 rounded-xl flex items-center justify-center select-none line-through decoration-maroon-300">
                  {generatedCaptcha}
                </div>
                <input
                  type="text"
                  placeholder="Enter code"
                  value={codCaptcha}
                  onChange={(e) => {
                    setCodCaptcha(e.target.value);
                    setCodError("");
                  }}
                  maxLength={4}
                  className="flex-1 bg-white border border-pink-200 text-maroon-950 text-sm rounded-xl py-2 px-4 outline-none focus:border-maroon-800 transition font-mono"
                />
              </div>
              {codError && (
                <p className="text-xs text-red-600 mt-2">{codError}</p>
              )}
            </div>
          </div>
        )}
      </div>
      </section>

      <aside className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-pink-100 h-fit lg:sticky lg:top-28">
        <h2 className="font-serif text-lg font-bold text-maroon-950 mb-5">Payment Summary</h2>
        <div className="space-y-3 text-xs text-gray-600">
          <div className="flex justify-between"><span>Bag Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          {discountAmount > 0 && <div className="flex justify-between text-emerald-700"><span>Coupon Discount</span><span>- ₹{discountAmount.toLocaleString()}</span></div>}
          <div className="flex justify-between"><span>Delivery Charges</span><span>₹{shippingCost}</span></div>
          <div className="h-px bg-pink-100" />
          <div className="flex justify-between text-base font-bold text-maroon-950"><span>Total Amount</span><span>₹{finalTotal.toLocaleString()}</span></div>
        </div>
        <button type="button" onClick={handlePlaceOrder} disabled={isSubmitting} className="w-full mt-6 bg-maroon-800 hover:bg-maroon-900 disabled:bg-maroon-300 text-white py-4 rounded-full font-semibold text-sm transition flex items-center justify-center gap-2">
          {isSubmitting ? "Processing Secure Order..." : <>Place Order · ₹{finalTotal.toLocaleString()} <ShieldCheck size={18} /></>}
        </button>
      </aside>
      </div>
      </div>
    </main>
  );
}