import Login from "./pages/Login";
import Home from "./pages/Home";
import { Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import { AppLayout, Footer } from "@cartify/ui";
import Products from "./pages/Products";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/authSlice";

export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);

  const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (query) => {
    navigate(`/?search=${query}`);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
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
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <div>Dashboard</div>
            </ProtectedRoute>
          }
        />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
      <Footer />
    </>
  );
}
