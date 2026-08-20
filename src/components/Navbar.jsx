import { useState } from "react";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

// Logo import from assets
import logoImg from "../assets/logo.jpeg";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { cartCount, wishlist } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-[#fff8fa]/95 backdrop-blur-md border-b border-pink-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-4">

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-maroon-800 p-1.5 rounded-lg hover:bg-pink-100/50 transition"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Logo with imported Image Asset */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-pink-300 shadow-sm transition-transform duration-300 group-hover:scale-105 flex-shrink-0">
              <img
                src={logoImg}
                alt="Jannat Elegance Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-maroon-900 group-hover:text-maroon-700 transition">
                JANNAT
              </span>
              <span className="text-[9px] tracking-[3px] font-medium text-pink-600 uppercase -mt-1">
                Elegance
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-maroon-900">
            <Link
              to="/"
              className="hover:text-pink-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-maroon-800 hover:after:w-full after:transition-all"
            >
              Home
            </Link>

            <Link
              to="/shop"
              className="hover:text-pink-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-maroon-800 hover:after:w-full after:transition-all"
            >
              Shop
            </Link>

            <Link
              to="/shop?category=Frocks"
              className="hover:text-pink-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-maroon-800 hover:after:w-full after:transition-all"
            >
              Frocks
            </Link>

            <Link
              to="/shop?category=Suits"
              className="hover:text-pink-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-maroon-800 hover:after:w-full after:transition-all"
            >
              Suits
            </Link>

            <a
              href="#about"
              className="hover:text-pink-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-maroon-800 hover:after:w-full after:transition-all"
            >
              About
            </a>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4 text-maroon-800">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full hover:bg-pink-100/60 text-maroon-800 transition"
              aria-label="Search"
            >
              <Search size={21} />
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-full hover:bg-pink-100/60 transition hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart size={21} />
              {wishlist?.length > 0 && (
                <span className="absolute top-1 right-1 bg-maroon-800 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* User Profile */}
            <button
              className="p-2 rounded-full hover:bg-pink-100/60 transition hidden sm:block"
              aria-label="Account"
            >
              <User size={21} />
            </button>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-pink-100/60 transition"
              aria-label="Cart"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-maroon-800 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Dropdown Search Bar */}
        {searchOpen && (
          <div className="pb-4 animate-fadeUp">
            <div className="relative max-w-2xl mx-auto">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-maroon-600"
              />
              <input
                type="text"
                placeholder="Search frocks, suits, designer collection..."
                className="w-full bg-pink-50/80 border border-pink-200 text-maroon-900 rounded-full py-3 pl-11 pr-4 outline-none focus:border-maroon-700 focus:ring-1 focus:ring-maroon-700 transition placeholder:text-maroon-400 text-sm"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <div className="lg:hidden pb-5 animate-fadeUp">
            <nav className="flex flex-col gap-3 pt-4 border-t border-pink-200/60 font-medium text-maroon-900">
              <Link
                onClick={() => setMenuOpen(false)}
                to="/"
                className="px-3 py-2 rounded-lg hover:bg-pink-100/60 transition"
              >
                Home
              </Link>

              <Link
                onClick={() => setMenuOpen(false)}
                to="/shop"
                className="px-3 py-2 rounded-lg hover:bg-pink-100/60 transition"
              >
                Shop
              </Link>

              <Link
                onClick={() => setMenuOpen(false)}
                to="/shop?category=Frocks"
                className="px-3 py-2 rounded-lg hover:bg-pink-100/60 transition"
              >
                Frocks
              </Link>

              <Link
                onClick={() => setMenuOpen(false)}
                to="/shop?category=Suits"
                className="px-3 py-2 rounded-lg hover:bg-pink-100/60 transition"
              >
                Suits
              </Link>

              <Link
                onClick={() => setMenuOpen(false)}
                to="/wishlist"
                className="px-3 py-2 rounded-lg hover:bg-pink-100/60 transition flex justify-between items-center"
              >
                <span>Wishlist</span>
                {wishlist?.length > 0 && (
                  <span className="bg-maroon-800 text-white text-xs px-2 py-0.5 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;