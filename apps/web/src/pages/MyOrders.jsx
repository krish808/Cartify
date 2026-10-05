import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container } from "@cartify/ui";
import { MdShoppingBag } from "react-icons/md";
import { fetchMyOrders } from "../store/orderSlice";
import OrderCard from "../components/orders/OrderCard";

export const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    items: orders,
    loading,
    error,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <div className="min-min-screen bg-[#f1f3f6] py-6">
      <Container>
        <h1 className="text-2xl font-medium text-gray-800 mb-6 ">My Orders</h1>
        {loading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-md shadow-sm p-5 animate-pulse"
              >
                <div className="h-4 bg-gray-100 rounded w-1/3 mb-4" />
                <div className="h-4 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        {!loading && !error && orders.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <MdShoppingBag size={40} className=" text-gray-300 mb-3" />
            <p className="text-gray-500 mb-4">
              You haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-[#2874f0] text-white text-sm font-medium px-6 py-2.5 rounded-md hover:bg-[#1a5dc8] transition"
            >
              Start Shopping
            </button>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};
