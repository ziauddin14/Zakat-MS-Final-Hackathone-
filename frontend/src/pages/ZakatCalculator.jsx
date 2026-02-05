// import React, { useState, useRef, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   Wallet,
//   Coins,
//   TrendingUp,
//   Building2,
//   FileText,
//   CreditCard,
//   Calculator,
//   CheckCircle,
//   AlertCircle,
//   Sparkles,
//   ArrowRight,
// } from "lucide-react";

// // Configurable constants (based on Hanafi fiqh)
// const CONSTANTS = {
//   SILVER_NISAB_GRAMS: 612.36, // Hanafi nisab (fixed)
//   ZAKAT_PERCENTAGE: 2.5, // 2.5% (fixed)
//   TOLA_TO_GRAMS: 11.664, // 1 Tola = 11.664 grams (fixed)
//   // Fallback rates (used if API fails)
//   FALLBACK_GOLD_RATE: 40500, // PKR per tola
//   FALLBACK_SILVER_RATE: 718, // PKR per tola
// };

// const ZakatCalculator = () => {
//   const [result, setResult] = useState(null);
//   const [showResult, setShowResult] = useState(false);
//   const [goldRate, setGoldRate] = useState(null);
//   const [silverRate, setSilverRate] = useState(null);
//   const [ratesLoading, setRatesLoading] = useState(true);
//   const [ratesError, setRatesError] = useState(false);

//   // Using refs for uncontrolled inputs
//   const cashInHandRef = useRef(null);
//   const bankBalanceRef = useRef(null);
//   const goldGramsRef = useRef(null);
//   const goldUnitRef = useRef(null);
//   const silverGramsRef = useRef(null);
//   const silverUnitRef = useRef(null);
//   const businessStockRef = useRef(null);
//   const receivablesRef = useRef(null);
//   const liabilitiesRef = useRef(null);

//   // Fetch live gold and silver rates
//   useEffect(() => {
//     const fetchRates = async () => {
//       try {
//         setRatesLoading(true);
//         const response = await fetch("https://www.goldapi.io/api/XAU/PKR", {
//           headers: {
//             "x-access-token": "goldapi-jm2qrsmjp7dz1i-io",
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           const goldPerGram = data.price / 31.1035;
//           setGoldRate(goldPerGram);
//           const silverPerGram = goldPerGram / 70;
//           setSilverRate(silverPerGram);
//           setRatesError(false);
//         } else {
//           throw new Error("API failed");
//         }

//         setGoldRate(CONSTANTS.FALLBACK_GOLD_RATE / CONSTANTS.TOLA_TO_GRAMS);
//         setSilverRate(CONSTANTS.FALLBACK_SILVER_RATE / CONSTANTS.TOLA_TO_GRAMS);
//         setRatesError(false);
//       } catch (error) {
//         console.log("Using Pakistan local market rates:", error);
//         setGoldRate(CONSTANTS.FALLBACK_GOLD_RATE / CONSTANTS.TOLA_TO_GRAMS);
//         setSilverRate(CONSTANTS.FALLBACK_SILVER_RATE / CONSTANTS.TOLA_TO_GRAMS);
//         setRatesError(false);
//       } finally {
//         setRatesLoading(false);
//       }
//     };

//     fetchRates();
//     // Refresh rates every hour (in case we add live API later)
//     const interval = setInterval(fetchRates, 3600000);
//     return () => clearInterval(interval);
//   }, []);

//   const calculateZakat = () => {
//     // Use dynamic rates or fallback
//     const currentGoldRate =
//       goldRate || CONSTANTS.FALLBACK_GOLD_RATE / CONSTANTS.TOLA_TO_GRAMS;
//     const currentSilverRate =
//       silverRate || CONSTANTS.FALLBACK_SILVER_RATE / CONSTANTS.TOLA_TO_GRAMS;

//     // Get values from refs
//     const cash = parseFloat(cashInHandRef.current?.value) || 0;
//     const bank = parseFloat(bankBalanceRef.current?.value) || 0;

//     // Convert gold to grams if in tola
//     const goldInGrams =
//       goldUnitRef.current?.value === "tola"
//         ? (parseFloat(goldGramsRef.current?.value) || 0) *
//           CONSTANTS.TOLA_TO_GRAMS
//         : parseFloat(goldGramsRef.current?.value) || 0;
//     const goldValue = goldInGrams * currentGoldRate;

//     // Convert silver to grams if in tola
//     const silverInGrams =
//       silverUnitRef.current?.value === "tola"
//         ? (parseFloat(silverGramsRef.current?.value) || 0) *
//           CONSTANTS.TOLA_TO_GRAMS
//         : parseFloat(silverGramsRef.current?.value) || 0;
//     const silverValue = silverInGrams * currentSilverRate;

//     const stock = parseFloat(businessStockRef.current?.value) || 0;
//     const receivables = parseFloat(receivablesRef.current?.value) || 0;
//     const liabilities = parseFloat(liabilitiesRef.current?.value) || 0;

//     // Calculate total assets
//     const totalAssets =
//       cash + bank + goldValue + silverValue + stock + receivables;

//     // Calculate net zakatable wealth
//     const netZakatable = totalAssets - liabilities;

//     // Calculate nisab threshold using current silver rate
//     const nisabValue = CONSTANTS.SILVER_NISAB_GRAMS * currentSilverRate;

//     // Calculate zakat
//     const zakatPayable =
//       netZakatable >= nisabValue
//         ? (netZakatable * CONSTANTS.ZAKAT_PERCENTAGE) / 100
//         : 0;

//     setResult({
//       totalAssets,
//       liabilities,
//       netZakatable,
//       nisabValue,
//       nisabReached: netZakatable >= nisabValue,
//       zakatPayable,
//       goldRate: currentGoldRate,
//       silverRate: currentSilverRate,
//     });

//     setShowResult(true);
//   };

//   const resetCalculator = () => {
//     // Reset all input fields
//     if (cashInHandRef.current) cashInHandRef.current.value = "";
//     if (bankBalanceRef.current) bankBalanceRef.current.value = "";
//     if (goldGramsRef.current) goldGramsRef.current.value = "";
//     if (goldUnitRef.current) goldUnitRef.current.value = "grams";
//     if (silverGramsRef.current) silverGramsRef.current.value = "";
//     if (silverUnitRef.current) silverUnitRef.current.value = "grams";
//     if (businessStockRef.current) businessStockRef.current.value = "";
//     if (receivablesRef.current) receivablesRef.current.value = "";
//     if (liabilitiesRef.current) liabilitiesRef.current.value = "";

