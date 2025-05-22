import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WorkOuts() {
  const [workOuts, setWorkOuts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [noWorkouts, setNoWorkouts] = useState(false);
  const navigate = useNavigate();

  const deleteFullWorkout = async (id: string) => {
    const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذا العنصر؟");
    if (confirmDelete) {
        // تنفيذ الحذف هنا
        try {
          const response = await axios.delete(`https://ftserver-ym6z.onrender.com/deleteFullWorkout/${id}`);
          console.log(response.data)
        alert('تم حزف البرنامج بنجاح')
        
      } catch (error: any) {
        alert('حدث خطأ أثناء حزف البرامج التدريبية');
        console.log(error)
      }

    } else {
      console.log("تم الإلغاء");
    }
  };
  const getAllWorkOuts = async () => {
    try {
      const response = await axios.get('https://ftserver-ym6z.onrender.com/getAllFullWorkout');
      console.log(response.data)
      const workOutArray = Object.values(response.data.fullWorkouts);

      setWorkOuts(workOutArray as any);
      setNoWorkouts(false)
    } catch (error: any) {
      alert('حدث خطأ أثناء جلب البرامج التدريبية');
      console.log(error)
    }
  };

  useEffect(() => {
    getAllWorkOuts();
  }, []);

  const filteredWorkOuts = workOuts.filter((workout: any) =>
    workout.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-center font-cairo">البرامج التدريبية</h1>
        <button
          onClick={() => navigate('/AddWorkOut')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
        >
          إضافة برنامج
        </button>
      </div>

      <input
        dir='rtl'
        type="text"
        placeholder="ابحث عن برنامج تدريبي..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 mb-6 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        { noWorkouts && <div className='text-center'>لم يتم العثور على برامج تدريبية لعرضها</div>}
        {filteredWorkOuts.map((workout: any) => (
          <div
            dir="rtl"
            /*onClick={()=>{
                navigate('/workOutDetails', {
                  state: workout
                })
            }}*/
            key={workout.id}
            className="font-cairo bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-white/10 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">{workout.title}</h2>
            <p className="text-gray-400 text-sm mb-3">عدد ايام التمرين : {workout.workouts.length}</p>

            <button 
              className="bg-red-500 hover:bg-red-600 text-sm bg-red-500/20 py-2 px-4 rounded-lg"
              onClick={()=>{
                deleteFullWorkout(workout.id)
              }}
            >
              حزف البرنامج
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
