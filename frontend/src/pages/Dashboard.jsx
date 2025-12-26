import React from "react";
import { motion } from "framer-motion";
import {
  Download,
  TrendingUp,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  DollarSign,
  PieChart,
  ArrowUpRight,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const StatCard = ({ title, value, subtitle, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-primary/10 rounded-xl text-primary">
        <Icon size={24} />
      </div>
      <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
        <ArrowUpRight size={12} className="mr-1" /> +12.5%
      </span>
    </div>
    <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
    <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-xs text-gray-400">{subtitle}</div>
  </motion.div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Verified: "bg-green-100 text-green-700 border-green-200",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Failed: "bg-red-100 text-red-700 border-red-200",
  };

  const icons = {
    Verified: <CheckCircle size={14} className="mr-1" />,
    Pending: <Clock size={14} className="mr-1" />,
    Failed: <Clock size={14} className="mr-1" />,
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
        styles[status] || styles.Pending
      }`}
    >
      {icons[status]} {status}
    </span>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("loginStateChange"));
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Mock Data
  const transactions = [
    {
      id: 1,
      date: "2024-03-15",
      type: "Zakat Al-Mal",
      category: "General Fund",
      amount: "$1,200.00",
      status: "Verified",
    },
    {
      id: 2,
      date: "2024-03-10",
      type: "Sadaqah",
      category: "Water Well",
      amount: "$50.00",
      status: "Verified",
    },
    {
      id: 3,
      date: "2024-02-28",
      type: "Zakat Al-Fitr",
      category: "Ramadan Food",
      amount: "$15.00",
      status: "Verified",
    },
    {
      id: 4,
      date: "2024-02-25",
      type: "Donation",
      category: "Orphan Sponsorship",
      amount: "$300.00",
      status: "Pending",
    },
    {
      id: 5,
      date: "2024-01-12",
      type: "Sadaqah Jariyah",
      category: "Masjid Contruction",
      amount: "$500.00",
      status: "Verified",
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-28 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-500">
              Welcome back, brother/sister! Here is your impact overview.
            </p>
          </motion.div>

          <div className="flex gap-3">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleLogout}
              className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <LogOut size={20} /> Logout
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate("/donate")}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all flex items-center gap-2"
            >
              <DollarSign size={20} /> New Donation
            </motion.button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Donated"
            value="$2,065.00"
            subtitle="Across all campaigns"
            icon={TrendingUp}
            delay={0.1}
          />
          <StatCard
            title="Last Donation"
            value="$1,200.00"
            subtitle="Zakat Al-Mal • Mar 15"
            icon={Calendar}
            delay={0.2}
          />
          <StatCard
            title="Campaigns Supported"
            value="12"
            subtitle="Impact in 4 countries"
            icon={PieChart}
            delay={0.3}
          />
        </div>

        {/* Recent Activity Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-900">
              Donation History
            </h3>
            <button className="text-primary text-sm font-semibold hover:text-primary-dark transition-colors">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-100">
                  <th className="p-4 pl-6">Type & Date</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx, index) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="p-4 pl-6">
                      <div className="font-semibold text-gray-900">
                        {tx.type}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <Calendar size={10} /> {tx.date}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent-hover">
                          <CreditCard size={14} />
                        </div>
                        <span className="text-gray-700 font-medium text-sm">
                          {tx.category}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-gray-900">
                        {tx.amount}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        className="text-gray-400 hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/5 group-hover:visible"
                        title="Download Receipt"
                      >
                        <Download size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
