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
} from "lucide-react";

// Configurable constants (based on Hanafi fiqh)
const CONSTANTS = {
  SILVER_NISAB_GRAMS: 612.36, // Hanafi nisab (fixed)
  ZAKAT_PERCENTAGE: 2.5, // 2.5% (fixed)
  TOLA_TO_GRAMS: 11.664, // 1 Tola = 11.664 grams (fixed)
  // Fallback rates (used if API fails)
  FALLBACK_GOLD_RATE: 40500, // PKR per tola
  FALLBACK_SILVER_RATE: 718, // PKR per tola
};

const ZakatCalculator = () => {
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [goldRate, setGoldRate] = useState(null);
  const [silverRate, setSilverRate] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [ratesError, setRatesError] = useState(false);

  // Using refs for uncontrolled inputs
  const cashInHandRef = useRef(null);
  const bankBalanceRef = useRef(null);
  const goldGramsRef = useRef(null);
  const goldUnitRef = useRef(null);
  const silverGramsRef = useRef(null);
  const silverUnitRef = useRef(null);
  const businessStockRef = useRef(null);
  const receivablesRef = useRef(null);
  const liabilitiesRef = useRef(null);

  // Fetch live gold and silver rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        setRatesLoading(true);
        
        // NOTE: International API rates don't match Pakistan local market
        // Using Pakistan local market rates (Sarafa) as default
        // TODO: Integrate Pakistan-specific API (forex.com.pk, goldpricepakistan.com)
        
        // International API (Currently disabled)
        const response = await fetch("https://www.goldapi.io/api/XAU/PKR", {
          headers: {
            "x-access-token": "goldapi-jm2qrsmjp7dz1i-io",
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const goldPerGram = data.price / 31.1035;
          setGoldRate(goldPerGram);
          const silverPerGram = goldPerGram / 70;
          setSilverRate(silverPerGram);
          setRatesError(false);
        } else {
          throw new Error('API failed');
        }
        
        
        // Using Pakistan local market rates (Sarafa)
        // Update these rates daily from: forex.com.pk or local sarafa market
        setGoldRate(CONSTANTS.FALLBACK_GOLD_RATE / CONSTANTS.TOLA_TO_GRAMS);
        setSilverRate(CONSTANTS.FALLBACK_SILVER_RATE / CONSTANTS.TOLA_TO_GRAMS);
        setRatesError(false);
        
      } catch (error) {
        console.log('Using Pakistan local market rates:', error);
        setGoldRate(CONSTANTS.FALLBACK_GOLD_RATE / CONSTANTS.TOLA_TO_GRAMS);
        setSilverRate(CONSTANTS.FALLBACK_SILVER_RATE / CONSTANTS.TOLA_TO_GRAMS);
        setRatesError(false);
      } finally {
        setRatesLoading(false);
      }
    };

    fetchRates();
    // Refresh rates every hour (in case we add live API later)
    const interval = setInterval(fetchRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  const calculateZakat = () => {
    // Use dynamic rates or fallback
    const currentGoldRate =
      goldRate || CONSTANTS.FALLBACK_GOLD_RATE / CONSTANTS.TOLA_TO_GRAMS;
    const currentSilverRate =
      silverRate || CONSTANTS.FALLBACK_SILVER_RATE / CONSTANTS.TOLA_TO_GRAMS;

    // Get values from refs
    const cash = parseFloat(cashInHandRef.current?.value) || 0;
    const bank = parseFloat(bankBalanceRef.current?.value) || 0;

    // Convert gold to grams if in tola
    const goldInGrams =
      goldUnitRef.current?.value === "tola"
        ? (parseFloat(goldGramsRef.current?.value) || 0) *
          CONSTANTS.TOLA_TO_GRAMS
        : parseFloat(goldGramsRef.current?.value) || 0;
    const goldValue = goldInGrams * currentGoldRate;

    // Convert silver to grams if in tola
    const silverInGrams =
      silverUnitRef.current?.value === "tola"
        ? (parseFloat(silverGramsRef.current?.value) || 0) *
          CONSTANTS.TOLA_TO_GRAMS
        : parseFloat(silverGramsRef.current?.value) || 0;
    const silverValue = silverInGrams * currentSilverRate;

    const stock = parseFloat(businessStockRef.current?.value) || 0;
    const receivables = parseFloat(receivablesRef.current?.value) || 0;
    const liabilities = parseFloat(liabilitiesRef.current?.value) || 0;

    // Calculate total assets
    const totalAssets =
      cash + bank + goldValue + silverValue + stock + receivables;

    // Calculate net zakatable wealth
    const netZakatable = totalAssets - liabilities;

    // Calculate nisab threshold using current silver rate
    const nisabValue = CONSTANTS.SILVER_NISAB_GRAMS * currentSilverRate;

    // Calculate zakat
    const zakatPayable =
      netZakatable >= nisabValue
        ? (netZakatable * CONSTANTS.ZAKAT_PERCENTAGE) / 100
        : 0;

    setResult({
      totalAssets,
      liabilities,
      netZakatable,
      nisabValue,
      nisabReached: netZakatable >= nisabValue,
      zakatPayable,
      goldRate: currentGoldRate,
      silverRate: currentSilverRate,
    });

    setShowResult(true);
  };

  const resetCalculator = () => {
    // Reset all input fields
    if (cashInHandRef.current) cashInHandRef.current.value = "";
    if (bankBalanceRef.current) bankBalanceRef.current.value = "";
    if (goldGramsRef.current) goldGramsRef.current.value = "";
    if (goldUnitRef.current) goldUnitRef.current.value = "grams";
    if (silverGramsRef.current) silverGramsRef.current.value = "";
    if (silverUnitRef.current) silverUnitRef.current.value = "grams";
    if (businessStockRef.current) businessStockRef.current.value = "";
    if (receivablesRef.current) receivablesRef.current.value = "";
    if (liabilitiesRef.current) liabilitiesRef.current.value = "";

    setShowResult(false);
    setResult(null);
  };

  const InputField = ({
    icon: Icon,
    label,
    inputRef,
    placeholder,
    unit,
    unitRef,
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Icon size={16} className="text-primary" />
        {label}
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
            defaultValue="grams"
            className="px-4 py-3 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-primary transition-all"
          >
            <option value="grams">Grams</option>
            <option value="tola">Tola</option>
          </select>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
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
          {/* Calculator Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Liquid Assets */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
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
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
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
                  inputRef={goldGramsRef}
                  placeholder="0"
                  unit={true}
                  unitRef={goldUnitRef}
                />
                <InputField
                  icon={Coins}
                  label="Silver"
                  inputRef={silverGramsRef}
                  placeholder="0"
                  unit={true}
                  unitRef={silverUnitRef}
                />
              </div>
            </motion.div>

            {/* Business & Receivables */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
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
              </div>
            </motion.div>

            {/* Liabilities */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
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

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
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

          {/* Result Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              {!showResult ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
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
                  initial={{ opacity: 0, scale: 0.9 }}
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
                  </div>

                  {/* Calculation Summary */}
                  <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
                    <h4 className="font-bold text-lg mb-4">
                      Calculation Summary
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Assets</span>
                        <span className="font-semibold">
                          Rs. {result.totalAssets.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Liabilities</span>
                        <span className="font-semibold text-red-600">
                          - Rs. {result.liabilities.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-px bg-gray-200"></div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Net Zakatable</span>
                        <span className="font-bold">
                          Rs. {result.netZakatable.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Nisab Threshold</span>
                        <span className="font-semibold text-primary">
                          Rs. {result.nisabValue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Zakat Amount */}
                  <div className="bg-gradient-to-br from-primary to-primary-dark p-8 rounded-3xl shadow-xl text-white text-center">
                    <p className="text-sm opacity-90 mb-2">Your Zakat Amount</p>
                    <h2 className="text-4xl font-bold mb-4">
                      Rs. {result.zakatPayable.toLocaleString()}
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
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl"
              >
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> This calculation is based on Hanafi
                  fiqh (Barelvi). For complex cases or specific questions,
                  please consult a qualified Mufti.
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
