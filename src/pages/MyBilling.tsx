import { useEffect, useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import HeaderCard from "../components/UI/HeaderCard";
import BodyCard from "../components/UI/BodyCard";
import Button from "../components/UI/Button";
import { useAuth } from "../context/AuthContext";
import { BillingSummary, Payment, Subscription } from "../types/accounting";
import { getSubscriptionPayments, getSubscriptionsByUser, getUserBillingSummary } from "../services/accounting";

export default function MyBilling() {
  const { user } = useAuth();
  const username = (user?.username as string) || "";

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedSubId, setSelectedSubId] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    if (!username) return;
    try {
      setLoading(true);
      setError("");

      const [summaryRes, subsRes] = await Promise.all([
        getUserBillingSummary(username),
        getSubscriptionsByUser(username),
      ]);
      setSummary(summaryRes);
      setSubscriptions(subsRes.sort((a, b) => b.startDate.localeCompare(a.startDate)));
    } catch (requestError) {
      console.error(requestError);
      setError("فشل تحميل بيانات الفوترة.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [username]);

  const openPayments = async (subId: string) => {
    const response = await getSubscriptionPayments(subId);
    setSelectedSubId(subId);
    setPayments(response.payments);
  };

  return (
    <ScreenWrapper>
      <HeaderCard>
        <h1 className="text-center text-2xl font-bold">فواتيري</h1>
      </HeaderCard>

      {error ? (
        <BodyCard>
          <p className="text-center text-rose-200">{error}</p>
        </BodyCard>
      ) : null}

      {loading ? (
        <BodyCard>
          <p className="soft-pulse py-8 text-center text-slate-300">جاري تحميل الفوترة...</p>
        </BodyCard>
      ) : null}

      {!loading && summary ? (
        <BodyCard>
          <div dir="rtl" className="grid gap-3 md:grid-cols-4">
            <article className="rounded-xl border border-white/20 bg-white/[0.04] p-4">
              <p className="text-sm text-slate-300/80">الرصيد الحالي</p>
              <p className="text-xl font-bold">{summary.walletBalance}</p>
            </article>
            <article className="rounded-xl border border-white/20 bg-white/[0.04] p-4">
              <p className="text-sm text-slate-300/80">إجمالي المتوقع</p>
              <p className="text-xl font-bold">{summary.totalExpected}</p>
            </article>
            <article className="rounded-xl border border-white/20 bg-white/[0.04] p-4">
              <p className="text-sm text-slate-300/80">إجمالي المدفوع</p>
              <p className="text-xl font-bold">{summary.totalPaid}</p>
            </article>
            <article className="rounded-xl border border-white/20 bg-white/[0.04] p-4">
              <p className="text-sm text-slate-300/80">الدورة الحالية</p>
              <p className="text-sm font-bold">{summary.currentCycle?.planName || "-"}</p>
              <p className="text-xs text-slate-300">{summary.currentCycle?.endDate || "-"}</p>
            </article>
          </div>
        </BodyCard>
      ) : null}

      {!loading ? (
        <BodyCard>
          <h2 dir="rtl" className="mb-3 text-lg font-semibold">
            سجل الاشتراكات
          </h2>
          {subscriptions.length === 0 ? (
            <p dir="rtl" className="text-slate-300">
              لا يوجد اشتراكات.
            </p>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((sub) => (
                <article key={sub.id} dir="rtl" className="rounded-xl border border-white/20 bg-white/[0.04] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{sub.planName}</p>
                      <p className="text-sm text-slate-300">
                        {sub.startDate} → {sub.endDate}
                      </p>
                      <p className="text-sm text-slate-300">
                        {sub.expectedAmount} {sub.currency} / مدفوع {sub.amountPaid} {sub.currency}
                      </p>
                      <p className="text-sm text-slate-300">الحالة: {sub.status}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => void openPayments(sub.id)}>
                      عرض الدفعات
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </BodyCard>
      ) : null}

      {selectedSubId ? (
        <BodyCard>
          <h2 dir="rtl" className="mb-3 text-lg font-semibold">
            دفعات الاشتراك: {selectedSubId}
          </h2>
          {payments.length === 0 ? (
            <p dir="rtl" className="text-slate-300">
              لا توجد دفعات لهذا الاشتراك.
            </p>
          ) : (
            <div className="space-y-2">
              {payments.map((payment) => (
                <div key={payment.id} dir="rtl" className="rounded-xl border border-white/20 bg-white/[0.03] p-3">
                  <p>
                    {payment.amount} {payment.currency} - {payment.method}
                  </p>
                  <p className="text-xs text-slate-300">{payment.paymentDate}</p>
                  {payment.note ? <p className="text-xs text-slate-300">{payment.note}</p> : null}
                </div>
              ))}
            </div>
          )}
        </BodyCard>
      ) : null}
    </ScreenWrapper>
  );
}
