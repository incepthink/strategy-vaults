"use client";

import ProfileHeader from "@/components/profile/ProfileHeader";
import VaultGrid from "@/components/strategy-vaults/VaultGrid";
import RecentActivity from "@/components/profile/RecentActivity";
import { Box, Typography } from "@mui/material";
import React from "react";
import { useAccount } from "wagmi";

const page = () => {
  const { isConnected } = useAccount();

  return (
    <>
      <Box
        sx={{ backgroundColor: "primary.dark" }}
        className="min-h-screen px-8 py-16 pt-24"
      >
        <div className="mb-12">
          <ProfileHeader />
        </div>

        {isConnected && (
          <>
            <Typography variant="h5" sx={{ mb: 3, color: "text.primary" }}>
              Your Deposited Vaults
            </Typography>
            <div className="flex justify-center mb-12">
              <VaultGrid userDepositsOnly={true} />
            </div>

            {/* Recent Activity Section */}
            {isConnected && (
              <div className="mx-auto">
                <Typography variant="h5" sx={{ mb: 3, color: "text.primary" }}>
                  Recent Activity
                </Typography>
                <RecentActivity
                  limit={50}
                  showFilters={true}
                  className="w-full"
                />
              </div>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default page;
