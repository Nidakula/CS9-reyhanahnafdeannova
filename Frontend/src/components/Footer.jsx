import React from "react";
import { Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import Logo from "../assets/ROGlogo.png"; 

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-red-600 to-black text-white py-6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo dan Navigation Links */}
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            {/* Logo di bagian kiri */}
            <img src={Logo} alt="Logo" className="h-10 w-auto" />
            {/* Navigation Links */}
            <a href="/about" className="hover:underline">About</a>
            <a href="/" className="hover:underline">Home</a>
            <a href="/news" className="hover:underline">News</a>
            <a href="/help" className="hover:underline">Help</a>
          </div>
          {/* Social Icons */}
          <div className="flex space-x-4">
            <a href="https://twitter.com/heroku" aria-label="Twitter" className="hover:text-gray-300">
              <Twitter size={20} />
            </a>
            <a href="https://facebook.com/heroku" aria-label="Facebook" className="hover:text-gray-300">
              <Facebook size={20} />
            </a>
            <a href="https://instagram.com/heroku" aria-label="Instagram" className="hover:text-gray-300">
              <Instagram size={20} />
            </a>
            <a href="https://linkedin.com/company/heroku" aria-label="LinkedIn" className="hover:text-gray-300">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
        {/* Copyright */}
        <div className="text-center text-xs mt-4 border-t border-white/20 pt-4">
          <p>&copy; {new Date().getFullYear()} Heroku. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
