import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, Clock, Users, ArrowRight, Heart } from "lucide-react";
import { getCampaigns } from "../api/api";
import { useEffect } from "react";

const CampaignCard = ({ campaign, index }) => {
  const percent = Math.min(
    (campaign.raised / (campaign.goalAmount || campaign.goal || 1)) * 100,
    100
  );
  const navigate = useNavigate();

  const handleDonateClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(`/donate?campaign=${campaign._id || campaign.id}`);
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
              ${(campaign.raised || 0).toLocaleString()}
            </span>
            <span className="text-gray-400">
              of ${(campaign.goalAmount || campaign.goal || 0).toLocaleString()}
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
          disabled={
            campaign.status === "Completed" || campaign.raised >= campaign.goal
          }
          className={`w-full py-3 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden ${
            campaign.status === "Completed" || campaign.raised >= campaign.goal
              ? "bg-green-50 text-green-600 cursor-not-allowed"
              : "bg-gray-50 hover:bg-primary hover:text-white text-gray-900 group-hover/btn"
          }`}
        >
          {campaign.status === "Completed" ||
          campaign.raised >= campaign.goal ? (
            <>
              Goal Reached! <Heart size={18} fill="currentColor" />
            </>
          ) : (
            <>
              Donate Now <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

const Campaigns = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getCampaigns();
        setCampaigns(data);
      } catch (error) {
        console.error("Fetch Campaigns Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const categories = [
    "All",
    "Zakat",
    "Emergency",
    "Education",
    "Water",
    "Orphans",
  ];

  const filteredCampaigns = campaigns.filter((c) => {
    // Category filter
    const categoryMatch =
      selectedCategory === "All" ||
      c.category?.toLowerCase() === selectedCategory.toLowerCase();

    // Search filter
    const searchMatch =
      !searchTerm ||
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return categoryMatch && searchMatch;
  });

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-0 rounded-xl py-2.5 pl-10 pr-4 shadow-sm text-sm focus:ring-2 focus:ring-primary/20 transition-shadow"
            />
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((campaign, idx) => (
              <CampaignCard
                key={campaign._id || campaign.id}
                campaign={campaign}
                index={idx}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;
