import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import ROGlogo from "../assets/ROGlogo.png"; // Pastikan path sesuai

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-red-600 to-black text-white shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Container Kiri: Logo dan Navigation Links */}
        <div className="flex items-center space-x-4 mr-auto">
          <Link to="/" className="flex items-center space-x-2">
            <img src={ROGlogo} alt="Logo" className="h-12 w-12" />
            <span className="text-xl font-semibold">ROG Store</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
          </nav>
        </div>

        {/* Search Bar (hanya untuk layar sedang ke atas) */}
        <div className="hidden md:flex flex-1 mx-8">
          <input
            type="text"
            placeholder="Cari di MyStore"
            className="w-full px-4 py-2 rounded-full text-gray-800"
          />
        </div>

        {/* Container Kanan: Login/Register atau Profile/Logout, diberi margin tambahan */}
        <div className="flex items-center space-x-4 text-sm ml-12">
          {currentUser ? (
            <>
              <Link to="/products" className="hover:underline">Products</Link>
              <Link to="/cart" className="hover:underline">Cart</Link>
              <Link to="/profile" className="hover:underline">
                👤 {currentUser.displayName || currentUser.email}
              </Link>
              <button
                onClick={logout}
                className="px-3 py-1 bg-white text-[#007bff] font-semibold rounded hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1 bg-white text-red-600 font-semibold rounded hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 border border-white font-semibold rounded hover:bg-white hover:text-[#007bff]"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Tombol Menu Mobile */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden bg-black text-white px-6 py-4">
          <nav className="flex flex-col space-y-3">
            <Link to="/" className="hover:underline" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/all-items" className="hover:underline" onClick={() => setMenuOpen(false)}>
              All Items
            </Link>
            <Link to="/products" className="hover:underline" onClick={() => setMenuOpen(false)}>
              Products
            </Link>
            {currentUser ? (
              <>
                <Link to="/cart" className="hover:underline" onClick={() => setMenuOpen(false)}>
                  Cart
                </Link>
                <Link to="/profile" className="hover:underline" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="text-left px-3 py-1 bg-white text-[#007bff] font-semibold rounded hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="hover:underline" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
