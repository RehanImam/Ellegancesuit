import { createContext, useContext, useEffect, useState } from "react";

const AddressContext = createContext();

const INITIAL_ADDRESSES = [
  {
    id: "addr-1",
    name: "Ayesha Khan",
    phone: "9876543210",
    altPhone: "9876500000",
    addressLine1: "Flat 402, Royal Palms Residency",
    addressLine2: "Jubilee Hills, Road No. 36",
    landmark: "Near Olive Bistro",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500033",
    type: "HOME",
    isDefault: true,
  },
  {
    id: "addr-2",
    name: "Ayesha Khan",
    phone: "9876543210",
    altPhone: "",
    addressLine1: "Tower B, Level 6, Tech Park",
    addressLine2: "HITEC City, Madhapur",
    landmark: "Opposite Cyber Towers",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500081",
    type: "WORK",
    isDefault: false,
  },
];

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem("ladies-fashion-addresses");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse saved addresses:", e);
      }
    }
    return INITIAL_ADDRESSES;
  });

  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
    return defaultAddr ? defaultAddr.id : null;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("ladies-fashion-orders");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved orders:", e);
      }
    }
    return [];
  });

  // Sync addresses to localStorage
  useEffect(() => {
    localStorage.setItem("ladies-fashion-addresses", JSON.stringify(addresses));
    if (!addresses.some((a) => a.id === selectedAddressId) && addresses.length > 0) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(def.id);
    }
  }, [addresses, selectedAddressId]);

  // Sync orders to localStorage
  useEffect(() => {
    localStorage.setItem("ladies-fashion-orders", JSON.stringify(orders));
  }, [orders]);

  const addAddress = (newAddr) => {
    const id = `addr-${Date.now()}`;
    const formatted = {
      ...newAddr,
      id,
      isDefault: newAddr.isDefault || addresses.length === 0,
    };

    setAddresses((prev) => {
      let updated = prev;
      if (formatted.isDefault) {
        updated = prev.map((a) => ({ ...a, isDefault: false }));
      }
      return [...updated, formatted];
    });

    setSelectedAddressId(id);
    return id;
  };

  const updateAddress = (id, updatedData) => {
    setAddresses((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, ...updatedData };
        }
        if (updatedData.isDefault) {
          return { ...item, isDefault: false };
        }
        return item;
      })
    );
  };

  const deleteAddress = (id) => {
    setAddresses((prev) => {
      const remaining = prev.filter((a) => a.id !== id);
      if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
        remaining[0].isDefault = true;
      }
      return remaining;
    });

    if (selectedAddressId === id) {
      const remaining = addresses.filter((a) => a.id !== id);
      setSelectedAddressId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const setDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    setSelectedAddressId(id);
  };

  const getSelectedAddress = () => {
    return (
      addresses.find((a) => a.id === selectedAddressId) ||
      addresses.find((a) => a.isDefault) ||
      addresses[0] ||
      null
    );
  };

  const createOrder = ({
    items,
    address,
    paymentMethod,
    paymentDetails = {},
    pricing,
  }) => {
    const orderId = `JE-${new Date().getFullYear()}-${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    const newOrder = {
      orderId,
      createdAt: new Date().toISOString(),
      items: [...items],
      shippingAddress: { ...address },
      paymentMethod, // 'upi' | 'card' | 'netbanking' | 'cod'
      paymentDetails,
      pricing: { ...pricing },
      status: "Confirmed",
      estimatedDelivery: new Date(
        Date.now() + 4 * 24 * 60 * 60 * 1000
      ).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      trackingSteps: [
        { title: "Order Placed", status: "completed", time: "Just now" },
        { title: "Processing & Quality Check", status: "current", time: "Expected tomorrow" },
        { title: "Dispatched from Atelier", status: "upcoming", time: "In 2 days" },
        { title: "Delivered", status: "upcoming", time: "In 3-4 days" },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrderById = (orderId) => {
    return orders.find((o) => o.orderId === orderId);
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddressId,
        setSelectedAddressId,
        getSelectedAddress,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        orders,
        createOrder,
        getOrderById,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
};
