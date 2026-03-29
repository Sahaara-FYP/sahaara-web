import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import { Toaster } from "sonner";
import Requests from "./pages/Requests";
import Alerts from "./pages/Alerts";
import Offers from "./pages/Offers";
import Verifications from "./pages/Verifications";
import Reports from "./pages/Reports";
import Users from "./pages/Users";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" closeButton={true} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminPanel />} />
          <Route path="users" element={<Users />} />
          <Route path="requests" element={<Requests />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="offers" element={<Offers />} />
          <Route path="verifications" element={<Verifications />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
