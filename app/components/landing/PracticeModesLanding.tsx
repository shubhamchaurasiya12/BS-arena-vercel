// app/components/landing/PracticeModesLanding.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import Link from 'next/link';

const modes = [
  {
    label: "High Intensity",
    dot: "navy",
    name: "Live 1v1 Battle",
    desc: "Challenge any student in your cohort to a timed quiz duel. Same questions, same clock. Winner takes the XP and the rank points. Loser goes back to study.",
    tags: ["Real-time", "Ranked", "Any subject"],
    icon: "⚔️",
    stats: { players: "2 players", duration: "5 min", xp: "2x multiplier" }
  },
  {
    label: "Tournament",
    dot: "gold",
    name: "Cohort Arena",
    desc: "Weekly open tournaments — every enrolled student competes. Bracket format, multiple rounds, subject declared 24 hours in advance. The top 10 make the Hall of Fame.",
    tags: ["Weekly", "Bracket", "Hall of Fame"],
    icon: "🏆",
    stats: { players: "32-128", duration: "1 week", xp: "3x multiplier" }
  },
  {
    label: "Simulation",
    dot: "navy",
    name: "End-Term Mock",
    desc: "Full-length exam simulations for every IITM BS course. Real time limits, randomised question sets, instant topic-wise score breakdown. Run it as many times as you need.",
    tags: ["Timed", "Full syllabus", "Unlimited attempts"],
    icon: "🎯",
    stats: { players: "Solo", duration: "3 hours", xp: "1.5x multiplier" }
  },
  {
    label: "Solo Grind",
    dot: "gold",
    name: "Flashcards & Drills",
    desc: "Community-created flashcard decks and topic-wise drill sets. Study formulas, definitions, code snippets and concepts — on mobile, anytime. Earn XP even grinding solo.",
    tags: ["Spaced repetition", "Community decks", "Mobile-first"],
    icon: "📚",
    stats: { players: "Solo", duration: "Any time", xp: "1x multiplier" }
  },
];

