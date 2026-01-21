import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Car,
  Building2,
  BookOpen,
  LogOut,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";

const AdminLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const navItem = (isActive) =>
    `w-12 h-12 flex items-center justify-center rounded-xl transition ${isActive ? "bg-white/10" : "hover:bg-slate-700"
    }`;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div
        className="
    fixed top-0 left-0 right-0 z-50
    md:static md:w-20 md:min-h-screen
    h-16 md:h-auto
    bg-slate-900 text-white
    flex flex-row md:flex-col
    items-center
    justify-between md:justify-start
    px-4 md:px-0
    py-0 md:py-6
  "
      >
        {/* Logo (hidden on mobile) */}
        <div className="hidden md:block mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Shield size={18} />
          </div>
        </div>

        <nav
          className="
            flex flex-row md:flex-col
            gap-3
            w-full
            items-center
            justify-around md:justify-start
            flex-1
          "
        >
          <NavLink to="/admin/dashboard" title="Dashboard" className={({ isActive }) => navItem(isActive)}>
            <LayoutDashboard size={20} />
          </NavLink>

          <NavLink to="/admin/users" title="Users" className={({ isActive }) => navItem(isActive)}>
            <Users size={20} />
          </NavLink>

          <NavLink to="/admin/cars" title="Cars" className={({ isActive }) => navItem(isActive)}>
            <Car size={20} />
          </NavLink>

          <NavLink to="/admin/branches" title="Branches" className={({ isActive }) => navItem(isActive)}>
            <Building2 size={20} />
          </NavLink>

          <NavLink to="/admin/bookings" title="Bookings" className={({ isActive }) => navItem(isActive)}>
            <BookOpen size={20} />
          </NavLink>
        </nav>

        {/* Logout (desktop only at bottom) */}
        <div className="hidden md:block mt-auto">
          <button
            onClick={logout}
            title="Logout"
            className="w-12 h-12 flex items-center justify-center rounded-xl transition hover:bg-red-500/20 text-red-400 hover:text-red-300"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Main Area */}
      <main className="flex-1 p-4 sm:p-6 bg-slate-50 pb-20 md:pb-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
