import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchProducts } from "../store/productSlice";

import ProductCard from "../components/ProductCard";

export default function Products() {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8 text-center">All Products</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </Container>
  );
}
