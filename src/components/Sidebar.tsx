import {
  Home,
  Inbox,
  Settings,
  AlertCircle,
  CheckCircle,
  DoorOpen,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthContext } from "@/contexts/AuthContext";
import DarkModeToggle from "./DarkModeToggle";
import { Link, useLocation } from "react-router-dom";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Requests",
    url: "/admin/requests",
    icon: Inbox,
  },
  {
    title: "Alerts",
    url: "/admin/alerts",
    icon: AlertCircle,
  },
  {
    title: "Verifications",
    url: "#",
    icon: CheckCircle,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

const AppSidebar = () => {
  const { logout, adminDetails } = useAuthContext();

  const location = useLocation();
  return (
    <Sidebar className="h-full ">
      <SidebarContent className="py-6 px-4 h-full ">
        <SidebarGroup>
          <SidebarGroupLabel className="flex gap-2 items-center">
            <div>
              <img
                src="/admin-login-illustration.webp"
                width={30}
                height={30}
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-app-primary-color dark:text-app-secondary-color">
                Sahaara
              </h2>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-8">
            <SidebarMenu className="flex flex-col gap-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="">
                  <SidebarMenuButton
                    asChild
                    className={`${
                      location.pathname === item.url
                        ? "bg-app-primary-color text-white font-semibold hover:bg-app-primary-color hover:text-white"
                        : ""
                    }`}
                  >
                    <Link to={item.url} className={`pl-4`}>
                      <item.icon
                        className={`${
                          location.pathname === item.url
                            ? "text-white dark:text-white"
                            : "text-app-primary-color"
                        }  dark:text-app-secondary-color`}
                      />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    className="pl-4"
                    onClick={() => {
                      logout();
                    }}
                  >
                    <DoorOpen className="text-app-primary-color dark:text-app-secondary-color" />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mb-2 flex flex-col gap-4 py-6 pl-6">
        <div>
          <DarkModeToggle type="text" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-[50%] bg-app-background"></div>
          <div className="mb-1">
            <p className="font-semibold">
              {adminDetails?.full_name || "Administrator"}
            </p>
            <p className="text-xs text-app-secondary-text">
              {adminDetails?.email}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
