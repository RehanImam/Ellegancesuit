import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const API_BASE_URL = "https://auth-backend-gules.vercel.app/api/v1";

const getErrorMessage = (payload, fallback) =>
  payload?.message || payload?.errors?.[0]?.msg || fallback;

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(getErrorMessage(payload, "Authentication request failed"));
  }
  return payload;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const adminEmail = (process.env.REACT_APP_ADMIN_EMAIL || "shopowner@ellegancesuit.com").toLowerCase();

  const fetchUser = () =>
    request("/auth/me")
      .then((payload) => setUser(payload.data))
      .catch(() => setUser(null));

  useEffect(() => {
    fetchUser().finally(() => setAuthLoading(false));
  }, []);

  const login = async (credentials) => {
    const payload = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    setUser(payload.data.user);
    return payload;
  };

  const register = async ({ fullName, email, password }) => {
    const username = fullName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    const payload = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
    return payload;
  };

  const logout = async () => {
    await request("/auth/logout", { method: "POST" });
    setUser(null);
  };

  const verifyEmail = async (token) => {
    if (!token) {
      throw new Error("Verification token is missing.");
    }

    const payload = await request(`/auth/verify-email/${encodeURIComponent(token)}`);
    return payload;
  };

  const startGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  // --- Profile Management ---
 const updateProfile = async ({ username, gender }) => {
  const token = localStorage.getItem("accessToken");
  const headers = { "Content-Type": "application/json" };
  
  // Only attach if it's a real token, otherwise rely on the cookie!
  if (token && token !== "null") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const payload = await request("/auth/profile", {
    method: "PATCH",
    credentials: "include", // This ensures your secure cookie is sent
    body: JSON.stringify({ username, gender }),
    headers,
  });
  
  setUser(payload.data);
  return payload;
};

  const changeEmail = async (newEmail) => {
    const payload = await request("/auth/change-email", {
      method: "PATCH",
      body: JSON.stringify({ newEmail }),
    });
    // Re-fetch user to get updated email
    await fetchUser();
    return payload;
  };

  const requestPasswordReset = async (email) => {
    const payload = await request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    return payload;
  };

  // --- Address Management ---
  const createAddress = async (addressData) => {
    const payload = await request("/addresses", {
      method: "POST",
      body: JSON.stringify(addressData),
    });
    return payload;
  };

  const getAddresses = async () => {
    const payload = await request("/addresses", {
      method: "GET",
    });
    return payload;
  };

  const updateAddress = async (addressId, addressData) => {
    const payload = await request(`/addresses/${addressId}`, {
      method: "PATCH",
      body: JSON.stringify(addressData),
    });
    return payload;
  };

  const deleteAddress = async (addressId) => {
    const payload = await request(`/addresses/${addressId}`, {
      method: "DELETE",
    });
    return payload;
  };

  const setDefaultAddress = async (addressId) => {
    const payload = await request(`/addresses/${addressId}/set-default`, {
      method: "PATCH",
    });
    return payload;
  };

  // --- Order Management ---
  const createOrder = async (orderData) => {
    const payload = await request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
    return payload;
  };

  const getOrderHistory = async () => {
    const payload = await request("/orders", {
      method: "GET",
    });
    return payload;
  };

  const getOrderById = async (orderId) => {
    const payload = await request(`/orders/${orderId}`, {
      method: "GET",
    });
    return payload;
  };

  const cancelOrder = async (orderId) => {
    const payload = await request(`/orders/${orderId}/cancel`, {
      method: "PATCH",
    });
    return payload;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user),
        isAdmin: Boolean(user?.isAdmin) || user?.email?.toLowerCase() === adminEmail,
        authLoading,
        login,
        register,
        logout,
        verifyEmail,
        startGoogleLogin,
        updateProfile,
        changeEmail,
        requestPasswordReset,
        createAddress,
        getAddresses,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        createOrder,
        getOrderHistory,
        getOrderById,
        cancelOrder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
