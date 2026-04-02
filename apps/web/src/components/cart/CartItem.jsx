import { MdAdd, MdRemove, MdDelete, MdShoppingCart } from "react-icons/md";

export default function CartItem({
  item,
  onRemove,
  onQuantityChange,
  actionLoading,
}) {
  const product = item.product;
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <div className="bg-white rounded-sm p-5 flex gap-5 items-start">
      <div className="w-24 h-24 bg-gray-50 rounded flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-1"
          />
        ) : (
          <MdShoppingCart size={32} className="text-gray-300" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate mb-1">
          {product.name}
        </p>
        <div className="flex items-baseline gap-2 mb-3 flex-wrap">
          <span className="text-lg font-semibold text-gray-900">
            ₹{product.price?.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.originalPrice?.toLocaleString()}
            </span>
          )}
          {discount > 0 && (
            <span className="text-sm text-green-600 font-medium">
              {discount}% off
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-200 rounded-sm">
            <button
              disabled={item.quantity <= 1 || actionLoading}
              onClick={() =>
                onQuantityChange(
                  product._id || product.productId,
                  item.quantity - 1,
                )
              }
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition"
            >
              <MdRemove size={16} />
            </button>
            <span className="w-10 text-center text-sm font-medium border-x border-gray-200 py-1">
              {item.quantity}
            </span>
            <button
              disabled={actionLoading}
              onClick={() =>
                onQuantityChange(
                  product._id || product.productId,
                  item.quantity + 1,
                )
              }
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition"
            >
              <MdAdd size={16} />
            </button>
          </div>

          <button
            disabled={actionLoading}
            onClick={() => onRemove(product._id || product.productId)}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 disabled:opacity-40 transition"
          >
            <MdDelete size={15} /> Remove
          </button>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-xs text-gray-400 mb-1">Total</p>
        <p className="text-base font-semibold text-gray-900">
          ₹{(product.price * item.quantity).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
