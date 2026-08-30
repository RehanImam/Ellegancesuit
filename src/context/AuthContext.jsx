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
    const payload = await request("/auth/profile", {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({ username, gender }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      },

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

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user),
        authLoading,
        login,
        register,
        logout,
        verifyEmail,
        startGoogleLogin,
        updateProfile,
        changeEmail,
        requestPasswordReset,
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
