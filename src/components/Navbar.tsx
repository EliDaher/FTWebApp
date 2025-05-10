import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import logo from '../assets/exerciseImages/icon.png'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { userType } = useAuth()

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-tr from-gray-600 via-gray-800 to-gray-600 border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-2">
        <div className='flex flex-row gap-2 justify-center items-center'>
          <div className="size-14">
            <img src={logo} alt="FT" className="w-full h-auto block object-contain rounded-full"/>
          </div>
          <h1 className="text-2xl font-extrabold tracking-wide text-white">Fitness WebApp</h1>
        </div>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white text-3xl focus:outline-none transition-transform duration-200"
        >
          {isOpen ? <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" className='fill-white'><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path></svg>
          : <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" className='fill-white'><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path></svg>}
        </button>

        {/* Navigation Links (Desktop + Animated Mobile) */}
        <nav
          className={`
            absolute md:static top-16 left-0 w-full md:w-auto bg-black md:bg-transparent 
            flex flex-col md:flex-row items-start md:items-center 
            md:space-x-6 space-y-4 md:space-y-0 px-6 py-4 md:p-0 
            transition-all duration-300 ease-in-out 
            ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'} 
            md:opacity-100 md:translate-y-0 md:pointer-events-auto
          `}
          dir='rtl'
        >
          <Link
            to="Home"
            onClick={() => setIsOpen(false)}
            className={`text-gray-300 hover:text-white transition-colors duration-300 text-lg w-full md:w-auto`}
          >
            الصفحة الرئيسية
          </Link>
          <Link
            to="UserWorkout"
            onClick={() => setIsOpen(false)}
            className={`text-gray-300 hover:text-white transition-colors duration-300 text-lg w-full md:w-auto`}
          >
            تمرين اليوم
          </Link>
          <Link
            to="UsersPage"
            onClick={() => setIsOpen(false)}
            className={`${userType == `admin` ? `block` : `hidden`} text-gray-300 hover:text-white transition-colors duration-300 text-lg w-full md:w-auto`}
          >
            المستخدمين
          </Link>
          <Link
            to="Exercises"
            onClick={() => setIsOpen(false)}
            className={`${userType == `admin` ? `block` : `hidden`} text-gray-300 hover:text-white transition-colors duration-300 text-lg w-full md:w-auto`}
          >
            التمارين
          </Link>
          <Link
            to="WorkOuts"
            onClick={() => setIsOpen(false)}
            className={`${userType == `admin` ? `block` : `hidden`} text-gray-300 hover:text-white transition-colors duration-300 text-lg w-full md:w-auto`}
          >
            برامج التمارين
          </Link>
          <Link
            to=""
            onClick={() => setIsOpen(false)}
            className={` text-gray-300 hover:text-white transition-colors duration-300 text-lg w-full md:w-auto`}
          >
            تسجيل خروج
          </Link>
        </nav>
      </div>
    </header>
  );
}
