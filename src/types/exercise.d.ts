export interface Exercise {
    exerciseName: string;
    category: string;
    bodyPart: string;
    difficulty: 'سهل' | 'متوسط' | 'صعب';
    description: string;
    commonMistakes: string;
    imageUrl: string;
}
  