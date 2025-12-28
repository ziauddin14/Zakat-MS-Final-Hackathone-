import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import Donate from "./pages/Donate";
import AdminDashboard from "./pages/AdminDashboard";
import ZakatCalculator from "./pages/ZakatCalculator";

// Layout component to conditionally render Navbar and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {!isAuthPage && !isAdminPage && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isAuthPage && !isAdminPage && <Footer />}
    </div>
  );
};

import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

const Home = () => (
  <>
    <Hero />
    {/* Add more sections here like Campaigns, Stats, etc. */}
  </>
);

const About = React.lazy(() => import("./pages/About"));

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route
          path="/about"
          element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <About />
            </React.Suspense>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/zakat-calculator" element={<ZakatCalculator />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </Router>
  );
}

export default App;
