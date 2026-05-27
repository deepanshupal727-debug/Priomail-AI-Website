import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { referralsApi } from "@/lib/api";

export default function ReferralRedirect() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("tracking"); // tracking | redirecting | invalid

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await referralsApi.track(code, { event_type: "click" });
        // store in localStorage so signup flow can attribute later
        try { localStorage.setItem("priomail_ref", code.toUpperCase()); } catch {}
        if (!cancelled) setStatus("redirecting");
        setTimeout(() => navigate(`/?ref=${encodeURIComponent(code.toUpperCase())}`, { replace: true }), 600);
      } catch (e) {
        if (!cancelled) setStatus("invalid");
        setTimeout(() => navigate("/", { replace: true }), 1500);
      }
    })();
    return () => { cancelled = true; };
  }, [code, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6">
      <img src="/priomail-icon-white-chip.svg" alt="PrioMail AI" className="w-20 h-20 mb-6 animate-pulse" />
      <h1 className="font-display text-2xl tracking-tight">
        {status === "invalid" ? "Invalid referral link" : "Hold tight…"}
      </h1>
      <p className="text-sm text-muted-foreground mt-2">
        {status === "invalid"
          ? "Redirecting you to the homepage."
          : `Activating referral ${code?.toUpperCase()}`}
      </p>
    </div>
  );
}
