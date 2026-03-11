import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
  });

  const [loading, setLoading] = useState(false);

  // 🟢 CALCULATE TOTAL FOR GUEST
  const calculateGuestTotal = (items) => {
    let total = 0;

    for (const item of items) {
      if (item.price) {
        total += item.price * item.quantity;
      }
    }

    return total;
  };

  // 🟢 FETCH CART
  const fetchCart = async () => {
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

      setCart({
        items: guestCart,
        totalAmount: calculateGuestTotal(guestCart),
      });

      return;
    }

    try {
      const { data } = await api.get("/api/cart");
      setCart(data);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  // 🟢 MERGE GUEST CART AFTER LOGIN
  const mergeGuestCart = async () => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

    if (!user || guestCart.length === 0) return;

    try {
      for (const item of guestCart) {
        await api.post("/api/cart", {
          productId: item.productId,
          quantity: item.quantity,
        });
      }

      localStorage.removeItem("guestCart");
      fetchCart();
    } catch (error) {
      console.error("Merge error:", error.message);
    }
  };

  // 🟢 ADD TO CART
  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

      const existing = guestCart.find((item) => item.productId === product._id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        guestCart.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity,
        });
      }

      localStorage.setItem("guestCart", JSON.stringify(guestCart));

      setCart({
        items: guestCart,
        totalAmount: calculateGuestTotal(guestCart),
      });

      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/api/cart", {
        productId: product._id,
        quantity,
      });

      setCart(data);
    } catch (error) {
      console.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 REMOVE FROM CART
  const removeFromCart = async (productId) => {
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

      const updated = guestCart.filter((item) => item.productId !== productId);

      localStorage.setItem("guestCart", JSON.stringify(updated));

      setCart({
        items: updated,
        totalAmount: calculateGuestTotal(updated),
      });

      return;
    }

    try {
      const { data } = await api.delete(`/api/cart/${productId}`);
      setCart(data);
    } catch (error) {
      console.error(error.response?.data?.message);
    }
  };

  // 🔥 AUTO LOAD
  useEffect(() => {
    fetchCart();
  }, [user]);

  // 🔥 AUTO MERGE AFTER LOGIN
  useEffect(() => {
    if (user) {
      mergeGuestCart();
    }
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
