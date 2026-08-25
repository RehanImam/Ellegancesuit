// import { Play } from "lucide-react";
// import videoTwo from "../video/videotwo.mp4"; // Updated import to videotwo.mp4

// const videos = [
//   { id: 1, title: "Festive Vibes", src: videoTwo },
//   { id: 2, title: "Bridal Elegance", src: videoTwo },
//   { id: 3, title: "Trendy Lehengas", src: videoTwo },
//   { id: 4, title: "Summer Collection", src: videoTwo },
// ];

// const VideoGallery = () => {
//   return (
//     <section className="bg-[#fff8fa] py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
        
//         {/* Section Heading */}
//         <div className="text-center mb-8 space-y-2">
//           <h2 className="text-2xl sm:text-3xl font-serif text-[#4a0e17] font-normal">
//             Trending Styles
//           </h2>
//           <p className="text-gray-600 text-xs sm:text-sm font-light">
//             Watch our latest ethnic collection in action
//           </p>
//         </div>

//         {/* Video Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 justify-center">
//           {videos.map((video) => (
//             <div
//               key={video.id}
//               className="group relative rounded-xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col bg-pink-50 max-h-[300px] sm:max-h-[350px] aspect-[3/4]"
//             >
//               {/* Video Player */}
//               <video
//                 src={video.src}
//                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                 autoPlay
//                 loop
//                 muted
//                 playsInline
//               />

//               {/* Play Icon Overlay */}
//               <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
//                 <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
//                   <Play size={20} className="fill-white ml-1" />
//                 </div>
//               </div>

//               {/* Title Tag */}
//               <div className="absolute bottom-3 left-3 right-3 text-center z-10">
//                 <span className="bg-[#4a0e17]/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider block truncate">
//                   {video.title}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// };

// export default VideoGallery;