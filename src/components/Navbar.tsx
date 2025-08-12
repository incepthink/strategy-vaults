"use client";

import { Button } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import ConnectButton from "./ConnectButton";

const Navbar = () => {
  const pathname = usePathname();

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  // Helper function to get link classes
  const getLinkClasses = (path: string) => {
    const baseClasses = "transition-colors duration-200 hover:text-blue-300";
    const activeClasses = "text-blue-400";
    const inactiveClasses = "text-white";

    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="flex justify-between p-4 fixed top-0 w-full backdrop-blur-xs z-50">
      <p className="text-2xl font-bold">LOGO</p>

      <div className="flex gap-12 text-lg">
        <Link href="/" className={getLinkClasses("/")}>
          Home
        </Link>
        <Link
          href="/strategy-vaults"
          className={getLinkClasses("/strategy-vaults")}
        >
          Vaults
        </Link>
        <Link href="/profile" className={getLinkClasses("/profile")}>
          Profile
        </Link>
      </div>

      <ConnectButton />
    </div>
  );
};

export default Navbar;
