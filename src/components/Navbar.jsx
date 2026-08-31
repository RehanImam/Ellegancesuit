
import { useState, useRef, useEffect, useMemo } from "react";
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
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

// Logo import from assets
import logoImg from "../assets/logo.jpeg";

const Navbar = ({ onOpenCart }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const { cartCount, wishlist, openCartDrawer, mergedProducts } = useCart();
  const { user, isLoggedIn, isAdmin, logout } = useAuth();

  const handleOpenCart = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      openCartDrawer();
    }
  };

  // Popular search keywords
  const popularKeywords = [
    "Anarkali",
    "Pakistani Suit",
    "Party Frock",
    "Sharara",
    "Velvet",
    "Rose Pink",
  ];

  // Live search filtered results (top 4)
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return mergedProducts.filter((p) => {
      const matchName = p.name?.toLowerCase().includes(q);
      const matchCat = p.category?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchColor = p.colors?.some((c) => c.toLowerCase().includes(q));
      return matchName || matchCat || matchDesc || matchColor;
    }).slice(0, 4);
  }, [searchQuery]);

  const executeSearch = (queryToSearch) => {
    const q = (queryToSearch || searchQuery).trim();
    if (q) {
      navigate(`/shop?search=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setMenuOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    executeSearch();
  };

  // Outside clickhandler for Auth Dropdown & Search Bar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAuthDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        // Only close if clicked outside
        const isSearchToggleBtn = event.target.closest('[data-search-toggle="true"]');
        if (!isSearchToggleBtn) {
          setSearchOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus input when search is opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [searchOpen]);

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

            <Link
              href="#about"
              className="hover:text-pink-600 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-rose-900 hover:after:w-full after:transition-all"
            >
              About
            </Link>
          </nav>

          {/* Action Icons & Login/Signup */}
          <div className="flex items-center gap-2 sm:gap-4 text-rose-950">
            {/* Search Toggle */}
            <button
              data-search-toggle="true"
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 rounded-full transition ${
                searchOpen
                  ? "bg-rose-900 text-white"
                  : "hover:bg-pink-100/60 text-rose-950"
              }`}
              aria-label="Search"
            >
              {searchOpen ? <X size={21} /> : <Search size={21} />}
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-full hover:bg-pink-100/60 transition"
              aria-label="Wishlist"
            >
              <Heart size={21} />
              {wishlist?.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={handleOpenCart}
              className="relative p-2 rounded-full hover:bg-pink-100/60 transition"
              aria-label="Cart"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white ">
                  {cartCount}
                </span>
              )}
            </button>
           

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
                          {user?.email}
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
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setAuthDropdownOpen(false)}
                            className="px-3 py-2 rounded-lg hover:bg-pink-50 transition text-rose-700 font-semibold"
                          >
                            Admin Panel
                          </Link>
                        )}
                        <Link
                          to="/orders"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="px-3 py-2 rounded-lg hover:bg-pink-50 transition"
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={async () => {
                            await logout();
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
          <div
            ref={searchContainerRef}
            className="pb-5 pt-1 animate-in fade-in slide-in-from-top-3 duration-200"
          >
            <div className="relative max-w-2xl mx-auto">
              {/* Search Form */}
              <form
                onSubmit={handleSearchFormSubmit}
                className="relative flex items-center shadow-md rounded-full bg-white border border-pink-200/80 overflow-hidden focus-within:border-rose-800 focus-within:ring-2 focus-within:ring-rose-800/20 transition-all"
              >
                <button
                  type="submit"
                  aria-label="Search"
                  className="pl-4 pr-2 text-rose-800 hover:text-rose-950 transition flex items-center justify-center"
                >
                  <Search size={20} />
                </button>

                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search frocks, suits, colors (e.g. Anarkali, Velvet, Pink)..."
                  className="w-full bg-transparent text-rose-950 py-3.5 pl-2 pr-10 outline-none text-sm placeholder:text-rose-400/80 font-medium"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    className="p-2 text-rose-400 hover:text-rose-800 transition mr-1"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}

                <button
                  type="submit"
                  className="hidden sm:flex items-center gap-1.5 bg-rose-900 hover:bg-rose-950 text-white text-xs font-semibold px-5 py-2.5 rounded-full mr-1.5 transition-all shadow-sm shrink-0"
                >
                  Search
                  <ArrowRight size={13} />
                </button>
              </form>

              {/* Floating Live Suggestions Dropdown */}
              <div className="absolute top-full left-0 right-0 mt-2 bg-white backdrop-blur-md rounded-2xl shadow-2xl border border-pink-100 p-4 z-50 overflow-hidden">
                {searchQuery.trim() ? (
                  searchResults.length > 0 ? (
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-pink-100 text-xs font-semibold text-rose-950 uppercase tracking-wider">
                        <span>Matching Products</span>
                        <span className="text-pink-600 font-normal">{searchResults.length} found</span>
                      </div>

                      <div className="divide-y divide-pink-50">
                        {searchResults.map((item) => (
                          <Link
                            key={item.id}
                            to={`/product/${item.id}`}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-pink-50/70 transition group"
                          >
                            <img
                              src={item.images?.[0]}
                              alt={item.name}
                              className="w-12 h-14 object-cover rounded-lg bg-pink-50 shrink-0 group-hover:scale-105 transition-transform"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif text-sm font-semibold text-rose-950 truncate group-hover:text-pink-700 transition">
                                {item.name}
                              </h4>
                              <p className="text-xs text-rose-500">{item.category}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-sm font-bold text-rose-950">
                                ₹{item.price.toLocaleString()}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>

                      <button
                        onClick={() => executeSearch()}
                        className="w-full mt-3 py-2.5 bg-pink-50 hover:bg-pink-100 text-rose-900 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                      >
                        <span>View all results for &ldquo;{searchQuery}&rdquo;</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-rose-900">
                      <p className="text-sm font-semibold">No products found for &ldquo;{searchQuery}&rdquo;</p>
                      <p className="text-xs text-rose-500 mt-1">
                        Try searching for keywords like &ldquo;Frock&rdquo;, &ldquo;Suit&rdquo;, or &ldquo;Rose&rdquo;
                      </p>
                    </div>
                  )
                ) : (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-950 mb-2.5">
                      <Sparkles size={14} className="text-pink-600" />
                      <span>Popular Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularKeywords.map((kw) => (
                        <button
                          key={kw}
                          type="button"
                          onClick={() => executeSearch(kw)}
                          className="px-3.5 py-1.5 bg-pink-50 hover:bg-rose-900 hover:text-white text-rose-900 text-xs font-medium rounded-full transition-all border border-pink-200/60"
                        >
                          {kw}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Nav Drawer + Login/Signup Buttons */}
        {menuOpen && (
          <div className="lg:hidden pb-5">
            {/* Mobile Search Bar inside Drawer */}
            <form
              onSubmit={handleSearchFormSubmit}
              className="relative my-3 flex items-center bg-pink-50 rounded-full border border-pink-200 px-3 py-2"
            >
              <Search size={16} className="text-rose-700 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent text-rose-950 text-xs outline-none w-full placeholder:text-rose-400"
              />
              {searchQuery && (
                <button
                  type="submit"
                  className="bg-rose-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full ml-1"
                >
                  Go
                </button>
              )}
            </form>

            <nav className="flex flex-col gap-2 pt-2 border-t border-pink-200/60 font-medium text-rose-950 text-sm">
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

              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleOpenCart();
                }}
                className="px-3 py-2 rounded-lg hover:bg-pink-100/60 transition flex justify-between items-center text-left w-full"
              >
                <span>Shopping Bag</span>
                {cartCount > 0 && (
                  <span className="bg-rose-900 text-white text-xs px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

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