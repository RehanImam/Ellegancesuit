import {
  Heart,
  ShoppingBag,
  Star,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {

  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
  } = useCart();

  return (
    <div className="group product-3d">

      <div className="bg-white rounded-[28px] overflow-hidden shadow-sm hover:shadow-luxury transition duration-500">

        {/* Image */}

        <div className="relative aspect-[4/5] overflow-hidden image-zoom bg-pink-50">

          <Link to={`/product/${product.id}`}>

            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />

          </Link>

          {/* Badge */}

          {product.badge && (
            <span className="absolute top-4 left-4 bg-maroon-800 text-white px-3 py-1 rounded-full text-xs">
              {product.badge}
            </span>
          )}

          {/* Wishlist */}

          <button
            onClick={() =>
              toggleWishlist(product)
            }
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md"
          >
            <Heart
              size={18}
              className={
                isWishlisted(product.id)
                  ? "fill-maroon-700 text-maroon-700"
                  : "text-maroon-700"
              }
            />
          </button>

          {/* Quick Add */}

          <button
            onClick={() =>
              addToCart(product)
            }
            className="absolute bottom-4 left-4 right-4 bg-maroon-800 text-white py-3 rounded-full translate-y-20 group-hover:translate-y-0 transition duration-500 flex items-center justify-center gap-2 text-sm font-medium"
          >
            <ShoppingBag size={17} />
            Add to Cart
          </button>

        </div>

        {/* Details */}

        <div className="p-4 sm:p-5">

          <div className="flex items-center gap-1 text-yellow-500 mb-2">
            <Star
              size={14}
              fill="currentColor"
            />

            <span className="text-xs text-gray-500">
              {product.rating} ({product.reviews})
            </span>
          </div>

          <Link to={`/product/${product.id}`}>

            <h3 className="font-serif text-lg font-semibold text-maroon-900 line-clamp-1 hover:text-maroon-600 transition">
              {product.name}
            </h3>

          </Link>

          <div className="flex items-center gap-2 mt-2">

            <span className="font-semibold text-maroon-800">
              ₹{product.price.toLocaleString()}
            </span>

            <span className="text-gray-400 line-through text-sm">
              ₹{product.oldPrice.toLocaleString()}
            </span>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductCard;