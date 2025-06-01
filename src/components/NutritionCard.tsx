// src/components/NutritionCard.tsx
import React from "react";
import { NutritionProgram } from "../types/Nutrition";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Props {
  program: NutritionProgram;
  id: string;
}

const NutritionCard: React.FC<Props> = ({ program, id }) => {

    const navigate = useNavigate()
  return (
    <div onClick={()=>{
            navigate(`/EditNutrition/${id}`)
        }}  dir="rtl" className="bg-black/20 rounded-2xl shadow-md border border-blue-200 p-6 space-y-3">
      <div className="flex justify-between">
        
        <h2 className="text-xl font-bold text-blue-600">{program.title}</h2>
        <button
          onClick={async ()=>{

            try {
              await axios.delete(`https://ftserver-ym6z.onrender.com/deleteNutritionProgram/${id}`);
              alert("تم حزف البرنامج بنجاح ✅");
              navigate('/NutritionList')
            
            } catch (error) {
              console.error("خطأ أثناء الإرسال:", error);
              alert("فشل الإرسال ❌");
            }
                  
          }} 
          className='bg-red-500 hover:bg-red-600 px-4 py-1 rounded'
        >حزف</button>
      </div>
      <p className="text-gray-300"><strong>الوصف:</strong> {program.description}</p>
      <p className="text-gray-300"><strong>السعرات:</strong> {program.calories} كالوري</p>

      <div className="space-y-2 mt-4">
        {program.meals.map((meal, index) => (
          <div key={index} className="bg-blue-50/5 p-3 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-blue-600 mb-1">{meal.name}</h3>
            <ul className="list-disc list-inside text-sm text-gray-200">
              {meal.items.map((item, idx) => (
                <li key={idx}>
                  {item.food} - {item.quantity} {item.unit}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionCard;
