import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import AdminOverview from "@/pages/admin/AdminOverview";
import AdminReferrals from "@/pages/admin/AdminReferrals";
import AdminCoupons from "@/pages/admin/AdminCoupons";
import ReferralRedirect from "@/pages/ReferralRedirect";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/r/:code" element={<ReferralRedirect />} />
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/referrals" element={<AdminReferrals />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
        </Routes>
      </BrowserRouter>
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}

export default App;
