import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";
import DonateIcon from "./icons/DonateIcon";
import zakatLogo from "../assets/zakat-logo-processed.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    // Check for token to update login state
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const adminToken = localStorage.getItem("adminToken");
      setIsLoggedIn(!!token || !!adminToken);
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus); // Listen for changes across tabs

    // Also a custom event listener if we want to trigger it manually within same tab
    window.addEventListener("loginStateChange", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("loginStateChange", checkLoginStatus);
    };
  }, []);

  // Background opacity based on scroll
  const bgOpacity = useTransform(scrollY, [0, 50], [0, 0.95]);
  const shadow = useTransform(
    scrollY,
    [0, 50],
    ["none", "0 4px 6px -1px rgba(0, 0, 0, 0.1)"]
  );
  const backdropBlur = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(12px)"]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      style={{
        backgroundColor: `rgba(255, 255, 255, ${isScrolled ? 0.9 : 0})`,
        backdropFilter: isScrolled ? "blur(10px)" : "none",
        boxShadow: isScrolled ? "0 4px 6px -1px rgba(0, 0, 0, 0.05)" : "none",
      }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 flex items-center"
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
            <img
              src={zakatLogo}
              alt="Logo"
              className="w-6 h-6 object-contain"
            />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-dark to-primary">
            ZakatFlow
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {[
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about" },
            { name: "Campaigns", path: "/campaigns" },
            { name: "Zakat Calculator", path: "/zakat-calculator" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="font-medium text-gray-600 hover:text-primary transition-colors hover:bg-primary/5 px-3 py-2 rounded-lg"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <Link
              to={localStorage.getItem("adminToken") ? "/admin" : "/dashboard"}
              className="font-semibold text-gray-600 hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary border-2 border-primary px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-primary/10 transition-all flex items-center gap-2"
              >
                Sign In
              </motion.button>
            </Link>
          )}

          <Link to={isLoggedIn ? "/donate" : "/login"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-primary/30 transition-all flex items-center gap-2"
            >
              <span>Donate Now</span>
              <DonateIcon size={26} />
            </motion.button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 left-0 right-0 bg-white shadow-xl p-6 md:hidden flex flex-col gap-4 border-t"
        >
          {[
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about" },
            { name: "Campaigns", path: "/campaigns" },
            { name: "Zakat Calculator", path: "/zakat-calculator" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-lg font-medium text-gray-700 py-2 border-b border-gray-100 block"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          <Link
            to="/login"
            className="text-lg font-medium text-gray-700 py-2 border-b border-gray-100 block"
            onClick={() => setMobileMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link to={isLoggedIn ? "/donate" : "/login"}>
            <button className="bg-primary text-white w-full py-3 rounded-xl font-bold mt-2">
              Donate Now
            </button>
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
