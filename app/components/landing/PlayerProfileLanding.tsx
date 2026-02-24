// app/components/landing/PlayerProfileLanding.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function PlayerProfileLanding() {
  const [visible, setVisible] = useState<boolean[]>([false, false]);
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

  const perks = [
    { text: "XP earned for every quiz, test and flashcard session", color: "navy", icon: "⚡" },
    { text: "Subject-wise accuracy tracking across all courses", color: "gold", icon: "📊" },
    { text: "Daily streaks that compound your weekly XP", color: "navy", icon: "🔥" },
    { text: "Battle history — wins, losses, close calls", color: "gold", icon: "⚔️" },
    { text: "Term-over-term progress visible at a glance", color: "navy", icon: "📈" },
  ];

  const badges = [
    { name: "Python Pro", active: true },
    { name: "Stats Ace", active: true },
    { name: "30-Day Streak", active: true },
    { name: "Mock Test Beast", active: true },
    { name: "Maths-II", active: false },
    { name: "DSA Master", active: false },
  ];

  const recentActivities = [
    { type: "battle", subject: "Statistics Q4", xp: "+320", time: "2 min ago" },
    { type: "quiz", subject: "Python Functions", xp: "+150", time: "1 hour ago" },
    { type: "streak", subject: "Day 34", xp: "+100", time: "5 hours ago" },
  ];

  return (
    <section id="player" className="player-section">
      <div className="player-container">
        {/* Left Side - Content */}
        <div
          ref={(el) => {
            if (el && refs.current[0] !== el) refs.current[0] = el;
          }}
          className="player-content fade-in-left"
          style={{
            opacity: visible[0] ? 1 : 0,
            transform: visible[0] ? "none" : "translateX(-40px) scale(0.96)",
            filter: visible[0] ? "blur(0)" : "blur(4px)",
            transition: "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="content-badge">
            <span className="badge-dot" style={{ background: "#002147" }} />
            <span className="section-eyebrow">// Your Profile</span>
          </div>

          <h2 className="section-heading">
            Your grind,<br/><em>made visible.</em>
          </h2>

          <p className="section-description">
            Every hour you put in shows up on your profile. Your rank, your streak, your subject-wise accuracy — a real-time record of your IITM BS journey.
          </p>

          {/* Stats Preview */}
          <div className="stats-preview">
            <div className="stat-preview-item">
              <span className="stat-preview-value">14.8K</span>
              <span className="stat-preview-label">Total XP</span>
            </div>
            <div className="stat-preview-divider" />
            <div className="stat-preview-item">
              <span className="stat-preview-value">#1</span>
              <span className="stat-preview-label">Cohort Rank</span>
            </div>
            <div className="stat-preview-divider" />
            <div className="stat-preview-item">
              <span className="stat-preview-value">34d</span>
              <span className="stat-preview-label">Current Streak</span>
            </div>
          </div>

          {/* Perks List */}
          <ul className="perks-list">
            {perks.map((perk, i) => (
              <li key={i} className="perk-item">
                <span className="perk-icon">{perk.icon}</span>
                <span className="perk-text">{perk.text}</span>
                <div 
                  className="perk-dot"
                  style={{ 
                    background: perk.color === "navy" ? "#002147" : "#c9a84c"
                  }}
                />
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <Link href="/login">
            <button className="view-profile-btn">
              <span>View Your Profile</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4.16666 10H15.8333M15.8333 10L11.6667 5.83333M15.8333 10L11.6667 14.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </Link>
        </div>

        {/* Right Side - Profile Card */}
        <div
          ref={(el) => {
            if (el && refs.current[1] !== el) refs.current[1] = el;
          }}
          className="player-card-wrapper fade-in-right"
          style={{
            opacity: visible[1] ? 1 : 0,
            transform: visible[1] ? "none" : "translateX(40px) scale(0.96)",
            filter: visible[1] ? "blur(0)" : "blur(4px)",
            transition: "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Main Profile Card */}
          <div className="profile-card">
            {/* Card Header */}
            <div className="profile-card-header">
              <div className="profile-card-title">
                <span className="title-icon">👤</span>
                Scholar Profile · Term 3
              </div>
              <div className="profile-card-live">
                <div className="live-dot" />
                <span>Live</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="profile-card-body">
              {/* Profile Top */}
              <div className="profile-top">
                <div className="profile-avatar">
                  <div className="avatar-glow" />
                  <span className="avatar-emoji">🧑‍💻</span>
                </div>
                <div className="profile-info">
                  <div className="profile-name">CodeNinja_22</div>
                  <div className="profile-meta">
                    <span className="meta-tag">IITM BS</span>
                    <span className="meta-dot">•</span>
                    <span>Data Science</span>
                    <span className="meta-dot">•</span>
                    <span>Level 38</span>
                  </div>
                </div>
              </div>

              {/* XP Block */}
              <div className="xp-block">
                <div className="xp-header">
                  <span className="xp-label">Term XP Progress</span>
                  <span className="xp-values">14,800 / 18,000</span>
                </div>
                <div className="xp-bar-container">
                  <div 
                    className="xp-bar-fill"
                    style={{ 
                      width: visible[1] ? "82%" : "0%",
                    }}
                  />
                  <div className="xp-bar-marker" style={{ left: "82%" }} />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-cell">
                  <div className="stat-value" style={{ color: "#c9a84c" }}>#1</div>
                  <div className="stat-label">Cohort Rank</div>
                  <div className="stat-trend positive">↑2</div>
                </div>
                <div className="stat-cell">
                  <div className="stat-value" style={{ color: "#002147" }}>34d</div>
                  <div className="stat-label">Current Streak</div>
                  <div className="stat-trend positive">+3</div>
                </div>
                <div className="stat-cell">
                  <div className="stat-value" style={{ color: "#002147" }}>91%</div>
                  <div className="stat-label">Accuracy</div>
                  <div className="stat-trend positive">+5%</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="recent-activity">
                <div className="activity-header">
                  <span className="activity-title">Recent Activity</span>
                  <span className="activity-view">View all →</span>
                </div>
                <div className="activity-list">
                  {recentActivities.map((activity, i) => (
                    <div key={i} className="activity-item">
                      <span className="activity-icon">
                        {activity.type === 'battle' ? '⚔️' : activity.type === 'quiz' ? '📝' : '🔥'}
                      </span>
                      <div className="activity-details">
                        <span className="activity-name">{activity.subject}</span>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                      <span className="activity-xp" style={{ color: "#c9a84c" }}>
                        {activity.xp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badge Row */}
              <div className="badge-section">
                <div className="badge-header">
                  <span className="badge-title">Earned Badges</span>
                  <span className="badge-count">4/6</span>
                </div>
                <div className="badge-row">
                  {badges.map((badge, i) => (
                    <span 
                      key={i} 
                      className={`badge ${badge.active ? 'active' : 'inactive'}`}
                      title={badge.active ? badge.name : 'Locked'}
                    >
                      {badge.active ? badge.name : '🔒'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Achievement Card */}
          <div className="achievement-badge">
            <div className="achievement-icon">⚔️</div>
            <div className="achievement-content">
              <div className="achievement-label">Battle Won</div>
              <div className="achievement-title">Statistics Q4 · +320 XP</div>
              <div className="achievement-time">Just now</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .player-section {
          padding: 120px 0;
          background: #fafafa;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          position: relative;
          overflow: hidden;
        }
        
        .player-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        
        /* ===== Left Content Styles ===== */
        .content-badge {
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
        
        .section-description {
          font-size: 1rem;
          line-height: 1.7;
          color: #7a7670;
          margin: 0 0 32px 0;
          max-width: 500px;
        }
        
        /* Stats Preview */
        .stats-preview {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 20px 24px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 100px;
          margin-bottom: 40px;
        }
        
        .stat-preview-item {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        
        .stat-preview-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 600;
          color: #002147;
        }
        
        .stat-preview-label {
          font-size: 0.7rem;
          color: #7a7670;
          letter-spacing: 0.02em;
        }
        
        .stat-preview-divider {
          width: 1px;
          height: 24px;
          background: rgba(0, 0, 0, 0.1);
        }
        
        /* Perks List */
        .perks-list {
          list-style: none;
          margin: 0 0 40px 0;
          padding: 0;
        }
        
        .perk-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          font-size: 0.95rem;
          color: #7a7670;
          transition: all 0.3s ease;
          cursor: default;
          position: relative;
        }
        
        .perk-item:last-child {
          border-bottom: none;
        }
        
        .perk-item:hover {
          color: #002147;
          transform: translateX(8px);
        }
        
        .perk-icon {
          font-size: 1.1rem;
          opacity: 0.7;
        }
        
        .perk-text {
          flex: 1;
        }
        
        .perk-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          opacity: 0.3;
        }
        
        /* CTA Button */
        .view-profile-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          background: transparent;
          border: 2px solid rgba(0, 33, 71, 0.15);
          border-radius: 100px;
          font-size: 0.95rem;
          font-weight: 600;
          color: #002147;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .view-profile-btn:hover {
          background: #002147;
          color: white;
          border-color: #002147;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 33, 71, 0.2);
        }
        
        .view-profile-btn:hover svg {
          transform: translateX(4px);
        }
        
        .view-profile-btn svg {
          transition: transform 0.3s ease;
        }
        
        /* ===== Right Side - Profile Card ===== */
        .player-card-wrapper {
          position: relative;
        }
        
        .profile-card {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: default;
        }
        
        .profile-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.08);
        }
        
        .profile-card-header {
          padding: 20px 28px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(0, 0, 0, 0.02);
        }
        
        .profile-card-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          color: #7a7670;
          text-transform: uppercase;
          font-weight: 600;
        }
        
        .title-icon {
          font-size: 0.9rem;
        }
        
        .profile-card-live {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          color: #002147;
          text-transform: uppercase;
          font-weight: 600;
        }
        
        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00C48C;
          animation: pulse 2s infinite;
        }
        
        .profile-card-body {
          padding: 28px;
        }
        
        /* Profile Top */
        .profile-top {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 28px;
        }
        
        .profile-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #002147 0%, #c9a84c 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          flex-shrink: 0;
          position: relative;
        }
        
        .avatar-glow {
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          background: linear-gradient(135deg, #002147, #c9a84c);
          opacity: 0.3;
          filter: blur(4px);
          z-index: -1;
        }
        
        .avatar-emoji {
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .profile-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 600;
          color: #002147;
        }
        
        .profile-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7rem;
          color: #7a7670;
          margin-top: 4px;
          flex-wrap: wrap;
        }
        
        .meta-tag {
          padding: 2px 8px;
          background: rgba(0, 33, 71, 0.08);
          border-radius: 100px;
          color: #002147;
          font-weight: 600;
        }
        
        .meta-dot {
          opacity: 0.3;
        }
        
        /* XP Block */
        .xp-block {
          margin-bottom: 28px;
          padding: 16px;
          background: rgba(0, 0, 0, 0.02);
          border-radius: 16px;
        }
        
        .xp-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: #7a7670;
          margin-bottom: 12px;
        }
        
        .xp-label {
          font-weight: 500;
        }
        
        .xp-values {
          font-weight: 600;
          color: #002147;
        }
        
        .xp-bar-container {
          height: 6px;
          background: rgba(0, 0, 0, 0.06);
          border-radius: 3px;
          overflow: hidden;
          position: relative;
        }
        
        .xp-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #002147, #c9a84c);
          border-radius: 3px;
          transition: width 2s cubic-bezier(0.16, 1, 0.3, 1) 0.6s;
        }
        
        .xp-bar-marker {
          position: absolute;
          top: -2px;
          width: 2px;
          height: 10px;
          background: #002147;
          border-radius: 1px;
          transform: translateX(-50%);
        }
        
        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 28px;
        }
        
        .stat-cell {
          padding: 16px;
          background: rgba(0, 0, 0, 0.02);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          position: relative;
        }
        
        .stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 600;
          line-height: 1;
        }
        
        .stat-label {
          font-size: 0.65rem;
          color: #7a7670;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .stat-trend {
          position: absolute;
          top: 12px;
          right: 12px;
          font-size: 0.6rem;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 100px;
        }
        
        .stat-trend.positive {
          color: #00C48C;
          background: rgba(0, 196, 140, 0.1);
        }
        
        /* Recent Activity */
        .recent-activity {
          margin-bottom: 28px;
        }
        
        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .activity-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: #002147;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .activity-view {
          font-size: 0.65rem;
          color: #c9a84c;
          cursor: pointer;
        }
        
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: rgba(0, 0, 0, 0.02);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .activity-item:hover {
          background: rgba(0, 0, 0, 0.04);
          transform: translateX(4px);
        }
        
        .activity-icon {
          font-size: 1rem;
        }
        
        .activity-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .activity-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: #002147;
        }
        
        .activity-time {
          font-size: 0.6rem;
          color: #b8b3ab;
        }
        
        .activity-xp {
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        /* Badge Section */
        .badge-section {
          padding-top: 20px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }
        
        .badge-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .badge-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: #002147;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .badge-count {
          font-size: 0.65rem;
          color: #c9a84c;
          font-weight: 600;
        }
        
        .badge-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .badge {
          font-size: 0.65rem;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 100px;
          transition: all 0.3s ease;
          cursor: default;
        }
        
        .badge.active {
          background: rgba(0, 33, 71, 0.08);
          color: #002147;
          border: 1px solid rgba(0, 33, 71, 0.1);
        }
        
        .badge.active:hover {
          background: #002147;
          color: white;
          transform: translateY(-2px);
        }
        
        .badge.inactive {
          background: rgba(0, 0, 0, 0.02);
          color: #b8b3ab;
          border: 1px dashed rgba(0, 0, 0, 0.1);
        }
        
        /* Floating Achievement */
        .achievement-badge {
          position: absolute;
          right: -20px;
          top: 30px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.1);
          padding: 16px 20px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          animation: ${visible[1] ? 'slideIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1.3s backwards' : 'none'};
          z-index: 10;
        }
        
        .achievement-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(201, 168, 76, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        
        .achievement-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .achievement-label {
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          color: #c9a84c;
          text-transform: uppercase;
          font-weight: 600;
        }
        
        .achievement-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #002147;
        }
        
        .achievement-time {
          font-size: 0.6rem;
          color: #b8b3ab;
        }
        
        /* Animations */
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        /* ===== Responsive Design ===== */
        
        /* Tablet */
        @media (max-width: 1024px) {
          .player-container {
            gap: 40px;
          }
          
          .stats-preview {
            padding: 16px 20px;
          }
          
          .profile-card-body {
            padding: 24px;
          }
          
          .achievement-badge {
            display: none;
          }
        }
        
        /* Mobile */
        @media (max-width: 768px) {
          .player-section {
            padding: 80px 0;
          }
          
          .player-container {
            grid-template-columns: 1fr;
            gap: 48px;
            padding: 0 24px;
          }
          
          .stats-preview {
            flex-wrap: wrap;
            border-radius: 24px;
            gap: 16px;
          }
          
          .stat-preview-divider {
            display: none;
          }
          
          .stat-preview-item {
            width: 100%;
            justify-content: space-between;
          }
          
          .perk-item {
            padding: 14px 0;
            font-size: 0.9rem;
          }
          
          .view-profile-btn {
            width: 100%;
            justify-content: center;
          }
          
          .profile-card:hover {
            transform: translateY(-4px) scale(1.01);
          }
          
          .stats-grid {
            gap: 8px;
          }
          
          .stat-cell {
            padding: 12px;
          }
          
          .stat-value {
            font-size: 1.5rem;
          }
          
          .badge-row {
            gap: 6px;
          }
          
          .badge {
            font-size: 0.6rem;
            padding: 5px 10px;
          }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .player-container {
            padding: 0 16px;
          }
          
          .profile-card-header {
            padding: 16px 20px;
          }
          
          .profile-card-body {
            padding: 20px;
          }
          
          .profile-top {
            flex-direction: column;
            text-align: center;
          }
          
          .profile-meta {
            justify-content: center;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .stat-cell {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
          
          .stat-trend {
            position: static;
          }
          
          .activity-item {
            padding: 8px;
          }
          
          .badge-row {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}