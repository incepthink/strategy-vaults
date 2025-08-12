"use client";

import React, { useState, useMemo } from "react";
import { Box, Typography, Card } from "@mui/material";
import { useUserTransfers } from "@/hooks/useUserTransfers";
import ActivityFilters from "./ActivityFilters";
import ActivityTable from "./ActivityTable";
import {
  ActivityFilter,
  ActivityRow,
  RecentActivityProps,
} from "@/utils/types";
import GradientCard from "../GradientCard";

const RecentActivity: React.FC<RecentActivityProps> = ({
  limit = 20,
  showFilters = true,
  className = "",
}) => {
  const [activeFilter, setActiveFilter] = useState<ActivityFilter>("all");

  const {
    deposits,
    withdrawals,
    depositsCount,
    withdrawalsCount,
    loading,
    error,
  } = useUserTransfers({
    limit,
  });

  // Combine and sort activities by creation time
  const allActivities: ActivityRow[] = useMemo(() => {
    const depositActivities: ActivityRow[] = deposits.map((deposit) => ({
      ...deposit,
      type: "deposit" as const,
    }));

    const withdrawalActivities: ActivityRow[] = withdrawals.map(
      (withdrawal) => ({
        ...withdrawal,
        type: "withdrawal" as const,
      })
    );

    const combined = [...depositActivities, ...withdrawalActivities];

    // Sort by createdAt timestamp, most recent first
    return combined.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [deposits, withdrawals]);

  // Filter activities based on selected filter
  const filteredActivities = useMemo(() => {
    switch (activeFilter) {
      case "deposits":
        return allActivities.filter((activity) => activity.type === "deposit");
      case "withdrawals":
        return allActivities.filter(
          (activity) => activity.type === "withdrawal"
        );
      default:
        return allActivities;
    }
  }, [allActivities, activeFilter]);

  const handleFilterChange = (filter: ActivityFilter) => {
    setActiveFilter(filter);
  };

  if (error) {
    return (
      <Card
        variant="gradient"
        sx={{
          p: 3,
          backgroundColor: "card.main",
          backdropFilter: "blur(10px)",
        }}
        className={className}
      >
        <Typography variant="h5" sx={{ mb: 2, color: "text.primary" }}>
          Recent Activity
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <Typography color="error">
            Error loading activities: {error.message}
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <GradientCard sx={{ width: "100%" }}>
      {showFilters && (
        <ActivityFilters
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          depositsCount={depositsCount}
          withdrawalsCount={withdrawalsCount}
        />
      )}

      <ActivityTable activities={filteredActivities} loading={loading} />
    </GradientCard>
  );
};

export default RecentActivity;
