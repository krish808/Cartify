import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Button } from "@cartify/ui";
import { MdStar, MdAddShoppingCart } from "react-icons/md";
import { fetchProducts } from "../../store/productSlice";
import { addToCart } from "../../store/cartSlice";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : product.discount || 0;

  return (
    <div
      className="border-r border-b border-gray-100 p-4 hover:bg-gray-50 transition cursor-pointer"
      onClick={() => navigate(`/products/${product._id}`)}
    >
      <div className="w-full h-44 bg-gray-50 rounded flex items-center justify-center mb-3 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-200 rounded-full" />
        )}
      </div>

      <p className="text-sm font-medium text-gray-900 truncate mb-1">
        {product.name}
      </p>
      <p className="text-xs text-gray-400 mb-2 truncate">
        {product.description}
      </p>

      {product.rating && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="bg-green-700 text-white text-[11px] font-medium px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
            {product.rating} <MdStar size={11} />
          </span>
          {product.reviews && (
            <span className="text-xs text-gray-400">
              ({product.reviews.toLocaleString()})
            </span>
          )}
        </div>
      )}

      <div className="flex items-baseline gap-1 flex-wrap mb-3">
        <span className="text-base font-medium text-gray-900">
          ₹{product.price.toLocaleString()}
        </span>
        {product.originalPrice && (
          <span className="text-xs text-gray-400 line-through">
            ₹{product.originalPrice.toLocaleString()}
          </span>
        )}
        {discount > 0 && (
          <span className="text-xs text-green-600 font-medium">
            {discount}% off
          </span>
        )}
      </div>

      <Button
        variant="outline"
        className="w-full text-xs py-1.5 text-[#2874f0] border-[#2874f0] hover:bg-blue-50 flex items-center justify-center gap-1.5"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(addToCart({ ...product, quantity: 1 }));
        }}
      >
        <MdAddShoppingCart size={15} />
        Add to Cart
      </Button>
    </div>
  );
}

export default function ProductGrid() {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
  }, [dispatch, products.length]);

  return (
    <div className="bg-white rounded-sm mb-3">
      <Container>
        <div className="pt-4 pb-1">
          <h2 className="text-[22px] font-medium text-gray-900">
            Recommended For You
          </h2>
          <p className="text-[13px] text-gray-400">
            Based on your browsing history
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 mt-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="p-4">
                <div className="h-44 bg-gray-100 animate-pulse rounded mb-3" />
                <div className="h-3 bg-gray-100 animate-pulse rounded mb-2" />
                <div className="h-3 bg-gray-100 animate-pulse rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 mt-3">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
