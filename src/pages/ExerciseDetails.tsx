import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Exercise } from "../types/exercise";
import { useAuth } from "../context/AuthContext";

export default function ExerciseDetails() {

  const { userType } = useAuth()

  const { exerciseName } = useParams();
  const navigate = useNavigate();
  const [originalData, setOriginalData] = useState<Exercise | null>(null);
  const [editedData, setEditedData] = useState<Exercise | null>(null);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    axios
      .get(`https://ftserver-ym6z.onrender.com/getExerciseByName`, {
        params: { name: exerciseName },
      })
      .then((response) => {
        const exerciseObject = response.data.exercise;
        setOriginalData(exerciseObject);
        setEditedData(exerciseObject);
      })
      .catch((error) => {
        console.error("خطأ:", error.response?.data || error.message);
      });
  }, [exerciseName]);

  const handleChange = (field: keyof Exercise, value: string) => {
    if (!editedData) return;
    if (userType != "admin") {return}

    const updated = { ...editedData, [field]: value };
    setEditedData(updated);

    // التحقق من التعديل
    setIsModified(JSON.stringify(updated) !== JSON.stringify(originalData));
  };

  const handleSave = () => {
    if (!editedData || !editedData.exerciseName) return;
  
    console.log(editedData);
  
    axios
      .post(`https://ftserver-ym6z.onrender.com/updateExercise`, {
        name: editedData.exerciseName,
        editedData,
      })
      .then(() => {
        setOriginalData(editedData);
        setIsModified(false);
        alert("تم حفظ التعديلات بنجاح");
      })
      .catch((error) => {
        console.error("فشل في الحفظ:", error.response?.data || error.message);
      });
  };
  

  const handleDelete = () => {
    if (!editedData || !editedData.exerciseName) return;
  
    axios
      .post(`https://ftserver-ym6z.onrender.com/deleteExercise`, {
        name: editedData.exerciseName,
      })
      .then(() => {
        alert("تم الحذف بنجاح");
        navigate("/Exercises"); // تأكد من وجود المسار الصحيح هنا
      })
      .catch((error) => {
        console.error("فشل في الحذف:", error.response?.data || error.message);
      });
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white p-6 flex flex-col items-center">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 self-start bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition"
      >
        ← رجوع
      </button>

      {editedData && (
        <div className="w-full max-w-3xl bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-700">
          <div className="mb-6">
            <img
              src={editedData.imageUrl}
              alt={editedData.exerciseName}
              className="rounded-lg w-full max-h-72 h-72 object-contain mx-auto"
            />
          </div>

          <div className="space-y-4 text-sm sm:text-base" dir="rtl">
            <EditableRow
              label="اسم التمرين"
              value={editedData.exerciseName}
              onChange={(val) => handleChange("exerciseName", val)}
            />
            <EditableRow
              label="الجزء المستهدف"
              value={editedData.bodyPart}
              onChange={(val) => handleChange("bodyPart", val)}
            />
            <EditableRow
              label="الفئة"
              value={editedData.category}
              onChange={(val) => handleChange("category", val)}
            />
            <EditableRow
              label="الصعوبة"
              value={editedData.difficulty}
              onChange={(val) => handleChange("difficulty", val)}
            />
            <EditableRow
              label="الوصف"
              value={editedData.description}
              onChange={(val) => handleChange("description", val)}
              textarea
            />
            <EditableRow
              label="الأخطاء الشائعة"
              value={editedData.commonMistakes}
              onChange={(val) => handleChange("commonMistakes", val)}
              textarea
            />
          </div>

          {isModified && (
            <button
              onClick={handleSave}
              className={`${userType == `admin` ? `block` : `hidden`} mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition`}
            >
              حفظ التعديلات
            </button>
          )}
            <button
              onClick={handleDelete}
              className={`${userType == `admin` ? `block` : `hidden`} mt-6 mx-3 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition`}
            >
              حزف التمرين
            </button>
        </div>
      )}
    </div>
  );
}

function EditableRow({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  textarea?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-2">
      <label className="font-semibold text-gray-200 w-40">{label}:</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-gray-800 text-white p-2 rounded-md border border-gray-700 resize-y w-full"
          rows={3}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-gray-800 text-white p-2 rounded-md border border-gray-700 w-full"
        />
      )}
    </div>
  );
}
