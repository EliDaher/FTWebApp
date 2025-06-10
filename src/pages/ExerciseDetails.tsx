import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Exercise } from "../types/exercise";
import { useAuth } from "../context/AuthContext";
import ScreenWrapper from "../components/ScreenWrapper";
import HeaderCard from "../components/UI/HeaderCard";
import BodyCard from "../components/UI/BodyCard";
import Input from "../components/UI/Input";

export default function ExerciseDetails() {
  const { userType } = useAuth();
  const { exerciseName } = useParams();
  const navigate = useNavigate();

  const [originalData, setOriginalData] = useState<Exercise | null>(null);
  const [editedData, setEditedData] = useState<Exercise | null>(null);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    axios
      .get("https://ftserver-ym6z.onrender.com/getExerciseByName", {
        params: { name: exerciseName },
      })
      .then((res) => {
        const data = res.data.exercise;
        setOriginalData(data);
        setEditedData(data);
      })
      .catch((err) => {
        console.error("خطأ:", err.response?.data || err.message);
      });
  }, [exerciseName]);

  const handleChange = (field: keyof Exercise, value: string) => {
    if (!editedData || userType !== "admin") return;

    const updated = { ...editedData, [field]: value };
    setEditedData(updated);
    setIsModified(JSON.stringify(updated) !== JSON.stringify(originalData));
  };

  const handleSave = () => {
    if (!editedData || !editedData.exerciseName) return;

    axios
      .post("https://ftserver-ym6z.onrender.com/updateExercise", {
        name: editedData.id ? editedData.id : editedData.exerciseName,
        editedData,
      })
      .then(() => {
        setOriginalData(editedData);
        setIsModified(false);
        alert("✅ تم حفظ التعديلات بنجاح");
      })
      .catch((err) => {
        console.error("❌ فشل في الحفظ:", err.response?.data || err.message);
      });
  };

  const handleDelete = () => {
    if (!editedData || !editedData.exerciseName) return;

    const confirmDelete = window.confirm("هل أنت متأكد من حذف التمرين؟");
    if (!confirmDelete) return;

    axios
      .post("https://ftserver-ym6z.onrender.com/deleteExercise", {
        name: editedData.id ? editedData.id : editedData.exerciseName,
      })
      .then(() => {
        alert("🗑️ تم حذف التمرين بنجاح");
        navigate("/Exercises");
      })
      .catch((err) => {
        console.error("❌ فشل في الحذف:", err.response?.data || err.message);
      });
  };

  return (
    <ScreenWrapper>
      <HeaderCard className={''}>

        <h1 className="text-xl text-wrap text-center">
          {editedData?.exerciseName}
        </h1>
      </HeaderCard>

      <BodyCard>
        {editedData && (
          <div className="">
            <div className="mb-6">
              <img
                src={editedData.imageUrl}
                alt={editedData.exerciseName}
                className="rounded-lg w-full max-h-72 h-72 object-contain mx-auto"
              />
            </div>

            <div className="space-y-4 text-sm sm:text-base" dir="rtl">
              <EditableRow
                inputName={'bodyPart'}
                label="الجزء المستهدف"
                value={editedData.bodyPart}
                onChange={(val) => handleChange("bodyPart", val)}
              />
              <EditableRow
                inputName={'category'}
                label="الفئة"
                value={editedData.category}
                onChange={(val) => handleChange("category", val)}
              />
              <EditableRow
                inputName={'difficulty'}
                label="الصعوبة"
                value={editedData.difficulty}
                onChange={(val) => handleChange("difficulty", val)}
              />
              <EditableRow
                inputName={'description'}
                label="الوصف"
                value={editedData.description}
                onChange={(val) => handleChange("description", val)}
                textarea
              />
              <EditableRow
                inputName={'commonMistakes'}
                label="الأخطاء الشائعة"
                value={editedData.commonMistakes}
                onChange={(val) => handleChange("commonMistakes", val)}
                textarea
              />
            </div>

            {userType === "admin" && (
              <div className="flex flex-wrap gap-4 mt-6 justify-end">
                {isModified && (
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition"
                  >
                    حفظ التعديلات
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition"
                >
                  حذف التمرين
                </button>
              </div>
            )}
          </div>
        )}
      </BodyCard>
    </ScreenWrapper>
  );
}

function EditableRow({
  label,
  value,
  onChange,
  textarea = false,
  inputName
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  textarea?: boolean;
  inputName:  string;
}) {
  return (
    <div className="">
      {textarea ? (
        <div className="w-full">
          <label className="font-medium mr-2 text-white">{label}:</label>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 text-white border border-white p-2 rounded placeholder-white/70 bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition w-full"
            rows={3}
          />
        </div>
      ) : (
        <Input
          label={label}
          name={inputName}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className=""
        />
      )}
    </div>
  );
}
