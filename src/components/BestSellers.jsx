import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { products } from "../data/products";

const BestSellers = () => {
  const scrollRef = useRef(null);

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
            {products.map((product) => (
              <div
                key={product.id}
                className="min-w-[220px] sm:min-w-[260px] md:min-w-[280px] max-w-[280px] flex-shrink-0 flex flex-col group/card"
              >
                {/* Product Image Link */}
                <div className="relative aspect-[3/4] bg-[#f4f4f4] overflow-hidden mb-3">
                  <Link to={`/product/${product.id}`} className="block w-full h-full">
                    <img
                      src={product.images && product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover object-top group-hover/card:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Heart / Wishlist Icon */}
                  <button
                    className="absolute bottom-3 right-3 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm text-gray-600 hover:text-[#4a0e17] transition"
                    aria-label="Wishlist"
                  >
                    <Heart size={16} />
                  </button>
                </div>

                {/* Product Details Link */}
                <Link to={`/product/${product.id}`} className="block">
                  <h3 className="text-sm font-serif text-gray-900 font-medium truncate group-hover/card:text-[#4a0e17]">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1 min-h-[32px]">
                    {product.description}
                  </p>
                </Link>
              </div>
            ))}
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