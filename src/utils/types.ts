import { TransferUI } from "@/hooks/useUserTransfers";

export type ActivityFilter = "all" | "deposits" | "withdrawals";

export interface ActivityRow extends TransferUI {
  type: "deposit" | "withdrawal";
}

export interface RecentActivityProps {
  limit?: number;
  showFilters?: boolean;
  className?: string;
}
