import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Chip,
} from "@mui/material";
import React from "react";

const VaultFilters = () => {
  return (
    <Box className="w-full flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left side - Verified Vault Managers */}
        <Box
          sx={{ backgroundColor: "primary.light" }}
          className="p-2 px-3 flex items-center gap-4 rounded-sm w-fit"
        >
          <Typography
            sx={{
              color: "primary.contrastText",
              typography: { xs: "body1", sm: "h6" },
            }}
            className="text-sm sm:text-base"
          >
            Verified Vault Managers
          </Typography>
          <div className=" scale-110 w-4">
            <img
              src="/assets/verified.png"
              alt="verified"
              className="object-cover"
            />
          </div>
        </Box>

        {/* Right side - Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          <Box
            sx={{ backgroundColor: "primary.light" }}
            className="flex items-center rounded-sm overflow-hidden w-fit sm:w-auto"
          >
            <Typography
              sx={{
                color: "primary.contrastText",
                typography: { xs: "body2", sm: "body1" },
              }}
              className="pl-4 pr-2 py-3 text-sm sm:text-base whitespace-nowrap"
            >
              Manager
            </Typography>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value="All"
                variant="standard"
                sx={{
                  color: "white",
                  backgroundColor: "transparent",
                  "& .MuiSelect-select": {
                    padding: "12px 12px",
                    backgroundColor: "transparent",
                  },
                  "&:before": {
                    display: "none",
                  },
                  "&:after": {
                    display: "none",
                  },
                  ".MuiSvgIcon-root": {
                    color: "white",
                    right: "12px",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "rgba(30, 58, 96, 0.95)",
                      "& .MuiMenuItem-root": {
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="All">All</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{ backgroundColor: "primary.light" }}
            className="flex items-center rounded-sm overflow-hidden w-fit sm:w-auto"
          >
            <Typography
              sx={{
                color: "primary.contrastText",
                typography: { xs: "body2", sm: "body1" },
              }}
              className="pl-4 pr-2 py-3 text-sm sm:text-base whitespace-nowrap"
            >
              Deposit Asset
            </Typography>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value="All"
                variant="standard"
                sx={{
                  color: "white",
                  backgroundColor: "transparent",
                  "& .MuiSelect-select": {
                    padding: "12px 12px",
                    backgroundColor: "transparent",
                  },
                  "&:before": {
                    display: "none",
                  },
                  "&:after": {
                    display: "none",
                  },
                  ".MuiSvgIcon-root": {
                    color: "white",
                    right: "12px",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "rgba(30, 58, 96, 0.95)",
                      "& .MuiMenuItem-root": {
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="All">All</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{ backgroundColor: "primary.light" }}
            className="flex items-center rounded-sm overflow-hidden w-fit sm:w-auto"
          >
            <Typography
              sx={{
                color: "primary.contrastText",
                typography: { xs: "body2", sm: "body1" },
              }}
              className="pl-4 pr-2 py-3 text-sm sm:text-base whitespace-nowrap"
            >
              APY
            </Typography>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value="All"
                variant="standard"
                sx={{
                  color: "white",
                  backgroundColor: "transparent",
                  "& .MuiSelect-select": {
                    padding: "12px 12px",
                    backgroundColor: "transparent",
                  },
                  "&:before": {
                    display: "none",
                  },
                  "&:after": {
                    display: "none",
                  },
                  ".MuiSvgIcon-root": {
                    color: "white",
                    right: "12px",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "rgba(30, 58, 96, 0.95)",
                      "& .MuiMenuItem-root": {
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="All">All</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>

      {/* Info message */}
      <Box
        sx={{ backgroundColor: "primary.light" }}
        className="flex items-center gap-3 p-3 sm:p-2 sm:px-3 w-full sm:w-fit rounded-sm"
      >
        <div className="flex-shrink-0 mt-1 sm:mt-0">
          <img src="/assets/verified-gradient.png" alt="verified" />
        </div>
        <Typography
          sx={{
            color: "primary.contrastText",
            typography: { xs: "body1", sm: "h6" },
          }}
          className="text-base sm:text-sm leading-relaxed sm:leading-normal"
        >
          These managers have completed basic KYB checks and have provided
          further information regarding vault operation.
        </Typography>
      </Box>
    </Box>
  );
};

export default VaultFilters;
