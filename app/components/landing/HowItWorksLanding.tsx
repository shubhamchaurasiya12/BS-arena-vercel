// app/components/landing/HowItWorksLanding.tsx
"use client";

import { useEffect, useState, useRef } from "react";

const steps = [
  { 
    num: "01", 
    title: "Join with your IITM BS email", 
    desc: "Sign up in seconds using your student credentials. Your cohort and current term are auto-detected — no manual setup needed.", 
    tag: "30-second signup", 
    tagColor: "navy",
    icon: "🎓"
  },
  { 
    num: "02", 
    title: "Pick your subject & mode", 
    desc: "Choose from your active courses this term. Jump into a live battle, grind solo quizzes, or run a full mock test — your call.", 
    tag: "Syllabus-mapped", 
    tagColor: "gold",
    icon: "📚"
  },
  { 
    num: "03", 
    title: "Compete, earn XP, climb", 
    desc: "Win battles to move up the leaderboard. Earn XP for every activity. Maintain streaks to multiply your gains. Your rank is always live.", 
    tag: "Real-time ranking", 
    tagColor: "navy",
    icon: "⚡"
  },
  { 
    num: "04", 
    title: "Crush the end term", 
    desc: "Run full mock tests under exam conditions. Review your weak spots by topic. Walk into the exam hall knowing exactly what you know.", 
    tag: "Exam simulation", 
    tagColor: "gold",
    icon: "🎯"
  },
];

