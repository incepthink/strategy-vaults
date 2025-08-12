"use client";

import { Box, Card, Typography, Skeleton } from "@mui/material";
import React from "react";
import GradientCard from "../GradientCard";
import { useAccount } from "wagmi";
import ConnectButton from "../ConnectButton";
import { useUserStats } from "@/hooks/useUserStats";

const ProfileHeader = () => {
  const { address, isConnected } = useAccount();
  const { totalUSD, isLoading, error } = useUserStats({
    enabled: isConnected,
  });

  // Format USD value with proper formatting
  const formatUSD = (value: number) => {
    if (value === 0) return "$0";

    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(1)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  const renderTotalValue = () => {
    if (!isConnected) {
      return <p className="text-3xl sm:text-4xl text-gray-500">--</p>;
    }

    if (isLoading) {
      return (
        <Skeleton
          variant="text"
          width={120}
          height={48}
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.1)",
            borderRadius: 1,
          }}
        />
      );
    }

    if (error) {
      return <p className="text-3xl sm:text-4xl text-red-400">Error</p>;
    }

    return <p className="text-3xl sm:text-4xl">{formatUSD(totalUSD)}</p>;
  };

  return (
    <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium">
          Profile
        </h1>
        {isConnected ? (
          <p className="text-lg sm:text-xl">{address}</p>
        ) : (
          <ConnectButton sx={{ marginTop: "16px", fontSize: 16 }} />
        )}
      </div>

      <GradientCard sx={{ width: { xs: "100%", lg: "auto" } }}>
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
          <div className="flex flex-col gap-4">
            <Typography variant="h6" color="primary.contrastText">
              Total Value Deposited
            </Typography>
            {renderTotalValue()}
          </div>
          {/* Future: Add Total P&L when available */}
          {/* <div className="flex flex-col gap-4">
            <Typography variant="h6" color="primary.contrastText">
              Total P&L
            </Typography>
            <p className="text-3xl sm:text-4xl">$220M</p>
          </div> */}
        </div>
      </GradientCard>
    </div>
  );
};

export default ProfileHeader;
