import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import ScreenWrapper from "../components/ScreenWrapper";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import apiClient from "../lib/axios";
import BrandLogo from "../components/BrandLogo";

const convertToEnglishNumbers = (text: string) =>
  text.replace(/[\u0660-\u0669]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0x0660 + 48));

export default function SignUp() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPass) {
      setError("تأكيد كلمة المرور غير متطابق.");
      return;
    }

    if (!fullName.trim()) {
      setError("يرجى إدخال الاسم الكامل.");
      return;
    }

    try {
      setIsSubmitting(true);

      const finalUsername = username.trim() || fullName.trim();

      await apiClient.post("/SignUp", {
        username: finalUsername,
        password,
        fullname: fullName.trim(),
        number: number.trim(),
      });

      navigate(`/CompleteData/${finalUsername}`);
    } catch (requestError: unknown) {
      const serverMessage =
        typeof requestError === "object" &&
        requestError !== null &&
        "response" in requestError &&
        typeof (requestError as { response?: { data?: { error?: unknown } } }).response?.data?.error ===
          "string"
          ? ((requestError as { response?: { data?: { error?: string } } }).response?.data?.error ?? "")
          : "";
      if (typeof serverMessage === "string" && serverMessage.toLowerCase().includes("username")) {
        setError("اسم المستخدم موجود مسبقًا.");
      } else {
        setError("يرجى التحقق من البيانات والمحاولة مرة أخرى.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper>
      <div className="mx-auto grid min-h-[80vh] w-full max-w-5xl items-center gap-8 md:grid-cols-[1.2fr_1fr]">
        <section dir="rtl" className="hidden md:block">
          <BrandLogo className="mb-5" imageClassName="h-16 w-16" />
          <h1 className="font-Orbitron text-5xl font-black leading-tight text-white">
            ابنِ
            <br />
            روتينك الرياضي
          </h1>
          <p className="mt-4 max-w-md text-lg text-slate-200/80">
            أنشئ حسابك للوصول إلى الخطط المخصصة والتمارين وتتبع التغذية.
          </p>
        </section>

        <section dir="rtl" className="glass-surface-strong p-6 md:p-8">
          <h2 className="font-Orbitron text-3xl font-bold text-white">إنشاء حساب</h2>
          <p className="mt-1 text-sm text-slate-300/80">أدخل بياناتك التالية.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              name="full-name"
              label="الاسم الكامل"
              value={fullName}
              onChange={(event) => {
                const value = event.target.value;
                setFullName(value);
                if (!username) {
                  setUsername(value);
                }
              }}
              placeholder="اسمك الكامل"
              required
            />

            <Input
              name="username"
              label="اسم المستخدم"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="اختر اسم المستخدم"
              required
            />

            <Input
              name="phone"
              type="tel"
              label="رقم الهاتف"
              value={number}
              onChange={(event) => setNumber(convertToEnglishNumbers(event.target.value))}
              placeholder="09xxxxxxxx"
              required
            />

            <Input
              name="password"
              type="password"
              label="كلمة المرور"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="أدخل كلمة المرور"
              required
            />

            <Input
              name="confirm-password"
              type="password"
              label="تأكيد كلمة المرور"
              value={confirmPass}
              onChange={(event) => setConfirmPass(event.target.value)}
              placeholder="أعد كتابة كلمة المرور"
              required
            />

            {error ? (
              <p className="rounded-lg border border-rose-300/50 bg-rose-500/15 px-3 py-2 text-sm text-rose-100">
                {error}
              </p>
            ) : null}

            <Button type="submit" loading={isSubmitting} className="w-full">
              إنشاء حساب
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-300/85">
            لديك حساب بالفعل؟{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-yellow-300 underline decoration-yellow-300/70 underline-offset-4 hover:text-yellow-100"
            >
              تسجيل الدخول
            </button>
          </p>
        </section>
      </div>
    </ScreenWrapper>
  );
}
