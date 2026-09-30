import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container } from "@cartify/ui";
import toast from "react-hot-toast";
import { checkout, resetCheckoutState } from "../store/checkoutSlice";
import { fetchCart } from "../store/cartSlice";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, totalAmount } = useSelector((state) => state.cart);
  const { loading, error, lastOrders } = useSelector((state) => state.checkout);

  const [couponCode, setCouponCode] = useState("");
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetCheckoutState());
    };
  }, [dispatch]);

  const handlePlaceOrder = async () => {
    const result = await dispatch(checkout(couponCode || undefined));
    if (checkout.fulfilled.match(result)) {
      toast.success("Order placed successfully!");
      setPlaced(true);
    }
  };

  if (placed && lastOrders.length > 0) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] py-8">
        <Container>
          <div className="bg-white rounded-xl shadow p-8 max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Order placed! 🎉
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              {lastOrders.length === 1
                ? "Your order has been placed."
                : `Your order was split into ${lastOrders.length} orders since items came from different sellers.`}
            </p>

            <div className="space-y-3 text-left">
              {lastOrders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-200 rounded-md p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.items.length} item
                      {order.items.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    ₹{order.totalAmount}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/products")}
              className="mt-8 bg-[#2874f0] text-white text-sm font-medium px-6 py-2.5 rounded-md hover:bg-[#1a5dc8] transition"
            >
              Continue Shopping
            </button>
          </div>
        </Container>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] py-8">
        <Container>
          <div className="bg-white rounded-xl shadow p-8 max-w-md mx-auto text-center">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-[#2874f0] text-white text-sm font-medium px-6 py-2.5 rounded-md hover:bg-[#1a5dc8] transition"
            >
              Browse Products
            </button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-8">
      <Container>
        <h1 className="text-2xl font-medium text-gray-800 mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-white rounded-md shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                Order Items
              </h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex justify-between items-center text-sm"
                  >
                    <div>
                      <p className="text-gray-700">{item.product.name}</p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-gray-800 font-medium">
                      ₹{item.product.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-md shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                Payment Method
              </h2>
              <p className="text-sm text-gray-500">Cash on Delivery (COD)</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-md shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                Have a coupon?
              </h2>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0]/30 mb-3"
              />

              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>

              {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-4 bg-[#fb641b] hover:bg-[#e05a18] disabled:bg-orange-300 text-white font-semibold py-2.5 rounded-md text-sm transition"
              >
                {loading ? "Placing order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
