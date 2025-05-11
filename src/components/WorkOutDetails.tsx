import { useLocation, useNavigate } from "react-router-dom"
import { WorkOut } from "../types/workout"
import axios from "axios"

export default function WorkOutDetails() {
  const location = useLocation()
  const navigate = useNavigate()
  const workOutData: WorkOut = location.state

  const handleDelete = async () => {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذا البرنامج؟")
    if (!confirmed) return

    try {
      await axios.put(`https://ftserver-ym6z.onrender.com/deleteWorkout/${workOutData.id}`)

      alert("تم حذف البرنامج بنجاح")
      navigate("/workouts") // عد إلى قائمة البرامج مثلاً
    } catch (error) {
      alert("حدث خطأ أثناء حذف البرنامج")
      console.error(error)
    }
  }

  const handleEdit = () => {
    navigate("/editWorkout", { state: workOutData })
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto bg-white/5 p-6 rounded-2xl shadow-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{workOutData.title}</h1>
          <span className="text-sm text-gray-400">{new Date(workOutData.createdAt).toLocaleDateString()}</span>
        </div>

        <p className="text-white/80">{workOutData.description || "لا يوجد وصف"}</p>

        <div className="flex gap-4 text-sm text-gray-300">
          <span>المستوى: <strong className="text-white">{workOutData.level}</strong></span>
          <span>المدة: <strong className="text-white">{workOutData.duration} دقيقة</strong></span>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">التمارين:</h2>
          {workOutData.exercises.map((exercise, idx) => (
            <div key={idx} className="bg-gray-800 p-4 rounded-lg mb-3 space-y-2">
              <h3 className="font-semibold text-lg">تمرين #{idx + 1}: <span className="text-white/90">{exercise.exerciseId}</span></h3>
              {exercise.sets.map((set, sIdx) => (
                <div key={sIdx} className="text-sm text-gray-300">
                  <p>المجموعة #{sIdx + 1}: {set.reps} تكرار - راحة {set.rest} ثانية</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleEdit}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl"
          >
            تعديل
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  )
}
