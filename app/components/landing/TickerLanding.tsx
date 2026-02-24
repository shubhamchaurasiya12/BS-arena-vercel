// app/components/landing/TickerLanding.tsx
"use client";

import { useEffect, useRef } from "react";

export default function TickerLanding() {
  const tickerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let isScrolling: NodeJS.Timeout;
    const tickerWrap = tickerRef.current;

    const handleScroll = () => {
      const y = window.scrollY;
      const scrollDelta = y - lastScrollY;
      lastScrollY = y;

      // Calculate skew based on scroll speed (clamp between -5 and 5 degrees for smoother effect)
      const skew = Math.min(Math.max(scrollDelta * -0.04, -5), 5);

      if (tickerWrap) {
        tickerWrap.style.transform = `skewY(${skew}deg)`;
        tickerWrap.style.transition = `none`;

        // Reset skew when scrolling stops
        clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
          tickerWrap.style.transform = `skewY(0deg)`;
          tickerWrap.style.transition = `transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)`;
        }, 80);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tickerItems = [
    { 
      text: "Arjun_DS24 topped Statistics Week 4 Quiz · 98/100", 
      color: "#c9a84c",
      icon: "🏆",
      highlight: "Arjun_DS24"
    },
    { 
      text: "New Battle: Machine Learning Fundamentals · 142 competing", 
      color: "#002147",
      icon: "⚔️",
      highlight: "Machine Learning Fundamentals"
    },
    { 
      text: "Mock Test: Maths-II End Term Prep · Starting in 2 hrs", 
      color: "#c9a84c",
      icon: "📝",
      highlight: "Maths-II End Term Prep"
    },
    { 
      text: "Priya_IITM hit 30-day streak · Python & DSA", 
      color: "#002147",
      icon: "🔥",
      highlight: "Priya_IITM"
    },
    { 
      text: "Term 3: CodeNinja_22 holds #1 · 14,800 XP", 
      color: "#c9a84c",
      icon: "👑",
      highlight: "CodeNinja_22"
    },
    { 
      text: "Deck: Probability & Stats · 4.9★ · 2,100 saves", 
      color: "#002147",
      icon: "📚",
      highlight: "Probability & Stats"
    },
  ];

  // Duplicate items for seamless infinite scroll
  const duplicatedItems = [...tickerItems, ...tickerItems];

  // Helper function to highlight specific parts of text
  const renderTickerText = (text: string, highlight: string) => {
    const parts = text.split(highlight);
    return (
      <>
        {parts[0]}
        <span className="ticker-highlight">{highlight}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div 
      ref={tickerRef}
      className="ticker-skew-wrapper"
    >
      <div className="ticker-container">
        {/* Live Badge */}
        <div className="live-badge">
          <span className="live-dot" />
          <span className="live-text">LIVE FEED</span>
        </div>

        {/* Ticker Track */}
        <div className="ticker-track-wrapper">
          {/* Gradient overlays */}
          <div className="gradient-left" />
          <div className="gradient-right" />

          <div className="ticker-track">
            {duplicatedItems.map((item, i) => (
              <div key={i} className="ticker-item">
                <div className="item-icon" style={{ background: `${item.color}15` }}>
                  {item.icon}
                </div>
                <div className="item-content">
                  <span className="item-text">
                    {renderTickerText(item.text, item.highlight)}
                  </span>
                </div>
                <div className="item-dot" style={{ background: item.color }} />
              </div>
            ))}
          </div>
        </div>

        {/* Stats Badge */}
        <div className="stats-badge">
          <span className="stats-icon">⚡</span>
          <span className="stats-text">1,234 active now</span>
        </div>
      </div>

      <style jsx>{`
        .ticker-skew-wrapper {
          transform-origin: center;
          will-change: transform;
          width: 100%;
          position: relative;
          z-index: 5;
        }
        
        .ticker-container {
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          padding: 12px 0;
          background: #ffffff;
          position: relative;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
        }
        
        /* Live Badge */
        .live-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 24px;
          border-right: 1px solid rgba(0, 0, 0, 0.06);
          height: 100%;
          flex-shrink: 0;
          background: linear-gradient(90deg, #ffffff, transparent);
          z-index: 3;
        }
        
        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00C48C;
          animation: pulse 2s infinite;
        }
        
        .live-text {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: #002147;
          text-transform: uppercase;
        }
        
        /* Ticker Track Wrapper */
        .ticker-track-wrapper {
          flex: 1;
          overflow: hidden;
          position: relative;
          padding: 0 20px;
        }
        
        .gradient-left {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 60px;
          z-index: 2;
          pointer-events: none;
          background: linear-gradient(90deg, #ffffff, transparent);
        }
        
        .gradient-right {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 60px;
          z-index: 2;
          pointer-events: none;
          background: linear-gradient(-90deg, #ffffff, transparent);
        }
        
        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker 32s linear infinite;
          gap: 8px;
        }
        
        .ticker-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 20px;
          background: rgba(0, 0, 0, 0.02);
          border-radius: 100px;
          border: 1px solid rgba(0, 0, 0, 0.04);
          white-space: nowrap;
          transition: all 0.3s ease;
        }
        
        .ticker-item:hover {
          background: rgba(0, 33, 71, 0.04);
          border-color: rgba(0, 33, 71, 0.1);
          transform: translateY(-2px);
        }
        
        .item-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          flex-shrink: 0;
        }
        
        .item-content {
          font-family: 'DM Sans', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.02em;
          color: #7a7670;
        }
        
        .item-text {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        
        .ticker-highlight {
          color: #002147;
          font-weight: 600;
        }
        
        .item-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        /* Stats Badge */
        .stats-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 24px;
          border-left: 1px solid rgba(0, 0, 0, 0.06);
          height: 100%;
          flex-shrink: 0;
          background: linear-gradient(-90deg, #ffffff, transparent);
          z-index: 3;
        }
        
        .stats-icon {
          font-size: 0.9rem;
        }
        
        .stats-text {
          font-size: 0.65rem;
          font-weight: 600;
          color: #c9a84c;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }
        
        /* Animations */
        @keyframes ticker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(0, 196, 140, 0.4);
          }
          50% { 
            opacity: 0.6; 
            transform: scale(1.2);
            box-shadow: 0 0 0 4px rgba(0, 196, 140, 0);
          }
        }
        
        /* ===== Responsive Design ===== */
        
        /* Tablet */
        @media (max-width: 1024px) {
          .live-badge {
            padding: 0 16px;
          }
          
          .stats-badge {
            padding: 0 16px;
          }
          
          .gradient-left,
          .gradient-right {
            width: 40px;
          }
        }
        
        /* Mobile */
        @media (max-width: 768px) {
          .ticker-container {
            flex-direction: column;
            padding: 12px;
            gap: 12px;
          }
          
          .live-badge {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            padding: 0 0 8px 0;
            justify-content: center;
          }
          
          .ticker-track-wrapper {
            width: 100%;
            padding: 0;
          }
          
          .gradient-left,
          .gradient-right {
            width: 30px;
          }
          
          .ticker-item {
            padding: 6px 16px;
            gap: 8px;
          }
          
          .item-icon {
            width: 24px;
            height: 24px;
            font-size: 0.7rem;
          }
          
          .item-content {
            font-size: 0.65rem;
          }
          
          .stats-badge {
            width: 100%;
            border-left: none;
            border-top: 1px solid rgba(0, 0, 0, 0.06);
            padding: 8px 0 0 0;
            justify-content: center;
          }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .ticker-container {
            padding: 10px;
          }
          
          .live-text {
            font-size: 0.6rem;
          }
          
          .ticker-item {
            padding: 5px 12px;
          }
          
          .item-icon {
            width: 20px;
            height: 20px;
            font-size: 0.6rem;
          }
          
          .item-content {
            font-size: 0.6rem;
          }
          
          .stats-text {
            font-size: 0.6rem;
          }
          
          .gradient-left,
          .gradient-right {
            width: 20px;
          }
        }
        
        /* Pause animation on hover for better UX */
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}