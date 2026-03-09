import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Restore user on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setUser(res.data.user);

    const guestCart = JSON.parse(localStorage.getItem("guestCart"));

    if (guestCart && guestCart.length > 0) {
      await api.post("/cart/merge", { items: guestCart });

      localStorage.removeItem("guestCart");
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
