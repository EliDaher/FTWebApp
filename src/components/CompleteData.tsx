import { FormEvent, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import Button from "./UI/Button";
import Input from "./UI/Input";

const HEALTH_SUGGESTIONS = [
  "سكري",
  "ضغط دم مرتفع",
  "ديسك",
  "مشاكل بالظهر",
  "تاريخ عائلي للسكري",
  "حساسية غلوتين",
];

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function calculateAge(dateValue: string): number {
  if (!dateValue) return 0;
  const birth = new Date(dateValue);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const hasNotHadBirthday =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());

  if (hasNotHadBirthday) age -= 1;
  return age;
}

export default function CompleteData() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [job, setJob] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [birthDate, setBirthDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCondition, setCustomCondition] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) setUsername(userId);
  }, [userId]);

  const age = useMemo(() => calculateAge(birthDate), [birthDate]);
  const isValidAge = age >= 8 && age < 120;

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((item) => item !== condition) : [...prev, condition]
    );
  };

  const addCustomCondition = () => {
    const normalized = customCondition.trim();
    if (!normalized) return;
    if (selectedConditions.some((item) => item.toLowerCase() === normalized.toLowerCase())) {
      setCustomCondition("");
      return;
    }

    setSelectedConditions((prev) => [...prev, normalized]);
    setCustomCondition("");
  };

  const removeCondition = (condition: string) => {
    setSelectedConditions((prev) => prev.filter((item) => item !== condition));
  };

  const validate = (): string | null => {
    if (!username.trim()) return "اسم المستخدم غير موجود.";
    if (!address.trim()) return "العنوان مطلوب.";
    if (!job.trim()) return "العمل مطلوب.";
    if (!isValidAge) return "العمر يجب أن يكون بين 8 و119 سنة.";
    if (!height || Number(height) <= 0) return "الطول يجب أن يكون أكبر من 0.";
    if (!weight || Number(weight) <= 0) return "الوزن يجب أن يكون أكبر من 0.";
    return null;
  };

  const clearData = () => {
    setAddress("");
    setJob("");
    setBloodType("");
    setHeight("");
    setWeight("");
    setSelectedConditions([]);
    setCustomCondition("");
    setShowCustomInput(false);
    setBirthDate(new Date().toISOString().split("T")[0]);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (loading) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await axios.post("https://ftserver-ym6z.onrender.com/updatePersonalDetails", {
        username,
        address: address.trim(),
        job: job.trim(),
        date: new Date(birthDate),
        bloodType: bloodType.trim(),
        healthConditions: selectedConditions.join(", "),
      });

      await Promise.all([
        axios.post("https://ftserver-ym6z.onrender.com/addWeight", {
          username,
          weight: Number(weight),
        }),
        axios.post("https://ftserver-ym6z.onrender.com/addHeight", {
          username,
          height: Number(height),
        }),
      ]);

      clearData();
      window.alert("تم حفظ البيانات بنجاح.");
      navigate("/login");
    } catch (requestError) {
      console.error("CompleteData submit failed:", requestError);
      setError("فشل حفظ البيانات. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 px-4 py-6 md:px-8">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-yellow-300/20 bg-black/35 p-5 text-white backdrop-blur md:p-7">
        <div className="mb-6 flex items-center justify-between gap-4">
          <BrandLogo showText={false} />
          <h1 className="text-right text-lg font-bold text-yellow-200 md:text-2xl">اكمل معلومات حسابك</h1>
        </div>

        {error ? (
          <div className="mb-5 rounded-xl border border-rose-300/40 bg-rose-900/20 px-3 py-2 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <form dir="rtl" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="اسم المستخدم"
            name="username"
            value={username}
            readOnly
            onChange={() => {}}
            className="md:col-span-2"
            helperText="هذا الحقل يأتي من بيانات الحساب."
          />

          <Input
            label="العنوان"
            name="address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="المدينة / المنطقة"
          />

          <Input
            label="العمل"
            name="job"
            value={job}
            onChange={(event) => setJob(event.target.value)}
            placeholder=""
          />

          <Input
            label="تاريخ الميلاد"
            name="birthDate"
            type="date"
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
            helperText={`العمر: ${age}`}
            error={isValidAge ? undefined : "الحد الأدنى للعمر هو 8 سنوات."}
          />

          <div dir="rtl" className="w-full">
            <label htmlFor="bloodType" className="mb-2 mr-1 block text-sm font-semibold text-slate-100">
              زمرة الدم
            </label>
            <select
              id="bloodType"
              name="bloodType"
              value={bloodType}
              onChange={(event) => setBloodType(event.target.value)}
              className="h-11 w-full rounded-xl border border-yellow-300/25 bg-black/35 px-3 text-yellow-50 hover:border-yellow-300/45"
            >
              <option value="">غير محدد</option>
              {BLOOD_TYPES.map((type) => (
                <option key={type} value={type} className="bg-zinc-900 text-yellow-100">
                  {type}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="الطول (cm)"
            name="height"
            type="number"
            value={height}
            onChange={(event) => setHeight(event.target.value)}
            min="1"
            inputMode="decimal"
          />

          <Input
            label="الوزن (kg)"
            name="weight"
            type="number"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            min="1"
            inputMode="decimal"
          />

          <div dir="rtl" className="md:col-span-2">
            <p className="mb-2 mr-1 text-sm font-semibold text-slate-100">شروط صحية</p>
            <div className="flex flex-wrap gap-2">
              {HEALTH_SUGGESTIONS.map((condition) => {
                const selected = selectedConditions.includes(condition);
                return (
                  <button
                    type="button"
                    key={condition}
                    onClick={() => toggleCondition(condition)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${selected ? "border-yellow-200/80 bg-yellow-400 text-black" : "border-yellow-300/35 bg-black/30 text-yellow-100 hover:bg-yellow-300/15"}`}
                  >
                    {condition}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setShowCustomInput((prev) => !prev)}
                className="rounded-full border border-yellow-300/35 bg-black/30 px-3 py-1.5 text-sm text-yellow-100 hover:bg-yellow-300/15"
              >
                {showCustomInput ? "إلغاء" : "إضافة حالة"}
              </button>
            </div>

            {showCustomInput ? (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={customCondition}
                  onChange={(event) => setCustomCondition(event.target.value)}
                  placeholder="اكتب الحالة الصحية..."
                  className="h-11 flex-1 rounded-xl border border-yellow-300/25 bg-black/35 px-3 text-yellow-50 placeholder:text-yellow-100/60 hover:border-yellow-300/45"
                />
                <Button type="button" onClick={addCustomCondition} variant="secondary">
                  إضافة
                </Button>
              </div>
            ) : null}

            {selectedConditions.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedConditions.map((condition) => (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => removeCondition(condition)}
                    className="rounded-full border border-yellow-200/70 bg-yellow-400 px-3 py-1 text-xs font-semibold text-black"
                    title="إزالة"
                  >
                    {condition} ×
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-300/80">لم يتم اختيار حالات صحية.</p>
            )}
          </div>

          <div className="col-span-2 mt-2 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={clearData}>
              إعادة تعيين
            </Button>
            <Button type="submit" loading={loading} className="w-full">
              حفظ البيانات
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
