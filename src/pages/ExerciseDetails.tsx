import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Exercise } from "../types/exercise";

export default function ExerciseDetails() {
  const { exerciseName } = useParams();
  const navigate = useNavigate();
  const [exerciseData, setExerciseData] = useState<Exercise[]>([]);

  useEffect(() => {
    axios
      .get(`https://ftserver-ym6z.onrender.com/getExerciseByName`, {
        params: { name: exerciseName },
      })
      .then((response) => {
        const exerciseObject = response.data.exercise;
        setExerciseData([exerciseObject]);
        console.log(exerciseObject);
      })
      .catch((error) => {
        console.error("خطأ:", error.response?.data || error.message);
      });
  }, [exerciseName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white p-6 flex flex-col items-center">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 self-start bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition"
      >
        ← رجوع
      </button>

      {exerciseData.map((exercise, index) => (
        <div
          key={index}
          className="w-full max-w-3xl bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-700"
        >
          <div className="mb-6">
          <img
            src={exercise.imageUrl}
            alt={exercise.exerciseName}
            className="rounded-lg w-full max-h-72 h-72 object-contain mx-auto"
          />
          </div>

          <div className="space-y-4 text-sm sm:text-base" dir="rtl">
            <InfoRow label="اسم التمرين" value={exercise.exerciseName} />
            <InfoRow label="الجزء المستهدف" value={exercise.bodyPart} />
            <InfoRow label="الفئة" value={exercise.category} />
            <InfoRow label="الصعوبة" value={exercise.difficulty} />
            <InfoRow label="الوصف" value={exercise.description} />
            <InfoRow label="الأخطاء الشائعة" value={exercise.commonMistakes} />
          </div>
        </div>
      ))}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row">
      <span className="font-semibold text-gray-200 w-40">{label}:</span>
      <span className="text-gray-400">{value}</span>
    </div>
  );
}
