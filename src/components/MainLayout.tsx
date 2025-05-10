import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="pt-18">
        <Outlet />
      </main>
    </>
  );
}
