// D:\BS-arena-NextJS\app\components\landing\LeaderboardLanding.tsx
"use client";

import { useEffect, useRef } from "react";
import Link from 'next/link';


export default function LeaderboardLanding() {
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

  const leaderboardData = [
    {
      rank: "01",
      rankClass: "gold",
      avatar: "👑",
      avatarBg: "rgba(255,138,0,.15)",
      name: "CodeNinja_22",
      subjects: "DS · Python, Statistics, Maths-II",
      score: "14,800",
      scoreColor: "#c9a84c",
      barWidth: "100%",
      barColor: "#c9a84c",
      trend: "+2",
      trendUp: true
    },
    {
      rank: "02",
      rankClass: "silver",
      avatar: "🌙",
      avatarBg: "rgba(0,15,30,.06)",
      name: "Priya_IITM",
      subjects: "DS · ML, DSA, Statistics",
      score: "13,240",
      scoreColor: "#8B96A8",
      barWidth: "89%",
      barColor: "#8B96A8",
      trend: "0",
      trendUp: false
    },
    {
      rank: "03",
      rankClass: "bronze",
      avatar: "🔮",
      avatarBg: "rgba(217,119,6,.12)",
      name: "Arjun_DS24",
      subjects: "DS · Statistics, Maths-II",
      score: "11,980",
      scoreColor: "#D97706",
      barWidth: "81%",
      barColor: "#D97706",
      trend: "-1",
      trendUp: false
    },
    {
      rank: "04",
      rankClass: "",
      avatar: "⚡",
      avatarBg: "rgba(123,50,255,.12)",
      name: "DataDriven_Raj",
      subjects: "DS · Python, CT, Maths-I",
      score: "10,650",
      scoreColor: "#7a7670",
      barWidth: "72%",
      barColor: "#002147",
      trend: "+3",
      trendUp: true
    },
    {
      rank: "05",
      rankClass: "",
      avatar: "🧮",
      avatarBg: "rgba(0,210,106,.12)",
      name: "AlgoQueen_Meera",
      subjects: "DS · DSA, Python, Statistics",
      score: "9,870",
      scoreColor: "#7a7670",
      barWidth: "67%",
      barColor: "#c9a84c",
      trend: "+1",
      trendUp: true
    },
  ];

  const getTrendIcon = (trend: string, isUp: boolean) => {
    if (trend === "0") return "→";
    return isUp ? "↑" : "↓";
  };

  return (
    <section 
      id="leaderboard" 
      ref={sectionRef}
      className="leaderboard-section"
    >
      <div className="leaderboard-container">
        {/* Header */}
        <div className="leaderboard-header r">
          <div className="header-left">
            <div className="header-badge">
              <span className="badge-dot" />
              <span className="section-eyebrow">// Cohort Rankings</span>
            </div>
            <h2 className="section-heading">
              The board<br />
              <em>never lies.</em>
            </h2>
          </div>
          <div className="header-right">
            <div className="live-indicator">
              <span className="live-dot" />
              <span className="live-text">Term 3 · Week 8</span>
            </div>
            <div className="update-badge">Live</div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="leaderboard-table r">
          {/* Table Header */}
          <div className="table-header">
            <div className="col-rank">Rank</div>
            <div className="col-player">Player</div>
            <div className="col-subjects">Subjects</div>
            <div className="col-score">Score</div>
            <div className="col-trend">Trend</div>
            <div className="col-progress">Progress</div>
          </div>

          {/* Table Body */}
          {leaderboardData.map((item, index) => (
            <div
              key={index}
              className="leaderboard-row"
            >
              {/* Rank */}
              <div className="col-rank">
                <span className={`rank-number ${item.rankClass}`}>
                  {item.rank}
                </span>
              </div>

              {/* Player Info */}
              <div className="col-player">
                <div 
                  className="player-avatar"
                  style={{ background: item.avatarBg }}
                >
                  {item.avatar}
                </div>
                <span className="player-name">{item.name}</span>
              </div>

              {/* Subjects */}
              <div className="col-subjects">
                <span className="subjects-text">{item.subjects}</span>
              </div>

              {/* Score */}
              <div className="col-score">
                <span className="score-value" style={{ color: item.scoreColor }}>
                  {item.score}
                </span>
                <span className="score-label">XP</span>
              </div>

              {/* Trend */}
              <div className="col-trend">
                <span className={`trend-indicator ${item.trendUp ? 'trend-up' : 'trend-down'}`}>
                  {getTrendIcon(item.trend, item.trendUp)}
                </span>
                <span className="trend-value">{item.trend}</span>
              </div>

              {/* Progress Bar */}
              <div className="col-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: item.barWidth,
                      background: item.barColor 
                    }}
                  />
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="row-glow" />
            </div>
          ))}
        </div>

        {/* View Full Leaderboard CTA */}
        <div className="leaderboard-footer r">
          <Link href="/login">
            <button className="view-all-btn">
              <span>View Full Leaderboard</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4.16666 10H15.8333M15.8333 10L11.6667 5.83333M15.8333 10L11.6667 14.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </Link>
          <p className="footer-note">Updated in real-time · Top 5 shown</p>
        </div>
      </div>

      <style jsx>{`
        .leaderboard-section {
          padding: 100px 0;
          background: #fafafa;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }
        
        .leaderboard-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
        }
        
        /* ===== Header Styles ===== */
        .leaderboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 48px;
          flex-wrap: wrap;
          gap: 24px;
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
          background: #002147;
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
          font-size: clamp(2.5rem, 5vw, 3.8rem);
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
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .live-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(0, 33, 71, 0.04);
          border-radius: 100px;
          border: 1px solid rgba(0, 33, 71, 0.1);
        }
        
        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00C48C;
          animation: pulse 2s infinite;
        }
        
        .live-text {
          font-size: 0.75rem;
          font-weight: 600;
          color: #002147;
          letter-spacing: 0.05em;
        }
        
        .update-badge {
          padding: 8px 16px;
          background: #002147;
          color: white;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        
        /* ===== Table Styles ===== */
        .leaderboard-table {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          margin-bottom: 32px;
        }
        
        .table-header {
          display: grid;
          grid-template-columns: 80px 200px 1fr 120px 100px 120px;
          gap: 16px;
          padding: 16px 24px;
          background: rgba(0, 0, 0, 0.02);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #b8b3ab;
        }
        
        .leaderboard-row {
          display: grid;
          grid-template-columns: 80px 200px 1fr 120px 100px 120px;
          gap: 16px;
          padding: 16px 24px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          position: relative;
          cursor: default;
        }
        
        .leaderboard-row:last-child {
          border-bottom: none;
        }
        
        .leaderboard-row:hover {
          background: rgba(0, 0, 0, 0.02);
          transform: translateX(4px);
        }
        
        .row-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #002147, #c9a84c);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .leaderboard-row:hover .row-glow {
          opacity: 0.2;
        }
        
        /* Column Styles */
        .col-rank {
          display: flex;
          align-items: center;
        }
        
        .rank-number {
          font-family: 'DM Sans', monospace;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        
        .rank-number.gold {
          color: #c9a84c;
        }
        
        .rank-number.silver {
          color: #8B96A8;
        }
        
        .rank-number.bronze {
          color: #D97706;
        }
        
        .col-player {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .player-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }
        
        .leaderboard-row:hover .player-avatar {
          transform: scale(1.1);
        }
        
        .player-name {
          font-weight: 600;
          color: #002147;
        }
        
        .col-subjects {
          display: flex;
          align-items: center;
        }
        
        .subjects-text {
          font-size: 0.8rem;
          color: #7a7670;
          font-family: 'DM Sans', monospace;
          letter-spacing: 0.02em;
        }
        
        .col-score {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        
        .score-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 600;
        }
        
        .score-label {
          font-size: 0.6rem;
          color: #b8b3ab;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .col-trend {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .trend-indicator {
          font-size: 0.9rem;
        }
        
        .trend-up {
          color: #00C48C;
        }
        
        .trend-down {
          color: #FF6B6B;
        }
        
        .trend-value {
          font-size: 0.8rem;
          font-weight: 600;
          color: #7a7670;
        }
        
        .col-progress {
          display: flex;
          align-items: center;
        }
        
        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(0, 0, 0, 0.06);
          border-radius: 3px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 1s ease;
        }
        
        /* ===== Footer ===== */
        .leaderboard-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .view-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: transparent;
          border: 2px solid rgba(0, 33, 71, 0.15);
          border-radius: 100px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #002147;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .view-all-btn:hover {
          background: #002147;
          color: white;
          border-color: #002147;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 33, 71, 0.2);
        }
        
        .view-all-btn:hover svg {
          transform: translateX(4px);
        }
        
        .view-all-btn svg {
          transition: transform 0.3s ease;
        }
        
        .footer-note {
          font-size: 0.8rem;
          color: #b8b3ab;
        }
        
        /* Animations */
        @keyframes pulse {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        /* ===== Responsive Design ===== */
        
        /* Desktop Large */
        @media (min-width: 1440px) {
          .leaderboard-container {
            padding: 0 32px;
          }
        }
        
        /* Tablet */
        @media (max-width: 1024px) {
          .table-header {
            grid-template-columns: 60px 180px 1fr 100px 80px 100px;
            font-size: 0.65rem;
          }
          
          .leaderboard-row {
            grid-template-columns: 60px 180px 1fr 100px 80px 100px;
            padding: 14px 20px;
          }
          
          .player-name {
            font-size: 0.9rem;
          }
          
          .subjects-text {
            font-size: 0.7rem;
          }
        }
        
        /* Mobile */
        @media (max-width: 768px) {
          .leaderboard-section {
            padding: 60px 0;
          }
          
          .leaderboard-container {
            padding: 0 20px;
          }
          
          .table-header {
            display: none;
          }
          
          .leaderboard-row {
            grid-template-columns: 50px 1fr auto;
            grid-template-rows: auto auto;
            gap: 12px;
            padding: 16px;
          }
          
          /* Mobile Card Layout */
          .col-rank {
            grid-row: 1;
            grid-column: 1;
          }
          
          .col-player {
            grid-row: 1;
            grid-column: 2;
          }
          
          .col-score {
            grid-row: 1;
            grid-column: 3;
            justify-content: flex-end;
          }
          
          .col-subjects {
            grid-row: 2;
            grid-column: 1 / span 2;
          }
          
          .col-trend {
            grid-row: 2;
            grid-column: 3;
            justify-content: flex-end;
          }
          
          .col-progress {
            display: none;
          }
          
          .row-glow {
            width: 2px;
          }
          
          .player-avatar {
            width: 36px;
            height: 36px;
            font-size: 1rem;
          }
          
          .player-name {
            font-size: 0.85rem;
          }
          
          .subjects-text {
            font-size: 0.65rem;
          }
          
          .score-value {
            font-size: 1rem;
          }
          
          .view-all-btn {
            width: 100%;
            justify-content: center;
          }
          
          .footer-note {
            text-align: center;
            width: 100%;
          }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .leaderboard-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .header-right {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
          }
          
          .live-indicator {
            width: 100%;
            justify-content: center;
          }
          
          .update-badge {
            width: 100%;
            text-align: center;
          }
          
          .leaderboard-row {
            grid-template-columns: 40px 1fr auto;
            padding: 14px;
          }
          
          .col-subjects {
            grid-column: 1 / span 3;
          }
          
          .col-trend {
            grid-row: 3;
            grid-column: 3;
          }
          
          .player-avatar {
            width: 32px;
            height: 32px;
            font-size: 0.9rem;
          }
          
          .player-name {
            font-size: 0.8rem;
          }
          
          .rank-number {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </section>
  );
}