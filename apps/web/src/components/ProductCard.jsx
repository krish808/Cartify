import { Link } from "react-router-dom";
import { Button, Card } from "@cartify/ui";

export default function ProductCard({ product }) {
  return (
    <Card className="p-5 transition-all duration-300 hver:shadow-xl hover:-translate-y-2">
      <div className="bg-gray-100 h-48 flex items-center justify-center mb-4 rounded-md overflw-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain p-4"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-blue-600 font-bold mb-4">$ {product.price}</p>

      <Link to={`/products/${product._id}`}>
        <Button className="w-full">View Details</Button>
      </Link>
    </Card>
  );
}
