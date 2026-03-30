import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getStoredAuthUser } from "../lib/authStorage";
import apiClient from "../lib/axios";

type SetType = {
  reps: number;
  rest: number;
};

type ExerciseType = {
  exerciseId: string;
  exerciseName: string;
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

type WorkoutResponse = {
  workout?: WorkoutType | null;
};

type WorkoutContextType = {
  workout: WorkoutType | null;
  loading: boolean;
  started: boolean;
  paused: boolean;
  globalSeconds: number;
  startWorkout: () => void;
  endWorkout: () => void;
  togglePause: () => void;
  refreshWorkout: () => Promise<void>;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const useWorkout = (): WorkoutContextType => {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error("WorkoutProvider missing");
  return ctx;
};

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workout, setWorkout] = useState<WorkoutType | null>(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [globalSeconds, setGlobalSeconds] = useState(0);

  const fetchedOnMountRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof window.setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const runTimer = useCallback(() => {
    clearTimer();
    intervalRef.current = window.setInterval(() => {
      setGlobalSeconds((prev) => prev + 1);
    }, 1000);
  }, [clearTimer]);

  const refreshWorkout = useCallback(async () => {
    setLoading(true);

    try {
      const storedUser = getStoredAuthUser();
      const username = storedUser?.username;

      if (typeof username !== "string" || !username.trim()) {
        setWorkout(null);
        return;
      }

      const res = await apiClient.post<WorkoutResponse>("/getUserWorkout", {
        username,
      });

      setWorkout(res.data?.workout ?? null);
    } catch (err) {
      console.error("Error getting workout:", err);
      setWorkout(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const startWorkout = useCallback(() => {
    setStarted(true);
    setPaused(false);
    runTimer();
  }, [runTimer]);

  const endWorkout = useCallback(() => {
    clearTimer();
    setStarted(false);
    setPaused(false);
    setGlobalSeconds(0);
  }, [clearTimer]);

  const togglePause = useCallback(() => {
    setPaused((prevPaused) => {
      const nextPaused = !prevPaused;

      if (nextPaused) {
        clearTimer();
      } else if (started) {
        runTimer();
      }

      return nextPaused;
    });
  }, [clearTimer, runTimer, started]);

  useEffect(() => {
    if (!fetchedOnMountRef.current) {
      fetchedOnMountRef.current = true;
      void refreshWorkout();
    }

    return clearTimer;
  }, [clearTimer, refreshWorkout]);

  const value = useMemo(
    () => ({
      workout,
      loading,
      started,
      paused,
      globalSeconds,
      startWorkout,
      endWorkout,
      togglePause,
      refreshWorkout,
    }),
    [
      workout,
      loading,
      started,
      paused,
      globalSeconds,
      startWorkout,
      endWorkout,
      togglePause,
      refreshWorkout,
    ]
  );

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
};
