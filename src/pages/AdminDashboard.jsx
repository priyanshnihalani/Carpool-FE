import { useEffect, useState } from "react";
import { Users, Building2, Car, BookOpen, UserCheck } from "lucide-react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { ApiService } from "../ApiService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    cars: 0,
    branches: 0,
    bookings: 0,
  });
  const [bookings, setBookings] = useState([]);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  useEffect(() => {
    const load = async () => {
      try {
        const [u, br, bk] = await Promise.all([
          ApiService.get("/api/users/get"),
          ApiService.get("/api/branches/get"),
          ApiService.get("/api/bookings/all"),
        ]);

        const branches = br.branches;
        setBookings(bk.bookings);

        const carRequests = branches.map((b) =>
          ApiService.get(`/api/cars/branch/${b.id}`)
        );

        const carResponses = await Promise.all(carRequests);
        console.log(carResponses)
        const allCars = carResponses.flatMap((r) => r.cars);

        setStats({
          users: u.users.length,
          branches: branches.length,
          cars: allCars.length,
          bookings: bk.bookings.length,
        });
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };

    load();
  }, []);

  const Card = ({ title, value, icon: Icon, gradient }) => (
    <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all flex items-center gap-4">
      <div
        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${gradient} shadow-lg`}
      >
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs sm:text-sm text-slate-500">{title}</p>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">
          {value}
        </h2>
      </div>
    </div>
  );

  // ---- Month-wise aggregation ----
  const bookingsByMonth = bookings.reduce((acc, b) => {
    const d = new Date(b.startAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});


  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  // Filter bookings for selected year
  const bookingsForYear = bookings.filter((b) => {
    const d = new Date(b.startAt);
    return d.getFullYear() === selectedYear;
  });

  // Group by Branch -> Month
  const branchMonthMap = {};

  bookingsForYear.forEach((b) => {
    const branch = b.Branch?.name || "Unknown";
    const month = new Date(b.startAt).getMonth();

    if (!branchMonthMap[branch]) {
      branchMonthMap[branch] = Array(12).fill(0);
    }

    branchMonthMap[branch][month]++;
  });

  const chartSeries = Object.entries(branchMonthMap).map(
    ([branchName, data]) => ({
      name: branchName,
      data,
      type: "column",
    })
  );

  const hasChartData = chartSeries.length > 0;

  const chartOptions = {
    title: { text: `Monthly Bookings – ${selectedYear}` },
    xAxis: {
      categories: months,
      title: { text: "Month" },
    },
    yAxis: {
      title: { text: "Bookings" },
      allowDecimals: false,
    },
    plotOptions: {
      column: {
        grouping: true,
      },

    },
    credits: {
      enabled: false,
    },
    series: chartSeries,
  };



  return (
    <div className="space-y-6 sm:space-y-8 p-3 sm:p-6">
      {/* Header */}
      <div className="my-12 lg:my-0 lg:mb-10">
        <h1 className="flex items-center space-x-2 text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">
          <UserCheck className="text-blue-600 w-6 h-6 sm:w-7 sm:h-7" />
          <span>Admin Dashboard</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Overview of your car booking system
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <Card title="Users" value={stats.users} icon={Users} gradient="from-blue-600 to-blue-500" />
        <Card title="Branches" value={stats.branches} icon={Building2} gradient="from-emerald-600 to-emerald-500" />
        <Card title="Cars" value={stats.cars} icon={Car} gradient="from-indigo-600 to-indigo-500" />
        <Card title="Bookings" value={stats.bookings} icon={BookOpen} gradient="from-rose-600 to-rose-500" />
      </div>

      {/* Chart */}
      {/* Chart */}
      <div className="bg-white w-full rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Yearly Bookings</h3>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="rounded-lg px-3 py-1.5 text-sm"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {hasChartData ? (
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <BookOpen className="w-10 h-10 mb-2 text-slate-300" />
            <p className="text-sm">No bookings available for this year</p>
          </div>
        )}
      </div>


    </div>
  );
};

export default Dashboard;
