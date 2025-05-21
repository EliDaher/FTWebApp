// src/components/NutritionList.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import NutritionCard from "../components/NutritionCard";
import { NutritionProgram } from "../types/Nutrition";
import { useNavigate } from "react-router-dom";

interface ServerResponse {
  success: boolean;
  message: string;
  nutritionData: Record<string, NutritionProgram>;
}

const NutritionList: React.FC = () => {
  const [programs, setPrograms] = useState<{ id: string; data: NutritionProgram }[]>([]);

  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get<ServerResponse>("https://ftserver-ym6z.onrender.com/getAllNutritionPrograms")
      .then((res) => {
        const entries = Object.entries(res.data.nutritionData).map(([id, data]) => ({ id, data }));
        setPrograms(entries);
      })
      .catch((err) => {
        console.error("فشل في جلب البيانات:", err);
      });
  }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6 py-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-white">البرامج الغذائية</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {programs.map((program, index) => (
                    <NutritionCard key={index} program={program.data} id={program.id} />
                  ))}
                </div>
            </div>

            {/* زر اضافة برنامج عذائي */}              
            <div onClick={()=>{
                navigate('/AddNutritionProgram')
            }} className="fixed bottom-5 left-5 px-2 py-1 rounded-lg bg-green-600 border-2">   
                <button>
                    اضافة برنامج غذائي
                </button>
            </div>
        </div>
    );
};

export default NutritionList;
