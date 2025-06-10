import { useLocation, useNavigate } from "react-router-dom"
import { FullWorkout, WorkOutExercise } from "../types/workout"
import axios from "axios"
import BodyCard from "./UI/BodyCard"
import Input from "./UI/Input"
import CategoryInput from "./UI/CategoryInput"
import { Chip } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from 'uuid'


export default function WorkOutDetails() {
  const location = useLocation()
  const workOutData: FullWorkout = location.state


  
  
  
  
  
  const [isSelecting, setIsSelectin] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedName, setSelectedName] = useState('')
  const [idx, setIdx] = useState(0)
  
  const [isNewSet, setIsNewSet] = useState<boolean[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [sets, setSets] = useState([])
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [exercises, setExercises] = useState<WorkOutExercise[]>([])
  
  const [category, setCategory] = useState('')
  const [catSuggestions, setcatSuggestions] = useState([])
  
  const [suggestions, setSuggestions] = useState(['اليوم 0']);
  const [selectedConditions, setSelectedConditions] = useState('اليوم 1');
  
  const [fullWorkout, setFullWorkout] = useState<FullWorkout>()

  useEffect(()=>{
    console.log(workOutData)
    setSuggestions([...suggestions, `اليوم 0`])
    let temSusggestion: any = []
    workOutData.workouts.forEach(ex => {
      temSusggestion.push(ex.workoutName)
    })
    setSuggestions([...temSusggestion])
    
  },[])


  useEffect(()=>{
    workOutData.workouts.forEach((workout, index) => {
      handleAddExercise()
    })
  }, [suggestions])
  
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
          category,
          createdAt: new Date().toISOString(),
          exercises: []
        }
      }]
    })
    getSets()
  }, [])

  const getSets = async () => {
    try{

      //setloading(true)
      const res = await axios.get('https://ftserver-ym6z.onrender.com/getSets')
      setSets(Object.values(res.data.userData))
      //setloading(false)
      setIsOpen(false)
    }catch (err){
      console.error(err)
      //setloading(false)
    }
  }

  useEffect(()=>{

    if(!isOpen){
      getSets()
    }

  }, [isOpen])

  const prevLength = useRef(suggestions.length);

  useEffect(() => {
    const newLength = suggestions.length;
  
    // تحقق إن كان هناك عنصر جديد تمت إضافته
    if (newLength > prevLength.current) {
      const newSuggestion = suggestions[newLength - 1];
    
      if (dayWorkout) {
        dayWorkout.workouts.push({
          workoutName: newSuggestion,
          workoutIndex: suggestions.indexOf(newSuggestion),
          workout: {
            id: uuidv4(),
            title,
            description,
            category,
            createdAt: new Date().toISOString(),
            exercises: []
          }
        });
      
        setFullWorkout({ ...dayWorkout });
      }
    }
  
    // حدث القيمة السابقة
    prevLength.current = newLength;
  }, [suggestions]);


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
    setExercises(prev => [...prev, { exerciseId: '', sets: [] }])
    setIsNewSet(prev => [...prev, false]) // أضف الحالة المرافقة لهذا التمرين

  }

  const handleExerciseChange = (index: number, key: 'exerciseId' | 'exerciseName', value: string) => {
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

  type set = {rest: any, reps: any}

  const oldsetsChange = (
    setsArr: set[],
    exIndex: number,
  
  ) => {

    if (setsArr.length > 1) {
      const updated = [...exercises]
      updated[exIndex].sets = [{ reps: 10, rest: 1 }]
      setExercises(updated)
    }

    setsArr.map((set, index) => {

      handleSetChange(exIndex, index, 'rest', parseInt(set.rest))
      handleSetChange(exIndex, index, 'reps', parseInt(set.reps))
      if(index != setsArr.length - 1) {addSetToExercise(exIndex)}
      
    })
    const updated = [...isNewSet]
    updated[exIndex] = true
    setIsNewSet(updated)

  }

  const addSetToExercise = (exIndex: number) => {
    const updated = [...exercises]
    updated[exIndex].sets.push({ reps: 10, rest: 1 })
    setExercises(updated)
  }

  const removeExercise = (exIndex: number) => {
    const updated = exercises.filter((_, i) => i !== exIndex)
    setIsNewSet(prev => prev.filter((_, i) => i !== exIndex))
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

  const handleSaveCategory = async () => {
    const newCategory = category.trim().replace(",", "");
    if (!newCategory) return;
    if (!suggestions.includes(newCategory)) {
      try {
        await axios.post("https://ftserver-ym6z.onrender.com/AddWorkoutCategories", {
          categoryName: newCategory,
        });
        setSuggestions([...suggestions, newCategory]);
      } catch (err) {
        console.error("فشل في إضافة الفئة:", err);
      }
    }
    setCategory(newCategory);
  };

  const handleDeleteSuggestion = (indexToDelete: number) => {
    const updatedSuggestions = suggestions.filter((_, i) => i !== indexToDelete);
    setSuggestions(updatedSuggestions);

    if (dayWorkout) {
      const updatedWorkouts = dayWorkout.workouts.filter((_, i) => i !== indexToDelete);
      setFullWorkout({
        ...dayWorkout,
        workouts: updatedWorkouts
      });
    }
    handleDayChange('اليوم 1')
  };


  useEffect(() => {
    if (selectedId !== '') {
      handleExerciseChange(idx, 'exerciseId', selectedId);
      handleExerciseChange(idx, 'exerciseName', selectedName);
      setSelectedId(''); // تفريغ الاختيار بعد الاستخدام
    }
  }, [selectedId]);








  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white p-6">
       <BodyCard>

        <Input
          label='اسم البرنامج'
          name='workoutName'
          type="text"
          placeholder="اسم البرنامج"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4"
        />

        <label htmlFor='workoutDetails' className="block font-medium mb-1 mr-2">
          ملاحظات
        </label>
        <textarea
          name='workoutDetails'
          placeholder="ملاحظات"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-4 p-2 rounded border border-white text-white placeholder-white/70 bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition w-full"
        />

        <div className="flex items-center justify-center gap-4 mb-4">
          <CategoryInput className={'w-full'} type={'workout'} category={category} setCategory={setCategory} suggestions={catSuggestions} setSuggestions={setcatSuggestions}/>
        </div>

        {/* يوم التمرين */}
        <div>
          <div className="mb-3">
            <div className='flex items-center justify-between'>
              <label className="block mb-2">يوم التمرين</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((condition, index) => (
                (condition == "اليوم 0") ? "" : 
                <>
                  <Chip
                    key={index}
                    label={condition}
                    clickable
                    onClick={() => handleDayChange(condition)}
                    color={selectedConditions.includes(condition) ? 'primary' : 'default'}
                    style={{
                      color: 'white',
                    }}
                  />
                </>
              ))}
            </div>
          </div>
        </div>

        {/* قائمة التمارين */}
        {exercises.map((ex, exIdx) => (
          <div key={exIdx} className="bg-white/10 border p-4 rounded-lg space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-xl mr-4">تمرين {exIdx + 1}</h3>
              <button
                onClick={() => removeExercise(exIdx)}
                className="text-white hover:bg-red-600 border border-red-600 text bg-red-500 py-2 px-4 rounded"
              >
                حذف التمرين
              </button>
            </div>

            <button
              onClick={() => {
                setIdx(exIdx)
                setIsSelectin(true)
              }}
              className="w-full rounded px-4 py-2 bg-white/10 border"
            >
              {ex.exerciseName ? ex.exerciseName : 'اختيار تمرين'}
            </button>

            {isNewSet[exIdx] && ex.sets.map((set, setIdx) => (
              <div key={setIdx} className="flex gap-4 items-center">
                <Input
                  name='reps'
                  type="number"
                  placeholder="Reps"
                  value={set.reps}
                  onChange={()=>{}}
                  className=""
                />
                <Input
                  name='rest'
                  type="number"
                  placeholder="Rest (sec)"
                  value={set.rest}
                  onChange={()=>{}}
                  className=""
                />
              </div>
            ))}

          </div>
        ))}

      </BodyCard>
    </div>
  )
}
