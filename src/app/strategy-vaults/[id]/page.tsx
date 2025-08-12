"use client";

import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useVault } from "@/hooks/useVaults";
import VaultHeader from "@/components/vault/VaultHeader";
import VaultStats from "@/components/vault/VaultStats";
import VaultPerformance from "@/components/vault/VaultPerformance";
import DepositWithdrawForm from "@/components/vault/DepositWithdrawForm";
import { useParams } from "next/navigation";

export default function VaultPage() {
  const { id } = useParams<{ id: string }>();
  const { data: vault, loading, error } = useVault(id);

  if (loading) {
    return (
      <Box
        sx={{ backgroundColor: "primary.dark" }}
        className="min-h-screen px-8 py-16 flex justify-center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !vault) {
    return (
      <Box
        sx={{ backgroundColor: "primary.dark" }}
        className="min-h-screen px-8 py-16"
      >
        <Typography color="error">Failed to load vault</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{ backgroundColor: "primary.dark" }}
        className="min-h-screen px-8 py-16 pt-24"
      >
        <div className="mx-auto">
          <VaultHeader
            name={vault.name}
            manager={vault.managerLabel}
            icon={undefined}
            tokenLogo={vault.deposit_token.logo}
            tokenSymbol={vault.deposit_token.symbol}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <VaultStats
                apy={vault.apyValue}
                age={vault.ageValue}
                tvl={vault.tvl}
                capacity={vault.capacity}
              />
              <VaultPerformance vaultAddress={vault.address} />
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <DepositWithdrawForm vault={vault} />
              </div>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
}
