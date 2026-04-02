import { MdShoppingCart } from "react-icons/md";

export default function EmptyCart({ onShop }) {
  return (
    <div className="bg-white rounded-sm flex flex-col items-center justify-center py-20 px-6 text-center">
      <MdShoppingCart size={80} className="text-gray-200 mb-4" />
      <h3 className="text-xl font-medium text-gray-700 mb-2">
        Your cart is empty
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        Add items to it now and shop to your heart's content.
      </p>
      <button
        onClick={onShop}
        className="bg-[#2874f0] text-white text-sm font-medium px-10 py-3 rounded-sm hover:bg-[#1a5dc8] transition"
      >
        Shop Now
      </button>
    </div>
  );
}
