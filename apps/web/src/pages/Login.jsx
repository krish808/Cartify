import { useState } from "react";
import { Button, Input, Container } from "@cartify/ui";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import {
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdShoppingCart,
  MdFlashOn,
  MdLocalShipping,
  MdSecurity,
} from "react-icons/md";

const PERKS = [
  { icon: MdFlashOn, text: "Exclusive deals & offers" },
  { icon: MdLocalShipping, text: "Free & fast delivery" },
  { icon: MdShoppingCart, text: "Easy returns & refunds" },
  { icon: MdSecurity, text: "100% secure payments" },
];

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  // inline validation
  const emailError = touched.email && !email ? "Email is required" : "";
  const passwordError =
    touched.password && !password ? "Password is required" : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!email || !password) return;

    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      setEmail("");
      setPassword("");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden flex">
        {/* ── Left panel (blue) ── */}
        <div className="hidden md:flex flex-col justify-between bg-[#2874f0] text-white w-2/5 p-10">
          <div>
            {/* Logo */}
            <div className="mb-10">
              <h1 className="text-3xl font-bold tracking-wide">Cartify</h1>
              <p className="text-blue-200 text-sm mt-1 italic">Explore Plus</p>
            </div>

            {/* Headline */}
            <h2 className="text-2xl font-medium leading-snug mb-2">
              Login & get access to the best deals
            </h2>
            <p className="text-blue-200 text-sm leading-relaxed">
              Millions of products at your fingertips. Sign in to continue your
              shopping journey.
            </p>

            {/* Perks */}
            <ul className="mt-8 space-y-4">
              {PERKS.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-3 text-sm text-blue-100"
                >
                  <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-white" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom illustration */}
          <div className="mt-10 opacity-20 flex justify-end">
            <MdShoppingCart size={120} />
          </div>
        </div>

        {/* ── Right panel (form) ── */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-12 py-10">
          {/* Mobile logo */}
          <div className="md:hidden mb-6 text-center">
            <h1 className="text-2xl font-bold text-[#2874f0]">Cartify</h1>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Sign in to your Cartify account
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            noValidate
          >
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <MdEmail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 transition
                    ${
                      emailError
                        ? "border-red-400 focus:ring-red-200"
                        : "border-gray-200 focus:ring-[#2874f0]/30 focus:border-[#2874f0]"
                    }`}
                  required
                />
              </div>
              {emailError && (
                <p className="text-xs text-red-500 mt-0.5">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs text-[#2874f0] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <MdLock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 transition
                    ${
                      passwordError
                        ? "border-red-400 focus:ring-red-200"
                        : "border-gray-200 focus:ring-[#2874f0]/30 focus:border-[#2874f0]"
                    }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? (
                    <MdVisibilityOff size={18} />
                  ) : (
                    <MdVisibility size={18} />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-xs text-red-500 mt-0.5">{passwordError}</p>
              )}
            </div>

            {/* Server error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md px-4 py-2.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#fb641b] hover:bg-[#e05a18] disabled:bg-orange-300 text-white font-semibold py-3 rounded-md text-sm transition mt-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Sign up link */}
            <p className="text-sm text-gray-500 text-center">
              New to Cartify?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-[#2874f0] font-medium hover:underline"
              >
                Create an account
              </button>
            </p>
          </form>

          {/* Terms */}
          <p className="text-[11px] text-gray-400 text-center mt-8 leading-relaxed">
            By continuing, you agree to Cartify's{" "}
            <span className="text-[#2874f0] cursor-pointer hover:underline">
              Terms of Use
            </span>{" "}
            and{" "}
            <span className="text-[#2874f0] cursor-pointer hover:underline">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
