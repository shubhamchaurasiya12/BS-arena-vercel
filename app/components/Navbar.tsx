// D:\BS-arena-NextJS\app\components\Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HoverTab from "./HoverTab";

const hoverItems = [
  {
    name: "Products",
    content: (
      <div className="products-grid">
        <div className="product-section">
          <div className="section-label">Core</div>
          <div className="section-items">
            {[
              { name: "AI Notes", icon: "🤖", desc: "Smart study companion", color: "#002147" },
              { name: "Weekly Quizzes", icon: "📊", desc: "Test your knowledge", color: "#002147" },
              { name: "Leaderboard", icon: "🏆", desc: "Compete globally", color: "#002147" }
            ].map((item) => (
              <div key={item.name} className="product-item">
                <div className="item-icon" style={{ background: `${item.color}10` }}>{item.icon}</div>
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-desc">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="product-section">
          <div className="section-label">Tools</div>
          <div className="section-items">
            {[
              { name: "Pomodoro", icon: "⏰", desc: "Focus timer", color: "#c9a84c" },
              { name: "Todo App", icon: "✅", desc: "Task management", color: "#c9a84c" },
              { name: "Grade Calculator", icon: "📈", desc: "Track progress", color: "#c9a84c" },
              { name: "Grade Predictor", icon: "🔮", desc: "Forecast results", color: "#c9a84c" }
            ].map((item) => (
              <div key={item.name} className="product-item">
                <div className="item-icon" style={{ background: `${item.color}10` }}>{item.icon}</div>
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-desc">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="product-cta">
          <div className="cta-content">
            <span className="cta-icon">✨</span>
            <div>
              <div className="cta-title">New: AI Study Assistant</div>
              <div className="cta-desc">Get personalized recommendations</div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    name: "Developers",
    content: (
      <div className="developers-grid">
        <div className="positions-section">
          <div className="section-label">Open Positions</div>
          <div className="positions-list">
            {[
              { role: "Backend Developer", level: "Senior", color: "#002147", icon: "⚙️", url: "https://github.com/username" },
              { role: "Frontend Developer", level: "Mid-level", color: "#c9a84c", icon: "🎨", url: "https://github.com/username" } 
            ].map(({ role, level, color, icon, url }) => (
              <a 
                key={role} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="position-item"
              >
                <div className="position-icon" style={{ background: `${color}10` }}>{icon}</div>
                <div className="position-info">
                  <div className="position-title">
                    <span className="position-role">{role}</span>
                    <span className="position-level" style={{ background: `${color}15`, color }}>{level}</span>
                  </div>
                  <div className="position-meta">Full-time · Remote</div>
                </div>
                <span className="position-apply" style={{ color }}>
                  View Profile →
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="dev-stats">
          <div className="stat-item">
            <span className="stat-number">2</span>
            <span className="stat-label">Team Members</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">0</span>
            <span className="stat-label">Open Roles</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">🌍</span>
            <span className="stat-label">Remote First</span>
          </div>
        </div>
      </div>
    )
  },
  {
    name: "Resources",
    content: (
      <div className="resources-grid">
        <div className="resources-main">
          {[
            { icon: "📚", title: "Documentation", desc: "Guides and API references", color: "#002147", tag: "New" },
            { icon: "🎓", title: "Tutorials", desc: "Step-by-step learning paths", color: "#c9a84c", tag: "Popular" },
            { icon: "💬", title: "Community", desc: "Join 3,200+ students", color: "#002147", tag: "Active" },
            { icon: "🚀", title: "Changelog", desc: "Latest features and updates", color: "#c9a84c", tag: "v2.0" }
          ].map(({ icon, title, desc, color, tag }) => (
            <div key={title} className="resource-item">
              <div className="resource-icon" style={{ background: `${color}10` }}>{icon}</div>
              <div className="resource-info">
                <div className="resource-header">
                  <span className="resource-title">{title}</span>
                  <span className="resource-tag" style={{ background: `${color}15`, color }}>{tag}</span>
                </div>
                <span className="resource-desc">{desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="resource-featured">
          <div className="featured-icon">🎯</div>
          <div className="featured-content">
            <div className="featured-title">Quick Start Guide</div>
            <div className="featured-desc">Get up and running in 5 minutes</div>
            <button className="featured-button">Read more →</button>
          </div>
        </div>
      </div>
    )
  }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleJoinArena = () => {
    router.push('/login');
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <a href="/" className="logo">
          <div className="logo-icon">
            <div className="logo-gem" />
            <div className="logo-gem-shadow" />
          </div>
          <span className="logo-text">BS Arena</span>
        </a>

        {/* Desktop Navigation */}
        <div className="desktop-nav">
          <div className="nav-links">
            <HoverTab 
              items={hoverItems} 
              onActiveChange={setActiveDropdown}
            />
          </div>
          
          <div className="nav-actions">
            <button 
              className="nav-button-primary"
              onClick={handleJoinArena}
            >
              <span>Join Arena</span>
              <svg className="button-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4.16666 10H15.8333M15.8333 10L11.6667 5.83333M15.8333 10L11.6667 14.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className={`mobile-menu-button ${open ? 'active' : ''}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <div className="hamburger">
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <div className="mobile-logo">
              <div className="logo-gem" />
              <span>BS Arena</span>
            </div>
            <button className="mobile-close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div className="mobile-menu-content">
            {/* Mobile nav sections */}
            {hoverItems.map((section) => (
              <div key={section.name} className="mobile-section">
                <div className="mobile-section-title">{section.name}</div>
                <div className="mobile-section-content">
                  {section.name === "Developers" ? (
                    <div className="developers-grid">
                      <div className="positions-section">
                        <div className="positions-list">
                          {[
                            { role: "Backend Developer", level: "Freshers", color: "#002147", icon: "⚙️", url: "https://github.com/username" },
                            { role: "Frontend Developer", level: "Freshers", color: "#c9a84c", icon: "🎨", url: "https://github.com/username" }
                          ].map(({ role, level, color, icon, url }) => (
                            <a 
                              key={role} 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="position-item"
                              onClick={() => setOpen(false)}
                            >
                              <div className="position-icon" style={{ background: `${color}10` }}>{icon}</div>
                              <div className="position-info">
                                <div className="position-title">
                                  <span className="position-role">{role}</span>
                                  <span className="position-level" style={{ background: `${color}15`, color }}>{level}</span>
                                </div>
                                <div className="position-meta">Full-time · Remote</div>
                              </div>
                              <span className="position-apply" style={{ color }}>
                                View Profile →
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    section.content
                  )}
                </div>
              </div>
            ))}
            
            {/* Mobile footer */}
            <div className="mobile-footer">
              <button 
                className="mobile-button-primary"
                onClick={() => {
                  handleJoinArena();
                  setOpen(false);
                }}
              >
                Join Arena
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 20px 32px;
        }
        
        .navbar.scrolled {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
          padding: 12px 32px;
        }
        
        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        /* ===== Logo Styles ===== */
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          position: relative;
        }
        
        .logo-icon {
          position: relative;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .logo-gem {
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #c9a84c, #b38f3a);
          transform: rotate(45deg);
          border-radius: 2px;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 2px 8px rgba(201, 168, 76, 0.3);
        }
        
        .logo:hover .logo-gem {
          transform: rotate(135deg) scale(1.2);
        }
        
        .logo-gem-shadow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          background: radial-gradient(circle, rgba(201, 168, 76, 0.4) 0%, transparent 70%);
          filter: blur(6px);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        
        .logo:hover .logo-gem-shadow {
          opacity: 1;
        }
        
        .logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #002147;
          letter-spacing: -0.02em;
        }
        
        /* ===== Desktop Navigation ===== */
        .desktop-nav {
          display: none;
          align-items: center;
          gap: 32px;
        }
        
        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex;
          }
        }
        
        .nav-links {
          display: flex;
          align-items: center;
        }
        
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .nav-button-secondary {
          padding: 10px 20px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #7a7670;
          background: transparent;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .nav-button-secondary:hover {
          border-color: #002147;
          color: #002147;
          background: rgba(0, 33, 71, 0.02);
        }
        
        .nav-button-primary {
          position: relative;
          padding: 10px 24px;
          background: linear-gradient(135deg, #002147, #003366);
          color: white;
          border: none;
          border-radius: 100px;
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 12px rgba(0, 33, 71, 0.2);
        }
        
        .nav-button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 33, 71, 0.3);
        }
        
        .button-arrow {
          transition: transform 0.3s ease;
        }
        
        .nav-button-primary:hover .button-arrow {
          transform: translateX(4px);
        }
        
        /* ===== Mobile Menu Button ===== */
        .mobile-menu-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        @media (min-width: 1024px) {
          .mobile-menu-button {
            display: none;
          }
        }
        
        .mobile-menu-button:hover {
          border-color: #002147;
        }
        
        .mobile-menu-button.active {
          background: #002147;
          border-color: #002147;
        }
        
        .mobile-menu-button.active .hamburger-line {
          background: white;
        }
        
        .hamburger {
          width: 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .hamburger-line {
          display: block;
          height: 2px;
          background: #002147;
          border-radius: 1px;
          transition: all 0.3s ease;
        }
        
        .mobile-menu-button.active .hamburger-line:nth-child(1) {
          transform: rotate(45deg) translate(4px, 4px);
        }
        
        .mobile-menu-button.active .hamburger-line:nth-child(2) {
          opacity: 0;
          transform: scale(0);
        }
        
        .mobile-menu-button.active .hamburger-line:nth-child(3) {
          transform: rotate(-45deg) translate(4px, -4px);
        }
        
        /* ===== Mobile Menu ===== */
        .mobile-menu {
          position: fixed;
          top: 80px;
          left: 16px;
          right: 16px;
          bottom: 16px;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .mobile-menu-header {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .mobile-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-weight: 600;
          color: #002147;
        }
        
        .mobile-logo .logo-gem {
          width: 10px;
          height: 10px;
          background: #c9a84c;
          transform: rotate(45deg);
        }
        
        .mobile-close {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, 0.06);
          background: white;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .mobile-close:hover {
          background: #f5f5f5;
        }
        
        .mobile-menu-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }
        
        .mobile-section {
          margin-bottom: 32px;
        }
        
        .mobile-section-title {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #b8b3ab;
          margin-bottom: 16px;
        }
        
        .mobile-footer {
          padding-top: 24px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .mobile-button-secondary {
          width: 100%;
          padding: 16px;
          font-size: 1rem;
          font-weight: 500;
          color: #7a7670;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .mobile-button-secondary:hover {
          border-color: #002147;
          color: #002147;
        }
        
        .mobile-button-primary {
          width: 100%;
          padding: 16px;
          font-size: 1rem;
          font-weight: 600;
          background: linear-gradient(135deg, #002147, #003366);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .mobile-button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 33, 71, 0.2);
        }
        
        /* ===== Dropdown Content Styles ===== */
        :global(.products-grid) {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          min-width: 520px;
          padding: 16px 0;
        }
        
        :global(.product-section) {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        :global(.section-label) {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #b8b3ab;
          padding-left: 12px;
        }
        
        :global(.section-items) {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        :global(.product-item) {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        :global(.product-item:hover) {
          background: #fafafa;
          transform: translateX(4px);
        }
        
        :global(.item-icon) {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }
        
        :global(.item-info) {
          display: flex;
          flex-direction: column;
        }
        
        :global(.item-name) {
          font-weight: 600;
          color: #002147;
          font-size: 0.9rem;
        }
        
        :global(.item-desc) {
          font-size: 0.75rem;
          color: #7a7670;
        }
        
        :global(.product-cta) {
          grid-column: span 2;
          margin-top: 8px;
          padding: 16px;
          background: linear-gradient(135deg, #fafafa, #f5f5f5);
          border-radius: 16px;
          border: 1px solid rgba(201, 168, 76, 0.2);
        }
        
        :global(.cta-content) {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        :global(.cta-icon) {
          font-size: 1.5rem;
        }
        
        :global(.cta-title) {
          font-weight: 600;
          color: #002147;
          font-size: 0.9rem;
        }
        
        :global(.cta-desc) {
          font-size: 0.75rem;
          color: #7a7670;
        }
        
        /* Developers dropdown */
        :global(.developers-grid) {
          min-width: 440px;
          padding: 16px 0;
        }
        
        :global(.positions-section) {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        :global(.positions-list) {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        :global(.position-item) {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px;
          border-radius: 12px;
          transition: all 0.3s ease;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }
        
        :global(.position-item:hover) {
          background: #fafafa;
        }
        
        :global(.position-icon) {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        
        :global(.position-info) {
          flex: 1;
        }
        
        :global(.position-title) {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        
        :global(.position-role) {
          font-weight: 600;
          color: #002147;
          font-size: 0.9rem;
        }
        
        :global(.position-level) {
          font-size: 0.6rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 100px;
        }
        
        :global(.position-meta) {
          font-size: 0.7rem;
          color: #b8b3ab;
        }
        
        :global(.position-apply) {
          font-size: 0.8rem;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.3s ease;
          white-space: nowrap;
        }
        
        :global(.position-item:hover .position-apply) {
          opacity: 1;
        }
        
        :global(.dev-stats) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
          padding: 16px;
          background: #fafafa;
          border-radius: 16px;
        }
        
        :global(.stat-item) {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        :global(.stat-number) {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 600;
          color: #002147;
        }
        
        :global(.stat-label) {
          font-size: 0.65rem;
          color: #7a7670;
        }
        
        :global(.stat-divider) {
          width: 1px;
          height: 30px;
          background: rgba(0, 0, 0, 0.1);
        }
        
        /* Resources dropdown */
        :global(.resources-grid) {
          min-width: 380px;
          padding: 16px 0;
        }
        
        :global(.resources-main) {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        :global(.resource-item) {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px;
          border-radius: 12px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        :global(.resource-item:hover) {
          background: #fafafa;
          transform: translateX(4px);
        }
        
        :global(.resource-icon) {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        
        :global(.resource-info) {
          flex: 1;
        }
        
        :global(.resource-header) {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        
        :global(.resource-title) {
          font-weight: 600;
          color: #002147;
          font-size: 0.9rem;
        }
        
        :global(.resource-tag) {
          font-size: 0.55rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 100px;
        }
        
        :global(.resource-desc) {
          font-size: 0.7rem;
          color: #7a7670;
        }
        
        :global(.resource-featured) {
          margin-top: 20px;
          padding: 16px;
          background: linear-gradient(135deg, #fafafa, #f5f5f5);
          border-radius: 16px;
          border: 1px solid rgba(0, 33, 71, 0.1);
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        :global(.featured-icon) {
          font-size: 2rem;
        }
        
        :global(.featured-title) {
          font-weight: 600;
          color: #002147;
          font-size: 0.9rem;
          margin-bottom: 2px;
        }
        
        :global(.featured-desc) {
          font-size: 0.7rem;
          color: #7a7670;
          margin-bottom: 8px;
        }
        
        :global(.featured-button) {
          font-size: 0.75rem;
          font-weight: 600;
          color: #002147;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
        }
        
        :global(.featured-button:hover) {
          text-decoration: underline;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .navbar {
            padding: 16px 20px;
          }
          
          .navbar.scrolled {
            padding: 10px 20px;
          }
          
          .logo-text {
            font-size: 1.3rem;
          }
          
          :global(.products-grid) {
            min-width: 100%;
            grid-template-columns: 1fr;
          }
          
          :global(.product-cta) {
            grid-column: span 1;
          }
          
          :global(.developers-grid),
          :global(.resources-grid) {
            min-width: 100%;
          }
        }
        
        @media (max-width: 480px) {
          .navbar {
            padding: 12px 16px;
          }
          
          .logo-gem {
            width: 10px;
            height: 10px;
          }
          
          .logo-text {
            font-size: 1.2rem;
          }
          
          .mobile-menu {
            top: 72px;
            left: 12px;
            right: 12px;
            bottom: 12px;
          }
          
          .mobile-menu-header {
            padding: 16px 20px;
          }
          
          .mobile-menu-content {
            padding: 20px;
          }
        }
      `}</style>
    </nav>
  );
}