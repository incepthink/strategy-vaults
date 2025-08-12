"use client";

import React from "react";
import { Grid, Box, CircularProgress, Typography } from "@mui/material";
import StrategyVaultCard from "./StrategyVaultCard";
import { useVaults } from "@/hooks/useVaults";
import { useUserVaultBalances } from "@/hooks/useUserVaultBalances";

interface VaultGridProps {
  /** If true, only show vaults where user has deposits */
  userDepositsOnly?: boolean;
  /** Optional address to check balances for (if different from connected wallet) */
  userAddress?: `0x${string}`;
}

const VaultGrid: React.FC<VaultGridProps> = ({
  userDepositsOnly = false,
  userAddress,
}) => {
  const {
    data: allVaults,
    loading: vaultsLoading,
    error: vaultsError,
  } = useVaults();

  // Only fetch user balances if we need to filter by deposits or show balances
  const {
    data: balances,
    loading: balancesLoading,
    error: balancesError,
    byVaultAmount,
  } = useUserVaultBalances({
    address: userAddress,
    nonzero: userDepositsOnly, // Only get non-zero balances when filtering
  });

  const loading = vaultsLoading || (userDepositsOnly && balancesLoading);
  const error = vaultsError || (userDepositsOnly && balancesError);

  // Filter vaults based on user deposits if needed
  const vaultsToShow = React.useMemo(() => {
    if (!userDepositsOnly || !allVaults) {
      return allVaults || [];
    }

    // Filter to only show vaults where user has deposits
    return allVaults.filter((vault) => {
      const userBalance = byVaultAmount[vault.id];
      return userBalance && parseFloat(userBalance) > 0;
    });
  }, [allVaults, userDepositsOnly, byVaultAmount]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography color="error">
          Failed to load {userDepositsOnly ? "user deposits" : "vaults"}
        </Typography>
      </Box>
    );
  }

  if (userDepositsOnly && vaultsToShow.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography variant="h6" color="text.secondary">
          No vault deposits found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          You haven't deposited into any vaults yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={4}>
        {vaultsToShow.map((vault) => {
          // Get user balance for this vault (if available)
          const userBalance = byVaultAmount[vault.id];
          const hasBalance = userBalance && parseFloat(userBalance) > 0;

          // Get token information from the vault data
          // This assumes your useVaults hook now returns deposit token info
          // You may need to update this based on your actual vault data structure
          const tokenSymbol =
            vault.depositToken?.symbol || vault.raw?.depositToken?.symbol;
          const tokenLogo =
            vault.depositToken?.logo_url ||
            vault.raw?.depositToken?.logo_url ||
            undefined;

          return (
            <Grid key={vault.id} size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }}>
              <StrategyVaultCard
                {...vault}
                // Pass user balance to be displayed in the card
                userBalance={hasBalance ? userBalance : undefined}
                // Pass token information for display
                tokenSymbol={tokenSymbol}
                tokenLogo={tokenLogo}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default VaultGrid;
