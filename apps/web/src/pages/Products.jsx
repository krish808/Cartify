import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Container } from "@cartify/ui"; // ✅ was missing
import { fetchProducts } from "../store/productSlice";
import ProductCard from "../components/ProductCard";
import { MdSearchOff } from "react-icons/md";
import ProductCardSkeleton from "../components/ProductCardSkeleton";

export default function Products() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.products);

  // ✅ Only fetch if store is empty
  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
  }, [dispatch, products.length]);

  // ✅ Client-side filtering from URL params
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const search = searchParams.get("search");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const filtered = products.filter((p) => {
    if (category && p.category?.toLowerCase() !== category.toLowerCase())
      return false;
    if (brand && p.brand?.toLowerCase() !== brand.toLowerCase()) return false;
    if (search && !p.name?.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    return true;
  });

  // Page title
  const pageTitle = search
    ? `Results for "${search}"`
    : category
      ? `${category.charAt(0).toUpperCase() + category.slice(1)}`
      : "All Products";

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-4">
      <Container>
        <h1 className="text-2xl font-medium text-gray-800 mb-4">{pageTitle}</h1>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MdSearchOff size={64} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-1">
              No products found
            </h3>
            <p className="text-sm text-gray-400">
              Try adjusting your search or filter
            </p>
          </div>
        )}

        {/* ✅ Product grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
