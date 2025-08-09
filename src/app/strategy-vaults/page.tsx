import NavbarVaults from "@/components/strategy-vaults/NavbarVaults";
import StrategyHeader from "@/components/strategy-vaults/StrategyHeader";
import VaultFilters from "@/components/strategy-vaults/VaultFilters";
import VaultGrid from "@/components/strategy-vaults/VaultGrid";
import { Box } from "@mui/material";
import React from "react";

const page = () => {
  return (
    <>
      <NavbarVaults />
      <Box
        sx={{ backgroundColor: "primary.dark" }}
        className="px-8 py-24 min-h-screen"
      >
        {/* Header Section */}
        <div className="mb-16">
          <StrategyHeader />
        </div>

        {/* Filters Section */}
        <div className="mb-12">
          <VaultFilters />
        </div>

        {/* Vaults Grid */}
        <VaultGrid />
      </Box>
    </>
  );
};

export default page;
