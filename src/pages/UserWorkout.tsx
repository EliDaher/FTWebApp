import { useNavigate } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import ScreenWrapper from "../components/ScreenWrapper";
import HeaderCard from "../components/UI/HeaderCard";

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function UserWorkout() {
  const {
    workout,
    loading,
    started,
    startWorkout,
    endWorkout,
    togglePause,
    paused,
    globalSeconds,
  } = useWorkout();
  const navigate = useNavigate();

  if (loading) return <div className="text-center mt-4">تحميل...</div>;
  if (!workout) return <div className="text-red-500">لا يوجد تمارين حاليا</div>;

  return (
    <ScreenWrapper>
    <div className="min-h-screen text-white flex flex-col pt-8">
      <HeaderCard>
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">{workout?.title}</h2>
          <p className="text-white/60">{workout?.description}</p>
        </div>

        {/* المؤقت العام */}
        <div className="flex justify-center items-center text-lg gap-4">
          <span>⏱️ {formatTime(globalSeconds)}</span>
          {started && (
            <button onClick={togglePause} className="bg-yellow-500 px-4 py-1 rounded-full">
              {paused ? "متابعة" : "إيقاف مؤقت"}
            </button>
          )}
        </div>
      </HeaderCard>

      {/* قائمة التمارين */}
      <div className="space-y-4">
        {workout?.exercises.map((exercise, idx) => (
          <div
            key={exercise.exerciseId}
            onClick={() => navigate(`/ExerciseDetails/${exercise.exerciseId}`)}
            dir="rtl"
            className="bg-gray-50/15 border p-4 rounded-xl shadow cursor-pointer"
          >
            <h3 className="font-bold text-lg">تمرين #{idx + 1}</h3>
            <p className="font-semibold">{exercise.exerciseName ? exercise.exerciseName : exercise.exerciseId}</p>
            {exercise.sets.map((s, i) => (
              <p key={i} className="text-white/60 mt-2">
                مجموعة {i + 1} - تكرارات: {s.reps} - راحة: {s.rest}ث
              </p>
            ))}
          </div>
        ))}
      </div>

      <button
        className="w-[90%] left-[5%] bg-blue-600 text-white py-3 rounded-xl font-bold fixed bottom-4"
        onClick={started ? endWorkout : startWorkout}
      >
        {started ? "إنهاء التمرين" : "بدء التمرين"}
      </button>
    </div>
  </ScreenWrapper>
  );
}
