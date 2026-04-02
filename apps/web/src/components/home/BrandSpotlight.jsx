import { useNavigate } from "react-router-dom";
import { Container } from "@cartify/ui";
import { MdArrowForward } from "react-icons/md";

const brands = [
  {
    name: "Apple",
    offer: "Up to 20% off",
    path: "/products?brand=apple",
    bg: "#f5f5f5",
    color: "#212121",
  },
  {
    name: "Samsung",
    offer: "Up to 35% off",
    path: "/products?brand=samsung",
    bg: "#e3f2fd",
    color: "#1565c0",
  },
  {
    name: "Nike",
    offer: "Up to 50% off",
    path: "/products?brand=nike",
    bg: "#fce4ec",
    color: "#c62828",
  },
  {
    name: "Sony",
    offer: "Up to 40% off",
    path: "/products?brand=sony",
    bg: "#e8f5e9",
    color: "#2e7d32",
  },
  {
    name: "LG",
    offer: "Up to 45% off",
    path: "/products?brand=lg",
    bg: "#fff8e1",
    color: "#f57f17",
  },
  {
    name: "boAt",
    offer: "Up to 60% off",
    path: "/products?brand=boat",
    bg: "#f3e5f5",
    color: "#6a1b9a",
  },
];

export default function BrandSpotlight() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-sm mb-3">
      <Container>
        <div className="pt-4 pb-1">
          <h2 className="text-[22px] font-medium text-gray-900">Top Brands</h2>
          <p className="text-[13px] text-gray-400">
            Shop from your favourite brands
          </p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 py-4">
          {brands.map((brand) => (
            <button
              key={brand.name}
              onClick={() => navigate(brand.path)}
              className="group border border-gray-200 rounded hover:border-[#2874f0] transition flex flex-col items-center py-4 px-2"
            >
              <div
                className="w-20 h-10 rounded flex items-center justify-center text-base font-semibold mb-2"
                style={{ background: brand.bg, color: brand.color }}
              >
                {brand.name}
              </div>
              <span className="text-xs text-green-600 font-medium mb-1">
                {brand.offer}
              </span>
              <span className="flex items-center gap-0.5 text-[11px] text-[#2874f0] opacity-0 group-hover:opacity-100 transition">
                Shop <MdArrowForward size={12} />
              </span>
            </button>
          ))}
        </div>
      </Container>
    </div>
  );
}
