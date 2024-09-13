//Loader/index.jsx
import React from "react";
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
