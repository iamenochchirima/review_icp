import { Outlet } from 'react-router-dom';
import Navbar from '../ui/Navbar';

export default function Layout() {
  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />
      <Outlet />
    </div>
  );
}
