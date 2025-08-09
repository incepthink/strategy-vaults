import { Box, Typography, Chip, Button } from "@mui/material";
import React from "react";
import GradientCard from "../GradientCard";
import Link from "next/link";

interface StrategyVaultCardProps {
  id: number;
  name: string;
  manager: string;
  managerColor?: string;
  tvl: string;
  tvlAmount: string;
  apy: string;
  age: string;
  ageValue: string;
  apyValue: string;
  icon?: React.ReactNode;
}

const StrategyVaultCard = ({
  id,
  name,
  manager,
  managerColor = "primary",
  tvl,
  tvlAmount,
  apy,
  age,
  ageValue,
  apyValue,
  icon,
}: StrategyVaultCardProps) => {
  return (
    <GradientCard
      sx={{ width: "100%" }}
      sx2={{ backgroundColor: "card.main", position: "relative" }}
    >
      <Box
        sx={{ backgroundColor: "primary.light", color: "primary.contrastText" }}
        className="absolute top-0 right-0 px-3 sm:px-9 py-1 rounded-md flex items-center gap-2 sm:gap-4"
      >
        <Typography
          sx={{
            color: "primary.contrastText",
            typography: { xs: "body2", sm: "body1" },
          }}
        >
          {manager}
        </Typography>
        <div className="w-3 h-3 sm:w-4 sm:h-4">
          <img
            src="/assets/verified-gradient.png"
            alt="verified"
            className="w-full h-full object-contain"
          />
        </div>
      </Box>
      <Box className="w-full flex flex-col">
        {/* Header with icon and manager chip */}
        <div className="flex justify-between items-center mb-3 sm:mb-4 mt-2.5">
          <div className="flex items-center gap-2 sm:gap-4">
            {icon && <div className="w-6 h-6 sm:w-8 sm:h-8">{icon}</div>}
            <Typography
              sx={{
                color: "white",
                typography: { xs: "body1", sm: "h6" },
              }}
              className="font-medium"
            >
              {name}
            </Typography>
          </div>
        </div>

        {/* TVL Display */}
        <Box
          sx={{ backgroundColor: "card.light" }}
          className="flex flex-col items-center gap-1 mb-3 sm:mb-4 p-2 justify-center"
        >
          <div className="flex gap-2 items-center">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
            <Typography
              sx={{
                color: "white",
                typography: { xs: "body2", sm: "body1" },
              }}
              className="font-medium"
            >
              {tvl}
            </Typography>
          </div>
          <Typography
            sx={{
              color: "card.contrastText",
              typography: { xs: "caption", sm: "body1" },
            }}
          >
            TVL
          </Typography>
        </Box>

        {/* Stats Row */}
        <div className="flex gap-3 sm:gap-4 mb-3 sm:mb-4">
          <Box
            sx={{ backgroundColor: "card.light" }}
            className="flex flex-col items-center justify-center gap-1 flex-1 p-2"
          >
            <Typography
              sx={{
                typography: { xs: "body2", sm: "body1" },
              }}
              className="mb-1"
            >
              {ageValue}
            </Typography>
            <Typography
              sx={{
                color: "card.contrastText",
                typography: { xs: "caption", sm: "body1" },
              }}
            >
              AGE
            </Typography>
          </Box>
          <Box
            sx={{ backgroundColor: "card.light" }}
            className="flex flex-col items-center justify-center gap-1 flex-1 p-2"
          >
            <Typography
              sx={{
                typography: { xs: "body2", sm: "body1" },
              }}
              className="mb-1"
            >
              {apyValue}
            </Typography>
            <Typography
              sx={{
                color: "card.contrastText",
                typography: { xs: "caption", sm: "body1" },
              }}
            >
              90D APY
            </Typography>
          </Box>
        </div>

        {/* Footer */}
        <Box
          sx={{ backgroundColor: "card.light" }}
          className="flex flex-col items-center justify-center p-2 mb-3 sm:mb-4"
        >
          <Typography
            sx={{
              typography: { xs: "body2", sm: "body1" },
            }}
          >
            -
          </Typography>
          <Typography
            sx={{
              color: "card.contrastText",
              typography: { xs: "caption", sm: "body1" },
            }}
          >
            Your Balance
          </Typography>
        </Box>
        <Link href={`/strategy-vaults/${id}`} className="inline-block mx-auto">
          <Typography
            component="a"
            href=""
            sx={{
              typography: { xs: "body2", sm: "body1" },
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              textAlign: "center",
              color: "inherit",
            }}
          >
            View Vault
          </Typography>
        </Link>
      </Box>
    </GradientCard>
  );
};

export default StrategyVaultCard;
