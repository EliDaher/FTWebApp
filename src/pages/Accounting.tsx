import { useEffect, useMemo, useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import HeaderCard from "../components/UI/HeaderCard";
import BodyCard from "../components/UI/BodyCard";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { useAuth } from "../context/AuthContext";
import { Plan } from "../types/plans";
import { BillingSummaryRow, Payment } from "../types/accounting";
import getAllPlans from "../services/plans";
import {
  addPayment,
  createSubscription,
  deleteSubscription,
  getAllBillingSummary,
  getSubscriptionPayments,
  renewSubscription,
} from "../services/accounting";
import apiClient from "../lib/axios";

type UserLite = {
  username: string;
  fullname?: string;
};

export default function Accounting() {
  const { userType } = useAuth();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserLite[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [rows, setRows] = useState<BillingSummaryRow[]>([]);

  const [userFilter, setUserFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [overdueOnly, setOverdueOnly] = useState(false);

  const [assignUser, setAssignUser] = useState("");
  const [assignPlan, setAssignPlan] = useState("");
  const [assignCurrency, setAssignCurrency] = useState("SYP");

  const [paymentSubId, setPaymentSubId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentNote, setPaymentNote] = useState("");
  const [copyFeedback, setCopyFeedback] = useState<"" | "copied" | "failed">("");

  const [selectedPaymentsSub, setSelectedPaymentsSub] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [plansRes, billingRes, usersRes] = await Promise.all([
        getAllPlans(),
        getAllBillingSummary(),
        apiClient.get<{ usersData?: Record<string, UserLite> }>("/getAllUsers"),
      ]);

      const parsedPlans = Object.entries(plansRes ?? {}).map(([key, value]) => ({
        ...(value as Plan),
        key,
      }));
      setPlans(parsedPlans);
      setRows(billingRes || []);
      setUsers(Object.values(usersRes.data.usersData ?? {}));
    } catch (requestError) {
      console.error(requestError);
      setError("فشل تحميل بيانات المحاسبة.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userType === "admin") {
      void loadData();
    }
  }, [userType]);

  const flatCycles = useMemo(() => {
    const flattened = rows.flatMap((row) =>
      row.cycles.map((cycle) => ({
        ...cycle,
        fullname: row.fullname,
        username: row.username,
        walletBalance: row.walletBalance,
      }))
    );

    const today = new Date().toISOString().slice(0, 10);

    return flattened.filter((item) => {
      if (userFilter) {
        const haystack = `${item.username} ${item.fullname}`.toLowerCase();
        if (!haystack.includes(userFilter.toLowerCase())) return false;
      }

      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (planFilter !== "all" && item.planKey !== planFilter) return false;
      if (overdueOnly && !(item.endDate < today && item.status !== "paid" && item.status !== "overpaid")) {
        return false;
      }

      return true;
    });
  }, [rows, userFilter, statusFilter, planFilter, overdueOnly]);

  const submitNewSubscription = async () => {
    if (!assignUser || !assignPlan) return;
    await createSubscription({
      userId: assignUser,
      planKey: assignPlan,
      currency: assignCurrency,
    });
    await loadData();
  };

  const submitPayment = async () => {
    if (!paymentSubId || !paymentAmount || Number(paymentAmount) <= 0) return;
    await addPayment(paymentSubId, {
      amount: Number(paymentAmount),
      method: paymentMethod,
      note: paymentNote,
    });
    setPaymentAmount("");
    setPaymentNote("");
    await loadData();
  };

  const openPayments = async (subId: string) => {
    const response = await getSubscriptionPayments(subId);
    setSelectedPaymentsSub(subId);
    setPayments(response.payments);
  };

  const copySubscriptionId = async () => {
    const value = paymentSubId.trim();
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopyFeedback("copied");
    } catch (copyError) {
      console.error(copyError);
      setCopyFeedback("failed");
    }

    window.setTimeout(() => setCopyFeedback(""), 1800);
  };

  if (userType !== "admin") {
    return (
      <ScreenWrapper>
        <BodyCard>
          <p className="text-center text-rose-200">هذه الصفحة متاحة للمدير فقط.</p>
        </BodyCard>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <HeaderCard className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <h1 className="md:col-span-3 text-center text-2xl font-bold">المحاسبة</h1>
      </HeaderCard>

      {error ? (
        <BodyCard>
          <p className="text-center text-rose-200">{error}</p>
        </BodyCard>
      ) : null}

      <BodyCard>
        <div dir="rtl" className="grid gap-3 md:grid-cols-4">
          <Input name="user-filter" label="بحث مستخدم" value={userFilter} onChange={(e) => setUserFilter(e.target.value)} />
          <div>
            <label className="mb-2 mr-1 block text-sm font-semibold text-slate-100">الحالة</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 w-full rounded-xl border border-yellow-300/25 bg-black/35 px-3 text-yellow-50"
            >
              <option value="all">الكل</option>
              <option value="unpaid">غير مدفوع</option>
              <option value="partial">مدفوع جزئي</option>
              <option value="paid">مدفوع</option>
              <option value="overpaid">دفع زائد</option>
              <option value="closed">مغلق</option>
            </select>
          </div>
          <div>
            <label className="mb-2 mr-1 block text-sm font-semibold text-slate-100">الباقة</label>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="h-11 w-full rounded-xl border border-yellow-300/25 bg-black/35 px-3 text-yellow-50"
            >
              <option value="all">الكل</option>
              {plans.map((plan) => (
                <option key={plan.key} value={plan.key}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 self-end text-sm">
            <input type="checkbox" checked={overdueOnly} onChange={(e) => setOverdueOnly(e.target.checked)} />
            متأخر فقط
          </label>
        </div>
      </BodyCard>

      <BodyCard>
        <h2 dir="rtl" className="mb-3 text-lg font-semibold">إسناد اشتراك جديد</h2>
        <div dir="rtl" className="grid gap-3 md:grid-cols-4">
          <div>
            <label className="mb-2 mr-1 block text-sm font-semibold text-slate-100">المستخدم</label>
            <select
              value={assignUser}
              onChange={(e) => setAssignUser(e.target.value)}
              className="h-11 w-full rounded-xl border border-yellow-300/25 bg-black/35 px-3 text-yellow-50"
            >
              <option value="">اختر مستخدم</option>
              {users.map((user) => (
                <option key={user.username} value={user.username}>
                  {user.fullname || user.username}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 mr-1 block text-sm font-semibold text-slate-100">الباقة</label>
            <select
              value={assignPlan}
              onChange={(e) => setAssignPlan(e.target.value)}
              className="h-11 w-full rounded-xl border border-yellow-300/25 bg-black/35 px-3 text-yellow-50"
            >
              <option value="">اختر باقة</option>
              {plans.map((plan) => (
                <option key={plan.key} value={plan.key}>
                  {plan.name} - {plan.price} {plan.currency}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 mr-1 block text-sm font-semibold text-slate-100">العملة</label>
            <select
              value={assignCurrency}
              onChange={(e) => setAssignCurrency(e.target.value)}
              className="h-11 w-full rounded-xl border border-yellow-300/25 bg-black/35 px-3 text-yellow-50"
            >
              <option value="SYP">SYP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="TRY">TRY</option>
            </select>
          </div>
          <Button className="self-end" onClick={() => void submitNewSubscription()}>
            إنشاء اشتراك
          </Button>
        </div>
      </BodyCard>

      <BodyCard>
        <h2 dir="rtl" className="mb-3 text-lg font-semibold">إضافة دفعة</h2>
        <div dir="rtl" className="grid gap-3 md:grid-cols-5">
          <div className="grid grid-cols-[1fr_auto] items-end gap-2">
            <Input name="payment-sub-id" label="رقم الاشتراك" value={paymentSubId} onChange={(e) => setPaymentSubId(e.target.value)} className="mb-0" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mb-[2px] h-11 whitespace-nowrap"
              onClick={() => void copySubscriptionId()}
              disabled={!paymentSubId.trim()}
            >
              {copyFeedback === "copied" ? "تم النسخ" : copyFeedback === "failed" ? "فشل النسخ" : "نسخ"}
            </Button>
          </div>
          <Input name="payment-amount" label="المبلغ" type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
          <Input name="payment-method" label="الطريقة" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />
          <Input name="payment-note" label="ملاحظة" value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} />
          <Button className="self-end" onClick={() => void submitPayment()}>
            حفظ الدفعة
          </Button>
        </div>
      </BodyCard>

      <BodyCard>
        {loading ? <p className="soft-pulse py-8 text-center text-slate-300">جاري تحميل السجل...</p> : null}

        {!loading ? (
          <div className="overflow-x-auto">
            <table dir="rtl" className="min-w-full text-sm">
              <thead className="bg-black/35">
                <tr>
                  <th className="px-3 py-2">المستخدم</th>
                  <th className="px-3 py-2">الباقة</th>
                  <th className="px-3 py-2">الدورة</th>
                  <th className="px-3 py-2">المتوقع</th>
                  <th className="px-3 py-2">المدفوع</th>
                  <th className="px-3 py-2">المتبقي</th>
                  <th className="px-3 py-2">الرصيد</th>
                  <th className="px-3 py-2">الحالة</th>
                  <th className="px-3 py-2">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {flatCycles.map((cycle) => (
                  <tr key={cycle.id} className="border-b border-white/10">
                    <td className="px-3 py-2">{cycle.fullname || cycle.username}</td>
                    <td className="px-3 py-2">{cycle.planName}</td>
                    <td className="px-3 py-2">
                      {cycle.startDate} → {cycle.endDate}
                    </td>
                    <td className="px-3 py-2">
                      {cycle.expectedAmount} {cycle.currency}
                    </td>
                    <td className="px-3 py-2">
                      {cycle.amountPaid} {cycle.currency}
                    </td>
                    <td className="px-3 py-2">
                      {cycle.expectedAmount - cycle.amountPaid} {cycle.currency}
                    </td>
                    <td className="px-3 py-2">{cycle.walletBalance}</td>
                    <td className="px-3 py-2">{cycle.status}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => void openPayments(cycle.id)}>
                          الدفعات
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => void renewSubscription(cycle.id).then(loadData)}>
                          تجديد
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => void deleteSubscription(cycle.id).then(loadData)}>
                          حذف
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </BodyCard>

      {selectedPaymentsSub ? (
        <BodyCard>
          <h2 dir="rtl" className="mb-3 text-lg font-semibold">
            سجل دفعات الاشتراك: {selectedPaymentsSub}
          </h2>
          {payments.length === 0 ? (
            <p dir="rtl" className="text-slate-300">
              لا توجد دفعات.
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
