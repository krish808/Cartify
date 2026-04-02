import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@cartify/ui";
import {
  MdStar,
  MdAddShoppingCart,
  MdArrowBack,
  MdLocalShipping,
  MdSecurity,
  MdRefresh,
} from "react-icons/md";
import { fetchProductById, clearSelectedProduct } from "../store/productSlice";
import { addToCart } from "../store/cartSlice";
import { addGuestItem } from "../store/guestCartSlice"; // ✅ added
import ProductDetailSkeleton from "../components/product/ProductDetailSkeleton";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedProduct: product,
    detailLoading: loading,
    detailError: error,
  } = useSelector((state) => state.products);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // ✅ added

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearSelectedProduct());
  }, [id, dispatch]);

  // ✅ fully fixed
  const handleAddToCart = () => {
    if (!product) return;

    if (isAuthenticated) {
      // logged in → add to server cart
      dispatch(addToCart({ productId: product._id, quantity: 1 }));
    } else {
      // guest → save to localStorage cart
      dispatch(
        addGuestItem({
          productId: product._id,
          quantity: 1,
          product, // store full product so guest cart can display it
        }),
      );
    }
  };

  const discount = product?.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-4">
      <Container>
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#2874f0] transition mb-2"
        >
          <MdArrowBack size={18} /> Back to Products
        </button>

        {/* Loading */}
        {loading && <ProductDetailSkeleton />}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-md mt-4">
            {error}
          </div>
        )}

        {/* Product */}
        {!loading && product && (
          <div className="bg-white rounded-xl shadow-sm mt-2 p-6 md:p-10">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              {/* ── Left: Image ── */}
              <div className="bg-gray-50 rounded-xl h-96 flex items-center justify-center overflow-hidden border border-gray-100">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain p-6"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-300">
                    <MdAddShoppingCart size={64} />
                    <p className="text-sm mt-2">No Image Available</p>
                  </div>
                )}
              </div>

              {/* ── Right: Info ── */}
              <div>
                {/* Category badge */}
                {product.category && (
                  <span className="text-xs font-medium text-[#2874f0] bg-blue-50 px-2 py-1 rounded mb-3 inline-block">
                    {product.category}
                  </span>
                )}

                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  {product.name}
                </h1>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-medium px-2 py-0.5 rounded">
                      {product.rating} <MdStar size={12} />
                    </span>
                    {product.reviews && (
                      <span className="text-xs text-gray-400">
                        {product.reviews.toLocaleString()} ratings
                      </span>
                    )}
                  </div>
                )}

                <div className="border-t border-gray-100 pt-4 mb-4">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-3xl font-semibold text-gray-900">
                      ₹{product.price?.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-base text-gray-400 line-through">
                        ₹{product.originalPrice?.toLocaleString()}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="text-base font-medium text-green-600">
                        {discount}% off
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Inclusive of all taxes
                  </p>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                  {product.description}
                </p>

                {/* Stock */}
                <p className="text-sm mb-5">
                  <span className="font-medium text-gray-700">
                    Availability:{" "}
                  </span>
                  {product.stock > 0 ? (
                    <span className="text-green-600 font-medium">
                      In Stock ({product.stock} left)
                    </span>
                  ) : (
                    <span className="text-red-500 font-medium">
                      Out of Stock
                    </span>
                  )}
                </p>

                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex items-center gap-2 bg-[#ff9f00] hover:bg-[#e8900a] disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold px-8 py-3 rounded-sm transition"
                  >
                    <MdAddShoppingCart size={20} />
                    {isAuthenticated ? "Add to Cart" : "Add to Cart (Guest)"}
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex items-center gap-2 bg-[#fb641b] hover:bg-[#e05a18] disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold px-8 py-3 rounded-sm transition"
                  >
                    Buy Now
                  </button>
                </div>

                {/* ✅ Guest nudge */}
                {!isAuthenticated && (
                  <p className="text-xs text-gray-400 mt-3">
                    💡{" "}
                    <button
                      onClick={() => navigate("/login")}
                      className="text-[#2874f0] underline hover:text-[#1a5dc8]"
                    >
                      Login
                    </button>{" "}
                    to save your cart across devices.
                  </p>
                )}

                {/* Delivery perks */}
                <div className="mt-6 border-t border-gray-100 pt-5 grid grid-cols-3 gap-3">
                  {[
                    { icon: MdLocalShipping, text: "Free Delivery" },
                    { icon: MdRefresh, text: "7 Day Return" },
                    { icon: MdSecurity, text: "Secure Pay" },
                  ].map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      className="flex flex-col items-center text-center gap-1"
                    >
                      <Icon size={22} className="text-[#2874f0]" />
                      <span className="text-xs text-gray-500">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
