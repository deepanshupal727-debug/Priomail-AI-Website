import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

// Aggressively strip any "Made with Emergent" badge that might be injected
// at runtime (e.g. by platform scripts) — works even after hydration.
const removeEmergentBadge = () => {
  const sel = [
    "#emergent-badge",
    'a[href*="emergent.sh"]',
    'a[href*="emergent.com"]',
  ].join(",");
  document.querySelectorAll(sel).forEach((el) => el.remove());
};
removeEmergentBadge();
const _moBadge = new MutationObserver(removeEmergentBadge);
_moBadge.observe(document.documentElement, { childList: true, subtree: true });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
