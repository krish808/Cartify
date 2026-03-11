import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // restore user on page reload
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);

      // merge guest cart if exists
      const guestCart = JSON.parse(localStorage.getItem("guestCart"));
      if (guestCart?.length > 0) {
        try {
          await api.post("/cart/merge", { items: guestCart });
          localStorage.removeItem("guestCart");
        } catch (err) {
          console.error("Cart merge failed:", err);
        }
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      throw err; // re-throw for UI error handling
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
