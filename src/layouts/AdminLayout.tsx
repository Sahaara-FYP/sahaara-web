import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/Sidebar";
import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import LoaderOverlay from "@/components/Loader";

const AdminLayout = () => {
  const { isAuthenticated, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate, loading]);

  if (loading) return <LoaderOverlay show={true} />;
  if (!isAuthenticated) return null;

  const currentPage = window.location.pathname.split("/")[2];

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-hidden">
        <SidebarTrigger />
        <div className="mx-4 md:mx-10 my-6">
          <AdminHeader currentPage={currentPage} />
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
