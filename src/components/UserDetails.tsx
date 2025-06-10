import axios from "axios";
import { useEffect, useState, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../types/user";
import UserWorkoutForm from "./UserWorkoutForm";
import UserNutritionForm from "./UserNutritionForm";
import ScreenWrapper from "./ScreenWrapper";
import Input from "./UI/Input";
import BodyCard from "./UI/BodyCard";

export default function UserDetailsPage() {
  const navigate = useNavigate()

  const { id } = useParams();
  const [userData, setUserData] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [nutritionForm, setNutritionForm] = useState(false);

  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState('');
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
      setNumber(user.number || '');
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

  const deleteUsername = async () => {
    //e.preventDefault();
    const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذا العنصر؟");
    if (confirmDelete) {
      // تنفيذ الحذف هنا
      try {
        await axios.post(`https://ftserver-ym6z.onrender.com/deleteUsername`, {
          username: id,
        });
        alert("تم حزف المستخدم ✅");
        navigate('/UsersPage')
  
      } catch (error) {
        console.error("خطأ أثناء الإرسال:", error);
        alert("فشل الإرسال ❌");
      }
    } else {
      alert("تم الإلغاء");
    }
  }

  return (
    <ScreenWrapper>
    <div className="min-h-screen text-white flex flex-col p-4">
      <h1 className="text-3xl text-center font-bold mb-4">معلومات المستخدم</h1>

      {showForm && <UserWorkoutForm setShowForm={setShowForm} username={id} />}
      
      {nutritionForm && <UserNutritionForm setNutritionForm={setNutritionForm} username={id} userNutrition={userData?.nutrition ? userData.nutrition : [] } />}

      {/* عرض بيانات المستخدم */}
      {userData ? (
        <BodyCard>
          <p className="text-xl text-center" dir="rtl">المستخدم: {username}</p>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <Input name="name" type="text" label="الاسم الكامل" value={fullname} onChange={(e) => setFullname(e.target.value)} className="col-span-2" />
            <Input name="password" type="text" label="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} className=" " />
            <Input name="number" type="text" label="رقم الجوال" value={number} onChange={() =>{} } className=" " />
            <Input name="job" type="text" label="الوظيفة" value={job} onChange={(e) => setJob(e.target.value)} className="" />
            <Input name="blood" type="text" label="زمرة الدم" value={bloodType} onChange={(e) => setBloodType(e.target.value)} className="" />
            <Input name="weight" type="number" label="الوزن" value={weight.toString()} onChange={(e) => setWeight(Number(e.target.value))} className="" />
            <Input name="height" type="number" label="الطول" value={height.toString()} onChange={(e) => setHeight(Number(e.target.value))} className="" />
            <Input name="health" label="الامراض" placeholder="الحالة الصحية" value={healthConditions} onChange={(e) => setHealthConditions(e.target.value)} className="col-span-2" />
            <button type="button" onClick={()=>{deleteUsername()}} className="col-span-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded">حذف المستخدم</button>
            <button type="submit" className="col-span-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded">حفظ التعديلات</button>
          </form>
        </BodyCard>
      ) : (
        <p className="text-center mt-6">جاري تحميل البيانات...</p>
      )}

      <div className="flex flex-row-reverse gap-5">
        <button
          onClick={() => setShowForm(!showForm)}
          className="self-end mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
          {"تعديل البرامج التدريبية"}
        </button>

        <button
          onClick={() => setNutritionForm(!nutritionForm)}
          className="self-end mt-6 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition"
          >
          {"تعديل البرامج الغذائية"}
        </button>
      </div>
    </div>
    </ScreenWrapper>
  );
}
