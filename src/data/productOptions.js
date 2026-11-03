export const PRODUCT_CATEGORIES = [
  "Lehnga",
  "Choli collection",
  "Suits collection",
  "Sari collection",
];

export const CATEGORY_PRICES = {
  Lehnga: 650,
  "Choli collection": 699,
  "Suits collection": 599,
  "Sari collection": 599,
};

export const PRODUCT_SIZES = [
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "3XL",
  "4XL",
  "5XL",
  "6XL",
];

export const normalizeCategory = (category) => {
  const value = String(category || "").trim().toLowerCase();

  if (value.includes("lehng") || value.includes("lehenga")) return "Lehnga";
  if (value.includes("choli") || value.includes("frock")) return "Choli collection";
  if (value.includes("sari") || value.includes("saree")) return "Sari collection";
  if (value.includes("suit")) return "Suits collection";

  return PRODUCT_CATEGORIES.find((item) => item.toLowerCase() === value) || "Lehnga";
};
