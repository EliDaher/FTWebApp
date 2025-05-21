import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { WorkOutExercise, FullWorkout } from '../types/workout' 
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Chip } from '@mui/material'
import Exercises from './Exercises'


export default function AddWorkOut() {
  const navigate = useNavigate()

  const [isSelecting, setIsSelectin] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [idx, setIdx] = useState(0)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner')
  const [duration, setDuration] = useState<number>(30)
  const [exercises, setExercises] = useState<WorkOutExercise[]>([])

  const [suggestions, setSuggestions] = useState(['اليوم 0']);
  const [selectedConditions, setSelectedConditions] = useState('اليوم 1');
  
  const [fullWorkout, setFullWorkout] = useState<FullWorkout>()

  const toggleCondition = (condition: string) => {
    setSelectedConditions(condition);
  };

  const [dayWorkout, setDayWorkout] = useState<FullWorkout>()

  useEffect(()=>{
    setDayWorkout({
      id: uuidv4(),
      title: title,
      workouts: [{
        workoutName: suggestions[suggestions.length - 1],
        workoutIndex: suggestions.indexOf(suggestions[suggestions.length - 1]),
        workout:{
          id: uuidv4(),
          title,
          description,
          level,
          duration,
          createdAt: new Date().toISOString(),
          exercises: []
        }
      }]
    })
  }, [])

  useEffect(()=>{
  
    dayWorkout && dayWorkout.workouts.push({
      workoutName: suggestions[suggestions.length - 1],
      workoutIndex: suggestions.indexOf(suggestions[suggestions.length - 1]),
      workout:{
        id: uuidv4(),
        title,
        description,
        level,
        duration,
        createdAt: new Date().toISOString(),
        exercises: []
      }
    })   
  
    setFullWorkout(dayWorkout as FullWorkout)
  }, [suggestions])

  const handleDayChange = (condition: string) => {

    const fromIndex = fullWorkout?.workouts[suggestions.indexOf(selectedConditions)].workoutIndex
    fullWorkout?.workouts[fromIndex as any].workout.exercises.splice(0, fullWorkout?.workouts[fromIndex as any].workout.exercises.length, ...exercises)
    
    toggleCondition(condition)
    
  }

  useEffect(()=>{
     
    const toIndex = fullWorkout?.workouts[suggestions.indexOf(selectedConditions)].workoutIndex
    toIndex && setExercises(fullWorkout?.workouts[toIndex as any].workout.exercises as any)

  }, [selectedConditions])


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

  useEffect(()=>{
    setFullWorkout(prev => {
      if (!prev) return prev; // لمنع الخطأ عند undefined
        
      return {
        ...prev,
        title: title, // أو أي متغير جديد
      };
    });
  }, [title, selectedConditions])

  const handleSubmit = async () => {

    handleDayChange('اليوم 1')
    console.log(fullWorkout)

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

    try {
        const response = await axios.post('https://ftserver-ym6z.onrender.com/addWorkOut', {newWorkOut: fullWorkout});
        console.log(response.data)
        alert('تم حفظ البرنامج بنجاح');
        navigate('/WorkOuts')
        //clearData();
    } catch (error: any) {
        console.error('❌ Error:', error.response?.data || error.message);
        alert('حدث خطأ أثناء حفظ التمرين');
    }
    
  }

  useEffect(() => {
    if (selectedId !== '') {
      handleExerciseChange(idx, 'exerciseId', selectedId);
      setSelectedId(''); // تفريغ الاختيار بعد الاستخدام
    }
  }, [selectedId]);

  if(isSelecting) { return <Exercises setIsSelectin={setIsSelectin} setSelectedId={setSelectedId} isSelecting={isSelecting} /> }

  return (
    <div dir='rtl' className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">إضافة برنامج تدريبي</h1>

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

      {/* يوم التمرين */}
      <div>
        <div className="mb-3">
          <label className="block mb-2">يوم التمرين</label>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((condition, index) => (
              (condition == "اليوم 0") ? "" : 
              <Chip
                key={index}
                label={condition}
                clickable
                onClick={() => handleDayChange(condition)}
                color={selectedConditions.includes(condition) ? 'primary' : 'default'}
                style={{
                  color: 'lightgray',
                }}
              />
            ))}
            <Chip
              label={'اضافة يوم'}
              clickable
              onClick={() => {setSuggestions([...suggestions, `اليوم ${suggestions.length}`])}}
              variant="outlined"
              style={{
                color: 'lightgray'
              }}
            />
          </div>
        </div>
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

          <button
            onClick={() => {
              setIdx(exIdx)
              setIsSelectin(true)
            }}
            className="w-full rounded-lg px-4 py-2 bg-white/10"
          >
            {ex.exerciseId ? ex.exerciseId : 'اختيار تمرين'}
          </button>

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

      {suggestions.length > 1 && <button
        onClick={handleAddExercise}
        className="bg-green-600 px-4 py-2 rounded-lg text-white hover:bg-green-700"
      >
        + أضف تمرين
      </button>}

      <button
        onClick={handleSubmit}
        className="mt-6 bg-purple-700 px-6 py-3 rounded-xl font-semibold hover:bg-purple-800"
      >
        حفظ البرنامج التدريبي
      </button>
    </div>
  )
}
