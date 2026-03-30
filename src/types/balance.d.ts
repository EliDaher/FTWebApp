export interface BalanceKpisByCurrency {
  todayIncome: number;
  todayCashIn: number;
  todayCashOut: number;
  todayNet: number;
  cashIn: number;
  cashOut: number;
  currentBalance: number;
  periodRevenue: number;
  periodCogs: number;
  periodGrossProfit: number;
  currentInventoryValue: number;
  lowStockCount: number;
  totalItems: number;
}

export interface DailyIncomePoint {
  date: string;
  currency: string;
  subscriptionIncome: number;
  inventorySalesIncome: number;
  totalIncome: number;
}

export interface MonthlyBalanceRow {
  month: string;
  currency: string;
  cashIn: number;
  cashOut: number;
  revenue: number;
  cogs: number;
  grossProfit: number;
}

export type BalanceTransactionType = "subscription_payment" | "inventory_sale" | "inventory_purchase";

export interface BalanceTransactionRow {
  id: string;
  type: BalanceTransactionType;
  direction: "in" | "out";
  currency: string;
  amount: number;
  signedAmount: number;
  referenceId: string;
  method: string;
  note: string;
  date: string;
  createdAt: string;
}

export interface ProjectBalanceReportFilters {
  from: string;
  to: string;
  currency: string | null;
}

export interface ProjectBalanceReportResponse {
  timezone: string;
  generatedAt: string;
  filters: ProjectBalanceReportFilters;
  currencies: string[];
  kpisByCurrency: Record<string, BalanceKpisByCurrency>;
  dailyIncomeTrend: DailyIncomePoint[];
  monthlySummary: MonthlyBalanceRow[];
  todayTransactions: BalanceTransactionRow[];
}

export interface GetProjectBalanceReportParams {
  from?: string;
  to?: string;
  currency?: string;
}
