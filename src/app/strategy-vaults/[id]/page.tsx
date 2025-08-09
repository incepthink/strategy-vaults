// src/app/strategy-vaults/[id]/page.tsx
import { vaultData } from "@/utils/constants";
import React from "react";
import { Box } from "@mui/material";
import VaultHeader from "@/components/vault/VaultHeader";
import VaultStats from "@/components/vault/VaultStats";
import VaultPerformance from "@/components/vault/VaultPerformance";
import DepositWithdrawForm from "@/components/vault/DepositWithdrawForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const index = Number(id) - 1;
  const vault = vaultData[index];

  if (!vault) {
    // optional: show 404 if id is invalid
    // import { notFound } from "next/navigation"; notFound();
    return (
      <Box
        sx={{ backgroundColor: "primary.dark" }}
        className="min-h-screen px-8 py-16"
      >
        <div className="text-white">Vault not found.</div>
      </Box>
    );
  }

  return (
    <Box
      sx={{ backgroundColor: "primary.dark" }}
      className="min-h-screen px-8 py-16"
    >
      <div className="mx-auto">
        <VaultHeader
          name={vault.name}
          manager={vault.manager}
          icon={vault.icon}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Stats */}
          <div className="xl:col-span-2">
            <VaultStats
              apy={vault.apyValue}
              age={vault.ageValue}
              tvl={vault.tvl}
              capacity={vault.capacity}
            />
          </div>

          {/* Form */}
          <div className="xl:col-span-1 xl:sticky xl:top-6">
            <DepositWithdrawForm />
          </div>

          {/* Performance */}
          <div className="xl:col-span-2">
            <VaultPerformance />
          </div>
        </div>
      </div>
    </Box>
  );
}
