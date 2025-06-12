export type WorkOutExercise = {
    exerciseId: string
    exerciseName?: string
    sets: {
      reps: number
      rest: number
    }[]
}

export type WorkOut = {
    id: string
    title: string
    description: string
    category?: string
    createdAt: string
    exercises: WorkOutExercise[]
}


export type FullWorkout = {
  id: string;
  title: string;
  workouts: {
    workoutName: string;
    workoutIndex: number;
    workout: WorkOut;
  }[]; 
}
  