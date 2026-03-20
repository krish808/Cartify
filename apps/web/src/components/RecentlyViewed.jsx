import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container } from "@cartify/ui";
import {
  MdChevronLeft,
  MdChevronRight,
  MdSmartphone,
  MdLaptop,
  MdTv,
  MdHeadphones,
  MdWatch,
  MdCheckroom,
  MdHome,
  MdSportsSoccer,
  MdMenuBook,
  MdFaceRetouchingNatural,
  MdOutdoorGrill,
  MdShoppingBag,
} from "react-icons/md";

// Smartly pick icon + colors based on product name/category
const getCategoryStyle = (product) => {
  const text = `${product.name || ""} ${product.category || ""}`.toLowerCase();

  if (text.match(/phone|mobile|samsung|iphone|redmi|oneplus|realme/))
    return { icon: MdSmartphone, bg: "#e3f2fd", color: "#1565c0" };
  if (text.match(/laptop|macbook|computer/))
    return { icon: MdLaptop, bg: "#e8f5e9", color: "#2e7d32" };
  if (text.match(/tv|television|led|oled/))
    return { icon: MdTv, bg: "#f3e5f5", color: "#6a1b9a" };
  if (text.match(/headphone|earphone|speaker|audio|bluetooth|wireless/))
    return { icon: MdHeadphones, bg: "#fff8e1", color: "#f57f17" };
  if (text.match(/watch|wearable|band/))
    return { icon: MdWatch, bg: "#fce4ec", color: "#c62828" };
  if (text.match(/shirt|cloth|fashion|dress|shoe|running|casual|women|men/))
    return { icon: MdCheckroom, bg: "#fce4ec", color: "#c62828" };
  if (text.match(/home|furniture|dining|wooden|chair|table/))
    return { icon: MdHome, bg: "#fff8e1", color: "#e65100" };
  if (text.match(/sport|gym|fitness/))
    return { icon: MdSportsSoccer, bg: "#e8f5e9", color: "#2e7d32" };
  if (text.match(/book|novel/))
    return { icon: MdMenuBook, bg: "#e0f2f1", color: "#00695c" };
  if (text.match(/beauty|lipstick|makeup|skin|hair/))
    return { icon: MdFaceRetouchingNatural, bg: "#fce4ec", color: "#880e4f" };
  if (text.match(/kitchen|cooking|almond|food/))
    return { icon: MdOutdoorGrill, bg: "#e8eaf6", color: "#283593" };

  return { icon: MdShoppingBag, bg: "#f5f5f5", color: "#424242" };
};

export default function RecentlyViewed() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const recentItems = useSelector((state) => state.recentlyViewed?.items || []);
  const allProducts = useSelector((state) => state.products.items);
  const items = recentItems.length > 0 ? recentItems : allProducts.slice(0, 10);

  const scroll = (dir) =>
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-sm mb-3">
      <Container>
        <div className="flex items-center justify-between pt-4 pb-3">
          <div>
            <h2 className="text-[22px] font-medium text-gray-900">
              Recently Viewed
            </h2>
            <p className="text-[13px] text-gray-400">
              Pick up where you left off
            </p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="text-sm text-[#2874f0] font-medium hover:underline flex items-center gap-0.5"
          >
            See All <MdChevronRight size={18} />
          </button>
        </div>
      </Container>

      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition"
        >
          <MdChevronLeft size={22} className="text-gray-600" />
        </button>

        {/* Scrollable cards */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-3 px-10 pb-4"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((item) => {
            const { icon: Icon, bg, color } = getCategoryStyle(item);
            const discount = item.originalPrice
              ? Math.round(
                  ((item.originalPrice - item.price) / item.originalPrice) *
                    100,
                )
              : 0;

            return (
              <button
                key={item._id}
                onClick={() => navigate(`/products/${item._id}`)}
                className="flex-shrink-0 w-44 bg-white border border-gray-100 rounded-lg p-3 text-left hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
              >
                {/* Thumbnail */}
                <div
                  className="w-full h-36 rounded-md flex items-center justify-center mb-3 overflow-hidden"
                  style={{ background: bg }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <Icon size={52} color={color} style={{ opacity: 0.75 }} />
                  )}
                </div>

                {/* Name */}
                <p className="text-[13px] font-medium text-gray-800 truncate mb-1 group-hover:text-[#2874f0] transition-colors">
                  {item.name}
                </p>

                {/* Price */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm font-medium text-gray-900">
                    ₹{item.price.toLocaleString()}
                  </span>
                  {item.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{item.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Discount */}
                {discount > 0 && (
                  <span className="inline-block mt-1 text-[11px] font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                    {discount}% off
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition"
        >
          <MdChevronRight size={22} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