//     setShowResult(false);
//     setResult(null);
//   };

//   const InputField = ({
//     icon: Icon,
//     label,
//     inputRef,
//     placeholder,
//     unit,
//     unitRef,
//   }) => (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="space-y-2"
//     >
//       <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//         <Icon size={16} className="text-primary" />
//         {label}
//       </label>
//       <div className="flex gap-2">
//         <input
//           ref={inputRef}
//           type="number"
//           placeholder={placeholder}
//           min="0"
//           step="any"
//           defaultValue=""
//           className="flex-1 px-4 py-3 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-primary transition-all"
//         />
//         {unit && (
//           <select
//             ref={unitRef}
//             defaultValue="grams"
//             className="px-4 py-3 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-primary transition-all"
//           >
//             <option value="grams">Grams</option>
//             <option value="tola">Tola</option>
//           </select>
//         )}
//       </div>
//     </motion.div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-28 pb-20 px-4 sm:px-6">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-12"
//         >
//           <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
//             <Sparkles size={16} />
//             Shariah-Compliant Calculator
//           </div>
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//             Zakat Calculator
//           </h1>
//           <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//             Calculate your Zakat obligation based on Hanafi fiqh principles.
//             Enter your assets and liabilities to determine your Zakat amount.
//           </p>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Calculator Form */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Liquid Assets */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
//             >
//               <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
//                   <Wallet size={18} />
//                 </div>
//                 Liquid Assets
//               </h3>
//               <div className="space-y-4">
//                 <InputField
//                   icon={Wallet}
//                   label="Cash in Hand"
//                   inputRef={cashInHandRef}
//                   placeholder="0"
//                 />
//                 <InputField
//                   icon={Building2}
//                   label="Bank Balance"
//                   inputRef={bankBalanceRef}
//                   placeholder="0"
//                 />
//               </div>
//             </motion.div>

//             {/* Precious Metals */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.1 }}
//               className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
//             >
//               <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
//                   <Coins size={18} />
//                 </div>
//                 Precious Metals
//               </h3>
//               <div className="space-y-4">
//                 <InputField
//                   icon={Coins}
//                   label="Gold"
//                   inputRef={goldGramsRef}
//                   placeholder="0"
//                   unit={true}
//                   unitRef={goldUnitRef}
//                 />
//                 <InputField
//                   icon={Coins}
//                   label="Silver"
//                   inputRef={silverGramsRef}
//                   placeholder="0"
//                   unit={true}
//                   unitRef={silverUnitRef}
//                 />
//               </div>
//             </motion.div>

//             {/* Business & Receivables */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2 }}
//               className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
//             >
//               <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
//                   <TrendingUp size={18} />
//                 </div>
//                 Business & Receivables
//               </h3>
//               <div className="space-y-4">
//                 <InputField
//                   icon={Building2}
//                   label="Total Value : (Business Stock / Plots / Properties / Vehicles / Other Assets)"
//                   inputRef={businessStockRef}
//                   placeholder="0"
//                 />
//                 <InputField
//                   icon={FileText}
//                   label="Money Expected to be Received (Total Value)"
//                   inputRef={receivablesRef}
//                   placeholder="0"
//                 />
//               </div>
//             </motion.div>

//             {/* Liabilities */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3 }}
//               className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
//             >
//               <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
//                   <CreditCard size={18} />
//                 </div>
//                 Liabilities (Deductions)
//               </h3>
//               <div className="space-y-4">
//                 <InputField
//                   icon={CreditCard}
//                   label="Short-term Debts & Bills (Total Value)"
//                   inputRef={liabilitiesRef}
//                   placeholder="0"
//                 />
//               </div>
//             </motion.div>

//             {/* Action Buttons */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//               className="flex gap-4"
//             >
//               <button
//                 onClick={calculateZakat}
//                 className="flex-1 bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
//               >
//                 <Calculator size={20} />
//                 Calculate Zakat
//               </button>
//               <button
//                 onClick={resetCalculator}
//                 className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
//               >
//                 Reset
//               </button>
//             </motion.div>
//           </div>

//           {/* Result Panel */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-28">
//               {!showResult ? (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-3xl border-2 border-primary/20 text-center"
//                 >
//                   <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Calculator size={40} className="text-primary" />
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-900 mb-2">
//                     Ready to Calculate
//                   </h3>
//                   <p className="text-gray-600 text-sm">
//                     Fill in your assets and liabilities, then click "Calculate
//                     Zakat" to see your obligation.
//                   </p>
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="space-y-4"
//                 >
//                   {/* Nisab Status */}
//                   <div
//                     className={`p-6 rounded-3xl border-2 ${
//                       result.nisabReached
//                         ? "bg-green-50 border-green-200"
//                         : "bg-orange-50 border-orange-200"
//                     }`}
//                   >
//                     <div className="flex items-center gap-3 mb-4">
//                       {result.nisabReached ? (
//                         <CheckCircle size={24} className="text-green-600" />
//                       ) : (
//                         <AlertCircle size={24} className="text-orange-600" />
//                       )}
//                       <h4 className="font-bold text-lg">
//                         {result.nisabReached ? "Nisab Reached" : "Below Nisab"}
//                       </h4>
//                     </div>
//                     <p className="text-sm text-gray-600">
//                       {result.nisabReached
//                         ? "Your wealth has reached the Nisab threshold. Zakat is obligatory."
//                         : "Your wealth is below the Nisab threshold. Zakat is not obligatory at this time."}
//                     </p>
//                   </div>

