import AnalyticSimpleCard from "@/components/AnalyticSimpleCard";
import { PieChartDonut } from "@/components/PieChartDonut";
import { Users } from "lucide-react";

const AdminPanel = () => {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col gap-5">
        <div className="flex gap-5">
          <AnalyticSimpleCard
            title="Total Users"
            value={100}
            caption="Users registered this month"
            icon={<Users />}
          />
          <AnalyticSimpleCard
            title="Total Users"
            value={100}
            caption="Users registered this month"
            icon={<Users />}
          />
        </div>
        <div className="flex gap-5">
          <AnalyticSimpleCard
            title="Total Users"
            value={100}
            caption="Users registered this month"
            icon={<Users />}
          />
          <AnalyticSimpleCard
            title="Total Users"
            value={100}
            caption="Users registered this month"
            icon={<Users />}
          />
        </div>
      </div>
      <div className="flex gap-5">
        <PieChartDonut />
        <PieChartDonut />
      </div>
    </div>
  );
};

export default AdminPanel;
