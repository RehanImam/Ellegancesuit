import imageOne from "../assets/imageone.jpeg";
import imageTwo from "../assets/imagetwo.jpeg";
import imageThree from "../assets/imagethree.jpeg";
import imageFour from "../assets/imagefour.jpeg";
import imageFive from "../assets/imagefive.jpeg";
import imageSix from "../assets/imagesix.jpeg";
import imageSeven from "../assets/imageseven.jpeg";

export const products = [
  // =====================================================
  // PRODUCT 1
  // =====================================================
  {
    id: 1,
    name: "Rose Embroidered Anarkali Frock",
    category: "Frocks",
    price: 2499,
    oldPrice: 3299,
    rating: 4.8,
    reviews: 124,
    description:
      "Elegant embroidered Anarkali frock crafted for festive occasions and special evenings. Designed with a graceful silhouette and beautiful detailing.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Rose Pink", "Maroon"],
    images: [
      imageOne,
      imageTwo,
      imageThree,
      imageFour,
      imageFive,
    ],
  },

  // =====================================================
  // PRODUCT 2
  // =====================================================
  {
    id: 2,
    name: "Royal Maroon Party Frock",
    category: "Frocks",
    price: 2899,
    oldPrice: 3999,
    rating: 4.9,
    reviews: 89,
    description:
      "A royal maroon party frock with graceful detailing and a premium silhouette. Perfect for parties, weddings and evening celebrations.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Maroon", "Wine"],
    images: [
      imageTwo,
      imageThree,
      imageFive,
      imageSix,
      imageSeven,
    ],
  },

  // =====================================================
  // PRODUCT 3
  // =====================================================
  {
    id: 3,
    name: "Blush Pink Pakistani Suit",
    category: "Suits",
    price: 3199,
    oldPrice: 4499,
    rating: 4.7,
    reviews: 76,
    description:
      "Beautiful blush pink Pakistani suit designed with elegant patterns for weddings, festive occasions and family celebrations.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blush Pink", "Rose"],
    images: [
      imageThree,
      imageFour,
      imageOne,
      imageSix,
      imageSeven,
    ],
  },

  // =====================================================
  // PRODUCT 4
  // =====================================================
  {
    id: 4,
    name: "Maroon Velvet Festive Suit",
    category: "Suits",
    price: 3799,
    oldPrice: 4999,
    rating: 4.9,
    reviews: 152,
    description:
      "Premium velvet festive suit featuring a rich maroon finish and sophisticated detailing. A luxurious choice for weddings and festive events.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Maroon", "Burgundy"],
    images: [
      imageFour,
      imageFive,
      imageTwo,
      imageSeven,
      imageThree,
    ],
  },

  // =====================================================
  // PRODUCT 5
  // =====================================================
  {
    id: 5,
    name: "Elegant Rose Sharara Suit",
    category: "Suits",
    price: 3499,
    oldPrice: 4299,
    rating: 4.8,
    reviews: 67,
    description:
      "Elegant rose-toned sharara suit perfect for weddings, parties and festive occasions. Designed to give a graceful and sophisticated appearance.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Rose", "Pink"],
    images: [
      imageFive,
      imageSix,
      imageSeven,
      imageOne,
      imageFour,
    ],
  },

  // =====================================================
  // PRODUCT 6
  // =====================================================
  {
    id: 6,
    name: "Pink Floral Designer Frock",
    category: "Frocks",
    price: 2199,
    oldPrice: 2999,
    rating: 4.6,
    reviews: 54,
    description:
      "Lightweight floral designer frock with a feminine silhouette and soft pink palette. Perfect for casual parties and festive gatherings.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Pink", "Blush"],
    images: [
      imageSix,
      imageSeven,
      imageThree,
      imageTwo,
      imageFive,
    ],
  },
];