import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@cartify/ui";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  clearCart,
  fetchCart,
  removeFromCart,
  updateQuantity,
} from "../store/cartSlice";
import {
  clearGuestCart,
  removeGuestItem,
  updateGuestQuantity,
} from "../store/guestCartSlice.js";
import EmptyCart from "../components/cart/EmptyCart.jsx";
import CartSkeleton from "../components/cart/CartSkeleton.jsx";
import CartItem from "../components/cart/CartItem.jsx";
import PriceSummary from "../components/cart/PriceSummary.jsx";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Server cart
  const { items, totalAmount, loading, actionLoading, error } = useSelector(
    (state) => state.cart,
  );

  // Guest cart
  const guestCartItems = useSelector((state) => state.guestCart.items);
  const guestTotalAmount = guestCartItems.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart());
  }, [dispatch, isAuthenticated]);

  // ── Logged in handlers ──
  const handleQuantityChange = (productId, quantity) => {
    dispatch(updateQuantity({ productId, quantity }));
  };
  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  // ── Guest handlers ──
  const handleGuestQuantityChange = (productId, quantity) => {
    dispatch(updateGuestQuantity({ productId, quantity }));
  };
  const handleGuestRemove = (productId) => {
    dispatch(removeGuestItem(productId));
  };

  // ── Render guest cart ──
  if (!isAuthenticated) {
    return (
      <div className="bg-[#f1f3f6] min-h-screen py-4">
        <Container>
          {/* ✅ Guest banner */}
          <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-3 rounded-md mb-4 flex items-center justify-between">
            <span>
              🛒 You're shopping as a guest. Login to save your cart and place
              orders.
            </span>
            <button
              onClick={() => navigate("/login")}
              className="ml-4 bg-[#2874f0] text-white text-xs font-semibold px-4 py-1.5 rounded-sm hover:bg-[#1a5dc8] transition shrink-0"
            >
              Login Now
            </button>
          </div>

          <h1 className="text-2xl font-medium text-gray-800 mb-4">
            Shopping Cart
            {guestCartItems.length > 0 && (
              <span className="text-base font-normal text-gray-400 ml-2">
                ({guestCartItems.length}{" "}
                {guestCartItems.length === 1 ? "item" : "items"})
              </span>
            )}
          </h1>

          {guestCartItems.length === 0 ? (
            <EmptyCart onShop={() => navigate("/products")} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-3">
                {guestCartItems.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    onRemove={handleGuestRemove}
                    onQuantityChange={handleGuestQuantityChange}
                    actionLoading={false}
                  />
                ))}
                <div className="flex justify-end">
                  <button
                    onClick={() => dispatch(clearGuestCart())}
                    className="text-xs text-red-400 hover:text-red-600 transition flex items-center gap-1"
                  >
                    <MdDelete size={14} /> Clear Cart
                  </button>
                </div>
              </div>
              <div className="lg:col-span-1">
                <PriceSummary
                  items={guestCartItems}
                  totalAmount={guestTotalAmount}
                  onCheckout={() => navigate("/login")}
                  actionLoading={false}
                  isGuest={true}
                />
              </div>
            </div>
          )}
        </Container>
      </div>
    );
  }

  // ── Render logged in cart ──
  return (
    <div className="bg-[#f1f3f6] min-h-screen py-4">
      <Container>
        <h1 className="text-2xl font-medium text-gray-800 mb-4">
          Shopping Cart
          {items.length > 0 && (
            <span className="text-base font-normal text-gray-400 ml-2">
              ({items.length} {items.length === 1 ? "item" : "items"})
            </span>
          )}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <CartSkeleton />
        ) : items.length === 0 ? (
          <EmptyCart onShop={() => navigate("/products")} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <CartItem
                  key={item.product._id}
                  item={item}
                  onRemove={handleRemove}
                  onQuantityChange={handleQuantityChange}
                  actionLoading={actionLoading}
                />
              ))}
              <div className="flex justify-end">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="text-xs text-red-400 hover:text-red-600 transition flex items-center gap-1"
                >
                  <MdDelete size={14} /> Clear Cart
                </button>
              </div>
            </div>
            <div className="lg:col-span-1">
              <PriceSummary
                items={items}
                totalAmount={totalAmount}
                onCheckout={() => navigate("/checkout")}
                actionLoading={actionLoading}
                isGuest={false}
              />
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
