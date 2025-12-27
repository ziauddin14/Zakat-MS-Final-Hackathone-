import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Megaphone,
  Settings,
  LogOut,
  Search,
  Plus,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  TrendingUp,
  DollarSign,
  Calendar,
  ArrowUpRight,
  Filter,
  Trash2,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Input from "../components/ui/Input";
import {
  getAdminStats,
  getAllDonations,
  getAllUsers,
  updateDonationStatus,
} from "../api/api";
import { useEffect } from "react";

// --- Sub-Components ---

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      <div
        className={`flex items-center gap-1 mt-2 text-xs font-medium ${
          change >= 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        <ArrowUpRight size={12} /> {Math.abs(change)}% from last month
      </div>
    </div>
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={24} />
    </div>
  </div>
);

const DonationsTable = ({ donations, onUpdateStatus }) => {
  const [localDonations, setLocalDonations] = useState(donations);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLocalDonations(donations);
  }, [donations]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDonationStatus(id, newStatus);
      setLocalDonations(
        localDonations.map((d) =>
          d._id === id ? { ...d, status: newStatus } : d
        )
      );
      toast.success(`Donation ${newStatus.toLowerCase()} successfully`);
      if (onUpdateStatus) onUpdateStatus();
    } catch (error) {
      console.error("Update Status Error:", error);
      toast.error("Failed to update status");
    }
  };

  const filtered = localDonations.filter(
    (d) =>
      d._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-lg">Recent Donations</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search ID or Donor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter size={18} className="text-gray-500" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 font-medium">
              <th className="p-4 pl-6">ID</th>
              <th className="p-4">Donor</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Type</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((d) => (
              <tr key={d._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 pl-6 font-medium text-gray-900">
                  #{d._id?.slice(-6)}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                      {d.user?.name?.charAt(0) || "U"}
                    </div>
                    {d.user?.name || "Anonymous"}
                  </div>
                </td>
                <td className="p-4 font-bold">${d.amount?.toLocaleString()}</td>
                <td className="p-4 text-gray-500">{d.type}</td>
                <td className="p-4 text-gray-500">
                  {new Date(d.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      d.status === "approved"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : d.status === "pending"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>
                <td className="p-4 pr-6 text-right">
                  <div className="flex justify-end gap-2">
                    {d.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(d._id, "approved")}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                          title="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(d._id, "rejected")}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    <button className="p-1.5 text-gray-400 hover:text-gray-600">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CampaignForm = ({ initialData, onSubmit, onCancel }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialData || {
      title: "",
      category: "Emergency",
      goal: "",
      endDate: "",
      description: "",
      status: "Active", // Default status
    },
  });

  // Effect to reset form if initialData changes (optional but good practice)
  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl">
          {initialData ? "Edit Campaign" : "Create New Campaign"}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <XCircle size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Campaign Title"
            {...register("title", { required: true })}
            placeholder="e.g. Winter Relief Fund"
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              {...register("category")}
              className="w-full bg-white border-2 border-gray-100 rounded-xl py-4 px-4 outline-none focus:border-primary"
            >
              <option value="Emergency">Emergency</option>
              <option value="Education">Education</option>
              <option value="Water">Water</option>
              <option value="Zakat">Zakat</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Goal Amount ($)"
            type="number"
            {...register("goal", { required: true })}
            placeholder="5000"
          />
          <Input label="End Date" type="date" {...register("endDate")} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              {...register("status")}
              className="w-full bg-white border-2 border-gray-100 rounded-xl py-4 px-4 outline-none focus:border-primary"
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full bg-white border-2 border-gray-100 rounded-xl py-3 px-4 outline-none focus:border-primary resize-none"
            placeholder="Describe the cause..."
          ></textarea>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 font-semibold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-colors"
          >
            {initialData ? "Update Campaign" : "Launch Campaign"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// --- Main Page ---

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Real Data State
  const [stats, setStats] = useState({
    totalRaised: 0,
    totalDonations: 0,
    activeCampaigns: 0,
    totalDonors: 0,
    raisedChange: 0,
    donationsChange: 0,
    donorsChange: 0,
  });
  const [allDonations, setAllDonations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const statsData = await getAdminStats();
      setStats(statsData);

      const donationsData = await getAllDonations();
      setAllDonations(donationsData);

      const usersData = await getAllUsers();
      setAllUsers(usersData);
    } catch (error) {
      console.error("Admin Fetch Error:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Unauthorized access. Redirecting to login.");
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/login");
      return;
    }
    fetchData();
  }, []);

  // Mock Campaign Data State
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: "Winter Relief 2024",
      description: "Emergency blankets and food...",
      category: "Emergency",
      goal: 20000,
      raised: 12500,
      endDate: "2024-12-31",
      status: "Active",
      image:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: 2,
      title: "Clean Water for Mali",
      description: "Drilling deep wells in rural areas.",
      category: "Water",
      goal: 15000,
      raised: 5000,
      endDate: "2024-11-20",
      status: "Active",
      image:
        "https://images.unsplash.com/photo-1579706497230-044033284701?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: 3,
      title: "Orphan Sponsorship",
      description: "Providing education and care.",
      category: "Education",
      goal: 50000,
      raised: 45000,
      endDate: "2024-10-15",
      status: "Completed",
      image:
        "https://images.unsplash.com/photo-1490126786801-7fa0939d73d6?w=500&auto=format&fit=crop&q=60",
    },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("loginStateChange"));
    toast.success("Logged out successfully");
    navigate("/");
  };

  // CRUD Handlers
  const handleSaveCampaign = (data) => {
    if (editingCampaign) {
      // Update
      setCampaigns(
        campaigns.map((c) =>
          c.id === editingCampaign.id
            ? { ...c, ...data, raised: c.raised, image: c.image }
            : c
        )
      );
      toast.success("Campaign updated successfully!");
      setEditingCampaign(null);
    } else {
      // Create
      const newCampaign = {
        id: Date.now(),
        ...data,
        raised: 0,
        image:
          "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=500&auto=format&fit=crop&q=60", // Placeholder
      };
      setCampaigns([newCampaign, ...campaigns]);
      toast.success("New campaign launched successfully!");
    }
    setIsCreatingCampaign(false);
  };

  const handleDeleteCampaign = (id) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 size={20} className="text-red-600" />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Delete Campaign?
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Are you sure you want to delete this campaign? This action
                cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => {
              setCampaigns(campaigns.filter((c) => c.id !== id));
              toast.dismiss(t.id);
              toast.success("Campaign deleted successfully");
            }}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none border-l border-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  const handleEditClick = (campaign) => {
    setEditingCampaign(campaign);
    setIsCreatingCampaign(true);
  };

  // Filtration
  const filteredCampaigns =
    filterStatus === "All"
      ? campaigns
      : campaigns.filter((c) => c.status === filterStatus);

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "donations", label: "Donations", icon: CreditCard },
    { id: "campaigns", label: "Campaigns", icon: Megaphone },
    { id: "donors", label: "Donors", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-100 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-8 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-dark to-primary">
                ZakatFlow
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded ml-1 h-fit self-start mt-1">
                  Admin
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 gray-icon"
                  }`}
                >
                  <tab.icon size={20} /> {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="pt-10 border-t border-gray-100 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">
              <Settings size={20} /> Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 relative start-0"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 p-4 md:p-8 w-full">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {activeTab}
              </h2>
              <p className="text-gray-500 text-sm hidden md:block">
                Overview of system performance.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-full border border-gray-100 shadow-sm">
              <img
                src="https://i.pravatar.cc/100?img=33"
                alt="Admin"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard
                  title="Total Raised"
                  value={`$${stats.totalRaised?.toLocaleString()}`}
                  change={stats.raisedChange}
                  icon={DollarSign}
                  color="bg-green-100 text-green-600"
                />
                <StatCard
                  title="Total Donations"
                  value={stats.totalDonations}
                  change={stats.donationsChange}
                  icon={CreditCard}
                  color="bg-blue-100 text-blue-600"
                />
                <StatCard
                  title="Active Campaigns"
                  value={campaigns.filter((c) => c.status === "Active").length}
                  change={0}
                  icon={Megaphone}
                  color="bg-purple-100 text-purple-600"
                />
                <StatCard
                  title="Total Donors"
                  value={stats.totalDonors}
                  change={stats.donorsChange}
                  icon={Users}
                  color="bg-orange-100 text-orange-600"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <DonationsTable
                    donations={allDonations.slice(0, 5)}
                    onUpdateStatus={fetchData}
                  />
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
                  <h3 className="font-bold text-lg mb-6">
                    Campaign Performance
                  </h3>
                  <div className="space-y-6">
                    {campaigns.slice(0, 3).map((campaign) => (
                      <div key={campaign.id}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium line-clamp-1 w-2/3">
                            {campaign.title}
                          </span>
                          <span className="font-bold text-gray-900">
                            ${campaign.raised / 1000}k / ${campaign.goal / 1000}
                            k
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                (campaign.raised / campaign.goal) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab("campaigns")}
                    className="w-full mt-6 py-2.5 text-sm font-semibold text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    View All Reports
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "donations" && (
            <motion.div
              key="donations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <DonationsTable
                donations={allDonations}
                onUpdateStatus={fetchData}
              />
            </motion.div>
          )}

          {activeTab === "campaigns" && (
            <motion.div
              key="campaigns"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {!isCreatingCampaign ? (
                <div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                      {["All", "Active", "Completed", "Draft"].map((status) => (
                        <button
                          key={status}
                          onClick={() => setFilterStatus(status)}
                          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium border transition-colors ${
                            filterStatus === status
                              ? "bg-primary text-white border-primary"
                              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        setEditingCampaign(null);
                        setIsCreatingCampaign(true);
                      }}
                      className="w-full md:w-auto px-4 py-2 bg-primary text-white rounded-lg font-bold shadow-md hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Plus size={18} /> Create Campaign
                    </button>
                  </div>

                  {filteredCampaigns.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 mt-4">
                      <Megaphone
                        size={40}
                        className="mx-auto text-gray-300 mb-4"
                      />
                      <h3 className="text-lg font-bold text-gray-900">
                        No campaigns found
                      </h3>
                      <p className="text-gray-500">
                        Try adjusting your filters or create a new one.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCampaigns.map((campaign) => (
                        <div
                          key={campaign.id}
                          className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
                        >
                          <div className="h-40 bg-gray-200 relative">
                            <img
                              src={campaign.image}
                              alt={campaign.title}
                              className="w-full h-full object-cover"
                            />
                            <span
                              className={`absolute top-3 right-3 backdrop-blur px-2 py-1 rounded text-xs font-bold ${
                                campaign.status === "Active"
                                  ? "bg-white/90 text-green-600"
                                  : "bg-gray-800/80 text-white"
                              }`}
                            >
                              {campaign.status}
                            </span>
                          </div>
                          <div className="p-5 flex flex-col flex-grow">
                            <h4 className="font-bold text-lg mb-1 line-clamp-1">
                              {campaign.title}
                            </h4>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                              {campaign.description}
                            </p>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                              <div
                                className="bg-primary h-1.5 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    (campaign.raised / campaign.goal) * 100,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <div className="flex justify-between items-center text-sm mb-4">
                              <span className="font-bold">
                                ${campaign.raised.toLocaleString()}{" "}
                                <span className="text-gray-400 font-normal">
                                  of ${campaign.goal.toLocaleString()}
                                </span>
                              </span>
                            </div>

                            <div className="flex gap-2 mt-auto pt-4 border-t border-gray-50">
                              <button
                                onClick={() => handleEditClick(campaign)}
                                className="flex-1 py-2 text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
                              >
                                Edit Details
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteCampaign(campaign.id)
                                }
                                className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                title="Delete Campaign"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <CampaignForm
                  initialData={editingCampaign}
                  onSubmit={handleSaveCampaign}
                  onCancel={() => {
                    setIsCreatingCampaign(false);
                    setEditingCampaign(null);
                  }}
                />
              )}
            </motion.div>
          )}

          {activeTab === "donors" && (
            <motion.div
              key="donors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-lg">System Users / Donors</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-medium">
                      <th className="p-4 pl-6">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="p-4 pl-6 font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="p-4 text-gray-500">{user.email}</td>
                        <td className="p-4 text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button className="text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
