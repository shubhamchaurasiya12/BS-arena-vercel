// app/components/landing/ReviewsLanding.tsx
"use client";

import { useEffect, useRef, useState } from "react";

/* =========================
   Strict Types (Fixes TS)
========================= */

type BadgeColor = "navy" | "gold";

type Review = {
  initial: string;
  color: string;
  name: string;
  meta: string;
  stars: number;
  text: string;
  badge: string;
  badgeColor: BadgeColor;
  achievement: string;
  location: string;
};

export default function ReviewsLanding() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

  /* =========================
        Reviews Data
  ========================= */

  const reviews: Review[] = [
    {
      initial: "A",
      color: "#002147",
      name: "Ananya Krishnan",
      meta: "DS Term 2 · Chennai",
      stars: 5,
      text: "I used to panic before every end-term. After running 4 mock tests on BS Arena, I walked into the Statistics paper feeling like I'd already done it. Scored 89. This app is different — it actually mirrors the IITM format.",
      badge: "Mock Tests",
      badgeColor: "navy",
      achievement: "89% Score",
      location: "Chennai",
    },
    {
      initial: "R",
      color: "#c9a84c",
      name: "Rahul Mehta",
      meta: "DS Term 3 · Mumbai",
      stars: 5,
      text: "The 1v1 battles are genuinely addictive. My batchmate challenged me to a Python duel at midnight and we went three rounds. I learned more in that hour than in a week of passive studying. The leaderboard pressure is real.",
      badge: "Live Battles",
      badgeColor: "gold",
      achievement: "3-Round Streak",
      location: "Mumbai",
    },
    {
      initial: "S",
      color: "#002147",
      name: "Sneha Pillai",
      meta: "DS Term 1 · Bengaluru",
      stars: 5,
      text: "As a working professional doing IITM BS on the side, I barely have time to study. The flashcard streaks and daily XP challenges keep me consistent. 42-day streak and counting. Nothing else has kept me this disciplined.",
      badge: "Streaks",
      badgeColor: "navy",
      achievement: "42-Day Streak",
      location: "Bengaluru",
    },
    {
      initial: "K",
      color: "#c9a84c",
      name: "Karan Nair",
      meta: "DS Term 4 · Hyderabad",
      stars: 4,
      text: "The subject quizzes are spot-on for IITM content. Maths-II questions especially. My accuracy went from 61% to 84% over 3 weeks. I wish there were more DSA questions, but what's here is genuinely high quality.",
      badge: "Subject Quizzes",
      badgeColor: "gold",
      achievement: "+23% Accuracy",
      location: "Hyderabad",
    },
    {
      initial: "P",
      color: "#002147",
      name: "Priya Iyer",
      meta: "DS Term 2 · Pune",
      stars: 5,
      text: "Climbed from rank 312 to rank 18 in one term. The leaderboard made me treat every quiz like it mattered. It's the only study tool that gave me that exam-hall focus during practice. Completely free too — can't believe it.",
      badge: "Leaderboard",
      badgeColor: "navy",
      achievement: "Rank +294",
      location: "Pune",
    },
    {
      initial: "D",
      color: "#c9a84c",
      name: "Dev Sharma",
      meta: "DS Term 3 · Delhi",
      stars: 5,
      text: "Our friend group turned BS Arena into a weekly ritual. Saturday night cohort tournament, five of us competing on whichever subject had an assessment that week. It's made studying genuinely fun — and our grades show it.",
      badge: "Cohort Arena",
      badgeColor: "gold",
      achievement: "Group Champions",
      location: "Delhi",
    },
  ];

  /* =========================
        Helpers
  ========================= */

  const getBadgeStyles = (badgeColor: BadgeColor) => {
    if (badgeColor === "navy") {
      return {
        color: "#002147",
        borderColor: "rgba(0, 33, 71, 0.2)",
        background: "rgba(0, 33, 71, 0.08)",
      };
    }

    return {
      color: "#c9a84c",
      borderColor: "rgba(201, 168, 76, 0.2)",
      background: "rgba(201, 168, 76, 0.08)",
    };
  };

  const renderStars = (count: number) =>
    "★".repeat(count) + "☆".repeat(5 - count);

  /* =========================
        Component JSX
  ========================= */

  return (
    <section id="reviews" ref={sectionRef} className="reviews-section">
      {/* Header */}
      <div className="reviews-header r">
        <div className="header-left">
          <div className="header-badge">
            <span className="badge-dot" style={{ background: "#002147" }} />
            <p className="section-eyebrow">// Student Reviews</p>
          </div>
          <h2 className="section-heading">
            Straight from<br />
            <em>the cohort.</em>
          </h2>
        </div>

        <div className="header-right">
          <div className="rating-card">
            <div className="rating-number">4.9</div>
            <div className="rating-details">
              <div className="rating-stars">★★★★★</div>
              <div className="rating-label">from 847 IITM BS students</div>
            </div>
          </div>
          <div className="rating-badge">
            <span className="badge-icon">🏆</span>
            <span className="badge-text">Top Rated</span>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="reviews-grid">
        {reviews.map((review, index) => {
          const badgeStyles = getBadgeStyles(review.badgeColor);
          const cohortMeta = review.meta?.split("·")?.[0]?.trim() ?? "";

          return (
            <div
              key={index}
              className="review-card r"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              style={{
                transform:
                  activeIndex === index ? "translateY(-8px)" : "none",
                boxShadow:
                  activeIndex === index
                    ? "0 20px 40px rgba(0,0,0,0.08)"
                    : "none",
              }}
            >
              <div className="review-card-inner">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div
                      className="review-avatar"
                      style={{ background: review.color }}
                    >
                      {review.initial}
                    </div>
                    <div>
                      <div className="review-name">{review.name}</div>
                      <div className="review-meta">
                        <span className="meta-location">
                          📍 {review.location}
                        </span>
                        <span className="meta-dot">•</span>
                        <span>{cohortMeta}</span>
                      </div>
                    </div>
                  </div>
                  <div className="review-quote">"</div>
                </div>

                <div className="review-stars">
                  {renderStars(review.stars)}
                </div>

                <p className="review-text">{review.text}</p>

                <div className="review-footer">
                  <div className="review-achievement">
                    <span className="achievement-icon">⚡</span>
                    <span className="achievement-text">
                      {review.achievement}
                    </span>
                  </div>

                  <span className="review-badge" style={badgeStyles}>
                    {review.badge}
                  </span>
                </div>

                <div
                  className="card-glow"
                  style={{
                    background: `radial-gradient(circle at 100% 0%, ${review.color}15, transparent 70%)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Indicators */}
      <div className="trust-indicators r">
        <div className="trust-item">
          <span className="trust-icon">✅</span>
          <span className="trust-text">Verified IITM BS students</span>
        </div>
        <div className="trust-divider" />
        <div className="trust-item">
          <span className="trust-icon">📝</span>
          <span className="trust-text">Unedited reviews</span>
        </div>
        <div className="trust-divider" />
        <div className="trust-item">
          <span className="trust-icon">🔄</span>
          <span className="trust-text">Updated weekly</span>
        </div>
      </div>

      {/* ⚠️ YOUR FULL CSS BLOCK REMAINS EXACTLY AS YOU PROVIDED */}
      <style jsx>{`
        .reviews-section {
          padding: 120px 0;
          background: #fafafa;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          position: relative;
          overflow: hidden;
        }
        
        /* ===== Header Styles ===== */
        .reviews-header {
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
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .rating-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 24px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 100px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
        }
        
        .rating-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem;
          font-weight: 600;
          color: #002147;
          line-height: 1;
        }
        
        .rating-details {
          display: flex;
          flex-direction: column;
        }
        
        .rating-stars {
          font-size: 1rem;
          letter-spacing: 2px;
          color: #c9a84c;
        }
        
        .rating-label {
          font-size: 0.65rem;
          letter-spacing: 0.05em;
          color: #b8b3ab;
          text-transform: uppercase;
          font-weight: 500;
        }
        
        .rating-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(201, 168, 76, 0.1);
          border: 1px solid rgba(201, 168, 76, 0.2);
          border-radius: 100px;
        }
        
        .badge-icon {
          font-size: 1rem;
        }
        
        .badge-text {
          font-size: 0.7rem;
          font-weight: 600;
          color: #c9a84c;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        /* ===== Reviews Grid ===== */
        .reviews-grid {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        
        .review-card {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: default;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
          height: 100%;
        }
        
        .review-card-inner {
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
        
        .review-card:hover .card-glow {
          opacity: 0.6;
        }
        
        /* Review Header */
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        
        .reviewer-info {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        
        .review-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          font-weight: 600;
          color: #ffffff;
          transition: transform 0.3s ease;
        }
        
        .review-card:hover .review-avatar {
          transform: scale(1.1);
        }
        
        .review-name {
          font-size: 1rem;
          font-weight: 600;
          color: #002147;
        }
        
        .review-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7rem;
          color: #b8b3ab;
          margin-top: 4px;
          flex-wrap: wrap;
        }
        
        .meta-location {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        
        .meta-dot {
          opacity: 0.3;
        }
        
        .review-quote {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3rem;
          line-height: 1;
          color: rgba(201, 168, 76, 0.2);
          margin-top: -10px;
        }
        
        /* Stars */
        .review-stars {
          font-size: 0.9rem;
          letter-spacing: 2px;
          color: #c9a84c;
          margin-bottom: 16px;
        }
        
        /* Review Text */
        .review-text {
          font-size: 0.9rem;
          line-height: 1.7;
          color: #7a7670;
          margin-bottom: 24px;
          flex-grow: 1;
          font-style: italic;
        }
        
        /* Footer */
        .review-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: auto;
        }
        
        .review-achievement {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(0, 0, 0, 0.02);
          border-radius: 100px;
          font-size: 0.7rem;
          color: #002147;
          font-weight: 600;
        }
        
        .achievement-icon {
          font-size: 0.8rem;
        }
        
        .review-badge {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 100px;
          border: 1px solid;
          transition: all 0.3s ease;
        }
        
        .review-badge:hover {
          transform: translateY(-2px);
          opacity: 0.9;
        }
        
        /* ===== Trust Indicators ===== */
        .trust-indicators {
          max-width: 1280px;
          margin: 60px auto 0;
          padding: 32px 32px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }
        
        .trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .trust-icon {
          font-size: 1rem;
        }
        
        .trust-text {
          font-size: 0.8rem;
          color: #7a7670;
        }
        
        .trust-divider {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #c9a84c;
          opacity: 0.3;
        }
        
        /* ===== Responsive Design ===== */
        
        /* Tablet */
        @media (max-width: 1024px) {
          .reviews-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          
          .rating-card {
            padding: 10px 20px;
          }
          
          .rating-number {
            font-size: 1.8rem;
          }
        }
        
        /* Mobile */
        @media (max-width: 768px) {
          .reviews-section {
            padding: 80px 0;
          }
          
          .reviews-header {
            flex-direction: column;
            align-items: flex-start;
            padding: 0 24px;
            margin-bottom: 40px;
          }
          
          .header-right {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
          }
          
          .rating-card {
            width: 100%;
            justify-content: center;
          }
          
          .rating-badge {
            width: 100%;
            justify-content: center;
          }
          
          .reviews-grid {
            grid-template-columns: 1fr;
            padding: 0 24px;
            gap: 16px;
          }
          
          .review-card-inner {
            padding: 24px;
          }
          
          .review-avatar {
            width: 44px;
            height: 44px;
            font-size: 1rem;
          }
          
          .review-name {
            font-size: 0.95rem;
          }
          
          .review-text {
            font-size: 0.85rem;
          }
          
          .trust-indicators {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
            padding: 24px 24px 0;
          }
          
          .trust-divider {
            display: none;
          }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
          .reviews-section {
            padding: 60px 0;
          }
          
          .reviews-header {
            padding: 0 16px;
          }
          
          .reviews-grid {
            padding: 0 16px;
          }
          
          .review-card-inner {
            padding: 20px;
          }
          
          .review-header {
            margin-bottom: 16px;
          }
          
          .reviewer-info {
            gap: 10px;
          }
          
          .review-avatar {
            width: 40px;
            height: 40px;
            font-size: 0.9rem;
          }
          
          .review-name {
            font-size: 0.9rem;
          }
          
          .review-meta {
            font-size: 0.65rem;
          }
          
          .review-quote {
            font-size: 2.5rem;
          }
          
          .review-stars {
            font-size: 0.8rem;
            margin-bottom: 12px;
          }
          
          .review-text {
            font-size: 0.8rem;
            line-height: 1.6;
            margin-bottom: 16px;
          }
          
          .review-footer {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .review-achievement {
            width: 100%;
            justify-content: center;
          }
          
          .review-badge {
            width: 100%;
            text-align: center;
          }
          
          .trust-indicators {
            padding: 20px 16px 0;
          }
          
          .trust-item {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
