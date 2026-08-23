

import { useMemo, useState } from "react";
import { SlidersHorizontal, ShoppingBag, Heart, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { products } from "../data/products";

const Shop = () => {
  const navigate = useNavigate(); // Navigation hook
  const [sort, setSort] = useState("featured");
  const [wishlist, setWishlist] = useState([]);

  // Wishlist toggle handler
  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const sortedProducts = useMemo(() => {
    let result = [...products];

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [sort]);

  return (
    <main className="bg-[#fff8fa] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Controls: Back Button & Sort Dropdown */}
        <div className="flex items-center justify-between mb-6">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#4a0e17] hover:text-[#380a11] font-semibold text-xs uppercase tracking-wider bg-white border border-pink-200 px-4 py-3 transition shadow-sm hover:shadow"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {/* Sort Filter Dropdown */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-white border border-pink-200 text-[#4a0e17] rounded-none px-6 py-3 pr-10 text-xs font-semibold uppercase tracking-wider outline-none cursor-pointer focus:border-[#4a0e17]"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <SlidersHorizontal
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#4a0e17]"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sortedProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);

            return (
              <div
                key={product.id}
                className="bg-white border border-pink-100 rounded-none overflow-hidden group flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300 relative"
              >
                {/* Product Image Frame */}
                <div className="w-full aspect-[3/4] relative overflow-hidden bg-gray-50 block">
                  <Link to={`/product/${product.id}`} className="w-full h-full block">
                    <img
                      src={product.images && product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Wishlist Button (White Circle + Maroon Heart) */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 bg-white border border-gray-900 rounded-full flex items-center justify-center transition-all duration-300 shadow-md z-10 hover:scale-105"
                    aria-label="Add to Wishlist"
                  >
                    <Heart
                      size={18}
                      className={`transition-colors duration-300 ${
                        isWishlisted
                          ? "fill-[#4a0e17] text-[#4a0e17]"
                          : "text-gray-700 hover:text-[#4a0e17]"
                      }`}
                    />
                  </button>
                </div>

                {/* Product Info & Add To Cart Button */}
                <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-serif text-sm sm:text-base text-[#4a0e17] truncate font-medium">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[#4a0e17] font-bold text-sm sm:text-base">
                        ₹{product.price}
                      </p>
                      {product.oldPrice && (
                        <p className="text-gray-400 line-through text-xs sm:text-sm">
                          ₹{product.oldPrice}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Added ${product.name} to cart!`)}
                    className="
                      mt-3
                      w-full
                      py-2.5
                      px-3
                      bg-[#4a0e17]
                      hover:bg-[#380a11]
                      text-white
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      rounded-none
                      transition-all
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >
                    <ShoppingBag size={14} />
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
};

export default Shop;