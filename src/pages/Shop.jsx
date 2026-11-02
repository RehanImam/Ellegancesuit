

import { useMemo, useState, useEffect } from "react";
import {
  SlidersHorizontal,
  ShoppingBag,
  Heart,
  ArrowLeft,
  Search,
  X,

} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

const categories = ["All", "Frocks", "Suits"];

const Shop = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL search params
  const searchQueryFromUrl = searchParams.get("search") || searchParams.get("q") || "";
  const categoryFromUrl = searchParams.get("category") || "All";

  const [searchTerm, setSearchTerm] = useState(searchQueryFromUrl);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [sort, setSort] = useState("featured");

  const { toggleWishlist, isWishlisted, addToCart, mergedProducts } = useCart();

  // Sync state when URL params change
  useEffect(() => {
    setSearchTerm(searchQueryFromUrl);
  }, [searchQueryFromUrl]);

  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  // Update URL params
  const updateFilters = (newSearch, newCategory) => {
    const params = new URLSearchParams();
    const finalSearch = newSearch !== undefined ? newSearch : searchTerm;
    const finalCategory = newCategory !== undefined ? newCategory : selectedCategory;

    if (finalSearch.trim()) {
      params.set("search", finalSearch.trim());
    }
    if (finalCategory && finalCategory !== "All") {
      params.set("category", finalCategory);
    }
    setSearchParams(params);
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    updateFilters(undefined, cat);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters(searchTerm, undefined);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSearchParams(new URLSearchParams());
  };

  const clearSearchOnly = () => {
    setSearchTerm("");
    updateFilters("", undefined);
  };

 

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...mergedProducts];

    // Filter by category
    if (selectedCategory && selectedCategory !== "All") {
      const catLower = selectedCategory.toLowerCase().replace(/s$/, ""); // e.g. "suits" -> "suit", "frocks" -> "frock"
      result = result.filter((p) => {
        const prodCatLower = p.category?.toLowerCase() || "";
        const prodNameLower = p.name?.toLowerCase() || "";
        return (
          prodCatLower.includes(catLower) ||
          prodNameLower.includes(catLower)
        );
      });
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter((p) => {
        const matchName = p.name?.toLowerCase().includes(q);
        const matchCat = p.category?.toLowerCase().includes(q);
        const matchDesc = p.description?.toLowerCase().includes(q);
        const matchColor = p.colors?.some((c) => c.toLowerCase().includes(q));
        return matchName || matchCat || matchDesc || matchColor;
      });
    }

    // Sort products
    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [mergedProducts,searchTerm, selectedCategory, sort]);

  return (
    <main className="bg-[#fff8fa] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Navigation & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#4a0e17] hover:text-[#380a11] font-semibold text-xs uppercase tracking-wider bg-white border border-pink-200 px-4 py-3 transition shadow-sm hover:shadow w-fit"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {/* In-Page Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-md relative flex items-center shadow-sm rounded-full bg-white border border-pink-200 overflow-hidden focus-within:border-[#4a0e17] transition"
          >
            <Search size={17} className="text-[#4a0e17] ml-3.5 mr-1" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, fabric, color..."
              className="w-full bg-transparent text-[#4a0e17] py-2.5 px-2 text-xs sm:text-sm outline-none placeholder:text-rose-300 font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearchOnly}
                className="p-1 text-gray-400 hover:text-[#4a0e17] mr-1"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
            <button
              type="submit"
              className="bg-[#4a0e17] hover:bg-[#380a11] text-white text-xs font-semibold px-4 py-2 rounded-full mr-1 transition"
            >
              Search
            </button>
          </form>

          {/* Sort Filter Dropdown */}
          <div className="relative w-fit self-end sm:self-auto">
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

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-950/70 mr-1 flex items-center gap-1 shrink-0">
            
            Categories:
          </span>
          {categories.map((cat) => {
            const isSelected =
              selectedCategory.toLowerCase() === cat.toLowerCase() ||
              (cat === "All" && (!selectedCategory || selectedCategory === "All"));

            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border shrink-0 ${
                  isSelected
                    ? "bg-[#4a0e17] text-white border-[#4a0e17] shadow-sm"
                    : "bg-white text-[#4a0e17] border-pink-200 hover:border-[#4a0e17]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-rose-900/80 uppercase tracking-wider">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"}
          </p>
        </div>

        {/* Product Cards Grid or Empty State */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const inWishlist = isWishlisted(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white border border-pink-100 rounded-2xl overflow-hidden group flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300 relative"
                >
                  {/* Product Image Frame */}
                  <div className="w-full aspect-[3/4] relative overflow-hidden bg-gray-50 block">
                    <Link to={`/product/${product.id}`} className="w-full h-full block">
                      <img
                        src={product.images && product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </Link>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product);
                      }}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 bg-white/95 backdrop-blur rounded-full flex items-center justify-center transition-all duration-300 shadow-md z-10 hover:scale-105"
                      aria-label="Add to Wishlist"
                    >
                      <Heart
                        size={18}
                        className={`transition-colors duration-300 ${
                          inWishlist
                            ? "fill-[#4a0e17] text-[#4a0e17]"
                            : "text-gray-700 hover:text-[#4a0e17]"
                        }`}
                      />
                    </button>

                    {/* Badge if available */}
                    {product.badge && (
                      <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#4a0e17] text-white text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full shadow">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Product Info & Add To Cart Button */}
                  <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-pink-600 font-semibold mb-0.5">
                        {product.category}
                      </p>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-serif text-sm sm:text-base text-[#4a0e17] truncate font-medium hover:text-[#380a11] transition">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[#4a0e17] font-bold text-sm sm:text-base">
                          ₹{product.price.toLocaleString()}
                        </p>
                        {product.oldPrice && (
                          <p className="text-gray-400 line-through text-xs sm:text-sm">
                            ₹{product.oldPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
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
                        rounded-xl
                        transition-all
                        flex
                        items-center
                        justify-center
                        gap-2
                        shadow-xs
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
        ) : (
          /* Empty Results State */
          <div className="py-20 text-center bg-white rounded-3xl border border-pink-100 p-8 my-6 max-w-xl mx-auto shadow-sm">
            <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-4 text-[#4a0e17]">
              <Search size={32} />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#4a0e17]">
              No Products Found
            </h3>

            <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
              We couldn&apos;t find any matches
              {searchTerm ? ` for "${searchTerm}"` : ""}. Try adjusting your search term or exploring all styles.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={clearAllFilters}
                className="bg-[#4a0e17] hover:bg-[#380a11] text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition shadow-sm"
              >
                View All Products
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
};

export default Shop;
