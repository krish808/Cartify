import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../store/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  if (!cart.items.length) {
    return <h2 className="text-center mt-10">Your cart is empty</h2>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

      {cart.items.map((item) => (
        <div key={item.product._id} className="border p-4 mb-4 rounded">
          <h4 className="font-semibold">{item.product.name}</h4>

          <p>Price: ₹{item.product.price}</p>

          <p>Quantity: {item.quantity}</p>

          <button
            onClick={() => dispatch(removeFromCart(item.product._id))}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