//                   {/* Calculation Summary */}
//                   <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
//                     <h4 className="font-bold text-lg mb-4">
//                       Calculation Summary
//                     </h4>
//                     <div className="space-y-3">
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-600">Total Assets</span>
//                         <span className="font-semibold">
//                           Rs. {result.totalAssets.toLocaleString()}
//                         </span>
//                       </div>
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-600">Liabilities</span>
//                         <span className="font-semibold text-red-600">
//                           - Rs. {result.liabilities.toLocaleString()}
//                         </span>
//                       </div>
//                       <div className="h-px bg-gray-200"></div>
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-600">Net Zakatable</span>
//                         <span className="font-bold">
//                           Rs. {result.netZakatable.toLocaleString()}
//                         </span>
//                       </div>
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-600">Nisab Threshold</span>
//                         <span className="font-semibold text-primary">
//                           Rs. {result.nisabValue.toLocaleString()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Zakat Amount */}
//                   <div className="bg-gradient-to-br from-primary to-primary-dark p-8 rounded-3xl shadow-xl text-white text-center">
//                     <p className="text-sm opacity-90 mb-2">Your Zakat Amount</p>
//                     <h2 className="text-4xl font-bold mb-4">
//                       Rs. {result.zakatPayable.toLocaleString()}
//                     </h2>
//                     {result.zakatPayable > 0 && (
//                       <button className="w-full bg-white text-primary py-3 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
//                         Pay Zakat Now
//                         <ArrowRight size={18} />
//                       </button>
//                     )}
//                   </div>
//                 </motion.div>
//               )}

//               {/* Disclaimer */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.5 }}
//                 className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl"
//               >
//                 <p className="text-xs text-blue-800">
//                   <strong>Note:</strong> This calculation is based on Hanafi
//                   fiqh. For complex cases or specific questions, please consult
//                   a qualified Mufti.
//                 </p>
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ZakatCalculator;
// import React, { useState, useRef, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   Wallet,
//   Coins,
//   TrendingUp,
//   Building2,
//   FileText,
//   CreditCard,
//   Calculator,
//   CheckCircle,
//   AlertCircle,
//   Sparkles,
//   ArrowRight,
//   RefreshCw,
// } from "lucide-react";

// // Configurable constants (based on Hanafi fiqh)
// const CONSTANTS = {
//   SILVER_NISAB_GRAMS: 612.36, // Hanafi nisab (fixed)
//   ZAKAT_PERCENTAGE: 2.5, // 2.5% (fixed)
//   TOLA_TO_GRAMS: 11.664, // 1 Tola = 11.664 grams (fixed)

//   // Fallback rates (used if API fails)
//   // These are PKR per tola (your local-market fallback)
//   FALLBACK_GOLD_RATE: 40500,
//   FALLBACK_SILVER_RATE: 718,
// };

// // Helpers
// const formatPKR = (n) =>
//   `Rs. ${Number.isFinite(n) ? Math.round(n).toLocaleString() : "—"}`;

// const formatPKRPrecise = (n) =>
//   `Rs. ${Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}`;

// const ZakatCalculator = () => {
//   const [result, setResult] = useState(null);
//   const [showResult, setShowResult] = useState(false);

//   // Rates
//   const [goldRate24K, setGoldRate24K] = useState(null); // PKR per gram (24K)
//   const [silverRate, setSilverRate] = useState(null); // PKR per gram
//   const [ratesLoading, setRatesLoading] = useState(true);
//   const [ratesError, setRatesError] = useState(false);

//   // Gold karat selection
//   const [goldKarat, setGoldKarat] = useState(24); // 20, 22, 24

//   // Using refs for uncontrolled inputs
//   const cashInHandRef = useRef(null);
//   const bankBalanceRef = useRef(null);
//   const goldGramsRef = useRef(null);
//   const goldUnitRef = useRef(null);
//   const silverGramsRef = useRef(null);
//   const silverUnitRef = useRef(null);
//   const businessStockRef = useRef(null);
//   const receivablesRef = useRef(null);
//   const liabilitiesRef = useRef(null);

//   const TROY_OUNCE_GRAMS = 31.1034768;

//   const applyFallbackRates = () => {
//     // Fallback is given per tola => convert to per gram
//     setGoldRate24K(CONSTANTS.FALLBACK_GOLD_RATE / CONSTANTS.TOLA_TO_GRAMS);
//     setSilverRate(CONSTANTS.FALLBACK_SILVER_RATE / CONSTANTS.TOLA_TO_GRAMS);
//   };

//   const fetchRates = async () => {
//     try {
//       setRatesLoading(true);
//       setRatesError(false);

//       // IMPORTANT: For production, keep this token on backend, not client.
//       const headers = { "x-access-token": "goldapi-jm2qrsmjp7dz1i-io" };

//       const [goldRes, silverRes] = await Promise.all([
//         fetch("https://www.goldapi.io/api/XAU/PKR", { headers }),
//         fetch("https://www.goldapi.io/api/XAG/PKR", { headers }),
//       ]);

//       if (!goldRes.ok || !silverRes.ok) {
//         throw new Error("GoldAPI failed");
//       }

//       const goldData = await goldRes.json();
//       const silverData = await silverRes.json();

//       // GoldAPI usually returns price per troy ounce
//       const goldPerGram24K = goldData.price / TROY_OUNCE_GRAMS;
//       const silverPerGram = silverData.price / TROY_OUNCE_GRAMS;

//       setGoldRate24K(goldPerGram24K);
//       setSilverRate(silverPerGram);
//       setRatesError(false);
//     } catch (error) {
//       console.log("Using fallback local rates:", error);
//       setRatesError(true);
//       applyFallbackRates();
//     } finally {
//       setRatesLoading(false);
//     }
//   };

//   // Fetch live gold and silver rates
//   useEffect(() => {
//     fetchRates();
//     const interval = setInterval(fetchRates, 3600000); // hourly refresh
//     return () => clearInterval(interval);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const getEffectiveGoldRateByKarat = () => {
//     const base24K =
//       goldRate24K || CONSTANTS.FALLBACK_GOLD_RATE / CONSTANTS.TOLA_TO_GRAMS;
//     return base24K * (goldKarat / 24);
//   };

//   const calculateZakat = () => {
//     // Use dynamic rates or fallback
//     const currentGoldRate24K =
//       goldRate24K || CONSTANTS.FALLBACK_GOLD_RATE / CONSTANTS.TOLA_TO_GRAMS;
//     const currentSilverRate =
//       silverRate || CONSTANTS.FALLBACK_SILVER_RATE / CONSTANTS.TOLA_TO_GRAMS;

//     // Apply karat factor (24K -> selected K)
//     const goldRateApplied = currentGoldRate24K * (goldKarat / 24);

//     // Get values from refs
//     const cash = parseFloat(cashInHandRef.current?.value) || 0;
//     const bank = parseFloat(bankBalanceRef.current?.value) || 0;

//     // Convert gold to grams if in tola
//     const goldInGrams =
//       goldUnitRef.current?.value === "tola"
//         ? (parseFloat(goldGramsRef.current?.value) || 0) *
//           CONSTANTS.TOLA_TO_GRAMS
//         : parseFloat(goldGramsRef.current?.value) || 0;
//     const goldValue = goldInGrams * goldRateApplied;

