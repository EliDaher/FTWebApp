import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ScreenWrapper from "../components/ScreenWrapper";

type FoodItem = {
  food: string;
  quantity: string;
  unit: string;
};

type Meal = {
  name: string;
  items: FoodItem[];
};

type NutritionProgram = {
  title: string;
  description: string;
  calories: string;
  price: string;
  meals: Meal[];
};

export default function EditNutrition() {
  const [program, setProgram] = useState<NutritionProgram>({
    title: "",
    description: "",
    calories: "",
    price: "0",
    meals: [
      {
        name: "",
        items: [{ food: "", quantity: "", unit: "" }],
      },
    ],
  });

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate()

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProgram({ ...program, [e.target.name]: e.target.value });
  };

  const handleMealNameChange = (index: number, value: string) => {
    const updatedMeals = [...program.meals];
    updatedMeals[index].name = value;
    setProgram({ ...program, meals: updatedMeals });
  };

  const handleItemChange = (
    mealIndex: number,
    itemIndex: number,
    field: keyof FoodItem,
    value: string
  ) => {
    const updatedMeals = [...program.meals];
    updatedMeals[mealIndex].items[itemIndex][field] = value;
    setProgram({ ...program, meals: updatedMeals });
  };

  const addMeal = () => {
    setProgram({
      ...program,
      meals: [...program.meals, { name: "", items: [{ food: "", quantity: "", unit: "" }] }],
    });
  };

  const addItemToMeal = (mealIndex: number) => {
    const updatedMeals = [...program.meals];
    updatedMeals[mealIndex].items.push({ food: "", quantity: "", unit: "" });
    setProgram({ ...program, meals: updatedMeals });
  };

  const removeMeal = (mealIndex: number) => {
    const updatedMeals = [...program.meals];
    updatedMeals.splice(mealIndex, 1);
    setProgram({ ...program, meals: updatedMeals });
  };

  const removeItemFromMeal = (mealIndex: number, itemIndex: number) => {
    const updatedMeals = [...program.meals];
    updatedMeals[mealIndex].items.splice(itemIndex, 1);
    setProgram({ ...program, meals: updatedMeals });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`https://ftserver-ym6z.onrender.com/updateNutritionProgram/${id}`, program);
      alert("تم حفظ البرنامج بنجاح ✅");
      setProgram({
        title: "",
        description: "",
        calories: "",
        price: "0",
        meals: [{ name: "", items: [{ food: "", quantity: "", unit: "" }] }],
      });
      navigate('/NutritionList')

    } catch (error) {
      console.error("خطأ أثناء الإرسال:", error);
      alert("فشل الإرسال ❌");
    }
  };

    useEffect(() => {
        if (id) {
          axios.get<{ data: NutritionProgram }>(`https://ftserver-ym6z.onrender.com/getNutritionProgramById/${id}`)
            .then(res => setProgram(res.data.data))
            .catch(err => console.error(err));
        }
    }, [id]);

  return (
    <ScreenWrapper>
    <div className="min-h-screen text-white px-6 py-8">
      <div className="max-w-3xl mx-auto bg-white bg-opacity-5 backdrop-blur-md rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-white">تعديل برنامج غذائي</h2>

        <form dir="rtl" onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-semibold">اسم البرنامج</label>
            <input
              type="text"
              name="title"
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={program.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">وصف البرنامج</label>
            <textarea
              name="description"
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={program.description}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">عدد السعرات</label>
            <input
              type="number"
              name="calories"
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={program.calories}
              onChange={handleChange}
              required
            />
          </div>

          {program.meals.map((meal, mealIndex) => (
            <div
              key={mealIndex}
              className="bg-gray-100/10 bg-opacity-10 p-4 rounded-lg border border-gray-600"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="w-full">
                  <label className="block mb-1 font-semibold">{`اسم الوجبة ${mealIndex + 1}`}</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={meal.name}
                    onChange={(e) => handleMealNameChange(mealIndex, e.target.value)}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="ml-2 mt-6 h-10 rounded bg-red-500 hover:bg-red-600 text-sm px-3"
                  onClick={() => removeMeal(mealIndex)}
                >
                  حذف الوجبة
                </button>
              </div>

              {meal.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex flex-wrap gap-2 mb-2 items-center">
                  <div>
                    <label className="block mb-1 text-sm">نوع الطعام</label>
                    <input
                      type="text"
                      className="w-36 px-3 py-2 rounded-md border border-gray-300 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={item.food}
                      onChange={(e) => handleItemChange(mealIndex, itemIndex, "food", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm">الكمية</label>
                    <input
                      type="text"
                      className="w-24 px-3 py-2 rounded-md border border-gray-300 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(mealIndex, itemIndex, "quantity", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm">الوحدة</label>
                    <input
                      type="text"
                      className="w-24 px-3 py-2 rounded-md border border-gray-300 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={item.unit}
                      onChange={(e) => handleItemChange(mealIndex, itemIndex, "unit", e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    className="mt-5 p-2 rounded bg-red-500 hover:bg-red-600 text-sm"
                    onClick={() => removeItemFromMeal(mealIndex, itemIndex)}
                  >
                    حذف
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="text-sm text-blue-300 hover:text-blue-500 mt-2"
                onClick={() => addItemToMeal(mealIndex)}
              >
                + إضافة عنصر
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addMeal}
            className="w-full py-2 rounded-md bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200 transition"
          >
            + إضافة وجبة
          </button>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md transition"
          >
            حفظ التعديلات
          </button>
        </form>
      </div>
    </div>
    </ScreenWrapper>
  );
}
