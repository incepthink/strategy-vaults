import { Box, Card, Typography } from "@mui/material";
import React from "react";
import GradientCard from "../GradientCard";

const StrategyHeader = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium">
          Strategy Vaults
        </h1>
        <p className="text-lg sm:text-xl">
          Maximize your yields with trading strategies from leading teams across
          Solana.
        </p>
      </div>

      <GradientCard sx={{ width: { xs: "100%", lg: "auto" } }}>
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
          <div className="flex flex-col gap-4">
            <Typography variant="h6" color="primary.contrastText">
              Total Value Locked
            </Typography>
            <p className="text-3xl sm:text-4xl">$220M</p>
          </div>
          <div className="flex flex-col gap-4">
            <Typography variant="h6" color="primary.contrastText">
              Total P&L
            </Typography>
            <p className="text-3xl sm:text-4xl">$220M</p>
          </div>
        </div>
      </GradientCard>
    </div>
  );
};

export default StrategyHeader;
