import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkOut } from '../types/workout';

export default function WorkOuts() {
  const [workOuts, setWorkOuts] = useState<WorkOut[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const getAllWorkOuts = async () => {
    try {
      const response = await axios.post('https://ftserver-ym6z.onrender.com/getAllWorkOuts');
      console.log(response.data)
      const workOutArray = Object.values(response.data.workOuts) as WorkOut[];
      setWorkOuts(workOutArray);
    } catch (error: any) {
      alert('حدث خطأ أثناء جلب البرامج التدريبية');
      console.log(error)
    }
  };

  useEffect(() => {
    getAllWorkOuts();
  }, []);

  const filteredWorkOuts = workOuts.filter((workout) =>
    workout.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">البرامج التدريبية</h1>
        <button
          onClick={() => navigate('/AddWorkOut')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
        >
          إضافة برنامج
        </button>
      </div>

      <input
        type="text"
        placeholder="ابحث عن برنامج تدريبي..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 mb-6 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredWorkOuts.map((workout) => (
          <div
            onClick={()=>{
                navigate('/workOutDetails', {
                    state: workout
                })
            }}
            key={workout.id}
            className="bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-white/10 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">{workout.title}</h2>
            <p className="text-gray-400 text-sm mb-3">{workout.description}</p>
            <div className="text-sm text-gray-300 space-y-1">
              <p><span className="font-medium">المستوى:</span> {workout.level}</p>
              <p><span className="font-medium">المدة:</span> {workout.duration} دقيقة</p>
              <p><span className="font-medium">عدد التمارين:</span> {workout.exercises.length}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
