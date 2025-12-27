// src/api/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getHeaders = () => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("adminToken");
  return { Authorization: token ? `Bearer ${token}` : "" };
};

// ---------------- USER AUTH ----------------

// User Registration
export const registerUser = async (
  name,
  email,
  password,
  phone,
  role = "donor"
) => {
  const { data } = await axios.post(`${API_URL}/auth/register`, {
    name,
    email,
    password,
    phone,
    role,
  });
  return data;
};

// User Login
export const loginUser = async (email, password) => {
  const { data } = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.removeItem("adminToken");
  }
  return data;
};

// Get User Profile
export const getUserProfile = async () => {
  const { data } = await axios.get(`${API_URL}/auth/profile`, {
    headers: getHeaders(),
  });
  return data;
};

// ---------------- DONATIONS ----------------

// Create Donation
export const createDonation = async (donationData) => {
  // Mapping frontend values to match backend Mongoose schema strictly
  const payload = {
    amount: Number(donationData.amount),
    // Mapping 'Sadaqah' to backend's spelling 'Sadqah' if needed,
    // but the user's frontend uses 'Sadaqah'.
    // Based on the schema provided: enum: ["Zakat", "Sadqah", "Fitra", "General"]
    donationType:
      donationData.type === "Sadaqah" ? "Sadqah" : donationData.type,
    paymentMethod:
      donationData.method === "card" || donationData.method === "paypal"
        ? "Online"
        : "Cash",
  };

  console.log("Sending Schema Matched Payload:", payload);

  const { data } = await axios.post(`${API_URL}/donations`, payload, {
    headers: getHeaders(),
  });
  return data;
};

// Get My Donations
export const getMyDonations = async () => {
  const { data } = await axios.get(`${API_URL}/donations/my`, {
    headers: getHeaders(),
  });
  return data;
};

// ---------------- ADMIN ----------------

// Admin Login (use same auth/login but store in adminToken)
export const loginAdmin = async (email, password) => {
  const { data } = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  if (data.token) {
    localStorage.setItem("adminToken", data.token);
    localStorage.removeItem("token");
  }
  return data;
};

// Get Admin Stats
export const getAdminStats = async () => {
  const { data } = await axios.get(`${API_URL}/admin/stats`, {
    headers: getHeaders(),
  });
  return data;
};

// Get All Users (Admin)
export const getAllUsers = async () => {
  const { data } = await axios.get(`${API_URL}/admin/users`, {
    headers: getHeaders(),
  });
  return data;
};

// Get All Donations (Admin)
export const getAllDonations = async () => {
  const { data } = await axios.get(`${API_URL}/admin/donations`, {
    headers: getHeaders(),
  });
  return data;
};

// Update Donation Status (Admin)
export const updateDonationStatus = async (donationId, status) => {
  const { data } = await axios.put(
    `${API_URL}/admin/donation/${donationId}`,
    { status },
    {
      headers: getHeaders(),
    }
  );
  return data;
};
