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

  useEffect(() => {
    request("/auth/me")
      .then((payload) => setUser(payload.data))
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
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