//     // Convert silver to grams if in tola
//     const silverInGrams =
//       silverUnitRef.current?.value === "tola"
//         ? (parseFloat(silverGramsRef.current?.value) || 0) *
//           CONSTANTS.TOLA_TO_GRAMS
//         : parseFloat(silverGramsRef.current?.value) || 0;
//     const silverValue = silverInGrams * currentSilverRate;

//     const stock = parseFloat(businessStockRef.current?.value) || 0;
//     const receivables = parseFloat(receivablesRef.current?.value) || 0;
//     const liabilities = parseFloat(liabilitiesRef.current?.value) || 0;

//     // Calculate total assets
//     const totalAssets =
//       cash + bank + goldValue + silverValue + stock + receivables;

//     // Calculate net zakatable wealth
//     const netZakatable = totalAssets - liabilities;

//     // Calculate nisab threshold using current silver rate
//     const nisabValue = CONSTANTS.SILVER_NISAB_GRAMS * currentSilverRate;

//     // Calculate zakat
//     const zakatPayable =
//       netZakatable >= nisabValue
//         ? (netZakatable * CONSTANTS.ZAKAT_PERCENTAGE) / 100
//         : 0;

//     setResult({
//       totalAssets,
//       liabilities,
//       netZakatable,
//       nisabValue,
//       nisabReached: netZakatable >= nisabValue,
//       zakatPayable,
//       goldRate24K: currentGoldRate24K,
//       goldRateApplied,
//       silverRate: currentSilverRate,
//       goldKarat,
//       ratesSource: ratesError ? "Fallback" : "Live",
//     });

//     setShowResult(true);
//   };

//   const resetCalculator = () => {
//     // Reset all input fields
//     if (cashInHandRef.current) cashInHandRef.current.value = "";
//     if (bankBalanceRef.current) bankBalanceRef.current.value = "";
//     if (goldGramsRef.current) goldGramsRef.current.value = "";
//     if (goldUnitRef.current) goldUnitRef.current.value = "grams";
//     if (silverGramsRef.current) silverGramsRef.current.value = "";
//     if (silverUnitRef.current) silverUnitRef.current.value = "grams";
//     if (businessStockRef.current) businessStockRef.current.value = "";
//     if (receivablesRef.current) receivablesRef.current.value = "";
//     if (liabilitiesRef.current) liabilitiesRef.current.value = "";

//     setShowResult(false);
//     setResult(null);
//   };

//   const InputField = ({
//     icon: Icon,
//     label,
//     inputRef,
//     placeholder,
//     unit,
//     unitRef,
//     rightSlot,
//   }) => (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="space-y-2"
//     >
//       <label className="flex items-center justify-between gap-2 text-sm font-medium text-gray-700">
//         <span className="flex items-center gap-2">
//           <Icon size={16} className="text-primary" />
//           {label}
//         </span>
//         {rightSlot ? <span>{rightSlot}</span> : null}
//       </label>

//       <div className="flex gap-2">
//         <input
//           ref={inputRef}
//           type="number"
//           placeholder={placeholder}
//           min="0"
//           step="any"
//           defaultValue=""
//           className="flex-1 px-4 py-3 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-primary transition-all"
//         />
//         {unit && (
//           <select
//             ref={unitRef}
//             defaultValue="grams"
//             className="px-4 py-3 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-primary transition-all"
//           >
//             <option value="grams">Grams</option>
//             <option value="tola">Tola</option>
//           </select>
//         )}
//       </div>
//     </motion.div>
//   );

//   const LiveRatesBox = () => {
//     const baseGold24 =
//       goldRate24K || CONSTANTS.FALLBACK_GOLD_RATE / CONSTANTS.TOLA_TO_GRAMS;
//     const effectiveGold = getEffectiveGoldRateByKarat();
//     const currentSilver =
//       silverRate || CONSTANTS.FALLBACK_SILVER_RATE / CONSTANTS.TOLA_TO_GRAMS;

//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 8 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100"
//       >
//         <div className="flex items-start justify-between gap-3 mb-4">
//           <div>
//             <h4 className="font-bold text-gray-900 flex items-center gap-2">
//               <Coins size={18} className="text-primary" />
//               Live Rates
//             </h4>
//             <p className="text-xs text-gray-500 mt-1">
//               PKR per gram (used in calculation)
//             </p>
//           </div>

//           <div className="flex items-center gap-2">
//             <span
//               className={`text-xs font-semibold px-3 py-1 rounded-full border ${
//                 ratesError
//                   ? "bg-orange-50 text-orange-700 border-orange-200"
//                   : "bg-green-50 text-green-700 border-green-200"
//               }`}
//             >
//               {ratesLoading ? "Loading…" : ratesError ? "Fallback" : "Live"}
//             </span>

//             <button
//               type="button"
//               onClick={fetchRates}
//               className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all"
//               title="Refresh rates"
//             >
//               <RefreshCw size={16} className="text-gray-700" />
//             </button>
//           </div>
//         </div>

//         <div className="space-y-3 text-sm">
//           <div className="flex items-center justify-between">
//             <span className="text-gray-600">Gold (24K)</span>
//             <span className="font-semibold">
//               {formatPKRPrecise(baseGold24)}
//             </span>
//           </div>

//           <div className="flex items-center justify-between">
//             <span className="text-gray-600">Gold ({goldKarat}K)</span>
//             <span className="font-semibold">
//               {formatPKRPrecise(effectiveGold)}
//             </span>
//           </div>

//           <div className="flex items-center justify-between">
//             <span className="text-gray-600">Silver</span>
//             <span className="font-semibold">
//               {formatPKRPrecise(currentSilver)}
//             </span>
//           </div>

//           <div className="h-px bg-gray-100" />

//           <div className="flex items-center justify-between">
//             <span className="text-gray-600">Nisab (Silver)</span>
//             <span className="font-semibold text-primary">
//               {formatPKRPrecise(CONSTANTS.SILVER_NISAB_GRAMS * currentSilver)}
//             </span>
//           </div>
//         </div>
//       </motion.div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-28 pb-20 px-4 sm:px-6">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-12"
//         >
//           <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
//             <Sparkles size={16} />
//             Shariah-Compliant Calculator
//           </div>
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//             Zakat Calculator
//           </h1>
//           <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//             Calculate your Zakat obligation based on Hanafi fiqh principles.
//             Enter your assets and liabilities to determine your Zakat amount.
//           </p>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Calculator Form */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* ✅ Live Rates Box */}
//             <LiveRatesBox />

