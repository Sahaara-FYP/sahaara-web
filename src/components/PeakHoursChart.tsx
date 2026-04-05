import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export const PeakHoursChart = () => {
  //WILL ATTACH WITH BACKEND LATER
  const data = [
    { hour: "12:00 am - 4:00 am", requests: 12, alerts: 20 },
    { hour: "4:00 am - 8:00 am", requests: 28, alerts: 120 },
    { hour: "8:00 am - 12:00 am", requests: 40, alerts: 40 },
    { hour: "12:00 pm - 4:00 pm", requests: 34, alerts: 60 },
    { hour: "4:00 pm - 8:00 pm", requests: 48, alerts: 70 },
    { hour: "8:00 pm - 12:00 pm", requests: 22, alerts: 10 },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl shadow-lg shadow-black/20 p-6 w-full h-[400px]">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Peak Activity Hours
        </h2>
        <p className="text-sm text-white/50 font-medium mt-1">
          Distribution of incoming requests and alerts
        </p>
      </div>
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#ffffff10"
              vertical={false}
            />
            <XAxis
              dataKey="hour"
              stroke="#ffffff40"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
              interval={0}
              angle={-30}
              textAnchor="end"
            />
            <YAxis
              stroke="#ffffff40"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip
              cursor={{ fill: "#ffffff05" }}
              contentStyle={{
                backgroundColor: "#020617",
                borderColor: "#ffffff1a",
                borderRadius: "12px",
                color: "#fff",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              }}
              itemStyle={{ fontFamily: "Outfit, sans-serif" }}
            />
            <Bar
              dataKey="requests"
              name="Requests"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="alerts"
              name="Alerts"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
