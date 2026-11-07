export const PRODUCT_CATEGORIES = [
  "Suit",
  "Saree",
  "Lehenga",
  "Kurti",
  "Sharara",
];

export const SHOP_CATEGORIES = ["All", ...PRODUCT_CATEGORIES];

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

const BEST_SELLER_NAME_PREFIX = "best-seller:";

export const isBestSellerProduct = (product) =>
  Boolean(product?.isBestSeller) ||
  String(product?.productName || product?.name || "").toLowerCase().startsWith(BEST_SELLER_NAME_PREFIX);

export const getProductDisplayName = (productName) =>
  String(productName || "").replace(/^best-seller:/i, "");

export const getStoredProductName = (productName, isBestSeller) => {
  const displayName = getProductDisplayName(productName);
  return isBestSeller ? `${BEST_SELLER_NAME_PREFIX}${displayName}` : displayName;
};

export const normalizeCategory = (category) => {
  const value = String(category || "").trim().toLowerCase();

  if (value.includes("lehng") || value.includes("lehenga")) return "Lehenga";
  if (value.includes("sari") || value.includes("saree")) return "Saree";
  if (value.includes("sharara")) return "Sharara";
  if (value.includes("kurti") || value.includes("choli") || value.includes("frock")) return "Kurti";
  if (value.includes("suit")) return "Suit";

  return PRODUCT_CATEGORIES.find((item) => item.toLowerCase() === value) || "Suit";
};
