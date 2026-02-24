// app/components/landing/FeaturesLanding.tsx
"use client";

import { useEffect, useState, useRef } from "react";

const features = [
  { 
    num: "01", 
    dot: "navy", 
    name: "Compete", 
    subtitle: "Live Battles", 
    desc: "Head-to-head quiz duels with your batchmates on any IITM BS subject. Real-time scoring, instant results, ranked outcomes. Every match moves your rank.",
    xp: "+XP per win", 
    barWidth: 90,
    icon: "⚔️"
  },
  { 
    num: "02", 
    dot: "gold", 
    name: "Practice", 
    subtitle: "Subject Quizzes", 
    desc: "Hundreds of MCQs mapped to the IITM BS curriculum — week by week. Sharpen your edge on Statistics, Python, Maths, and DSA before the assessment hits.",
    xp: "Track accuracy", 
    barWidth: 75,
    icon: "📚"
  },
  { 
    num: "03", 
    dot: "navy", 
    name: "Simulate", 
    subtitle: "Mock Tests", 
    desc: "Full-length, timed end-term simulations for every IITM BS course. Real exam conditions. Instant performance breakdown. Know where you stand before it counts.",
    xp: "Exam-ready", 
    barWidth: 80,
    icon: "🎯"
  },
  { 
    num: "04", 
    dot: "gold", 
    name: "Memorise", 
    subtitle: "Flashcards", 
    desc: "Community-built flashcard decks for every subject. Spaced repetition built in. Study on the go, revise formulas, definitions, and code — anywhere, anytime.",
    xp: "Spaced recall", 
    barWidth: 65,
    icon: "🧠"
  },
  { 
    num: "05", 
    dot: "navy", 
    name: "Rank", 
    subtitle: "Live Leaderboard", 
    desc: "See exactly where you stand in your cohort — overall, by subject, by term. Weekly resets keep the competition fierce. Every point earned is a point fought for.",
    xp: "Real-time rank", 
    barWidth: 100,
    icon: "🏆"
  },
  { 
    num: "06", 
    dot: "gold", 
    name: "Grind", 
    subtitle: "XP & Streaks", 
    desc: "Every quiz, flashcard session, and mock test earns XP. Maintain streaks to multiply your gains. Your dedication becomes your rank — visibly, permanently.",
    xp: "Daily streaks", 
    barWidth: 60,
    icon: "🔥"
  },
];

