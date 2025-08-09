import React from "react";
import { Grid, Box } from "@mui/material";
import StrategyVaultCard from "./StrategyVaultCard";
import { vaultData } from "@/utils/constants";

const VaultGrid = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={4}>
        {vaultData.map((vault, index) => (
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 4 }} key={index}>
            <StrategyVaultCard {...vault} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VaultGrid;
