import { Link } from "react-router-dom";
import { Sparkles, Heart, Crown, Award } from "lucide-react";
import storyImage from "../assets/imageone.jpeg"; // Aapki asset image

const AboutStory = () => {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-[#4a0e17]" />,
      title: "Thoughtful Designs",
      desc: "Every piece is created with an eye for elegance and detail.",
    },
    {
      icon: <Crown className="w-6 h-6 text-[#4a0e17]" />,
      title: "Premium Feel",
      desc: "We focus on beautiful fabrics, refined finishing and quality.",
    },
    {
      icon: <Award className="w-6 h-6 text-[#4a0e17]" />,
      title: "Timeless Style",
      desc: "Designed to remain elegant beyond fleeting trends.",
    },
    {
      icon: <Heart className="w-6 h-6 text-[#4a0e17]" />,
      title: "Made for Her",
      desc: "Because every woman deserves to feel confident in what she wears.",
    },
  ];

  return (
    <section className="bg-[#fff8fa] py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* ==========================================
            1. HERO STORY BANNER (3D FLOATING ANIMATED IMAGE)
           ========================================== */}
        <div className="bg-[#fcf8f6] border border-pink-100/60 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center rounded-2xl">
          
          {/* Left Side Text Content */}
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-center relative z-10">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#4a0e17] block mb-3">
              About Jannat Elegance
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#4a0e17] font-semibold mb-5 leading-tight">
              Our Story
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4 font-light">
              Jannat Elegance was born from a love for timeless Indian fashion and the belief that every woman deserves to feel beautiful, confident and effortlessly elegant.
            </p>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-8 font-light">
              We bring together traditional inspiration and contemporary design to create ethnic wear that feels graceful, luxurious and relevant to today's woman.
            </p>

            <div>
              <Link
                to="/shop"
                className="inline-block bg-[#4a0e17] hover:bg-[#380a11] text-white text-xs font-semibold uppercase tracking-widest px-8 py-3.5 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Discover Our Story
              </Link>
            </div>
          </div>

          {/* Right Side: 3D Animated & Floating Card Image */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex items-center justify-center relative">
            {/* Ambient Background Decorative Glow */}
            <div className="absolute w-72 h-72 bg-pink-300/30 rounded-full blur-3xl -z-0 animate-pulse" />

            {/* 3D Floating Image Card Container */}
            <div className="relative z-10 w-full max-w-md group perspective-1000">
              {/* Back Accent Border Frame */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#4a0e17] via-pink-400 to-[#4a0e17] rounded-2xl opacity-40 blur-sm group-hover:opacity-75 transition duration-700" />
              
              {/* Main Image Holder */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ease-out transform group-hover:-translate-y-3 group-hover:rotate-1 group-hover:scale-[1.02]">
                <img
                  src={storyImage}
                  alt="Jannat Elegance Story"
                  className="w-full h-[420px] sm:h-[500px] object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-110"
                />
                
                {/* Subtle Gradient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#4a0e17]/50 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
              </div>
            </div>
          </div>

        </div>

        {/* ==========================================
            2. OUR PHILOSOPHY SECTION
           ========================================== */}
        {/* <div className="bg-[#4a0e17] text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-lg rounded-2xl">
          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <span className="text-xs uppercase tracking-[0.25em] text-pink-200 font-semibold">
              Our Philosophy
            </span>
            <h3 className="text-2xl sm:text-4xl font-serif text-pink-50 leading-snug">
              Designed With Grace. Made To Be Remembered.
            </h3>
            <p className="text-pink-100/90 text-sm sm:text-base font-light leading-relaxed">
              At Jannat Elegance, we believe fashion should do more than dress you—it should express you. Our designs celebrate femininity, Indian heritage and modern elegance, creating pieces that you can cherish, wear and make your own.
            </p>
            
            <div className="pt-4 flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-pink-200 uppercase tracking-widest">
              <span>Timeless</span>
              <span>•</span>
              <span>Feminine</span>
              <span>•</span>
              <span>Elegant</span>
              <span>•</span>
              <span>Effortless</span>
            </div>
          </div>
        </div> */}

        {/* ==========================================
            3. WHY JANNAT ELEGANCE (4 GRID CARDS)
           ========================================== */}
        <div>
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-serif text-[#4a0e17]">
              Why Jannat Elegance?
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm mt-1 uppercase tracking-wider">
              True elegance lies in the little things
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 border border-pink-100/80 rounded-xl flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-[#fff8fa] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                  {item.icon}
                </div>
                <h4 className="font-serif text-[#4a0e17] text-lg font-medium mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            4. BRAND PROMISE & FEELING BANNER
           ========================================== */}
        <div className="bg-white border-2 border-pink-200/60 p-8 sm:p-12 text-center shadow-sm rounded-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-[#4a0e17] italic font-serif text-lg sm:text-xl">
              "Jannat Elegance is more than clothing. It is a feeling. It is confidence. It is the queen within you."
            </p>
            
            <div className="w-16 h-0.5 bg-[#4a0e17] mx-auto my-4" />

            <h4 className="text-xl sm:text-2xl font-serif text-[#4a0e17]">
              Brand Promise
            </h4>
            <p className="text-[#4a0e17] font-semibold text-base sm:text-lg uppercase tracking-wider">
              Wear Your Elegance. Own Your Moment.
            </p>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-light">
              Whether it's a festive celebration, a family gathering, a special occasion or simply a day when you want to feel beautiful—Jannat Elegance is designed to be part of your moments.
            </p>

            <div className="pt-4">
              <Link
                to="/shop"
                className="inline-block bg-[#4a0e17] hover:bg-[#380a11] text-white text-xs font-semibold uppercase tracking-widest px-8 py-3.5 transition duration-300 shadow-md hover:shadow-lg"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutStory;