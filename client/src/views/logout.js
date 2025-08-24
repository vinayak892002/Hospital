import React from "react";
import { LogOut } from "react-feather";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("hmsToken");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <LogOut
      size={20}
      className="cursor-pointer text-danger"
      style={{
        position: "fixed",
        top: "3rem",
        right: "3rem",
        zIndex: 999,
      }}
      onClick={handleLogout}
    />
  );
};

export default Logout;
