import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader, Heart } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../components/ui/Input";
import { loginUser, loginAdmin } from "../api/api";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("donor"); // 'donor' | 'admin'
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      let response;
      if (role === "admin") {
        localStorage.removeItem("token");
        response = await loginAdmin(data.email, data.password);
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }
      } else {
        localStorage.removeItem("adminToken");
        response = await loginUser(data.email, data.password);
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }
      }

      // Notify Navbar
      window.dispatchEvent(new Event("loginStateChange"));

      toast.success("Welcome back! Signed in successfully.");
      // Navigate based on role
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Invalid credentials. Please try again."
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
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden w-full max-w-5xl min-h-[600px] flex flex-col md:flex-row border border-gray-100">
        {/* Form Side (Left on Login for variety) */}
        <div className="md:w-1/2 p-8 lg:p-16 relative flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-10">
              <Link
                to="/"
                className="inline-flex items-center gap-2 mb-8 text-primary font-bold"
              >
                <Heart size={20} fill="currentColor" /> ZakatFlow
              </Link>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h3>
              <p className="text-gray-500">
                Please enter your details to sign in.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Role Selection */}
              <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setRole("donor")}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    role === "donor"
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

              <div>
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  icon={Lock}
                  {...register("password", {
                    required: "Password is required",
                  })}
                  error={errors.password}
                />
                <div className="flex justify-end -mt-4 mb-4">
                  <a
                    href="#"
                    className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader className="animate-spin" size={24} />
                ) : (
                  <>
                    Sign In <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary font-bold hover:underline"
              >
                Register
              </Link>
            </div>
          </div>
        </div>

        {/* Visual Side (Right on Login) */}
        <div className="md:w-1/2 bg-gray-900 relative overflow-hidden hidden md:flex items-center justify-center p-12 text-white">
          {/* Background Image / Pattern */}
          <div className="absolute inset-0 bg-primary-dark">
            <img
              src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
              alt="Background"
              className="w-full h-full object-cover opacity-20 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/80 to-transparent"></div>
          </div>

          <div className="relative z-10 text-center max-w-sm">
            <h2 className="text-3xl font-bold mb-6">
              "Charity does not decrease wealth."
            </h2>
            <i className="text-primary-100/80 text-lg font-serif">
              - Prophet Muhammad (SAW)
            </i>

            <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <div className="text-2xl font-bold text-accent mb-1">$50M+</div>
                <div className="text-xs text-gray-300">Donations Processed</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <div className="text-2xl font-bold text-accent mb-1">1M+</div>
                <div className="text-xs text-gray-300">Lives Impacted</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
