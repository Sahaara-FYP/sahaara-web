import {
  Users,
  Bell,
  ClipboardList,
  AlertTriangle,
  Timer,
  CheckCircle,
} from "lucide-react";
import AnalyticSimpleCard from "@/components/AnalyticSimpleCard";
import { PieChartDonut } from "@/components/PieChartDonut";
import { RequestsTrendChart } from "@/components/RequestsTrendChart";
import { PeakHoursChart } from "@/components/PeakHoursChart";

const AdminDashboard = () => {
  const stats = {
    totalRequests: 254,
    pendingVerifications: 42,
    activeAlerts: 18,
    totalUsers: 1200,
    avgResponseTime: "8 min",
    completionRate: "76%",
  };

  const recentRequests = [
    {
      id: 1,
      requester: "Ahmed Khan",
      category: "Food",
      status: "Pending",
      time: "15 min ago",
    },
    {
      id: 2,
      requester: "Fatima Malik",
      category: "Medical",
      status: "In Progress",
      time: "1 hr ago",
    },
    {
      id: 3,
      requester: "Zain Ali",
      category: "Shelter",
      status: "Completed",
      time: "2 hrs ago",
    },
  ];

  const alerts = [
    {
      id: 1,
      type: "Medical",
      message: "Urgent medicine needed",
      time: "10m ago",
    },
    {
      id: 2,
      type: "Food",
      message: "Family requiring rations",
      time: "45m ago",
    },
    { id: 3, type: "Safety", message: "Unsafe area spotted", time: "1h ago" },
  ];

  return (
    <div className="w-full flex flex-col gap-8">
      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        <AnalyticSimpleCard
          title="Total Requests"
          value={stats.totalRequests}
          caption="Requests received"
          icon={<ClipboardList />}
        />

        <AnalyticSimpleCard
          title="Pending Verifications"
          value={stats.pendingVerifications}
          caption="Users needing review"
          icon={<Users />}
        />

        <AnalyticSimpleCard
          title="Active Alerts"
          value={stats.activeAlerts}
          caption="Alerts requiring attention"
          icon={<AlertTriangle />}
        />

        <AnalyticSimpleCard
          title="Total Users"
          value={stats.totalUsers}
          caption="Registered users"
          icon={<Users />}
        />

        {/* NEW CARD — Avg Response Time */}
        <AnalyticSimpleCard
          title="Avg Response Time"
          value={stats.avgResponseTime}
          caption="Across all requests"
          icon={<Timer />}
        />

        {/* NEW CARD — Completion Rate */}
        <AnalyticSimpleCard
          title="Completion Rate"
          value={stats.completionRate}
          caption="Requests completed"
          icon={<CheckCircle />}
        />
      </div>

      {/* ANALYTICS TREND CHART */}
      <RequestsTrendChart />

      {/* NEW — PEAK HOURS CHART */}
      <div className="bg-app-foreground rounded-xl shadow p-5">
        <h2 className="text-xl font-semibold mb-4 text-app-primary-text">
          Peak Activity Hours
        </h2>
        <PeakHoursChart />
      </div>

      {/* REQUESTS + PIE CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests */}
        <div className="bg-app-foreground rounded-xl shadow p-5 col-span-2">
          <h2 className="text-xl font-semibold mb-3 text-app-primary-text">
            Recent Requests
          </h2>

          <div className="flex flex-col gap-4">
            {recentRequests.map((req) => (
              <div
                key={req.id}
                className="flex justify-between items-center p-4 rounded-lg bg-white shadow-sm border"
              >
                <div>
                  <h3 className="font-medium text-app-primary-text">
                    {req.requester}
                  </h3>
                  <p className="text-app-secondary-text text-sm">
                    {req.category} • {req.time}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium
                    ${
                      req.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : req.status === "In Progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                >
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-app-foreground rounded-xl col-span-2 lg:col-span-1 shadow p-5 overflow-hidden">
          <h2 className="text-xl font-semibold mb-4 text-app-primary-text">
            Request Categories
          </h2>
          <PieChartDonut />
        </div>
      </div>

      {/* ACTIVE ALERTS */}
      <div className="bg-app-foreground rounded-xl shadow p-5">
        <h2 className="text-xl font-semibold mb-3 text-app-primary-text">
          Active Alerts
        </h2>

        <div className="flex flex-col gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border"
            >
              <div>
                <h3 className="font-medium text-app-primary-text">
                  {alert.type} Alert
                </h3>
                <p className="text-app-secondary-text text-sm">
                  {alert.message}
                </p>
              </div>
              <p className="text-xs text-gray-500">{alert.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
