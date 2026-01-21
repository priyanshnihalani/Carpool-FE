import { useEffect, useState } from "react";
import { Car, Calendar, ArrowBigDown, ArrowDown01, ArrowDown } from "lucide-react";
import { ApiService } from "../ApiService";
import toast from "react-hot-toast";

const BookCar = () => {
    const [branches, setBranches] = useState([]);
    const [branchId, setBranchId] = useState("");
    const [cars, setCars] = useState([]);
    const [carId, setCarId] = useState("");

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const [purpose, setPurpose] = useState("");
    const [fromLocation, setFromLocation] = useState("");
    const [toLocation, setToLocation] = useState("");
    const [notes, setNotes] = useState("");

    const [availability, setAvailability] = useState(null);
    const [step, setStep] = useState(1);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        ApiService.get("/api/branches/get").then((res) => {
            setBranches(res.branches);
        });
    }, []);

    useEffect(() => {
        if (!branchId) return;

        ApiService
            .get(`/api/cars/branch/${branchId}`)
            .then((res) => {
                setCars(res.cars || []);
                setCarId("");
                setAvailability(null);
            });
    }, [branchId]);

    useEffect(() => {
        if (!carId || !from || !to) {
            setAvailability(null);
            return;
        }

        const check = async () => {
            const res = await ApiService.post(
                "/api/bookings/check-multiple",
                {
                    carIds: [carId],
                    startAt: from,
                    endAt: to,
                }
            );

            setAvailability(res[carId].status);
        };

        check();
    }, [carId, from, to]);

    const createBooking = async () => {
        if (availability !== "available") return;

        if (!from || !to) {
            toast.error("Please select both start and end time");
            return;
        }

        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (toDate <= fromDate) {
            toast.error("End time must be greater than start time");
            return;
        }

        const toastId = toast.loading("Creating booking...");

        try {
            const res = await ApiService.post(
                "/api/bookings/create",
                {
                    startAt: from,
                    endAt: to,
                    purpose,
                    fromLocation,
                    toLocation,
                    notes,
                    CarId: carId,
                    BranchId: branchId,
                    UserId: user.id,
                }
            );

            toast.success(res.message || "Booking created successfully!", {
                id: toastId,
            });

            setFrom("");
            setTo("");
            setPurpose("");
            setFromLocation("");
            setToLocation("");
            setNotes("");
            setAvailability(null);

        } catch (err) {
            console.error("Booking error:", err);

            toast.error(
                err.response?.data?.message || "Network error. Please try again.",
                { id: toastId }
            );
        }
    };



    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <Car className="text-blue-600 w-6 h-6 sm:w-7 sm:h-7" />
                <h1 className="text-2xl font-bold">Book a Car</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left Card */}
                <div className="bg-white rounded-2xl  p-6 space-y-5 shadow-sm">
                    <div className="flex items-center gap-2 font-semibold text-lg">
                        <Car size={18} />
                        Select Branch & Car
                    </div>

                    <div className="relative">
                        <select
                            className="w-full mt-1 appearance-none rounded-xl border border-slate-200 
               bg-slate-50 p-4 pr-10 text-sm text-slate-700
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
               hover:bg-white transition"
                            value={branchId}
                            onChange={(e) => setBranchId(e.target.value)}
                        >
                            <option value="">Select Branch</option>
                            {branches.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.name}
                                </option>
                            ))}
                        </select>

                        {/* Custom Arrow */}
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                            <ArrowDown size={18} />
                        </div>
                    </div>


                    <div className="space-y-3">
                        <p className="text-sm text-slate-500">Available Cars</p>

                        {cars.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setCarId(c.id)}
                                className={`w-full text-left border rounded-xl p-3 flex items-center gap-3 transition ${carId === c.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "hover:bg-slate-50"
                                    }`}
                            >
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                    <Car size={16} />
                                </div>
                                <div>
                                    <p className="font-medium">{c.name}</p>
                                    <p className="text-xs text-slate-400">#{c.id}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Card */}
                <div className="bg-white rounded-2xl  p-6 space-y-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <Calendar size={18} />
                            Step {step} of 3
                        </div>

                        <div className="flex gap-1">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1.5 w-8 rounded-full ${step >= s ? "bg-blue-600" : "bg-slate-200"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {carId && (
                        <div className="rounded-xl p-4 flex items-center justify-between bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center">
                                    <Car size={18} />
                                </div>
                                <div>
                                    <p className="font-medium">
                                        {cars.find((c) => c.id === carId)?.name}
                                    </p>
                                    <p className="text-xs text-slate-400">Selected Car</p>
                                </div>
                            </div>

                            {availability && (
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${availability === "available"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {availability === "available" ? "Available" : "Not Available"}
                                </span>
                            )}
                        </div>
                    )}

                    {/* STEP 1 */}
                    {step === 1 && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">From</p>
                                    <input
                                        type="datetime-local"
                                        className="w-full border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-500/10 rounded-xl p-2"
                                        value={from}
                                        onChange={(e) => setFrom(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500 mb-1">To</p>
                                    <input
                                        type="datetime-local"
                                        className="w-full border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-500/10 rounded-xl p-2"
                                        value={to}
                                        onChange={(e) => setTo(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                disabled={!from || !to}
                                className="w-full bg-blue-600 text-white py-2 rounded-xl disabled:opacity-40"
                            >
                                Next
                            </button>
                        </>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="From Location"
                                    className="border focus:outline-none focus:ring focus:bg-blue-500/10 focus:ring-blue-500 border-gray-100 rounded-xl p-3"
                                    value={fromLocation}
                                    onChange={(e) => setFromLocation(e.target.value)}
                                />
                                <input
                                    placeholder="To Location"
                                    className="border focus:outline-none focus:ring focus:bg-blue-500/10 focus:ring-blue-500 border-gray-100 rounded-xl p-3"
                                    value={toLocation}
                                    onChange={(e) => setToLocation(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="w-full border border-gray-100 py-2 rounded-xl"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    disabled={!fromLocation || !toLocation}
                                    className="w-full bg-blue-600 text-white py-2 rounded-xl disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Purpose"
                                    className="border focus:outline-none focus:ring focus:bg-blue-500/10 focus:ring-blue-500 border-gray-100 rounded-xl p-3"
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                />
                                <input
                                    placeholder="Notes"
                                    className="border focus:outline-none focus:ring focus:bg-blue-500/10 focus:ring-blue-500 border-gray-100 rounded-xl p-3"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full border border-gray-100 py-2 rounded-xl"
                                >
                                    Back
                                </button>

                                <button
                                    disabled={availability !== "available"}
                                    onClick={createBooking}
                                    className="w-full bg-blue-600 text-white py-2 rounded-xl disabled:opacity-40"
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

};

export default BookCar;
