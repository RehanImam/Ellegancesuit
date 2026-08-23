

import { Link } from "react-router-dom";

import imageTwo from "../assets/imagetwo.jpeg";
import imageFour from "../assets/imagefour.jpeg";

const categories = [
  {
    name: "Elegant Frocks",
    category: "Frocks",
    image: imageTwo,
  },
  {
    name: "Royal Suits",
    category: "Suits",
    image: imageFour,
  },
];

const CategorySection = () => {
  return (
    <section className="py-12 bg-pink-100/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-8">
          <p className="text-pink-600 uppercase tracking-[4px] text-xs font-semibold">
            Shop By Style
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-rose-950 mt-2">
            Find Your Signature Look
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((item) => (
            <Link
              key={item.category}
              to={`/shop?category=${item.category}`}
              className="
                relative
                group
                overflow-hidden
                rounded-2xl
                h-64 sm:h-72
                w-full
                bg-gray-100
                shadow-sm
                hover:shadow-md
                transition-all
              "
            >
              {/* Image with Top Alignment Fix */}
              <img
                src={item.image}
                alt={item.name}
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                  object-top
                  transition-transform
                  duration-500
                  group-hover:scale-105
                "
              />

              {/* Bottom Gradient Overlay */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/70
                  via-black/20
                  to-transparent
                  pointer-events-none
                "
              />

              {/* Content */}
              <div className="absolute bottom-6 left-6 text-white z-10">
                <p className="text-pink-200 text-xs font-medium">
                  Discover Collection
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl mt-0.5">
                  {item.name}
                </h3>
                <span className="inline-block mt-2 text-xs font-semibold tracking-wider border-b border-white pb-0.5 group-hover:text-pink-200 transition">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategorySection;