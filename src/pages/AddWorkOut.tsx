import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { WorkOut, WorkOutExercise } from '../types/workout' 
import axios from 'axios'
import { Exercise } from '../types/exercise'
import { useNavigate } from 'react-router-dom'


type availableExercisesType = { 
  id: string,
  name: string
} 


export default function AddWorkOut() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner')
  const [duration, setDuration] = useState<number>(30)
  const [exercises, setExercises] = useState<WorkOutExercise[]>([])
  const [availableExercises, setAvailableExercises] = useState<availableExercisesType[]>([])

    
    const getAllExercises = async () => {

        try {
            const response = await axios.post('https://ftserver-ym6z.onrender.com/getAllExercises');            
            const exercisesData = Object.values(response.data.exercises) as Exercise[];
            const simplifiedExercises = exercisesData.map((exercise) => ({
              id: exercise.exerciseName,
              name: exercise.exerciseName
            }));
            setAvailableExercises(simplifiedExercises);

        } catch (error: any) {

          alert('حفظ التمريحدث خطأ أثناء جلب التمارين');

        }

    }

    useEffect(()=>{
        getAllExercises()
    }, [])

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      { exerciseId: '', sets: [{ reps: 10, rest: 60 }] }
    ])
  }

  const handleExerciseChange = (index: number, key: 'exerciseId', value: string) => {
    const updated = [...exercises]
    updated[index][key] = value
    setExercises(updated)
  }

  const handleSetChange = (
    exIndex: number,
    setIndex: number,
    key: 'reps' | 'rest',
    value: number
  ) => {
    const updated = [...exercises]
    updated[exIndex].sets[setIndex][key] = value
    setExercises(updated)
  }

  const addSetToExercise = (exIndex: number) => {
    const updated = [...exercises]
    updated[exIndex].sets.push({ reps: 10, rest: 60 })
    setExercises(updated)
  }

  const removeExercise = (exIndex: number) => {
    const updated = exercises.filter((_, i) => i !== exIndex)
    setExercises(updated)
  }

  const removeSet = (exIndex: number, setIndex: number) => {
    const updated = [...exercises]
    updated[exIndex].sets = updated[exIndex].sets.filter((_, i) => i !== setIndex)
    setExercises(updated)
  }

  const handleSubmit = async () => {
    if (!title) {
        alert("يجب ادخال اسم للبرنامج");
        return;
    }
    if (exercises.length < 1) {
        alert("يجب ادخال تمرين واحد على الاقل");
        return;
    }

    const invalidExerciseIndex = exercises.findIndex(exe => exe.exerciseId === '');
    if (invalidExerciseIndex !== -1) {
        alert(`الرجاء التأكد من البيانات المدخلة في التمرين رقم ${invalidExerciseIndex + 1}`);
        return;
    }

    const newWorkOut: WorkOut = {
        id: uuidv4(),
        title,
        description,
        level,
        duration,
        createdAt: new Date().toISOString(),
        exercises
    };

    console.log(newWorkOut);

    try {
        const response = await axios.post('https://ftserver-ym6z.onrender.com/addWorkOut', { newWorkOut });
        console.log('✅ Success:', response.data);
        alert('تم حفظ البرنامج بنجاح');
        navigate('/WorkOuts')
        //clearData();
    } catch (error: any) {
        console.error('❌ Error:', error.response?.data || error.message);
        alert('حدث خطأ أثناء حفظ التمرين');
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-6">إضافة برنامج تدريبي</h1>

      <input
        type="text"
        placeholder="اسم البرنامج"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4 p-3 rounded-xl bg-white/10 text-white w-full"
      />

      <textarea
        placeholder="وصف البرنامج"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4 p-3 rounded-xl bg-white/10 text-white w-full"
      />

      <div className="flex gap-4 mb-4">
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as any)}
          className="p-3 rounded-xl bg-white/10 text-white"
        >
          <option className='text-black' value="Beginner">مبتدئ</option>
          <option className='text-black' value="Intermediate">متوسط</option>
          <option className='text-black' value="Advanced">متقدم</option>
        </select>

        <input
            lang='english'
            type="number"
            placeholder="المدة بالدقائق"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="p-3 rounded-xl bg-white/10 text-white w-36"
        />
      </div>

      {/* قائمة التمارين */}
      {exercises.map((ex, exIdx) => (
        <div key={exIdx} className="bg-white/5 p-4 rounded-xl space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">تمرين {exIdx + 1}</h3>
            <button
              onClick={() => removeExercise(exIdx)}
              className="text-red-400 hover:text-red-600 text-sm bg-red-500/20 py-2 px-4 rounded-lg"
            >
              حذف التمرين
            </button>
          </div>

          <select
            value={ex.exerciseId}
            onChange={(e) => handleExerciseChange(exIdx, 'exerciseId', e.target.value)}
            className="w-full rounded-lg px-4 py-2 bg-white/10 "
          >
            <option value="">اختر التمرين</option>
            {availableExercises.map((exercise) => (
              <option className='text-black' key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>

          {ex.sets.map((set, setIdx) => (
            <div key={setIdx} className="flex gap-4 items-center">
              <input
                type="number"
                placeholder="Reps"
                value={set.reps}
                onChange={(e) =>
                  handleSetChange(exIdx, setIdx, 'reps', parseInt(e.target.value))
                }
                className="w-1/2 rounded-lg px-4 py-2 bg-white/10"
              />
              <input
                type="number"
                placeholder="Rest (sec)"
                value={set.rest}
                onChange={(e) =>
                  handleSetChange(exIdx, setIdx, 'rest', parseInt(e.target.value))
                }
                className="w-1/2 rounded-lg px-4 py-2 bg-white/10"
              />
              <button
                onClick={() => removeSet(exIdx, setIdx)}
                className="text-red-400 hover:text-red-600 text-sm bg-red-500/20 py-2 px-4 rounded-lg"
              >
                حذف
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addSetToExercise(exIdx)}
            className="text-sm mt-2 bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700"
          >
            + أضف Set
          </button>
        </div>
      ))}

      <button
        onClick={handleAddExercise}
        className="bg-green-600 px-4 py-2 rounded-lg text-white hover:bg-green-700"
      >
        + أضف تمرين
      </button>

      <button
        onClick={handleSubmit}
        className="mt-6 bg-purple-700 px-6 py-3 rounded-xl font-semibold hover:bg-purple-800"
      >
        حفظ البرنامج التدريبي
      </button>
    </div>
  )
}
