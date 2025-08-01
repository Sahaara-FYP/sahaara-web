import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

let manualLogout = () => {};

type Admin = {
  id: number;
  username: string;
  role: string;
  is_disabled: boolean;
  full_name: string;
  email: string;
};

type AuthContextType = {
  adminDetails: Admin | null;
  login: (adminData: Admin, accessToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [adminDetails, setAdminDetails] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const adminData = localStorage.getItem("admin");

    if (token && adminData) {
      try {
        const decoded = jwtDecode(token);
        if (!decoded?.exp) return logout();
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) logout();
        setAdminDetails(JSON.parse(adminData));
      } catch {
        logout();
      }
    }

    setLoading(false);
  }, []);

  const login = (adminData: Admin, accessToken: string) => {
    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("admin", JSON.stringify(adminData));
    setAdminDetails(adminData);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("admin");
    setAdminDetails(null);
    window.location.href = "/admin/login";
  };

  manualLogout = logout;

  return (
    <AuthContext.Provider
      value={{
        adminDetails,
        login,
        logout,
        isAuthenticated: !!adminDetails,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

// eslint-disable-next-line react-refresh/only-export-components
export { manualLogout };