//             {/* Liquid Assets */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
//             >
//               <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
//                   <Wallet size={18} />
//                 </div>
//                 Liquid Assets
//               </h3>
//               <div className="space-y-4">
//                 <InputField
//                   icon={Wallet}
//                   label="Cash in Hand"
//                   inputRef={cashInHandRef}
//                   placeholder="0"
//                 />
//                 <InputField
//                   icon={Building2}
//                   label="Bank Balance"
//                   inputRef={bankBalanceRef}
//                   placeholder="0"
//                 />
//               </div>
//             </motion.div>

//             {/* Precious Metals */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.1 }}
//               className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
//             >
//               <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
//                   <Coins size={18} />
//                 </div>
//                 Precious Metals
//               </h3>

//               <div className="space-y-4">
//                 <InputField
//                   icon={Coins}
//                   label="Gold"
//                   inputRef={goldGramsRef}
//                   placeholder="0"
//                   unit={true}
//                   unitRef={goldUnitRef}
//                   rightSlot={
//                     <select
//                       value={goldKarat}
//                       onChange={(e) =>
//                         setGoldKarat(parseInt(e.target.value, 10))
//                       }
//                       className="text-xs font-semibold px-3 py-2 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-primary transition-all"
//                       title="Gold purity"
//                     >
//                       <option value={24}>24K</option>
//                       <option value={22}>22K</option>
//                       <option value={20}>20K</option>
//                     </select>
//                   }
//                 />

//                 <InputField
//                   icon={Coins}
//                   label="Silver"
//                   inputRef={silverGramsRef}
//                   placeholder="0"
//                   unit={true}
//                   unitRef={silverUnitRef}
//                 />
//               </div>
//             </motion.div>

//             {/* Business & Receivables */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2 }}
//               className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
//             >
//               <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
//                   <TrendingUp size={18} />
//                 </div>
//                 Business & Receivables
//               </h3>
//               <div className="space-y-4">
//                 <InputField
//                   icon={Building2}
//                   label="Total Value : (Business Stock / Plots / Properties / Vehicles / Other Assets)"
//                   inputRef={businessStockRef}
//                   placeholder="0"
//                 />
//                 <InputField
//                   icon={FileText}
//                   label="Money Expected to be Received (Total Value)"
//                   inputRef={receivablesRef}
//                   placeholder="0"
//                 />
//               </div>
//             </motion.div>

//             {/* Liabilities */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3 }}
//               className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
//             >
//               <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
//                   <CreditCard size={18} />
//                 </div>
//                 Liabilities (Deductions)
//               </h3>
//               <div className="space-y-4">
//                 <InputField
//                   icon={CreditCard}
//                   label="Short-term Debts & Bills (Total Value)"
//                   inputRef={liabilitiesRef}
//                   placeholder="0"
//                 />
//               </div>
//             </motion.div>

//             {/* Action Buttons */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//               className="flex gap-4"
//             >
//               <button
//                 onClick={calculateZakat}
//                 className="flex-1 bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
//               >
//                 <Calculator size={20} />
//                 Calculate Zakat
//               </button>
//               <button
//                 onClick={resetCalculator}
//                 className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
//               >
//                 Reset
//               </button>
//             </motion.div>
//           </div>

//           {/* Result Panel */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-28">
//               {!showResult ? (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-3xl border-2 border-primary/20 text-center"
//                 >
//                   <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Calculator size={40} className="text-primary" />
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-900 mb-2">
//                     Ready to Calculate
//                   </h3>
//                   <p className="text-gray-600 text-sm">
//                     Fill in your assets and liabilities, then click "Calculate
//                     Zakat" to see your obligation.
//                   </p>
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="space-y-4"
//                 >
//                   {/* Nisab Status */}
//                   <div
//                     className={`p-6 rounded-3xl border-2 ${
//                       result.nisabReached
//                         ? "bg-green-50 border-green-200"
//                         : "bg-orange-50 border-orange-200"
//                     }`}
//                   >
//                     <div className="flex items-center gap-3 mb-4">
//                       {result.nisabReached ? (
//                         <CheckCircle size={24} className="text-green-600" />
//                       ) : (
//                         <AlertCircle size={24} className="text-orange-600" />
//                       )}
//                       <h4 className="font-bold text-lg">
//                         {result.nisabReached ? "Nisab Reached" : "Below Nisab"}
//                       </h4>
//                     </div>
//                     <p className="text-sm text-gray-600">
//                       {result.nisabReached
//                         ? "Your wealth has reached the Nisab threshold. Zakat is obligatory."
//                         : "Your wealth is below the Nisab threshold. Zakat is not obligatory at this time."}
//                     </p>

//                     <div className="mt-4 text-xs text-gray-600 flex items-center justify-between">
//                       <span className="font-semibold">
//                         Rates Source: {result.ratesSource}
//                       </span>
//                       <span>Gold: {result.goldKarat}K</span>
//                     </div>
//                   </div>

//                   {/* Calculation Summary */}
//                   <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
//                     <h4 className="font-bold text-lg mb-4">
//                       Calculation Summary
//                     </h4>

//                     <div className="space-y-3">
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-600">Total Assets</span>
//                         <span className="font-semibold">
//                           {formatPKR(result.totalAssets)}
//                         </span>
//                       </div>

//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-600">Liabilities</span>
//                         <span className="font-semibold text-red-600">
//                           - {formatPKR(result.liabilities)}
//                         </span>
//                       </div>

//                       <div className="h-px bg-gray-200"></div>

//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-600">Net Zakatable</span>
//                         <span className="font-bold">
//                           {formatPKR(result.netZakatable)}
//                         </span>
//                       </div>

//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-600">Nisab Threshold</span>
//                         <span className="font-semibold text-primary">
//                           {formatPKR(result.nisabValue)}
//                         </span>
//                       </div>

//                       <div className="h-px bg-gray-100"></div>

