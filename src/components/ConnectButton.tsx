"use client";

import type { CSSProperties } from "react";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";

interface ConnectButtonProps {
  fullWidth?: boolean;
  label?: string;
  sx?: CSSProperties;
  style?: CSSProperties;
}

export default function ConnectButton({ fullWidth, style }: ConnectButtonProps) {
  return (
    <div style={{ width: fullWidth ? "100%" : undefined, ...style }}>
      <RainbowConnectButton
        showBalance={false}
        accountStatus="address"
        chainStatus="icon"
      />
    </div>
  );
}
