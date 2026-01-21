import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Car, BookOpen, LogOut } from "lucide-react";
import toast from "react-hot-toast";

const UserLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar / Topbar */}
      <div
        className="
          w-full md:w-20
          h-16 md:h-auto
          bg-slate-900 text-white
          px-4 md:px-0
          py-0 md:py-6
          flex flex-row md:flex-col
          items-center
          justify-between md:justify-start
        "
      >
        {/* Logo */}
        <div className="md:mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">U</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-row md:flex-col gap-3 items-center">
          <NavLink
            to="/user/dashboard"
            title="Dashboard"
            className={({ isActive }) =>
              `w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl transition ${isActive ? "bg-white/10" : "hover:bg-slate-700"
              }`
            }
          >
            <LayoutDashboard size={20} />
          </NavLink>

          <NavLink
            to="/user/book"
            title="Book a Car"
            className={({ isActive }) =>
              `w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl transition ${isActive ? "bg-white/10" : "hover:bg-slate-700"
              }`
            }
          >
            <Car size={20} />
          </NavLink>

          <NavLink
            to="/user/bookings"
            title="My Bookings"
            className={({ isActive }) =>
              `w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl transition ${isActive ? "bg-white/10" : "hover:bg-slate-700"
              }`
            }
          >
            <BookOpen size={20} />
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="md:mt-auto">
          <button
            onClick={handleLogout}
            title="Logout"
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl transition hover:bg-red-500/20 text-red-400 hover:text-red-300"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 p-3 sm:p-6 bg-slate-50">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
