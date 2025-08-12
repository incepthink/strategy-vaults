"use client";

import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  Stack,
  Tooltip,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

type Kind = "success" | "error";

const EXPLORERS: Record<number, string> = {
  1: "https://etherscan.io",
  10: "https://optimistic.etherscan.io",
  137: "https://polygonscan.com",
  42161: "https://arbiscan.io",
  8453: "https://basescan.org",
  11155111: "https://sepolia.etherscan.io",
};

export function getErrorMessage(e: any) {
  return (
    e?.shortMessage ||
    e?.message ||
    e?.response?.data?.error ||
    "Something went wrong"
  );
}

export function useTxDialog() {
  const [state, setState] = useState<{
    open: boolean;
    kind: Kind;
    title: string;
    message?: string;
    txHash?: `0x${string}`;
    chainId?: number;
  }>({ open: false, kind: "success", title: "" });

  const openSuccess = (opts: {
    title?: string;
    message?: string;
    txHash?: `0x${string}`;
    chainId?: number;
  }) =>
    setState({
      open: true,
      kind: "success",
      title: opts.title ?? "Success",
      message: opts.message,
      txHash: opts.txHash,
      chainId: opts.chainId,
    });

  const openError = (opts: { title?: string; message?: string }) =>
    setState({
      open: true,
      kind: "error",
      title: opts.title ?? "Error",
      message: opts.message,
    });

  const close = () => setState((s) => ({ ...s, open: false }));

  const DialogEl = useMemo(() => {
    const { open, kind, title, message, txHash, chainId } = state;
    const explorer =
      chainId && txHash ? `${EXPLORERS[chainId]}/tx/${txHash}` : undefined;

    return (
      <Dialog
        open={open}
        onClose={close}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            bgcolor: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
          },
        }}
        BackdropProps={{
          sx: {
            bgcolor: "rgba(0, 0, 0, 0.8)",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#1a1a1a",
            borderBottom: "1px solid #333",
            color: "#fff",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            {kind === "success" ? (
              <CheckCircleOutlineIcon sx={{ color: "#4CAF50" }} />
            ) : (
              <ErrorOutlineIcon sx={{ color: "#f44336" }} />
            )}
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: 500 }}>
              {title}
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            color: "#fff",
          }}
        >
          {message ? (
            <Typography
              variant="body2"
              sx={{
                color: "#b0b0b0",
                lineHeight: 1.6,
              }}
            >
              {message}
            </Typography>
          ) : null}

          {txHash ? (
            <Box mt={2}>
              <Typography
                variant="caption"
                sx={{
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontWeight: 500,
                }}
              >
                Transaction Hash
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  mt: 1,
                  p: 1.5,
                  bgcolor: "#2a2a2a",
                  borderRadius: 1,
                  border: "1px solid #333",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    wordBreak: "break-all",
                    color: "#e0e0e0",
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                    flex: 1,
                  }}
                >
                  {txHash}
                </Typography>
                <Tooltip title="Copy transaction hash" arrow>
                  <IconButton
                    size="small"
                    onClick={() => navigator.clipboard.writeText(txHash)}
                    sx={{
                      color: "#64b5f6",
                      "&:hover": {
                        bgcolor: "rgba(100, 181, 246, 0.1)",
                      },
                    }}
                  >
                    <ContentCopyIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          ) : null}
        </DialogContent>

        <DialogActions
          sx={{
            bgcolor: "#1a1a1a",
            p: 2,
            gap: 1,
          }}
        >
          {explorer ? (
            <Button
              onClick={() => window.open(explorer, "_blank")}
              variant="outlined"
              sx={{
                borderColor: "#64b5f6",
                color: "#64b5f6",
                "&:hover": {
                  borderColor: "#90caf9",
                  bgcolor: "rgba(100, 181, 246, 0.1)",
                },
              }}
            >
              View on Explorer
            </Button>
          ) : null}
          <Button
            onClick={close}
            variant="contained"
            sx={{
              color: "white",
              bgcolor: "#1976d2",
              "&:hover": {
                bgcolor: "#1565c0",
              },
              boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }, [state]);

  return { Dialog: DialogEl, openSuccess, openError, close };
}
