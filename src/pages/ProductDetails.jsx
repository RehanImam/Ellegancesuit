import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((item) => item.id === Number(id));

  const { addToCart, toggleWishlist, isWishlisted } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found.
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize);
    }
  };

  return (
    <main className="bg-[#fff8fa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-maroon-800 mb-8"
        >
          <ArrowLeft size={16} />
          Back to shopping
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          {/* LEFT IMAGE SECTION */}
          <div className="flex flex-col gap-4 w-full">
            {/* MAIN IMAGE */}
            <div className="relative w-full">
              <div className="aspect-[4/5] w-full rounded-[30px] overflow-hidden bg-pink-50 shadow-luxury image-zoom">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg z-10"
              >
                <Heart
                  className={
                    isWishlisted(product.id)
                      ? "fill-maroon-700 text-maroon-700"
                      : "text-maroon-700"
                  }
                />
              </button>
            </div>

            {/* THUMBNAILS AT THE BOTTOM */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide w-full">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === index
                      ? "border-maroon-700"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT DETAILS */}
          <div className="lg:py-5">
            <span className="inline-block bg-pink-100 text-maroon-800 px-4 py-1.5 rounded-full text-xs font-medium">
              {product.badge}
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl text-maroon-900 mt-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-5">
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    fill={
                      star <= Math.round(product.rating)
                        ? "currentColor"
                        : "none"
                    }
                  />
                ))}
              </div>

              <span className="text-sm text-gray-500">
                {product.rating} · {product.reviews} reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mt-6">
              <span className="text-3xl font-semibold text-maroon-800">
                ₹{product.price.toLocaleString()}
              </span>

              <span className="text-gray-400 line-through">
                ₹{product.oldPrice.toLocaleString()}
              </span>

              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                {Math.round(
                  ((product.oldPrice - product.price) / product.oldPrice) * 100
                )}
                % OFF
              </span>
            </div>

            <p className="text-gray-600 leading-7 mt-6">
              {product.description}
            </p>

            <div className="h-px bg-pink-100 my-7" />

            {/* Size */}
            <div>
              <div className="flex justify-between mb-3">
                <span className="font-semibold text-maroon-900">
                  Select Size
                </span>

                <button className="text-sm text-maroon-700 underline">
                  Size Guide
                </button>
              </div>

              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-full border transition ${
                      selectedSize === size
                        ? "bg-maroon-800 text-white border-maroon-800"
                        : "bg-white border-pink-200 text-maroon-800 hover:border-maroon-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-7">
              <span className="font-semibold text-maroon-900">Quantity</span>

              <div className="flex items-center mt-3 border border-pink-200 bg-white rounded-full w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3"
                >
                  <Minus size={16} />
                </button>

                <span className="w-10 text-center font-medium font-sans">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid sm:grid-cols-2 gap-3 mt-8">
              <button
                onClick={handleAddToCart}
                className="bg-maroon-800 hover:bg-maroon-900 text-white rounded-full py-4 flex items-center justify-center gap-2 transition shadow-lg"
              >
                <ShoppingBag size={19} />
                Add to Cart
              </button>

              <Link
                to="/cart"
                onClick={handleAddToCart}
                className="border border-maroon-800 text-maroon-800 hover:bg-maroon-50 rounded-full py-4 flex items-center justify-center transition"
              >
                Buy Now
              </Link>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-3 mt-8">
              <div className="bg-white rounded-2xl p-4 text-center">
                <p className="text-xs font-semibold text-maroon-900">
                  Free Shipping
                </p>
                <p className="text-[10px] text-gray-500 mt-1">
                  Above ₹2999
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 text-center">
                <p className="text-xs font-semibold text-maroon-900">
                  Easy Returns
                </p>
                <p className="text-[10px] text-gray-500 mt-1">7 Days</p>
              </div>

              <div className="bg-white rounded-2xl p-4 text-center">
                <p className="text-xs font-semibold text-maroon-900">
                  Secure
                </p>
                <p className="text-[10px] text-gray-500 mt-1">Payments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;