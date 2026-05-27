import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrioMailLogo from "@/components/PrioMailLogo";

const Showcase = () => {
  return (
    <main className="logo-showcase" data-testid="logo-showcase-page">
      <div className="logo-showcase-bg" aria-hidden="true" />
      <div className="logo-showcase-grid" aria-hidden="true" />

      <header className="logo-showcase-header">
        <span className="logo-showcase-eyebrow" data-testid="logo-eyebrow">
          Brand · Live preview
        </span>
        <h1 className="logo-showcase-title">
          Move your cursor. Then click the bolt.
        </h1>
        <p className="logo-showcase-sub">
          A premium, animated rendition of the PrioMail&nbsp;AI mark — same
          colours, now alive.
        </p>
      </header>

      <section className="logo-showcase-stage">
        <PrioMailLogo size={300} />
      </section>

      <footer className="logo-showcase-footer">
        <div className="logo-feature" data-testid="feature-tilt">
          <span className="logo-feature-dot" />
          <div>
            <p className="logo-feature-title">Parallax tilt</p>
            <p className="logo-feature-desc">Capsule reacts to your cursor in real-time 3D.</p>
          </div>
        </div>
        <div className="logo-feature" data-testid="feature-pulse">
          <span className="logo-feature-dot" />
          <div>
            <p className="logo-feature-title">Living glow</p>
            <p className="logo-feature-desc">Continuous violet aura, breathing softly.</p>
          </div>
        </div>
        <div className="logo-feature" data-testid="feature-click">
          <span className="logo-feature-dot" />
          <div>
            <p className="logo-feature-title">Click to energise</p>
            <p className="logo-feature-desc">Fills the bolt, shimmers, and bursts sparks.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Showcase />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
