import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import { Container } from "@cartify/ui";
import ProductFilters from "../components/ProductFilters";
import { useSearchParams } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const productsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.log(err);
        setError("Failed to load Products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, min, max]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory = category ? product.category === category : true;

    const matchesMin = min ? product.price >= Number(min) : true;
    const matchesMax = max ? product.price <= Number(max) : true;

    return matchesSearch && matchesCategory && matchesMin && matchesMax;
  });

  const categories = [...new Set(products.map((p) => p.category))];

  //PAGINATION

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8 text-center">All Products</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <ProductFilters categories={categories} />
        <div className="flex-1">
          {loading && (
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}
          {!loading && error && (
            <p className="text-center text-red-500 py-10">{error}</p>
          )}
          {!loading && !error && filteredProducts.length === 0 && (
            <p className="text-center py-10">No products found</p>
          )}
          {!loading && !error && filteredProducts.length > 0 && (
            <>
              <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="font-medium">
                  Page{currentPage}/{totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
