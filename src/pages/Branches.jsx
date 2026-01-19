import { useEffect, useState } from "react";
import axios from "axios";

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    location: "",
  });

  const fetchBranches = async () => {
    const res = await axios.get("http://localhost:4000/api/branches/get");
    setBranches(res.data.branches);
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createBranch = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:4000/api/branches/create", form);
      alert("Branch created successfully");

      setForm({ name: "", location: "" });
      setShowForm(false);
      fetchBranches();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create branch");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Branches</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Create Branch
        </button>
      </div>

      {/* Create Branch Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form
            onSubmit={createBranch}
            className="bg-white p-6 rounded-xl w-[360px]"
          >
            <h2 className="text-xl font-semibold mb-4">Create Branch</h2>

            <div className="mb-3">
              <label className="text-sm">Branch Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-sm">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Branches Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Location</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-3">{b.name}</td>
                <td className="p-3">{b.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Branches;
