
import { useState, useRef, useEffect } from "react";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  LogOut,
  UserPlus,
  LogIn,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

// Logo import from assets
import logoImg from "../assets/logo.jpeg";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);

  // Example auth state (replaces with your context/state management)
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const dropdownRef = useRef(null);

  const { cartCount, wishlist } = useCart();

  // Outside clickhandler for Auth Dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAuthDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#fff8fa]/95 backdrop-blur-md border-b border-pink-200/60 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-4">

          {/* Left: Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-rose-950 p-1.5 rounded-lg hover:bg-pink-100/50 transition"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-pink-300 shadow-sm transition-transform duration-300 group-hover:scale-105 shrink-0">
              <img
                src={logoImg}
                alt="Jannat Elegance Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-rose-950 group-hover:text-rose-800 transition">
                JANNAT
              </span>
              <span className="text-[9px] tracking-[3px] font-medium text-pink-600 uppercase -mt-1">
                Elegance
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-rose-950">
            <Link
              to="/"
              className="hover:text-pink-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-rose-900 hover:after:w-full after:transition-all"
            >
              Home
            </Link>

            <Link
              to="/shop"
              className="hover:text-pink-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-rose-900 hover:after:w-full after:transition-all"
            >
              Shop
            </Link>

            <Link
              to="/shop?category=Frocks"
              className="hover:text-pink-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-rose-900 hover:after:w-full after:transition-all"
            >
              Frocks
            </Link>

            <Link
              to="/shop?category=Suits"
              className="hover:text-pink-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-rose-900 hover:after:w-full after:transition-all"
            >
              Suits
            </Link>

            <a
              href="#about"
              className="hover:text-pink-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-rose-900 hover:after:w-full after:transition-all"
            >
              About
            </a>
          </nav>

          {/* Action Icons & Login/Signup */}
          <div className="flex items-center gap-2 sm:gap-4 text-rose-950">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full hover:bg-pink-100/60 text-rose-950 transition"
              aria-label="Search"
            >
              <Search size={21} />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-full hover:bg-pink-100/60 transition hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart size={21} />
              {wishlist?.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-pink-100/60 transition"
              aria-label="Cart"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-900 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Desktop Auth Section / Profile Dropdown */}
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <button
                onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-pink-100/60 transition border border-transparent hover:border-pink-200"
                aria-label="Account"
              >
                <User size={21} />
              </button>

              {/* Premium Floating Auth Menu */}
              {authDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-pink-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {!isLoggedIn ? (
                    <div>
                      <div className="text-center pb-3 mb-3 border-b border-pink-100">
                        <h4 className="font-serif text-lg font-bold text-rose-950">
                          Welcome to Jannat
                        </h4>
                        <p className="text-xs text-rose-700/80 mt-0.5">
                          Access your orders & wishlist
                        </p>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        <Link
                          to="/login"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-900 hover:bg-rose-950 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all"
                        >
                          <LogIn size={15} />
                          Log In
                        </Link>

                        <Link
                          to="/signup"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-pink-50 hover:bg-pink-100 text-rose-950 text-xs font-semibold rounded-xl border border-pink-200 transition-all"
                        >
                          <UserPlus size={15} />
                          Create Account
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="pb-3 mb-2 border-b border-pink-100">
                        <p className="text-xs font-medium text-pink-600">Signed in as</p>
                        <p className="text-sm font-semibold text-rose-950 truncate">
                          user@example.com
                        </p>
                      </div>

                      <div className="flex flex-col gap-1 text-xs font-medium text-rose-950">
                        <Link
                          to="/profile"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="px-3 py-2 rounded-lg hover:bg-pink-50 transition"
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="px-3 py-2 rounded-lg hover:bg-pink-50 transition"
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={() => {
                            setIsLoggedIn(false);
                            setAuthDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-700 flex items-center gap-2 transition mt-1 border-t border-pink-100 pt-2"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="pb-4">
            <div className="relative max-w-2xl mx-auto">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-700"
              />
              <input
                type="text"
                placeholder="Search frocks, suits, designer collection..."
                className="w-full bg-pink-50/80 border border-pink-200 text-rose-950 rounded-full py-3 pl-11 pr-4 outline-none focus:border-rose-800 focus:ring-1 focus:ring-rose-800 transition placeholder:text-rose-400 text-sm"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Nav Drawer + Login/Signup Buttons */}
        {menuOpen && (
          <div className="lg:hidden pb-5">
            <nav className="flex flex-col gap-2 pt-4 border-t border-pink-200/60 font-medium text-rose-950 text-sm">
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
                  <span className="bg-rose-900 text-white text-xs px-2 py-0.5 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Mobile Auth CTA Buttons */}
              <div className="pt-3 mt-2 border-t border-pink-200/60 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-2.5 bg-rose-900 text-white font-semibold text-xs rounded-xl shadow-sm"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-2.5 bg-pink-100 text-rose-950 font-semibold text-xs rounded-xl border border-pink-200"
                >
                  Sign Up
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;