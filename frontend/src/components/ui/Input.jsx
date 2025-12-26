import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const Input = React.forwardRef(
  ({ label, type = "text", error, icon: Icon, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
    };

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="relative mb-6">
        <div className="relative">
          {/* Icon */}
          {Icon && (
            <div
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                isFocused ? "text-primary" : "text-gray-400"
              }`}
            >
              <Icon size={20} />
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={inputType}
            className={`
            w-full bg-white border-2 rounded-xl py-3.5 px-4 outline-none transition-all duration-200
            ${Icon ? "pl-12" : "pl-4"}
            ${
              error
                ? "border-red-300 focus:border-red-500 text-red-900 placeholder-red-300"
                : "border-gray-100 focus:border-primary text-gray-900"
            }
            ${isFocused || hasValue ? "pt-6 pb-2.5" : "py-4"}
          `}
            onFocus={handleFocus}
            onBlur={(e) => {
              handleBlur(e);
              props.onBlur?.(e);
            }}
            onChange={(e) => {
              setHasValue(e.target.value.length > 0);
              props.onChange?.(e);
            }}
            {...props}
          />

          {/* Floating Label */}
          <motion.label
            initial={false}
            animate={{
              y: isFocused || hasValue ? -8 : 0,
              scale: isFocused || hasValue ? 0.75 : 1,
              x: isFocused || hasValue ? (Icon ? 12 : 0) : Icon ? 36 : 8,
            }}
            className={`absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 origin-left
            ${
              error
                ? "text-red-400"
                : isFocused
                ? "text-primary"
                : "text-gray-400"
            }
          `}
          >
            {label}
          </motion.label>

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 mt-1 text-xs text-red-500 font-medium ml-1"
          >
            <AlertCircle size={12} />
            <span>{error.message}</span>
          </motion.div>
        )}
      </div>
    );
  }
);

export default Input;
