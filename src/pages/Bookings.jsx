import { useEffect, useState } from "react";
import axios from "axios";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/bookings/all");
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Failed to load bookings:", err.response?.data || err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-10 py-3 sm:py-4">
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
        All Bookings
      </h1>

      {loading ? (
        <p className="text-slate-500 text-sm">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="text-center text-slate-500 py-8 text-sm">
          No bookings found
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-xl sm:rounded-2xl shadow border p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3 hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex flex-col gap-1">
                <div className="text-sm sm:text-base md:text-lg font-semibold text-slate-800 truncate">
                  Car: {b.Car?.name || "—"}
                </div>
                <span className="w-fit text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {b.Branch?.name || "—"}
                </span>
              </div>

              {/* User */}
              <div className="text-xs sm:text-sm text-slate-700 space-y-0.5">
                <div>
                  <span className="font-medium">User:</span>{" "}
                  {b.User?.name || "-"}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 break-all">
                  {b.User?.email || "-"}
                </div>
              </div>

              {/* Route */}
              <div className="text-xs sm:text-sm text-slate-700 space-y-0.5">
                <div>
                  <span className="font-medium">From:</span>{" "}
                  {b.fromLocation || "-"}
                </div>
                <div>
                  <span className="font-medium">To:</span>{" "}
                  {b.toLocation || "-"}
                </div>
              </div>

              {/* Time */}
              <div className="text-[11px] sm:text-xs text-slate-500 border-t pt-2">
                <div>
                  <span className="font-medium">Start:</span>{" "}
                  {new Date(b.startAt).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">End:</span>{" "}
                  {new Date(b.endAt).toLocaleString()}
                </div>
              </div>

              {/* Purpose & Notes */}
              {(b.purpose || b.notes) && (
                <div className="text-[11px] sm:text-xs text-slate-700 bg-slate-50 rounded-lg p-2">
                  {b.purpose && (
                    <div>
                      <span className="font-medium">Purpose:</span>{" "}
                      {b.purpose}
                    </div>
                  )}
                  {b.notes && (
                    <div>
                      <span className="font-medium">Notes:</span>{" "}
                      {b.notes}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
