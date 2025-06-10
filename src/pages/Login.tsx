import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ScreenWrapper from '../components/ScreenWrapper';

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        const response = await axios.post('https://ftserver-ym6z.onrender.com/login', {
          username: username,
          password: password
        });
    
        console.log('✅ Success:', response.data);
        login(response.data.userData)
        navigate('/Home')

      } catch (error: any) {
      console.error('❌ Error:', error.response?.data || error.message);
      alert('خطأ في اسم المستخدم او كلمة المرور');
    }

  };

  return (
    <ScreenWrapper>
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl px-5 py-10  w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-white text-center mb-8 tracking-tight font-Orbitron">Welcome to FitnessTime</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label className="text-sm text-white mb-2 text-right mr-2">اسم المستخدم</label>
            <input
              type="text"
              className="rounded-xl px-4 py-3 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition"
              placeholder=""
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-white mb-2 text-right mr-2">كلمة المرور</label>
            <input
              type="password"
              className="rounded-xl px-4 py-3 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          لا تملك حساب ؟ <span onClick={()=>{navigate('/SignUP')}} className="underline cursor-pointer hover:text-white">اضغط لإنشاء حساب جديد</span>
        </p>
      </div>
    </div>
    </ScreenWrapper>
  );
}
