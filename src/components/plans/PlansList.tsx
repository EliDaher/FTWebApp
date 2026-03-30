import { useEffect, useState } from "react";
import getAllPlans, { deletePlan } from "../../services/plans";
import { Plan } from "../../types/plans";
import Button from "../UI/Button";

type PlansListProps = {
  setIsPopupOpen: (value: boolean) => void;
  setDescription: (value: string) => void;
  setPrice: (value: number) => void;
  setDuration: (value: number) => void;
  setName: (value: string) => void;
  setKey: (value: string) => void;
  setCurrency: (value: string) => void;
};

export default function PlansList({
  setIsPopupOpen,
  setDescription,
  setPrice,
  setDuration,
  setName,
  setKey,
  setCurrency,
}: PlansListProps) {
  const [plansData, setPlansData] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const getPlans = async () => {
    setLoading(true);

    const res = await getAllPlans();
    if (res) {
      const tempRes = Object.entries(res).map(([entryKey, value]) => {
        if (typeof value === "object" && value !== null) {
          return { key: entryKey, ...value };
        }

        return { key: entryKey, value };
      }) as Plan[];

      setPlansData(tempRes);
    }

    setLoading(false);
  };

  useEffect(() => {
    void getPlans();
  }, []);

  const deleteThePlan = async (planKey: string) => {
    if (!window.confirm(`هل تريد حذف الباقة ${planKey}؟`)) return;

    try {
      const res = await deletePlan({ key: planKey });
      if (res && !res.error) {
        await getPlans();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2 className="soft-pulse py-8 text-center text-slate-300">جاري تحميل الباقات...</h2>;
  }

  if (plansData.length === 0) {
    return <div className="py-8 text-center text-slate-300">لا توجد باقات اشتراك متاحة.</div>;
  }

  return (
    <div className="space-y-3">
      {plansData.map((plan) => (
        <article dir="rtl" key={plan.key} className="rounded-xl border border-white/20 bg-white/[0.04] p-4">
          <h2 className="text-center text-lg font-semibold">
            {plan.name} / <span className="text-white/70">{plan.key}</span>
          </h2>
          <p>السعر: {plan.price}</p>
          <p>العملة: {plan.currency || "SYP"}</p>
          <p>المدة: {plan.duration} يوم</p>
          <p>الوصف: {plan.description}</p>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsPopupOpen(true);
                setDescription(plan.description);
                setPrice(plan.price);
                setDuration(plan.duration);
                setName(plan.name);
                setKey(plan.key);
                setCurrency(plan.currency || "SYP");
              }}
            >
              تعديل
            </Button>

            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                void deleteThePlan(plan.key);
              }}
            >
              حذف
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
