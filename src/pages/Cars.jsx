import { useEffect, useState } from "react";
import axios from "axios";
import {
  Car,
  Plus,
  MapPin,
  CalendarClock,
  CheckCircle,
  XCircle,
  Wrench,
} from "lucide-react";

const Cars = () => {
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [cars, setCars] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [availabilityMap, setAvailabilityMap] = useState({});

  useEffect(() => {
    axios.get("http://localhost:4000/api/branches/get").then((res) => {
      const list = res.data.branches || [];
      setBranches(list);

      if (list.length > 0) {
        setBranchId(list[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!branchId) return;

    axios
      .get(`http://localhost:4000/api/cars/branch/${branchId}`)
      .then((res) => {
        setCars(res.data.cars || []);
        setAvailabilityMap({});
      });
  }, [branchId]);


  useEffect(() => {
    if (!from || !to || cars.length === 0) return;

    const checkAll = async () => {
      const res = await axios.post(
        "http://localhost:4000/api/bookings/check-multiple",
        {
          carIds: cars.map((c) => c.id),
          startAt: from,
          endAt: to,
        }
      );

      setAvailabilityMap(res.data);
    };

    checkAll();
  }, [from, to, cars]);

  const createCar = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:4000/api/cars/create", {
      name,
      branchId,
    });

    setName("");
    setShowForm(false);

    const res = await axios.get(
      `http://localhost:4000/api/cars/branch/${branchId}`
    );
    setCars(res.data.cars);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const renderStatus = (id) => {
    const info = availabilityMap[id];

    if (!info) return <span className="text-slate-400">—</span>;

    if (info.status === "available") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-50 text-green-700">
          <CheckCircle size={14} /> Free
        </span>
      );
    }

    if (info.status === "maintenance") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-yellow-50 text-yellow-700">
          <Wrench size={14} /> Maintenance
        </span>
      );
    }

    if (info.status === "unavailable") {
      return (
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-red-50 text-red-700">
            <XCircle size={14} /> Busy
          </span>

          {info.busySlots?.map((slot, i) => (
            <div key={i} className="text-xs text-slate-500">
              {formatDate(slot.startAt)} – {formatDate(slot.endAt)}
            </div>
          ))}
        </div>
      );
    }

    return <span className="text-slate-400">—</span>;
  };


  return (
    <>
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3">
          <form
            onSubmit={createCar}
            className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-sm space-y-4"
          >
            <h2 className="text-base sm:text-lg font-semibold text-slate-800">
              Add Car to {branches.find(b => b.id == branchId)?.name}
            </h2>

            <input
              type="text"
              placeholder="Car name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              required
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-3 py-2 rounded-lg border text-slate-600 hover:bg-slate-50 text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-5">
        {/* Header */}
        <header className="flex flex-col gap-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Car className="text-blue-600 w-6 h-6 sm:w-7 sm:h-7" />
            Cars
          </h1>

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
            {/* Branch */}
            <div className="relative h-11 w-full sm:w-auto group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition">
                <MapPin size={16} />
              </div>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="
          h-full w-full sm:w-56
          pl-10 pr-3
          rounded-xl
          bg-slate-50
          border border-slate-200
          text-sm
          shadow-inner
          outline-none
          transition-all
          focus:bg-white
          focus:border-blue-500
          focus:ring-4 focus:ring-blue-100
        "
              >
                <option value="">Select Branch</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* From */}
            <div className="relative h-11 w-full sm:w-auto group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition">
                <CalendarClock size={16} />
              </div>
              <input
                type="datetime-local"
                onChange={(e) => setFrom(e.target.value)}
                className="
          h-full w-full sm:w-56
          pl-10 pr-3
          rounded-xl
          bg-slate-50
          border border-slate-200
          text-sm
          shadow-inner
          outline-none
          transition-all
          focus:bg-white
          focus:border-blue-500
          focus:ring-4 focus:ring-blue-100
        "
              />
            </div>

            {/* To */}
            <div className="relative h-11 w-full sm:w-auto group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition">
                <CalendarClock size={16} />
              </div>
              <input
                type="datetime-local"
                onChange={(e) => setTo(e.target.value)}
                className="
          h-full w-full sm:w-56
          pl-10 pr-3
          rounded-xl
          bg-slate-50
          border border-slate-200
          text-sm
          shadow-inner
          outline-none
          transition-all
          focus:bg-white
          focus:border-blue-500
          focus:ring-4 focus:ring-blue-100
        "
              />
            </div>

            {/* Add */}
            <button
              disabled={!branchId}
              onClick={() => setShowForm(true)}
              className="
        h-11 w-full sm:w-auto
        inline-flex justify-center items-center gap-2
        rounded-xl
        bg-gradient-to-r from-blue-600 to-blue-500
        text-white
        px-5
        text-sm
        shadow-lg shadow-blue-200/50
        hover:from-blue-700 hover:to-blue-600
        transition-all
        disabled:opacity-50
      "
            >
              <Plus size={16} />
              Add Car
            </button>
          </div>
        </header>

        {/* Mobile Cards */}
        <div className="space-y-3 sm:hidden">
          {cars.map((c) => (
            <div key={c.id} className="bg-white rounded-xl shadow border border-gray-100 p-3">
              <div className="flex items-center gap-2 font-medium text-slate-700">
                <Car size={16} className="text-slate-400" />
                {c.name}
              </div>
              <div className="mt-2 text-sm">{renderStatus(c.id)}</div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-4 text-left">Car Name</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((c) => (
                <tr key={c.id} className="border-t hover:bg-slate-50 transition">
                  <td className="p-4 font-medium text-slate-700 flex items-center gap-2">
                    <Car size={16} className="text-slate-400" />
                    {c.name}
                  </td>
                  <td className="p-4">{renderStatus(c.id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Cars;