export default function FeaturesLanding() {
  const [visible, setVisible] = useState<boolean[]>(new Array(features.length + 2).fill(false));
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
    <section id="features" className="features-section">
      {/* Header */}
      <div className="features-header">
        <div
          ref={(el) => {
            if (el && refs.current[0] !== el) refs.current[0] = el;
          }}
          className="r fade-in header-left"
          style={{
            opacity: visible[0] ? 1 : 0,
            transform: visible[0] ? "none" : "translateY(40px) scale(0.96)",
            filter: visible[0] ? "blur(0)" : "blur(4px)",
            transition: "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="section-badge">
            <span className="badge-dot" style={{ background: dotColors.navy }} />
            <span className="section-eyebrow">// Your Weapons</span>
          </div>
          <h2 className="section-heading">
            Everything you need<br/><em>to dominate.</em>
          </h2>
        </div>

        <div
          ref={(el) => {
            if (el && refs.current[1] !== el) refs.current[1] = el;
          }}
          className="r fade-in header-right"
          style={{
            opacity: visible[1] ? 1 : 0,
            transform: visible[1] ? "none" : "translateY(40px) scale(0.96)",
            filter: visible[1] ? "blur(0)" : "blur(4px)",
            transition: "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="features-description">
            <p>Every tool is purpose-built for the IITM BS syllabus — from Computational Thinking to Machine Learning. Practice alone. Then go to war.</p>
            <div className="stats-mini">
              <div className="stat-mini-item">
                <span className="stat-mini-value">6</span>
                <span className="stat-mini-label">Core Features</span>
              </div>
              <div className="stat-mini-divider" />
              <div className="stat-mini-item">
                <span className="stat-mini-value">∞</span>
                <span className="stat-mini-label">Practice Hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="features-grid">
        {features.map((feat, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el && refs.current[i + 2] !== el) refs.current[i + 2] = el;
            }}
            className="feature-card"
            style={{
              opacity: visible[i + 2] ? 1 : 0,
              transform: visible[i + 2] ? "none" : "translateY(40px) scale(0.96)",
              filter: visible[i + 2] ? "blur(0)" : "blur(4px)",
              transition: `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s cubic-bezier(0.16, 1, 0.3, 1)`,
              transitionDelay: `${i * 0.08}s`,
            }}
          >
            <div className="feature-card-inner">
              {/* Header with icon and dot */}
              <div className="feature-header">
                <div className="feature-icon-wrapper">
                  <span className="feature-icon">{feat.icon}</span>
                  <div 
                    className="feature-dot"
                    style={{ background: dotColors[feat.dot] }}
                  />
                </div>
                <span className="feature-number">{feat.num}</span>
              </div>

              {/* Title */}
              <div className="feature-title">
                <h3 className="feature-name">{feat.name}</h3>
                <span className="feature-subtitle">{feat.subtitle}</span>
              </div>

              {/* Description */}
              <p className="feature-description">
                {feat.desc}
              </p>

              {/* Footer with XP and progress */}
              <div className="feature-footer">
                <div className="feature-xp-tag">
                  <span className="xp-icon">⚡</span>
                  <span 
                    className="feature-xp"
                    style={{ color: dotColors[feat.dot] }}
                  >
                    {feat.xp}
                  </span>
                </div>
                <div className="xp-bar-container">
                  <div 
                    className="xp-bar-fill"
                    style={{ 
                      width: visible[i + 2] ? `${feat.barWidth}%` : "0%",
                      background: dotColors[feat.dot]
                    }}
                  />
                </div>
              </div>

              {/* Hover gradient effect */}
              <div className="card-glow" style={{ background: `radial-gradient(circle at 100% 0%, ${dotColors[feat.dot]}15, transparent 70%)` }} />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .features-section {
          padding: 120px 0;
          background: #fafafa;
          position: relative;
          overflow: hidden;
        }
        
        /* ===== Header Styles ===== */
        .features-header {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px 60px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: end;
        }
        
        .section-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
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
        
        .features-description {
          font-size: 1rem;
          line-height: 1.7;
          color: #7a7670;
        }
        
        .stats-mini {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 24px;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 100px;
          border: 1px solid rgba(0, 0, 0, 0.04);
        }
        
        .stat-mini-item {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        
        .stat-mini-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: #002147;
        }
        
        .stat-mini-label {
          font-size: 0.8rem;
          color: #7a7670;
        }
        
        .stat-mini-divider {
          width: 1px;
          height: 24px;
          background: rgba(0, 0, 0, 0.1);
        }
        
        /* ===== Features Grid ===== */
        .features-grid {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        
        .feature-card {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: default;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
        }
        
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          border-color: transparent;
        }
        
        .feature-card-inner {
          padding: 32px;
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
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
        
        .feature-card:hover .card-glow {
          opacity: 0.6;
        }
        
        /* Feature Header */
        .feature-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        
        .feature-icon-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .feature-icon {
          font-size: 2rem;
          line-height: 1;
        }
        
        .feature-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        
        .feature-number {
          font-family: 'DM Sans', monospace;
          font-size: 0.8rem;
          font-weight: 600;
          color: #b8b3ab;
          letter-spacing: 0.05em;
        }
        
        /* Feature Title */
        .feature-title {
          margin-bottom: 16px;
        }
        
        .feature-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 600;
          color: #002147;
          line-height: 1.2;
          margin-bottom: 4px;
        }
        
        .feature-subtitle {
          font-size: 0.9rem;
          color: #7a7670;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        
        /* Description */
        .feature-description {
          font-size: 0.9rem;
          line-height: 1.7;
          color: #7a7670;
          margin-bottom: 24px;
          flex: 1;
        }
        
        /* Footer */
        .feature-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 20px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          margin-top: auto;
        }
        
        .feature-xp-tag {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .xp-icon {
          font-size: 0.9rem;
          opacity: 0.7;
        }
        
        .feature-xp {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        
        .xp-bar-container {
          width: 80px;
          height: 4px;
          background: rgba(0, 0, 0, 0.08);
          overflow: hidden;
          border-radius: 4px;
        }
        
        .xp-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 2s cubic-bezier(0.16, 1, 0.3, 1) 0.6s;
        }
        
        /* ===== Responsive Design ===== */
        
        /* Desktop Large */
        @media (min-width: 1440px) {
          .features-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        /* Tablet */
        @media (max-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }
        
        /* Mobile */
        @media (max-width: 768px) {
          .features-section {
            padding: 80px 0;
          }
          
          .features-header {
            grid-template-columns: 1fr;
            padding: 0 20px 40px;
            gap: 24px;
          }
          
          .section-heading {
            font-size: 2.5rem;
          }
          
          .section-heading em::after {
            bottom: 4px;
            height: 3px;
          }
          
          .stats-mini {
            padding: 12px 16px;
            border-radius: 40px;
          }
          
          .stat-mini-value {
            font-size: 1.3rem;
          }
          
          .stat-mini-label {
            font-size: 0.75rem;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
            padding: 0 20px;
            gap: 16px;
          }
          
          .feature-card-inner {
            padding: 24px;
          }
          
          .feature-icon {
            font-size: 1.8rem;
          }
          
          .feature-name {
            font-size: 1.6rem;
          }
          
          .feature-description {
            font-size: 0.85rem;
          }
          
          .xp-bar-container {
            width: 60px;
          }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .features-section {
            padding: 60px 0;
          }
          
          .features-header {
            padding: 0 16px 32px;
          }
          
          .section-heading {
            font-size: 2.2rem;
          }
          
          .stats-mini {
            flex-direction: column;
            align-items: flex-start;
            border-radius: 20px;
            gap: 12px;
          }
          
          .stat-mini-divider {
            display: none;
          }
          
          .stat-mini-item {
            width: 100%;
          }
          
          .features-grid {
            padding: 0 16px;
          }
          
          .feature-card-inner {
            padding: 20px;
          }
          
          .feature-header {
            margin-bottom: 16px;
          }
          
          .feature-icon {
            font-size: 1.6rem;
          }
          
          .feature-name {
            font-size: 1.4rem;
          }
          
          .feature-subtitle {
            font-size: 0.8rem;
          }
          
          .feature-footer {
            padding-top: 16px;
          }
          
          .xp-bar-container {
            width: 50px;
          }
        }
      `}</style>
    </section>
  );
}