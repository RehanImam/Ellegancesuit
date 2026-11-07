import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { products as staticProducts } from "../data/products";

const normalizeProduct = (product, fallbackId = Date.now()) => {
  const images = Array.isArray(product?.images) && product.images.length > 0
    ? product.images
    : Array.isArray(product?.image) && product.image.length > 0
      ? product.image
      : [product?.url || product?.imageUrl || ""];

  return {
    ...product,
    id: product?.id ?? product?._id ?? fallbackId,
    name: product?.name || product?.productName || "Untitled Product",
    productName: product?.productName || product?.name || "Untitled Product",
    category: product?.category || "Frocks",
    price: Number(product?.price || 0),
    oldPrice: Number(product?.oldPrice || product?.price || 0),
    rating: Number(product?.rating || 0),
    reviews: Number(product?.reviews || 0),
    description: product?.description || "",
    sizes: product?.sizes || product?.sizeStock?.map((item) => item.size) || ["M", "L"],
    images: images.filter(Boolean),
    badge: product?.badge || "",
  };
};

const allProducts = [...staticProducts.map((product) => normalizeProduct(product, product.id))];

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("ladies-fashion-cart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem(
      "ladies-fashion-wishlist"
    );

    return savedWishlist
      ? JSON.parse(savedWishlist)
      : [];
  });

  const [dbProducts, setDbProducts] = useState([]);

  useEffect(() => {
    const fetchDbProducts = async () => {
      try {
        const response = await fetch("https://auth-backend-gules.vercel.app/api/v1/products");
        const payload = await response.json();
        if (!response.ok) return;
        const nextProducts = Array.isArray(payload.data) ? payload.data : [];
        setDbProducts(nextProducts.map((product) => normalizeProduct(product, product._id || product.id)));
      } catch (error) {
        console.error("Failed to load DB products", error);
      }
    };

    fetchDbProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "ladies-fashion-cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(
      "ladies-fashion-wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const addToCart = (product, size = product?.sizes?.[0] || "M", showDrawer = true) => {
    if (!product) return;
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          (size ? item.size === size : true)
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id &&
          (size ? item.size === size : true)
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          size: size || product?.sizes?.[0] || "M",
          quantity: 1,
        },
      ];
    });

    if (showDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const removeFromCart = (id, size) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.id === id && (size ? item.size === size : true))
      )
    );
  };

  const increaseQuantity = (id, size) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && (size ? item.size === size : true)
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id, size) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id && (size ? item.size === size : true)
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productOrId) => {
    if (!productOrId) return;
    const productId = typeof productOrId === "object" ? productOrId.id : productOrId;

    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === productId);

      if (exists) {
        return prev.filter((item) => item.id !== productId);
      }

      let productToAdd = productOrId;
      if (typeof productOrId !== "object" || !productOrId.images) {
        productToAdd = mergedProducts.find((p) => p.id === productId) || productOrId;
      }

      return [...prev, productToAdd];
    });
  };

  const isWishlisted = (idOrProduct) => {
    if (!idOrProduct) return false;
    const targetId = typeof idOrProduct === "object" ? idOrProduct.id : idOrProduct;
    return wishlist.some((item) => item.id === targetId);
  };

  const removeFromWishlist = (idOrProduct) => {
    if (!idOrProduct) return;
    const targetId = typeof idOrProduct === "object" ? idOrProduct.id : idOrProduct;
    setWishlist((prev) =>
      prev.filter((item) => item.id !== targetId)
    );
  };

  const mergedProducts = useMemo(
    () => [...allProducts, ...dbProducts],
    [dbProducts]
  );

  const cartCount = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [cart]
  );

  const wishlistCount = wishlist.length;

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0
      ),
    [cart]
  );

  const shipping = subtotal >= 2999 || subtotal === 0
    ? 0
    : 99;

  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
        removeFromWishlist,
        cartCount,
        wishlistCount,
        subtotal,
        shipping,
        total,
        isCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);