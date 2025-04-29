import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Exercise from './pages/Exercise';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/Home" element={<Home />} />
          <Route path="/Exercise" element={<Exercise />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
