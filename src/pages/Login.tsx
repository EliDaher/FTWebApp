import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import ScreenWrapper from "../components/ScreenWrapper";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { useAuth } from "../context/AuthContext";
import apiClient from "../lib/axios";
import BrandLogo from "../components/BrandLogo";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);

      const response = await apiClient.post("/login", {
        username: username.trim(),
        password,
      });

      login(response.data.userData);
      navigate("/Home");
    } catch (requestError: unknown) {
      console.error("Login failed:", requestError);
      setError("اسم المستخدم أو كلمة المرور غير صحيحة.");
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
            تمرّن بذكاء.
            <br />
            واظب باستمرار.
          </h1>
          <p className="mt-4 max-w-md text-lg text-slate-200/80">
            ادخل إلى التمارين والخطط ومتابعة التقدم من لوحة واحدة.
          </p>
        </section>

        <section dir="rtl" className="glass-surface-strong p-6 md:p-8">
          <h2 className="font-Orbitron text-3xl font-bold text-white">مرحبًا بعودتك</h2>
          <p className="mt-1 text-sm text-slate-300/80">سجّل الدخول للمتابعة.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              name="username"
              label="اسم المستخدم"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="أدخل اسم المستخدم"
              required
            />

            <div className="w-full">
              <label htmlFor="password" className="mb-2 mr-1 block text-sm font-semibold text-slate-100">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="أدخل كلمة المرور"
                  required
                  className="h-11 w-full rounded-xl border border-yellow-300/25 bg-black/35 px-3 pl-20 text-yellow-50 placeholder:text-yellow-100/60 backdrop-blur-sm transition hover:border-yellow-300/45"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  aria-pressed={showPassword}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-lg border border-yellow-300/30 px-2 py-1 text-xs font-semibold text-yellow-100 transition hover:bg-yellow-300/15"
                >
                  {showPassword ?
                    <FaEyeSlash /> 
                    : <FaEye />
                  }
                </button>
              </div>
            </div>

            {error ? (
              <p className="rounded-lg border border-rose-300/50 bg-rose-500/15 px-3 py-2 text-sm text-rose-100">
                {error}
              </p>
            ) : null}

            <Button type="submit" loading={isSubmitting} className="w-full">
              تسجيل الدخول
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-300/85">
            مستخدم جديد؟{" "}
            <button
              type="button"
              onClick={() => navigate("/SignUP")}
              className="font-semibold text-yellow-300 underline decoration-yellow-300/70 underline-offset-4 hover:text-yellow-100"
            >
              إنشاء حساب
            </button>
          </p>
        </section>
      </div>
    </ScreenWrapper>
  );
}
