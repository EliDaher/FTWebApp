import axios from "axios";
import { useEffect, useState, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { User } from "../types/user";
import UserWorkoutForm from "./UserWorkoutForm";

export default function UserDetailsPage() {
  const { id } = useParams();
  const [userData, setUserData] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [weight, setWeight] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [job, setJob] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [healthConditions, setHealthConditions] = useState('');

  const getUserData = async () => {
    try {
      const res = await axios.post(`https://ftserver-ym6z.onrender.com/getUserData`, { username: id });
      const user = res.data.userData;
      setUserData(user);
      setUsername(user.username || '');
      setPassword(user.password || '');
      setFullname(user.fullname || '');
      setWeight(user.weight || 0);
      setHeight(user.height || 0);
      setJob(user.job || '');
      setBloodType(user.bloodType || '');
      setHealthConditions(user.healthConditions || '');
    } catch (error) {
      console.error("حدث خطأ أثناء جلب البيانات:", error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`https://ftserver-ym6z.onrender.com/adminUpdateUserDetails`, {
        username,
        fullname,
        password,
        job,
        bloodType,
        weight,
        height,
        healthConditions
      });
      alert("تم حفظ البيانات بنجاح ✅");
      getUserData(); // إعادة تحميل البيانات بعد التحديث
    } catch (error) {
      console.error("خطأ أثناء الإرسال:", error);
      alert("فشل الإرسال ❌");
    }
  };

  useEffect(() => {
    getUserData();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white flex flex-col p-4">
      <h1 className="text-3xl text-center font-bold mb-4">معلومات المستخدم</h1>
      <p className="text-lg text-right mb-4" dir="rtl">المستخدم: {id}</p>

      {showForm && <UserWorkoutForm setShowForm={setShowForm} username={id} />}

      {/* عرض بيانات المستخدم */}
      {userData ? (
        <div className="w-full mx-auto mt-6 bg-gray-900 rounded-xl p-6 space-y-4 border border-gray-700" dir="rtl">
          <h3 className="text-xl font-semibold text-center">نموذج تعديل البيانات</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="الاسم الكامل" value={fullname} onChange={(e) => setFullname(e.target.value)} className="col-span-2 p-2 rounded bg-gray-800 text-white" />
            <input type="text" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-2 p-2 rounded bg-gray-800 text-white" />
            <input type="text" placeholder="الوظيفة" value={job} onChange={(e) => setJob(e.target.value)} className="p-2 rounded bg-gray-800 text-white" />
            <input type="text" placeholder="فصيلة الدم" value={bloodType} onChange={(e) => setBloodType(e.target.value)} className="p-2 rounded bg-gray-800 text-white" />
            <input type="number" placeholder="الوزن" value={weight.toString()} onChange={(e) => setWeight(Number(e.target.value))} className="p-2 rounded bg-gray-800 text-white" />
            <input type="number" placeholder="الطول" value={height.toString()} onChange={(e) => setHeight(Number(e.target.value))} className="p-2 rounded bg-gray-800 text-white" />
            <textarea placeholder="الحالة الصحية" value={healthConditions} onChange={(e) => setHealthConditions(e.target.value)} className="col-span-2 p-2 rounded bg-gray-800 text-white" />
            <button type="submit" className="col-span-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded">حفظ التعديلات</button>
          </form>
        </div>
      ) : (
        <p className="text-center mt-6">جاري تحميل البيانات...</p>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className="self-end mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
      >
        {"تعديل البرامج التدريبية"}
      </button>
    </div>
  );
}
