import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, X } from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:4000/api/users/get");
    setUsers(res.data.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createUser = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:4000/api/users/create", form);
      alert("User created successfully");

      setForm({ name: "", email: "", password: "", role: "user" });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Users</h1>
          <p className="text-sm text-slate-500">
            Manage all registered users
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700"
        >
          <Plus size={16} />
          Create User
        </button>
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="min-h-screen fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <form
            onSubmit={createUser}
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative"
          >
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-800">Create User</h2>
              <p className="text-sm text-slate-500 mt-1">
                Add a new user to the system
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              <div>
                <label className="text-xs text-slate-500">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-500">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-500">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-500">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl border text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}


      {/* Users Table */}
      <div className="bg-white rounded-2xl p-4 min-h-screen shadow-sm overflow-hidden">
        {/* Users Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-white rounded-2xl  shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{u.name}</h3>
                  <p className="text-sm text-slate-500">{u.email}</p>
                </div>

                <span
                  className={`px-2 py-1 rounded-full text-xs capitalize ${u.role === "admin"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-700"
                    }`}
                >
                  {u.role}
                </span>
              </div>

              <div className="mt-4 text-xs text-slate-400">
                User ID: {u.id}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Users;
