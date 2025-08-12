// src/hooks/useUserStats.ts
"use client";

import { useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import { useAccount } from "wagmi";
import { BACKEND_URL } from "@/utils/constants";

export type TokenBucket = {
  usd: number;
  amount: string; // normalized human units (string)
  decimals: number;
};

export type Position = {
  vault_id: number;
  vault_name: string;
  chain_id: number;
  token: `0x${string}`;
  decimals: number;
  amount_wei: string;
  amount: string; // normalized
  price_usd: number;
  usd_value: number;
  vault: {
    id: number;
    name: string;
    address: `0x${string}`;
    deposit_asset: `0x${string}`;
    manager: `0x${string}`;
    manager_id: number | null;
    apy_90d: string;
    tvl_wei: string;
    createdAt: string;
    managerRef?: { id: number; name: string | null; address: string } | null;
  };
};

export type UserStatsResponse = {
  address: `0x${string}`;
  user_id: number | null;
  total_usd: number;
  total_vaults: number;
  total_deposits: number;
  total_withdrawals: number;
  last_deposit_at: string | null;
  last_withdrawal_at: string | null;
  by_chain: Record<number, number>; // chainId -> USD
  by_token: Record<string, TokenBucket>; // `${chainId}:${addr}` -> bucket
  positions: Position[];
  price_source: string;
  price_timestamp: string;
};

type UseUserStatsArgs = {
  address?: `0x${string}`;
  nonzero?: boolean; // default true
  enabled?: boolean; // default true (if address exists)
};

export function useUserStats(args?: UseUserStatsArgs) {
  const { address: wagmiAddr } = useAccount();
  const address = (args?.address ?? wagmiAddr)?.toLowerCase() as
    | `0x${string}`
    | undefined;

  const nonzero = args?.nonzero !== false; // default true
  const enabled = !!address && (args?.enabled ?? true);

  const query = useQuery<UserStatsResponse>({
    queryKey: ["user:stats", address, { nonzero }],
    enabled,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
    queryFn: async ({ signal }) => {
      const url = `${BACKEND_URL}/api/user/address/${address}/stats`;
      const { data } = await axios.get<UserStatsResponse>(url, {
        params: { nonzero },
        signal,
      });
      return data;
    },
  });

  // nice derived shapes for charts / UI
  const derived = useMemo(() => {
    const d = query.data;
    if (!d) {
      return {
        chainSeries: [] as Array<{ chainId: number; usd: number }>,
        tokenSeries: [] as Array<{
          key: string;
          chainId: number;
          token: `0x${string}`;
          usd: number;
          amount: string;
          decimals: number;
        }>,
      };
    }

    const chainSeries = Object.entries(d.by_chain).map(([cid, usd]) => ({
      chainId: Number(cid),
      usd: Number(usd),
    }));

    const tokenSeries = Object.entries(d.by_token).map(([key, v]) => {
      const [cidStr, token] = key.split(":");
      return {
        key,
        chainId: Number(cidStr),
        token: token as `0x${string}`,
        usd: Number(v.usd),
        amount: v.amount,
        decimals: v.decimals,
      };
    });

    return { chainSeries, tokenSeries };
  }, [query.data]);

  return {
    ...query, // { data, isLoading, error, refetch, ... }
    stats: query.data ?? null,
    ...derived, // chainSeries, tokenSeries
    // handy labels
    totalUSD: query.data?.total_usd ?? 0,
    totalVaults: query.data?.total_vaults ?? 0,
    totalDeposits: query.data?.total_deposits ?? 0,
    totalWithdrawals: query.data?.total_withdrawals ?? 0,
    lastDepositAt: query.data?.last_deposit_at ?? null,
    lastWithdrawalAt: query.data?.last_withdrawal_at ?? null,
  };
}
