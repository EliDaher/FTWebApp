import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "../types/user";
import UserWorkoutForm from "./UserWorkoutForm";

export default function UserDetailsPage() {
  const { id } = useParams();
  const [userData, setUserData] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

  const getUserData = async () => {
    try {
      const res = await axios.post(`https://ftserver-ym6z.onrender.com/getUserData`, { username: id });
      setUserData(res.data.userData);
    } catch (error) {
      console.error("حدث خطأ أثناء جلب البيانات:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white flex flex-col p-4">
      <h1 className="text-3xl text-center font-bold mb-4">تفاصيل المستخدم</h1>
      <p className="text-lg text-right mb-4" dir="rtl">المستخدم: {id}</p>

      {
        showForm ? <UserWorkoutForm setShowForm={setShowForm} username={id} /> : <div></div>
      }

      {/* عرض بيانات المستخدم */}
      {userData ? (
        <>
            <div className="w-full mx-auto mt-6 bg-gray-900 rounded-xl p-6 space-y-4 border border-gray-700" dir="rtl">
              <h3 className="text-xl font-semibold text-center">نموذج تعديل البيانات</h3>
              <form className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="الاسم الكامل" defaultValue={userData.fullname} className="col-span-2 p-2 rounded bg-gray-800 text-white" />
                <input type="email" placeholder="البريد الإلكتروني" defaultValue={userData.password} className="col-span-2 p-2 rounded bg-gray-800 text-white" />
                <input type="text" placeholder="الوظيفة" defaultValue={userData.job} className="p-2 rounded bg-gray-800 text-white" />
                <input type="text" placeholder="فصيلة الدم" defaultValue={userData.bloodType} className="p-2 rounded bg-gray-800 text-white" />
                <input type="number" placeholder="الوزن" defaultValue={userData.weight} className="p-2 rounded bg-gray-800 text-white" />
                <input type="number" placeholder="الطول" defaultValue={userData.height} className="p-2 rounded bg-gray-800 text-white" />
                <textarea placeholder="الحالة الصحية" defaultValue={userData.healthConditions} className="col-span-2 p-2 rounded bg-gray-800 text-white" />
                {/*<button type="submit" className="col-span-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded">حفظ التعديلات</button>*/}
              </form>
            </div>
        </>
      ) : (
        <p className="text-center mt-6">جاري تحميل البيانات...</p>
      )}

      {/* زر إظهار الفورم */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="self-end mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
      >
        {"تعديل البرامج التدريبية"}
      </button>


    </div>
  );
}
