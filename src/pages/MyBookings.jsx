import { useEffect, useMemo, useState } from "react";
import { Calendar, Car } from "lucide-react";
import { ApiService } from "../ApiService";
import toast from "react-hot-toast";

const MyBookings = () => {
    const [myBookings, setMyBookings] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const [loading, setLoading] = useState(false)

    const loadMyBookings = async () => {
        try {
            setLoading(true)
            const res = await ApiService.get(
                `/api/bookings/user/${user.id}`
            );
            setMyBookings(res.bookings || []);
        }
        catch (err) {
            toast.error("Something went wrong !")
        }
        finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        loadMyBookings();
    }, []);

    const now = new Date();

    const { upcoming, completed } = useMemo(() => {
        const upcoming = [];
        const completed = [];

        myBookings.forEach((b) => {
            const start = new Date(b.startAt);
            if (start < now) completed.push(b);
            else upcoming.push(b);
        });

        return { upcoming, completed };
    }, [myBookings]);

    const getStatus = (b) => {
        const end = new Date(b.endAt);
        return end < now ? "Completed" : "Upcoming";
    };

    return (
        <>
            {
                loading ?
                    <div className="flex justify-center items-center py-12">
                        < div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" ></div >
                    </div >
                    :
                    <>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-2">
                                <Calendar className="text-blue-600 w-6 h-6 sm:w-7 sm:h-7" />
                                <h1 className="text-2xl font-bold">My Bookings</h1>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-xl p-4 shadow">
                                    <p className="text-sm text-slate-500">Total Bookings</p>
                                    <p className="text-2xl font-bold">{myBookings.length}</p>
                                </div>

                                <div className="bg-white rounded-xl p-4 shadow">
                                    <p className="text-sm text-slate-500">Upcoming</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {upcoming.length}
                                    </p>
                                </div>

                                <div className="bg-white rounded-xl p-4 shadow">
                                    <p className="text-sm text-slate-500">Completed</p>
                                    <p className="text-2xl font-bold text-slate-700">
                                        {completed.length}
                                    </p>
                                </div>
                            </div>

                            {/* Booking History */}
                            <div className="bg-white rounded-2xl shadow">
                                <div className="p-4 border-b">
                                    <h2 className="text-lg font-semibold">Booking History</h2>
                                </div>

                                <div className="space-y-4">
                                    {myBookings.map((b) => {
                                        const start = new Date(b.startAt);
                                        const end = new Date(b.endAt);
                                        const isCompleted = start < new Date();

                                        return (
                                            <div
                                                key={b.id}
                                                className="my-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5"
                                            >
                                                {/* Top Row */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                                            <Car size={18} />
                                                        </div>

                                                        <div>
                                                            <p className="font-medium text-slate-800">
                                                                {b.Car?.name}
                                                            </p>
                                                            <p className="text-xs text-slate-400">#{b.id}</p>
                                                        </div>
                                                    </div>

                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${isCompleted
                                                            ? "bg-slate-200 text-slate-700"
                                                            : "bg-green-100 text-green-700"
                                                            }`}
                                                    >
                                                        {isCompleted ? "Completed" : "Upcoming"}
                                                    </span>
                                                </div>

                                                {/* Details */}
                                                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <p className="text-xs text-slate-400">Branch</p>
                                                        <p className="text-slate-700">{b.Branch?.name}</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-slate-400">Date</p>
                                                        <p className="text-slate-700">
                                                            {start.toISOString().slice(0, 10)}
                                                        </p>
                                                    </div>

                                                    <div className="col-span-2">
                                                        <p className="text-xs text-slate-400">Time</p>
                                                        <p className="text-slate-700">
                                                            {start.toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}{" "}
                                                            -{" "}
                                                            {end.toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {myBookings.length === 0 && (
                                        <div className="p-6 text-center text-slate-400">
                                            No bookings yet
                                        </div>
                                    )}
                                </div>

                            </div>

                        </div>
                    </>
            }
        </>
    );
};

export default MyBookings;
