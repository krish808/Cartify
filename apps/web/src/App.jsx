import Login from "./pages/Login";
import Home from "./pages/Home";
import { Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import { AppLayout, Footer } from "@cartify/ui";
import { useCart } from "./context/CartContext";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (query) => {
    navigate(`/?search=${query}`);
  };

  return (
    <>
      <AppLayout
        user={user}
        totalItems={totalItems}
        onLogout={logout}
        onNavigate={navigate}
        onSearch={handleSearch}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <div>Dashboard</div>
            </ProtectedRoute>
          }
        />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
      <Footer />
    </>
  );
}
