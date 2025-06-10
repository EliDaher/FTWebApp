import axios from "axios";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

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

type WorkoutContextType = {
  workout: WorkoutType | null;
  loading: boolean;
  started: boolean;
  tick: number;
  startWorkout: () => void;
  endWorkout: () => void;
  togglePause: () => void;
  paused: boolean;
  globalSeconds: number;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const useWorkout = () => {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error("WorkoutProvider missing");
  return ctx;
};

export const WorkoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [workout, setWorkout] = useState<WorkoutType | null>(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const [globalSeconds, setGlobalSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const getWorkout = async () => {
    try {
      const user = localStorage.getItem("user") || "";
      const JSONUser = JSON.parse(user);
      console.log(JSONUser.username);
    
      const res = await axios.post("https://ftserver-ym6z.onrender.com/getUserWorkout", {
        username: JSONUser.username,
      });
    
      const data = res.data;
      console.log("Workout data from server:", data);
    
      setWorkout(data.workout); // تأكد أن اسم المفتاح مطابق لما في السيرفر
    } catch (err) {
      console.error("Error getting workout:", err);
    } finally {
      setLoading(false);
    }
  };


  const startWorkout = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStarted(true);
    setPaused(false);
    intervalRef.current = setInterval(() => {
      setGlobalSeconds((prev) => prev + 1);
      setTick((t) => t + 1);
    }, 1000);
  };

  const endWorkout = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStarted(false);
    setPaused(false);
    setGlobalSeconds(0);
    setTick(0);
  };

  const togglePause = () => {
    setPaused((p) => {
      const next = !p;
      if (next) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        intervalRef.current = setInterval(() => {
          setGlobalSeconds((prev) => prev + 1);
          setTick((t) => t + 1);
        }, 1000);
      }
      return next;
    });
  };

  useEffect(() => {
    getWorkout();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <WorkoutContext.Provider
      value={{
        workout,
        loading,
        started,
        startWorkout,
        endWorkout,
        tick,
        togglePause,
        paused,
        globalSeconds,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};
