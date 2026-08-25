import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

// Asset Images
import imageOne from "../assets/imageone.jpeg";
import imageTwo from "../assets/imagetwo.jpeg";
import imageThree from "../assets/imagethree.jpeg";

const newArrivalProducts = [
  {
    id: 101,
    name: "Royal Velvet Suit",
    category: "Festive Wear",
    price: "₹3,999",
    image: imageOne,
  },
  {
    id: 102,
    name: "Embroidered Silk Set",
    category: "Ethnic Premium",
    price: "₹5,499",
    image: imageTwo,
  },
  {
    id: 103,
    name: "Blush Pink Designer Wear",
    category: "Occasion Wear",
    price: "₹8,999",
    image: imageThree,
  },
];

const NewArrivals = () => {
  return (
    <section className="bg-[#fff8fa] py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-pink-100/80 px-3.5 py-1 rounded-full border border-pink-200">
            <Sparkles className="w-3.5 h-3.5 text-[#4a0e17]" />
            <span className="text-[11px] uppercase tracking-widest font-bold text-[#4a0e17]">
              New Arrival
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#4a0e17] font-normal">
            New Arrivals
          </h2>
        </div>

        {/* Compact Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {newArrivalProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group bg-white rounded-xl border border-pink-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Image Box */}
              <div className="relative aspect-[3/4] overflow-hidden bg-pink-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Minimal Details */}
              <div className="p-3 text-center flex flex-col items-center justify-center flex-1 bg-white">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-pink-700/80">
                  {product.category}
                </span>
                <h3 className="font-serif text-[#4a0e17] text-sm font-medium mt-0.5 line-clamp-1 group-hover:text-pink-800">
                  {product.name}
                </h3>
                <span className="text-sm font-bold text-[#4a0e17] mt-1">
                  {product.price}
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default NewArrivals;