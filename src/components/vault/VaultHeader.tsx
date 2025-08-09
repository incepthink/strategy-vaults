import { Box, Chip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, Typography } from "@mui/material";
import React from "react";
import Link from "next/link";

interface VaultHeaderProps {
  name: string;
  manager: string;
  icon: React.ReactNode;
}

const VaultHeader = ({ name, manager, icon }: VaultHeaderProps) => {
  return (
    <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      {/* Left side - Vault info */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Link href="/strategy-vaults" className="inline-flex">
          <IconButton
            sx={{
              color: "white",
              p: 0.5,
              "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: "24px" }} />
          </IconButton>
        </Link>

        <div className="w-8 h-8 sm:w-10 sm:h-10">{icon}</div>
        <Typography
          sx={{
            typography: { xs: "h5", sm: "h4" },
            color: "white",
          }}
          className="font-medium"
        >
          {name}
        </Typography>
      </div>

      {/* Right side - Manager and badges */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-6">
        <div className="flex items-center gap-2">
          <Typography
            sx={{
              typography: { xs: "body1", sm: "h6" },
              color: "primary.contrastText",
            }}
          >
            Manager:
          </Typography>
          <Typography
            sx={{
              typography: { xs: "body1", sm: "h6" },
              color: "primary.main",
            }}
            className="font-medium"
          >
            {manager}
          </Typography>
          <div className="w-4 h-4 sm:scale-125">
            <img
              src="/assets/verified-gradient.png"
              alt="verified"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Typography
            sx={{
              typography: { xs: "body1", sm: "h6" },
              color: "primary.contrastText",
            }}
          >
            Deposit:
          </Typography>
          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <Typography
              sx={{
                typography: { xs: "body1", sm: "h6" },
                color: "white",
                fontSize: "10px",
              }}
            >
              $
            </Typography>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Typography
            sx={{
              typography: { xs: "body1", sm: "h6" },
              color: "primary.contrastText",
            }}
          >
            Trading:
          </Typography>
          <div className="flex gap-1">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full"></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full"></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full"></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default VaultHeader;
