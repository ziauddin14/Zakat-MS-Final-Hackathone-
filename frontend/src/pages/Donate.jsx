import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  DollarSign,
  Wallet,
  CheckCircle,
  Heart,
  ArrowRight,
} from "lucide-react";
import Input from "../components/ui/Input";

const Donate = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: 100,
      type: "Zakat",
      category: "General",
      method: "card",
    },
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const selectedAmount = watch("amount");
  const selectedType = watch("type");
  const selectedMethod = watch("method");

  const onSubmit = (data) => {
    console.log("Donation Data:", data);
    // Simulate API
    setTimeout(() => setIsSuccess(true), 1500);
  };

  const presetAmounts = [50, 100, 250, 500, 1000];
  const donationTypes = ["Zakat", "Sadaqah", "Fitra", "General"];

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-md w-full"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            JazakAllah Khair!
          </h2>
          <p className="text-gray-500 mb-8">
            May Allah accept your donation and bless your wealth. A receipt has
            been sent to your email.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all"
          >
            Make Another Donation
          </button>
          <a
            href="/dashboard"
            className="block mt-4 text-sm font-medium text-gray-500 hover:text-primary"
          >
            Go to Dashboard
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Your Donation
          </h1>
          <p className="text-gray-500">
            Secure, transparent, and immediate impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="md:col-span-2 space-y-8">
            {/* 1. Donation Amount */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                  1
                </div>
                Choose Amount
              </h2>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setValue("amount", amt)}
                    className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                      selectedAmount == amt
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-100 text-gray-600 hover:border-gray-200"
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <DollarSign size={20} />
                </div>
                <input
                  type="number"
                  {...register("amount", { required: true, min: 1 })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-xl outline-none text-lg font-bold transition-all"
                  placeholder="Enter custom amount"
                />
              </div>
            </section>

            {/* 2. Donation Details */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                  2
                </div>
                Donation Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Donation Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {donationTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setValue("type", type)}
                        className={`py-3 px-2 rounded-xl text-sm font-medium border-2 transition-all ${
                          selectedType === type
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-100 text-gray-600 hover:border-gray-200"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <input type="hidden" {...register("type")} />
                </div>

                <Input
                  label="Message / Dedication (Optional)"
                  {...register("message")}
                  placeholder="e.g. In memory of..."
                />
              </div>
            </section>

            {/* 3. Payment Method */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                  3
                </div>
                Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setValue("method", "card")}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                    selectedMethod === "card"
                      ? "border-primary bg-primary/5"
                      : "border-gray-100"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedMethod === "card"
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      Credit / Debit Card
                    </div>
                    <div className="text-xs text-gray-500">Stripe Secure</div>
                  </div>
                  {selectedMethod === "card" && (
                    <CheckCircle size={20} className="ml-auto text-primary" />
                  )}
                </div>
                <div
                  onClick={() => setValue("method", "paypal")}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                    selectedMethod === "paypal"
                      ? "border-primary bg-primary/5"
                      : "border-gray-100"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedMethod === "paypal"
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Wallet size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">PayPal</div>
                    <div className="text-xs text-gray-500">Fast Checkout</div>
                  </div>
                  {selectedMethod === "paypal" && (
                    <CheckCircle size={20} className="ml-auto text-primary" />
                  )}
                </div>
              </div>
              <input type="hidden" {...register("method")} />
            </section>
          </div>

          {/* Summary Sidebar */}
          <div className="md:col-span-1">
            <div className="sticky top-28 bg-white p-6 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100">
              <h3 className="font-bold text-lg mb-6">Donation Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium text-gray-900">
                    {selectedType}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-medium text-gray-900">
                    ${selectedAmount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Processing Fee</span>
                  <span className="font-medium text-green-600">Covered</span>
                </div>
                <div className="h-px bg-gray-100 my-2"></div>
                <div className="flex justify-between items-end">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${selectedAmount}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit(onSubmit)}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
              >
                Complete Donation <ArrowRight size={20} />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <Heart size={12} className="text-red-400" fill="currentColor" />{" "}
                Secure SSL Encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
