import { Sparkles } from "lucide-react";
import logoImg from "../assets/logo.jpeg";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-b from-pink-100 via-pink-50 to-pink-100 flex items-center justify-center">
      <div className="flex flex-col items-center">

        {/* Logo Image */}
        <div className="relative">
          <div className="absolute inset-0 bg-pink-300/60 blur-2xl rounded-full animate-pulse" />

          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-pink-400/80 shadow-2xl bg-rose-950 flex items-center justify-center">
            <img 
              src={logoImg} 
              alt="Jannat Elegance Logo" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Brand */}
        <h2 className="font-serif text-3xl font-bold text-rose-950 mt-6 tracking-wide">
          JANNAT 
        </h2>

        <p className="text-[10px] tracking-[5px] text-pink-600 font-bold mt-1">
          ELEGANCE
        </p>

        {/* Loading Text & Sparkles */}
        <div className="flex items-center gap-2 mt-6">
          <Sparkles
            size={15}
            className="text-pink-500 animate-pulse"
          />

          <span className="text-sm font-medium text-rose-900/80">
            Loading royal collection...
          </span>

          <Sparkles
            size={15}
            className="text-rose-800 animate-pulse"
          />
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-1 bg-pink-200/80 rounded-full overflow-hidden mt-4">
          <div className="h-full w-1/2 bg-gradient-to-r from-pink-500 to-rose-900 rounded-full animate-[loader_1.5s_ease-in-out_infinite]" />
        </div>

      </div>

      <style>
        {`
          @keyframes loader {
            0% {
              transform: translateX(-100%);
            }
            50% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(250%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;