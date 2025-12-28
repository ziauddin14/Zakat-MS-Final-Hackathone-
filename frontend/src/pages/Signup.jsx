import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, ArrowRight, Loader } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../components/ui/Input";
import { registerUser } from "../api/api";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("user"); // 'user' | 'admin'
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await registerUser(
        data.name,
        data.email,
        data.password,
        data.phone,
        role
      );

      // Store token and user if returned
      if (response.token) {
        if (role === "admin") {
          localStorage.setItem("adminToken", response.token);
          localStorage.removeItem("token");
        } else {
          localStorage.setItem("token", response.token);
          localStorage.removeItem("adminToken");
        }
      }
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      // Notify Navbar
      window.dispatchEvent(new Event("loginStateChange"));

      toast.success("Account created successfully! Welcome aboard.");
      // Navigate based on role (default to donor dashboard)
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="min-h-screen flex items-center justify-center p-4 bg-background"
    >
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden w-full max-w-6xl min-h-[700px] flex flex-col lg:flex-row border border-gray-100">
        {/* Visual Side (Left on Desktop) */}
        <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden p-12 text-white flex-col justify-between">
          {/* Background Patterns */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent rounded-full blur-[100px] opacity-40 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-dark rounded-full blur-[80px] opacity-60 -translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm mb-8">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Join the Circle of <br />
              <span className="text-accent underline decoration-4 decoration-accent/30 underline-offset-4">
                Giving.
              </span>
            </h2>
            <p className="text-primary-100 text-lg leading-relaxed max-w-md">
              "The best of people are those that bring most benefit to the rest
              of mankind."
            </p>
          </div>

          <div className="relative z-10 mt-12 lg:mt-0">
            <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-full border-2 border-primary bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 overflow-hidden`}
                    >
                      <img
                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                        alt="user"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm font-semibold">
                  10k+ Community Members
                </div>
              </div>
              <p className="text-sm text-white/80">
                Join a growing community dedicated to transparent and impactful
                Zakat management.
              </p>
            </div>
          </div>
        </div>

        {/* Form Side (Right on Desktop) */}
        <div className="lg:w-1/2 p-8 lg:p-16 relative">
          <div className="max-w-md mx-auto">
            <div className="mb-10">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Register
              </h3>
              <p className="text-gray-500">
                Sign up to start your journey of giving.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              {/* Role Selection */}
              <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    role === "user"
                      ? "bg-white shadow-sm text-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Donor
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    role === "admin"
                      ? "bg-white shadow-sm text-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Admin
                </button>
              </div>

              <Input
                label="Full Name"
                placeholder="John Doe"
                icon={User}
                {...register("name", { required: "Full name is required" })}
                error={errors.name}
              />

              <Input
                label="Email Address"
                placeholder="you@example.com"
                type="email"
                icon={Mail}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                error={errors.email}
              />

              <Input
                label="Phone Number"
                placeholder="+1 234 567 890"
                type="tel"
                icon={Phone}
                {...register("phone", {
                  required: "Phone number is required",
                  minLength: { value: 10, message: "Invalid phone number" },
                })}
                error={errors.phone}
              />

              <Input
                label="Password"
                placeholder="Create a strong password"
                type="password"
                icon={Lock}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={errors.password}
              />

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader className="animate-spin" size={24} />
                ) : (
                  <>
                    Register <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-bold hover:underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Signup;
