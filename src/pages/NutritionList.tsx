import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NutritionCard from "../components/NutritionCard";
import ScreenWrapper from "../components/ScreenWrapper";
import HeaderCard from "../components/UI/HeaderCard";
import Button from "../components/UI/Button";
import { NutritionProgram } from "../types/Nutrition";
import apiClient from "../lib/axios";

type ServerResponse = {
  success: boolean;
  message: string;
  nutritionData: Record<string, NutritionProgram>;
};

type ProgramEntry = {
  id: string;
  data: NutritionProgram;
};

export default function NutritionList() {
  const [programs, setPrograms] = useState<ProgramEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get<ServerResponse>("/getAllNutritionPrograms");
        const entries = Object.entries(res.data.nutritionData ?? {}).map(([id, data]) => ({ id, data }));
        setPrograms(entries);
      } catch (error) {
        console.error("فشل تحميل البرامج الغذائية:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadPrograms();
  }, []);

  return (
    <ScreenWrapper>
      <HeaderCard className="grid grid-cols-1 items-center gap-3 md:grid-cols-3">
        <Button onClick={() => navigate("/AddNutritionProgram")} className="mx-auto w-full max-w-[230px]">
          إضافة برنامج غذائي
        </Button>
        <h1 className="text-center text-2xl font-bold text-white">البرامج الغذائية</h1>
        <div className="hidden md:block" />
      </HeaderCard>

      {loading ? <p className="soft-pulse py-8 text-center text-slate-300">جاري تحميل البرامج الغذائية...</p> : null}

      {!loading && programs.length === 0 ? (
        <p className="glass-surface px-4 py-12 text-center text-slate-300">لا توجد برامج غذائية متاحة.</p>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {programs.map((program) => (
          <NutritionCard key={program.id} program={program.data} id={program.id} />
        ))}
      </div>
    </ScreenWrapper>
  );
}
