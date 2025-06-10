import axios from "axios"
import { useState, useEffect } from "react"
import { Exercise } from "../types/exercise"
import { useNavigate } from "react-router-dom";
import ScreenWrapper from "../components/ScreenWrapper";
import BodyCard from "../components/UI/BodyCard";
import HeaderCard from "../components/UI/HeaderCard";

export default function Exercises({ setIsSelectin, setSelectedId, isSelecting, setSelectedName }: any) {

    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const navigate = useNavigate();

    const getAllExercises = async () => {
        try {
            const response = await axios.post('https://ftserver-ym6z.onrender.com/getAllExercises');
            const exercisesArray = Object.values(response.data.exercises) as Exercise[];
            setExercises(exercisesArray);
            setFilteredExercises(exercisesArray);
        } catch (error: any) {
            alert('حدث خطأ أثناء جلب التمارين');
        }
    };

    useEffect(() => {
        getAllExercises();
    }, []);

    const categories = Array.from(new Set(exercises.map((ex) => ex.bodyPart))).filter(Boolean);

    const handleCategoryChange = (bodyPart: string) => {
        setSelectedCategory(bodyPart);
        setCurrentPage(1);
        if (bodyPart === "all") {
            setFilteredExercises(exercises);
        } else {
            setFilteredExercises(exercises.filter((ex) => ex.bodyPart === bodyPart));
        }
    };

    const indexOfLastExercise = currentPage * itemsPerPage;
    const indexOfFirstExercise = indexOfLastExercise - itemsPerPage;
    const currentExercises = filteredExercises.slice(indexOfFirstExercise, indexOfLastExercise);
    const totalPages = Math.ceil(filteredExercises.length / itemsPerPage);

    const getPaginationButtons = () => {
        const pages: (number | string)[] = [];
        const maxVisibleButtons = 5;
        
        // إذا كان عدد الصفحات قليل، نعرضها كلها
        if (totalPages <= maxVisibleButtons) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }
    
        pages.push(1); // الصفحة الأولى دائمًا
    
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
    
        if (start > 2) {
            pages.push('...');
        }
    
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
    
        if (end < totalPages - 1) {
            pages.push('...');
        }
    
        pages.push(totalPages); // الصفحة الأخيرة دائمًا
    
        return pages;
    };


    return (
        <ScreenWrapper>

            <HeaderCard className={`grid ${!isSelecting ? 'grid-cols-3' : `grid-cols-1`}`}>
                {!isSelecting && (
                    <button
                        onClick={() => navigate('/AddExercise')}
                        className='p-2 bg-primary-500 rounded mx-8'
                    >
                        <div className='p-0 fill-white'>إضافة تمرين</div>
                    </button>
                )}
                <h1 className="text-center text-2xl font-bold">التمارين</h1>

                <div className="flex justify-center items-center px-4">
                    <select
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="px-4 py-2 rounded border bg-black"
                    >
                        <option value="all">عرض الكل</option>
                        {categories.map((cat) => (
                            <option className="bg-black" key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </HeaderCard>

            {/* Pagination */}
            <div className="flex justify-center items-center my-4 space-x-2 rtl:space-x-reverse flex-wrap">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded bg-primary-500 text-white disabled:opacity-50"
                >
                    السابق
                </button>
                {getPaginationButtons().map((item, idx) =>
                    typeof item === 'number' ? (
                        <button
                            key={idx}
                            onClick={() => setCurrentPage(item)}
                            className={`px-3 py-1 rounded-full border-2 ${currentPage === item ? 'bg-primary-500 text-white' : 'bg-white text-black'}`}
                        >
                            {item}
                        </button>
                    ) : (
                        <span key={idx} className="px-2 text-gray-400">...</span>
                    )
                )}
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded bg-primary-500 text-white disabled:opacity-50"
                >
                    التالي
                </button>
            </div>

            <BodyCard>
                <div dir="rtl" className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {currentExercises.map((exercise) => (
                        <div
                            onClick={() => {
                                if (!isSelecting) {
                                    navigate(`/ExerciseDetails/${exercise.id ?? exercise.exerciseName}`);
                                } else {
                                    setSelectedId(exercise.id);
                                    setIsSelectin(false);
                                    setSelectedName(exercise.exerciseName);
                                }
                            }}
                            key={exercise.exerciseName}
                            className="bg-white/5 border-2 backdrop-blur-lg hover:scale-105 transition-transform duration-300 rounded-xl overflow-hidden shadow-lg hover:shadow-xl"
                        >
                            <img
                                src={exercise.imageUrl}
                                alt={exercise.exerciseName}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4 space-y-2">
                                <h2 className="text-xl font-semibold">{exercise.exerciseName}</h2>
                                <p className="text-md text-gray-300">الفئة: {exercise.category}</p>
                                <p className="text-md text-gray-300">العضلة: {exercise.bodyPart}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </BodyCard>

        </ScreenWrapper>
    );
}
