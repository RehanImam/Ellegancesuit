import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from "lucide-react";
import logoImg from "../assets/logo.jpeg";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { register, startGoogleLogin } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSignup = () => {
    startGoogleLogin();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await register(formData);
      setSuccess(response.message || "Account created. Please verify your email.");
      setFormData({ fullName: "", email: "", password: "" });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#fff8fa] px-4 py-12">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-pink-200/60 shadow-lg shadow-pink-100/50">
        
        {/* Header / Brand */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-300 shadow-sm mx-auto mb-3">
            <img
              src={logoImg}
              alt="Jannat Elegance"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950">
            Create Account
          </h2>
          <p className="text-xs tracking-[2px] font-medium text-pink-600 uppercase mt-1">
            Join Jannat Elegance
          </p>
        </div>

        {/* Google Signup Button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-pink-50/50 text-rose-950 font-semibold text-xs py-3 px-4 rounded-xl border border-pink-200 shadow-sm hover:shadow transition-all duration-200 mb-5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign up with Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-5">
          <div className="flex-grow border-t border-pink-200"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold tracking-wider text-rose-400 uppercase">
            OR REGISTER WITH EMAIL
          </span>
          <div className="flex-grow border-t border-pink-200"></div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          {success && <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">{success}</p>}
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-rose-950 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400"
              />
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Priya Sharma"
                className="w-full bg-pink-50/50 border border-pink-200 text-rose-950 text-sm rounded-xl py-3 pl-11 pr-4 outline-none focus:border-rose-900 focus:ring-1 focus:ring-rose-900 transition placeholder:text-rose-300"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-rose-950 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400"
              />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full bg-pink-50/50 border border-pink-200 text-rose-950 text-sm rounded-xl py-3 pl-11 pr-4 outline-none focus:border-rose-900 focus:ring-1 focus:ring-rose-900 transition placeholder:text-rose-300"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-rose-950 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full bg-pink-50/50 border border-pink-200 text-rose-950 text-sm rounded-xl py-3 pl-11 pr-11 outline-none focus:border-rose-900 focus:ring-1 focus:ring-rose-900 transition placeholder:text-rose-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-400 hover:text-rose-900 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-950 hover:bg-rose-900 text-white font-semibold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group text-sm mt-2"
          >
            <span>{loading ? "Creating Account..." : "Register Now"}</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-rose-950/80 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-rose-900 hover:text-pink-600 underline underline-offset-4 transition"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;