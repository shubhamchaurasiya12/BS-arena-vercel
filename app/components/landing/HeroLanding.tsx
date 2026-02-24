// D:\BS-arena-NextJS\app\components\landing\HeroLanding.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import Link from 'next/link';

interface HeroLandingProps {
  scrollY: number;
}

export default function HeroLanding({ scrollY }: HeroLandingProps) {
  const [mounted, setMounted] = useState(false);
  const heroInnerRef = useRef<HTMLDivElement>(null);
  const ambARef = useRef<HTMLDivElement>(null);
  const ambBRef = useRef<HTMLDivElement>(null);
  const heroGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update parallax effects based on scrollY
  useEffect(() => {
    if (heroGridRef.current) {
      heroGridRef.current.style.transform = `translateY(${scrollY * 0.15}px)`;
    }
    if (ambARef.current) {
      ambARef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
    if (ambBRef.current) {
      ambBRef.current.style.transform = `translateY(${scrollY * 0.15}px)`;
    }
  }, [scrollY]);

  // Mouse move parallax effect
  useEffect(() => {
    if (!mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!heroInnerRef.current) return;
      const dx = (e.clientX / window.innerWidth - 0.5) * 15;
      const dy = (e.clientY / window.innerHeight - 0.5) * 10;
      heroInnerRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [mounted]);

  return (
    <section id="hero" className="hero-section">
      
      {/* Hero Grid */}
      <div ref={heroGridRef} className="hero-grid" />

      {/* Ambient Gradients */}
      <div className="hero-ambient">
        <div ref={ambARef} className="ambient-gradient ambient-a" />
        <div ref={ambBRef} className="ambient-gradient ambient-b" />
        <div className="ambient-gradient ambient-c" />
      </div>

      {/* Hero Inner Content */}
      <div ref={heroInnerRef} className="hero-inner">
        {/* Hero Tag */}
        <div className="hero-tag">
          <span className="hero-tag-line" />
          <span className="hero-tag-text">
            <span className="tag-badge">✨ NEW</span>
            IITM BS Data Science · Student Companion
          </span>
          <span className="hero-tag-line" />
        </div>

        {/* Hero Title */}
        <h1 className="hero-title">
          Study less.
          <br/>
          <em>Compete</em>{' '}
          <span className="hero-title-highlight">
            more.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="hero-subtitle">
          BS Arena turns your IITM BS journey into a competitive battleground. 
          Battle classmates on quizzes, climb the semester leaderboard, and track 
          every point of your grind — live.
        </p>

        {/* Hero Actions */}
        <div className="hero-actions">
          <Link href="/login">
            <button className="btn-hero primary">
              <span>Enter the Arena</span>
              <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.16666 10H15.8333M15.8333 10L11.6667 5.83333M15.8333 10L11.6667 14.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </Link>

          <Link href="/login">
            <button className="btn-hero secondary">
              <span>See the Rankings</span>
              <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.83333 14.1667L14.1667 5.83333M14.1667 5.83333H5.83333M14.1667 5.83333V14.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </Link>
        </div>

        {/* Free Badge with Trust Indicators */}
        <div className="hero-badge-container">
          <div className="hero-badge">
            <span className="badge-icon">🎓</span>
            <span>100% free · Built for IITM BS students</span>
          </div>
          <div className="badge-separator" />
          <div className="hero-badge">
            <span className="badge-icon">🚫</span>
            <span>No paywalls. Ever.</span>
          </div>
        </div>
      </div>

      {/* Hero Stats Ribbon */}
      <div className="hero-stats">
        <div className="stats-container">
          {[
            { num: '3,200+', label: 'Active Students', icon: '👥' },
            { num: '18K+', label: 'Quizzes Fought', icon: '⚔️' },
            { num: '400+', label: 'Mock Tests', icon: '📝' },
            { num: '24/7', label: 'Live Competitions', icon: '⚡' },
          ].map((item, i) => (
            <div key={i} className="stat-card">
              <span className="stat-icon">{item.icon}</span>
              <div className="stat-content">
                <span className="stat-number">{item.num}</span>
                <span className="stat-label">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0;
          overflow: hidden;
          background: #fafafa;
        }
        
        /* Grid Background */
        .hero-grid {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image: 
            linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 90%);
          -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 90%);
          will-change: transform;
        }
        
        /* Ambient Gradients */
        .hero-ambient {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        
        .ambient-gradient {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          will-change: transform;
        }
        
        .ambient-a {
          width: min(700px, 80vw);
          height: min(600px, 70vh);
          left: -10%;
          top: -10%;
          background: radial-gradient(circle, rgba(0, 33, 71, 0.1) 0%, transparent 70%);
        }
        
        .ambient-b {
          width: min(550px, 70vw);
          height: min(450px, 60vh);
          right: -5%;
          bottom: -5%;
          background: radial-gradient(circle, rgba(201, 168, 76, 0.08) 0%, transparent 70%);
        }
        
        .ambient-c {
          width: min(450px, 60vw);
          height: min(350px, 50vh);
          left: 50%;
          top: 50%;
          background: radial-gradient(circle, rgba(0, 33, 71, 0.06) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          animation: breathe 12s ease-in-out infinite alternate;
        }
        
        /* Hero Content */
        .hero-inner {
          position: relative;
          z-index: 2;
          max-width: 900px;
          margin: 0 auto;
          padding: 80px 32px 120px;
          text-align: center;
          will-change: transform;
        }
        
        /* Tag */
        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          opacity: ${mounted ? 1 : 0};
          animation: ${mounted ? 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards' : 'none'};
        }
        
        .hero-tag-line {
          width: 40px;
          height: 1px;
          background: currentColor;
          opacity: 0.2;
        }
        
        .hero-tag-text {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'DM Sans', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          color: #7a7670;
          text-transform: uppercase;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .tag-badge {
          padding: 4px 12px;
          background: #002147;
          color: white;
          border-radius: 100px;
          font-size: 0.65rem;
          font-weight: 600;
        }
        
        /* Title */
        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 10vw, 7rem);
          font-weight: 300;
          line-height: 0.95;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
          color: #002147;
          opacity: ${mounted ? 1 : 0};
          animation: ${mounted ? 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards' : 'none'};
        }
        
        .hero-title em {
          font-style: italic;
          color: #7a7670;
          position: relative;
          display: inline-block;
        }
        
        .hero-title em::after {
          content: '';
          position: absolute;
          bottom: 10px;
          left: 0;
          width: 100%;
          height: 4px;
          background: rgba(201, 168, 76, 0.2);
          border-radius: 2px;
        }
        
        .hero-title-highlight {
          background: linear-gradient(135deg, #002147 0%, #c9a84c 80%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
        }
        
        /* Subtitle */
        .hero-subtitle {
          font-size: clamp(0.95rem, 2vw, 1.1rem);
          line-height: 1.7;
          color: #7a7670;
          max-width: 600px;
          margin: 0 auto 40px;
          padding: 0 16px;
          opacity: ${mounted ? 1 : 0};
          animation: ${mounted ? 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards' : 'none'};
        }
        
        /* Actions */
        .hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 32px;
          opacity: ${mounted ? 1 : 0};
          animation: ${mounted ? 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards' : 'none'};
        }
        
        .btn-hero {
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
          min-width: 200px;
        }
        
        .btn-icon {
          transition: transform 0.2s ease;
        }
        
        .btn-hero.primary {
          background: #002147;
          color: #ffffff;
          box-shadow: 0 8px 20px rgba(0, 33, 71, 0.2);
        }
        
        .btn-hero.primary:hover {
          background: #003366;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0, 33, 71, 0.3);
        }
        
        .btn-hero.primary:hover .btn-icon {
          transform: translateX(4px);
        }
        
        .btn-hero.secondary {
          background: transparent;
          border: 2px solid rgba(0, 33, 71, 0.15);
          color: #002147;
        }
        
        .btn-hero.secondary:hover {
          border-color: #002147;
          background: rgba(0, 33, 71, 0.02);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 33, 71, 0.1);
        }
        
        .btn-hero.secondary:hover .btn-icon {
          transform: rotate(90deg);
        }
        
        /* Badge Container */
        .hero-badge-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
          opacity: ${mounted ? 1 : 0};
          animation: ${mounted ? 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards' : 'none'};
        }
        
        .hero-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          color: #7a7670;
        }
        
        .badge-icon {
          font-size: 1rem;
        }
        
        .badge-separator {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #c9a84c;
          opacity: 0.3;
        }
        
        /* Stats Ribbon */
        .hero-stats {
          position: relative;
          z-index: 3;
          width: 100%;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          padding: 0 32px;
          opacity: ${mounted ? 1 : 0};
          animation: ${mounted ? 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards' : 'none'};
        }
        
        .stats-container {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px 20px;
          transition: all 0.3s ease;
          border-right: 1px solid rgba(0, 0, 0, 0.06);
          cursor: default;
        }
        
        .stat-card:last-child {
          border-right: none;
        }
        
        .stat-card:hover {
          background: rgba(0, 0, 0, 0.02);
        }
        
        .stat-icon {
          font-size: 2rem;
          opacity: 0.7;
          transition: transform 0.3s ease;
        }
        
        .stat-card:hover .stat-icon {
          transform: scale(1.1);
        }
        
        .stat-content {
          display: flex;
          flex-direction: column;
        }
        
        .stat-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 600;
          line-height: 1.2;
          color: #002147;
        }
        
        .stat-label {
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          color: #b8b3ab;
          text-transform: uppercase;
          font-weight: 500;
        }
        
        /* Animations */
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes breathe {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.4;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.8;
          }
        }

        /* ===== Responsive Design ===== */
        
        /* Desktop Large */
        @media (min-width: 1440px) {
          .hero-inner {
            padding: 100px 32px 140px;
          }
        }
        
        /* Tablet */
        @media (max-width: 1024px) {
          .stat-number {
            font-size: 1.5rem;
          }
          
          .stat-icon {
            font-size: 1.8rem;
          }
        }
        
        /* Mobile */
        @media (max-width: 768px) {
          .hero-inner {
            padding: 60px 24px 100px;
          }
          
          .hero-tag {
            gap: 12px;
          }
          
          .hero-tag-line {
            width: 24px;
          }
          
          .hero-tag-text {
            font-size: 0.7rem;
            gap: 8px;
          }
          
          .tag-badge {
            padding: 3px 10px;
            font-size: 0.6rem;
          }
          
          .hero-title {
            font-size: 3.2rem;
          }
          
          .hero-title em::after {
            bottom: 6px;
            height: 3px;
          }
          
          .hero-actions {
            flex-direction: column;
            gap: 12px;
          }
          
          .btn-hero {
            width: 100%;
            max-width: 300px;
            min-width: auto;
          }
          
          .hero-badge-container {
            flex-direction: column;
            gap: 12px;
          }
          
          .badge-separator {
            display: none;
          }
          
          .stats-container {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .stat-card {
            padding: 20px 16px;
            border-right: none;
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          }
          
          .stat-card:nth-child(even) {
            border-left: 1px solid rgba(0, 0, 0, 0.06);
          }
          
          .stat-card:nth-last-child(-n+2) {
            border-bottom: none;
          }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .hero-inner {
            padding: 40px 16px 80px;
          }
          
          .hero-tag {
            gap: 8px;
          }
          
          .hero-tag-line {
            width: 16px;
          }
          
          .hero-tag-text {
            font-size: 0.65rem;
            flex-direction: column;
            gap: 4px;
          }
          
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 0.9rem;
            padding: 0 8px;
          }
          
          .btn-hero {
            font-size: 0.85rem;
            padding: 14px 24px;
          }
          
          .stats-container {
            grid-template-columns: 1fr;
          }
          
          .stat-card {
            border-left: none !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          }
          
          .stat-card:last-child {
            border-bottom: none;
          }
          
          .stat-icon {
            font-size: 1.6rem;
          }
          
          .stat-number {
            font-size: 1.3rem;
          }
          
          .stat-label {
            font-size: 0.65rem;
          }
        }
        
        /* Handle very small heights */
        @media (max-height: 700px) {
          .hero-inner {
            padding: 40px 16px 80px;
          }
          
          .hero-stats {
            position: relative;
          }
        }
      `}</style>
    </section>
  );
}