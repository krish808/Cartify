import { useNavigate } from "react-router-dom";
import { Container } from "@cartify/ui";
import {
  MdShoppingBag,
  MdFavorite,
  MdDevices,
  MdDiamond,
} from "react-icons/md";

const ranges = [
  {
    label: "Budget Picks",
    range: "Under ₹999",
    count: "2,400+ products",
    desc: "Accessories, stationery, daily essentials & more",
    bg: "#e3f2fd",
    iconColor: "#1565c0",
    icon: MdShoppingBag,
    path: "/products?maxPrice=999",
  },
  {
    label: "Sweet Spot",
    range: "₹1,000 – ₹5,000",
    count: "8,100+ products",
    desc: "Gadgets, fashion, home decor & more",
    bg: "#fce4ec",
    iconColor: "#c62828",
    icon: MdFavorite,
    path: "/products?minPrice=1000&maxPrice=5000",
  },
  {
    label: "Mid Range",
    range: "₹5,000 – ₹20,000",
    count: "5,600+ products",
    desc: "Smartphones, laptops, appliances & more",
    bg: "#e8f5e9",
    iconColor: "#2e7d32",
    icon: MdDevices,
    path: "/products?minPrice=5000&maxPrice=20000",
  },
  {
    label: "Premium",
    range: "₹20,000 & above",
    count: "1,900+ products",
    desc: "Apple, Samsung flagships, luxury items & more",
    bg: "#fff8e1",
    iconColor: "#f57f17",
    icon: MdDiamond,
    path: "/products?minPrice=20000",
  },
];

export default function ShopByPrice() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-sm mb-3">
      <Container>
        <div className="pt-4 pb-1">
          <h2 className="text-[22px] font-medium text-gray-900">
            Shop by Price Range
          </h2>
          <p className="text-[13px] text-gray-400">
            Find the best deals for your budget
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4">
          {ranges.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.label}
                onClick={() => navigate(r.path)}
                className="relative rounded-md p-5 text-left hover:-translate-y-1 hover:shadow-md transition-all duration-200 overflow-hidden"
                style={{ background: r.bg }}
              >
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest mb-1">
                  {r.label}
                </p>
                <p className="text-xl font-medium text-gray-900 mb-1">
                  {r.range}
                </p>
                <span className="inline-block bg-black/[0.07] text-gray-600 text-xs px-2 py-0.5 rounded-full mb-2">
                  {r.count}
                </span>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  {r.desc}
                </p>
                <span className="text-sm font-medium text-[#2874f0]">
                  Shop Now →
                </span>
                <div className="absolute right-3 bottom-3 opacity-15">
                  <Icon size={64} color={r.iconColor} />
                </div>
              </button>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
