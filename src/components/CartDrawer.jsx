import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

const CartDrawer = ({ isOpen, onClose }) => {

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    subtotal,
    shipping,
    total,
  } = useCart();

  return (
    <>
      {/* Overlay */}

      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-maroon-950/40 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Drawer */}

      <aside
        className={`fixed top-0 right-0 z-[101] h-full w-full sm:w-[430px] bg-[#fff8fa] shadow-2xl transition-transform duration-500 ease-in-out ${
          isOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >

        <div className="h-full flex flex-col">

          {/* Header */}

          <div className="flex items-center justify-between px-5 sm:px-6 py-5 bg-white border-b border-pink-100">

            <div>

              <h2 className="font-serif text-2xl font-semibold text-maroon-900">
                Your Bag
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                {cart.length} item
                {cart.length !== 1 ? "s" : ""}
              </p>

            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-maroon-800 hover:bg-pink-100 transition"
            >
              <X size={20} />
            </button>

          </div>

          {/* Content */}

          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">

            {!cart.length ? (

              /* Empty Cart */

              <div className="h-full flex items-center justify-center text-center">

                <div>

                  <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mx-auto">

                    <ShoppingBag
                      size={32}
                      className="text-maroon-700"
                    />

                  </div>

                  <h3 className="font-serif text-2xl text-maroon-900 mt-5">
                    Your bag is empty
                  </h3>

                  <p className="text-sm text-gray-500 mt-2 max-w-[250px] mx-auto">
                    Looks like you haven't added anything
                    to your bag yet.
                  </p>

                  <Link
                    to="/shop"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 bg-maroon-800 text-white px-6 py-3 rounded-full mt-6 text-sm"
                  >
                    Start Shopping
                    <ArrowRight size={16} />
                  </Link>

                </div>

              </div>

            ) : (

              <div className="space-y-4">

                {cart.map((item) => (

                  <div
                    key={`${item.id}-${item.size}`}
                    className="bg-white rounded-2xl p-3 shadow-sm"
                  >

                    <div className="flex gap-3">

                      {/* Product Image */}

                      <Link
                        to={`/product/${item.id}`}
                        onClick={onClose}
                        className="w-24 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-pink-50"
                      >

                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />

                      </Link>

                      {/* Product Details */}

                      <div className="flex-1 min-w-0">

                        <div className="flex justify-between gap-2">

                          <Link
                            to={`/product/${item.id}`}
                            onClick={onClose}
                            className="font-serif text-base font-semibold text-maroon-900 line-clamp-2"
                          >
                            {item.name}
                          </Link>

                          <button
                            onClick={() =>
                              removeFromCart(
                                item.id,
                                item.size
                              )
                            }
                            className="text-gray-400 hover:text-red-500 flex-shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                        <p className="text-xs text-gray-500 mt-1">
                          Size: {item.size}
                        </p>

                        <div className="flex items-center justify-between mt-4">

                          {/* Quantity */}

                          <div className="flex items-center border border-pink-100 rounded-full bg-pink-50">

                            <button
                              onClick={() =>
                                decreaseQuantity(
                                  item.id,
                                  item.size
                                )
                              }
                              className="p-2 hover:text-maroon-700"
                            >
                              <Minus size={13} />
                            </button>

                            <span className="w-7 text-center text-xs font-medium">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                increaseQuantity(
                                  item.id,
                                  item.size
                                )
                              }
                              className="p-2 hover:text-maroon-700"
                            >
                              <Plus size={13} />
                            </button>

                          </div>

                          {/* Price */}

                          <span className="font-semibold text-sm text-maroon-800">
                            ₹
                            {(
                              item.price *
                              item.quantity
                            ).toLocaleString()}
                          </span>

                        </div>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* Bottom Summary */}

          {cart.length > 0 && (

            <div className="bg-white border-t border-pink-100 px-5 sm:px-6 py-5">

              {/* Free Shipping Message */}

              {subtotal < 2999 && (
                <div className="bg-pink-50 rounded-xl px-4 py-3 mb-4">

                  <p className="text-xs text-maroon-800">

                    Add{" "}

                    <strong>
                      ₹
                      {(2999 - subtotal).toLocaleString()}
                    </strong>{" "}

                    more to get{" "}
                    <strong>FREE SHIPPING</strong> 🎁

                  </p>

                </div>
              )}

              {/* Price */}

              <div className="space-y-3 text-sm">

                <div className="flex justify-between text-gray-600">

                  <span>Subtotal</span>

                  <span>
                    ₹{subtotal.toLocaleString()}
                  </span>

                </div>

                <div className="flex justify-between text-gray-600">

                  <span>Shipping</span>

                  <span className={
                    shipping === 0
                      ? "text-green-600 font-medium"
                      : ""
                  }>

                    {shipping === 0
                      ? "FREE"
                      : `₹${shipping}`}

                  </span>

                </div>

                <div className="h-px bg-pink-100" />

                <div className="flex justify-between text-lg font-semibold text-maroon-900">

                  <span>Total</span>

                  <span>
                    ₹{total.toLocaleString()}
                  </span>

                </div>

              </div>

              {/* Checkout */}

              <Link
                to="/cart"
                onClick={onClose}
                className="mt-5 w-full bg-maroon-800 hover:bg-maroon-900 text-white py-4 rounded-full flex items-center justify-center gap-2 transition shadow-lg shadow-maroon-800/20"
              >

                View Cart & Checkout

                <ArrowRight size={18} />

              </Link>

              <p className="text-center text-[10px] text-gray-400 mt-3">
                Secure checkout · Easy returns · Premium packaging
              </p>

            </div>

          )}

        </div>

      </aside>
    </>
  );
};

export default CartDrawer;