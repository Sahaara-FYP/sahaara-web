import {
  Users,
  ClipboardList,
  AlertTriangle,
  Timer,
  CheckCircle,
} from "lucide-react";
import AnalyticSimpleCard from "@/components/AnalyticSimpleCard";
import { PeakHoursChart } from "@/components/PeakHoursChart";
import { useAnalytics } from "@/hooks/useFetchAnalytics";
import LoaderOverlay from "@/components/Loader";
import { motion } from "framer-motion";
import { RequestsTrendChart } from "@/components/RequestsTrendChart";

const AdminDashboard = () => {
  const { data, error, isFetching } = useAnalytics();

  if (!data || isFetching)
    return <LoaderOverlay show={true} message="Syncing Dashboard..." />;
  if (error)
    return (
      <p className="text-rose-400 font-medium p-8 text-center bg-white/5 mx-auto max-w-md rounded-2xl border border-rose-500/20 mt-10">
        Error connecting to server. Please try again.
      </p>
    );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full flex flex-col gap-8 pb-10"
    >
      {/* Header Section */}
      <div>
        <motion.h1
          variants={item}
          className="text-3xl font-bold text-white tracking-tight mb-2"
        >
          Platform Overview
        </motion.h1>
        <motion.p
          variants={item}
          className="text-white/50 font-medium text-[15px]"
        >
          Real-time statistics and activity monitoring.
        </motion.p>
      </div>

      {/* TOP CARDS */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5"
      >
        <AnalyticSimpleCard
          title="Total Requests"
          value={data.activeRequests}
          caption="Requests received"
          icon={<ClipboardList />}
        />

        <AnalyticSimpleCard
          title="Pending Verification"
          value={data.pendingVerifications}
          caption="Users to review"
          icon={<Users />}
        />

        <AnalyticSimpleCard
          title="Active Alerts"
          value={data.activeAlerts}
          caption="Requires attention"
          icon={<AlertTriangle />}
        />

        <AnalyticSimpleCard
          title="Total Users"
          value={data.totalUsers}
          caption="Registered users"
          icon={<Users />}
        />

        <AnalyticSimpleCard
          title="Response Time"
          value={data.averageFirstResponseTime.value}
          caption="Across platform"
          icon={<Timer />}
          unit={data.averageFirstResponseTime.unit}
        />

        <AnalyticSimpleCard
          title="Completion Rate"
          value={data.totalCompletionRate}
          caption="Successfully resolved"
          icon={<CheckCircle />}
          unit="%"
        />
      </motion.div>

      {/* ANALYTICS CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 w-full">
        <motion.div variants={item} className="w-full">
          <RequestsTrendChart trendData={data.trendData} />
        </motion.div>

        <motion.div variants={item} className="w-full">
          <PeakHoursChart />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
