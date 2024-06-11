import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import userSvg from "../../assets/user.svg";
import "./styles.css";

function Header() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  function logout() {
    auth.signOut();
    navigate("/");
  }

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="flex justify-between items-center bg-blue-500 p-4">
      <p className="text-white text-lg font-bold">FinanDay.</p>
      {user && (
        <button
          className="flex items-center space-x-2 text-white text-sm focus:outline-none"
          onClick={logout}
        >
          <img
            src={user.photoURL ? user.photoURL : userSvg}
            alt="User Avatar"
            width={user.photoURL ? "32" : "24"}
            className="rounded-full"
          />
          <span>Logout</span>
        </button>
      )}
    </div>
  );
}

export default Header;
