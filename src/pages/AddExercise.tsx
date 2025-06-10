import React, { useState } from 'react';
import axios from 'axios';

// FilePond
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import CategoryInput from '../components/UI/CategoryInput';
import ScreenWrapper from '../components/ScreenWrapper';
import HeaderCard from '../components/UI/HeaderCard';
import BodyCard from '../components/UI/BodyCard';
import Input from '../components/UI/Input';

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

export default function Exercise() {
  const [exerciseName, setExerciseName] = useState('');
  const [category, setCategory] = useState('');
  const [bodyPart, setBodyPart] = useState('');
  const [description, setDescription] = useState('');
  const [commonMistakes, setCommonMistakes] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);


  const muscleGroups = ["صدر", "ظهر", "ارجل امامي", "ارجل خلفي", "باي سيبس", "تراي سيبس", "كتف", "معدة", "ترابيز", "ورك", "بطات", "سواعد", "كارديو"]; 

  const clearData = () => {
    setExerciseName('');
    setCategory('');
    setBodyPart('');
    setDescription('');
    setCommonMistakes('');
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /*if (!imageFile) {
      alert('الرجاء اختيار صورة.');
      return;
    }*/

    const formData = new FormData();
    formData.append('exerciseName', exerciseName);
    formData.append('category', category);
    formData.append('bodyPart', bodyPart);
    formData.append('description', description);
    formData.append('commonMistakes', commonMistakes);
    imageFile && formData.append('imageFile', imageFile);

    try {
      const response = await axios.post('https://ftserver-ym6z.onrender.com/api/exercises', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      handleSaveCategory()
      console.log('✅ Success:', response.data);
      alert('تم حفظ التمرين بنجاح');
      clearData();
    } catch (error: any) {
      console.error('❌ Error:', error.response?.data || error.message);
      alert('حدث خطأ أثناء حفظ التمرين');
    }
  };

  const handleSaveCategory = async () => {
      const newCategory = category.trim().replace(",", "");
      if (!newCategory) return;
      if (!suggestions.includes(newCategory)) {
          try {
              await axios.post("https://ftserver-ym6z.onrender.com/AddExerciseCategories", {
                  categoryName: newCategory,
              });
              setSuggestions([...suggestions, newCategory]);
          } catch (err) {
              console.error("فشل في إضافة الفئة:", err);
          }
      }
      setCategory(newCategory);
  };

  return (
    <ScreenWrapper>
    <div dir='rtl' className="">
      <HeaderCard>
        <h1 className='text-3xl font-bold text-center'>اضافة تمرين</h1>
      </HeaderCard>
      <BodyCard>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-[90%] mx-auto mt-5">
        <div className="">
          <Input
            label='اسم التمرين'
            name='ExerciseName'
            type="text"
            placeholder="Push-Up"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <CategoryInput category={category} setCategory={setCategory} type={'exercise'} suggestions={suggestions} setSuggestions={setSuggestions}/>
        </div>

        <div className="flex flex-col">
          <label className="text-white mb-2 ml-3">العضلة المستهدفة</label>
          <select
            className="rounded px-4 py-3 bg-blue-200/20 border text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition"
            value={bodyPart}
            onChange={(e) => setBodyPart(e.target.value)}
          >
            {
              muscleGroups.map(ele => {

                return <option className='text-black bg-black/20' value={ele}>{ele}</option>

              })
            }
          </select>
        </div>

        <div className="flex flex-col">
          <label className=" text-white mb-2 ml-3">وصف التمرين</label>
          <textarea
            className="rounded px-4 py-3 bg-blue-200/20 border text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className=" text-white mb-2 ml-3">الاخطاء الشائعة</label>
          <textarea
            className="rounded px-4 py-3 bg-blue-200/20 border text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition"
            value={commonMistakes}
            onChange={(e) => setCommonMistakes(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className=" text-white mb-2 ml-3">صورة التمرين</label>
          <FilePond
            files={imageFile ? [imageFile] : []}
            onupdatefiles={(fileItems) => {
              const file = fileItems[0]?.file as File;
              setImageFile(file || null);
            }}
            allowMultiple={false}
            acceptedFileTypes={['image/*']}
            labelIdle='اسحب الصورة هنا أو <span class="filepond--label-action">اختر من الجهاز</span>'
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-500 transition"
        >
          Save
        </button>
      </form>
      </BodyCard>
    </div>
    </ScreenWrapper>
  );
}
