import { Sparkles } from "lucide-react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#fff8fa] flex items-center justify-center">
      <div className="flex flex-col items-center">

        {/* Logo */}
        <div className="relative">

          <div className="absolute inset-0 bg-pink-300/40 blur-2xl rounded-full animate-pulse" />

          <div className="relative w-24 h-24 rounded-full bg-maroon-800 flex items-center justify-center shadow-2xl">
            <span className="font-serif text-3xl font-bold text-white">
              Z
            </span>
          </div>

        </div>

        {/* Brand */}
        <h2 className="font-serif text-3xl font-bold text-maroon-900 mt-6">
          ZARAA
        </h2>

        <p className="text-[10px] tracking-[5px] text-pink-500 mt-1">
          WOMEN'S FASHION
        </p>

        {/* Loading */}
        <div className="flex items-center gap-2 mt-6">

          <Sparkles
            size={15}
            className="text-pink-500 animate-pulse"
          />

          <span className="text-sm text-gray-500">
            Loading collection...
          </span>

          <Sparkles
            size={15}
            className="text-maroon-700 animate-pulse"
          />

        </div>

        {/* Progress */}
        <div className="w-48 h-1 bg-pink-100 rounded-full overflow-hidden mt-4">

          <div className="h-full w-1/2 bg-maroon-700 rounded-full animate-[loader_1.5s_ease-in-out_infinite]" />

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