// src/api/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getHeaders = () => {
  // One-time cleanup for any "undefined" strings accidental stored
  ["token", "adminToken", "user"].forEach((key) => {
    const val = localStorage.getItem(key);
    if (val === "undefined" || val === "null") localStorage.removeItem(key);
  });

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
  role = "user"
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

// ---------------- CAMPAIGNS ----------------

// Get All Campaigns (Public)
export const getCampaigns = async () => {
  const { data } = await axios.get(`${API_URL}/campaigns`);
  return data;
};

// Create Campaign (Admin)
export const createCampaign = async (campaignData) => {
  try {
    console.log("Creating Campaign Payload:", campaignData);
    const { data } = await axios.post(`${API_URL}/campaigns`, campaignData, {
      headers: getHeaders(),
    });
    return data;
  } catch (error) {
    console.error(
      "API createCampaign details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Update Campaign (Admin)
export const updateCampaign = async (id, campaignData) => {
  try {
    console.log("Updating Campaign Payload:", campaignData);
    const { data } = await axios.put(
      `${API_URL}/campaigns/${id}`,
      campaignData,
      {
        headers: getHeaders(),
      }
    );
    return data;
  } catch (error) {
    console.error(
      "API updateCampaign details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Delete Campaign (Admin)
export const deleteCampaign = async (id) => {
  const { data } = await axios.delete(`${API_URL}/campaigns/${id}`, {
    headers: getHeaders(),
  });
  return data;
};

// ---------------- DONATIONS ----------------

// Create Donation
export const createDonation = async (donationData) => {
  try {
    const payload = {
      amount: Number(donationData.amount),
      donationType: donationData.type, // Frontend already uses 'Sadqah', 'Zakat', etc.
      paymentMethod:
        donationData.method === "card" || donationData.method === "paypal"
          ? "Online"
          : donationData.method === "Bank"
          ? "Bank"
          : "Cash",
      category: donationData.category || "General",
      message: donationData.message || "",
    };

    if (donationData.campaignId) {
      payload.campaignId = donationData.campaignId;
    }

    console.log("Donation Attempt Payload:", payload);

    const { data } = await axios.post(`${API_URL}/donations`, payload, {
      headers: getHeaders(),
    });
    return data;
  } catch (error) {
    console.error(
      "API createDonation details:",
      error.response?.data || error.message
    );
    throw error;
  }
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
  try {
    const { data } = await axios.put(
      `${API_URL}/donations/${donationId}/status`,
      { status },
      {
        headers: getHeaders(),
      }
    );
    return data;
  } catch (error) {
    console.error(
      "API updateDonationStatus details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Download Receipt
export const downloadReceipt = async (donationId) => {
  const response = await axios.get(`${API_URL}/receipt/${donationId}`, {
    headers: getHeaders(),
    responseType: "blob",
  });
  return response.data;
};
