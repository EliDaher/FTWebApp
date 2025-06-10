import { useEffect } from "react";
import axios from "axios";

export default function CategoryInput({ category, setCategory, type, suggestions, setSuggestions, className }: any) {

    // جلب الفئات الموجودة عند التحميل
    useEffect(() => {
        const fetchCategories = async () => {
          try {
            const res = await axios.get(`https://ftserver-ym6z.onrender.com/${type}Categories`); // غيّر المسار حسب API عندك
            setSuggestions(res.data); // نتوقع مصفوفة مثل ["strength", "cardio"]
          } catch (err) {
            console.error("فشل في جلب الفئات:", err);
          }
        };

        fetchCategories();
    }, []);

    

    return (
        <>
          <label className="text-white mb-2 ml-3">فئة التمرين</label>
          <input
            type="text"
            className={`rounded px-4 py-3 bg-blue-200/20 border text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition ${className}`}
            placeholder="Strength, Cardio, ..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            list="category-suggestions"
          />

          <datalist id="category-suggestions">
            {suggestions.map((sug: any) => (
              <option key={sug} value={sug} />
            ))}
          </datalist>
        </>
    );
}
