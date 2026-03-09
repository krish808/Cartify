import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  if (!cart.items.length) {
    return <h2>Your cart is empty</h2>;
  }

  return (
    <div>
      <h2>Shopping Cart</h2>

      {cart.items.map((item) => (
        <div key={item.product._id}>
          <h4>{item.product.name}</h4>
          <p>Price: ₹{item.product.price}</p>
          <p>Quantity: {item.quantity}</p>

          <button onClick={() => removeFromCart(item.product._id)}>
            Remove
          </button>
        </div>
      ))}

      <h3>Total: ₹{cart.totalAmount}</h3>
    </div>
  );
}
