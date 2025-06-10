// src/components/NutritionList.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import NutritionCard from "../components/NutritionCard";
import { NutritionProgram } from "../types/Nutrition";
import { useNavigate } from "react-router-dom";
import ScreenWrapper from "../components/ScreenWrapper";
import HeaderCard from "../components/UI/HeaderCard";

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
      <ScreenWrapper>
        <div className="">
          <HeaderCard className={'grid grid-cols-3'}>
            {/* زر اضافة برنامج عذائي */}              
            <div onClick={()=>{
                navigate('/AddNutritionProgram')
            }} className="mx-3 rounded-lg bg-green-600 border-2 text-center content-center">   
                <button>
                    اضافة برنامج غذائي
                </button>
            </div>
            <h1 className="text-2xl font-bold text-center text-white">البرامج الغذائية</h1>
          </HeaderCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((program, index) => (
              <NutritionCard key={index} program={program.data} id={program.id} />
            ))}
          </div>
        </div>
      </ScreenWrapper>
    );
};

export default NutritionList;
