import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addPayment, createSubscription, getSubscriptionsByUser, getUserBillingSummary } from "../services/accounting";
import getAllPlans from "../services/plans";
import type { BillingSummary, Subscription } from "../types/accounting";
import type { Plan } from "../types/plans";
import { User } from "../types/user";
import ScreenWrapper from "./ScreenWrapper";
import BodyCard from "./UI/BodyCard";
import Button from "./UI/Button";
import Input from "./UI/Input";
import UserNutritionForm from "./UserNutritionForm";
import UserWorkoutForm from "./UserWorkoutForm";

export default function UserDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userType } = useAuth();

  const [userData, setUserData] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [nutritionForm, setNutritionForm] = useState(false);

  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const [username, setUsername] = useState("");
  const [weight, setWeight] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [job, setJob] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [healthConditions, setHealthConditions] = useState("");

  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState("");
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);

  const [invoicePlan, setInvoicePlan] = useState("");
  const [invoiceCurrency, setInvoiceCurrency] = useState("SYP");
  const [invoiceSubmitting, setInvoiceSubmitting] = useState(false);

  const [paymentSubId, setPaymentSubId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentNote, setPaymentNote] = useState("");
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  const [financeMessage, setFinanceMessage] = useState("");

  const targetUsername = id || "";

  const getUserData = async () => {
    if (!targetUsername) return;

    try {
      const res = await axios.post("https://ftserver-ym6z.onrender.com/getUserData", { username: targetUsername });
      const user = res.data.userData;
      setUserData(user);
      setUsername(user.username || "");
      setPassword(user.password || "");
      setNumber(user.number || "");
      setFullname(user.fullname || "");
      setWeight(user.weight || 0);
      setHeight(user.height || 0);
      setJob(user.job || "");
      setBloodType(user.bloodType || "");
      setHealthConditions(user.healthConditions || "");
    } catch (error) {
      console.error("حدث خطأ أثناء جلب البيانات:", error);
    }
  };

  const loadFinancialData = async () => {
    if (userType !== "admin" || !targetUsername) return;

    try {
      setBillingLoading(true);
      setBillingError("");

      const [summaryRes, subsRes, plansRes] = await Promise.all([
        getUserBillingSummary(targetUsername),
        getSubscriptionsByUser(targetUsername),
        getAllPlans(),
      ]);

      const parsedPlans = Object.entries(plansRes ?? {}).map(([key, value]) => ({
        ...(value as Plan),
        key,
      }));

      setBillingSummary(summaryRes);
      setSubscriptions(subsRes.sort((a, b) => b.startDate.localeCompare(a.startDate)));
      setPlans(parsedPlans);
      if (!invoicePlan && parsedPlans.length > 0) {
        setInvoicePlan(parsedPlans[0].key);
      }
      if (!paymentSubId && subsRes.length > 0) {
        setPaymentSubId(subsRes[0].id);
      }
    } catch (requestError) {
      console.error(requestError);
      setBillingError("فشل تحميل البيانات المالية للمستخدم.");
    } finally {
      setBillingLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await axios.post("https://ftserver-ym6z.onrender.com/adminUpdateUserDetails", {
        username,
        fullname,
        password,
        job,
        bloodType,
        weight,
        height,
        healthConditions,
      });
      alert("تم حفظ البيانات بنجاح ✅");
      void getUserData();
    } catch (error) {
      console.error("خطأ أثناء الإرسال:", error);
      alert("فشل الإرسال ❌");
    }
  };

  const submitInvoice = async () => {
    if (!targetUsername || !invoicePlan) return;

    try {
      setInvoiceSubmitting(true);
      setFinanceMessage("");
      await createSubscription({
        userId: targetUsername,
        planKey: invoicePlan,
        currency: invoiceCurrency,
      });
      setFinanceMessage("تم إنشاء الفاتورة بنجاح.");
      await loadFinancialData();
    } catch (error) {
      console.error(error);
      setFinanceMessage("فشل إنشاء الفاتورة.");
    } finally {
      setInvoiceSubmitting(false);
    }
  };

  const submitPayment = async () => {
    if (!paymentSubId || !paymentAmount || Number(paymentAmount) <= 0) return;

    try {
      setPaymentSubmitting(true);
      setFinanceMessage("");
      await addPayment(paymentSubId, {
        amount: Number(paymentAmount),
        method: paymentMethod,
        note: paymentNote,
      });
      setPaymentAmount("");
      setPaymentNote("");
      setFinanceMessage("تمت إضافة الدفعة بنجاح.");
      await loadFinancialData();
    } catch (error) {
      console.error(error);
      setFinanceMessage("فشل إضافة الدفعة.");
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const deleteUsername = async () => {
    const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذا العنصر؟");
    if (!confirmDelete) {
      alert("تم الإلغاء");
      return;
    }

    try {
      await axios.post("https://ftserver-ym6z.onrender.com/deleteUsername", {
        username: targetUsername,
      });
      alert("تم حزف المستخدم ✅");
      navigate("/UsersPage");
    } catch (error) {
      console.error("خطأ أثناء الإرسال:", error);
      alert("فشل الإرسال ❌");
    }
  };

  useEffect(() => {
    void getUserData();
  }, [targetUsername]);

  useEffect(() => {
    void loadFinancialData();
  }, [targetUsername, userType]);

  return (
    <ScreenWrapper>
      <div className="min-h-screen p-4 text-white">
        <h1 className="mb-4 text-center text-3xl font-bold">معلومات المستخدم</h1>

        {showForm && <UserWorkoutForm setShowForm={setShowForm} username={id} />}
        {nutritionForm && (
          <UserNutritionForm setNutritionForm={setNutritionForm} username={id} userNutrition={userData?.nutrition ? userData.nutrition : []} />
        )}

        {userData ? (
          <BodyCard>
            <p className="text-center text-xl" dir="rtl">
              المستخدم: {username}
            </p>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <Input name="name" type="text" label="الاسم الكامل" value={fullname} onChange={(e) => setFullname(e.target.value)} className="col-span-2" />
              <Input name="password" type="text" label="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Input name="number" type="text" label="رقم الجوال" value={number} onChange={() => {}} />
              <Input name="job" type="text" label="الوظيفة" value={job} onChange={(e) => setJob(e.target.value)} />
              <Input name="blood" type="text" label="زمرة الدم" value={bloodType} onChange={(e) => setBloodType(e.target.value)} />
              <Input name="weight" type="number" label="الوزن" value={weight.toString()} onChange={(e) => setWeight(Number(e.target.value))} />
              <Input name="height" type="number" label="الطول" value={height.toString()} onChange={(e) => setHeight(Number(e.target.value))} />
              <Input
                name="health"
                label="الامراض"
                placeholder="الحالة الصحية"
                value={healthConditions}
                onChange={(e) => setHealthConditions(e.target.value)}
                className="col-span-2"
              />
              <button type="button" onClick={() => void deleteUsername()} className="col-span-1 rounded bg-red-600 py-2 text-white hover:bg-red-700">
                حذف المستخدم
              </button>
              <button type="submit" className="col-span-1 rounded bg-green-600 py-2 text-white hover:bg-green-700">
                حفظ التعديلات
              </button>
            </form>
          </BodyCard>
        ) : (
          <p className="mt-6 text-center">جاري تحميل البيانات...</p>
        )}

        {userType === "admin" ? (
          <BodyCard className="mt-6">
            <h2 dir="rtl" className="mb-4 text-xl font-semibold">
              التفاصيل المالية
            </h2>

            {billingError ? (
              <p dir="rtl" className="mb-3 text-sm text-rose-300">
                {billingError}
              </p>
            ) : null}

            {financeMessage ? (
              <p dir="rtl" className="mb-3 text-sm text-yellow-100">
                {financeMessage}
              </p>
            ) : null}

            {billingLoading ? (
              <p dir="rtl" className="soft-pulse py-4 text-slate-300">
                جاري تحميل البيانات المالية...
              </p>
            ) : (
              <div className="space-y-4">
                {billingSummary ? (
                  <div dir="rtl" className="grid gap-3 md:grid-cols-4">
                    <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3">
                      <p className="text-xs text-slate-300">الرصيد الحالي</p>
                      <p className="text-lg font-bold">{billingSummary.walletBalance}</p>
                    </article>
                    <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3">
                      <p className="text-xs text-slate-300">إجمالي المتوقع</p>
                      <p className="text-lg font-bold">{billingSummary.totalExpected}</p>
                    </article>
                    <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3">
                      <p className="text-xs text-slate-300">إجمالي المدفوع</p>
                      <p className="text-lg font-bold">{billingSummary.totalPaid}</p>
                    </article>
                    <article className="rounded-xl border border-white/20 bg-white/[0.04] p-3">
                      <p className="text-xs text-slate-300">إجمالي المتبقي</p>
                      <p className="text-lg font-bold">{billingSummary.totalRemaining}</p>
                    </article>
                  </div>
                ) : null}

                <div dir="rtl" className="grid gap-3 rounded-xl border border-white/20 bg-white/[0.03] p-4 md:grid-cols-4">
                  <div>
                    <label className="mb-2 mr-1 block text-sm font-semibold text-slate-100">الباقة</label>
                    <select
                      value={invoicePlan}
                      onChange={(e) => setInvoicePlan(e.target.value)}
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
                      value={invoiceCurrency}
                      onChange={(e) => setInvoiceCurrency(e.target.value)}
                      className="h-11 w-full rounded-xl border border-yellow-300/25 bg-black/35 px-3 text-yellow-50"
                    >
                      <option value="SYP">SYP</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="TRY">TRY</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 flex items-end">
                    <Button className="w-full" onClick={() => void submitInvoice()} loading={invoiceSubmitting} disabled={!invoicePlan}>
                      إنشاء فاتورة للمستخدم
                    </Button>
                  </div>
                </div>

                <div dir="rtl" className="grid gap-3 rounded-xl border border-white/20 bg-white/[0.03] p-4 md:grid-cols-5">
                  <div>
                    <label className="mb-2 mr-1 block text-sm font-semibold text-slate-100">رقم الاشتراك</label>
                    <select
                      value={paymentSubId}
                      onChange={(e) => setPaymentSubId(e.target.value)}
                      className="h-11 w-full rounded-xl border border-yellow-300/25 bg-black/35 px-3 text-yellow-50"
                    >
                      <option value="">اختر اشتراك</option>
                      {subscriptions.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.planName} - {sub.id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input name="payment-amount" label="المبلغ" type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
                  <Input name="payment-method" label="الطريقة" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <Input name="payment-note" label="ملاحظة" value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} />
                  <Button
                    className="self-end"
                    onClick={() => void submitPayment()}
                    loading={paymentSubmitting}
                    disabled={!paymentSubId || !paymentAmount || Number(paymentAmount) <= 0}
                  >
                    إضافة دفعة
                  </Button>
                </div>

                <div dir="rtl" className="space-y-2">
                  <h3 className="text-lg font-semibold">الاشتراكات</h3>
                  {subscriptions.length === 0 ? (
                    <p className="text-slate-300">لا يوجد اشتراكات لهذا المستخدم.</p>
                  ) : (
                    subscriptions.map((sub) => (
                      <article key={sub.id} className="rounded-xl border border-white/20 bg-white/[0.03] p-3">
                        <p className="font-semibold">{sub.planName}</p>
                        <p className="text-sm text-slate-300">
                          {sub.startDate} → {sub.endDate}
                        </p>
                        <p className="text-sm text-slate-300">
                          المتوقع {sub.expectedAmount} {sub.currency} | المدفوع {sub.amountPaid} {sub.currency}
                        </p>
                        <p className="text-xs text-slate-300">رقم الاشتراك: {sub.id}</p>
                        <p className="text-xs text-slate-300">الحالة: {sub.status}</p>
                      </article>
                    ))
                  )}
                </div>
              </div>
            )}
          </BodyCard>
        ) : null}

        <div className="flex flex-row-reverse gap-5">
          <button onClick={() => setShowForm(!showForm)} className="mt-6 self-end rounded-lg bg-yellow-500 px-4 py-2 text-black transition hover:bg-yellow-400">
            تعديل البرامج التدريبية
          </button>

          <button onClick={() => setNutritionForm(!nutritionForm)} className="mt-6 self-end rounded-lg bg-yellow-500 px-4 py-2 transition hover:bg-yellow-600">
            تعديل البرامج الغذائية
          </button>
        </div>
      </div>
    </ScreenWrapper>
  );
}

