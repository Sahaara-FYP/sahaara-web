import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/Sidebar";

const AdminLayout = () => {
  //   const token = localStorage.getItem("admin_token");
  //   const navigate = useNavigate();

  //   if (!token) {
  //     navigate("/admin-login");
  //   }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <div className="mx-16 my-6">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
