import { useEffect } from "react";
import axios from "axios";

type CategoryInputProps = {
  category: string;
  setCategory: (value: string) => void;
  type: string;
  suggestions: string[];
  setSuggestions: (items: string[]) => void;
  className?: string;
};

export default function CategoryInput({
  category,
  setCategory,
  type,
  suggestions,
  setSuggestions,
  className = "",
}: CategoryInputProps) {
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get<string[]>(`https://ftserver-ym6z.onrender.com/${type}Categories`);
        setSuggestions(res.data);
      } catch (err) {
        console.error("فشل تحميل التصنيفات:", err);
      }
    };

    void fetchCategories();
  }, [setSuggestions, type]);

  return (
    <div className={`w-full ${className}`}>
      <label className="mb-2 mr-1 block text-sm font-semibold text-slate-100">التصنيف</label>
      <input
        type="text"
        className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 text-slate-100 placeholder:text-slate-300/70 hover:border-white/35"
        placeholder="قوة، كارديو، ..."
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        list="category-suggestions"
      />

      <datalist id="category-suggestions">
        {suggestions.map((suggestion) => (
          <option key={suggestion} value={suggestion} />
        ))}
      </datalist>
    </div>
  );
}
