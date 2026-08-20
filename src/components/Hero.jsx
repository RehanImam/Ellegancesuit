import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import imageThree from "../assets/imagethree.jpeg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden luxury-gradient">

      {/* Background blobs */}

      <div className="absolute -top-20 -right-20 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl" />

      <div className="absolute bottom-0 -left-20 w-80 h-80 bg-maroon-200/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="min-h-[650px] grid lg:grid-cols-2 items-center gap-10 py-16">

          {/* ================= TEXT ================= */}

          <div className="relative z-10 animate-fadeUp">

            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-maroon-700 text-sm mb-6">

              <Sparkles size={15} />

              New Festive Collection

            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-maroon-900 leading-[1.05]">

              Elegance

              <br />

              <span className="text-pink-500">
                Made For You
              </span>

            </h1>

            <p className="mt-6 text-gray-600 max-w-lg leading-7">
              Discover timeless Indian fashion designed
              to make every moment beautiful. From
              elegant frocks to luxurious suits.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">

              <Link
                to="/shop"
                className="luxury-button bg-maroon-800 hover:bg-maroon-900 text-white px-7 py-4 rounded-full flex items-center gap-2 shadow-xl shadow-maroon-800/20 transition"
              >
                Shop Collection

                <ArrowRight size={18} />
              </Link>

              <Link
                to="/shop?category=Suits"
                className="px-7 py-4 rounded-full border border-maroon-200 text-maroon-800 hover:bg-white transition"
              >
                Explore Suits
              </Link>

            </div>

            {/* ================= STATS ================= */}

            <div className="flex gap-8 mt-12">

              <div>
                <strong className="text-2xl font-serif text-maroon-900">
                  5K+
                </strong>

                <p className="text-xs text-gray-500">
                  Happy Women
                </p>
              </div>

              <div>
                <strong className="text-2xl font-serif text-maroon-900">
                  100+
                </strong>

                <p className="text-xs text-gray-500">
                  Designs
                </p>
              </div>

              <div>
                <strong className="text-2xl font-serif text-maroon-900">
                  4.9
                </strong>

                <p className="text-xs text-gray-500">
                  Rating
                </p>
              </div>

            </div>

          </div>

          {/* ================= HERO IMAGE ================= */}

          <div className="relative flex justify-center">

            {/* Pink glow */}

            <div className="absolute w-[80%] aspect-square bg-pink-300/30 rounded-full blur-2xl" />

            <div className="relative w-full max-w-[500px] animate-float">

              <div className="rounded-[45%_45%_20%_20%] overflow-hidden shadow-2xl shadow-maroon-900/20 border-[10px] border-white">

                <img
                  src={imageThree}
                  alt="Elegant women's fashion"
                  className="w-full aspect-[4/5] object-cover"
                />

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;