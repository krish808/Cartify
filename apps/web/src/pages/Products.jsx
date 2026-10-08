import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Container } from "@cartify/ui";
import { fetchProducts } from "../store/productSlice";
import ProductCard from "../components/product/ProductCard";
import ProductFilters from "../components/product/ProductFilters";
import { MdSearchOff } from "react-icons/md";
import ProductCardSkeleton from "../components/product/ProductCardSkeleton";

export default function Products() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.products);

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
  }, [dispatch, products.length]);

  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const search = searchParams.get("search");
  const minPrice = searchParams.get("min");
  const maxPrice = searchParams.get("max");

  // ✅ derive the available categories from whatever products actually exist,
  // so the filter dropdown never shows a category with zero real products
  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category).filter(Boolean));
    return [...unique].sort();
  }, [products]);

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

  const pageTitle = search
    ? `Results for "${search}"`
    : category
      ? `${category.charAt(0).toUpperCase() + category.slice(1)}`
      : "All Products";

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-4">
      <Container>
        <h1 className="text-2xl font-medium text-gray-800 mb-4">{pageTitle}</h1>

        <div className="flex flex-col md:flex-row gap-4">
          <ProductFilters categories={categories} />

          <div className="flex-1">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-md mb-4">
                {error}
              </div>
            )}

            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            )}

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

            {!loading && filtered.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
