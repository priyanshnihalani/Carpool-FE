import { useEffect, useState } from "react";
import {
  Plus,
  X,
  User,
  Mail,
  Shield,
  Settings,
  XCircle,
  Users as UsersIcon,
} from "lucide-react";
import { ApiService } from "../ApiService";
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await ApiService.get("/api/users/get");
      setUsers(res.users);
    }
    catch (err) {
      toast.error("Something went wrong", err?.message)
    }
    finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitUser = async (e) => {
    e.preventDefault();

    const toastId = toast.loading(
      editingUser ? "Updating user..." : "Creating user..."
    );

    try {
      setLoading(true)
      if (editingUser) {
        await ApiService.put(`/api/users/update/${editingUser.id}`, form);
        toast.success("User updated successfully", { id: toastId });
      } else {
        await ApiService.post("/api/users/create", form);
        toast.success("User created successfully", { id: toastId });
      }

      setForm({ name: "", email: "", role: "user" });
      setEditingUser(null);
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Operation failed",
        { id: toastId }
      );
    }
    finally {
      setLoading(false)
    }
  };

  const openCreate = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", role: "user" });
    setShowForm(true);
  };

  const openEdit = (u) => {
    setEditingUser(u);
    setForm({ name: u.name, email: u.email, role: u.role });
    setShowForm(true);
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;

    const toastId = toast.loading("Deleting user...");

    try {
      setLoading(true)
      await ApiService.delete(`/api/users/delete/${id}`);
      toast.success("User deleted successfully", { id: toastId });
      fetchUsers();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete user",
        { id: toastId }
      );
    }
    finally {
      setLoading(false)
    }
  };


  return (
    <>
      {
        loading ?
          <div className="min-h-screen flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          :

          <div className={users.length != 0 ? 'space-y-10 w-full  my-20 md:my-0' : `min-h-screen flex flex-col`}>
            {/* Header */}
            <header className="flex gap-4  items-center justify-between">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
                <UsersIcon className="text-blue-600 w-6 h-6 sm:w-7 sm:h-7" />
                Users
              </h1>

              <div className="flex justify-end">
                <button
                  onClick={openCreate}
                  className="inline-flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2.5 text-sm shadow-lg shadow-blue-200/50 hover:from-blue-700 hover:to-blue-600 transition-all"
                >
                  <Plus size={16} />
                  Create User
                </button>
              </div>
            </header>

            <div className={users.length == 0 && `flex-1 flex justify-center items-center`}>

              {/* Create / Edit Form Modal */}
              {showForm && (
                <div className="min-h-screen fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
                  <form
                    onSubmit={submitUser}
                    className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingUser(null);
                      }}
                      className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
                    >
                      <X size={20} />
                    </button>

                    {/* Header */}
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold text-slate-800">
                        {editingUser ? "Edit User" : "Create User"}
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">
                        {editingUser
                          ? "Update user details"
                          : "Add a new user to the system"}
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
                        onClick={() => {
                          setShowForm(false);
                          setEditingUser(null);
                        }}
                        className="px-5 py-2.5 rounded-xl border text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                      >
                        {editingUser ? "Update" : "Create"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Users Cards Grid */}
              {users.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {users.map((u) => (
                  <div key={u.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5 hover:shadow-xl transition-all duration-200">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <User className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 text-lg">{u.name}</h3>
                          <p className="text-slate-500 text-sm">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(u)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Settings size={16} />
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Mail className="text-slate-400" size={14} />
                        <span className="text-sm text-slate-600">{u.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="text-slate-400" size={14} />
                        <span className="text-sm text-slate-600 capitalize">{u.role}</span>
                      </div>
                    </div>

                    {/* Role Badge */}
                    <div className="mb-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${u.role === "admin"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-700"
                          }`}
                      >
                        {u.role}
                      </span>
                    </div>

                    {/* User ID */}
                    <div className="text-xs text-slate-400">
                      User ID: {u.id}
                    </div>
                  </div>
                ))}
              </div>
                :
                <div className="w-full flex flex-col text-gray-700 justify-center items-center">
                  <UsersIcon size={40} />
                  <span>No Branches Available</span>
                </div>
              }
            </div>
          </div>

      }
    </>
  );

};

export default Users;
