import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import ProductGrid from "../components/ProductGrid";
import { products } from "../data/products";

const Shop = () => {

  const [searchParams] = useSearchParams();

  const initialCategory =
    searchParams.get("category") || "All";

  const [category, setCategory] =
    useState(initialCategory);

  const [search, setSearch] = useState("");

  const [sort, setSort] =
    useState("featured");

  const filteredProducts = useMemo(() => {

    let result = [...products];

    if (category !== "All") {
      result = result.filter(
        (product) =>
          product.category === category
      );
    }

    if (search.trim()) {
      result = result.filter((product) =>
        product.name
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;

  }, [category, search, sort]);

  return (
    <main className="bg-[#fff8fa] min-h-screen">

      <section className="py-14 sm:py-20 bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <p className="text-pink-500 uppercase tracking-[4px] text-xs">
            Collection
          </p>

          <h1 className="font-serif text-5xl text-maroon-900 mt-2">
            Shop All
          </h1>

          <p className="text-gray-500 mt-3">
            Find something beautiful for every occasion.
          </p>

        </div>

      </section>

      <section className="py-10">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Filters */}

          <div className="flex flex-col lg:flex-row gap-4 justify-between mb-8">

            <div className="flex gap-2 overflow-x-auto no-scrollbar">

              {["All", "Frocks", "Suits"].map(
                (item) => (

                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`px-5 py-2.5 rounded-full whitespace-nowrap transition ${
                      category === item
                        ? "bg-maroon-800 text-white"
                        : "bg-white text-maroon-800 border border-pink-100"
                    }`}
                  >
                    {item}
                  </button>

                )
              )}

            </div>

            <div className="flex gap-3">

              <div className="relative flex-1">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search..."
                  className="w-full sm:w-64 bg-white border border-pink-100 rounded-full py-2.5 pl-11 pr-4 outline-none focus:border-maroon-500"
                />

              </div>

              <div className="relative">

                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value)
                  }
                  className="appearance-none bg-white border border-pink-100 rounded-full px-5 py-2.5 pr-10 outline-none"
                >
                  <option value="featured">
                    Featured
                  </option>

                  <option value="low">
                    Price: Low
                  </option>

                  <option value="high">
                    Price: High
                  </option>

                  <option value="rating">
                    Top Rated
                  </option>

                </select>

                <SlidersHorizontal
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />

              </div>

            </div>

          </div>

          <p className="text-sm text-gray-500 mb-5">
            {filteredProducts.length} products
          </p>

          <ProductGrid
            products={filteredProducts}
          />

        </div>

      </section>

    </main>
  );
};

export default Shop;