// D:\BS-arena-NextJS\app\page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "./components/Navbar";
import HeroLanding from "./components/landing/HeroLanding";
import TickerLanding from "./components/landing/TickerLanding";
import FeaturesLanding from "./components/landing/FeaturesLanding";
import HowItWorksLanding from "./components/landing/HowItWorksLanding";
import PlayerProfileLanding from "./components/landing/PlayerProfileLanding";
import PracticeModesLanding from "./components/landing/PracticeModesLanding";
import LeaderboardLanding from "./components/landing/LeaderboardLanding";
import ReviewsLanding from "./components/landing/ReviewsLanding";
import ContactLanding from "./components/landing/ContactLanding";
import CTALanding from "./components/landing/CTALanding";
import FooterLanding from "./components/landing/FooterLanding";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Update nav scrolled state
      if (navRef.current) {
        if (window.scrollY > 40) {
          navRef.current.classList.add("scrolled");
        } else {
          navRef.current.classList.remove("scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <HeroLanding scrollY={scrollY} />
      <TickerLanding />
      <FeaturesLanding />
      <HowItWorksLanding />
      <PlayerProfileLanding />
      <PracticeModesLanding />
      <LeaderboardLanding />
      <ReviewsLanding />
      <ContactLanding />
      <CTALanding />
      <FooterLanding />

      {/* Global Styles */}
      <style jsx global>{`
        :root {
          --ink: #ffffff;
          --ink-2: #f4f6f9;
          --ink-3: #eaedf4;
          --ink-4: #dfe3ec;
          --surface: #eaedf4;
          --line: rgba(0, 15, 30, 0.06);
          --line-2: rgba(0, 15, 30, 0.14);
          --emerald: #00d26a;
          --emerald-dim: #e0f9ed;
          --violet: #7b32ff;
          --violet-dim: #f3e8ff;
          --crimson: #ff2e63;
          --crimson-dim: #ffebf0;
          --amber: #ff8a00;
          --amber-dim: #fff3e0;
          --sapphire: #00c2ff;
          --sapphire-dim: #e0f8ff;
          --text-1: #0f141e;
          --text-2: #525c6e;
          --text-3: #8b96a8;
          --nav-bg: rgba(255, 255, 255, 0.92);
          --ff-display: 'Cormorant Garamond', Georgia, serif;
          --ff-body: 'DM Sans', sans-serif;
          --ff-mono: 'DM Mono', monospace;
          --ease: cubic-bezier(0.16, 1, 0.3, 1);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          background: var(--ink);
          color: var(--text-1);
          font-family: var(--ff-body);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        body::before {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
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
          from {
            transform: translate(-50%, -50%) scale(0.85);
          }
          to {
            transform: translate(-50%, -50%) scale(1.15);
          }
        }

        @keyframes ticker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes pulse-dot {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.2;
          }
        }

        @keyframes xp-load {
          from {
            width: 0 !important;
          }
        }

        @keyframes ach-in {
          from {
            opacity: 0;
            transform: translateX(18px) scale(0.94);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}