export default function PracticeModesLanding() {
  const [visible, setVisible] = useState<boolean[]>(new Array(modes.length + 1).fill(false));
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = refs.current.indexOf(entry.target as HTMLDivElement);
          if (entry.isIntersecting && idx !== -1) {
            setVisible((prev) => {
              const updated = [...prev];
              updated[idx] = true;
              return updated;
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    refs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const dotColors: Record<string, string> = {
    navy: "#002147",
    gold: "#c9a84c",
  };

  return (
    <section id="modes" className="modes-section">
      {/* Header */}
      <div className="modes-header">
        <div
          ref={(el) => {
            if (el && refs.current[0] !== el) refs.current[0] = el;
          }}
          className="modes-header-title fade-in"
          style={{
            opacity: visible[0] ? 1 : 0,
            transform: visible[0] ? "none" : "translateY(40px) scale(0.96)",
            filter: visible[0] ? "blur(0)" : "blur(4px)",
            transition: "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="header-badge">
            <span className="badge-dot" style={{ background: "#002147" }} />
            <p className="section-eyebrow">// Practice Modes</p>
          </div>
          <h2 className="section-heading">
            Fight on your<br/><em>own terms.</em>
          </h2>
        </div>
        
        <div className="modes-stats">
          <div className="stat-bubble">
            <span className="stat-bubble-number">4</span>
            <span className="stat-bubble-label">Modes</span>
          </div>
          <p className="modes-description">
            Choose your intensity level. From quick 1v1 battles to full exam simulations.
          </p>
        </div>
      </div>

      {/* Modes Grid */}
      <div className="modes-grid">
        {modes.map((mode, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el && refs.current[i + 1] !== el) refs.current[i + 1] = el;
            }}
            className="mode-card"
            style={{
              opacity: visible[i + 1] ? 1 : 0,
              transform: visible[i + 1] ? "none" : "translateY(40px) scale(0.96)",
              filter: visible[i + 1] ? "blur(0)" : "blur(4px)",
              transition: `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s cubic-bezier(0.16, 1, 0.3, 1)`,
              transitionDelay: `${i * 0.08}s`,
            }}
          >
            <div className="mode-card-inner">
              {/* Card Header */}
              <div className="mode-header">
                <div className="mode-icon-wrapper" style={{ background: `${dotColors[mode.dot]}15` }}>
                  <span className="mode-icon">{mode.icon}</span>
                </div>
                <div className="mode-label" style={{ color: dotColors[mode.dot] }}>
                  <div className="mode-dot" style={{ background: dotColors[mode.dot] }} />
                  {mode.label}
                </div>
              </div>

              {/* Mode Name */}
              <h3 className="mode-name">
                {mode.name}
              </h3>

              {/* Mode Description */}
              <p className="mode-description">
                {mode.desc}
              </p>

              {/* Quick Stats */}
              <div className="mode-stats">
                <div className="mode-stat-item">
                  <span className="stat-icon">👥</span>
                  <span className="stat-text">{mode.stats.players}</span>
                </div>
                <div className="mode-stat-item">
                  <span className="stat-icon">⏱️</span>
                  <span className="stat-text">{mode.stats.duration}</span>
                </div>
                <div className="mode-stat-item">
                  <span className="stat-icon">⚡</span>
                  <span className="stat-text">{mode.stats.xp}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="mode-tags">
                {mode.tags.map((tag, j) => (
                  <span key={j} className="mode-tag">
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <Link href="/login">
                <button className="mode-cta">
                  <span>Play Now</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3.33333 8H12.6667M12.6667 8L9.33333 4.66667M12.6667 8L9.33333 11.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </Link>

              {/* Hover Gradient */}
              <div className="card-glow" style={{ background: `radial-gradient(circle at 100% 0%, ${dotColors[mode.dot]}20, transparent 70%)` }} />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .modes-section {
          padding: 120px 0;
          background: #fafafa;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          position: relative;
          overflow: hidden;
        }
        
        /* ===== Header Styles ===== */
        .modes-header {
          max-width: 1280px;
          margin: 0 auto 60px;
          padding: 0 32px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 32px;
        }
        
        .header-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        
        .section-eyebrow {
          font-size: 0.7rem;
          letter-spacing: 0.16em;
          color: #b8b3ab;
          text-transform: uppercase;
          font-weight: 600;
        }
        
        .section-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 300;
          line-height: 1.05;
          color: #002147;
        }
        
        .section-heading em {
          font-style: italic;
          color: #7a7670;
          display: inline-block;
          position: relative;
        }
        
        .section-heading em::after {
          content: '';
          position: absolute;
          bottom: 8px;
          left: 0;
          width: 100%;
          height: 4px;
          background: rgba(201, 168, 76, 0.2);
          border-radius: 2px;
        }
        
        .modes-stats {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        
        .stat-bubble {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 50%;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.02);
        }
        
        .stat-bubble-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 600;
          color: #002147;
          line-height: 1;
        }
        
        .stat-bubble-label {
          font-size: 0.65rem;
          color: #b8b3ab;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .modes-description {
          max-width: 280px;
          font-size: 0.9rem;
          line-height: 1.6;
          color: #7a7670;
        }
        
        /* ===== Modes Grid ===== */
        .modes-grid {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        
        .mode-card {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: default;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
          height: 100%;
        }
        
        .mode-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.08);
          border-color: transparent;
        }
        
        .mode-card-inner {
          padding: 32px;
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
          z-index: 2;
        }
        
        .card-glow {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: 1;
        }
        
        .mode-card:hover .card-glow {
          opacity: 0.6;
        }
        
        /* Mode Header */
        .mode-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        
        .mode-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          transition: transform 0.3s ease;
        }
        
        .mode-card:hover .mode-icon-wrapper {
          transform: scale(1.1);
        }
        
        .mode-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
        }
        
        .mode-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        
        /* Mode Name */
        .mode-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 600;
          color: #002147;
          margin-bottom: 16px;
          line-height: 1.2;
        }
        
        /* Mode Description */
        .mode-description {
          font-size: 0.9rem;
          line-height: 1.7;
          color: #7a7670;
          margin-bottom: 24px;
          flex-grow: 1;
        }
        
        /* Quick Stats */
        .mode-stats {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: rgba(0, 0, 0, 0.02);
          border-radius: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        
        .mode-stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
        }
        
        .stat-icon {
          opacity: 0.6;
        }
        
        .stat-text {
          color: #002147;
          font-weight: 500;
        }
        
        /* Tags */
        .mode-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        
        .mode-tag {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          padding: 6px 14px;
          border-radius: 100px;
          background: rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(0, 0, 0, 0.06);
          color: #7a7670;
          transition: all 0.3s ease;
        }
        
        .mode-tag:hover {
          background: #002147;
          color: white;
          border-color: #002147;
          transform: translateY(-2px);
        }
        
        /* CTA Button */
        .mode-cta {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 14px 20px;
          background: transparent;
          border: 2px solid rgba(0, 33, 71, 0.1);
          border-radius: 100px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #002147;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: auto;
        }
        
        .mode-cta:hover {
          background: #002147;
          color: white;
          border-color: #002147;
        }
        
        .mode-cta:hover svg {
          transform: translateX(4px);
        }
        
        .mode-cta svg {
          transition: transform 0.3s ease;
        }
        
        /* ===== Responsive Design ===== */
        
        /* Tablet */
        @media (max-width: 1024px) {
          .modes-grid {
            gap: 20px;
          }
          
          .mode-card-inner {
            padding: 28px;
          }
          
          .mode-name {
            font-size: 1.6rem;
          }
        }
        
        /* Mobile */
        @media (max-width: 768px) {
          .modes-section {
            padding: 80px 0;
          }
          
          .modes-header {
            flex-direction: column;
            align-items: flex-start;
            padding: 0 24px;
            margin-bottom: 40px;
          }
          
          .modes-stats {
            width: 100%;
          }
          
          .stat-bubble {
            width: 70px;
            height: 70px;
          }
          
          .stat-bubble-number {
            font-size: 1.8rem;
          }
          
          .modes-description {
            max-width: 100%;
          }
          
          .modes-grid {
            grid-template-columns: 1fr;
            padding: 0 24px;
            gap: 16px;
          }
          
          .mode-card-inner {
            padding: 24px;
          }
          
          .mode-icon-wrapper {
            width: 44px;
            height: 44px;
            font-size: 1.3rem;
          }
          
          .mode-name {
            font-size: 1.5rem;
          }
          
          .mode-description {
            font-size: 0.85rem;
          }
          
          .mode-stats {
            padding: 12px;
            gap: 12px;
          }
          
          .mode-stat-item {
            font-size: 0.75rem;
          }
          
          .mode-tag {
            font-size: 0.6rem;
            padding: 5px 12px;
          }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .modes-section {
            padding: 60px 0;
          }
          
          .modes-header {
            padding: 0 16px;
          }
          
          .modes-grid {
            padding: 0 16px;
          }
          
          .mode-card-inner {
            padding: 20px;
          }
          
          .mode-header {
            margin-bottom: 16px;
          }
          
          .mode-icon-wrapper {
            width: 40px;
            height: 40px;
            font-size: 1.2rem;
          }
          
          .mode-label {
            font-size: 0.6rem;
          }
          
          .mode-name {
            font-size: 1.3rem;
            margin-bottom: 12px;
          }
          
          .mode-description {
            font-size: 0.8rem;
            margin-bottom: 20px;
          }
          
          .mode-stats {
            flex-direction: column;
            gap: 8px;
            padding: 12px;
          }
          
          .mode-stat-item {
            width: 100%;
          }
          
          .mode-tags {
            gap: 6px;
          }
          
          .mode-tag {
            font-size: 0.55rem;
            padding: 4px 10px;
          }
          
          .mode-cta {
            padding: 12px 16px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </section>
  );
}