// app/components/Dock.jsx
"use client";

import React, { useState, useRef } from "react";
import {
  FaHome,
  FaTrophy,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaUsers,
} from "react-icons/fa";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react"; // ✅ import NextAuth signOut

const dockItems = [
  { name: "Home",        icon: <FaHome />,       href: "/dashboard" },
  { name: "Leaderboard", icon: <FaTrophy />,     href: "/leaderboard" },
  { name: "Groups",      icon: <FaUsers />,      href: "/groups" },
  { name: "History",     icon: <FaHistory />,    href: "/history" },
  { name: "Settings",    icon: <FaCog />,        href: "/settings" },
  { name: "Logout",      icon: <FaSignOutAlt />, href: null, special: true }, // ✅ href: null — handled by onClick
];

export default function Dock() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(null);
  const dockRef = useRef(null);

  /* Magnification: adjacent items scale up proportionally */
  const getScale = (idx) => {
    if (hovered === null) return 1;
    const dist = Math.abs(idx - hovered);
    if (dist === 0) return 1.55;
    if (dist === 1) return 1.22;
    if (dist === 2) return 1.08;
    return 1;
  };

  const getTranslateY = (idx) => {
    if (hovered === null) return 0;
    const dist = Math.abs(idx - hovered);
    if (dist === 0) return -14;
    if (dist === 1) return -7;
    if (dist === 2) return -2;
    return 0;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

        .dock-root {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Pill ── */
        .dock-pill {
          display: flex;
          align-items: flex-end;
          gap: 4px;
          padding: 10px 16px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--warm-white) 85%, transparent);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--card-border);
          box-shadow: var(--shadow-md);
        }

        :root[data-theme="terminal"] .dock-pill {
          background: rgba(20, 20, 20, 0.85);
          border: 2px solid rgba(255, 255, 255, 0.08);
          box-shadow: var(--shadow-lg);
          backdrop-filter: blur(20px);
        }

        /* ── Item wrapper ── */
        .dock-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        }

        /* ── Icon button ── */
        .dock-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          text-decoration: none;
          position: relative;
          transition:
            transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
            color var(--transition-fast),
            text-shadow var(--transition-fast);
          color: var(--muted);
          will-change: transform;
          background: none;
          border: none;
          cursor: pointer;
        }

        .dock-btn::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%) scale(0);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--navy);
          box-shadow: var(--shadow-navy);
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .dock-btn--active::after {
          transform: translateX(-50%) scale(1);
        }

        .dock-btn--active {
          color: var(--navy);
          text-shadow: var(--shadow-navy);
        }

        .dock-btn--special {
          color: var(--danger);
        }

        .dock-btn--special:hover {
          color: var(--error-text) !important;
          text-shadow: 0 0 10px var(--danger);
        }

        .dock-item:hover .dock-btn:not(.dock-btn--active):not(.dock-btn--special) {
          color: var(--ink);
        }

        /* ── Icon ── */
        .dock-icon {
          font-size: 18px;
          transition: font-size var(--transition-fast);
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Tooltip ── */
        .dock-tooltip {
          position: absolute;
          bottom: calc(100% + 14px);
          left: 50%;
          transform: translateX(-50%) translateY(4px);
          background: var(--card-bg);
          color: var(--ink);
          font-family: 'Space Grotesk', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 12px;
          border: 1px solid var(--card-border);
          border-radius: var(--radius-sm);
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity var(--transition-fast), transform var(--transition-base);
          box-shadow: var(--shadow-md);
        }

        .dock-tooltip::after {
          content: '';
          position: absolute;
          top: 100%; left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-top-color: var(--card-border);
        }

        .dock-tooltip::before {
          content: '';
          position: absolute;
          top: calc(100% - 1px); left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-top-color: var(--card-bg);
          z-index: 1;
        }

        .dock-item:hover .dock-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        :root[data-theme="terminal"] .dock-tooltip {
          background: #0A0A0A;
          border: 2px solid rgba(255, 255, 255, 0.1);
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.15em;
        }

        :root[data-theme="terminal"] .dock-tooltip::before {
          border-top-color: #0A0A0A;
        }

        :root[data-theme="terminal"] .dock-tooltip::after {
          border-top-color: rgba(255, 255, 255, 0.1);
        }

        /* ── Separator ── */
        .dock-sep {
          width: 1px;
          height: 28px;
          background: var(--card-border);
          border-radius: 1px;
          align-self: center;
          margin: 0 4px;
          flex-shrink: 0;
        }

        :root[data-theme="terminal"] .dock-sep {
          background: rgba(255, 255, 255, 0.1);
          width: 2px;
        }

        @media (max-width: 400px) {
          .dock-btn { width: 38px; height: 38px; }
          .dock-icon { font-size: 15px; }
          .dock-pill { gap: 2px; padding: 8px 12px; }
        }

        @media (min-width: 768px) {
          .dock-btn { width: 48px; height: 48px; }
          .dock-icon { font-size: 20px; }
          .dock-pill { gap: 6px; padding: 12px 20px; }
        }

        :root:not([data-theme="dark"]):not([data-theme="terminal"]) .dock-pill {
          background: rgba(250, 250, 250, 0.85);
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        :root:not([data-theme="dark"]):not([data-theme="terminal"]) .dock-tooltip {
          background: var(--warm-white);
          color: var(--ink);
        }

        :root:not([data-theme="dark"]):not([data-theme="terminal"]) .dock-tooltip::before {
          border-top-color: var(--warm-white);
        }

        :root[data-theme="dark"] .dock-pill {
          background: rgba(26, 26, 26, 0.85);
        }

        :root[data-theme="dark"] .dock-tooltip {
          background: #1a1a1a;
        }

        :root[data-theme="dark"] .dock-tooltip::before {
          border-top-color: #1a1a1a;
        }
      `}</style>

      <div className="dock-root">
        <div className="dock-pill" ref={dockRef}>
          {dockItems.map((item, idx) => {
            const isActive   = pathname === item.href;
            const scale      = getScale(idx);
            const translateY = getTranslateY(idx);
            const showSep    = idx === dockItems.length - 1;

            return (
              <React.Fragment key={item.name}>
                {showSep && <div className="dock-sep" />}

                <div
                  className="dock-item"
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Tooltip */}
                  <div className="dock-tooltip">{item.name}</div>

                  {/* ✅ Logout uses button + signOut, all others use <a> */}
                  {item.special ? (
                    <button
                      className={`dock-btn dock-btn--special`}
                      style={{
                        transform: `scale(${scale}) translateY(${translateY}px)`,
                      }}
                      onClick={() =>
                        signOut({ callbackUrl: "/login" })
                      }
                    >
                      <span className="dock-icon">{item.icon}</span>
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      className={`dock-btn ${isActive ? "dock-btn--active" : ""}`}
                      style={{
                        transform: `scale(${scale}) translateY(${translateY}px)`,
                      }}
                    >
                      <span className="dock-icon">{item.icon}</span>
                    </a>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </>
  );
}