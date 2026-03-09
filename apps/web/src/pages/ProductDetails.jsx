import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { Card, Button, Container } from "@cartify/ui";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <Container>
        <p className="py-10 text-center">Loading...</p>
      </Container>
    );

  if (!product)
    return (
      <Container>
        <p className="py-10 text-center">Product not found</p>
      </Container>
    );

  return (
    <Container>
      <Card className="p-8 mt-10">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left Side - Product Image */}
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain p-6"
              />
            ) : (
              <span className="text-gray-400">No Image Available</span>
            )}
          </div>

          {/* Right Side - Product Info */}
          <div>
            <h2 className="text-3xl font-bold mb-4">{product.name}</h2>

            <p className="text-2xl text-blue-600 font-semibold mb-6">
              ${product.price}
            </p>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            <p className="mb-6">
              <span className="font-medium">Stock:</span> {product.stock}
            </p>

            <Button>Add to Cart</Button>
          </div>
        </div>
      </Card>
    </Container>
  );
}
