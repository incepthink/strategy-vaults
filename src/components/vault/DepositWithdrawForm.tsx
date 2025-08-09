"use client";

import { Box, Tabs, Tab } from "@mui/material";
import React, { useState } from "react";
import GradientCard from "../GradientCard";
import DepositForm from "./DepositForm";
import WithdrawForm from "./WithdrawForm";

const DepositWithdrawForm = () => {
  const [activeTab, setActiveTab] = useState(0); // 0 for Deposit, 1 for Withdraw

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const isDeposit = activeTab === 0;

  return (
    <GradientCard sx={{ width: "100%" }} sx2={{ backgroundColor: "card.main" }}>
      {/* Tab Header */}
      <Box className="mb-4 sm:mb-6">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            "& .MuiTabs-indicator": {
              display: "none", // remove underline entirely
            },
            "& .MuiTab-root": {
              typography: { xs: "body2", sm: "body1" },
              textTransform: "none",
              fontWeight: "500",
              color: "white", // default text color
              minHeight: "40px",
              borderRadius: "6px",
              mx: 0.5, // small gap between the two buttons
            },
          }}
        >
          <Tab
            label="Deposit"
            sx={{
              background:
                activeTab === 0
                  ? (theme) => theme.gradients.primary
                  : "transparent", // dim when inactive
              color: "white",
            }}
          />
          <Tab
            label="Withdraw"
            sx={{
              background:
                activeTab === 1
                  ? (theme) => theme.gradients.red
                  : "transparent",
              color: "white",
            }}
          />
        </Tabs>
      </Box>

      {/* Form Content */}
      {isDeposit ? <DepositForm /> : <WithdrawForm />}
    </GradientCard>
  );
};

export default DepositWithdrawForm;
