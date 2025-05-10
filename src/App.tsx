import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import AddExercise from './pages/AddExercise';
import Exercises from './pages/Exercises';
import ExerciseDetails from './pages/ExerciseDetails';
import WorkOuts from './pages/WorkOuts';
import AddWorkOut from './pages/AddWorkOut';
import WorkOutDetails from './components/WorkOutDetails';
import EditWorkout from './components/EditWorkout';
import UsersPage from './pages/UsersPage';
import UserDetailsPage from './components/UserDetails';
import SignUp from './pages/SignUp';
import UserWorkout from './pages/UserWorkout';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/SignUP" element={<SignUp />} />
        <Route element={<MainLayout />}>
          <Route path="/Home" element={<Home />} />
          <Route path="/AddExercise" element={<AddExercise />} />
          <Route path="/Exercises" element={<Exercises />} />
          <Route path="/WorkOuts" element={<WorkOuts />} />
          <Route path="/AddWorkOut" element={<AddWorkOut />} />
          <Route path="/WorkOutDetails" element={<WorkOutDetails />} />
          <Route path="/editWorkout" element={<EditWorkout />} />
          <Route path="/ExerciseDetails/:exerciseName" element={<ExerciseDetails />} />
          <Route path="/UsersPage" element={<UsersPage />} />
          <Route path="/user/:id" element={<UserDetailsPage />} />
          <Route path="/UserWorkout" element={<UserWorkout />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
