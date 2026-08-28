import { Navigate } from "react-router-dom";
import {
  ShoppingBag,
  User,
  MapPin,
  Heart,
  RotateCcw,
  LogOut,
  Edit2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, isLoggedIn, authLoading, logout } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Helper to extract initials (e.g., "Krishan Kumar" -> "KK")
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-white rounded-lg border border-gray-200 p-6 flex flex-col items-center">
          {/* Avatar Circle */}
          <div className="w-20 h-20 rounded-full bg-[#4CD0A0] flex items-center justify-center text-white text-2xl font-semibold mb-3">
            {getInitials(user?.name || user?.username)}
          </div>
          <h2 className="font-semibold text-gray-800 text-sm mb-6 text-center">
            {user?.name || user?.username || "User"}
          </h2>

          {/* Sidebar Menu Items */}
          <nav className="w-full space-y-4 text-sm font-medium text-gray-700">
            <a
              href="#orders"
              className="flex items-center gap-3 hover:text-black transition-colors"
            >
              <ShoppingBag size={18} />
              <span>My Orders</span>
            </a>
            <a
              href="#profile"
              className="flex items-center gap-3 text-black font-semibold"
            >
              <User size={18} />
              <span>My Profile</span>
            </a>
            <a
              href="#addresses"
              className="flex items-center gap-3 hover:text-black transition-colors"
            >
              <MapPin size={18} />
              <span>Addresses</span>
            </a>
            <a
              href="#wishlist"
              className="flex items-center gap-3 hover:text-black transition-colors"
            >
              <Heart size={18} />
              <span>My Wishlist</span>
            </a>
            <a
              href="#returns"
              className="flex items-center gap-3 hover:text-black transition-colors"
            >
              <RotateCcw size={18} />
              <span>Return Requests</span>
            </a>
            <button
              onClick={logout}
              className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors w-full text-left pt-2"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Right Main Content */}
        <section className="flex-1 space-y-6">
          {/* BASIC INFO Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-sm tracking-wider uppercase text-gray-900">
                BASIC INFO
              </h3>
              <button className="flex items-center gap-1.5 border border-black px-3 py-1 rounded text-xs font-semibold hover:bg-gray-50 transition-colors">
                <Edit2 size={12} />
                Edit
              </button>
            </div>

            <div className="mt-4 text-sm space-y-4">
              <div className="grid grid-cols-3 border-b border-gray-100 pb-3">
                <span className="text-gray-500">Name</span>
                <span className="col-span-2 text-gray-900 font-medium">
                  {user?.name || user?.username || "N/A"}
                </span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-500">Gender</span>
                <span className="col-span-2 text-gray-900 font-medium">
                  {user?.gender || "Male"}
                </span>
              </div>
            </div>
          </div>

          {/* LOGIN DETAILS Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-sm tracking-wider uppercase text-gray-900">
                LOGIN DETAILS
              </h3>
              <button className="flex items-center gap-1.5 border border-black px-3 py-1 rounded text-xs font-semibold hover:bg-gray-50 transition-colors">
                <Edit2 size={12} />
                Edit
              </button>
            </div>

            <div className="mt-4 text-sm space-y-4">
              <div className="grid grid-cols-3 border-b border-gray-100 pb-3">
                <span className="text-gray-500">Email</span>
                <span className="col-span-2 text-gray-900 font-medium">
                  {user?.email || "N/A"}
                </span>
              </div>
              <div className="grid grid-cols-3 items-center">
                <span className="text-gray-500">Password</span>
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-gray-900 font-medium">xxxxxx</span>
                  <button className="text-xs font-medium text-black underline flex items-center gap-1 hover:text-gray-600">
                    <Edit2 size={12} />
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Profile;