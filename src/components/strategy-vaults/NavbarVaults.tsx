import { Button } from "@mui/material";
import Link from "next/link";
import React from "react";

const NavbarVaults = () => {
  return (
    <div className="flex justify-between p-4 fixed top-0 w-full backdrop-blur-xs z-50">
      <p className="text-2xl font-bold">LOGO</p>

      <div className="flex gap-4 text-lg">
        <Link href={"/"}>Home</Link>
        <Link href={"/strategy-vaults"} className="text-blue-400">
          Vaults
        </Link>
      </div>

      <Button variant="gradient">Connect</Button>
    </div>
  );
};

export default NavbarVaults;
