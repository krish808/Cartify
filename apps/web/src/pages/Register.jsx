import React from "react";
import { useState } from "react";
import {
  MdCardGiftcard,
  MdEmail,
  MdFlashOn,
  MdLocalShipping,
  MdLock,
  MdPassword,
  MdPerson,
  MdSecurity,
  MdShop,
  MdShoppingCart,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../store/authSlice";

const PERKS = [
  { icon: MdFlashOn, text: "Exclusive deals and offers" },
  { icon: MdLocalShipping, text: "Free & Fast Delivery" },
  { icon: MdCardGiftcard, text: "Welcome offers for new users" },
  { icon: MdSecurity, text: "100% secure payments" },
];

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // -- Validation logic--
  const errors = {
    name: touched.name && !form.name.trim() ? "Name is required" : "",
    email: touched.email && !form.email.trim() ? "Email is required" : "",
    password:
      touched.password && !form.password.trim() ? "Password is required" : "",
    confirmPassword:
      touched.confirmPassword && !form.confirmPassword.trim()
        ? "Please confirm your password"
        : touched.confirmPassword && form.password !== form.confirmPassword
          ? "Passwords do not match"
          : "",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.values(errors).some(Boolean)) return;
    if (!form.name || !form.email || !form.password || !form.confirmPassword)
      return;
    const result = await dispatch(
      register({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    );
    if (register.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden flex">
        {/* -- Left panel-- */}
        <div className="hidden md:flex flex-col justify-between bg-[#2874f0] text-white w-2/5 p-10">
          <div>
            <div className="mb-10">
              <h1 className="text-3xl font-bold tracking-wide">Cartify</h1>
              <p className="text-blue-200 text-sm mt-1 italic">Explore Plus</p>
            </div>
            <h2 className="text-2xl font-medium leading-snug mb-2">
              Join millions of happly shoppers
            </h2>
            <p className="text-blue-200 text-sm leading-relaxed">
              Create your account and start exploring the best deals across
              thousands of products.
            </p>
            <ul className="mt-8 space-y-4">
              {PERKS.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-3 text-sm text-blue-100"
                >
                  <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-white" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <MdShoppingCart size={48} />
          </div>
        </div>
        {/* --- Right panel (form) --- */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-12 py-10">
          {/* --- Mobile logo --- */}

          <div className="md:hidden mb-6 text-center">
            <h1 className="text-2xl font-bold text-[#2874f0]">Cartify</h1>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            Create account
          </h2>

          <p className="text-sm text-gray-400 mb-8">
            Sign up to start shopping on Cartify
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            noValidate
          >
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div>
                <MdPerson
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur("name")}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 transition ${errors.name ? "border-red-400 focus:ring-red-400" : "border-red-gray focus:ring-[#2874f0]/30 focus:border-[#2874f0]"}`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>
              )}
            </div>
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
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 transition 
          ${errors.email ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-[#2874f0]/30 focus:border-[#2874f0]"}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>
              )}
            </div>
            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <MdLock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-md
          focus:"outline-none focus:ring-2 transition ${errors.password ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-[#2874f0]/30 focus:border-[#2874f0]"}`}
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
              {errors.password && (
                <p className="text-xs text-red-500 mt-0.5">{errors.password}</p>
              )}
            </div>
            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <MdLock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmPassword")}
                  className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-md
          focus:outline-none focus:ring-2 transition ${
            errors.confirmPassword
              ? "border-red-400 focus:ring-red-200"
              : "border-gray-200 focus:ring-[#2874f0]/30 focus:border-[#2874f0]"
          }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? (
                    <MdVisibilityOff size={18} />
                  ) : (
                    <MdVisibility size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-0.5">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            {/* Server error */}
            {error && (
              <div className="bg-red-50 border-red-200 rounded-md px-4 py-2.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            {/* submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#fb641b] hover:bg-[#e05a18] disabled:bg-orange-300 text-white font-semibold py-3 rounded-md text-sm transition mt-1 flex items-center justify-center gap-2  "
            >
              {loading ? (
                <>
                  <span
                    className="w-4 h-4 border-2 border-white/40
          border-t-white rounded-full animate-spin"
                  />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
            {/* Divider */}

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Login link */}

            <p className="text-sm text-gray-500 text-center">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-[#2874f0] font-medium hover:underline"
              >
                Login
              </button>
            </p>
          </form>

          <p className="text-[11px] text-gray-400 text-center mt-8 leading-relaxed">
            By continuing, you agree to Cartify's{" "}
            <span className="text-[#2874f0] cursor-pointer hover:underline">
              Terms of Use
            </span>{" "}
            and{" "}
            <span className="text-[#2874f0] cursor-pointer hover:underline">
              Privacy Policy
            </span>{" "}
            .
          </p>
        </div>
      </div>
    </div>
  );
}
