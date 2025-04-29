import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    navigate('/Home')
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-10 w-full max-w-md border border-white/20">
        <h2 className="text-4xl font-bold text-white text-center mb-8 tracking-tight">Welcome</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label className="text-sm text-white mb-2">Email Address</label>
            <input
              type="text"
              className="rounded-xl px-4 py-3 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-white mb-2">Password</label>
            <input
              type="password"
              className="rounded-xl px-4 py-3 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition"
              placeholder="••••••••"
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
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-white/60 mt-6">
          Don't have an account? <span className="underline cursor-pointer hover:text-white">Sign Up</span>
        </p>
      </div>
    </div>
  );
}
