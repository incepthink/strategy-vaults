"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/utils/constants";

export interface StrategyVaultCardProps {
  id: number;
  name: string;
  manager: string;
  managerColor?: string;
  tvl: string; // display only (you can wire real TVL later)
  tvlAmount: string; // not used in UI right now
  apy: string; // label only (not used)
  age: string; // label only (not used)
  ageValue: string; // shown in card
  apyValue: string; // shown in card
  icon?: React.ReactNode;
  // Add token information
  depositToken?: {
    symbol: string;
    logo_url?: string | null;
    address: string;
    name: string;
    decimals: number;
    is_verified?: boolean;
  };
  raw?: VaultDTO; // Keep raw data accessible
}

type VaultDTO = {
  chain_id: number;
  id: number;
  name: string;
  address: string;
  manager: string; // on-chain addr
  apy_90d: string; // decimal as string, e.g. "0.1234"
  tvl_wei: string; // string
  createdAt: string; // ISO
  deposit_asset?: string; // token address
  managerRef?: { id: number; name: string | null; address: string };
  // Token data from API
  depositToken: {
    id: number;
    chain_id: number;
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    logo_url: string | null;
    coingecko_id: string | null;
    is_verified: boolean;
  };
};

export type TokenInfo = {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logo?: string;
  coingecko_id?: string | null;
  is_verified?: boolean;
};

export type VaultDetail = {
  id: number;
  name: string;
  address: string;
  managerLabel: string; // for <VaultHeader />
  apyValue: string; // for <VaultStats />
  ageValue: string; // for <VaultStats />
  tvl: string; // for <VaultStats /> (display-only for now)
  capacity: string; // for <VaultStats /> (display-only for now)
  deposit_token: TokenInfo; // token details
  raw: VaultDTO; // full payload if you need more
};

export const getTokenInfo = (vault: VaultDTO): TokenInfo => {
  // Only use token data from API response
  return {
    address: vault.depositToken.address,
    symbol: vault.depositToken.symbol,
    name: vault.depositToken.name,
    decimals: vault.depositToken.decimals,
    logo: vault.depositToken.logo_url || undefined,
    coingecko_id: vault.depositToken.coingecko_id,
    is_verified: vault.depositToken.is_verified,
  };
};

function fmtPercent(decStr?: string) {
  if (!decStr) return "-";
  const n = Number(decStr);
  if (!Number.isFinite(n)) return "-";
  return `${(n * 100).toFixed(2)}%`;
}

function fmtAge(createdAt?: string) {
  if (!createdAt) return "-";
  const diff = Date.now() - new Date(createdAt).getTime();
  const d = Math.floor(diff / 86_400_000);
  if (d > 0) return `${d}d`;
  const h = Math.floor(diff / 3_600_000);
  return `${h}h`;
}

function shortAddr(addr?: string) {
  if (!addr) return "-";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function useVaults(params?: {
  chain_id?: number;
  manager_id?: number;
  manager?: string;
  deposit_asset?: string;
  q?: string;
  limit?: number;
  offset?: number;
}) {
  const [data, setData] = useState<StrategyVaultCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const query = useMemo(() => {
    const q: Record<string, any> = {};
    for (const k of [
      "chain_id",
      "manager_id",
      "manager",
      "deposit_asset",
      "q",
      "limit",
      "offset",
    ] as const) {
      if (
        params &&
        params[k] !== undefined &&
        params[k] !== null &&
        params[k] !== ""
      )
        q[k] = params[k];
    }
    return q;
  }, [params]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    axios
      .get(`${BACKEND_URL}/api/vault`, { params: query })
      .then((res) => {
        // Handle both direct array response and wrapped response
        const responseData = res.data;
        const rows: VaultDTO[] = Array.isArray(responseData)
          ? responseData
          : responseData?.data || [];
        const mapped: StrategyVaultCardProps[] = rows.map((v) => ({
          id: v.id,
          name: v.name,
          manager: v.managerRef?.name || shortAddr(v.manager),
          managerColor: "primary",
          tvl: "-", // wire real TVL when you add pricing/decimals
          tvlAmount: "-",
          apy: "90D APY",
          age: "AGE",
          ageValue: fmtAge(v.createdAt),
          apyValue: fmtPercent(v.apy_90d),
          // Include deposit token information from API
          depositToken: {
            symbol: v.depositToken.symbol,
            logo_url: v.depositToken.logo_url,
            address: v.depositToken.address,
            name: v.depositToken.name,
            decimals: v.depositToken.decimals,
            is_verified: v.depositToken.is_verified,
          },
          raw: v, // Include raw data for fallback access
        }));
        if (!cancelled) setData(mapped);
      })
      .catch((e) => {
        if (!cancelled) setError(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  const refetch = () =>
    axios.get(`${BACKEND_URL}/api/vault`, { params: query }).then((res) => {
      const responseData = res.data;
      const rows: VaultDTO[] = Array.isArray(responseData)
        ? responseData
        : responseData?.data || [];

      const mapped: StrategyVaultCardProps[] = rows.map((v) => ({
        id: v.id,
        name: v.name,
        manager: v.managerRef?.name || shortAddr(v.manager),
        managerColor: "primary",
        tvl: "-",
        tvlAmount: "-",
        apy: "90D APY",
        age: "AGE",
        ageValue: fmtAge(v.createdAt),
        apyValue: fmtPercent(v.apy_90d),
        // Include deposit token information from API
        depositToken: {
          symbol: v.depositToken.symbol,
          logo_url: v.depositToken.logo_url,
          address: v.depositToken.address,
          name: v.depositToken.name,
          decimals: v.depositToken.decimals,
          is_verified: v.depositToken.is_verified,
        },
        raw: v,
      }));
      setData(mapped);
      return mapped;
    });

  return { data, loading, error, refetch };
}

export function useVault(id?: string | number) {
  const [data, setData] = useState<VaultDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<unknown>(null);

  const fetchOne = useCallback(async () => {
    if (!id && id !== 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<VaultDTO>(`${BACKEND_URL}/api/vault/${id}`);
      const v = res.data;
      const tokenInfo = getTokenInfo(v);

      const mapped: VaultDetail = {
        id: v.id,
        address: v.address,
        name: v.name,
        managerLabel: v.managerRef?.name || shortAddr(v.manager),
        apyValue: fmtPercent(v.apy_90d),
        ageValue: fmtAge(v.createdAt),
        tvl: "-", // wire real formatted TVL later
        capacity: "-", // wire real formatted capacity later
        deposit_token: tokenInfo,
        raw: v,
      };
      setData(mapped);
      return mapped;
    } catch (e) {
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOne();
  }, [fetchOne]);

  return { data, loading, error, refetch: fetchOne };
}
