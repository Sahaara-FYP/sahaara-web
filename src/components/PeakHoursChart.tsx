import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
    <div className="w-full h-64">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="requests" fill="blue" radius={[6, 6, 0, 0]} />
          <Bar dataKey="alerts" fill="red" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
