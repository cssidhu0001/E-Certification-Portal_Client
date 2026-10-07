import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Status from "./pages/Status";
import Verify from "./pages/Verify";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Contact from "./pages/Contact";
import ExportCenter from "./pages/admin/ExportCenter";
import Conference from "./pages/Conference";
import Schedule from "./pages/Schedule";
import Proceedings from "./pages/Proceedings";
import ChiefGuestLaunch from "./pages/ChiefGuestLaunch";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />

        <Route path="/status" element={<Status />} />

        {/* MANUAL VERIFICATION */}
        <Route path="/verify" element={<Verify />} />

        {/* QR VERIFICATION */}
        <Route path="/verify/:certificateId" element={<Verify />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route path="/contact" element={<Contact />} />
<Route
  path="/admin/export"
  element={<ExportCenter />}
/>
        <Route path="*" element={<Navigate to="/" replace />} />
<Route
  path="/conference"
  element={<Conference />}
/>  
<Route
  path="/proceedings"
  element={<Proceedings />}
/>
<Route path="/schedule" element={<Schedule />} />
<Route
  path="/admin/proceedings-launch"
  element={<ChiefGuestLaunch />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;