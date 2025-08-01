import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/Sidebar";
import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import AdminHeader from "@/components/AdminHeader";

const AdminLayout = () => {
  const { isAuthenticated, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate, loading]);

  if (loading)
    return (
      <div className="central-container">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!isAuthenticated) return null;

  const currentPage = window.location.pathname.split("/")[2];

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        <div className="mx-10 my-6 h-[45rem]">
          <AdminHeader currentPage={currentPage} />
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
