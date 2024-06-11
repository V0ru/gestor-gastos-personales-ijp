import React from "react";
import "./styles.css";  
function Loader() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    </div>
  );
}

export default Loader;
