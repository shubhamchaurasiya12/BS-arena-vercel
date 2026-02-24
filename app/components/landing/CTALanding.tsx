// D:\BS-arena-NextJS\app\components\landing\CTALanding.tsx
"use client";

import { useEffect, useRef } from "react";

export default function CTALanding() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("on");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll(".r");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="cta" 
      ref={sectionRef}
      className="cta-section"
    >
      {/* Ambient Background */}
      <div className="cta-ambient" />
      
      {/* Inner Content */}
      <div className="cta-inner r">
        {/* Stats Bar */}
        <div className="cta-stats">
          <div className="stat-item">
            <span className="stat-value">3,200+</span>
            <span className="stat-label">Active Students</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">24/7</span>
            <span className="stat-label">Leaderboard</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">100%</span>
            <span className="stat-label">Free Access</span>
          </div>
        </div>

        {/* Eyebrow */}
        <div className="cta-eyebrow">
          <span className="eyebrow-badge">✨ Join the community</span>
          <span className="eyebrow-text">Free forever · No credit card · Open to all IITM BS students</span>
        </div>

        {/* Title */}
        <h2 className="cta-title">
          Your cohort
          <br />
          <em>is already here.</em>
        </h2>

        {/* Body Text */}
        <p className="cta-body">
          3,200+ IITM BS Data Science students are already competing, grinding,
          and climbing. The leaderboard is live. Your rank is waiting.
        </p>

        {/* Buttons */}
        <div className="cta-buttons">
          <button 
            className="btn-cta primary"
            suppressHydrationWarning={true}
          >
            <span>Enter the Arena — Free</span>
            <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.16666 10H15.8333M15.8333 10L11.6667 5.83333M15.8333 10L11.6667 14.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            className="btn-cta secondary"
            suppressHydrationWarning={true}
          >
            <span>Browse the Leaderboard</span>
            <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.83333 14.1667L14.1667 5.83333M14.1667 5.83333H5.83333M14.1667 5.83333V14.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="cta-trust">
          <div className="trust-item">
            <span className="trust-icon">🎓</span>
            <span className="trust-text">Built by IITM BS students</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">🚫</span>
            <span className="trust-text">No ads, ever</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">⚡</span>
            <span className="trust-text">Real-time updates</span>
          </div>
        </div>

        {/* Note */}
        <div className="cta-note">
          No paywall. No ads.{' '}
          <span>Built by IITM BS students, for IITM BS students.</span>
        </div>
      </div>

      <style jsx>{`
        .cta-section {
          padding: 120px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
          background: #eee9e1;
        }
        
        .cta-ambient {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201, 168, 76, 0.12) 0%, transparent 70%);
        }
        
        .cta-inner {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
        }
        
        /* Stats Bar */
        .cta-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          margin-bottom: 48px;
          padding: 20px 32px;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px);
          border-radius: 100px;
          border: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 600;
          color: #002147;
          line-height: 1.2;
        }
        
        .stat-label {
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          color: #7a7670;
          text-transform: uppercase;
          font-weight: 500;
        }
        
        .stat-divider {
          width: 1px;
          height: 30px;
          background: rgba(0, 0, 0, 0.1);
        }
        
        /* Eyebrow */
        .cta-eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        
        .eyebrow-badge {
          font-size: 0.7rem;
          padding: 6px 16px;
          background: #002147;
          color: white;
          border-radius: 100px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        
        .eyebrow-text {
          font-family: 'DM Sans', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: #7a7670;
          text-transform: uppercase;
          font-weight: 500;
        }
        
        /* Title */
        .cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 8vw, 5.5rem);
          font-weight: 300;
          line-height: 0.95;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
          color: #002147;
        }
        
        .cta-title em {
          font-style: italic;
          color: #7a7670;
          display: inline-block;
          position: relative;
        }
        
        .cta-title em::after {
          content: '';
          position: absolute;
          bottom: 8px;
          left: 0;
          width: 100%;
          height: 4px;
          background: rgba(201, 168, 76, 0.2);
          border-radius: 2px;
        }
        
        /* Body */
        .cta-body {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #7a7670;
          margin: 0 auto 40px;
          max-width: 600px;
          padding: 0 16px;
        }
        
        /* Buttons */
        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }
        
        .btn-cta {
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          padding: 16px 32px;
          border-radius: 100px;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 240px;
        }
        
        .btn-icon {
          transition: transform 0.2s ease;
        }
        
        .btn-cta.primary {
          background: #002147;
          color: #ffffff;
          box-shadow: 0 8px 20px rgba(0, 33, 71, 0.2);
        }
        
        .btn-cta.primary:hover {
          background: #003366;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0, 33, 71, 0.3);
        }
        
        .btn-cta.primary:hover .btn-icon {
          transform: translateX(4px);
        }
        
        .btn-cta.secondary {
          background: transparent;
          border: 2px solid rgba(0, 33, 71, 0.15);
          color: #002147;
        }
        
        .btn-cta.secondary:hover {
          border-color: #002147;
          background: rgba(0, 33, 71, 0.02);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 33, 71, 0.1);
        }
        
        .btn-cta.secondary:hover .btn-icon {
          transform: rotate(90deg);
        }
        
        /* Trust Indicators */
        .cta-trust {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        
        .trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #7a7670;
        }
        
        .trust-icon {
          font-size: 1.2rem;
        }
        
        .trust-text {
          font-weight: 500;
        }
        
        /* Note */
        .cta-note {
          font-family: 'DM Sans', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: #b8b3ab;
          text-transform: uppercase;
          font-weight: 500;
          padding-top: 24px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          display: inline-block;
        }
        
        .cta-note span {
          color: #002147;
          font-weight: 600;
        }
        
        /* ===== Responsive Design ===== */
        
        /* Desktop Large */
        @media (min-width: 1440px) {
          .cta-section {
            padding: 140px 24px;
          }
        }
        
        /* Tablet */
        @media (max-width: 1024px) {
          .cta-stats {
            padding: 16px 24px;
            gap: 20px;
          }
          
          .stat-value {
            font-size: 1.5rem;
          }
        }
        
        /* Mobile */
        @media (max-width: 768px) {
          .cta-section {
            padding: 80px 20px;
          }
          
          .cta-stats {
            flex-direction: column;
            gap: 16px;
            padding: 24px;
            border-radius: 32px;
            background: rgba(255, 255, 255, 0.7);
          }
          
          .stat-divider {
            width: 60px;
            height: 1px;
          }
          
          .stat-item {
            width: 100%;
          }
          
          .cta-eyebrow {
            flex-direction: column;
            gap: 12px;
          }
          
          .eyebrow-badge {
            font-size: 0.65rem;
            padding: 4px 12px;
          }
          
          .cta-title {
            font-size: 2.8rem;
          }
          
          .cta-title em::after {
            bottom: 4px;
            height: 3px;
          }
          
          .cta-body {
            font-size: 1rem;
            padding: 0 12px;
            margin-bottom: 32px;
          }
          
          .cta-buttons {
            flex-direction: column;
            gap: 12px;
          }
          
          .btn-cta {
            width: 100%;
            min-width: auto;
            padding: 16px 24px;
            font-size: 0.9rem;
          }
          
          .cta-trust {
            gap: 20px;
            flex-direction: column;
            align-items: flex-start;
          }
          
          .trust-item {
            width: 100%;
          }
          
          .cta-note {
            font-size: 0.7rem;
            padding-top: 20px;
          }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .cta-section {
            padding: 60px 16px;
          }
          
          .cta-stats {
            padding: 20px;
            margin-bottom: 32px;
          }
          
          .stat-value {
            font-size: 1.3rem;
          }
          
          .stat-label {
            font-size: 0.65rem;
          }
          
          .cta-title {
            font-size: 2.4rem;
          }
          
          .cta-body {
            font-size: 0.95rem;
          }
          
          .btn-cta {
            padding: 14px 20px;
            font-size: 0.85rem;
          }
          
          .trust-item {
            font-size: 0.85rem;
          }
          
          .trust-icon {
            font-size: 1rem;
          }
        }
        
        /* Animation on scroll */
        .r {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .r.on {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
}