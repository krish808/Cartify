import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "@cartify/ui";
import { MdAccessTime } from "react-icons/md";
import { fetchProducts } from "../store/productSlice";

function useCountdown(initialSeconds = 8 * 3600 + 34 * 60 + 21) {
  const [remaining, setRemaining] = useState(initialSeconds);
  useEffect(() => {
    const t = setInterval(() => setRemaining((r) => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  return {
    h: String(Math.floor(remaining / 3600)).padStart(2, "0"),
    m: String(Math.floor((remaining % 3600) / 60)).padStart(2, "0"),
    s: String(remaining % 60).padStart(2, "0"),
  };
}

function TimerBox({ value }) {
  return (
    <span className="bg-gray-900 text-white text-sm font-medium px-2 py-1 rounded-sm min-w-9 text-center inline-block">
      {value}
    </span>
  );
}

export default function DealOfTheDay() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { h, m, s } = useCountdown();
  const { items: products, loading } = useSelector((state) => state.products);
  const deals = products.slice(0, 5);

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
  }, [dispatch, products.length]);

  return (
    <div className="bg-white rounded-sm">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between pt-4 pb-1">
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-medium text-gray-900">
              Deal of the Day
            </h2>
            <span className="bg-red-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-sm tracking-wide">
              LIVE
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MdAccessTime size={16} className="text-gray-400" />
            <span className="text-gray-500">Ends in</span>
            <TimerBox value={h} />
            <span className="text-red-500 font-medium">:</span>
            <TimerBox value={m} />
            <span className="text-red-500 font-medium">:</span>
            <TimerBox value={s} />
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-5 mt-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4">
                <div className="h-36 bg-gray-100 animate-pulse rounded mb-3" />
                <div className="h-3 bg-gray-100 animate-pulse rounded mb-2" />
                <div className="h-3 bg-gray-100 animate-pulse rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-gray-100 mt-3">
            {deals.map((product) => {
              const discount = product.originalPrice
                ? Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100,
                  )
                : product.discount || 0;
              return (
                <button
                  key={product._id}
                  onClick={() => navigate(`/products/${product._id}`)}
                  className="flex flex-col items-center px-3 py-4 hover:bg-gray-50 transition"
                >
                  <div className="w-full h-36 bg-gray-50 rounded flex items-center justify-center mb-3 overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-full" />
                    )}
                  </div>
                  <p className="text-[13px] font-medium text-gray-800 mb-1 w-full truncate text-center">
                    {product.name}
                  </p>
                  <p className="text-[13px] text-green-700 font-medium">
                    {product.originalPrice && (
                      <span className="text-gray-400 line-through text-xs mr-1">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                    ₹{product.price.toLocaleString()}
                  </p>
                  {discount > 0 && (
                    <p className="text-xs text-green-600 font-medium mt-0.5">
                      {discount}% off
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <button
          onClick={() => navigate("/products")}
          className="block w-full my-4 text-center bg-[#2874f0] text-white text-sm font-medium py-3 rounded-sm hover:bg-[#1a5dc8] transition"
        >
          View All Deals
        </button>
      </Container>
    </div>
  );
}
