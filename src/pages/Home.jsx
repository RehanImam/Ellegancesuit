


import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";

import imageOne from "../assets/imageone.jpeg";
import imageTwo from "../assets/imagetwo.jpeg";
import imageThree from "../assets/imagethree.jpeg";
import imageFour from "../assets/imagefour.jpeg";

const categoryList = [
  { name: "ALL", category: "All", image: imageOne },
  { name: "SHARARA SUIT", category: "Sharara Suit", image: imageTwo },
  { name: "GARARA SUIT", category: "Garara Suit", image: imageThree },
  { name: "PANT SUIT", category: "Pant Suit", image: imageFour },
  { name: "FARSHI SHALWAR", category: "Farshi Shalwar Suit", image: imageOne },
  { name: "FROCK SUIT", category: "Frock Suit", image: imageTwo },
  { name: "GOWN", category: "Gown", image: imageThree },
  { name: "LEHNGA", category: "Lehnga", image: imageFour },
  { name: "PLAZO SUIT", category: "Plazo Suit", image: imageOne },
];

const Home = () => {
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -250 : 250;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-pink-50/50 min-h-screen">
      <Hero />
      <CategorySection />

      {/* Responsive Circular Category Slider */}
      <section className="py-8 sm:py-12 bg-pink-50/50 border-t border-pink-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="font-serif text-2xl sm:text-4xl text-rose-950 font-normal tracking-wide">
              Shop By Category
            </h2>
          </div>

          <div className="relative group">
            
            {/* Left Scroll Arrow */}
            <button
              onClick={() => handleScroll("left")}
              className="absolute -left-2 sm:-left-5 top-14 sm:top-1/2 sm:-translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition text-gray-800"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Horizontal Track */}
            <div
              ref={scrollContainerRef}
              className="flex items-start gap-4 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
            >
              {categoryList.map((item) => (
                <Link
                  key={item.category}
                  to={`/shop?category=${encodeURIComponent(item.category)}`}
                  className="flex flex-col items-center gap-2 sm:gap-4 group shrink-0"
                >
                  {/* Circle Frame: Phone (w-28 h-28) | Laptop (w-52 h-52) */}
                  <div className="w-28 h-28 sm:w-52 sm:h-52 rounded-full overflow-hidden border border-gray-300 p-1 sm:p-1.5 bg-white transition-all duration-300 group-hover:border-rose-950 shadow-sm">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="
                          w-full
                          h-full
                          object-cover
                          object-top
                          group-hover:scale-105
                          transition-transform
                          duration-500
                        "
                      />
                    </div>
                  </div>

                  <span className="text-gray-900 text-xs sm:text-base font-normal tracking-wide uppercase text-center max-w-[110px] sm:max-w-[160px] truncate group-hover:text-pink-600 transition-colors">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* Right Scroll Arrow */}
            <button
              onClick={() => handleScroll("right")}
              className="absolute -right-2 sm:-right-5 top-14 sm:top-1/2 sm:-translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition text-gray-800"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>

          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;