import { useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import ScreenWrapper from "../components/ScreenWrapper";
import BodyCard from "../components/UI/BodyCard";
import Button from "../components/UI/Button";
import HeaderCard from "../components/UI/HeaderCard";
import { useWorkout } from "../context/WorkoutContext";

const formatTime = (seconds: number) => {
  if (Number.isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export default function UserWorkout() {
  const { workout, loading, started, startWorkout, endWorkout, togglePause, paused, globalSeconds } = useWorkout();
  const navigate = useNavigate();

  if (loading) {
    return (
      <ScreenWrapper>
        <div className="soft-pulse py-8 text-center text-slate-300">جاري تحميل التمرين...</div>
      </ScreenWrapper>
    );
  }

  if (!workout) {
    return (
      <ScreenWrapper>
        <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center">
          <BodyCard className="w-full p-6 md:p-10">
            <div className="mx-auto max-w-2xl text-center">
              <BrandLogo className="mb-5 justify-center" imageClassName="h-14 w-14" showText={false} />
              <p className="mx-auto mb-3 w-fit rounded-full border border-yellow-300/35 bg-yellow-300/10 px-4 py-1 text-xs font-semibold tracking-[0.12em] text-yellow-200">
                لا يوجد تمرين نشط
              </p>
              <h1 className="font-Orbitron text-3xl font-black text-white md:text-4xl">
                لم يتم تعيين برنامج تدريبي لك بعد
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300/85 md:text-base">
                لا يوجد لديك حاليًا برنامج تدريبي فعّال. يمكنك تصفح التمارين أو العودة للرئيسية.
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Button variant="ghost" size="lg" onClick={() => navigate("/Home")}>
                  العودة للرئيسية
                </Button>
              </div>
            </div>
          </BodyCard>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <div className="min-h-screen text-white flex flex-col pt-8">
        <HeaderCard>
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">{workout.title}</h2>
            <p className="text-white/60">{workout.description}</p>
          </div>

          <div className="flex justify-center items-center text-lg gap-4">
            <span>المؤقت {formatTime(globalSeconds)}</span>
            {started ? (
              <button onClick={togglePause} className="bg-yellow-500 px-4 py-1 rounded-full text-black font-semibold">
                {paused ? "متابعة" : "إيقاف مؤقت"}
              </button>
            ) : null}
          </div>
        </HeaderCard>

        <div className="space-y-4">
          {workout.exercises.map((exercise, idx) => (
            <div
              key={exercise.exerciseId}
              onClick={() => navigate(`/ExerciseDetails/${exercise.exerciseId}`)}
              dir="rtl"
              className="bg-gray-50/15 border p-4 rounded-xl shadow cursor-pointer"
            >
              <h3 className="font-bold text-lg">تمرين #{idx + 1}</h3>
              <p className="font-semibold">{exercise.exerciseName ? exercise.exerciseName : exercise.exerciseId}</p>
              {exercise.sets.map((setItem, i) => (
                <p key={i} className="text-white/60 mt-2">
                  المجموعة {i + 1} - تكرارات: {setItem.reps} - راحة: {setItem.rest}ث
                </p>
              ))}
            </div>
          ))}
        </div>

        <button
          className="w-[90%] left-[5%] bg-yellow-500 text-black py-3 rounded-xl font-bold fixed bottom-4 hover:bg-yellow-400"
          onClick={started ? endWorkout : startWorkout}
        >
          {started ? "إنهاء التمرين" : "بدء التمرين"}
        </button>
      </div>
    </ScreenWrapper>
  );
}
