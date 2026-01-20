import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Building, CalendarPlus, Car, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../ApiService";

const localizer = momentLocalizer(moment);

const UserDashboard = () => {
    const [events, setEvents] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [currentDate, setCurrentDate] = useState(new Date());
    const navigate = useNavigate()

    useEffect(() => {
        const loadBookings = async () => {
            const res = await ApiService.get("/api/bookings/all");

            const formatted = res.bookings.map(b => ({
                id: b.id,
                title: `${b.Car?.name || "Car"}`,
                start: new Date(b.startAt),
                end: new Date(b.endAt),
                resource: {
                    car: b.Car?.name,
                    user: b.User?.name,
                    email: b.User?.email,
                    branch: b.Branch?.name,
                    from: b.fromLocation,
                    to: b.toLocation,
                    purpose: b.purpose,
                    notes: b.notes,
                    status: b.status || "Upcoming",
                }
            }));

            setEvents(formatted);
        };

        loadBookings();
    }, []);

    useEffect(() => {
        const loadBranches = async () => {
            const res = await ApiService.get("/api/branches/get");
            setBranches(res.branches || []);
        };

        loadBranches();
    }, []);

    const user = JSON.parse(localStorage.getItem('user'))
    const filteredEvents = selectedBranch
        ? events.filter(e => e.resource.branch === selectedBranch)
        : events;

    const upcomingEvents = filteredEvents.filter(
        e => e.start.getTime() > Date.now() && e.name == user.name
    );



    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="rounded-xl  bg-slate-900 text-white px-8 py-12 flex flex-col items-start space-y-4 justify-center">
                <div>
                    <h2 className="text-3xl font-semibold">Welcome back, {user.name}!</h2>
                    <p className="text-lg text-slate-300">
                        You have {upcomingEvents.length} upcoming bookings
                    </p>
                </div>

                <button className="bg-white flex space-x-3 text-slate-800 p-3 rounded-lg text-sm font-medium items-center"
                    onClick={() => navigate('/user/book')}>
                    <span><CalendarPlus size={18} /></span>
                    <span className="text-sm">
                        Book a Car
                    </span>
                </button>
            </div>

            {/* Filters / Header */}
            <div className="flex items-center justify-start space-x-2">
                <Building size={20} />
                <div className="relative w-72">
                    <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="
      w-full appearance-none
      bg-white
      border border-slate-200
      rounded-xl
      px-4 py-3
      text-sm text-slate-700
      focus:outline-none
      focus:ring-2 focus:ring-slate-300
      focus:border-slate-300
      cursor-pointer
    "
                    >
                        <option value="">All Branches</option>
                        {branches.map((b) => (
                            <option key={b.id} value={b.name}>
                                {b.name}
                            </option>
                        ))}
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Calendar Card */}
            <h3 className="font-semibold mb-4">Bookings at Headquarters</h3>
            <div className="bg-white rounded-xl shadow border p-4">

                <Calendar
                    localizer={localizer}
                    events={filteredEvents}
                    startAccessor="start"
                    endAccessor="end"
                    views={["month"]}
                    defaultView="month"
                    date={currentDate}
                    onNavigate={(date) => setCurrentDate(date)}
                    style={{ height: 650 }}
                    className="custom-calendar"
                    components={{
                        toolbar: CustomToolbar,
                    }}
                    onSelectEvent={(event) => {
                        setSelectedEvent(event);
                        setOpenModal(true);
                    }}
                    tooltipAccessor={null}
                />


                {openModal && selectedEvent && (
                    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative">

                            {/* Header */}
                            <div className="px-8 py-5 border-b flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-800">
                                    Booking Details
                                </h3>
                                <button
                                    onClick={() => setOpenModal(false)}
                                    className="text-slate-400 hover:text-slate-700 text-xl"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Car Card */}
                            <div className="p-8">
                                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">
                                        <Car />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-emerald-900">
                                            {selectedEvent.resource.car || "-"}
                                        </p>
                                        <p className="text-sm text-emerald-700">
                                            {selectedEvent.resource.from} → {selectedEvent.resource.to}
                                        </p>
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-6 mt-6 text-base">
                                    <div>
                                        <p className="text-xs text-slate-400">BOOKED BY</p>
                                        <p className="font-medium text-slate-800">
                                            {selectedEvent.resource.user || "-"}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {selectedEvent.resource.email || ""}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">BRANCH</p>
                                        <p className="font-medium text-slate-800">
                                            {selectedEvent.resource.branch || "-"}
                                        </p>
                                    </div>
                                </div>

                                {/* Date & Time */}
                                <div className="mt-6 border-t pt-6 space-y-3 text-base">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Date</span>
                                        <span className="font-medium">
                                            {moment(selectedEvent.start).format("dddd, MMMM D, YYYY")}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Time</span>
                                        <span className="font-medium">
                                            {moment(selectedEvent.start).format("HH:mm")} –{" "}
                                            {moment(selectedEvent.end).format("HH:mm")}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Purpose</span>
                                        <span className="font-medium">
                                            {selectedEvent.resource.purpose || "-"}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Notes</span>
                                        <span className="font-medium text-right max-w-[300px] truncate">
                                            {selectedEvent.resource.notes || "-"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-8 py-4 border-t flex items-center justify-between">
                                <span className="text-sm text-slate-400">Status</span>
                                <span className="text-sm px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                                    {selectedEvent.resource.status}
                                </span>
                            </div>

                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default UserDashboard;

const CustomToolbar = ({ label, onNavigate }) => {
    return (
        <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex gap-2">
                <button
                    onClick={() => onNavigate("PREV")}
                    className="px-3 py-1.5 rounded-lg border bg-white text-sm hover:bg-slate-100"
                >
                    ←
                </button>

                <button
                    onClick={() => onNavigate("TODAY")}
                    className="px-3 py-1.5 rounded-lg border bg-white text-sm hover:bg-slate-100"
                >
                    Today
                </button>

                <button
                    onClick={() => onNavigate("NEXT")}
                    className="px-3 py-1.5 rounded-lg border bg-white text-sm hover:bg-slate-100"
                >
                    →
                </button>
            </div>

            <h2 className="text-lg font-bold text-slate-800">{label}</h2>
        </div>
    );
};