//                       {/* Rates used */}
//                       <div className="text-xs text-gray-600 space-y-1">
//                         <div className="flex justify-between">
//                           <span>Gold rate used ({result.goldKarat}K)</span>
//                           <span className="font-semibold">
//                             {formatPKRPrecise(result.goldRateApplied)} / gram
//                           </span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Silver rate used</span>
//                           <span className="font-semibold">
//                             {formatPKRPrecise(result.silverRate)} / gram
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Zakat Amount */}
//                   <div className="bg-gradient-to-br from-primary to-primary-dark p-8 rounded-3xl shadow-xl text-white text-center">
//                     <p className="text-sm opacity-90 mb-2">Your Zakat Amount</p>
//                     <h2 className="text-4xl font-bold mb-4">
//                       {formatPKR(result.zakatPayable)}
//                     </h2>
//                     {result.zakatPayable > 0 && (
//                       <button className="w-full bg-white text-primary py-3 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
//                         Pay Zakat Now
//                         <ArrowRight size={18} />
//                       </button>
//                     )}
//                   </div>
//                 </motion.div>
//               )}

//               {/* Disclaimer */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.5 }}
//                 className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl"
//               >
//                 <p className="text-xs text-blue-800">
//                   <strong>Note:</strong> This calculation is based on Hanafi
//                   fiqh. For complex cases or specific questions, please consult
//                   a qualified Mufti.
//                 </p>
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ZakatCalculator;
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Coins,
  TrendingUp,
  Building2,
  FileText,
  CreditCard,
  Calculator,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  Gem,
} from "lucide-react";

// Configurable constants (based on Hanafi fiqh)
const CONSTANTS = {
  SILVER_NISAB_GRAMS: 612.36, // Hanafi nisab (fixed)
  ZAKAT_PERCENTAGE: 2.5, // 2.5% (fixed)
  TOLA_TO_GRAMS: 11.664, // 1 Tola = 11.664 grams (fixed)

  // Fallback rates (PKR per tola) — used if API fails and manual override OFF
  FALLBACK_GOLD_RATE_24K_PER_TOLA: 40500,
  FALLBACK_SILVER_RATE_PER_TOLA: 718,
};

// ---------- Helpers ----------
const isFiniteNumber = (n) => Number.isFinite(n);

const formatPKR = (n) =>
  `Rs. ${isFiniteNumber(n) ? Math.round(n).toLocaleString() : "—"}`;

const formatPKR2 = (n) =>
  `Rs. ${isFiniteNumber(n) ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}`;

const toTola = (perGram) => perGram * CONSTANTS.TOLA_TO_GRAMS;

const clampNonNegative = (n) => (n < 0 ? 0 : n);

