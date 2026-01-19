import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Users from "./pages/Users";
import Cars from "./pages/Cars";
import Bookings from "./pages/Bookings";
import Branches from "./pages/Branches";
import AdminLayout from "./pages/AdminLayout";
import { Navigate } from "react-router-dom";
import BookCar from "./pages/BookCar";
import MyBookings from "./pages/MyBookings";
import UserLayout from "./pages/UserLayout";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="cars" element={<Cars />} />
          <Route path="branches" element={<Branches />} />
          <Route path="bookings" element={<Bookings />} />
        </Route>
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="book" element={<BookCar />} />
          <Route path="bookings" element={<MyBookings />} />
        </Route>
        <Route path="/user/dashboard" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
