import { useNavigate } from "react-router-dom";
import { Container } from "@cartify/ui";
import { MdCheckroom } from "react-icons/md";
import { MdFlashOn } from "react-icons/md";

const banners = [
  {
    eyebrow: "New Arrivals",
    title: "Summer Fashion\nCollection 2026",
    cta: "Shop Now",
    bg: "#ffe0b2",
    icon: MdCheckroom,
    iconColor: "#e65100",
    path: "/products?category=fashion",
  },
  {
    eyebrow: "Best Sellers",
    title: "Top Gadgets\nUnder ₹999",
    cta: "Explore",
    bg: "#e8f5e9",
    icon: MdFlashOn,
    iconColor: "#2e7d32",
    path: "/products?maxPrice=999",
  },
];

export default function PromoBanners() {
  const navigate = useNavigate();

  return (
    <div className="mb-3">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {banners.map((b) => {
            const Icon = b.icon;
            return (
              <button
                key={b.title}
                onClick={() => navigate(b.path)}
                className="relative rounded-sm overflow-hidden h-40 flex items-center px-6 text-left hover:opacity-95 transition"
                style={{ background: b.bg }}
              >
                <div className="z-10">
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest mb-1">
                    {b.eyebrow}
                  </p>
                  <h3 className="text-xl font-medium text-gray-900 mb-2 whitespace-pre-line leading-snug">
                    {b.title}
                  </h3>
                  <span className="text-sm font-medium text-[#2874f0]">
                    {b.cta} →
                  </span>
                </div>
                <div className="absolute right-6 opacity-20">
                  <Icon size={96} color={b.iconColor} />
                </div>
              </button>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
