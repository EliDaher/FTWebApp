import { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { WorkOutExercise, FullWorkout } from '../types/workout' 
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Chip } from '@mui/material'
import Exercises from './Exercises'
import AddSetsForm from '../components/AddSetsForm'
import CategoryInput from '../components/UI/CategoryInput'
import ScreenWrapper from '../components/ScreenWrapper'
import HeaderCard from '../components/UI/HeaderCard'
import BodyCard from '../components/UI/BodyCard'
import Input from '../components/UI/Input'


export default function AddWorkOut() {
  const navigate = useNavigate()

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
      console.log(Object.values(res.data.userData))
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

  const handleSubmit = async () => {

    handleDayChange('اليوم 1')

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
      await axios.post('https://ftserver-ym6z.onrender.com/addWorkOut', {newWorkOut: fullWorkout});
      handleSaveCategory()
      alert('تم حفظ البرنامج بنجاح');
      navigate('/WorkOuts')
      //clearData();
    } catch (error: any) {
      console.error('❌ Error:', error.response?.data || error.message);
      alert('حدث خطأ أثناء حفظ التمرين');
    }
    
  }

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

  if(isSelecting) { return <Exercises setIsSelectin={setIsSelectin} setSelectedId={setSelectedId} isSelecting={isSelecting} setSelectedName={setSelectedName} /> }

  return (
    <ScreenWrapper>
    <div dir='rtl' className="">

      {isOpen && <AddSetsForm setIsOpen={setIsOpen} />}

      <HeaderCard>
        <h1 className="text-2xl font-bold my-1 text-center">إضافة برنامج تدريبي</h1>
      </HeaderCard>

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
                  {index == suggestions.length - 1 && <button
                    onClick={() => {
                      handleDeleteSuggestion(index)
                    }}
                    className="bg-red-500/50 hover:bg-red-500/60 rounded-xl text-white text-xs px-1 flex items-center justify-center"
                  >
                    حذف يوم
                  </button>}
                </>
                
              ))}
              <Chip
                label={'اضافة يوم'}
                clickable
                onClick={() => {setSuggestions([...suggestions, `اليوم ${suggestions.length}`])}}
                variant="outlined"
                style={{
                  color: 'white'
                }}
              />
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



              {exercises[exIdx].sets.length == 0 && <select
                onChange={(e) => {
                  if (e.target.value === 'غير ذلك') {
                    setIsOpen(true)
                    /*const updated = [...isNewSet]
                    updated[exIdx] = true
                    setIsNewSet(updated)
                    const updatedex = [...exercises]
                    updatedex[exIdx].sets = [{ reps: 10, rest: 1 }]
                    setExercises(updatedex)*/
                  }else if(e.target.value == 'اختر الجلسات'){
                    setIsOpen(false)
                    const updatedex = [...exercises]
                    updatedex[exIdx].sets = []
                    setExercises(updatedex)
                  } else{
                    setIsOpen(false)
                    console.log(e.target.value)
                    oldsetsChange(JSON.parse(e.target.value) as set[], exIdx)
                  }
                }}

                className="p-3 rounded-xl bg-white/10 text-white"
              >
                <option className='text-black' value={`اختر الجلسات`}>اختر الجلسات</option>
                {
                  sets.map((ele: any) => {
                    return <option key={ele.title} className='text-black' value={JSON.stringify(ele.value)}>{ele.title}</option>
                  })
                }
                <option className='text-black' value="غير ذلك">غير ذلك</option>
              </select>}

            {isNewSet[exIdx] && ex.sets.map((set, setIdx) => (
              <div key={setIdx} className="flex gap-4 items-center">
                <Input
                  name='reps'
                  type="number"
                  placeholder="Reps"
                  value={set.reps}
                  onChange={(e) =>
                    handleSetChange(exIdx, setIdx, 'reps', parseInt(e.target.value))
                  }
                  className=""
                />
                <Input
                  name='rest'
                  type="number"
                  placeholder="Rest (sec)"
                  value={set.rest}
                  onChange={(e) =>
                    handleSetChange(exIdx, setIdx, 'rest', parseInt(e.target.value))
                  }
                  className=""
                />
                <button
                  onClick={() => removeSet(exIdx, setIdx)}
                  className="text-white mb-1 hover:bg-red-600 border border-red-600 text bg-red-500 py-2 px-4 rounded"
                >
                  حذف
                </button>
              </div>
            ))}

            {isNewSet[exIdx] && exercises[exIdx].sets.length != 0  ? <button
              type="button"
              onClick={() => addSetToExercise(exIdx)}
              className="text-sm mt-2 bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700"
            >
              + أضف Set
            </button> : <></>}
          </div>
        ))}

        <div className='flex flex-col'>
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
      </BodyCard>
    </div>
    </ScreenWrapper>
  )
}
