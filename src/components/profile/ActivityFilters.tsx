"use client";

import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { ActivityFilter } from "@/utils/types";

interface ActivityFiltersProps {
  activeFilter: ActivityFilter;
  onFilterChange: (filter: ActivityFilter) => void;
  depositsCount: number;
  withdrawalsCount: number;
}

const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  activeFilter,
  onFilterChange,
  depositsCount,
  withdrawalsCount,
}) => {
  const filters = [
    {
      value: "all" as ActivityFilter,
      label: `All (${depositsCount + withdrawalsCount})`,
    },
    {
      value: "deposits" as ActivityFilter,
      label: `Deposits (${depositsCount})`,
    },
    {
      value: "withdrawals" as ActivityFilter,
      label: `Withdrawals (${withdrawalsCount})`,
    },
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    onFilterChange(filters[newValue].value);
  };

  const selectedIndex = filters.findIndex(
    (filter) => filter.value === activeFilter
  );

  return (
    <Box sx={{ mb: 3 }}>
      <Tabs
        value={selectedIndex}
        onChange={handleTabChange}
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
        {filters.map((filter) => (
          <Tab
            key={filter.value}
            label={<span className="tabLabel">{filter.label}</span>}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default ActivityFilters;