export default function HowItWorksLanding() {
  const [visible, setVisible] = useState<boolean[]>(new Array(steps.length + 1).fill(false));
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

  const tagColors: Record<string, { bg: string; color: string; border: string }> = {
    navy: { bg: "rgba(0, 33, 71, 0.08)", color: "#002147", border: "rgba(0, 33, 71, 0.2)" },
    gold: { bg: "rgba(201, 168, 76, 0.08)", color: "#c9a84c", border: "rgba(201, 168, 76, 0.2)" },
  };

  return (
    <section id="how" className="how-section">
      <div className="how-container">
        {/* Header */}
        <div
          ref={(el) => {
            if (el && refs.current[0] !== el) refs.current[0] = el;
          }}
          className="how-header fade-in"
          style={{
            opacity: visible[0] ? 1 : 0,
            transform: visible[0] ? "none" : "translateY(40px) scale(0.96)",
            filter: visible[0] ? "blur(0)" : "blur(4px)",
            transition: "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="header-badge">
            <span className="badge-dot" style={{ background: "#002147" }} />
            <span className="section-eyebrow">// The Path to Glory</span>
          </div>
          <h2 className="section-heading">
            From zero to<br/><em>semester topper.</em>
          </h2>
          <p className="header-description">
            Four simple steps to transform your study routine into a competitive journey.
            Join thousands of IITM BS students already on the path.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="steps-grid">
          {steps.map((step, i) => {
            const tagColor = tagColors[step.tagColor];
            
            return (
              <div
                key={i}
                ref={(el) => {
                  if (el && refs.current[i + 1] !== el) refs.current[i + 1] = el;
                }}
                className="step-card"
                style={{
                  opacity: visible[i + 1] ? 1 : 0,
                  transform: visible[i + 1] ? "none" : "translateY(40px) scale(0.96)",
                  filter: visible[i + 1] ? "blur(0)" : "blur(4px)",
                  transition: `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s cubic-bezier(0.16, 1, 0.3, 1)`,
                  transitionDelay: `${i * 0.08}s`,
                }}
              >
                <div className="step-card-inner">
                  {/* Header with icon and number */}
                  <div className="step-header">
                    <span className="step-icon">{step.icon}</span>
                    <span className="step-number">{step.num}</span>
                  </div>

                  {/* Title */}
                  <h3 className="step-title">{step.title}</h3>

                  {/* Description */}
                  <p className="step-description">{step.desc}</p>

                  {/* Tag */}
                  <div className="step-tag-container">
                    <span
                      className="step-tag"
                      style={{
                        border: `1px solid ${tagColor.border}`,
                        color: tagColor.color,
                        background: tagColor.bg,
                      }}
                    >
                      {step.tag}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className="progress-line">
            <div className="progress-fill" style={{ width: visible.filter(Boolean).length * 25 + '%' }} />
          </div>
          <div className="progress-steps">
            {steps.map((_, i) => (
              <div key={i} className={`progress-dot ${visible[i + 1] ? 'active' : ''}`}>
                <span className="dot-label">Step {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .how-section {
          padding: 120px 0;
          background: #fafafa;
          position: relative;
          overflow: hidden;
        }
        
        .how-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
        }
        
        /* ===== Header Styles ===== */
        .how-header {
          margin-bottom: 60px;
          max-width: 700px;
        }
        
        .header-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
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
          margin-bottom: 20px;
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
        
        .header-description {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #7a7670;
          max-width: 600px;
        }
        
        /* ===== Steps Grid ===== */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 60px;
        }
        
        .step-card {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: default;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
          height: 100%;
        }
        
        .step-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          border-color: transparent;
        }
        
        .step-card-inner {
          padding: 32px;
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
          z-index: 2;
        }
        
        .step-card:hover .step-card-inner {
          background: linear-gradient(145deg, #ffffff, #fafafa);
        }
        
        /* Step Header */
        .step-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        
        .step-icon {
          font-size: 2.5rem;
          line-height: 1;
          transition: transform 0.3s ease;
        }
        
        .step-card:hover .step-icon {
          transform: scale(1.1);
        }
        
        .step-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.1);
          transition: color 0.3s ease;
        }
        
        .step-card:hover .step-number {
          color: #c9a84c;
        }
        
        /* Step Title */
        .step-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 600;
          color: #002147;
          margin-bottom: 16px;
          line-height: 1.3;
        }
        
        /* Step Description */
        .step-description {
          font-size: 0.9rem;
          line-height: 1.7;
          color: #7a7670;
          margin-bottom: 24px;
          flex-grow: 1;
        }
        
        /* Step Tag */
        .step-tag-container {
          margin-top: auto;
        }
        
        .step-tag {
          display: inline-block;
          font-weight: 600;
          font-family: 'DM Sans', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 100px;
          transition: all 0.3s ease;
        }
        
        .step-tag:hover {
          transform: scale(1.05);
        }
        
        /* ===== Progress Indicator ===== */
        .progress-indicator {
          margin-top: 40px;
          padding-top: 40px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }
        
        .progress-line {
          height: 2px;
          background: rgba(0, 0, 0, 0.06);
          border-radius: 2px;
          margin-bottom: 16px;
          position: relative;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: #002147;
          border-radius: 2px;
          transition: width 0.6s ease;
        }
        
        .progress-steps {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .progress-dot {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        
        .progress-dot::before {
          content: '';
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .progress-dot.active::before {
          background: #002147;
          border-color: #002147;
          box-shadow: 0 0 0 4px rgba(0, 33, 71, 0.1);
        }
        
        .dot-label {
          font-size: 0.7rem;
          color: #b8b3ab;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
        }
        
        .progress-dot.active .dot-label {
          color: #002147;
          font-weight: 600;
        }
        
        /* ===== Responsive Design ===== */
        
        /* Desktop Large */
        @media (min-width: 1440px) {
          .steps-grid {
            gap: 32px;
          }
        }
        
        /* Tablet */
        @media (max-width: 1024px) {
          .steps-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          
          .step-card-inner {
            padding: 28px;
          }
          
          .step-icon {
            font-size: 2.2rem;
          }
        }
        
        /* Mobile */
        @media (max-width: 768px) {
          .how-section {
            padding: 80px 0;
          }
          
          .how-container {
            padding: 0 24px;
          }
          
          .how-header {
            margin-bottom: 40px;
          }
          
          .header-description {
            font-size: 1rem;
          }
          
          .steps-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            margin-bottom: 40px;
          }
          
          .step-card-inner {
            padding: 24px;
          }
          
          .step-icon {
            font-size: 2rem;
          }
          
          .step-number {
            font-size: 1.8rem;
          }
          
          .step-title {
            font-size: 1.3rem;
            margin-bottom: 12px;
          }
          
          .step-description {
            font-size: 0.85rem;
            margin-bottom: 20px;
          }
          
          .progress-indicator {
            margin-top: 32px;
            padding-top: 32px;
          }
          
          .dot-label {
            font-size: 0.65rem;
          }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .how-section {
            padding: 60px 0;
          }
          
          .how-container {
            padding: 0 16px;
          }
          
          .section-heading {
            font-size: 2.2rem;
          }
          
          .section-heading em::after {
            bottom: 4px;
            height: 3px;
          }
          
          .header-description {
            font-size: 0.95rem;
          }
          
          .step-card-inner {
            padding: 20px;
          }
          
          .step-icon {
            font-size: 1.8rem;
          }
          
          .step-number {
            font-size: 1.6rem;
          }
          
          .step-title {
            font-size: 1.2rem;
          }
          
          .step-description {
            font-size: 0.82rem;
          }
          
          .step-tag {
            font-size: 0.6rem;
            padding: 5px 12px;
          }
          
          .progress-steps {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
          
          .progress-dot {
            flex-direction: row;
            width: 100%;
          }
          
          .progress-dot::before {
            width: 10px;
            height: 10px;
          }
        }
      `}</style>
    </section>
  );
}