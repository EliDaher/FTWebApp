import { useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import BodyCard from "../components/UI/BodyCard";
import HeaderCard from "../components/UI/HeaderCard";
import PopupForm from "../components/UI/PopupForm";
import { createPlan } from "../services/plans";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import PlansList from "../components/plans/PlansList";

export default function Plans() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("SYP");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addPlan = async () => {
    try {
      setIsSubmitting(true);
      const res = await createPlan({ key, name, duration, price, description, currency });

      if (res?.message) {
        setIsPopupOpen(false);
        window.location.reload();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper>
      <PopupForm isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} title="إنشاء أو تعديل باقة">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void addPlan();
          }}
          className="space-y-3"
        >
          <Input
            label="رمز الباقة"
            value={key}
            onChange={(event) => setKey(event.target.value)}
            name="plan-code"
            type="text"
            placeholder="مثال: M1"
            required
          />

          <Input
            label="اسم الباقة"
            value={name}
            onChange={(event) => setName(event.target.value)}
            name="plan-name"
            type="text"
            placeholder="مثال: 30 يوم"
            required
          />

          <Input
            label="المدة (بالأيام)"
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
            name="plan-duration"
            type="number"
            placeholder="عدد الأيام"
            required
          />

          <Input
            label="السعر"
            value={price}
            onChange={(event) => setPrice(Number(event.target.value))}
            name="plan-price"
            type="number"
            placeholder="سعر الباقة"
            required
          />

          <div dir="rtl">
            <label htmlFor="currency" className="mb-2 mr-1 block text-sm font-semibold text-slate-100">
              العملة
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              className="h-11 w-full rounded-xl border border-yellow-300/25 bg-black/35 px-3 text-yellow-50 hover:border-yellow-300/45"
            >
              <option value="SYP">SYP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="TRY">TRY</option>
            </select>
          </div>

          <Input
            label="الوصف"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            name="plan-description"
            type="text"
            placeholder="وصف مختصر للباقة"
          />

          <Button type="submit" loading={isSubmitting} className="w-full">
            حفظ الباقة
          </Button>
        </form>
      </PopupForm>

      <HeaderCard className="grid grid-cols-1 items-center gap-3 md:grid-cols-3">
        <Button variant="primary" onClick={() => setIsPopupOpen(true)} className="mx-auto w-full max-w-[230px]">
          إضافة باقة اشتراك
        </Button>
        <h1 className="my-1 text-center text-2xl font-bold">باقات الاشتراك</h1>
        <div className="hidden md:block" />
      </HeaderCard>

      <BodyCard>
        <PlansList
          setIsPopupOpen={setIsPopupOpen}
          setDescription={setDescription}
          setPrice={setPrice}
          setDuration={setDuration}
          setName={setName}
          setKey={setKey}
          setCurrency={setCurrency}
        />
      </BodyCard>
    </ScreenWrapper>
  );
}
