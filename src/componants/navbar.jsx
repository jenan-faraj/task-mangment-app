import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { Search, Menu, X, User } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Listen for role changes in localStorage to update UI immediately
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setUser]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Error logging out: " + error.message);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-cyan-600 to-teal-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white">
              TaskFlow
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-blue-200 font-medium">
              Home
            </Link>

            {/* Conditionally Render Task Pages Based on Role */}
            {user?.role === "manager" && (
              <Link to="/task" className="text-white hover:text-blue-200 font-medium">
                Manage Tasks
              </Link>
            )}
            {user?.role === "team-member" && (
              <Link to="/member" className="text-white hover:text-blue-200 font-medium">
                My Tasks
              </Link>
            )}

            <Link to="/articles" className="text-white hover:text-blue-200 font-medium">
              Articles
            </Link>
            <Link to="/about" className="text-white hover:text-blue-200 font-medium">
              About
            </Link>
            <Link to="/contact" className="text-white hover:text-blue-200 font-medium">
              Contact
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden lg:flex items-center space-x-4">
                <p className="text-sm font-medium text-white">Welcome, {user.firstName}</p>
                <Link to="/profile" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <User className="h-5 w-5 text-gray-600" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-4">
                <Link to="/login" className="text-white hover:text-blue-300 font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-800 to-teal-700 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-4 border-t border-gray-100">
            <Link to="/home" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
              Home
            </Link>

            {user?.role === "manager" && (
              <Link to="/task" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                Tasks
              </Link>
            )}
            {user?.role === "team-member" && (
              <Link to="/member" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                My Tasks
              </Link>
            )}

            <Link to="/articles" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
              Articles
            </Link>
            <Link to="/contact" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
              Contact
            </Link>
            <Link to="/about" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
              About
            </Link>

            {user && (
              <div className="px-4 pt-2 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
