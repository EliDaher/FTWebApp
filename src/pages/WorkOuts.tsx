import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScreenWrapper from "../components/ScreenWrapper";
import HeaderCard from "../components/UI/HeaderCard";
import BodyCard from "../components/UI/BodyCard";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import apiClient from "../lib/axios";

type WorkoutProgram = {
  id: string;
  title: string;
  workouts: unknown[];
};

export default function WorkOuts() {
  const [workOuts, setWorkOuts] = useState<WorkoutProgram[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAllWorkOuts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ fullWorkouts?: Record<string, WorkoutProgram> }>("/getAllFullWorkout");
      const workOutArray = Object.values(response.data.fullWorkouts ?? {});
      setWorkOuts(workOutArray);
    } catch (error) {
      console.error("فشل جلب البرامج التدريبية:", error);
      setWorkOuts([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteFullWorkout = async (id: string) => {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف البرنامج التدريبي؟");
    if (!confirmDelete) return;

    try {
      await apiClient.delete(`/deleteFullWorkout/${id}`);
      await getAllWorkOuts();
    } catch (error) {
      console.error("فشل حذف البرنامج التدريبي:", error);
      alert("حدث خطأ أثناء حذف البرنامج.");
    }
  };

  useEffect(() => {
    void getAllWorkOuts();
  }, []);

  const filteredWorkOuts = useMemo(
    () => workOuts.filter((workout) => workout.title.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm, workOuts]
  );

  return (
    <ScreenWrapper>
      <HeaderCard className="grid grid-cols-1 items-center gap-3 md:grid-cols-3">
        <Button onClick={() => navigate("/AddWorkOut")} className="mx-auto w-full max-w-[240px]">
          إضافة برنامج تدريبي
        </Button>
        <h1 className="text-center text-2xl font-bold font-cairo md:text-3xl">البرامج التدريبية</h1>
        <div className="hidden md:block" />
      </HeaderCard>

      <BodyCard>
        <Input
          name="search"
          type="text"
          placeholder="ابحث عن برنامج تدريبي..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="mb-5"
        />

        {loading ? <p className="soft-pulse py-8 text-center text-slate-300">جاري تحميل البرامج...</p> : null}

        {!loading && filteredWorkOuts.length === 0 ? (
          <p className="rounded-xl border border-white/15 bg-white/[0.03] px-4 py-10 text-center text-slate-300">
            لا توجد برامج تدريبية.
          </p>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredWorkOuts.map((workout) => (
            <article
              dir="rtl"
              key={workout.id}
              className="flex items-start justify-between rounded-2xl border border-white/20 bg-white/[0.04] px-4 py-4 shadow-lg transition-all duration-300 hover:border-yellow-300/45 hover:bg-white/[0.08]"
            >
              <div>
                <h2 className="mb-2 text-xl font-semibold">{workout.title}</h2>
                <p className="text-sm text-slate-300/75">عدد الأيام: {workout.workouts.length}</p>
              </div>

              <Button
                variant="danger"
                size="sm"
                className="mt-1"
                onClick={() => {
                  void deleteFullWorkout(workout.id);
                }}
              >
                حذف
              </Button>
            </article>
          ))}
        </div>
      </BodyCard>
    </ScreenWrapper>
  );
}
