import { useEffect, useState } from "react";
import { ApiService } from "../ApiService";
import {
  Plus,
  Map,
  XCircle,
  Building,
  Settings,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    location: "",
  });

  const fetchBranches = async () => {
    try {
      setLoading(true)
      const res = await ApiService.get("/api/branches/get");
      setBranches(res.branches);
    }
    catch (err) {
      toast.error("Something went wrong ", err.message)
    }
    finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreate = () => {
    setEditingBranch(null);
    setForm({ name: "", location: "" });
    setShowForm(true);
  };

  const openEdit = (branch) => {
    setEditingBranch(branch);
    setForm({ name: branch.name, location: branch.location });
    setShowForm(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(
      editingBranch ? "Updating branch..." : "Creating branch..."
    );

    try {
      setLoading(true)
      if (editingBranch) {
        await ApiService.put(`/api/branches/update/${editingBranch.id}`, form);
        toast.success("Branch updated successfully", { id: toastId });
      } else {
        await ApiService.post("/api/branches/create", form);
        toast.success("Branch created successfully", { id: toastId });
      }

      setShowForm(false);
      setEditingBranch(null);
      setForm({ name: "", location: "" });
      fetchBranches();
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


  const deleteBranch = async (id) => {
    if (!confirm("Are you sure you want to delete this branch?")) return;

    const toastId = toast.loading("Deleting branch...");

    try {
      setLoading(true)
      await ApiService.delete(`/api/branches/delete/${id}`);
      toast.success("Branch deleted successfully", { id: toastId });
      fetchBranches();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete branch",
        { id: toastId }
      );
    }
    finally {
      setLoading(false)
    }
  };

  return (
    <>
      {loading ?
        <div className="min-h-screen flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        :
        <div className="my-20 md:my-0 flex flex-col min-h-screen space-y-6">
          {/* Header */}
          <header className="flex justify-between gap-4 items-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
              <Map className="text-blue-600 w-6 h-6 sm:w-7 sm:h-7" />
              Branches
            </h1>

            <div className="flex justify-end">
              <button
                onClick={openCreate}
                className="inline-flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2.5 text-sm shadow-lg shadow-blue-200/50 hover:from-blue-700 hover:to-blue-600 transition-all"
              >
                <Plus size={16} />
                Create Branch
              </button>
            </div>
          </header>

          <div className={branches.length != 0 ? "" :"flex-1 flex  justify-center items-center "}>

            {/* Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black/50 min-h-screen backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <form
                  onSubmit={submitForm}
                  className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6"
                >
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingBranch(null);
                      }}
                      className="absolute top-0 right-0 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                      title="Close"
                    >
                      <XCircle size={20} />
                    </button>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-slate-800 mb-2">
                        {editingBranch ? "Edit Branch" : "Create New Branch"}
                      </h2>
                      <p className="text-slate-500 text-sm">
                        {editingBranch ? "Update branch details" : "Add a new branch to the system"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Branch Name */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Branch Name
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Enter branch name"
                          className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Location
                      </label>
                      <div className="relative">
                        <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          name="location"
                          value={form.location}
                          onChange={handleChange}
                          placeholder="Enter location"
                          className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingBranch(null);
                      }}
                      className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-200/50 hover:from-blue-700 hover:to-blue-600 transition-all"
                    >
                      {editingBranch ? "Update Branch" : "Create Branch"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Branches Cards Grid */}
            {branches.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {branches.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5 hover:shadow-xl transition-all duration-200">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Map className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 text-lg">{b.name}</h3>
                        <p className="text-slate-500 text-sm">{b.location || "Location not specified"}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(b)}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Settings size={16} />
                      </button>
                      <button
                        onClick={() => deleteBranch(b.id)}
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
                      <Building className="text-slate-400" size={14} />
                      <span className="text-sm text-slate-600">{b.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Map className="text-slate-400" size={14} />
                      <span className="text-sm text-slate-600">{b.location || "Not specified"}</span>
                    </div>
                  </div>

                  {/* Branch ID */}
                  <div className="text-xs text-slate-400">
                    Branch ID: {b.id}
                  </div>
                </div>
              ))}
            </div>
              :
              <div className="flex-1 w-full flex flex-col text-gray-700 justify-center items-center h-full">
                <Building2 size={40} />
                <span>No Branches Available</span>
              </div>
            }
          </div>
        </div>}

    </>
  );
};

export default Branches;