// ---------- Component ----------
const ZakatCalculator = () => {
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Live spot rates (PKR per gram)
  const [goldRate24KPerGramLive, setGoldRate24KPerGramLive] = useState(null);
  const [silverRatePerGramLive, setSilverRatePerGramLive] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [ratesError, setRatesError] = useState(false);
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState(null);

  // Gold karat selection
  const [goldKarat, setGoldKarat] = useState(22); // default 22K for Pakistan UX

  // Manual market rates (PKR per tola)
  const [useManualRates, setUseManualRates] = useState(true);
  const [manualGoldPerTola, setManualGoldPerTola] = useState(""); // this is selected karat per tola
  const [manualSilverPerTola, setManualSilverPerTola] = useState("");

  // Using refs for uncontrolled inputs
  const cashInHandRef = useRef(null);
  const bankBalanceRef = useRef(null);
  const goldAmountRef = useRef(null);
  const goldUnitRef = useRef(null);
  const silverAmountRef = useRef(null);
  const silverUnitRef = useRef(null);
  const businessStockRef = useRef(null);
  const receivablesRef = useRef(null);
  const diamondRef = useRef(null);
  const liabilitiesRef = useRef(null);

  const TROY_OUNCE_GRAMS = 31.1034768;

  const fallbackGold24KPerGram =
    CONSTANTS.FALLBACK_GOLD_RATE_24K_PER_TOLA / CONSTANTS.TOLA_TO_GRAMS || 0;
  const fallbackSilverPerGram =
    CONSTANTS.FALLBACK_SILVER_RATE_PER_TOLA / CONSTANTS.TOLA_TO_GRAMS || 0;

  const fetchRates = async () => {
    try {
      setRatesLoading(true);
      setRatesError(false);

      // IMPORTANT: For production, keep this token on backend, not client.
      const headers = { "x-access-token": "goldapi-jm2qrsmjp7dz1i-io" };

      const [goldRes, silverRes] = await Promise.all([
        fetch("https://www.goldapi.io/api/XAU/PKR", { headers }),
        fetch("https://www.goldapi.io/api/XAG/PKR", { headers }),
      ]);

      if (!goldRes.ok || !silverRes.ok) throw new Error("GoldAPI failed");

      const goldData = await goldRes.json();
      const silverData = await silverRes.json();

      const gold24KPerGram = goldData.price / TROY_OUNCE_GRAMS;
      const silverPerGram = silverData.price / TROY_OUNCE_GRAMS;

      setGoldRate24KPerGramLive(gold24KPerGram);
      setSilverRatePerGramLive(silverPerGram);
      setRatesUpdatedAt(new Date());
      setRatesError(false);
    } catch (e) {
      console.log("Rates fetch failed, will use fallback unless manual ON:", e);
      setRatesError(true);
    } finally {
      setRatesLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 3600000); // hourly refresh
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Rate resolvers (the key logic) ----------
  const resolveGoldRateAppliedPerGram = () => {
    // Goal: return PKR per gram for SELECTED KARAT (20/22/24)
    // Priority: Manual Market Rate (selected karat per tola) -> Live spot (24K per gram) -> Fallback (24K per gram)

    const manualGoldTola = parseFloat(manualGoldPerTola);
    if (
      useManualRates &&
      isFiniteNumber(manualGoldTola) &&
      manualGoldTola > 0
    ) {
      // Manual is already "selected karat per tola", so directly convert to per gram
      return manualGoldTola / CONSTANTS.TOLA_TO_GRAMS;
    }

    const base24K =
      goldRate24KPerGramLive ||
      (ratesError ? fallbackGold24KPerGram : fallbackGold24KPerGram);

    // Apply karat factor to 24K base
    return base24K * (goldKarat / 24);
  };

  const resolveSilverRatePerGram = () => {
    // Priority: Manual per tola -> Live per gram -> fallback per gram
    const manualSilverTola = parseFloat(manualSilverPerTola);
    if (
      useManualRates &&
      isFiniteNumber(manualSilverTola) &&
      manualSilverTola > 0
    ) {
      return manualSilverTola / CONSTANTS.TOLA_TO_GRAMS;
    }
    return silverRatePerGramLive || fallbackSilverPerGram;
  };

  const currentGoldAppliedPerGram = resolveGoldRateAppliedPerGram();
  const currentSilverPerGram = resolveSilverRatePerGram();

  const calculateZakat = () => {
    // Get values from refs
    const cash = clampNonNegative(
      parseFloat(cashInHandRef.current?.value) || 0,
    );
    const bank = clampNonNegative(
      parseFloat(bankBalanceRef.current?.value) || 0,
    );

    // GOLD: convert to grams if in tola
    const goldQty = clampNonNegative(
      parseFloat(goldAmountRef.current?.value) || 0,
    );
    const goldInGrams =
      goldUnitRef.current?.value === "tola"
        ? goldQty * CONSTANTS.TOLA_TO_GRAMS
        : goldQty;
    const goldValue = goldInGrams * currentGoldAppliedPerGram;

    // SILVER: convert to grams if in tola
    const silverQty = clampNonNegative(
      parseFloat(silverAmountRef.current?.value) || 0,
    );
    const silverInGrams =
      silverUnitRef.current?.value === "tola"
        ? silverQty * CONSTANTS.TOLA_TO_GRAMS
        : silverQty;
    const silverValue = silverInGrams * currentSilverPerGram;

    const stock = clampNonNegative(
      parseFloat(businessStockRef.current?.value) || 0,
    );
    const receivables = clampNonNegative(
      parseFloat(receivablesRef.current?.value) || 0,
    );
    const liabilities = clampNonNegative(
      parseFloat(liabilitiesRef.current?.value) || 0,
    );

    const diamondValue = clampNonNegative(
      parseFloat(diamondRef.current?.value) || 0,
    );

    const totalAssets =
      cash +
      bank +
      goldValue +
      silverValue +
      stock +
      receivables +
      diamondValue;
    const netZakatable = totalAssets - liabilities;

    const nisabValue = CONSTANTS.SILVER_NISAB_GRAMS * currentSilverPerGram;

    const zakatPayable =
      netZakatable >= nisabValue
        ? (netZakatable * CONSTANTS.ZAKAT_PERCENTAGE) / 100
        : 0;

    const ratesSource = useManualRates
      ? "Market (Manual)"
      : ratesError
        ? "Fallback"
        : "Live (Spot)";

    setResult({
      totalAssets,
      liabilities,
      netZakatable,
      nisabValue,
      nisabReached: netZakatable >= nisabValue,
      zakatPayable,

      goldKarat,
      goldRateAppliedPerGram: currentGoldAppliedPerGram,
      goldRateAppliedPerTola: toTola(currentGoldAppliedPerGram),

      silverRatePerGram: currentSilverPerGram,
      silverRatePerTola: toTola(currentSilverPerGram),

      ratesSource,
    });

    setShowResult(true);
  };

  const resetCalculator = () => {
    if (cashInHandRef.current) cashInHandRef.current.value = "";
    if (bankBalanceRef.current) bankBalanceRef.current.value = "";
    if (goldAmountRef.current) goldAmountRef.current.value = "";
    if (goldUnitRef.current) goldUnitRef.current.value = "tola";
    if (silverAmountRef.current) silverAmountRef.current.value = "";
    if (silverUnitRef.current) silverUnitRef.current.value = "tola";
    if (businessStockRef.current) businessStockRef.current.value = "";
    if (receivablesRef.current) receivablesRef.current.value = "";
    if (diamondRef.current) diamondRef.current.value = "";
    if (liabilitiesRef.current) liabilitiesRef.current.value = "";

    setShowResult(false);
    setResult(null);
  };

  // ---------- UI components ----------
  const InputField = ({
    icon: Icon,
    label,
    inputRef,
    placeholder,
    unit,
    unitRef,
    rightSlot,
    defaultUnit = "tola",
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <label className="flex items-center justify-between gap-2 text-sm font-medium text-gray-700">
        <span className="flex items-center gap-2">
          <Icon size={16} className="text-primary" />
          {label}
        </span>
        {rightSlot ? <span>{rightSlot}</span> : null}
      </label>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="number"
          placeholder={placeholder}
          min="0"
          step="any"
          defaultValue=""
          className="flex-1 px-4 py-3 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-primary transition-all"
        />
        {unit && (
          <select
            ref={unitRef}
            defaultValue={defaultUnit}
            className="px-4 py-3 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-primary transition-all"
          >
            <option value="tola">Tola</option>
            <option value="grams">Grams</option>
          </select>
        )}
      </div>
    </motion.div>
  );

  const RatesBox = () => {
    const badge = useManualRates
      ? "Market"
      : ratesLoading
        ? "Loading…"
        : ratesError
          ? "Fallback"
          : "Live";

    const badgeClass = useManualRates
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : ratesError
        ? "bg-orange-50 text-orange-700 border-orange-200"
        : "bg-green-50 text-green-700 border-green-200";

    return (
      <div className="space-y-4">
        {/* Instructions at the top as requested */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-amber-800 bg-amber-50 p-4 rounded-2xl border border-amber-200 leading-relaxed shadow-sm flex gap-3"
        >
          <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Instruction:</strong> Please check manually current local
            market rates of Gold/Silver/Diamond and enter below.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <SlidersHorizontal size={18} className="text-primary" />
              Market Rates Override
            </div>

            <div className="flex items-center gap-2">
              <select
                value={goldKarat}
                onChange={(e) => setGoldKarat(parseInt(e.target.value, 10))}
                className="text-xs font-semibold px-3 py-1.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-primary text-gray-700 cursor-pointer hover:bg-gray-50 transition-all"
                title="Select Gold Karat"
              >
                <option value={24}>24K</option>
                <option value={22}>22K</option>
                <option value={21}>21K</option>
                <option value={20}>20K</option>
                <option value={18}>18K</option>
              </select>

              <button
                type="button"
                onClick={() => setUseManualRates((v) => !v)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  useManualRates
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                }`}
              >
                {useManualRates ? "ENABLED" : "DISABLED"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 ml-1">
                Gold ({goldKarat}K) — PKR per tola
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={manualGoldPerTola}
                onChange={(e) => setManualGoldPerTola(e.target.value)}
                placeholder="e.g. 295000"
                disabled={!useManualRates}
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                  useManualRates
                    ? "bg-white border-gray-100 focus:border-primary"
                    : "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 ml-1">
                Silver — PKR per tola
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={manualSilverPerTola}
                onChange={(e) => setManualSilverPerTola(e.target.value)}
                placeholder="e.g. 3500"
                disabled={!useManualRates}
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                  useManualRates
                    ? "bg-white border-gray-100 focus:border-primary"
                    : "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles size={16} />
            Shariah-Compliant Calculator
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Zakat Calculator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Calculate your Zakat obligation based on Hanafi fiqh principles.
            Enter your assets and liabilities to determine your Zakat amount.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rates Box */}
            <RatesBox />

            {/* Liquid Assets */}
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <Wallet size={18} />
                </div>
                Liquid Assets
              </h3>
              <div className="space-y-4">
                <InputField
                  icon={Wallet}
                  label="Cash in Hand"
                  inputRef={cashInHandRef}
                  placeholder="0"
                />
                <InputField
                  icon={Building2}
                  label="Bank Balance"
                  inputRef={bankBalanceRef}
                  placeholder="0"
                />
              </div>
            </motion.div>

            {/* Precious Metals */}
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                  <Coins size={18} />
                </div>
                Precious Metals
              </h3>

              <div className="space-y-4">
                <InputField
                  icon={Coins}
                  label="Gold"
                  inputRef={goldAmountRef}
                  placeholder="0"
                  unit={true}
                  unitRef={goldUnitRef}
                  defaultUnit="tola"
                />

                <InputField
                  icon={Coins}
                  label="Silver"
                  inputRef={silverAmountRef}
                  placeholder="0"
                  unit={true}
                  unitRef={silverUnitRef}
                  defaultUnit="tola"
                />
              </div>
            </motion.div>

            {/* Business & Receivables */}
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.16 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <TrendingUp size={18} />
                </div>
                Business & Receivables
              </h3>
              <div className="space-y-4">
                <InputField
                  icon={Building2}
                  label="Total Value : (Business Stock / Plots / Properties / Vehicles / Other Assets)"
                  inputRef={businessStockRef}
                  placeholder="0"
                />
                <InputField
                  icon={FileText}
                  label="Money Expected to be Received (Total Value)"
                  inputRef={receivablesRef}
                  placeholder="0"
                />
                <InputField
                  icon={Gem}
                  label="Diamond (Include amount in PKR)"
                  inputRef={diamondRef}
                  placeholder="0"
                />
              </div>
            </motion.div>

            {/* Liabilities */}
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.24 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <CreditCard size={18} />
                </div>
                Liabilities (Deductions)
              </h3>
              <div className="space-y-4">
                <InputField
                  icon={CreditCard}
                  label="Short-term Debts & Bills (Total Value)"
                  inputRef={liabilitiesRef}
                  placeholder="0"
                />
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className="flex gap-4"
            >
              <button
                onClick={calculateZakat}
                className="flex-1 bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
              >
                <Calculator size={20} />
                Calculate Zakat
              </button>
              <button
                onClick={resetCalculator}
                className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
              >
                Reset
              </button>
            </motion.div>
          </div>

          {/* Result */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              {!showResult ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-3xl border-2 border-primary/20 text-center"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator size={40} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Ready to Calculate
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Fill in your assets and liabilities, then click "Calculate
                    Zakat" to see your obligation.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  {/* Nisab Status */}
                  <div
                    className={`p-6 rounded-3xl border-2 ${
                      result.nisabReached
                        ? "bg-green-50 border-green-200"
                        : "bg-orange-50 border-orange-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {result.nisabReached ? (
                        <CheckCircle size={24} className="text-green-600" />
                      ) : (
                        <AlertCircle size={24} className="text-orange-600" />
                      )}
                      <h4 className="font-bold text-lg">
                        {result.nisabReached ? "Nisab Reached" : "Below Nisab"}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {result.nisabReached
                        ? "Your wealth has reached the Nisab threshold. Zakat is obligatory."
                        : "Your wealth is below the Nisab threshold. Zakat is not obligatory at this time."}
                    </p>

                    <div className="mt-4 text-xs text-gray-600 flex items-center justify-between">
                      <span className="font-semibold">
                        Rates Source: {result.ratesSource}
                      </span>
                      <span>Gold: {result.goldKarat}K</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
                    <h4 className="font-bold text-lg mb-4">
                      Calculation Summary
                    </h4>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Assets</span>
                        <span className="font-semibold">
                          {formatPKR(result.totalAssets)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Liabilities</span>
                        <span className="font-semibold text-red-600">
                          - {formatPKR(result.liabilities)}
                        </span>
                      </div>

                      <div className="h-px bg-gray-200" />

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Net Zakatable</span>
                        <span className="font-bold">
                          {formatPKR(result.netZakatable)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Nisab Threshold</span>
                        <span className="font-semibold text-primary">
                          {formatPKR(result.nisabValue)}
                        </span>
                      </div>

                      <div className="h-px bg-gray-100" />

                      {/* Rates used */}
                      <div className="text-xs text-gray-600 space-y-2">
                        <div className="flex justify-between">
                          <span>Gold rate used ({result.goldKarat}K)</span>
                          <span className="font-semibold">
                            {formatPKR2(result.goldRateAppliedPerGram)} / gram
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gold rate used ({result.goldKarat}K)</span>
                          <span className="font-semibold">
                            {formatPKR2(result.goldRateAppliedPerTola)} / tola
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span>Silver rate used</span>
                          <span className="font-semibold">
                            {formatPKR2(result.silverRatePerGram)} / gram
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Silver rate used</span>
                          <span className="font-semibold">
                            {formatPKR2(result.silverRatePerTola)} / tola
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Zakat Amount */}
                  <div className="bg-gradient-to-br from-primary to-primary-dark p-8 rounded-3xl shadow-xl text-white text-center">
                    <p className="text-sm opacity-90 mb-2">Your Zakat Amount</p>
                    <h2 className="text-4xl font-bold mb-4">
                      {formatPKR(result.zakatPayable)}
                    </h2>
                    {result.zakatPayable > 0 && (
                      <button className="w-full bg-white text-primary py-3 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                        Pay Zakat Now
                        <ArrowRight size={18} />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl"
              >
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> This calculation is based on Hanafi
                  fiqh. For complex cases or specific questions, please consult
                  a qualified Mufti.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZakatCalculator;
