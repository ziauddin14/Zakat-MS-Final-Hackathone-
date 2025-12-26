import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const Input = React.forwardRef(
  ({ label, type = "text", error, icon: Icon, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="space-y-2 mb-4 w-full">
        {label && (
          <label
            className={`block text-sm font-semibold ml-1 transition-colors duration-200 ${
              error
                ? "text-red-500"
                : isFocused
                ? "text-primary"
                : "text-gray-600"
            }`}
          >
            {label}
          </label>
        )}

        <div className="relative group">
          {/* Icon */}
          {Icon && (
            <div
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 pointer-events-none ${
                error
                  ? "text-red-400"
                  : isFocused
                  ? "text-primary"
                  : "text-gray-400 group-hover:text-gray-500"
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
              w-full bg-gray-50/50 border-2 rounded-xl py-4 px-4 outline-none transition-all duration-300 font-medium
              ${Icon ? "pl-12" : "pl-4"}
              ${isPassword ? "pr-12" : "pr-4"}
              ${
                error
                  ? "border-red-200 focus:border-red-500 bg-red-50/50 text-red-900 placeholder:text-red-300"
                  : "border-gray-100 hover:border-gray-200 focus:border-primary focus:bg-white text-gray-900 placeholder:text-gray-400"
              }
              focus:shadow-[0_0_0_4px_rgba(var(--primary-rgb),0.1)]
            `}
            onFocus={handleFocus}
            onBlur={(e) => {
              handleBlur();
              props.onBlur?.(e);
            }}
            {...props}
          />

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none p-1 rounded-full hover:bg-gray-100"
            >
              <motion.div
                initial={false}
                animate={{ rotate: showPassword ? 0 : 180 }}
                transition={{ duration: 0.2 }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </motion.div>
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-xs text-red-500 font-medium ml-1"
          >
            <AlertCircle size={14} />
            <span>{error.message}</span>
          </motion.div>
        )}
      </div>
    );
  }
);

export default Input;
