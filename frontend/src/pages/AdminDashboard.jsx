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
} from "lucide-react";
import { useForm } from "react-hook-form";
import Input from "../components/ui/Input";

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

const DonationsTable = () => {
  const [donations, setDonations] = useState([
    {
      id: "#D-1024",
      donor: "Ahmed Khan",
      amount: "$500",
      type: "Zakat",
      date: "2024-03-15",
      status: "Verified",
    },
    {
      id: "#D-1023",
      donor: "Sarah Smith",
      amount: "$100",
      type: "Sadaqah",
      date: "2024-03-14",
      status: "Pending",
    },
    {
      id: "#D-1022",
      donor: "Mohammed Ali",
      amount: "$1,200",
      type: "Gen. Fund",
      date: "2024-03-14",
      status: "Verified",
    },
    {
      id: "#D-1021",
      donor: "Fatima Noor",
      amount: "$50",
      type: "Fitra",
      date: "2024-03-13",
      status: "Rejected",
    },
    {
      id: "#D-1020",
      donor: "Anonymous",
      amount: "$250",
      type: "Zakat",
      date: "2024-03-12",
      status: "Pending",
    },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setDonations(
      donations.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
  };

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
            {donations.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 pl-6 font-medium text-gray-900">{d.id}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                      {d.donor.charAt(0)}
                    </div>
                    {d.donor}
                  </div>
                </td>
                <td className="p-4 font-bold">{d.amount}</td>
                <td className="p-4 text-gray-500">{d.type}</td>
                <td className="p-4 text-gray-500">{d.date}</td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      d.status === "Verified"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : d.status === "Pending"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>
                <td className="p-4 pr-6 text-right">
                  <div className="flex justify-end gap-2">
                    {d.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(d.id, "Verified")}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                          title="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(d.id, "Rejected")}
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

const CreateCampaign = ({ onCancel }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("New Campaign:", data);
    onCancel();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl">Create New Campaign</h3>
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
            {...register("title")}
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
              <option>Emergency</option>
              <option>Education</option>
              <option>Water</option>
              <option>Zakat</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Goal Amount ($)"
            type="number"
            {...register("goal")}
            placeholder="5000"
          />
          <Input label="End Date" type="date" {...register("endDate")} />
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
            Launch Campaign
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

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "donations", label: "Donations", icon: CreditCard },
    { id: "campaigns", label: "Campaigns", icon: Megaphone },
    { id: "donors", label: "Donors", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-100 hidden lg:flex flex-col z-10">
        <div className="p-8">
          <div className="flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-dark to-primary mb-10">
            ZakatFlow{" "}
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded ml-1 h-fit self-start mt-1">
              Admin
            </span>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

          <div className="mt-10 pt-10 border-t border-gray-100 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">
              <Settings size={20} /> Settings
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50">
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {activeTab}
            </h2>
            <p className="text-gray-500 text-sm">
              Overview of system performance.
            </p>
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
                  value="$124,500"
                  change={12.5}
                  icon={DollarSign}
                  color="bg-green-100 text-green-600"
                />
                <StatCard
                  title="Total Donations"
                  value="1,240"
                  change={8.2}
                  icon={CreditCard}
                  color="bg-blue-100 text-blue-600"
                />
                <StatCard
                  title="Active Campaigns"
                  value="8"
                  change={-2}
                  icon={Megaphone}
                  color="bg-purple-100 text-purple-600"
                />
                <StatCard
                  title="Total Donors"
                  value="890"
                  change={5.4}
                  icon={Users}
                  color="bg-orange-100 text-orange-600"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <DonationsTable />
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
                  <h3 className="font-bold text-lg mb-6">
                    Campaign Performance
                  </h3>
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">
                            Emergency Gaza Relief
                          </span>
                          <span className="font-bold text-gray-900">
                            $45k / $50k
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-2.5 text-sm font-semibold text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
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
              <DonationsTable />
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
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-4">
                      {["All", "Active", "Completed", "Draft"].map((status) => (
                        <button
                          key={status}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setIsCreatingCampaign(true)}
                      className="px-4 py-2 bg-primary text-white rounded-lg font-bold shadow-md hover:bg-primary-dark transition-colors flex items-center gap-2"
                    >
                      <Plus size={18} /> Create Campaign
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="h-40 bg-gray-200 relative">
                          <img
                            src={`https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2hhcml0eXxlbnwwfHwwfHx8MA%3D%3D`}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-green-600">
                            Active
                          </span>
                        </div>
                        <div className="p-5">
                          <h4 className="font-bold text-lg mb-1">
                            Winter Relief 2024
                          </h4>
                          <p className="text-gray-500 text-sm mb-4">
                            Emergency blankets and food...
                          </p>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                            <div
                              className="bg-primary h-1.5 rounded-full"
                              style={{ width: "65%" }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-bold">
                              $12,500{" "}
                              <span className="text-gray-400 font-normal">
                                raised
                              </span>
                            </span>
                            <button className="text-primary hover:underline">
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <CreateCampaign onCancel={() => setIsCreatingCampaign(false)} />
              )}
            </motion.div>
          )}

          {activeTab === "donors" && (
            <motion.div
              key="donors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center justify-center h-96"
            >
              <div className="text-center text-gray-400">
                <Users size={48} className="mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-bold text-gray-900">
                  Donor Management
                </h3>
                <p>Feature coming soon...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
