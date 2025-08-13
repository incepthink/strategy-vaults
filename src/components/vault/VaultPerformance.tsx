"use client";

import { Box, Typography, Button, Tabs, Tab, Skeleton } from "@mui/material";
import React, { useState } from "react";
import GradientCard from "../GradientCard";
import { useVaultPerformance } from "@/hooks/useVaultPerformance";

interface VaultPerformanceProps {
  vaultAddress: string;
}

const VaultPerformance = ({ vaultAddress }: VaultPerformanceProps) => {
  const [selectedChartTab, setSelectedChartTab] = useState(0); // Chart type tabs (ROI, Share Price, Vault Balance)
  const [selectedTimeTab, setSelectedTimeTab] = useState(2); // Time period tabs (7D, 30D, 90D) - Default to 90D

  // Fetch vault performance data
  const { data, loading, error } = useVaultPerformance(vaultAddress);
  console.log(data);

  const handleChartTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setSelectedChartTab(newValue);
  };

  const handleTimeTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setSelectedTimeTab(newValue);
  };

  // Helper function to format percentage values
  const formatPercentage = (
    value: string | null,
    defaultValue = "-"
  ): string => {
    // if (!value || value === null) return defaultValue;
    // const num = parseFloat(value);
    // if (!Number.isFinite(num)) return defaultValue;
    return `${Number(value).toFixed(2)}%`;
  };

  // Helper function to format decimal numbers
  const formatNumber = (
    value: string | null,
    decimals = 2,
    defaultValue = "-"
  ): string => {
    if (!value || value === null) return defaultValue;
    const num = parseFloat(value);
    if (!Number.isFinite(num)) return defaultValue;
    return num.toFixed(decimals);
  };

  // Get color for percentage values (red for negative, green for positive)
  const getPercentageColor = (value: string | null): string => {
    if (!value) return "white";
    const num = parseFloat(value);
    if (!Number.isFinite(num)) return "white";
    return num < 0 ? "red.400" : "green.400";
  };

  // Render loading skeleton for metrics
  const renderMetricSkeleton = () => (
    <div className="flex justify-between items-center">
      <Skeleton
        variant="text"
        width={120}
        height={20}
        sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
      />
      <Skeleton
        variant="text"
        width={80}
        height={24}
        sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
      />
    </div>
  );

  // Render error state for metrics
  const renderMetricError = (label: string) => (
    <div className="flex justify-between items-center">
      <Typography
        sx={{
          typography: { xs: "body2", sm: "body1" },
          color: "primary.contrastText",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          typography: { xs: "body1", sm: "h6" },
          color: "red.400",
        }}
        className="font-medium"
      >
        Error
      </Typography>
    </div>
  );

  return (
    <GradientCard
      sx={{ width: "100%", mb: 4 }}
      sx2={{ backgroundColor: "card.main" }}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
        <Typography
          sx={{
            typography: { xs: "h6", sm: "h5" },
            color: "white",
          }}
          className="font-medium"
        >
          Performance Breakdown
        </Typography>
        <Button
          variant="text"
          sx={{
            typography: { xs: "caption", sm: "body2" },
            color: "primary.contrastText",
            textTransform: "none",
            p: 0,
            minWidth: "auto",
          }}
        >
          View Vault Activities →
        </Button>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {loading ? (
          // Loading state
          <>
            {renderMetricSkeleton()}
            {renderMetricSkeleton()}
            {renderMetricSkeleton()}
            {renderMetricSkeleton()}
            {renderMetricSkeleton()}
          </>
        ) : error ? (
          // Error state
          <>
            {renderMetricError("YTD Return")}
            {renderMetricError("MTD Return")}
            {renderMetricError("Cumulative Return")}
            {renderMetricError("Avg Drawdown")}
            {renderMetricError("Sharpe Ratio")}
          </>
        ) : data?.metrics ? (
          // Success state with real data
          <>
            <div className="flex justify-between items-center">
              <Typography
                sx={{
                  typography: { xs: "body2", sm: "body1" },
                  color: "primary.contrastText",
                }}
              >
                YTD Return
              </Typography>
              <Typography
                sx={{
                  typography: { xs: "body1", sm: "h6" },
                  color: getPercentageColor(data.metrics.ytd),
                }}
                className="font-medium"
              >
                {formatPercentage(data.metrics.ytd)}
              </Typography>
            </div>

            <div className="flex justify-between items-center">
              <Typography
                sx={{
                  typography: { xs: "body2", sm: "body1" },
                  color: "primary.contrastText",
                }}
              >
                MTD Return
              </Typography>
              <Typography
                sx={{
                  typography: { xs: "body1", sm: "h6" },
                  color: getPercentageColor(data.metrics.mtd),
                }}
                className="font-medium"
              >
                {formatPercentage(data.metrics.mtd)}
              </Typography>
            </div>

            <div className="flex justify-between items-center">
              <Typography
                sx={{
                  typography: { xs: "body2", sm: "body1" },
                  color: "primary.contrastText",
                }}
              >
                Cumulative Return
              </Typography>
              <Typography
                sx={{
                  typography: { xs: "body1", sm: "h6" },
                  color: getPercentageColor(data.metrics.cumulative_return),
                }}
                className="font-medium"
              >
                {formatPercentage(data.metrics.cumulative_return)}
              </Typography>
            </div>

            <div className="flex justify-between items-center">
              <Typography
                sx={{
                  typography: { xs: "body2", sm: "body1" },
                  color: "primary.contrastText",
                }}
              >
                Avg Drawdown
              </Typography>
              <Typography
                sx={{
                  typography: { xs: "body1", sm: "h6" },
                  color: getPercentageColor(data.metrics.avg_drawdown),
                }}
                className="font-medium"
              >
                {formatPercentage(data.metrics.avg_drawdown)}
              </Typography>
            </div>

            <div className="flex justify-between items-center">
              <Typography
                sx={{
                  typography: { xs: "body2", sm: "body1" },
                  color: "primary.contrastText",
                }}
              >
                Sharpe Ratio
              </Typography>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <Typography
                  sx={{
                    typography: { xs: "body1", sm: "h6" },
                    color: "white",
                  }}
                  className="font-medium"
                >
                  {formatNumber(data.metrics.sharpe)}
                </Typography>
              </div>
            </div>
          </>
        ) : (
          // No data state
          <>
            {renderMetricError("YTD Return")}
            {renderMetricError("MTD Return")}
            {renderMetricError("Cumulative Return")}
            {renderMetricError("Avg Drawdown")}
            {renderMetricError("Sharpe Ratio")}
          </>
        )}
      </div>

      {/* Chart Tabs */}
      <Box className="mb-4 flex flex-col sm:flex-row sm:justify-between gap-4">
        {/* Chart Type Tabs */}
        <Tabs
          value={selectedChartTab}
          onChange={handleChartTabChange}
          sx={{
            minHeight: "auto",
            "& .MuiTabs-indicator": { display: "none" },
            "& .MuiTab-root": {
              minHeight: "auto",
              minWidth: "auto",
              padding: "8px 16px",
              typography: { xs: "body2", sm: "body1" },
              color: "primary.contrastText",
              textTransform: "none",
              backgroundColor: "transparent",
              borderRadius: "6px",
              margin: "0 4px",
            },
            "& .MuiTab-root.Mui-selected": {
              backgroundColor: "primary.light",
              fontWeight: 400,
            },
            "& .MuiTab-root.Mui-selected .tabLabel": {
              display: "inline-block",
              backgroundImage: (theme) => theme.gradients.primary,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            },
          }}
        >
          <Tab label={<span className="tabLabel">ROI</span>} />
          <Tab label={<span className="tabLabel">Share Price</span>} />
          <Tab label={<span className="tabLabel">Vault Balance</span>} />
        </Tabs>

        {/* Time Period Tabs */}
        <Tabs
          value={selectedTimeTab}
          onChange={handleTimeTabChange}
          sx={{
            minHeight: "auto",
            "& .MuiTabs-indicator": { display: "none" },
            "& .MuiTab-root": {
              minHeight: "auto",
              minWidth: "auto",
              padding: "8px 16px",
              typography: { xs: "body2", sm: "body1" },
              color: "primary.contrastText",
              textTransform: "none",
              backgroundColor: "transparent",
              borderRadius: "6px",
              margin: "0 4px",
            },
            "& .MuiTab-root.Mui-selected": {
              backgroundColor: "primary.light",
              fontWeight: 400,
            },
            "& .MuiTab-root.Mui-selected .tabLabel": {
              display: "inline-block",
              backgroundImage: (theme) => theme.gradients.primary,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            },
          }}
        >
          <Tab label={<span className="tabLabel">7D</span>} />
          <Tab label={<span className="tabLabel">30D</span>} />
          <Tab label={<span className="tabLabel">90D</span>} />
        </Tabs>
      </Box>

      {/* Chart Placeholder */}
      <Box
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderRadius: "8px",
          height: { xs: "200px", sm: "300px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            typography: { xs: "body2", sm: "body1" },
            color: "gray.500",
          }}
        >
          {`${
            ["ROI", "Share Price", "Vault Balance"][selectedChartTab]
          } Chart - ${["7D", "30D", "90D"][selectedTimeTab]}`}
        </Typography>
      </Box>

      {/* Chart Footer */}
      <Typography
        sx={{
          typography: "caption",
          color: "primary.contrastText",
        }}
        className="mt-3 sm:mt-4"
      >
        * ROI is based on changes in share price, not inclusive of fees
        {data?.updated_at && (
          <span className="ml-2">
            • Last updated: {new Date(data.updated_at).toLocaleString()}
          </span>
        )}
      </Typography>
    </GradientCard>
  );
};

export default VaultPerformance;
