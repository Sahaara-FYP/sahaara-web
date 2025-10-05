import { PieChartDonut } from "./PieChartDonut";

const AnalyticPieChartCard = () => {
  return (
    <div className="bg-white rounded-xl flex">
      <div>
        <h3>Users</h3>
        <h1>4,890</h1>
        <h4>blablablblabla</h4>
      </div>
      <div>
        <PieChartDonut />
      </div>
    </div>
  );
};

export default AnalyticPieChartCard;
