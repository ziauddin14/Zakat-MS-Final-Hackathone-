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
  PawPrint,
} from "lucide-react";

// Configurable constants (based on Hanafi fiqh)
const CONSTANTS = {
  SILVER_NISAB_GRAMS: 612.36, // Hanafi nisab (fixed)
  ZAKAT_PERCENTAGE: 2.5, // 2.5% (fixed)
  TOLA_TO_GRAMS: 11.664, // 1 Tola = 11.664 grams (fixed)

  // ✅ Hanafi Nisab Thresholds in Tola
  GOLD_NISAB_TOLA: 7.5,
  SILVER_NISAB_TOLA: 52.5,

  // ✅ New: Masha support
  MASHA_PER_TOLA: 12, // 1 Tola = 12 Masha

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

const mashaToGrams = (masha) =>
  (masha * CONSTANTS.TOLA_TO_GRAMS) / CONSTANTS.MASHA_PER_TOLA;

const clampNonNegative = (n) => (n < 0 ? 0 : n);

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

  // ✅ New optional masha
  showMasha = false,
  mashaRef,
  mashaPlaceholder = "0",
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

      {showMasha && (
        <div className="w-28">
          <input
            ref={mashaRef}
            type="number"
            placeholder={mashaPlaceholder}
            min="0"
            step="any"
            defaultValue=""
            className="w-full px-3 py-3 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-primary transition-all"
            title="Masha"
          />
          <div className="text-[10px] text-gray-500 mt-1 text-center">
            Masha
          </div>
        </div>
      )}

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

const RatesBox = ({
  useManualRates,
  ratesLoading,
  ratesError,
  goldKarat,
  setGoldKarat,
  manualGoldPerTola,
  setManualGoldPerTola,
  manualSilverPerTola,
  setManualSilverPerTola,
}) => {
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
        <div className="space-y-2">
          <strong className="block mb-1 text-amber-900">Instructions:</strong>
          <div className="space-y-1.5">
            <p className="flex gap-2">
              <span className="font-bold text-amber-700 shrink-0">(a).</span>
              <span>
                Firstly, check manually current local market rates of Gold /
                Silver / Diamond through Google.
              </span>
            </p>
            <p className="flex gap-2">
              <span className="font-bold text-amber-700 shrink-0">(b).</span>
              <span>Enter amount below (if any).</span>
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between gap-3 mb-6">
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

  // ✅ New: masha refs
  const goldMashaRef = useRef(null);
  const silverMashaRef = useRef(null);

  // ✅ New: Business extra fields
  const animalsForSaleRef = useRef(null);
  const rawMaterialsRef = useRef(null);
  const providentFundRef = useRef(null);

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

    // GOLD: qty + masha -> grams
    const goldQty = clampNonNegative(
      parseFloat(goldAmountRef.current?.value) || 0,
    );
    const goldMasha = clampNonNegative(
      parseFloat(goldMashaRef.current?.value) || 0,
    );

    const goldBaseGrams =
      goldUnitRef.current?.value === "tola"
        ? goldQty * CONSTANTS.TOLA_TO_GRAMS
        : goldQty;

    const goldInGrams = goldBaseGrams + mashaToGrams(goldMasha);
    const goldValue = goldInGrams * currentGoldAppliedPerGram;

    // SILVER: qty + masha -> grams
    const silverQty = clampNonNegative(
      parseFloat(silverAmountRef.current?.value) || 0,
    );
    const silverMasha = clampNonNegative(
      parseFloat(silverMashaRef.current?.value) || 0,
    );

    const silverBaseGrams =
      silverUnitRef.current?.value === "tola"
        ? silverQty * CONSTANTS.TOLA_TO_GRAMS
        : silverQty;

    const silverInGrams = silverBaseGrams + mashaToGrams(silverMasha);
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

    const animalsForSale = clampNonNegative(
      parseFloat(animalsForSaleRef.current?.value) || 0,
    );
    const rawMaterials = clampNonNegative(
      parseFloat(rawMaterialsRef.current?.value) || 0,
    );
    const providentFund = clampNonNegative(
      parseFloat(providentFundRef.current?.value) || 0,
    );

    const totalAssets =
      cash +
      bank +
      goldValue +
      silverValue +
      stock +
      receivables +
      diamondValue +
      animalsForSale +
      rawMaterials +
      providentFund;
    const netZakatable = totalAssets - liabilities;

    const goldRatePerTola = currentGoldAppliedPerGram * CONSTANTS.TOLA_TO_GRAMS;
    const silverRatePerTola = currentSilverPerGram * CONSTANTS.TOLA_TO_GRAMS;

    const goldNisabValue = CONSTANTS.GOLD_NISAB_TOLA * goldRatePerTola;
    const silverNisabValue = CONSTANTS.SILVER_NISAB_TOLA * silverRatePerTola;

    // Rule: MIN(Gold Nisab, Silver Nisab) for mixed wealth
    const applicableNisabValue = Math.min(goldNisabValue, silverNisabValue);

    // --- Hanafi Refined Logic ---
    // 1. Check if wealth is "Pure" (only gold or only silver, no other assets)
    const hasOtherAssets =
      cash +
        bank +
        stock +
        receivables +
        diamondValue +
        animalsForSale +
        rawMaterials +
        providentFund >
      0;
    const hasGold = goldInGrams > 0;
    const hasSilver = silverInGrams > 0;

    let nisabReached = false;

    if (!hasOtherAssets && hasGold && !hasSilver) {
      // ONLY Gold Case
      const goldTolaWeight = goldInGrams / CONSTANTS.TOLA_TO_GRAMS;
      // ✅ NEW: either gold weight reaches gold nisab OR gold value reaches silver nisab value
      nisabReached =
        goldTolaWeight >= CONSTANTS.GOLD_NISAB_TOLA ||
        goldValue >= silverNisabValue;
    } else if (!hasOtherAssets && !hasGold && hasSilver) {
      // ONLY Silver Case
      const silverTolaWeight = silverInGrams / CONSTANTS.TOLA_TO_GRAMS;
      // ✅ NEW: either silver weight reaches silver nisab OR silver value reaches gold nisab value
      nisabReached =
        silverTolaWeight >= CONSTANTS.SILVER_NISAB_TOLA ||
        silverValue >= silverNisabValue;
    } else {
      // Mixed Wealth or Combined Metals
      const silverNisabOnly = silverNisabValue;

      const anySingleAssetReached =
        cash - liabilities >= silverNisabOnly ||
        bank - liabilities >= silverNisabOnly ||
        goldValue - liabilities >= silverNisabOnly ||
        silverValue - liabilities >= silverNisabOnly ||
        stock - liabilities >= silverNisabOnly ||
        receivables - liabilities >= silverNisabOnly ||
        diamondValue - liabilities >= silverNisabOnly ||
        animalsForSale - liabilities >= silverNisabOnly ||
        rawMaterials - liabilities >= silverNisabOnly ||
        providentFund - liabilities >= silverNisabOnly;

      // Final Nisab Rule:
      nisabReached =
        anySingleAssetReached || netZakatable >= applicableNisabValue;
    }

    const zakatPayable = nisabReached
      ? (netZakatable * CONSTANTS.ZAKAT_PERCENTAGE) / 100
      : 0;

    const ratesSource = useManualRates
      ? "User Entered"
      : ratesError
        ? "Fallback"
        : "Live (Spot)";

    setResult({
      totalAssets,
      liabilities,
      netZakatable,
      goldNisabValue,
      silverNisabValue,
      nisabReached,
      applicableNisabValue,
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
    if (goldMashaRef.current) goldMashaRef.current.value = "";
    if (silverMashaRef.current) silverMashaRef.current.value = "";

    if (animalsForSaleRef.current) animalsForSaleRef.current.value = "";
    if (rawMaterialsRef.current) rawMaterialsRef.current.value = "";
    if (providentFundRef.current) providentFundRef.current.value = "";

    if (liabilitiesRef.current) liabilitiesRef.current.value = "";

    setShowResult(false);
    setResult(null);
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
            <RatesBox
              useManualRates={useManualRates}
              ratesLoading={ratesLoading}
              ratesError={ratesError}
              goldKarat={goldKarat}
              setGoldKarat={setGoldKarat}
              manualGoldPerTola={manualGoldPerTola}
              setManualGoldPerTola={setManualGoldPerTola}
              manualSilverPerTola={manualSilverPerTola}
              setManualSilverPerTola={setManualSilverPerTola}
            />

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
                  showMasha={true}
                  mashaRef={goldMashaRef}
                />

                <InputField
                  icon={Coins}
                  label="Silver"
                  inputRef={silverAmountRef}
                  placeholder="0"
                  unit={true}
                  unitRef={silverUnitRef}
                  defaultUnit="tola"
                  showMasha={true}
                  mashaRef={silverMashaRef}
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
                  label="Total Value : (Business Stock / Plots / Properties / Commercial Vehicles / Other Assets)"
                  inputRef={businessStockRef}
                  placeholder="0"
                />
                <InputField
                  icon={FileText}
                  label="Money Expected to be Received (Total Amount)"
                  inputRef={receivablesRef}
                  placeholder="0"
                />
                <InputField
                  icon={Gem}
                  label="Diamond (Amount in PKR)"
                  inputRef={diamondRef}
                  placeholder="0"
                />

                <InputField
                  icon={PawPrint}
                  label="Animals for Commercial Sale (Market Value)"
                  inputRef={animalsForSaleRef}
                  placeholder="0"
                />

                <InputField
                  icon={FileText}
                  label="Raw Material (Total Market Value after counting items)"
                  inputRef={rawMaterialsRef}
                  placeholder="0"
                />

                <InputField
                  icon={Wallet}
                  label="Provident Fund / GP Fund (Total Amount)"
                  inputRef={providentFundRef}
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
                  label="Debts & all types of bills (Total Value)"
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
                        {result.nisabReached ? "Limit Reached" : "Below Limit"}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {result.nisabReached
                        ? "Your total wealth has reached the minimum limit. Zakat is obligatory."
                        : "Your total wealth is below the minimum limit required for Zakat. Zakat is not obligatory at this time."}
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
                        <span className="text-gray-600">
                          Net Zakatable balance
                        </span>
                        <span className="font-bold">
                          {formatPKR(result.netZakatable)}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1 pt-1">
                        <div className="flex justify-between text-[11px] text-gray-500 italic">
                          <span>Gold Limit (7.5 Tola)</span>
                          <span>{formatPKR(result.goldNisabValue)}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-500 italic">
                          <span>Silver Limit (52.5 Tola)</span>
                          <span>{formatPKR(result.silverNisabValue)}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-900 font-medium">
                            Applied Minimum Limit <br />
                            <span className="text-[10px] text-gray-400 font-normal">
                              (Gold 7.5 Tola or Silver 52.5 Tola)
                            </span>
                          </span>
                          <span className="font-semibold text-primary">
                            {formatPKR(result.applicableNisabValue)}
                          </span>
                        </div>
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
