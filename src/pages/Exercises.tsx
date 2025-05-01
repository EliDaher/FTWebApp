import axios from "axios"
import { useState, useEffect } from "react"
import { Exercise } from "../types/exercise"
import { useNavigate } from "react-router-dom";


export default function Exercises() {

    const [exercises, setExercises] = useState<Exercise[]>([]);
    const navigate = useNavigate()

    const getAllExercises = async () => {

        try {
            const response = await axios.post('https://ftserver-ym6z.onrender.com/getAllExercises');            
            const exercisesArray = Object.values(response.data.exercises) as Exercise[];
            setExercises(exercisesArray);

        } catch (error: any) {

          alert('حفظ التمريحدث خطأ أثناء جلب التمارين');

        }

    }

    useEffect(() => {
        getAllExercises()
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white flex flex-col p-4">





        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {exercises.map((exercise) => (
            <div
                onClick={()=>{
                    navigate(`/ExerciseDetails/${exercise.exerciseName}`)
                }}
                key={exercise.exerciseName}
                className="bg-gray-800 hover:scale-105 transition-transform duration-300 rounded-xl overflow-hidden shadow-lg hover:shadow-xl"
            >
                <img
                    src={exercise.imageUrl}
                    alt={exercise.exerciseName}
                    className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-2">
                    <h2 className="text-xl font-semibold">{exercise.exerciseName}</h2>
                    <p className="text-sm text-gray-300">الفئة: {exercise.category}</p>
                    <p className="text-sm text-gray-300">العضلة: {exercise.bodyPart}</p>
                    <p className="text-sm text-gray-300">الصعوبة: {exercise.difficulty}</p>
                    <p className="text-sm text-gray-400 mt-2">{exercise.description}</p>
                </div>
            </div>
          ))}
        </div>






            {/* add exercise btn */}
            <button
                onClick={()=>{
                    navigate('/AddExercise')
                }}
                className='fixed bottom-5 right-8 p-2 bg-primary-500 rounded-full font-bold text-4xl'
            >
                <div
                  className='p-0 fill-white'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" ><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg>
                </div>
            </button>
        </div>
    )
}
