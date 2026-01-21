import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Users from "./pages/Users";
import Cars from "./pages/Cars";
import Bookings from "./pages/Bookings";
import Branches from "./pages/Branches";
import BookCar from "./pages/BookCar";
import MyBookings from "./pages/MyBookings";

// Layouts
import AdminLayout from "./pages/AdminLayout";
import UserLayout from "./pages/UserLayout";

import { Toaster } from "react-hot-toast";

function App() {
  const router = createBrowserRouter([
    /* ---------- PUBLIC ---------- */
    {
      path: "/",
      element: <Login />,
    },

    /* ---------- ADMIN ---------- */
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { index: true, element: <Navigate to="dashboard" /> },
        { path: "dashboard", element: <AdminDashboard /> },
        { path: "users", element: <Users /> },
        { path: "cars", element: <Cars /> },
        { path: "branches", element: <Branches /> },
        { path: "bookings", element: <Bookings /> },
      ],
    },

    /* ---------- USER ---------- */
    {
      path: "/user",
      element: <UserLayout />,
      children: [
        { path: "dashboard", element: <UserDashboard /> },
        { path: "book", element: <BookCar /> },
        { path: "bookings", element: <MyBookings /> },
      ],
    },

    /* ---------- FALLBACK ---------- */
    {
      path: "*",
      element: <h1>404 - Page Not Found</h1>,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
