import React from "react";

const Navbar = () => {
  return (
    <div className="w-full fixed top-0 backdrop-blur-sm p-6 flex justify-center items-center gap-8 z-10">
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Strategies</a>
      <a href="#">Contact</a>
    </div>
  );
};

export default Navbar;
