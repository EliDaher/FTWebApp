import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

interface Nutrition {
  id: string;
  title: string;
}

export default function UserNutritionForm({
  setNutritionForm,
  username,
  userNutrition,
}: {
  setNutritionForm: (newValue: boolean) => void;
  username: string | undefined;
  userNutrition: any[]
}) {
  const [allNutritions, setAllNutritions] = useState<Nutrition[]>([]);
  const [selectedNutritions, setSelectedNutritions] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

    useEffect(() => {
        const getNutritions = async () => {
            try {
                const res = await axios.get(
                    'https://ftserver-ym6z.onrender.com/getAllNutritionPrograms'
                );
            
                const all: Nutrition[] = Object.entries(res.data.nutritionData).map(
                  ([id, value]: any) => ({
                    id,
                    title: value?.title || 'بدون عنوان',
                  })
                );
            
                const nutritionData: Nutrition[] = userNutrition || [];
            
                setAllNutritions(all);
                setSelectedNutritions(new Set(nutritionData.map((w) => w.id)));
            } catch (err: any) {
                console.error(err.response?.data || err.message);
            }
        }   ;
    
        getNutritions();
    }, [username, location.state]);


  const handleCheckboxChange = (id: string) => {
    /*setSelectedNutritions((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });*/
    setSelectedNutritions((prev) => {
      const updated = new Set(prev);
        
      prev.forEach(ele => {
        updated.delete(ele)
      })

      updated.add(id)

      return updated;
    });
  };

  const handleSave = async () => {
    try {
      const updatedNutrition = allNutritions
        .filter((nutrition) => selectedNutritions.has(nutrition.id))
        .map((nutrition) => ({ id: nutrition.id, title: nutrition.title }));
        console.log(updatedNutrition)

      const res = await axios.post(
        'https://ftserver-ym6z.onrender.com/modifyUserNutrition',
        {
          username,
          updatedNutrition,
        }
      );

      if (res.data.success) {
        alert('تم تعديل البرامج بنجاح');
        setNutritionForm(false);
      }

    } catch (err: any) {
      console.error(err.response?.data || err.message);
    }
  };

  const filteredNutritions = allNutritions.filter((nutrition) =>
    nutrition.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4'>
      <div className='bg-black/70 border border-white/30 rounded-lg p-6 w-full max-w-3xl shadow-xl'>
        <div className='flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4 gap-4'>
          <h2 dir='rtl' className='text-white text-xl font-bold'>البرامج الغذائية للمستخدم</h2>
          <button className='px-4 py-1 bg-red-500 rounded text-white' onClick={() => setNutritionForm(false)}>إغلاق</button>
        </div>

        <input
          type='text'
          placeholder='ابحث عن تمرين...'
          className='w-full p-2 mb-4 rounded bg-white/10 text-white border border-white/20'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className='max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-white/10 border border-white/20 rounded-lg p-4 bg-white/5'>
          {filteredNutritions.map((nutrition) => (
            <label key={nutrition.id} className='flex items-center gap-2 py-2 text-white'>
              <input
                type='checkbox'
                checked={selectedNutritions.has(nutrition.id)}
                onChange={() => handleCheckboxChange(nutrition.id)}
                className='form-checkbox text-green-500 w-5 h-5'
              />
              <span>{nutrition.title}</span>
            </label>
          ))}
        </div>

        <button
          className='mt-6 bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto'
          onClick={handleSave}
        >
          حفظ
        </button>
      </div>
    </div>
  );
}
