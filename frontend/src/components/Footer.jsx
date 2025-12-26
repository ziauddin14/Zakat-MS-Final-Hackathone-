import React from "react";
import {
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white">
                <Heart size={16} fill="currentColor" />
              </div>
              <span className="text-xl font-bold">ZakatFlow</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering communities through transparent and efficient Zakat
              management. Your trusted partner in fulfilling spiritual
              obligations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <a
                  href="#"
                  className="hover:text-accent-light transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-accent-light transition-colors"
                >
                  Campaigns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-accent-light transition-colors"
                >
                  Zakat Calculator
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-accent-light transition-colors"
                >
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-lg mb-6">Resources</h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <a
                  href="#"
                  className="hover:text-accent-light transition-colors"
                >
                  Fatwa & Guidance
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-accent-light transition-colors"
                >
                  Annual Reports
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-accent-light transition-colors"
                >
                  Tax Benefits
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-accent-light transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-6">Stay Connected</h4>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to our newsletter for updates and impact stories.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent text-primary-dark rounded-md hover:bg-white transition-colors">
                <Mail size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400">
            © 2024 ZakatFlow. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary-dark transition-all"
            >
              <Facebook size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary-dark transition-all"
            >
              <Twitter size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary-dark transition-all"
            >
              <Instagram size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary-dark transition-all"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
