import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import ProductGrid from "../components/ProductGrid";
import { products } from "../data/products";
import { Link } from "react-router-dom";

const Home = () => {

  const featuredProducts = products.slice(0, 4);

  return (
    <>

      <Hero />

      <CategorySection />

      {/* Featured */}

      <section className="py-20 bg-[#fff8fa]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-end justify-between mb-10">

            <div>

              <p className="text-pink-500 uppercase tracking-[4px] text-xs font-semibold">
                Our Favorites
              </p>

              <h2 className="font-serif text-4xl sm:text-5xl text-maroon-900 mt-2">
                Trending Now
              </h2>

            </div>

            <Link
              to="/shop"
              className="hidden sm:block text-maroon-700 font-medium"
            >
              View All →
            </Link>

          </div>

          <ProductGrid
            products={featuredProducts}
          />

          <div className="text-center mt-10 sm:hidden">

            <Link
              to="/shop"
              className="inline-block bg-maroon-800 text-white px-7 py-3 rounded-full"
            >
              View All Products
            </Link>

          </div>

        </div>

      </section>

      {/* Promo */}

      <section className="py-20">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="rounded-[35px] bg-maroon-900 overflow-hidden relative">

            <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -right-20 -top-20" />

            <div className="relative p-10 sm:p-16 text-white max-w-2xl">

              <p className="text-pink-300 uppercase tracking-[4px] text-xs">
                Limited Time
              </p>

              <h2 className="font-serif text-4xl sm:text-5xl mt-4">
                Your Wardrobe Deserves Something Beautiful.
              </h2>

              <p className="text-pink-100 mt-5 leading-7">
                Get free shipping on orders above ₹2,999.
              </p>

              <Link
                to="/shop"
                className="inline-block mt-7 bg-white text-maroon-900 px-7 py-3 rounded-full font-medium"
              >
                Shop Now
              </Link>

            </div>

          </div>

        </div>

      </section>

    </>
  );
};

export default Home;