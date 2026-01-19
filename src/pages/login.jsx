import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Car, LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/users/login",
        { email, password }
      );

      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-slate-900 rounded-2xl mb-4 shadow">
            <Car className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">CarPool Book</h1>
          <p className="text-slate-500 mt-2">
            Branch-Based Office Car Booking System
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl  shadow-sm p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Welcome Back</h2>
            <p className="text-sm text-slate-500">
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm text-slate-600">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-slate-600">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 transition disabled:opacity-60"
            >
              <LogIn className="h-4 w-4" />
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

};

export default Login;
