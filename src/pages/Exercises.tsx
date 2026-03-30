import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScreenWrapper from "../components/ScreenWrapper";
import BodyCard from "../components/UI/BodyCard";
import HeaderCard from "../components/UI/HeaderCard";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import apiClient from "../lib/axios";
import { Exercise } from "../types/exercise";

type ExercisesProps = {
  setIsSelectin?: (value: boolean) => void;
  setSelectedId?: (id: string) => void;
  isSelecting?: boolean;
  setSelectedName?: (name: string) => void;
};

export default function Exercises({
  setIsSelectin,
  setSelectedId,
  isSelecting = false,
  setSelectedName,
}: ExercisesProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const itemsPerPage = 8;

  useEffect(() => {
    const getAllExercises = async () => {
      try {
        setLoading(true);
        const response = await apiClient.post<{ exercises?: Record<string, Exercise> }>("/getAllExercises");
        const exercisesArray = Object.values(response.data.exercises ?? {});
        setExercises(exercisesArray);
      } catch (error) {
        console.error("فشل في جلب التمارين:", error);
      } finally {
        setLoading(false);
      }
    };

    void getAllExercises();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(exercises.map((exercise) => exercise.bodyPart).filter(Boolean))),
    [exercises]
  );

  const filteredExercises = useMemo(() => {
    const byCategory =
      selectedCategory === "all"
        ? exercises
        : exercises.filter((exercise) => exercise.bodyPart === selectedCategory);

    return byCategory.filter((exercise) =>
      exercise.exerciseName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [exercises, searchTerm, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredExercises.length / itemsPerPage));

  const currentExercises = useMemo(() => {
    const indexOfLastExercise = currentPage * itemsPerPage;
    const indexOfFirstExercise = indexOfLastExercise - itemsPerPage;
    return filteredExercises.slice(indexOfFirstExercise, indexOfLastExercise);
  }, [currentPage, filteredExercises]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handleExerciseCardClick = (exercise: Exercise) => {
    if (!isSelecting) {
      navigate(`/ExerciseDetails/${exercise.id ?? exercise.exerciseName}`);
      return;
    }

    setSelectedId?.(exercise.id ?? exercise.exerciseName);
    setSelectedName?.(exercise.exerciseName);
    setIsSelectin?.(false);
  };

  return (
    <ScreenWrapper>
      <HeaderCard className="grid grid-cols-1 items-center gap-3 md:grid-cols-3" >
        {!isSelecting ? (
          <Button onClick={() => navigate("/AddExercise")} className="mx-auto w-full max-w-[220px]">
            إضافة تمرين
          </Button>
        ) : (
          <div className="hidden md:block" />
        )}

        <h1 className="text-center text-2xl font-bold">التمارين</h1>

        <div className="flex items-center justify-center px-2">
          <select
            value={selectedCategory}
            onChange={(event) => {
              setSelectedCategory(event.target.value);
              setCurrentPage(1);
            }}
            className="h-11 w-full rounded-xl border border-white/20 bg-slate-900/70 px-3 text-sm text-slate-100"
          >
            <option value="all">كل التصنيفات</option>
            {categories.map((category) => (
              <option className="bg-slate-900" key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </HeaderCard>

      <BodyCard>
        <Input
          name="exercise-search"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setCurrentPage(1);
          }}
          placeholder="ابحث عن تمرين..."
          className="mb-4"
        />

        {loading ? <p className="soft-pulse py-8 text-center text-slate-300">جاري تحميل التمارين...</p> : null}

        {!loading && filteredExercises.length === 0 ? (
          <p className="rounded-xl border border-white/15 bg-white/[0.03] px-4 py-10 text-center text-slate-300">
            لا توجد تمارين مطابقة لهذا الفلتر.
          </p>
        ) : null}

        <div dir="rtl" className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {currentExercises.map((exercise) => (
            <article
              onClick={() => handleExerciseCardClick(exercise)}
              key={exercise.id ?? exercise.exerciseName}
              className="cursor-pointer overflow-hidden rounded-2xl border border-white/20 bg-white/[0.04] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-yellow-300/45 hover:bg-white/[0.08]"
            >
              <img
                src={exercise.imageUrl}
                alt={exercise.exerciseName}
                className="h-48 w-full object-cover"
                loading="lazy"
              />
              <div className="space-y-1 p-4">
                <h2 className="text-lg font-semibold leading-tight">{exercise.exerciseName}</h2>
                <p className="text-sm text-slate-300/80">التصنيف: {exercise.category}</p>
                <p className="text-sm text-slate-300/80">العضلة: {exercise.bodyPart}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage((previous) => Math.max(previous - 1, 1))}
            disabled={currentPage === 1}
          >
            السابق
          </Button>

          <span className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-sm text-slate-200">
            صفحة {currentPage} من {totalPages}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage((previous) => Math.min(previous + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            التالي
          </Button>
        </div>
      </BodyCard>
    </ScreenWrapper>
  );
}
