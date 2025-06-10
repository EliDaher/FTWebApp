import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Chip } from '@mui/material'; // استخدام MUI أو أي مكتبة UI مشابهة
import axios from 'axios';

export default function CompleteData() {
  const navigate = useNavigate();
  const { userId } = useParams();
  

  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [job, setJob] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [healthConditions, setHealthConditions] = useState('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const suggestions = ['سكر', 'ضغط', 'دسك', 'انقراص فقرات', 'وراثة سكر في العائلة', 'حساسية من القمح'];
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCondition, setCustomCondition] = useState('');

  const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const isValidAge = calculateAge(date) >= 8;

  useEffect(() => {
    if (userId) setUsername(userId);
  }, []);

  const toggleCondition = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(selectedConditions.filter((c) => c !== condition));
    } else {
      setSelectedConditions([...selectedConditions, condition]);
    }
  };

  const clearData = () => {

    setUsername('');
    setAddress('');
    setJob('');
    setBloodType('');
    setHealthConditions('');
    setDate(new Date().toISOString().split('T')[0]);

  }

  const handleSubmit = async () => {
    if (loading) return;

    if (!isValidAge || !username || !address || !job) {
      alert('يرجى التحقق من البيانات المدخلة!');
      return;
    }

    console.log(healthConditions)

    try {
        setLoading(true);
        setError(false);

        await axios.post('https://ftserver-ym6z.onrender.com/updatePersonalDetails', {
          username,
          address,
          job,
          date: new Date(date), // الأفضل وضع اسم المفتاح بشكل واضح
          bloodType,
          healthConditions: selectedConditions.join(', ')
        });

        await axios.post('https://ftserver-ym6z.onrender.com/addWeight', {
          username,
          weight
        });

        await axios.post('https://ftserver-ym6z.onrender.com/addHeight', {
          username,
          height
        });

        navigate('/login');
        alert('تم الحفظ البيانات بنجاح')
        clearData()
    } catch (err) {
        console.error('Error:', err);
        setError(true);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white px-6 py-8">
      <div className="bg-gray-800 p-6 rounded-xl">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded mb-4">
            حدث خطأ، الرجاء إعادة المحاولة
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4 text-center">الرجاء إكمال البيانات الشخصية</h2>

        <form dir='rtl' onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="mb-3">
            <label className="block mb-1 mr-2">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              readOnly
              className="w-full p-2 bg-gray-700 rounded border border-gray-500"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 mr-2">العنوان</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-500"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 mr-2">تاريخ الميلاد</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full p-2 bg-gray-700 rounded border ${isValidAge ? 'border-gray-500' : 'border-red-500'}`}
            />
            <p className="mt-1">العمر: {calculateAge(date)} سنة</p>
          </div>

          <div className="mb-3">
            <label className="block mb-1 mr-2">الوظيفة</label>
            <input
              type="text"
              value={job}
              onChange={(e) => setJob(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-500"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 mr-2">زمرة الدم</label>
            <input
              type="text"
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-500"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 mr-2">الطول</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-500"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 mr-2">الوزن</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-500"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-2">الأمراض الخاصة</label>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((condition, index) => (
                <Chip
                  key={index}
                  label={condition}
                  clickable
                  onClick={() => toggleCondition(condition)}
                  color={selectedConditions.includes(condition) ? 'primary' : 'default'}
                  style={{
                    color: 'lightgray'
                  }}
                />
              ))}

              <Chip
                label={showCustomInput ? 'إلغاء' : 'غير ذلك'}
                clickable
                onClick={() => setShowCustomInput(!showCustomInput)}
                variant="outlined"
                style={{
                    color: 'lightgray'
                }}
              />
            </div>

            {showCustomInput && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="اكتب اسم الحالة المرضية"
                  value={customCondition}
                  onChange={(e) => setCustomCondition(e.target.value)}
                  className="w-full p-2 mt-2 bg-gray-700 rounded border border-gray-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customCondition.trim()) {
                      setSelectedConditions([...selectedConditions, customCondition.trim()]);
                      setCustomCondition('');
                    }
                  }}
                  className="mt-2 bg-purple-600 px-3 py-1 rounded text-white"
                >
                  إضافة
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 p-3 rounded text-white font-semibold"
          >
            {loading ? 'جاري الحفظ...' : 'حفظ البيانات'}
          </button>
        </form>
      </div>
    </div>
  );
}
