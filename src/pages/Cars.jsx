import { useEffect, useState } from "react";
import {
  Car,
  Plus,
  MapPin,
  CalendarClock,
  CheckCircle,
  XCircle,
  Wrench,
  Palette,
  Hash,
  Calendar,
  Building,
  Settings,
} from "lucide-react";
import { ApiService } from "../ApiService";

const emptyForm = {
  name: "",
  status: "available",
  carCompany: "",
  vehicleType: "hatchback",
  carModel: "",
  chassisNumber: "",
  carYear: "",
  carColor: "",
  carNumber: "",
};

const Cars = () => {
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [cars, setCars] = useState([]);
  const [editingCar, setEditingCar] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState(emptyForm);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [availabilityMap, setAvailabilityMap] = useState({});

  const updateForm = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  useEffect(() => {
    ApiService.get("/api/branches/get").then((res) => {
      const list = res.branches || [];
      setBranches(list);
      if (list.length > 0) setBranchId(list[0].id);
    });
  }, []);

  useEffect(() => {
    if (!branchId) return;
    ApiService.get(`/api/cars/branch/${branchId}`).then((res) => {
      setCars(res.cars || []);
      setAvailabilityMap({});
    });
  }, [branchId]);

  useEffect(() => {
    if (!from || !to || cars.length === 0) return;

    const checkAll = async () => {
      const res = await ApiService.post("/api/bookings/check-multiple", {
        carIds: cars.map((c) => c.id),
        startAt: from,
        endAt: to,
      });
      setAvailabilityMap(res);
    };

    checkAll();
  }, [from, to, cars]);

  const submitCar = async (e) => {
    e.preventDefault();

    const payload = { ...form, branchId };

    if (editingCar) {
      await ApiService.put(`/api/cars/update/${editingCar.id}`, payload);
    } else {
      await ApiService.post("/api/cars/create", payload);
    }

    setForm(emptyForm);
    setEditingCar(null);
    setShowForm(false);

    const res = await ApiService.get(`/api/cars/branch/${branchId}`);
    setCars(res.cars);
  };

  const openCreate = () => {
    setEditingCar(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (car) => {
    setEditingCar(car);
    setForm({
      name: car.name || "",
      status: car.status || "available",
      fuelType: car.fuelType || "CNG",
      carCompany: car.carCompany || "",
      vehicleType: car.vehicleType || "hatchback",
      carModel: car.carModel || "",
      chassisNumber: car.chassisNumber || "",
      carYear: car.carYear || "",
      carColor: car.carColor || "",
      carNumber: car.carNumber || "",
    });
    setShowForm(true);
  };

  const deleteCar = async (id) => {
    if (!confirm("Delete this car?")) return;
    await ApiService.delete(`/api/cars/${id}`);
    const res = await ApiService.get(`/api/cars/branch/${branchId}`);
    setCars(res.cars);
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

    if (info.status === "available")
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-50 text-green-700">
          <CheckCircle size={14} /> Free
        </span>
      );

    if (info.status === "maintenance")
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-yellow-50 text-yellow-700">
          <Wrench size={14} /> Maintenance
        </span>
      );

    if (info.status === "unavailable")
      return (
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-red-50 text-red-700">
            <XCircle size={14} /> Busy
          </span>
          {info.busySlots?.map((s, i) => (
            <div key={i} className="text-xs text-slate-500">
              {formatDate(s.startAt)} – {formatDate(s.endAt)}
            </div>
          ))}
        </div>
      );

    return <span className="text-slate-400">—</span>;
  };

  return (
    <>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={submitCar}
            className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6 max-h-[90vh] overflow-y-auto thin-scrollbar"
          >
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="absolute top-0 right-0 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                title="Close"
              >
                <XCircle size={20} />
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {editingCar ? "Edit Car" : "Add New Car"}
                </h2>
                <p className="text-slate-500 text-sm">
                  {editingCar ? "Update car details" : "Enter car information"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Car Name */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Car Name
                </label>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateForm}
                    placeholder="Enter car name"
                    className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={updateForm}
                  className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Fuel Type
                </label>
                <select
                  name="fuelType"
                  value={form.fuelType}
                  onChange={updateForm}
                  className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="cng">CNG</option>
                  <option value="petrol">Petrol</option>
                  <option value="disel">Disel</option>
                  <option value="ev">EV</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {/* Company */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Company
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    name="carCompany"
                    value={form.carCompany}
                    onChange={updateForm}
                    placeholder="Enter company name"
                    className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  value={form.vehicleType}
                  onChange={updateForm}
                  className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="hatchback">Hatchback</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                </select>
              </div>

              {/* Model */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Model
                </label>
                <div className="relative">
                  <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    name="carModel"
                    value={form.carModel}
                    onChange={updateForm}
                    placeholder="Enter model"
                    className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Chassis Number */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Chassis Number
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    name="chassisNumber"
                    value={form.chassisNumber}
                    onChange={updateForm}
                    placeholder="Enter chassis number"
                    className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Year */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Year
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    name="carYear"
                    value={form.carYear}
                    onChange={updateForm}
                    placeholder="Enter year"
                    type="number"
                    className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Color */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Color
                </label>
                <div className="relative">
                  <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    name="carColor"
                    value={form.carColor}
                    onChange={updateForm}
                    placeholder="Enter color"
                    className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Car Number */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Car Number
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    name="carNumber"
                    value={form.carNumber}
                    onChange={updateForm}
                    placeholder="Enter car number"
                    className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-200/50 hover:from-blue-700 hover:to-blue-600 transition-all"
              >
                {editingCar ? "Update Car" : "Add Car"}
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
                className="h-full w-full sm:w-56 pl-10 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-sm shadow-inner outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                className="h-full w-full sm:w-56 pl-10 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-sm shadow-inner outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                className="h-full w-full sm:w-56 pl-10 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-sm shadow-inner outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Add */}
            <button
              disabled={!branchId}
              onClick={openCreate}
              className="h-11 w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 text-sm shadow-lg shadow-blue-200/50 hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-50"
            >
              <Plus size={16} />
              Add Car
            </button>
          </div>
        </header>

        {/* Car Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {cars.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5 hover:shadow-xl transition-all duration-200">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Car className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg">{c.name}</h3>
                    <p className="text-slate-500 text-sm">{c.carCompany} {c.carModel}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(c)}
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Settings size={16} />
                  </button>
                  <button
                    onClick={() => deleteCar(c.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Building className="text-slate-400" size={14} />
                  <span className="text-sm text-slate-600">{c.carCompany}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="text-slate-400" size={14} />
                  <span className="text-sm text-slate-600">{c.carModel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="text-slate-400" size={14} />
                  <span className="text-sm text-slate-600">{c.carYear}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Palette className="text-slate-400" size={14} />
                  <span className="text-sm text-slate-600">{c.carColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="text-slate-400" size={14} />
                  <span className="text-sm text-slate-600">{c.carNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="text-slate-400" size={14} />
                  <span className="text-sm text-slate-600">{c.chassisNumber}</span>
                </div>
              </div>

              {/* Vehicle Type */}
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                  {c.vehicleType}
                </span>
              </div>

              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                  {c.fuelType}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <div>{renderStatus(c.id)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </>
  );
};

export default Cars;
