import { useNavigate } from "react-router-dom";
import { Container } from "@cartify/ui";
import {
  MdSmartphone,
  MdLaptop,
  MdHome,
  MdSportsSoccer,
  MdOutlineAutoStories,
} from "react-icons/md";
import { MdCheckroom } from "react-icons/md";
import { GiLipstick, GiForkKnifeSpoon } from "react-icons/gi";

const categories = [
  {
    icon: MdSmartphone,
    label: "Mobiles",
    bg: "#e3f2fd",
    color: "#1565c0",
    path: "/products?category=mobiles",
  },
  {
    icon: MdCheckroom,
    label: "Fashion",
    bg: "#fce4ec",
    color: "#c62828",
    path: "/products?category=fashion",
  },
  {
    icon: MdLaptop,
    label: "Electronics",
    bg: "#e8f5e9",
    color: "#2e7d32",
    path: "/products?category=electronics",
  },
  {
    icon: MdHome,
    label: "Home",
    bg: "#fff8e1",
    color: "#f57f17",
    path: "/products?category=home",
  },
  {
    icon: MdSportsSoccer,
    label: "Sports",
    bg: "#f3e5f5",
    color: "#6a1b9a",
    path: "/products?category=sports",
  },
  {
    icon: MdOutlineAutoStories,
    label: "Books",
    bg: "#e0f2f1",
    color: "#00695c",
    path: "/products?category=books",
  },
  {
    icon: GiLipstick,
    label: "Beauty",
    bg: "#fff3e0",
    color: "#e65100",
    path: "/products?category=beauty",
  },
  {
    icon: GiForkKnifeSpoon,
    label: "Kitchen",
    bg: "#e8eaf6",
    color: "#283593",
    path: "/products?category=kitchen",
  },
];

export default function CategoryRow() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-sm mb-3">
      <Container>
        <div className="grid grid-cols-4 md:grid-cols-8 divide-x divide-gray-100">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.label}
                onClick={() => navigate(cat.path)}
                className="flex flex-col items-center py-5 px-2 hover:bg-gray-50 transition"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                  style={{ background: cat.bg }}
                >
                  <Icon size={28} color={cat.color} />
                </div>
                <span className="text-[13px] font-medium text-gray-800">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
