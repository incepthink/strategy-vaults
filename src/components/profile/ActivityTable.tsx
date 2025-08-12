"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  Link,
} from "@mui/material";
import { ActivityRow } from "@/utils/types";

interface ActivityTableProps {
  activities: ActivityRow[];
  loading?: boolean;
}

const ActivityTable: React.FC<ActivityTableProps> = ({
  activities,
  loading,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "#4CAF50";
      case "pending":
        return "#FF9800";
      case "failed":
        return "#F44336";
      default:
        return "#6683A7";
    }
  };

  const getTypeColor = (type: "deposit" | "withdrawal") => {
    return type === "deposit" ? "#4CAF50" : "#FF5722";
  };

  const formatTxHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const getExplorerUrl = (txHash: string, chainId: number) => {
    const explorers: Record<number, string> = {
      1: "https://etherscan.io/tx/",
      137: "https://polygonscan.com/tx/",
      56: "https://bscscan.com/tx/",
      43114: "https://snowtrace.io/tx/",
    };
    return `${explorers[chainId] || explorers[1]}${txHash}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <Typography color="text.primary">Loading activities...</Typography>
      </Box>
    );
  }

  if (activities.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <Typography color="text.primary">No activities found</Typography>
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: "card.main",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(0, 219, 255, 0.2)",
        borderRadius: 2,
        "& .MuiTableCell-root": {
          borderColor: "rgba(102, 131, 167, 0.2)",
        },
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "text.primary", fontWeight: 600 }}>
              Type
            </TableCell>
            <TableCell sx={{ color: "text.primary", fontWeight: 600 }}>
              Vault
            </TableCell>
            <TableCell sx={{ color: "text.primary", fontWeight: 600 }}>
              Amount
            </TableCell>
            <TableCell sx={{ color: "text.primary", fontWeight: 600 }}>
              Status
            </TableCell>
            <TableCell sx={{ color: "text.primary", fontWeight: 600 }}>
              Transaction
            </TableCell>
            <TableCell sx={{ color: "text.primary", fontWeight: 600 }}>
              Age
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activities.map((activity) => (
            <TableRow
              key={`${activity.id}-${activity.type}`}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                },
              }}
            >
              <TableCell>
                <Chip
                  label={activity.type === "deposit" ? "Deposit" : "Withdrawal"}
                  size="small"
                  sx={{
                    backgroundColor: getTypeColor(activity.type),
                    color: "white",
                    fontWeight: 500,
                    textTransform: "capitalize",
                  }}
                />
              </TableCell>
              <TableCell>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.primary", fontWeight: 500 }}
                  >
                    {activity.vaultName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "primary.contrastText" }}
                  >
                    {activity.managerLabel}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{ color: "text.primary", fontWeight: 500 }}
                >
                  {activity.amount}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={activity.status}
                  size="small"
                  sx={{
                    backgroundColor: getStatusColor(activity.status),
                    color: "white",
                    fontWeight: 500,
                    textTransform: "capitalize",
                  }}
                />
              </TableCell>
              <TableCell>
                <Link
                  href={getExplorerUrl(activity.tx_hash, activity.chain_id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#00DBFF",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontFamily: "monospace",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {formatTxHash(activity.tx_hash)}
                </Link>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{ color: "primary.contrastText" }}
                >
                  {activity.ageValue}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ActivityTable;
