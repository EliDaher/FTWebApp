import axios from "axios"
import { useState } from "react"
import { FaTimes } from "react-icons/fa"
import BodyCard from "./UI/BodyCard"
import Input from "./UI/Input"

export default function AddSetsForm({setIsOpen}: any) {

    type set = {rest: any, reps: any}
    const [sets, setSets] = useState<set[]>([])
    const [loading, setloading] = useState(false)

    const handleSetChange = (
        setIndex: number,
        key: 'reps' | 'rest',
        value: number
    ) => {
        const updated = [...sets]
        updated[setIndex][key] = value
        setSets(updated)
    }
    
    const removeSet = (setIndex: number) => {
        let updated = [...sets]
        updated = updated.filter((_, i) => i !== setIndex)
        setSets(updated)
    }

    
    const addSetToExercise = () => {
        const updated = [...sets]
        updated.push({ reps: 10, rest: 1 })
        setSets(updated)
    }

    const handleSaving = async (newSet: any) => {
        try{

            setloading(true)
            const res = await axios.post('https://ftserver-ym6z.onrender.com/addSets', newSet)
            console.log(res)
            alert('تمت الاضافة بنجاح')
            setloading(false)
            setIsOpen(false)

        }catch (err){
            console.error(err)
            alert("حدث خطأ الرجاء اعادة المحاولة")
            setloading(false)
        }
    }

    return (
        <div className="fixed z-50 w-full h-full flex items-center justify-center bg-black/50">
          <BodyCard className={'p-2'}>
            <div dir='rtl' className=" text-white flex flex-col">
              <div className="flex items-center justify-between mb-6 p-1">
                <h1 className="font-bold text-xl ">
                  اضافة جلسات
                </h1>
                <button
                  onClick={()=>{
                    setIsOpen(false)
                  }}
                >
                  <FaTimes className="text-3xl" />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                  {sets.map((set, setIdx) => (
                  <div key={setIdx} className="flex gap-2 items-center">
                    <Input
                      label="التكرارات"
                      name="reps"
                      type="number"
                      placeholder="Reps"
                      value={set.reps}
                      onChange={(e) =>
                        handleSetChange(setIdx, 'reps', parseInt(e.target.value))
                      }
                    />
                    <Input
                      label="وقت الراحة (بالدقيقة)"
                      name="rest"
                      type="number"
                      placeholder="Rest (sec)"
                      value={set.rest}
                      onChange={(e) =>
                        handleSetChange(setIdx, 'rest', parseInt(e.target.value))
                      }
                    />
                    <button
                      onClick={() => removeSet(setIdx)}
                      className="text-white mt-6 hover:bg-red-600 border border-red-600 text bg-red-500 py-2 px-4 rounded"
                    >
                      حذف
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSetToExercise()}
                  className="text-sm mt-2 bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700"
                >
                  + أضف Set
                </button>
              </div>
              <button
                  disabled={loading ? true : false}
                  onClick={()=>{
                      let title = ""
                      sets.map((set, index) => {
                          index == 0 ? 
                              title = set.reps
                          : 
                              title += "-" + set.reps
                      })
                      console.log({
                          title: title,
                          value: sets
                      })
                      handleSaving({
                          title: title,
                          value: sets
                      })
                  }}
                  className="bg-green-500 mt-4 rounded-lg py-2"
              >{!loading ? 'حفظ' : 'يتم الحفظ ...'}</button>
            </div>
          </BodyCard>
        </div>

    )
}
