import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '../components/ScreenWrapper';
import HeaderCard from '../components/UI/HeaderCard';
import BodyCard from '../components/UI/BodyCard';
import Input from '../components/UI/Input';

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
        window.location.reload()
        
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
      if(error.response.data.error.includes('not found')){
        alert('لا يوجد برامج تدريبية')
      }else{
        alert('حدث خطأ أثناء جلب البرامج التدريبية');
      }
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
    <ScreenWrapper>
    <div className="">
      <HeaderCard className={'grid grid-cols-3'}>
        <button
          onClick={() => navigate('/AddWorkOut')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition mx-9"
          >
          إضافة برنامج
        </button>
        <h1 className="text-3xl font-bold text-center font-cairo">البرامج التدريبية</h1>
      </HeaderCard>

      <BodyCard>
        <Input
          name='search'
          type="text"
          placeholder="ابحث عن برنامج تدريبي..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-5"
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
              className="font-cairo bg-blue-50/10 border px-4 py-2 rounded shadow-lg hover:shadow-white/10 transition-all duration-300 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">{workout.title}</h2>
                <p className="text-gray-400 text-sm mb-3">عدد ايام التمرين : {workout.workouts.length}</p>
              </div>
              <button 
                className="bg-red-500 hover:bg-red-600 border border-red-500 transition text-sm bg-red-500/20 py-2 px-4 rounded"
                onClick={()=>{
                  deleteFullWorkout(workout.id)
                }}
              >
                حزف البرنامج
              </button>
            </div>
          ))}
        </div>
      </BodyCard>
    </div>
    </ScreenWrapper>
  );
}
