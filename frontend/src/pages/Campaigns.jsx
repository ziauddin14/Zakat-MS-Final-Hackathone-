import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, Clock, Users, ArrowRight, Heart } from "lucide-react";

const CampaignCard = ({ campaign, index }) => {
  const percent = Math.min((campaign.raised / campaign.goal) * 100, 100);
  const navigate = useNavigate();

  const handleDonateClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(`/donate?campaign=${campaign.id}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-primary uppercase tracking-wider">
            {campaign.category}
          </span>
        </div>
        <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-colors">
          <Heart size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {campaign.title}
        </h3>
        <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-grow">
          {campaign.description}
        </p>

        {/* Progress Stats */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-primary">
              ${campaign.raised.toLocaleString()}
            </span>
            <span className="text-gray-400">
              of ${campaign.goal.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${percent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-primary h-full rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Users size={12} /> {campaign.donors} Donors
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} /> {campaign.daysLeft} days left
            </div>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={handleDonateClick}
          className="w-full py-3 bg-gray-50 hover:bg-primary hover:text-white text-gray-900 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover/btn relative overflow-hidden"
        >
          Donate Now <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
};

const Campaigns = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Zakat",
    "Emergency",
    "Education",
    "Water",
    "Orphans",
  ];

  const campaigns = [
    {
      id: 1,
      title: "Emergency Food for Gaza",
      description:
        "Provide urgent food parcels and clean water to families displaced by conflict. Your donation saves lives.",
      image:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Emergency",
      raised: 25000,
      goal: 50000,
      donors: 1420,
      daysLeft: 12,
    },
    {
      id: 2,
      title: "Build a Water Well in Mali",
      description:
        "Give the gift of life. A shortage of clean water causes disease and poverty. Help us build a deep well.",
      image:
        "https://images.unsplash.com/photo-1579706497230-044033284701?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Water",
      raised: 3200,
      goal: 4500,
      donors: 85,
      daysLeft: 45,
    },
    {
      id: 3,
      title: "Sponsor an Orphan's Education",
      description:
        "Empower a child with education. Cover school fees, books, and uniforms for one academic year.",
      image:
        "https://images.unsplash.com/photo-1490126786801-7fa0939d73d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Education",
      raised: 8500,
      goal: 12000,
      donors: 310,
      daysLeft: 20,
    },
    {
      id: 4,
      title: "Winter Blankets for Refugees",
      description:
        "Winter is coming. Thousands of refugees are living in tents without hearing. Provide warm blankets.",
      image:
        "https://images.unsplash.com/photo-1542888258-292c30f40d6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Emergency",
      raised: 15400,
      goal: 20000,
      donors: 890,
      daysLeft: 5,
    },
    {
      id: 5,
      title: "Zakat for Local Families",
      description:
        "Support struggling families in your local community with Zakat Al-Mal distribution.",
      image:
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Zakat",
      raised: 45000,
      goal: 100000,
      donors: 2100,
      daysLeft: 60,
    },
    {
      id: 6,
      title: "Medical Aid for Syria",
      description:
        "Providing critical medical supplies and trauma care to war-torn regions.",
      image:
        "https://images.unsplash.com/photo-1584515933487-9dca74251094?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Emergency",
      raised: 12000,
      goal: 60000,
      donors: 450,
      daysLeft: 18,
    },
  ];

  const filteredCampaigns =
    selectedCategory === "All"
      ? campaigns
      : campaigns.filter((c) => c.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-primary font-semibold tracking-wider text-sm uppercase"
          >
            Make an Impact
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6"
          >
            Active Campaigns
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg"
          >
            Choose a cause close to your heart. 100% of your Zakat donation goes
            directly to the beneficiaries.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search campaigns..."
              className="w-full bg-white border-0 rounded-xl py-2.5 pl-10 pr-4 shadow-sm text-sm focus:ring-2 focus:ring-primary/20 transition-shadow"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCampaigns.map((campaign, idx) => (
            <CampaignCard key={campaign.id} campaign={campaign} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
