import { useState, useRef, useEffect } from "react";
import {
  MdSearch,
  MdShoppingCart,
  MdPerson,
  MdKeyboardArrowDown,
  MdLogout,
  MdAccountCircle,
  MdListAlt,
  MdMenu,
  MdClose,
  MdHome,
  MdFlashOn,
} from "react-icons/md";

export default function Navbar({
  user,
  totalItems,
  onSearch,
  onNavigate,
  onLogout,
}) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const dropdownRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    onSearch(search);
    setSearch("");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on navigation
  const handleNavigate = (path) => {
    setIsOpen(false);
    setDropdownOpen(false);
    onNavigate(path);
  };

  return (
    <nav className="bg-[#2874f0] sticky top-0 z-50 shadow-md">
      {/* ── Main Bar ── */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <button
          onClick={() => handleNavigate("/")}
          className="flex-shrink-0 flex flex-col items-start cursor-pointer"
        >
          <span className="text-white text-xl font-bold tracking-wide leading-none">
            Cartify
          </span>
          <span className="text-[10px] text-yellow-300 italic font-medium leading-none mt-0.5">
            Explore{" "}
            <span className="text-white not-italic font-bold">Plus</span>
          </span>
        </button>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-2xl"
        >
          <div
            className={`flex w-full rounded-sm overflow-hidden transition-shadow ${searchFocused ? "shadow-lg" : ""}`}
          >
            <input
              type="text"
              placeholder="Search for products, brands and more"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full px-4 py-2.5 text-sm text-gray-800 focus:outline-none bg-white placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-[#ffe11b] px-5 flex items-center justify-center hover:bg-yellow-400 transition flex-shrink-0"
            >
              <MdSearch size={22} className="text-[#2874f0]" />
            </button>
          </div>
        </form>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-1 ml-auto">
          {/* Login / User Dropdown */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 text-white px-3 py-2 rounded hover:bg-white/10 transition cursor-pointer"
              >
                <MdPerson size={20} />
                <span className="text-sm font-medium max-w-[100px] truncate">
                  {user.name}
                </span>
                <MdKeyboardArrowDown
                  size={18}
                  className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-sm shadow-xl border border-gray-100 py-1 z-50">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={() => handleNavigate("/profile")}
                    className="flex items-center gap-3 w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition"
                  >
                    <MdAccountCircle size={18} className="text-gray-400" />
                    My Profile
                  </button>

                  <button
                    onClick={() => handleNavigate("/orders")}
                    className="flex items-center gap-3 w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition"
                  >
                    <MdListAlt size={18} className="text-gray-400" />
                    My Orders
                  </button>

                  <div className="border-t border-gray-100 mt-1" />

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    className="flex items-center gap-3 w-full text-left px-4 py-2.5 hover:bg-red-50 text-sm text-red-500 transition"
                  >
                    <MdLogout size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleNavigate("/login")}
              className="flex items-center gap-1.5 bg-white text-[#2874f0] text-sm font-semibold px-5 py-2 rounded-sm hover:bg-gray-50 transition cursor-pointer"
            >
              <MdPerson size={18} />
              Login
            </button>
          )}

          {/* Cart */}
          <button
            onClick={() => handleNavigate("/cart")}
            className="relative flex items-center gap-1.5 text-white px-3 py-2 rounded hover:bg-white/10 transition cursor-pointer"
          >
            <div className="relative">
              <MdShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#ff6161] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </div>
            <span className="text-sm font-medium">Cart</span>
          </button>
        </div>

        {/* Mobile: Cart + Hamburger */}
        <div className="flex md:hidden items-center gap-2 ml-auto">
          <button
            onClick={() => handleNavigate("/cart")}
            className="relative text-white p-1"
          >
            <MdShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ff6161] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white p-1 cursor-pointer"
          >
            {isOpen ? <MdClose size={26} /> : <MdMenu size={26} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Search ── */}
      <div className="md:hidden px-4 pb-3">
        <form
          onSubmit={handleSearchSubmit}
          className="flex rounded-sm overflow-hidden"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 text-sm text-gray-800 focus:outline-none bg-white"
          />
          <button
            type="submit"
            className="bg-[#ffe11b] px-4 flex items-center justify-center"
          >
            <MdSearch size={20} className="text-[#2874f0]" />
          </button>
        </form>
      </div>

      {/* ── Mobile Menu ── */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 divide-y divide-gray-100">
          <button
            onClick={() => handleNavigate("/")}
            className="flex items-center gap-3 w-full px-6 py-3 text-gray-700 hover:bg-gray-50 text-sm"
          >
            <MdHome size={18} className="text-gray-400" /> Home
          </button>

          <button
            onClick={() => handleNavigate("/products")}
            className="flex items-center gap-3 w-full px-6 py-3 text-gray-700 hover:bg-gray-50 text-sm"
          >
            <MdFlashOn size={18} className="text-gray-400" /> Products
          </button>

          {user ? (
            <>
              <div className="px-6 py-3 bg-gray-50">
                <p className="text-xs text-gray-400">Signed in as</p>
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
              </div>

              <button
                onClick={() => handleNavigate("/profile")}
                className="flex items-center gap-3 w-full px-6 py-3 text-gray-700 hover:bg-gray-50 text-sm"
              >
                <MdAccountCircle size={18} className="text-gray-400" /> My
                Profile
              </button>

              <button
                onClick={() => handleNavigate("/orders")}
                className="flex items-center gap-3 w-full px-6 py-3 text-gray-700 hover:bg-gray-50 text-sm"
              >
                <MdListAlt size={18} className="text-gray-400" /> My Orders
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="flex items-center gap-3 w-full px-6 py-3 text-red-500 hover:bg-red-50 text-sm"
              >
                <MdLogout size={18} /> Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => handleNavigate("/login")}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#2874f0] text-white text-sm font-medium"
            >
              <MdPerson size={18} /> Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
