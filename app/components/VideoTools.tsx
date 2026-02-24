// D:\BS-arena-NextJS\app\components\VideoTools.tsx
"use client";

import { useRouter } from "next/navigation";
import {
  FaClock,
  FaCalculator,
  FaChartLine,
  FaQuestionCircle,
} from "react-icons/fa";

const TOOLS = [
  {
    title: "Pomodoro Timer",
    sub: "Focus sessions",
    icon: <FaClock />,
    href: "/pomodoro",
    newTab: true,
    num: "01",
  },
  {
    title: "Grade Calculator",
    sub: "Score tracker",
    icon: <FaCalculator />,
    href: undefined,
    newTab: false,
    num: "02",
  },
  {
    title: "Grade Predictor",
    sub: "Forecast results",
    icon: <FaChartLine />,
    href: undefined,
    newTab: false,
    num: "03",
  },
  {
    title: "FAQ & Help",
    sub: "Quick answers",
    icon: <FaQuestionCircle />,
    href: undefined,
    newTab: false,
    num: "04",
  },
];

export default function VideoTools() {
  return (
    <div className="vt-wrap">

      {/* ── Cinematic video block ── */}
      <div className="vt-cinema">
        <video
          src="/study-tools.mp4"
          className="vt-video"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Rich gradient overlay - conditional for terminal theme */}
        <div className="vt-cinema-overlay" />
        <div className="vt-cinema-overlay-terminal" />

        {/* Editorial headline */}
        <div className="vt-headline">
          <span className="vt-headline-eyebrow">Your Study</span>
          <span className="vt-headline-title">Tools</span>
          <div className="vt-headline-rule" />
        </div>

        {/* Corner accent */}
        <div className="vt-corner-tag">
          <span>BS Arena</span>
        </div>
      </div>

      {/* ── 2×2 tool grid ── */}
      <div className="vt-grid">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.num} {...tool} />
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        /* ── Wrapper ── */
        .vt-wrap {
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Cinema block ── */
        .vt-cinema {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid var(--card-border);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }

        .vt-video {
          width: 100%;
          height: auto;
          object-fit: contain;
          display: block;
        }

        /* Layered gradient — rich and directional (default theme) */
        .vt-cinema-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(135deg,
              color-mix(in srgb, var(--navy) 72%, transparent) 0%,
              transparent 60%
            ),
            linear-gradient(to top,
              color-mix(in srgb, var(--card-bg) 40%, transparent) 0%,
              transparent 50%
            );
          pointer-events: none;
        }

        /* Terminal theme overlay - no green gradient, just dark subtle overlay */
        .vt-cinema-overlay-terminal {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          pointer-events: none;
          display: none;
        }

        :root[data-theme="terminal"] .vt-cinema-overlay {
          display: none;
        }

        :root[data-theme="terminal"] .vt-cinema-overlay-terminal {
          display: block;
        }

        /* Editorial title stack */
        .vt-headline {
          position: absolute;
          bottom: 20px;
          left: 22px;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .vt-headline-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          line-height: 1;
        }

        .vt-headline-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          font-weight: 400;
          font-style: italic;
          color: #fff;
          line-height: 1;
          letter-spacing: -0.01em;
        }

        .vt-headline-rule {
          width: 32px;
          height: 2px;
          background: var(--navy-mid, #5ba3ff);
          border-radius: 999px;
          margin-top: 6px;
        }

        /* Terminal theme headline rule */
        :root[data-theme="terminal"] .vt-headline-rule {
          background: #00FF66;
          box-shadow: 0 0 8px #00FF66;
        }

        /* Corner tag */
        .vt-corner-tag {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 999px;
          padding: 4px 10px;
        }

        .vt-corner-tag span {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
        }

        /* Terminal theme corner tag */
        :root[data-theme="terminal"] .vt-corner-tag {
          background: rgba(0, 255, 102, 0.15);
          border: 1px solid rgba(0, 255, 102, 0.3);
        }

        :root[data-theme="terminal"] .vt-corner-tag span {
          color: #00FF66;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.15em;
        }

        /* ── Tool 2×2 grid ── */
        .vt-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        /* ── Individual tool card ── */
        .vt-card {
          position: relative;
          border-radius: 16px;
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          overflow: hidden;
          cursor: pointer;
          padding: 18px 16px 16px;
          display: flex;
          flex-direction: column;
          gap: 0;
          text-decoration: none;
          outline: none;
          transition:
            transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.22s ease,
            border-color 0.18s ease;
          min-height: 108px;
        }

        .vt-card:focus-visible {
          outline: 2px solid var(--navy-mid, #5ba3ff);
          outline-offset: 2px;
        }

        /* Terminal theme card focus */
        :root[data-theme="terminal"] .vt-card:focus-visible {
          outline: 2px solid #00FF66;
        }

        /* Ghost numeral */
        .vt-card-num {
          position: absolute;
          bottom: -8px;
          right: 6px;
          font-family: 'Instrument Serif', serif;
          font-size: 4.5rem;
          font-weight: 400;
          color: var(--card-border);
          line-height: 1;
          pointer-events: none;
          user-select: none;
          transition: color 0.22s ease, transform 0.22s ease;
        }

        /* Terminal theme ghost numeral */
        :root[data-theme="terminal"] .vt-card-num {
          font-family: 'Space Grotesk', monospace;
          color: rgba(0, 255, 102, 0.15);
        }

        /* Icon badge */
        .vt-card-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: var(--navy);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 14px;
          flex-shrink: 0;
          margin-bottom: 12px;
          transition:
            background 0.18s ease,
            transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          z-index: 1;
        }

        /* Terminal theme icon badge */
        :root[data-theme="terminal"] .vt-card-icon {
          background: #00FF66;
          color: #0A0A0A;
          border: 1px solid #00FF66;
          box-shadow: 0 0 10px rgba(0, 255, 102, 0.3);
        }

        :root[data-theme="terminal"] .vt-card:not(.vt-card--disabled):hover .vt-card-icon {
          background: #FF530D;
          border-color: #FF530D;
          box-shadow: 0 0 15px rgba(255, 83, 13, 0.4);
        }

        /* Text */
        .vt-card-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--ink);
          line-height: 1.2;
          margin-bottom: 2px;
          position: relative;
          z-index: 1;
          transition: color 0.18s ease;
        }

        .vt-card-sub {
          font-size: 11px;
          font-weight: 500;
          color: var(--subtle, var(--muted));
          letter-spacing: 0.02em;
          position: relative;
          z-index: 1;
          transition: color 0.18s ease;
        }

        /* Terminal theme text */
        :root[data-theme="terminal"] .vt-card-title {
          font-family: 'Space Grotesk', sans-serif;
        }

        :root[data-theme="terminal"] .vt-card-sub {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #A0AABF;
        }

        /* Arrow chip — appears on hover */
        .vt-card-arrow {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 24px;
          height: 24px;
          border-radius: 8px;
          background: var(--navy);
          color: #fff;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.18s ease, transform 0.2s ease;
          z-index: 2;
        }

        /* Terminal theme arrow */
        :root[data-theme="terminal"] .vt-card-arrow {
          background: #00FF66;
          color: #0A0A0A;
          font-family: 'DM Mono', monospace;
          font-weight: 700;
        }

        /* ── Active card hover ── */
        .vt-card:not(.vt-card--disabled):hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow:
            0 10px 30px rgba(0,0,0,0.10),
            0 2px 8px rgba(0,0,0,0.06);
          border-color: color-mix(in srgb, var(--navy) 20%, var(--card-border));
        }

        .vt-card:not(.vt-card--disabled):hover .vt-card-icon {
          background: var(--navy-mid, #1d4ed8);
          transform: scale(1.1) rotate(-4deg);
        }

        .vt-card:not(.vt-card--disabled):hover .vt-card-num {
          color: color-mix(in srgb, var(--navy) 8%, transparent);
          transform: translateY(4px) scale(1.06);
        }

        .vt-card:not(.vt-card--disabled):hover .vt-card-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* Terminal theme hover */
        :root[data-theme="terminal"] .vt-card:not(.vt-card--disabled):hover {
          border-color: #00FF66;
          box-shadow: 0 0 20px rgba(0, 255, 102, 0.2);
        }

        :root[data-theme="terminal"] .vt-card:not(.vt-card--disabled):hover .vt-card-num {
          color: rgba(0, 255, 102, 0.25);
        }

        /* ── Disabled card ── */
        .vt-card--disabled {
          cursor: default;
          pointer-events: none;
          opacity: 0.52;
        }

        /* "Coming soon" chip on disabled */
        .vt-card--disabled .vt-card-soon {
          display: inline-flex;
        }

        .vt-card-soon {
          display: none;
          position: absolute;
          top: 12px;
          right: 12px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          background: var(--card-border);
          padding: 3px 7px;
          border-radius: 999px;
          z-index: 2;
        }

        /* Terminal theme soon chip */
        :root[data-theme="terminal"] .vt-card-soon {
          background: rgba(0, 255, 102, 0.1);
          color: #00FF66;
          border: 1px solid rgba(0, 255, 102, 0.3);
          font-family: 'DM Mono', monospace;
        }

        /* ── Dark mode ── */
        :root[data-theme="dark"] .vt-card-icon {
          background: var(--navy-mid, #1d4ed8);
        }

        :root[data-theme="dark"] .vt-card:not(.vt-card--disabled):hover .vt-card-icon {
          background: var(--navy);
        }

        :root[data-theme="dark"] .vt-cinema {
          border-color: rgba(255,255,255,0.06);
        }

        :root[data-theme="dark"] .vt-card {
          background: color-mix(in srgb, var(--card-bg) 90%, transparent);
        }

        /* ── Terminal theme specific overrides ── */
        :root[data-theme="terminal"] .vt-card {
          background: #1C1C1C;
          border: 2px solid rgba(255, 255, 255, 0.08);
        }

        :root[data-theme="terminal"] .vt-cinema {
          border: 2px solid rgba(255, 255, 255, 0.08);
        }
      `}</style>
    </div>
  );
}

/* ── Individual tool card ── */
function ToolCard({
  title,
  sub,
  icon,
  href,
  newTab,
  num,
}: {
  title: string;
  sub: string;
  icon: React.ReactNode;
  href?: string;
  newTab?: boolean;
  num: string;
}) {
  const router = useRouter();
  const disabled = !href;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!href) return;
    if (newTab) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      router.push(href);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!href) return;
      if (newTab) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        router.push(href);
      }
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={title}
      aria-disabled={disabled}
      className={`vt-card${disabled ? " vt-card--disabled" : ""}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Ghost numeral */}
      <span className="vt-card-num" aria-hidden="true">{num}</span>

      {/* Icon */}
      <div className="vt-card-icon" aria-hidden="true">{icon}</div>

      {/* Title + subtitle */}
      <span className="vt-card-title">{title}</span>
      <span className="vt-card-sub">{sub}</span>

      {/* Arrow (enabled) or coming-soon chip (disabled) */}
      {!disabled && (
        <div className="vt-card-arrow" aria-hidden="true">→</div>
      )}
      {disabled && (
        <span className="vt-card-soon">Soon</span>
      )}
    </div>
  );
}