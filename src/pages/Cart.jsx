import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

const Cart = () => {

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    subtotal,
    shipping,
    total,
  } = useCart();

  if (!cart.length) {

    return (
      <main className="min-h-[70vh] bg-[#fff8fa] flex items-center justify-center px-4">

        <div className="text-center">

          <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mx-auto">
            <ShoppingBag
              size={32}
              className="text-maroon-700"
            />
          </div>

          <h1 className="font-serif text-4xl text-maroon-900 mt-6">
            Your Bag is Empty
          </h1>

          <p className="text-gray-500 mt-3">
            Discover something beautiful for yourself.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-maroon-800 text-white px-7 py-3 rounded-full mt-6"
          >
            Start Shopping
            <ArrowRight size={17} />
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="bg-[#fff8fa] min-h-screen py-12">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <h1 className="font-serif text-4xl sm:text-5xl text-maroon-900">
          Your Shopping Bag
        </h1>

        <p className="text-gray-500 mt-2">
          {cart.length} item types in your bag
        </p>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 mt-10">

          {/* ITEMS */}

          <div className="space-y-4">

            {cart.map((item) => (

              <div
                key={`${item.id}-${item.size}`}
                className="bg-white rounded-[25px] p-4 sm:p-5 flex gap-4"
              >

                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-24 sm:w-32 aspect-[4/5] object-cover rounded-2xl"
                />

                <div className="flex-1">

                  <div className="flex justify-between gap-2">

                    <div>

                      <Link
                        to={`/product/${item.id}`}
                        className="font-serif text-lg sm:text-xl text-maroon-900"
                      >
                        {item.name}
                      </Link>

                      <p className="text-sm text-gray-500 mt-1">
                        Size: {item.size}
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(
                          item.id,
                          item.size
                        )
                      }
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                  <div className="flex items-center justify-between mt-5">

                    <div className="flex items-center border border-pink-100 rounded-full">

                      <button
                        onClick={() =>
                          decreaseQuantity(
                            item.id,
                            item.size
                          )
                        }
                        className="p-2"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(
                            item.id,
                            item.size
                          )
                        }
                        className="p-2"
                      >
                        <Plus size={14} />
                      </button>

                    </div>

                    <strong className="text-maroon-800">
                      ₹
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString()}
                    </strong>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* SUMMARY */}

          <div className="bg-white rounded-[30px] p-6 sm:p-8 h-fit lg:sticky lg:top-28">

            <h2 className="font-serif text-2xl text-maroon-900">
              Order Summary
            </h2>

            <div className="space-y-4 mt-7">

              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>
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

            <Link
              to="/checkout"
              className="w-full mt-7 bg-maroon-800 hover:bg-maroon-900 text-white py-4 rounded-full font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-maroon-800/20 group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <p className="text-center text-xs text-gray-400 mt-4">
              Secure checkout · Easy returns
            </p>

          </div>

        </div>

      </div>

    </main>
  );
};

export default Cart;