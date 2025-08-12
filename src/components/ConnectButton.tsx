"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Button,
  CircularProgress,
  type SxProps,
  type Theme,
} from "@mui/material";
import { useAccount, useSignMessage } from "wagmi";
import { useConnectModal, useAccountModal } from "@rainbow-me/rainbowkit";
import axios from "axios";
import { BACKEND_URL } from "@/utils/constants";
import { useUserStore } from "@/store/userStore";

export interface ConnectButtonProps {
  sx?: SxProps<Theme>;
  fullWidth?: boolean;
  label?: string;
  variant?: "gradient" | "text" | "outlined" | "contained";
  onBound?: (info: { user_id: number; address: string }) => void;
}

export default function ConnectButton({
  sx = {},
  fullWidth = false,
  label = "Connect Wallet",
  variant = "gradient",
  onBound,
}: ConnectButtonProps) {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { signMessageAsync } = useSignMessage();

  const setUser = useUserStore((s) => s.setUser);
  const resetUser = useUserStore((s) => s.resetUser);

  const [busy, setBusy] = useState(false);
  const boundForAddr = useRef<string | null>(null);
  // const isProcessing = useRef(false); // Prevent concurrent processing

  // // Stable callback for onBound
  // const stableOnBound = useCallback(
  //   (info: { user_id: number; address: string }) => {
  //     onBound?.(info);
  //   },
  //   [onBound]
  // );

  const processingPromise = useRef<Promise<void> | null>(null); // Track ongoing process

  useEffect(() => {
    if (!isConnected || !address) {
      resetUser();
      boundForAddr.current = null;
      processingPromise.current = null;
      return;
    }

    const lower = address.toLowerCase();

    // Skip if already processed
    if (boundForAddr.current === lower) {
      return;
    }

    // Skip if currently processing this address
    if (processingPromise.current) {
      return;
    }

    // Create processing promise
    processingPromise.current = (async () => {
      try {
        setBusy(true);
        console.log(`Processing address: ${lower}`); // Debug

        const { data } = await axios.get(`${BACKEND_URL}/api/user/${lower}`);
        console.log(`Received nonce: ${data?.nonce}`); // Debug

        if (!data?.exists) {
          setUser({ address: lower, verified: false });

          const message =
            `Link this wallet to my account.\n` +
            `Address: ${lower}\n` +
            `Nonce: ${data?.nonce}\n` +
            `Domain: yourapp.com`;

          let signature: `0x${string}`;
          try {
            signature = await signMessageAsync({ message });
          } catch {
            return; // User rejected
          }

          const rb = await axios.post(`${BACKEND_URL}/api/user/bind`, {
            address: lower,
            message,
            signature,
          });

          setUser({ id: rb.data.user_id, address: lower, verified: true });
          onBound?.({ user_id: rb.data.user_id, address: lower });
          boundForAddr.current = lower;
        } else {
          setUser({ id: data.user.id, address: lower, verified: true });
          onBound?.({ user_id: data.user.id, address: lower });
          boundForAddr.current = lower;
        }
      } catch (e) {
        console.error("Connect/Bind error:", e);
      } finally {
        setBusy(false);
        processingPromise.current = null;
      }
    })();
  }, [isConnected, address]); // Minimal dependencies

  const handleClick = () => {
    if (isConnected) {
      openAccountModal?.(); // copy address / disconnect
    } else {
      openConnectModal?.();
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      fullWidth={fullWidth}
      sx={sx}
      disabled={busy}
      startIcon={busy ? <CircularProgress size={18} /> : undefined}
    >
      {isConnected
        ? address
          ? shortAddr(address)
          : "Connected"
        : busy
        ? "Authorizing…"
        : label}
    </Button>
  );
}

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
