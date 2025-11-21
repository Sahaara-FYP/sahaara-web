import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const PeakHoursChart = () => {
  const data = [
    { hour: "6 AM", requests: 12 },
    { hour: "9 AM", requests: 28 },
    { hour: "12 PM", requests: 40 },
    { hour: "3 PM", requests: 34 },
    { hour: "6 PM", requests: 48 },
    { hour: "9 PM", requests: 22 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="requests" fill="#4f46e5" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
