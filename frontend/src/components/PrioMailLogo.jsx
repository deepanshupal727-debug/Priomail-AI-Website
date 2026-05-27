import { useRef, useState, useCallback, useEffect } from "react";
import "./PrioMailLogo.css";

/**
 * PrioMailLogo
 * A premium 3D-looking animated logo for PrioMail AI.
 *
 * Features
 *  - Mouse-tilt parallax (rotateX / rotateY on cursor move) -> "live 3D" feel
 *  - Specular highlight that follows the cursor
 *  - Continuous soft glow pulse + idle floating animation
 *  - Click -> bolt fills with vibrant purple gradient, shimmer sweep, electric burst
 *  - Keeps the original colour palette (dark indigo capsule + violet bolt)
 */
export const PrioMailLogo = ({ size = 260, showWordmark = true }) => {
  const cardRef = useRef(null);
  const [charging, setCharging] = useState(false);
  const [sparks, setSparks] = useState([]);
  const sparkId = useRef(0);

  const handleMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - y) * 22; // tilt up/down
    const ry = (x - 0.5) * 28; // tilt left/right
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  }, []);

  const handleLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--mx", `50%`);
    el.style.setProperty("--my", `50%`);
  }, []);

  const handleClick = useCallback(() => {
    setCharging(true);
    // spawn a burst of sparks
    const burst = Array.from({ length: 14 }).map(() => {
      const id = sparkId.current++;
      const angle = Math.random() * Math.PI * 2;
      const dist = 70 + Math.random() * 90;
      return {
        id,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        delay: Math.random() * 80,
      };
    });
    setSparks((s) => [...s, ...burst]);
    window.setTimeout(() => {
      setSparks((s) => s.filter((sp) => !burst.find((b) => b.id === sp.id)));
    }, 1100);
    window.setTimeout(() => setCharging(false), 1400);
  }, []);

  // keyboard accessibility
  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  useEffect(() => {
    return () => setSparks([]);
  }, []);

  return (
    <div
      className="pm-stage"
      style={{ "--logo-size": `${size}px` }}
      data-testid="priomail-logo-stage"
    >
      <div
        ref={cardRef}
        className={`pm-card ${charging ? "is-charging" : ""}`}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={handleClick}
        onKeyDown={handleKey}
        role="button"
        tabIndex={0}
        aria-label="PrioMail AI logo. Click to energise."
        data-testid="priomail-logo-button"
      >
        {/* Ambient glow behind the capsule */}
        <div className="pm-ambient" aria-hidden="true" />

        {/* The capsule itself */}
        <div className="pm-capsule" aria-hidden="true">
          <div className="pm-capsule-face">
            {/* Inner gradient depth */}
            <div className="pm-capsule-inner" />
            {/* Specular highlight following cursor */}
            <div className="pm-specular" />
            {/* Grain / noise overlay for premium feel */}
            <div className="pm-noise" />

            {/* The lightning bolt SVG */}
            <svg
              className="pm-bolt"
              viewBox="0 0 100 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              data-testid="priomail-logo-bolt"
            >
              <defs>
                <linearGradient id="boltStroke" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#c4a8ff" />
                  <stop offset="50%" stopColor="#a585ff" />
                  <stop offset="100%" stopColor="#7c5cff" />
                </linearGradient>
                <linearGradient id="boltFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#d9c4ff" />
                  <stop offset="100%" stopColor="#7c5cff" />
                </linearGradient>
                <filter id="boltGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Bolt path - matches the user's original shape */}
              <path
                className="pm-bolt-path"
                d="M58 8 L24 86 L46 86 L40 152 L78 70 L54 70 L58 8 Z"
                stroke="url(#boltStroke)"
                strokeWidth="5"
                strokeLinejoin="round"
                strokeLinecap="round"
                filter="url(#boltGlow)"
              />

              {/* Fill layer revealed on click */}
              <path
                className="pm-bolt-fill"
                d="M58 8 L24 86 L46 86 L40 152 L78 70 L54 70 L58 8 Z"
                fill="url(#boltFill)"
              />

              {/* Shimmer sweep clipped to the bolt */}
              <g className="pm-bolt-shimmer" clipPath="url(#boltClip)">
                <rect x="-40" y="0" width="30" height="160" fill="white" opacity="0.85" />
              </g>
              <clipPath id="boltClip">
                <path d="M58 8 L24 86 L46 86 L40 152 L78 70 L54 70 L58 8 Z" />
              </clipPath>
            </svg>
          </div>

          {/* Capsule edge / rim light */}
          <div className="pm-rim" />
        </div>

        {/* Sparks burst on click */}
        <div className="pm-sparks" aria-hidden="true">
          {sparks.map((s) => (
            <span
              key={s.id}
              className="pm-spark"
              style={{
                "--sx": `${s.x}px`,
                "--sy": `${s.y}px`,
                animationDelay: `${s.delay}ms`,
              }}
            />
          ))}
        </div>
      </div>

      {showWordmark && (
        <div className="pm-wordmark" data-testid="priomail-logo-wordmark">
          <span className="pm-wordmark-text">PrioMail</span>
          <span className="pm-wordmark-ai">AI</span>
        </div>
      )}
    </div>
  );
};

export default PrioMailLogo;
