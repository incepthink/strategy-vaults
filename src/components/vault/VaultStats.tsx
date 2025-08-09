import { Box, Typography } from "@mui/material";
import React from "react";
import GradientCard from "../GradientCard";

interface VaultStatsProps {
  apy: string;
  age: string;
  tvl: string;
  capacity: string;
}

const VaultStats = ({ apy, age, tvl, capacity }: VaultStatsProps) => {
  return (
    <GradientCard
      sx={{ width: "100%", mb: 4 }}
      sx2={{ backgroundColor: "card.main" }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 p-3">
        {/* APY */}
        <div className="flex justify-center">
          <div className="flex flex-col items-start gap-2">
            <Typography
              sx={{
                typography: { xs: "caption", sm: "body1" },
                color: "primary.contrastText",
              }}
              className="mb-1 sm:mb-2"
            >
              APY (90 days)
            </Typography>
            <Typography
              sx={{
                typography: { xs: "h6", sm: "h5" },
                color: "green.400",
              }}
              className="font-bold text-green-400"
            >
              {apy}
            </Typography>
          </div>
        </div>

        {/* Vault Age */}
        <div className="flex justify-center">
          <div className="flex flex-col items-start gap-2">
            <Typography
              sx={{
                typography: { xs: "caption", sm: "body1" },
                color: "primary.contrastText",
              }}
              className="mb-1 sm:mb-2"
            >
              Vault Age
            </Typography>
            <Typography
              sx={{
                typography: { xs: "body1", sm: "h6" },
                color: "white",
              }}
              className="font-medium"
            >
              {age}
            </Typography>
          </div>
        </div>

        {/* TVL */}
        <div className="flex justify-center">
          <div className="flex flex-col items-start gap-2">
            <Typography
              sx={{
                typography: { xs: "caption", sm: "body1" },
                color: "primary.contrastText",
              }}
              className="mb-1 sm:mb-2"
            >
              TVL
            </Typography>
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full"></div>
              <Typography
                sx={{
                  typography: { xs: "body1", sm: "h6" },
                  color: "white",
                }}
                className="font-medium"
              >
                {tvl}
              </Typography>
            </div>
          </div>
        </div>

        {/* Vault Capacity */}
        <div className="flex justify-center">
          <div className="flex flex-col items-start gap-2">
            <Typography
              sx={{
                typography: { xs: "caption", sm: "body1" },
                color: "primary.contrastText",
              }}
              className="mb-1 sm:mb-2"
            >
              Vault Capacity
            </Typography>
            <Typography
              sx={{
                typography: { xs: "body1", sm: "h6" },
                color: "orange.400",
              }}
              className="font-bold text-orange-300"
            >
              {capacity}
            </Typography>
          </div>
        </div>
      </div>
    </GradientCard>
  );
};

export default VaultStats;
