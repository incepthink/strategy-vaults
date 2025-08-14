"use client";

import { Button, IconButton } from "@mui/material";
import { Menu, Close } from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import ConnectButton from "./ConnectButton";

const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  // Helper function to get link classes
  const getLinkClasses = (path: string, isMobile: boolean = false) => {
    const baseClasses = "transition-colors duration-200 hover:text-blue-300";
    const activeClasses = "text-blue-400";
    const inactiveClasses = "text-white";
    const mobileClasses = isMobile ? "block py-3 px-4 text-xl" : "";

    return `${baseClasses} ${mobileClasses} ${
      isActive(path) ? activeClasses : inactiveClasses
    }`;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main Navbar */}
      <div className="flex justify-between items-center p-4 fixed top-0 w-full backdrop-blur-xs z-50">
        <p className="text-2xl font-bold text-white">LOGO</p>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-12 text-lg">
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

        {/* Desktop Connect Button */}
        <div className="hidden md:block">
          <ConnectButton
            sx={{
              minWidth: { xs: "100px", sm: "120px", md: "140px" },
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
              padding: { xs: "6px 12px", sm: "8px 16px", md: "8px 16px" },
            }}
          />
        </div>

        {/* Mobile Hamburger Menu Button */}
        <IconButton
          className="md:hidden! text-white!"
          onClick={toggleMobileMenu}
          aria-label="toggle mobile menu"
        >
          {isMobileMenuOpen ? <Close /> : <Menu />}
        </IconButton>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <div
            className="fixed inset-0"
            onClick={closeMobileMenu}
            aria-label="close mobile menu"
          />
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gray-900 transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="text-2xl font-bold text-white!">LOGO</p>
          <IconButton
            className="text-white!"
            onClick={closeMobileMenu}
            aria-label="close mobile menu"
          >
            <Close />
          </IconButton>
        </div>

        {/* Mobile Navigation Links */}
        <div className="flex flex-col py-6">
          <Link
            href="/"
            className={getLinkClasses("/", true)}
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link
            href="/strategy-vaults"
            className={getLinkClasses("/strategy-vaults", true)}
            onClick={closeMobileMenu}
          >
            Vaults
          </Link>
          <Link
            href="/profile"
            className={getLinkClasses("/profile", true)}
            onClick={closeMobileMenu}
          >
            Profile
          </Link>
        </div>

        {/* Mobile Connect Button */}
        <div className="px-4 py-6 border-t border-gray-700">
          <ConnectButton
            sx={{
              width: "100%",
              minHeight: "48px",
              fontSize: "1rem",
              fontWeight: 500,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Navbar;
