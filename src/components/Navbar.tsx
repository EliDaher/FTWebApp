import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { FaBars, FaDumbbell, FaHome, FaList, FaRunning, FaSignOutAlt, FaTimes, FaUsers } from 'react-icons/fa';
import logo from '../assets/exerciseImages/icon.png';

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userType } = useAuth();
  const [showSportMenu, setShowSportMenu] = useState(false);

  return (
    <>
      {/* زر القائمة - دائم الظهور */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`
          fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg
          transition-colors duration-300
          ${sidebarOpen ? 'bg-red-600 text-white' : 'bg-black/70 text-white'}
        `}
        aria-label="Toggle Sidebar"
      >
        {sidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
      </button>

      {/* الشريط الجانبي */}
      <aside className={`
        pt-2
        fixed top-0 right-0 h-full w-64 bg-gray-900/70 shadow-lg z-40
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* شعار واسم الموقع */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <h1 className="text-white font-Orbitron font-bold text-xl">Fitness Time</h1>
        </div>

        {/* عناصر القائمة */}
        <nav className="flex flex-col p-4 space-y-2 text-sm font-medium text-white">

          <Link
            to="Home"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded transition"
          >
            <FaHome /> الصفحة الرئيسية
          </Link>

          {/* الرياضة Dropdown */}
          <div>
            <button
              onClick={() => setShowSportMenu(!showSportMenu)}
              className="w-full flex justify-between items-center hover:bg-gray-700 p-2 rounded transition"
            >
              <span className="flex items-center gap-2"><FaDumbbell /> الرياضة</span>
              <svg
                className={`w-4 h-4 transition-transform ${showSportMenu ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${showSportMenu ? "max-h-96" : "max-h-0"}`}>
              <div className="flex flex-col pr-3 mt-1 space-y-1 border rounded-lg border-white/40">
                <Link to="UserWorkout" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-gray-700">
                  <FaRunning /> تمرين اليوم
                </Link>

                {userType === 'admin' && (
                  <>
                    <Link to="UsersPage" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-gray-700">
                      <FaUsers /> المستخدمين
                    </Link>
                    <Link to="Exercises" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-gray-700">
                      <FaDumbbell /> التمارين
                    </Link>
                    <Link to="WorkOuts" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-gray-700">
                      <FaList /> برامج التمارين
                    </Link>
                    <Link to="NutritionList" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-gray-700">
                      🥗 النظام الغذائي
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <Link
            to="/login"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded transition"
          >
            <FaSignOutAlt /> تسجيل خروج
          </Link>
        </nav>
      </aside>

      {/* تغطية الشاشة عند فتح الشريط الجانبي */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}
