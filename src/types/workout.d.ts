export type WorkOutExercise = {
    exerciseId: string
    sets: {
      reps: number
      rest: number
    }[]
}

export type WorkOut = {
    id: string
    title: string
    description: string
    level: 'Beginner' | 'Intermediate' | 'Advanced'
    duration: number
    createdAt: string
    exercises: WorkOutExercise[]
}
  