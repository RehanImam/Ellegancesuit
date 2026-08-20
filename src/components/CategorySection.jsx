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
    <section className="py-20 bg-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12">

          <p className="text-pink-500 uppercase tracking-[4px] text-xs font-semibold">
            Shop By Style
          </p>

          <h2 className="font-serif text-4xl sm:text-5xl text-maroon-900 mt-3">
            Find Your Signature Look
          </h2>

        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {categories.map((item) => (

            <Link
              key={item.category}
              to={`/shop?category=${item.category}`}
              className="
                relative
                group
                overflow-hidden
                rounded-[30px]
                aspect-[4/5]
                bg-gray-100
              "
            >

              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                "
              />

              {/* Bottom Gradient */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-maroon-950/80
                  via-transparent
                  to-transparent
                  pointer-events-none
                "
              />

              {/* Content */}
              <div className="absolute bottom-8 left-8 text-white z-10">

                <p className="text-pink-200 text-sm">
                  Discover Collection
                </p>

                <h3 className="font-serif text-3xl sm:text-4xl mt-1">
                  {item.name}
                </h3>

                <span className="inline-block mt-4 border-b border-white pb-1">
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