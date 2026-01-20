import { useEffect, useState } from "react";
import { ApiService } from "../ApiService";
import {
  Calendar,
  User,
  MapPin,
  Car,
  Building,
  Clock,
  FileText,
} from "lucide-react";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await ApiService.get("/api/bookings/all");
      setBookings(res.bookings || []);
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

  const stringToHue = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 360;
  };

  const carBg = (carName, branchName) => {
    const key = `${carName || "car"}-${branchName || "branch"}`;
    const hue = stringToHue(key);
    return `hsl(${hue}, 80%, 95%)`;
  };

  const branchBadge = (name) => {
    const hue = stringToHue(name || "default-branch");
    return {
      background: `hsl(${hue}, 70%, 90%)`,
      color: `hsl(${hue}, 60%, 30%)`,
    };
  };

  const carIconStyle = (carName, branchName) => {
    const key = `${carName || "car"}-${branchName || "branch"}`;
    const hue = stringToHue(key);
    return {
      background: `hsl(${hue}, 80%, 95%)`,
      color: `hsl(${hue}, 60%, 30%)`,
    };
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="text-blue-600 w-6 h-6 sm:w-7 sm:h-7" />
          All Bookings
        </h1>
      </header>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No bookings found</h3>
          <p className="text-slate-500">There are no bookings to display at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {bookings.map((b) => {
            const branchStyle = branchBadge(b.Branch?.name);
            const iconStyle = carIconStyle(b.Car?.name, b.Car?.carCompany);

            return (
              <div key={b.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5 hover:shadow-xl transition-all duration-200">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                       <Car size={20} style={{ color: iconStyle.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg">{b.Car?.name || "Unknown Car"}</h3>
                      <span
                        style={branchStyle}
                        className="w-fit text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                      >
                        {b.Branch?.name || "Unknown Branch"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="text-slate-400" size={14} />
                    <div className="text-sm text-slate-600">
                      <div className="font-medium">{b.User?.name || "Unknown User"}</div>
                      <div className="text-xs text-slate-500 break-all">{b.User?.email || "No email"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="text-slate-400" size={14} />
                    <div className="text-sm text-slate-600">
                      <div>From: {b.fromLocation || "Not specified"}</div>
                      <div>To: {b.toLocation || "Not specified"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-slate-400" size={14} />
                    <div className="text-sm text-slate-600">
                      <div>Start: {new Date(b.startAt).toLocaleString()}</div>
                      <div>End: {new Date(b.endAt).toLocaleString()}</div>
                    </div>
                  </div>
                  {(b.purpose || b.notes) && (
                    <div className="flex items-start gap-2">
                      <FileText className="text-slate-400 mt-0.5" size={14} />
                      <div className="text-sm text-slate-600">
                        {b.purpose && <div><span className="font-medium">Purpose:</span> {b.purpose}</div>}
                        {b.notes && <div><span className="font-medium">Notes:</span> {b.notes}</div>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Booking ID */}
                <div className="text-xs text-slate-400">
                  Booking ID: {b.id}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookings;
