import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import { Toaster } from "sonner";
import Requests from "./pages/Requests";
import Alerts from "./pages/Alerts";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-center" closeButton={true} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminPanel />} />
          <Route path="requests" element={<Requests />} />
          <Route path="alerts" element={<Alerts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
