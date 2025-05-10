import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate()
  const [ConfirmPass, setConfirmPass] = useState('');
  const [username, setUsername] = useState('');
  const [Fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await axios.post('https://ftserver-ym6z.onrender.com/SignUp', {
          username: username,
          password: password,
          fullname: Fullname,
          email: "eeli56315@gmail.com"
        });
    
        console.log('✅ Success:', response.data);
        navigate('/')

      } catch (error: any) {
      console.error('❌ Error:', error.response?.data || error.message);
      alert('حدث خطأ أثناء حفظ التمرين');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-10 w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-white text-center mb-8 tracking-tight">Welcome to FitnessTime</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label className="text-sm text-white mb-1 text-right mr-2">الاسم الثلاثي</label>
            <input
              type="text"
              className="rounded-xl px-4 py-3 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition"
              placeholder="الاسم الثلاثي"
              value={Fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-white mb-1 text-right mr-2">اسم المستخدم</label>
            <input
              type="username"
              className="rounded-xl px-4 py-3 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition"
              placeholder="اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          تملك حسابا بالفعل <span onClick={()=>{navigate('/')}} className="underline cursor-pointer hover:text-white">سجل الدخول</span>
        </p>
      </div>
    </div>
  );
}
