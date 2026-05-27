import { useRef, useState, useCallback } from "react";
import "./PrioMailLogo.css";

/**
 * PrioMailLogo
 * Exact original mark (pill capsule + violet lightning bolt outline + wordmark).
 * The only addition: the bolt's interior auto-fills with the same violet, then
 * empties, then fills again — a continuous "living logo" loop.
 */
export const PrioMailLogo = ({ size = 260, showWordmark = true }) => {
  const cardRef = useRef(null);
  const [pinged, setPinged] = useState(false);

  const handleMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - y) * 12;
    const ry = (x - 0.5) * 14;
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
  }, []);

  const handleLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  }, []);

  const handleClick = useCallback(() => {
    setPinged(true);
    window.setTimeout(() => setPinged(false), 900);
  }, []);

  return (
    <div
      className="pm-stage"
      style={{ "--logo-size": `${size}px` }}
      data-testid="priomail-logo-stage"
    >
      <div
        ref={cardRef}
        className={`pm-card ${pinged ? "is-pinged" : ""}`}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="PrioMail AI logo"
        data-testid="priomail-logo-button"
      >
        {/* Pill capsule - exact original look */}
        <div className="pm-capsule">
          {/* Lightning bolt — original outline shape */}
          <svg
            className="pm-bolt"
            viewBox="0 0 100 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            data-testid="priomail-logo-bolt"
          >
            <defs>
              <linearGradient id="boltStroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#b594ff" />
                <stop offset="100%" stopColor="#7c5cff" />
              </linearGradient>
              {/* Same purple, just brighter when "alive" */}
              <linearGradient id="boltFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b594ff" />
                <stop offset="100%" stopColor="#7c5cff" />
              </linearGradient>
            </defs>

            {/* Outline - always visible */}
            <path
              className="pm-bolt-outline"
              d="M58 8 L24 86 L46 86 L40 152 L78 70 L54 70 L58 8 Z"
              stroke="url(#boltStroke)"
              strokeWidth="5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Auto-filling layer - opacity pulses 0->1->0 forever */}
            <path
              className="pm-bolt-fill-live"
              d="M58 8 L24 86 L46 86 L40 152 L78 70 L54 70 L58 8 Z"
              fill="url(#boltFill)"
            />
          </svg>
        </div>
      </div>

      {showWordmark && (
        <div className="pm-wordmark" data-testid="priomail-logo-wordmark">
          PrioMail AI
        </div>
      )}
    </div>
  );
};

export default PrioMailLogo;
