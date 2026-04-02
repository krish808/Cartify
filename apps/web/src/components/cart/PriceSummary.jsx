import {
  MdArrowForward,
  MdSecurity,
  MdLocalShipping,
  MdRefresh,
} from "react-icons/md";

export default function PriceSummary({
  items,
  totalAmount,
  onCheckout,
  actionLoading,
  isGuest,
}) {
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalMRP = items.reduce(
    (sum, i) => sum + (i.product.originalPrice || i.product.price) * i.quantity,
    0,
  );
  const totalDiscount = totalMRP - totalAmount;
  const delivery = totalAmount > 500 ? 0 : 40;
  const finalAmount = totalAmount + delivery;

  return (
    <div className="bg-white rounded-sm p-5 sticky top-20">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-widest pb-3 border-b border-gray-100">
        Price Details
      </h3>

      <div className="space-y-3 py-4 text-sm border-b border-gray-100">
        <div className="flex justify-between text-gray-700">
          <span>
            Price ({totalItems} {totalItems === 1 ? "item" : "items"})
          </span>
          <span>₹{totalMRP.toLocaleString()}</span>
        </div>
        {totalDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>− ₹{totalDiscount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-700">
          <span>Delivery Charges</span>
          {delivery === 0 ? (
            <span className="text-green-600 font-medium">FREE</span>
          ) : (
            <span>₹{delivery}</span>
          )}
        </div>
      </div>

      <div className="flex justify-between font-semibold text-base py-4 border-b border-gray-100">
        <span>Total Amount</span>
        <span>₹{finalAmount.toLocaleString()}</span>
      </div>

      {totalDiscount > 0 && (
        <p className="text-green-600 text-sm font-medium pt-3 pb-1">
          You save ₹{totalDiscount.toLocaleString()} on this order 🎉
        </p>
      )}

      {/* ✅ Guest sees login prompt instead of place order */}
      {isGuest ? (
        <button
          onClick={onCheckout}
          className="mt-4 w-full bg-[#2874f0] hover:bg-[#1a5dc8] text-white font-semibold py-3 rounded-sm flex items-center justify-center gap-2 transition"
        >
          Login to Place Order <MdArrowForward size={18} />
        </button>
      ) : (
        <button
          onClick={onCheckout}
          disabled={actionLoading}
          className="mt-4 w-full bg-[#fb641b] hover:bg-[#e05a18] disabled:bg-orange-300 text-white font-semibold py-3 rounded-sm flex items-center justify-center gap-2 transition"
        >
          Place Order <MdArrowForward size={18} />
        </button>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <MdSecurity size={14} className="text-green-500" /> Safe and Secure
          Payments
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <MdLocalShipping size={14} className="text-[#2874f0]" />
          {delivery === 0
            ? "Free delivery on this order"
            : "Free delivery above ₹500"}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <MdRefresh size={14} className="text-orange-400" /> Easy 7-day returns
        </div>
      </div>
    </div>
  );
}
