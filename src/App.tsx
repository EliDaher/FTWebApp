import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import AddExercise from './pages/AddExercise';
import Exercises from './pages/Exercises';
import ExerciseDetails from './pages/ExerciseDetails';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/Home" element={<Home />} />
          <Route path="/AddExercise" element={<AddExercise />} />
          <Route path="/Exercises" element={<Exercises />} />
          <Route path="/ExerciseDetails/:exerciseName" element={<ExerciseDetails />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
