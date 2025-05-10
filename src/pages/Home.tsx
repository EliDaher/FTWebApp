import { useNavigate } from "react-router-dom";


export default function Home() {

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-950 to-gray-900 text-white flex flex-col">

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          FT
        </h1>
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Build Your Best Body
        </h2>
        <p className="text-gray-400 mb-8 max-w-2xl">
          Join our community to achieve your fitness goals with personalized plans and expert support.
        </p>
        <div className="flex space-x-4">
          <a
            onClick={()=>{
              navigate('/UserWorkout')
            }}
            className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center p-4 text-gray-500 text-sm">
        © 2025 Fitness WebApp. All rights reserved.
      </footer>
    </div>
  );
}
