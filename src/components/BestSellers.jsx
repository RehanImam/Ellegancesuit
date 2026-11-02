import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

const BestSellers = () => {
  const scrollRef = useRef(null);
  const { toggleWishlist, isWishlisted, addToCart, mergedProducts } = useCart();

  // Horizontal Scroll Controls
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <h2 className="text-2xl sm:text-3xl font-serif text-center text-[#4a0e17] font-normal mb-8">
          Best Sellers
        </h2>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-md text-gray-700 hover:text-[#4a0e17] transition hover:scale-105"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Product Cards Row */}
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-2 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {mergedProducts.map((product) => {
              const inWishlist = isWishlisted(product.id);

              return (
                <div
                  key={product.id}
                  className="min-w-[220px] sm:min-w-[260px] md:min-w-[280px] max-w-[280px] flex-shrink-0 flex flex-col justify-between group/card bg-white border border-pink-100/70 p-3 rounded-2xl shadow-sm hover:shadow-md transition"
                >
                  <div>
                    {/* Product Image Link */}
                    <div className="relative aspect-[3/4] bg-[#f4f4f4] rounded-xl overflow-hidden mb-3">
                      <Link to={`/product/${product.id}`} className="block w-full h-full">
                        <img
                          src={product.images && product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover object-top group-hover/card:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      {/* Heart / Wishlist Icon */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm text-gray-600 hover:text-[#4a0e17] transition hover:scale-110"
                        aria-label="Wishlist"
                      >
                        <Heart
                          size={16}
                          className={
                            inWishlist
                              ? "fill-[#4a0e17] text-[#4a0e17]"
                              : "text-gray-600 hover:text-[#4a0e17]"
                          }
                        />
                      </button>
                    </div>

                    {/* Product Details Link */}
                    <Link to={`/product/${product.id}`} className="block">
                      <h3 className="text-sm font-serif text-gray-900 font-medium truncate group-hover/card:text-[#4a0e17]">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[#4a0e17] font-bold text-sm">
                          ₹{product.price.toLocaleString()}
                        </p>
                        {product.oldPrice && (
                          <p className="text-gray-400 line-through text-xs">
                            ₹{product.oldPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </Link>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-3 w-full py-2 px-3 bg-[#4a0e17] hover:bg-[#380a11] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ShoppingBag size={13} />
                    Add to Cart
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-md text-gray-700 hover:text-[#4a0e17] transition hover:scale-105"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;