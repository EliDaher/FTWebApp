import { useNavigate } from "react-router-dom";
import ScreenWrapper from "../components/ScreenWrapper";
import Button from "../components/UI/Button";
import BrandLogo from "../components/BrandLogo";

export default function Home() {
  const navigate = useNavigate();

  return (
    <ScreenWrapper>
      <section className="mx-auto flex min-h-[78vh] w-full max-w-5xl flex-col justify-center">
        <div dir="rtl" className="glass-surface-strong p-6 md:p-10">
          <BrandLogo className="mb-4" imageClassName="h-14 w-14" />

          <h1 className="font-Orbitron text-4xl font-black leading-tight text-white md:text-6xl">
            أقوى كل يوم
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200/85 md:text-lg">
            إدارة برامج المتدربين، متابعة خطط التمرين، وتنظيم البرامج الغذائية في تجربة واحدة سلسة.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => navigate("/UserWorkout")}>
              ابدأ التمرين
            </Button>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <article className="rounded-xl border border-white/15 bg-white/5 p-4">
              <p className="text-sm text-slate-300/70">البرامج</p>
              <p className="mt-1 text-2xl font-bold text-white">تدريب + تغذية</p>
            </article>
            <article className="rounded-xl border border-white/15 bg-white/5 p-4">
              <p className="text-sm text-slate-300/70">سير العمل</p>
              <p className="mt-1 text-2xl font-bold text-white">إجراءات إدارية سريعة</p>
            </article>
            <article className="rounded-xl border border-white/15 bg-white/5 p-4">
              <p className="text-sm text-slate-300/70">التجربة</p>
              <p className="mt-1 text-2xl font-bold text-white">واجهة نظيفة ومتجاوبة</p>
            </article>
          </div>
        </div>
      </section>
    </ScreenWrapper>
  );
}
