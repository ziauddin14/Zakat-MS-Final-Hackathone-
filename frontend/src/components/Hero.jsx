import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calculator, CheckCircle } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden h-full min-h-[90vh] flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute top-20 right-0 -z-10 bg-accent/10 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 left-0 -z-10 bg-primary/5 w-[500px] h-[500px] rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-accent/10 text-accent-hover font-medium text-sm mb-6 border border-accent/20">
                ✨ Trusted by 10,000+ Donors
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-gray-900 mb-6">
                Purify Your Wealth, <br />
                <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
                  Empower Lives.
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Experience a seamless, transparent, and spiritually rewarding
                way to manage your Zakat and Sadqa. We ensure your donations
                reach those who need them most.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-8 py-4 bg-primary text-white text-lg font-semibold rounded-2xl shadow-xl shadow-primary/25 hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                  >
                    Give Zakat Now <ArrowRight size={20} />
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(212, 175, 55, 0.1)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 hover:border-accent text-lg font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <Calculator size={20} className="text-accent" /> Calculate
                    Zakat
                  </motion.button>
                </Link>
              </div>

              <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-primary" /> 100%
                  Transparent
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-primary" /> Sharia
                  Compliant
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Visual */}
          <div className="lg:w-1/2 relative lg:h-[500px] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10 w-full max-w-md"
            >
              {/* Abstract Card Setup for 'Premium' feel without images yet */}
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl glass-effect border border-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 bg-accent/10 rounded-bl-3xl rounded-tr-3xl text-accent-hover font-bold">
                  Ramadan Goal 🌙
                </div>

                <div className="pt-8 space-y-8">
                  <div className="bg-surface p-4 rounded-2xl flex items-center gap-4 border border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                      Z
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Zakat Al-Mal</h4>
                      <p className="text-sm text-gray-500">Target: $5,000</p>
                    </div>
                    <div className="ml-auto font-bold text-primary">85%</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-primary">85%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="bg-primary h-full rounded-full"
                      ></motion.div>
                    </div>
                  </div>

                  <div className="flex justify-between text-center pt-2">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        $4,250
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        Raised
                      </div>
                    </div>
                    <div className="h-10 w-[1px] bg-gray-200"></div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        420
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        Donors
                      </div>
                    </div>
                    <div className="h-10 w-[1px] bg-gray-200"></div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">5</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        Days Left
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors">
                    View Campaign
                  </button>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  💧
                </div>
                <div>
                  <div className="text-sm font-bold">Clean Water</div>
                  <div className="text-xs text-gray-500">Campaign Active</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -top-10 -right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100"
              >
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  🥘
                </div>
                <div>
                  <div className="text-sm font-bold">Hot Meals</div>
                  <div className="text-xs text-gray-500">200 Served Today</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
