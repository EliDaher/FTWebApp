import React, { useState } from 'react';
import axios from 'axios';

// FilePond
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

export default function Exercise() {
  const [exerciseName, setExerciseName] = useState('');
  const [category, setCategory] = useState('');
  const [bodyPart, setBodyPart] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [description, setDescription] = useState('');
  const [commonMistakes, setCommonMistakes] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const difficultyList = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
  ];

  const clearData = () => {
    setExerciseName('');
    setCategory('');
    setBodyPart('');
    setDifficulty('');
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
    formData.append('difficulty', difficulty);
    formData.append('description', description);
    formData.append('commonMistakes', commonMistakes);
    imageFile && formData.append('imageFile', imageFile);

    try {
      const response = await axios.post('https://ftserver-ym6z.onrender.com/api/exercises', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Success:', response.data);
      alert('تم حفظ التمرين بنجاح');
      clearData();
    } catch (error: any) {
      console.error('❌ Error:', error.response?.data || error.message);
      alert('حدث خطأ أثناء حفظ التمرين');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col">
      <h2 className="text-4xl font-bold text-white text-center mb-8 mt-3 tracking-tight">Welcome</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-[80%] mx-auto">
        <div className="flex flex-col">
          <label className="text-sm text-white mb-2 ml-3">Exercise Name</label>
          <input
            type="text"
            className="rounded-xl px-4 py-3 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition"
            placeholder="Push-Up"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-white mb-2 ml-3">Category</label>
          <input
            type="text"
            className="rounded-xl px-4 py-3 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition"
            placeholder="Strength, Cardio, ..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-white mb-2 ml-3">Body part</label>
          <input
            type="text"
            className="rounded-xl px-4 py-3 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition"
            placeholder="Chest, Legs, ..."
            value={bodyPart}
            onChange={(e) => setBodyPart(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-around">
          {difficultyList.map((item) => (
            <div className="flex flex-row gap-2" key={item.value}>
              <input
                name="difficulty"
                type="radio"
                value={item.value}
                id={item.value}
                checked={difficulty === item.value}
                onChange={(e) => setDifficulty(e.target.value)}
              />
              <label htmlFor={item.value}>{item.label}</label>
            </div>
          ))}
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-white mb-2 ml-3">Description</label>
          <textarea
            className="rounded-xl px-4 py-3 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-white mb-2 ml-3">Common Mistakes</label>
          <textarea
            className="rounded-xl px-4 py-3 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition"
            value={commonMistakes}
            onChange={(e) => setCommonMistakes(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-white mb-2 ml-3">Upload Image</label>
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
          className="bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition mt-4"
        >
          Save
        </button>
      </form>
    </div>
  );
}
