import { useEffect, useMemo, useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import HeaderCard from "../components/UI/HeaderCard";
import BodyCard from "../components/UI/BodyCard";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { useAuth } from "../context/AuthContext";
import { getProjectBalanceReport } from "../services/balance";
import { BalanceTransactionType, DailyIncomePoint, ProjectBalanceReportResponse } from "../types/balance";

const tr = {
  adminOnly: "\u0647\u0630\u0647 \u0627\u0644\u0635\u0641\u062d\u0629 \u0645\u062a\u0627\u062d\u0629 \u0644\u0644\u0645\u062f\u064a\u0631 \u0641\u0642\u0637.",
  refresh: "\u062a\u062d\u062f\u064a\u062b",
  pageTitle: "\u0645\u064a\u0632\u0627\u0646\u064a\u0629 \u0627\u0644\u0645\u0634\u0631\u0648\u0639",
  tz: "\u0627\u0644\u062a\u0648\u0642\u064a\u062a",
  updatedAt: "\u0622\u062e\u0631 \u062a\u062d\u062f\u064a\u062b",
  fromDate: "\u0645\u0646 \u062a\u0627\u0631\u064a\u062e",
  toDate: "\u0625\u0644\u0649 \u062a\u0627\u0631\u064a\u062e",
  currency: "\u0627\u0644\u0639\u0645\u0644\u0629",
  all: "\u0627\u0644\u0643\u0644",
  applyFilter: "\u062a\u0637\u0628\u064a\u0642 \u0627\u0644\u0641\u0644\u062a\u0631",
  noData: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0628\u064a\u0627\u0646\u0627\u062a \u0645\u0627\u0644\u064a\u0629 \u0636\u0645\u0646 \u0627\u0644\u0641\u0644\u0627\u062a\u0631 \u0627\u0644\u0645\u062d\u062f\u062f\u0629.",
  loading: "\u062c\u0627\u0631\u064a \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u062a\u0642\u0631\u064a\u0631...",
  currencySummary: "\u0645\u0644\u062e\u0635 \u0627\u0644\u0639\u0645\u0644\u0629",
  currentBalance: "\u0627\u0644\u0631\u0635\u064a\u062f \u0627\u0644\u062d\u0627\u0644\u064a",
  todayIncome: "\u062f\u062e\u0644 \u0627\u0644\u064a\u0648\u0645",
  todayOutflow: "\u0645\u0635\u0631\u0648\u0641 \u0627\u0644\u064a\u0648\u0645",
  todayNet: "\u0635\u0627\u0641\u064a \u0627\u0644\u064a\u0648\u0645",
  periodRevenue: "\u0625\u064a\u0631\u0627\u062f \u0627\u0644\u0641\u062a\u0631\u0629",
  periodCogs: "\u062a\u0643\u0644\u0641\u0629 \u0627\u0644\u0645\u0628\u064a\u0639\u0627\u062a COGS",
  periodProfit: "\u0627\u0644\u0631\u0628\u062d \u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a",
  inventoryValue: "\u0642\u064a\u0645\u0629 \u0627\u0644\u0645\u062e\u0632\u0648\u0646 \u0627\u0644\u062d\u0627\u0644\u064a\u0629",
  totalIn: "\u0627\u0644\u0645\u0642\u0628\u0648\u0636\u0627\u062a \u0627\u0644\u0643\u0644\u064a\u0629",
  totalOut: "\u0627\u0644\u0645\u062f\u0641\u0648\u0639\u0627\u062a \u0627\u0644\u0643\u0644\u064a\u0629",
  lowStock: "\u0623\u0635\u0646\u0627\u0641 \u0645\u0646\u062e\u0641\u0636\u0629 \u0627\u0644\u0645\u062e\u0632\u0648\u0646",
  trendTitle: "\u0627\u062a\u062c\u0627\u0647 \u062f\u062e\u0644 \u0627\u0644\u0641\u062a\u0631\u0629",
  noTrend: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0646\u0642\u0627\u0637 \u0627\u062a\u062c\u0627\u0647.",
  todayMovements: "\u062d\u0631\u0643\u0627\u062a \u0627\u0644\u064a\u0648\u0645",
  noTodayMovements: "\u0644\u0627 \u062a\u0648\u062c\u062f \u062d\u0631\u0643\u0627\u062a \u0627\u0644\u064a\u0648\u0645.",
  colTime: "\u0627\u0644\u0648\u0642\u062a",
  colType: "\u0627\u0644\u0646\u0648\u0639",
  colRef: "\u0627\u0644\u0645\u0631\u062c\u0639",
  colMethod: "\u0627\u0644\u0637\u0631\u064a\u0642\u0629",
  colDirection: "\u0627\u0644\u0627\u062a\u062c\u0627\u0647",
  colAmount: "\u0627\u0644\u0645\u0628\u0644\u063a",
  colNote: "\u0645\u0644\u0627\u062d\u0638\u0629",
  monthlyTitle: "\u0627\u0644\u0645\u0644\u062e\u0635 \u0627\u0644\u0634\u0647\u0631\u064a (\u0622\u062e\u0631 6 \u0623\u0634\u0647\u0631)",
  noMonthly: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0628\u064a\u0627\u0646\u0627\u062a \u0634\u0647\u0631\u064a\u0629.",
  month: "\u0627\u0644\u0634\u0647\u0631",
  revenue: "\u0627\u0644\u0625\u064a\u0631\u0627\u062f",
  grossProfit: "\u0627\u0644\u0631\u0628\u062d \u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a",
};

const txTypeLabel: Record<BalanceTransactionType, string> = {
  subscription_payment: "\u062f\u0641\u0639\u0629 \u0627\u0634\u062a\u0631\u0627\u0643",
  inventory_sale: "\u0628\u064a\u0639 \u0645\u062e\u0632\u0648\u0646",
  inventory_purchase: "\u0634\u0631\u0627\u0621 \u0645\u062e\u0632\u0648\u0646",
};

const directionLabel: Record<"in" | "out", string> = {
  in: "\u062f\u062e\u0648\u0644",
  out: "\u062e\u0631\u0648\u062c",
};

const formatDateInDamascus = (date: Date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Damascus",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

const today = new Date();
const toDefault = formatDateInDamascus(today);
const fromDate = new Date(today);
fromDate.setDate(fromDate.getDate() - 29);
const fromDefault = formatDateInDamascus(fromDate);

const emptyReport: ProjectBalanceReportResponse = {
  timezone: "Asia/Damascus",
  generatedAt: "",
  filters: {
    from: fromDefault,
    to: toDefault,
    currency: null,
  },
  currencies: [],
  kpisByCurrency: {},
  dailyIncomeTrend: [],
  monthlySummary: [],
  todayTransactions: [],
};

const num = (value: number) => Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

export default function Balance() {
  const { userType } = useAuth();
  const [report, setReport] = useState<ProjectBalanceReportResponse>(emptyReport);
  const [from, setFrom] = useState(fromDefault);
  const [to, setTo] = useState(toDefault);
  const [currency, setCurrency] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const currencyList = useMemo(() => {
    const keys = report.currencies.length ? report.currencies : Object.keys(report.kpisByCurrency);
    return [...keys].sort((a, b) => a.localeCompare(b));
  }, [report]);

  const trendByCurrency = useMemo(() => {
    return report.dailyIncomeTrend.reduce<Record<string, DailyIncomePoint[]>>((acc, point) => {
      if (!acc[point.currency]) acc[point.currency] = [];
      acc[point.currency].push(point);
      return acc;
    }, {});
  }, [report.dailyIncomeTrend]);

  const currencyOptions = useMemo(() => {
    const merged = new Set(["", "SYP", "USD", "EUR", "TRY", ...currencyList]);
    return Array.from(merged);
  }, [currencyList]);

  const loadReport = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError("");

      const data = await getProjectBalanceReport({
        from,
        to,
        currency: currency || undefined,
      });
      setReport(data || emptyReport);
    } catch (e: any) {
      console.error(e);
      setError(e?.response?.data?.message || "\u062a\u0639\u0630\u0631 \u062a\u062d\u0645\u064a\u0644 \u062a\u0642\u0631\u064a\u0631 \u0627\u0644\u0645\u064a\u0632\u0627\u0646\u064a\u0629.");
      setReport(emptyReport);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (userType === "admin") {
      void loadReport();
    }
  }, [userType]);

  if (userType !== "admin") {
    return (
      <ScreenWrapper>
        <BodyCard>
          <p className="text-center text-rose-200">{tr.adminOnly}</p>
        </BodyCard>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <HeaderCard className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Button className="mx-auto w-full max-w-[220px]" onClick={() => void loadReport(true)} loading={refreshing}>
          {tr.refresh}
        </Button>
        <h1 className="text-center text-2xl font-bold">{tr.pageTitle}</h1>
        <div className="text-center text-xs text-slate-300">
          <p>{tr.tz}: {report.timezone || "Asia/Damascus"}</p>
          <p>{tr.updatedAt}: {report.generatedAt ? new Date(report.generatedAt).toLocaleString() : "-"}</p>
        </div>
      </HeaderCard>

      {error ? (
        <BodyCard>
          <p className="text-center text-rose-200">{error}</p>
        </BodyCard>
      ) : null}

      <BodyCard>
        <form
          dir="rtl"
          className="grid gap-3 md:grid-cols-5"
          onSubmit={(event) => {
            event.preventDefault();
            void loadReport();
          }}
        >
          <Input name="from" label={tr.fromDate} type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <Input name="to" label={tr.toDate} type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          <div>
            <label className="mb-2 mr-1 block text-sm font-semibold text-slate-100">{tr.currency}</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="h-11 w-full rounded-xl border border-yellow-300/25 bg-black/35 px-3 text-yellow-50"
            >
              <option value="">{tr.all}</option>
              {currencyOptions
                .filter((c) => c)
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </div>
          <div className="self-end text-right text-sm text-slate-300">
            <p>{tr.fromDate}: {report.filters.from || "-"}</p>
            <p>{tr.toDate}: {report.filters.to || "-"}</p>
          </div>
          <Button type="submit" className="self-end" loading={loading}>
            {tr.applyFilter}
          </Button>
        </form>
      </BodyCard>

      {!loading && currencyList.length === 0 ? (
        <BodyCard>
          <p dir="rtl" className="text-center text-slate-300">{tr.noData}</p>
        </BodyCard>
      ) : null}

      {loading ? (
        <BodyCard>
          <p className="soft-pulse py-8 text-center text-slate-300">{tr.loading}</p>
        </BodyCard>
      ) : null}

      {!loading
        ? currencyList.map((code) => {
            const kpi = report.kpisByCurrency[code];
            if (!kpi) return null;
            const todayNetClass = kpi.todayNet >= 0 ? "text-emerald-200" : "text-rose-200";

            return (
              <BodyCard key={code}>
                <h2 dir="rtl" className="mb-3 text-lg font-semibold">
                  {tr.currencySummary} - {code}
                </h2>
                <div dir="rtl" className="grid gap-3 md:grid-cols-4">
                  <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3">
                    <p className="text-xs text-slate-300">{tr.currentBalance}</p>
                    <p className="text-xl font-bold">{num(kpi.currentBalance)} {code}</p>
                  </article>
                  <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3">
                    <p className="text-xs text-slate-300">{tr.todayIncome}</p>
                    <p className="text-xl font-bold text-emerald-200">{num(kpi.todayIncome)} {code}</p>
                  </article>
                  <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3">
                    <p className="text-xs text-slate-300">{tr.todayOutflow}</p>
                    <p className="text-xl font-bold text-rose-200">{num(kpi.todayCashOut)} {code}</p>
                  </article>
                  <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3">
                    <p className="text-xs text-slate-300">{tr.todayNet}</p>
                    <p className={`text-xl font-bold ${todayNetClass}`}>{num(kpi.todayNet)} {code}</p>
                  </article>
                  <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3">
                    <p className="text-xs text-slate-300">{tr.periodRevenue}</p>
                    <p className="font-bold">{num(kpi.periodRevenue)} {code}</p>
                  </article>
                  <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3">
                    <p className="text-xs text-slate-300">{tr.periodCogs}</p>
                    <p className="font-bold">{num(kpi.periodCogs)} {code}</p>
                  </article>
                  <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3">
                    <p className="text-xs text-slate-300">{tr.periodProfit}</p>
                    <p className="font-bold">{num(kpi.periodGrossProfit)} {code}</p>
                  </article>
                  <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3">
                    <p className="text-xs text-slate-300">{tr.inventoryValue}</p>
                    <p className="font-bold">{num(kpi.currentInventoryValue)} {code}</p>
                  </article>
                  <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3">
                    <p className="text-xs text-slate-300">{tr.totalIn}</p>
                    <p className="font-bold">{num(kpi.cashIn)} {code}</p>
                  </article>
                  <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3">
                    <p className="text-xs text-slate-300">{tr.totalOut}</p>
                    <p className="font-bold">{num(kpi.cashOut)} {code}</p>
                  </article>
                  <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3">
                    <p className="text-xs text-slate-300">{tr.lowStock}</p>
                    <p className="font-bold text-rose-200">{kpi.lowStockCount}</p>
                  </article>
                </div>
              </BodyCard>
            );
          })
        : null}

      {!loading ? (
        <BodyCard>
          <h2 dir="rtl" className="mb-3 text-lg font-semibold">{tr.trendTitle}</h2>
          {currencyList.length === 0 ? (
            <p dir="rtl" className="text-slate-300">{tr.noTrend}</p>
          ) : (
            <div className="space-y-4">
              {currencyList.map((code) => {
                const points = (trendByCurrency[code] || []).sort((a, b) => a.date.localeCompare(b.date));
                const maxValue = Math.max(1, ...points.map((point) => point.totalIncome));
                return (
                  <article key={code} dir="rtl" className="rounded-xl border border-white/20 bg-white/[0.03] p-3">
                    <p className="mb-2 font-semibold">{code}</p>
                    <div className="h-36 overflow-x-auto">
                      <div className="flex h-full min-w-[680px] items-end gap-1">
                        {points.map((point) => {
                          const height = Math.max(4, Math.round((point.totalIncome / maxValue) * 100));
                          return (
                            <div key={`${code}-${point.date}`} className="group flex w-4 flex-col items-center justify-end">
                              <span className="invisible mb-1 rounded bg-black/80 px-1 py-0.5 text-[10px] text-yellow-100 group-hover:visible">
                                {num(point.totalIncome)}
                              </span>
                              <span
                                className="w-full rounded-t bg-gradient-to-t from-yellow-500 to-yellow-300"
                                style={{ height: `${height}%` }}
                                title={`${point.date} - ${num(point.totalIncome)} ${code}`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-300">
                      {points[0]?.date || "-"} {"\u2190"} {points[points.length - 1]?.date || "-"}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </BodyCard>
      ) : null}

      {!loading ? (
        <BodyCard>
          <h2 dir="rtl" className="mb-3 text-lg font-semibold">{tr.todayMovements}</h2>
          {report.todayTransactions.length === 0 ? (
            <p dir="rtl" className="text-slate-300">{tr.noTodayMovements}</p>
          ) : (
            <div className="overflow-x-auto">
              <table dir="rtl" className="min-w-full text-center text-sm">
                <thead className="bg-black/35">
                  <tr>
                    <th className="px-3 py-2">{tr.colTime}</th>
                    <th className="px-3 py-2">{tr.colType}</th>
                    <th className="px-3 py-2">{tr.colRef}</th>
                    <th className="px-3 py-2">{tr.colMethod}</th>
                    <th className="px-3 py-2">{tr.colDirection}</th>
                    <th className="px-3 py-2">{tr.colAmount}</th>
                    <th className="px-3 py-2">{tr.colNote}</th>
                  </tr>
                </thead>
                <tbody>
                  {report.todayTransactions.map((row) => {
                    const sign = row.signedAmount >= 0 ? "+" : "-";
                    const amountClass = row.direction === "in" ? "text-emerald-200" : "text-rose-200";
                    return (
                      <tr key={row.id} className="border-b border-white/10">
                        <td className="px-3 py-2">{new Date(row.createdAt).toLocaleString()}</td>
                        <td className="px-3 py-2">{txTypeLabel[row.type]}</td>
                        <td className="px-3 py-2">{row.referenceId}</td>
                        <td className="px-3 py-2">{row.method || "-"}</td>
                        <td className={`px-3 py-2 ${amountClass}`}>{directionLabel[row.direction]}</td>
                        <td className={`px-3 py-2 font-semibold ${amountClass}`}>
                          {sign}{num(Math.abs(row.signedAmount))} {row.currency}
                        </td>
                        <td className="px-3 py-2">{row.note || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </BodyCard>
      ) : null}

      {!loading ? (
        <BodyCard>
          <h2 dir="rtl" className="mb-3 text-lg font-semibold">{tr.monthlyTitle}</h2>
          {report.monthlySummary.length === 0 ? (
            <p dir="rtl" className="text-slate-300">{tr.noMonthly}</p>
          ) : (
            <div className="overflow-x-auto">
              <table dir="rtl" className="min-w-full text-center text-sm">
                <thead className="bg-black/35">
                  <tr>
                    <th className="px-3 py-2">{tr.month}</th>
                    <th className="px-3 py-2">{tr.currency}</th>
                    <th className="px-3 py-2">Cash In</th>
                    <th className="px-3 py-2">Cash Out</th>
                    <th className="px-3 py-2">{tr.revenue}</th>
                    <th className="px-3 py-2">COGS</th>
                    <th className="px-3 py-2">{tr.grossProfit}</th>
                  </tr>
                </thead>
                <tbody>
                  {report.monthlySummary.map((row) => (
                    <tr key={`${row.month}-${row.currency}`} className="border-b border-white/10">
                      <td className="px-3 py-2">{row.month}</td>
                      <td className="px-3 py-2">{row.currency}</td>
                      <td className="px-3 py-2">{num(row.cashIn)}</td>
                      <td className="px-3 py-2">{num(row.cashOut)}</td>
                      <td className="px-3 py-2">{num(row.revenue)}</td>
                      <td className="px-3 py-2">{num(row.cogs)}</td>
                      <td className="px-3 py-2 font-semibold">{num(row.grossProfit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </BodyCard>
      ) : null}
    </ScreenWrapper>
  );
}
