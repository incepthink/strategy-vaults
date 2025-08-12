// hooks/useUserTransfers.ts
"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/utils/constants";
import { useAccount } from "wagmi";

/** ---- API types ---- */
export type TransferBase = {
  id: number;
  user_id: number;
  vault_id: number;
  chain_id: number;
  asset: string; // token address (lowercased)
  tx_hash: string;
  log_index: number;
  amount_wei: string; // big decimal as string
  status: "pending" | "confirmed" | "failed";
  block_number: number;
  createdAt: string;
  updatedAt: string;
  vault?: {
    id: number;
    name: string;
    address: string;
    chain_id: number;
    deposit_asset: string;
    manager: string;
    manager_id: number | null;
    apy_90d: string;
    tvl_wei: string;
    createdAt: string;
    managerRef?: { id: number; name: string | null; address: string } | null;
  } | null;
};

export type TransfersResponse = {
  address: string;
  user_id: number | null;
  deposits: { count: number; rows: TransferBase[] };
  withdrawals: { count: number; rows: TransferBase[] };
};

/** ---- Minimal token decimals registry (extend later) ---- */
const TOKEN_DECIMALS: Record<string, number> = {
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": 6, // USDC
  "0xdac17f958d2ee523a2206206994597c13d831ec7": 6, // USDT
  "0x6b175474e89094c44da98b954eedeac495271d0f": 18, // DAI
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": 18, // WETH
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": 8, // WBTC
};
const getDecimals = (addr?: string) =>
  addr ? TOKEN_DECIMALS[addr.toLowerCase()] ?? 18 : 18;

/** ---- utils ---- */
export const formatUnits = (wei: string, decimals: number) => {
  const neg = wei.startsWith("-");
  const s = neg ? wei.slice(1) : wei;
  const pad = s.padStart(decimals + 1, "0");
  const int = pad.slice(0, -decimals) || "0";
  const frac = decimals ? pad.slice(-decimals).replace(/0+$/, "") : "";
  return (neg ? "-" : "") + (frac ? `${int}.${frac}` : int);
};
const shortAddr = (a?: string) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "-");
const fmtPercent = (s?: string) => {
  const n = Number(s);
  return Number.isFinite(n) ? `${(n * 100).toFixed(2)}%` : "-";
};
const fmtAge = (iso?: string) => {
  if (!iso) return "-";
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86_400_000);
  if (d > 0) return `${d}d`;
  const h = Math.floor(diff / 3_600_000);
  return `${h}h`;
};

/** ---- UI type with normalized amount ---- */
export type TransferUI = TransferBase & {
  decimals: number;
  amount: string; // normalized
  vaultName: string;
  managerLabel: string;
  apyValue: string;
  ageValue: string;
};

type Params = {
  address?: `0x${string}`;
  chain_id?: number;
  vault_id?: number;
  asset?: `0x${string}`;
  /** comma-separated, e.g. "pending,confirmed" */
  status?: string;
  /** ISO strings */
  from?: string;
  to?: string;
  limit?: number; // default 50 in backend
  offset?: number; // default 0
};

type Selected = {
  user_id: number | null;
  address: string;
  deposits: TransferUI[];
  withdrawals: TransferUI[];
  depositsCount: number;
  withdrawalsCount: number;
};

export function useUserTransfers(input?: Params) {
  const { address: connected } = useAccount();
  const address = (input?.address ?? connected)?.toLowerCase();
  const params = {
    chain_id: input?.chain_id,
    vault_id: input?.vault_id,
    asset: input?.asset?.toLowerCase(),
    status: input?.status,
    from: input?.from,
    to: input?.to,
    limit: input?.limit,
    offset: input?.offset,
  };

  const { data, isLoading, error, refetch } = useQuery<
    TransfersResponse,
    Error,
    Selected
  >({
    queryKey: ["user:transfers", address, params],
    enabled: !!address,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    queryFn: async ({ signal }) => {
      const url = `${BACKEND_URL}/api/user/address/${address}/transfers`;
      const { data } = await axios.get<TransfersResponse>(url, {
        params,
        signal,
      });
      return data;
    },
    select: (resp) => {
      const mapRow = (r: TransferBase): TransferUI => {
        const depositAsset = r.vault?.deposit_asset || r.asset;
        const decimals = getDecimals(depositAsset);
        return {
          ...r,
          decimals,
          amount: formatUnits(r.amount_wei, decimals),
          vaultName: r.vault?.name ?? `Vault #${r.vault_id}`,
          managerLabel:
            r.vault?.managerRef?.name || shortAddr(r.vault?.manager),
          apyValue: fmtPercent(r.vault?.apy_90d),
          ageValue: fmtAge(r.vault?.createdAt),
        };
      };

      return {
        user_id: resp.user_id,
        address: resp.address,
        deposits: resp.deposits.rows.map(mapRow),
        withdrawals: resp.withdrawals.rows.map(mapRow),
        depositsCount: resp.deposits.count,
        withdrawalsCount: resp.withdrawals.count,
      };
    },
  });

  return {
    data,
    deposits: data?.deposits ?? [],
    withdrawals: data?.withdrawals ?? [],
    depositsCount: data?.depositsCount ?? 0,
    withdrawalsCount: data?.withdrawalsCount ?? 0,
    userId: data?.user_id ?? null,
    loading: isLoading,
    error,
    refetch,
  };
}
