import { vaultData } from "@/utils/constants";
import React from "react";
import { Box } from "@mui/material";
import VaultHeader from "@/components/vault/VaultHeader";
import VaultStats from "@/components/vault/VaultStats";
import VaultPerformance from "@/components/vault/VaultPerformance";
import DepositWithdrawForm from "@/components/vault/DepositWithdrawForm";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const vault = vaultData[Number(id) - 1];

  return (
    <Box
      sx={{ backgroundColor: "primary.dark" }}
      className="min-h-screen px-8 py-16"
    >
      <div className="mx-auto">
        {/* Header */}
        <VaultHeader
          name={vault.name}
          manager={vault.manager}
          icon={vault.icon}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <VaultStats
              apy={vault.apyValue}
              age={vault.ageValue}
              tvl={vault.tvl}
              capacity={vault.capacity}
            />

            {/* Performance Chart */}
            <VaultPerformance />
          </div>

          {/* Right Column - Deposit/Withdraw Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <DepositWithdrawForm />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default page;
