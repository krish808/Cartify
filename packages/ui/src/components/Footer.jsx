import { MdPhone, MdEmail, MdLocationOn, MdShoppingCart } from "react-icons/md";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaGooglePlay,
  FaApple,
} from "react-icons/fa";

const links = {
  Company: ["About Us", "Careers", "Blog", "Press", "Contact"],
  Help: [
    "Help Center",
    "Returns",
    "Shipping Info",
    "Track Order",
    "Privacy Policy",
  ],
  Policy: [
    "Terms of Use",
    "Cookie Policy",
    "Sitemap",
    "Accessibility",
    "Advertise",
  ],
};

const socials = [
  { icon: FaFacebookF, href: "#", label: "Facebook", bg: "#1877f2" },
  { icon: FaInstagram, href: "#", label: "Instagram", bg: "#e1306c" },
  { icon: FaTwitter, href: "#", label: "Twitter", bg: "#1da1f2" },
  { icon: FaYoutube, href: "#", label: "YouTube", bg: "#ff0000" },
];

export default function Footer() {
  return (
    <footer className="bg-[#172337] text-gray-400">
      {/* ── Top strip ── */}
      <div className="bg-[#1e2f45] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm flex-wrap">
            <span className="flex items-center gap-2 text-gray-300">
              <MdPhone size={16} className="text-[#2874f0]" />
              1800-123-4567
            </span>
            <span className="flex items-center gap-2 text-gray-300">
              <MdEmail size={16} className="text-[#2874f0]" />
              support@cartify.com
            </span>
            <span className="flex items-center gap-2 text-gray-300">
              <MdLocationOn size={16} className="text-[#2874f0]" />
              Hyderabad, India
            </span>
          </div>
          <div className="flex items-center gap-2">
            {socials.map(({ icon: Icon, href, label, bg }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-full flex items-center justify-center transition hover:scale-110"
                style={{ background: bg }}
              >
                <Icon size={14} className="text-white" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand column */}
        <div className="col-span-2 md:col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <MdShoppingCart size={24} className="text-[#2874f0]" />
            <h2 className="text-xl font-bold text-white tracking-wide">
              Cartify
            </h2>
          </div>
          <p className="text-xs text-yellow-400 italic mb-4">Explore Plus</p>

          <p className="text-sm leading-relaxed mb-6 max-w-xs">
            India's most trusted online marketplace. Quality products, fast
            delivery, and a seamless shopping experience — every single time.
          </p>

          {/* App download */}
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-medium">
            Download App
          </p>
          <div className="flex gap-3 flex-wrap">
            <a
              href="#"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 transition"
            >
              <FaGooglePlay size={18} className="text-green-400" />
              <div>
                <p className="text-[10px] text-gray-400 leading-none">
                  Get it on
                </p>
                <p className="text-xs text-white font-medium leading-tight">
                  Google Play
                </p>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 transition"
            >
              <FaApple size={18} className="text-gray-300" />
              <div>
                <p className="text-[10px] text-gray-400 leading-none">
                  Download on
                </p>
                <p className="text-xs text-white font-medium leading-tight">
                  App Store
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(links).map(([title, items]) => (
          <div key={title}>
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-widest">
              {title}
            </h3>
            <ul className="space-y-2.5">
              {items.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#2874f0] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Trust badges ── */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-6 text-xs text-gray-500">
            {[
              "🔒 100% Secure Payments",
              "✅ Easy Returns",
              "🚚 Fast Delivery",
              "⭐ 4.8 Rated App",
            ].map((badge) => (
              <span key={badge} className="flex items-center gap-1.5">
                {badge}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Cartify Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
