import { MdShoppingBag } from "react-icons/md";

const STATUS_STYLES = {
  CREATED: "bg-gray-100 text-gray-600",
  PAID: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-amber-100 text-amber-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
        STATUS_STYLES[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function OrderCard({ order }) {
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-md shadow-sm p-5">
      <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
        <div>
          <p className="text-sm font-medium text-gray-800">
            Order #{order._id.slice(-6).toUpperCase()}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Placed on {orderDate}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="space-y-3">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gray-50 rounded flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
              {item.product?.images?.[0] ? (
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <MdShoppingBag size={20} className="text-gray-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 truncate">
                {item.product?.name || "Product unavailable"}
              </p>
              <p className="text-xs text-gray-400">
                Qty: {item.quantity} × ₹{item.priceAtPurchase}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        {order.discount > 0 && (
          <p className="text-xs text-green-600">
            Coupon applied: -₹{order.discount}
          </p>
        )}
        <p className="text-sm font-semibold text-gray-800 ml-auto">
          Total: ₹{order.totalAmount}
        </p>
      </div>
    </div>
  );
}
