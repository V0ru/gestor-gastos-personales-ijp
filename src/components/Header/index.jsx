//Header/index.jsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import userSvg from "../../assets/user.svg";

function Header() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  function logout() {
    auth.signOut();
    navigate("/");
  }

  useEffect(() => {
    if (!user) {
      navigate("/sing");
    } else {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <p className="text-white text-2xl font-bold tracking-tight hover:text-blue-200 transition-colors">
              FinanDay<span className="text-blue-300">.</span>
            </p>
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-blue-200 text-sm">{user.email}</span>
              <button
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                onClick={logout}
              >
                <img
                  src={user.photoURL ? user.photoURL : userSvg}
                  alt="User Avatar"
                  width={user.photoURL ? "28" : "20"}
                  className="rounded-full"
                />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          ) : (
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-blue-600 hover:bg-blue-50 font-medium text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              Home
            </Link>
          )}
        </div>
      </div>
    </nav>
    
  );
}

export default Header;
