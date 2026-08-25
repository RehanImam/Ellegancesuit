import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Trash2,
  HeartOff,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

const Wishlist = () => {

  const {
    wishlist,
    toggleWishlist,
    addToCart,
  } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product);
    toggleWishlist(product);
  };

  if (!wishlist.length) {

    return (
      <main className="min-h-[70vh] bg-[#fff8fa] flex items-center justify-center px-4">

        <div className="text-center">

          <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mx-auto">
            <Heart
              size={32}
              className="text-maroon-700"
            />
          </div>

          <h1 className="font-serif text-4xl text-maroon-900 mt-6">
            Your Wishlist is Empty
          </h1>

          <p className="text-gray-500 mt-3">
            Save your favourite pieces to revisit later.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-maroon-800 text-white px-7 py-3 rounded-full mt-6 hover:bg-maroon-900 transition"
          >
            Explore Collection
            <ArrowRight size={17} />
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="bg-[#fff8fa] min-h-screen py-12">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-3 mb-2">
          <Heart size={28} className="text-maroon-800" />
          <h1 className="font-serif text-4xl sm:text-5xl text-maroon-900">
            Your Wishlist
          </h1>
        </div>

        <p className="text-gray-500 mt-2">
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
        </p>

        {/* Wishlist Grid */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">

          {wishlist.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-[28px] overflow-hidden shadow-sm hover:shadow-luxury transition duration-500 group relative"
            >

              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-pink-50">

                <Link to={`/product/${item.id}`}>
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </Link>

                {/* Remove from Wishlist */}
                <button
                  onClick={() => toggleWishlist(item)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md hover:bg-red-50 transition group/btn"
                  title="Remove from Wishlist"
                >
                  <HeartOff
                    size={18}
                    className="text-maroon-700 group-hover/btn:text-red-500 transition-colors"
                  />
                </button>

                {/* Badge */}
                {item.badge && (
                  <span className="absolute top-4 left-4 bg-maroon-800 text-white px-3 py-1 rounded-full text-xs">
                    {item.badge}
                  </span>
                )}

                {/* Quick Add to Cart overlay */}
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="absolute bottom-4 left-4 right-4 bg-maroon-800 text-white py-3 rounded-full translate-y-20 group-hover:translate-y-0 transition duration-500 flex items-center justify-center gap-2 text-sm font-medium hover:bg-maroon-900"
                >
                  <ShoppingBag size={17} />
                  Move to Cart
                </button>

              </div>

              {/* Details */}
              <div className="p-4 sm:p-5">

                <Link to={`/product/${item.id}`}>
                  <h3 className="font-serif text-lg font-semibold text-maroon-900 line-clamp-1 hover:text-maroon-600 transition">
                    {item.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mt-2">

                  <span className="font-semibold text-maroon-800">
                    ₹{item.price.toLocaleString()}
                  </span>

                  {item.oldPrice && (
                    <span className="text-gray-400 line-through text-sm">
                      ₹{item.oldPrice.toLocaleString()}
                    </span>
                  )}

                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-4">

                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-maroon-800 hover:bg-maroon-900 text-white py-2.5 rounded-full text-xs font-medium transition"
                  >
                    <ShoppingBag size={14} />
                    Move to Cart
                  </button>

                  <button
                    onClick={() => toggleWishlist(item)}
                    className="w-10 h-10 flex items-center justify-center border border-pink-200 rounded-full text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition"
                    title="Remove"
                  >
                    <Trash2 size={15} />
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* Continue Shopping CTA */}
        <div className="text-center mt-14">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-maroon-800 hover:text-maroon-900 font-medium transition group"
          >
            Continue Shopping
            <ArrowRight
              size={17}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

      </div>

    </main>
  );
};

export default Wishlist;
