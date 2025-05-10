import axios from 'axios';
import { useEffect, useState, useRef } from 'react';

type SetType = {
  reps: number;
  rest: number;
};

type ExerciseType = {
  exerciseId: string;
  sets: SetType[];
};

type WorkoutType = {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: number;
  createdAt: string;
  exercises: ExerciseType[];
};

export default function UserWorkout() {


  const [workout, setWorkout] = useState<WorkoutType | null>(null);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [tick, setTick] = useState(0);

  const intervalRef = useRef<number | null>(null);
  const exerciseTimersRef = useRef<{ [key: string]: number }>({});
  const pausedExercisesRef = useRef<{ [key: string]: boolean }>({});
  const globalTimerRef = useRef<number>(0);

  const getWorkout = async () => {
    try {
      console.log('hi')
      setLoading(true);
      setError(false);
      const user = localStorage.getItem('user') || '';
      
      const JSONUser = JSON.parse(user)
      const res = await axios.post('https://ftserver-ym6z.onrender.com/getUserWorkout', { username: JSONUser.username });
      const workoutData: WorkoutType = res.data.workout;
      setWorkout(workoutData);

      const timers: { [key: string]: number } = {};
      const paused: { [key: string]: boolean } = {};
      workoutData.exercises.forEach((ex) => {
        timers[ex.exerciseId] = 0;
        paused[ex.exerciseId] = false;
      });

      exerciseTimersRef.current = timers;
      pausedExercisesRef.current = paused;
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startWorkout = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStarted(true);
    intervalRef.current = setInterval(() => {
      globalTimerRef.current += 1;

      const timers = { ...exerciseTimersRef.current };
      Object.keys(timers).forEach((key) => {
        if (!pausedExercisesRef.current[key]) {
          timers[key] += 1;
        }
      });

      exerciseTimersRef.current = timers;
      setTick((t) => t + 1);
    }, 1000);
  };

  const endWorkout = async () => {

    const user = localStorage.getItem('user') || '';
    
    const JSONUser = JSON.parse(user)

    await axios.post('https://ftserver-ym6z.onrender.com/getUserWorkout', { username: JSONUser.username });
    console.log(tick)
    setStarted(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    globalTimerRef.current = 0;
    const timers = exerciseTimersRef.current;
    Object.keys(timers).forEach((key) => {
      timers[key] = 0;
    });

    exerciseTimersRef.current = timers;
    setTick((t) => t + 1);
  };

  const toggleExerciseTimer = (exerciseId: string) => {
    pausedExercisesRef.current[exerciseId] = !pausedExercisesRef.current[exerciseId];
    setTick((t) => t + 1);
  };

  useEffect(() => {
    getWorkout();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (loading) return <div className="text-center mt-4">تحميل...</div>;
  if (error) return <div className="text-red-500">حدث خطأ! حاول مجددًا.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col px-3">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">{workout?.title}</h2>
        <p className="text-gray-600">{workout?.description}</p>
      </div>

      {/* المؤقت العام */}
      <div className="flex justify-center items-center mb-4 text-lg">
        <span className="mr-2">⏱️</span>
        <span>{formatTime(globalTimerRef.current)}</span>
      </div>

      {/* قائمة التمارين */}
      <div className="space-y-4">
        {workout?.exercises.map((exercise, idx) => (
          <div dir='rtl' key={exercise.exerciseId} className="bg-gray-100/10 p-4 rounded-xl shadow">
            <h3 className="font-bold text-lg">تمرين #{idx + 1}</h3>
            <p className="font-semibold">{exercise.exerciseId}</p>
            {exercise.sets.map((s, i) => (
              <p key={i} className="text-white/60 mt-2">
                مجموعة {i + 1} - تكرارات: {s.reps} - راحة: {s.rest}ث
              </p>
            ))}
            <div className="flex justify-between items-center mt-3">
              <span className="text-lg">المؤقت: {formatTime(exerciseTimersRef.current[exercise.exerciseId] || 0)}</span>
              <button
                onClick={() => toggleExerciseTimer(exercise.exerciseId)}
                className="bg-yellow-400 px-4 py-1 rounded-full font-bold"
              >
                {pausedExercisesRef.current[exercise.exerciseId] ? 'تشغيل' : 'إيقاف'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* زر بدء / إنهاء التمرين */}
      <button
        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold"
        onClick={started ? endWorkout : startWorkout}
      >
        {started ? 'إنهاء التمرين' : 'بدء التمرين'}
      </button>
    </div>
  );
}
