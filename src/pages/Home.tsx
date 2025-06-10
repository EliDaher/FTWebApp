import { useNavigate } from "react-router-dom";
import ScreenWrapper from "../components/ScreenWrapper";


export default function Home() {

  const navigate = useNavigate()

  return (
    <ScreenWrapper>
      <div className="h-screen text-white flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {/*<h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          FT
        </h1>*/}
        <h2 className="text-5xl md:text-6xl font-Orbitron mb-6 leading-tight">
          <strong>
            Fitness
          </strong> Time <br />
          <span className="font-cairo">
            وقت اللياقة
          </span>
        </h2>
        <p dir="rtl" className="text-2xl font-cairo text-gray-400 mb-8 max-w-2xl">
          لنكون معا في القمة <br/>
          8 سنوات من النجاح والاستمرار  
        </p>
        <div className="flex space-x-4">
          <button
            onClick={()=>{
              navigate('/UserWorkout')
            }}
            className="bg-white text-black px-12 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            ابدأ
          </button>
        </div>
      </section>

      {/* Footer
      <footer className="text-center p-4 text-gray-500 text-sm">
        © 2025 Fitness WebApp. All rights reserved.
      </footer> */}
    </div>
    </ScreenWrapper>
  );
}
