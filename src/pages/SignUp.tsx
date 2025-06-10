import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '../components/ScreenWrapper';

export default function SignUp() {
  const navigate = useNavigate()
  const [ConfirmPass, setConfirmPass] = useState('');
  const [username, setUsername] = useState('');
  const [Fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState('');

  
  const convertToEnglishNumbers = (text: string) => {
    return text.replace(/[\u0660-\u0669]/g, (d) =>
      String.fromCharCode(d.charCodeAt(0) - 0x0660 + 48)
    );
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await axios.post('https://ftserver-ym6z.onrender.com/SignUp', {
          username: username,
          password: password,
          fullname: Fullname,
          number: number,
        });
    
        console.log('✅ Success:', response.data);
        navigate(`/CompleteData/${username}`)

      } catch (error: any) {
      console.error('❌ Error:', error.response?.data || error.message);
      error.response?.data.error.includes('Username')  ? 
        alert('الاسم موجود بالفعل')
      : alert('الرجاء التأكد من البيانات المدخلة');
    }
  };

  return (
    <ScreenWrapper>
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl py-10 px-5 w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-white text-center mb-8 tracking-tight font-Orbitron">Welcome to FitnessTime</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label className="text-sm text-white mb-1 text-right mr-2">الاسم الثلاثي</label>
            <input
              type="text"
              className="rounded-xl px-4 py-3 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition"
              placeholder="الاسم الثلاثي"
              value={Fullname}
              onChange={(e) => {setFullname(e.target.value); setUsername(e.target.value)}}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-white mb-1 text-right mr-2">رقم الجوال</label>
            <input
              type="number"
              className="rounded-xl px-4 py-3 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition"
              placeholder="رقم الجوال"
              value={number}
              onChange={(e) => setNumber(convertToEnglishNumbers(e.target.value))}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-white mb-1 text-right mr-2">كلمة السر</label>
            <input
              type="password"
              className="rounded-xl px-4 py-3 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-white mb-1 text-right mr-2">تأكيد كلمة المرور</label>
            <input
              type="password"
              className="rounded-xl px-4 py-3 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition"
              placeholder="••••••••"
              value={ConfirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition mt-4"
            onClick={()=>{
                
            }}
          >
            تسجيل الدخول
          </button>
        </form>

        <p className="text-center text-sm text-white/60 mt-6">
          تملك حسابا بالفعل <span onClick={()=>{navigate('/login')}} className="underline cursor-pointer hover:text-white">سجل الدخول</span>
        </p>
      </div>
    </div>
    </ScreenWrapper>
  );
}
