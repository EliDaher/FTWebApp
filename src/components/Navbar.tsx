import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-bl from-black via-gray-950 to-gray-900 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-extrabold tracking-wide text-white">Fitness WebApp</h1>
        <nav className="space-x-6">
          <Link 
            to="Home" 
            className="text-gray-300 hover:text-white transition-colors duration-300 text-lg"
          >
            Home
          </Link>
          <Link 
            to="Exercise" 
            className="text-gray-300 hover:text-white transition-colors duration-300 text-lg"
          >
            Exercise
          </Link>
          <Link 
            to="" 
            className="text-gray-300 hover:text-white transition-colors duration-300 text-lg"
          >
            Log Out
          </Link>
          {/*<Link 
            to="/dashboard" 
            className="text-gray-300 hover:text-white transition-colors duration-300 text-lg"
          >
            Dashboard
          </Link>*/}
        </nav>
      </div>
    </header>
  );
}
