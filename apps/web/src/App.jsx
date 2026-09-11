import Login from "./pages/Login";
import Home from "./pages/Home";
import { Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import { AppLayout, Footer } from "@cartify/ui";
import Products from "./pages/Products";
import { useDispatch, useSelector } from "react-redux";
import { logout, clearSessionExpired } from "./store/authSlice";
import { fetchCart } from "./store/cartSlice";
import { useEffect, useMemo } from "react";
import Register from "./pages/Register";
import { Toaster, toast } from "react-hot-toast";

export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const sessionExpiredFlag = useSelector((state) => state.auth.sessionExpired);

  const cartItems = useSelector((state) => state.cart.items);
  const guestItems = useSelector((state) => state.guestCart.items);

  const authItemCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems],
  );

  const guestItemCount = useMemo(
    () => guestItems.reduce((acc, item) => acc + item.quantity, 0),
    [guestItems],
  );

  const totalItems = isAuthenticated ? authItemCount : guestItemCount;

  // ✅ Fetch server cart on app load when logged in
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  // ✅ Handle forced session expiry (set by the axios interceptor when a
  // refresh attempt fails). Distinct from manual logout — only fires when
  // the `sessionExpired` flag is explicitly set, not on every auth
  // transition, so guests browsing without ever logging in are unaffected.
  useEffect(() => {
    if (sessionExpiredFlag) {
      toast.error("Session expired. Please log in again.");
      navigate("/login");
      dispatch(clearSessionExpired());
    }
  }, [sessionExpiredFlag, navigate, dispatch]);

  const handleSearch = (query) => {
    navigate(`/products?search=${query}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      {/* Toaster - must be inside return , outside Routes */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "8px",
            fontSize: "14px",
          },
          success: {
            style: {
              background: "#f0fdf4",
              color: "#166534",
              border: "1px solid #bbf7d0",
            },
            iconTheme: {
              primary: "#16a34a",
              secondary: "#f0fdf4",
            },
          },
          error: {
            style: {
              background: "#fef2f2",
              color: "#991b1b",
              border: "1px solid #fecaca",
            },
            iconTheme: {
              primary: "#dc2626",
              secondary: "#fef2f2",
            },
          },
        }}
      />
      <AppLayout
        user={user}
        totalItems={totalItems}
        onLogout={handleLogout}
        onNavigate={navigate}
        onSearch={handleSearch}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>Dashboard</div>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}
