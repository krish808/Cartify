import { useState, useRef, useEffect } from "react";

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

  return (
    <nav className=" text-black shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <button
          onClick={() => onNavigate("/")}
          className="text-2xl font-bold tracking-wide"
        >
          Cartify
        </button>

        {/* 🔥 Search Bar (Desktop) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-2xl"
        >
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 text-black rounded-l-md focus:outline-none bg-blue-50 "
          />
          <button
            type="submit"
            className=" px-5 rounded-r-md text-black font-semibold hover:bg-blue-500 transition"
          >
            🔍
          </button>
        </form>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-6">
          {/* Cart */}
          <div className="relative">
            <button
              onClick={() => onNavigate("/cart")}
              className="hover:text-gray-300 transition"
            >
              🛒 Cart
            </button>

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-xs font-semibold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>

          {/* User Section */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 hover:text-gray-300 transition"
              >
                <span className="font-medium">Hi, {user.name}</span>
                <span className="text-sm">▼</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-44 bg-white text-black rounded-lg shadow-lg py-2">
                  <button
                    onClick={() => onNavigate("/profile")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => onNavigate("/orders")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Orders
                  </button>

                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate("/login")}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-sm transition"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {/* 🔥 Mobile Search */}
      <div className="md:hidden px-6 pb-4">
        <form onSubmit={handleSearchSubmit} className="flex">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 text-black rounded-l-md focus:outline-none bg-white"
          />
          <button
            type="submit"
            className="bg-yellow-400 px-4 rounded-r-md text-black font-semibold"
          >
            🔍
          </button>
        </form>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 px-6 pb-4 space-y-4">
          <button
            onClick={() => onNavigate("/")}
            className="block hover:text-gray-300"
          >
            Home
          </button>

          <button
            onClick={() => onNavigate("/cart")}
            className="block hover:text-gray-300"
          >
            🛒 Cart ({totalItems})
          </button>

          {user ? (
            <>
              <button
                onClick={() => onNavigate("/profile")}
                className="block hover:text-gray-300"
              >
                Profile
              </button>

              <button
                onClick={() => onNavigate("/orders")}
                className="block hover:text-gray-300"
              >
                Orders
              </button>

              <button
                onClick={onLogout}
                className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate("/login")}
              className="w-full bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-sm"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
