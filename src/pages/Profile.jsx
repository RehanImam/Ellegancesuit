import { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  ShoppingBag,
  User,
  MapPin,
  Heart,
  RotateCcw,
  LogOut,
  Edit2,
  X,
  Check,
  Mail,
  Lock,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, isLoggedIn, authLoading, logout, updateProfile, changeEmail, requestPasswordReset } = useAuth();

  // --- Basic Info Edit State ---
  const [editingBasic, setEditingBasic] = useState(false);
  const [basicForm, setBasicForm] = useState({ username: "", gender: "" });
  const [basicLoading, setBasicLoading] = useState(false);
  const [basicError, setBasicError] = useState("");
  const [basicSuccess, setBasicSuccess] = useState("");

  // --- Email Edit State ---
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

  // --- Password Reset State ---
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-600">
        <Loader2 size={24} className="animate-spin mr-2" />
        Loading profile...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const isGoogleUser = user?.loginType === "GOOGLE";

  // Helper to extract initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(/[\s_]+/)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // --- Basic Info Handlers ---
  const startEditingBasic = () => {
    setBasicForm({
      username: user?.username || "",
      gender: user?.gender || "Male",
    });
    setBasicError("");
    setBasicSuccess("");
    setEditingBasic(true);
  };

  const cancelEditingBasic = () => {
    setEditingBasic(false);
    setBasicError("");
  };

  const saveBasicInfo = async () => {
    setBasicLoading(true);
    setBasicError("");
    setBasicSuccess("");
    try {
      await updateProfile({
        username: basicForm.username.trim(),
        gender: basicForm.gender,
      });
      setBasicSuccess("Profile updated successfully!");
      setEditingBasic(false);
      setTimeout(() => setBasicSuccess(""), 3000);
    } catch (err) {
      setBasicError(err.message);
    } finally {
      setBasicLoading(false);
    }
  };

  // --- Email Handlers ---
  const startEditingEmail = () => {
    setNewEmail("");
    setEmailError("");
    setEmailSuccess("");
    setEditingEmail(true);
  };

  const cancelEditingEmail = () => {
    setEditingEmail(false);
    setEmailError("");
  };

  const saveEmail = async () => {
    if (!newEmail.trim()) {
      setEmailError("Please enter a new email address.");
      return;
    }
    setEmailLoading(true);
    setEmailError("");
    setEmailSuccess("");
    try {
      const result = await changeEmail(newEmail.trim());
      setEmailSuccess(result.message || "Email updated. Please verify your new email.");
      setEditingEmail(false);
      setTimeout(() => setEmailSuccess(""), 5000);
    } catch (err) {
      setEmailError(err.message);
    } finally {
      setEmailLoading(false);
    }
  };

  // --- Password Reset Handler ---
  const handlePasswordReset = async () => {
    setPasswordLoading(true);
    setPasswordMessage("");
    setPasswordError("");
    try {
      const result = await requestPasswordReset(user.email);
      setPasswordMessage(result.message || "Password reset link sent to your email.");
      setTimeout(() => setPasswordMessage(""), 5000);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
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
          <h2 className="font-semibold text-gray-800 text-sm mb-1 text-center">
            {user?.name || user?.username || "User"}
          </h2>
          {isGoogleUser && (
            <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-4">
              Google Account
            </span>
          )}
          {!isGoogleUser && <div className="mb-4" />}

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
              {!editingBasic ? (
                <button
                  onClick={startEditingBasic}
                  className="flex items-center gap-1.5 border border-black px-3 py-1 rounded text-xs font-semibold hover:bg-gray-50 transition-colors"
                >
                  <Edit2 size={12} />
                  Edit
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={saveBasicInfo}
                    disabled={basicLoading}
                    className="flex items-center gap-1 bg-black text-white px-3 py-1 rounded text-xs font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {basicLoading ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Check size={12} />
                    )}
                    Save
                  </button>
                  <button
                    onClick={cancelEditingBasic}
                    disabled={basicLoading}
                    className="flex items-center gap-1 border border-gray-300 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <X size={12} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {basicError && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-3">
                {basicError}
              </p>
            )}
            {basicSuccess && (
              <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mt-3">
                {basicSuccess}
              </p>
            )}

            <div className="mt-4 text-sm space-y-4">
              {/* Username Row */}
              <div className="grid grid-cols-3 border-b border-gray-100 pb-3 items-center">
                <span className="text-gray-500">Name</span>
                {editingBasic ? (
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={basicForm.username}
                      onChange={(e) =>
                        setBasicForm({ ...basicForm, username: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                      placeholder="Enter username"
                      minLength={4}
                      maxLength={16}
                    />
                  </div>
                ) : (
                  <span className="col-span-2 text-gray-900 font-medium">
                    {user?.name || user?.username || "N/A"}
                  </span>
                )}
              </div>

              {/* Gender Row */}
              <div className="grid grid-cols-3 items-center">
                <span className="text-gray-500">Gender</span>
                {editingBasic ? (
                  <div className="col-span-2">
                    <select
                      value={basicForm.gender}
                      onChange={(e) =>
                        setBasicForm({ ...basicForm, gender: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                ) : (
                  <span className="col-span-2 text-gray-900 font-medium">
                    {user?.gender || "Male"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* LOGIN DETAILS Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-sm tracking-wider uppercase text-gray-900">
                LOGIN DETAILS
              </h3>
            </div>

            <div className="mt-4 text-sm space-y-4">
              {/* Email Row */}
              <div className="grid grid-cols-3 border-b border-gray-100 pb-3 items-start">
                <span className="text-gray-500 pt-2">Email</span>
                <div className="col-span-2">
                  {!editingEmail ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-medium">
                          {user?.email || "N/A"}
                        </span>
                        {user?.isEmailVerified ? (
                          <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                            Verified
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                            Unverified
                          </span>
                        )}
                      </div>
                      <button
                        onClick={startEditingEmail}
                        className="text-xs font-medium text-black underline flex items-center gap-1 hover:text-gray-600"
                      >
                        <Edit2 size={12} />
                        Change
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                          placeholder="Enter new email address"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={saveEmail}
                          disabled={emailLoading}
                          className="flex items-center gap-1 bg-black text-white px-3 py-1 rounded text-xs font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                          {emailLoading ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Check size={12} />
                          )}
                          Save
                        </button>
                        <button
                          onClick={cancelEditingEmail}
                          disabled={emailLoading}
                          className="flex items-center gap-1 border border-gray-300 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-50 transition-colors"
                        >
                          <X size={12} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  {emailError && (
                    <p className="text-xs text-red-600 mt-1">{emailError}</p>
                  )}
                  {emailSuccess && (
                    <p className="text-xs text-emerald-600 mt-1">{emailSuccess}</p>
                  )}
                </div>
              </div>

              {/* Password Row */}
              {isGoogleUser ? (
                <div className="grid grid-cols-3 items-center">
                  <span className="text-gray-500">Password</span>
                  <span className="col-span-2 text-gray-400 text-xs italic">
                    Managed by Google. No password set.
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-3 items-start">
                  <span className="text-gray-500 pt-1">Password</span>
                  <div className="col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-medium">••••••••</span>
                      <button
                        onClick={handlePasswordReset}
                        disabled={passwordLoading}
                        className="text-xs font-medium text-black underline flex items-center gap-1 hover:text-gray-600 disabled:opacity-50"
                      >
                        {passwordLoading ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Lock size={12} />
                        )}
                        Change Password
                      </button>
                    </div>
                    {passwordMessage && (
                      <p className="text-xs text-emerald-600 mt-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                        {passwordMessage}
                      </p>
                    )}
                    {passwordError && (
                      <p className="text-xs text-red-600 mt-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {passwordError}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Profile;