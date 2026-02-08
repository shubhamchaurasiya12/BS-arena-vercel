"use client";

import { useEffect, useState } from "react";
import HoverTab from "./HoverTab"; // Make sure this path is correct

// Define your hover items
const hoverItems = [
  {
    name: "Home",
    content: "Welcome to our homepage with all the latest updates and news."
  },
  {
    name: "About",
    content: "Learn about our mission, vision, and the team behind our success."
  },
{
  name: "Features",
  content: (
    <div className="flex-1 relative p-6">
      {/* Decorative vertical notebook line */}
      {/* <div className="absolute top-0 left-6 bottom-0 w-[2px] bg-black"></div> */}

      <div className="flex flex-col gap-4">
        <div className="text-gray-800 font-semibold border-b border-black pb-1">
          AI Notes
        </div>
        <div className="text-gray-800 font-semibold border-b border-black pb-1">
          Weekly Quizzes
        </div>
        <div className="text-gray-800 font-semibold border-b border-black pb-1">
          Leaderboard
        </div>
        <div className="text-gray-800 font-semibold border-b border-black pb-1">
          Pomodoro
        </div>
        <div className="text-gray-800 font-semibold border-b border-black pb-1">
          Todo App
        </div>
        <div className="text-gray-800 font-semibold border-b border-black pb-1">
          Grades Calculator App
        </div>
        <div className="text-gray-800 font-semibold border-b border-black pb-1">
          Grades Predictor App
        </div>
      </div>
    </div>
  )
},
{
  name: "Devlopers",
  content: (
    <div className="flex gap-8 items-start">
      {/* Left side: Notebook-style titles */}
      <div className="flex-1 relative  p-6 ">
        {/* Decorative notebook margin line */}
        {/* <div className="absolute top-0 left-6 bottom-0 w-[2px] bg-red-500"></div> */}

        <div className="flex flex-col gap-4 pl-10">
          <div className="text-xl font-bold border-b border-black pb-1">
            Backend Developer
          </div>
          <div className="text-xl font-bold border-b border-black pb-1">
            Frontend Developer
          </div>
        </div>
      </div>

      {/* Right side: Image */}
      <div className="w-48 flex-shrink-0">
        <img
          src="/image copy.png"
          alt="Team Illustration"
          className="w-full h-auto rounded-xl shadow-lg"
        />
      </div>
    </div>
  )
}
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    /* ================= SCROLL EFFECT ================= */
    const handleScroll = () => {
      setScrolled(window.scrollY > 2);
    };
    window.addEventListener("scroll", handleScroll);

    /* ================= NAV LETTER EFFECT ================= */
    const initNavLinks = () => {
      document.querySelectorAll(".nav-link").forEach((link) => {
        // Only process if it hasn't been processed yet
        if (link.children.length === 0) {
          const text = link.textContent || "";
          link.innerHTML = ""; // Clear existing content

          text.split("").forEach((letter, index) => {
            const span = document.createElement("span");
            span.textContent = letter;
            span.setAttribute("data-letter", letter);
            span.style.setProperty("--i", String(index));
            link.appendChild(span);
          });
        }
      });
    };

    // Initialize nav links after a small delay to ensure DOM is ready
    setTimeout(initNavLinks, 10);

    /* ================= MAGNETIC LOGO EFFECT ================= */
    const logo = document.querySelector(".logo-magnetic");

    const handleMove = (e: MouseEvent) => {
      if (!logo) return;
      const rect = logo.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      (logo as HTMLElement).style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    };

    const handleLeave = () => {
      if (logo) {
        (logo as HTMLElement).style.transform = "translate(0, 0)";
      }
    };

    if (logo) {
      logo.addEventListener("mousemove", handleMove);
      logo.addEventListener("mouseleave", handleLeave);
    }

    /* CLEANUP */
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (logo) {
        logo.removeEventListener("mousemove", handleMove);
        logo.removeEventListener("mouseleave", handleLeave);
      }
    };
  }, []);

  return (
    <header className={`navbar-bg ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-[80px] gap-10">
          {/* LOGO */}
          <a
            href="#"
            className="logo-magnetic relative flex items-center gap-2"
          >
            <img src="/logo.png" alt="Logo" className="logo-img h-10 w-auto" />
          </a>

          {/* DESKTOP NAV - INTEGRATED WITH HOVER TAB */}
          <div className="hidden lg:flex flex-1 justify-end">
            <HoverTab items={hoverItems} />
          </div>

          {/* DESKTOP BUTTONS */}
          <div className="hidden lg:flex items-center gap-6">
            <a href="/login" className="btn relative rounded-full">
              <div className="btn__content">
                Dive in Battle <span className="btn__icon">→</span>
              </div>
            </a>

            <a href="#question-jar" className="btn btn--icon relative rounded-full">
              <div className="btn__content btn__content--icon">?</div>
            </a>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="lg:hidden flex flex-col gap-1.5"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span className="w-6 h-[2px] bg-black"></span>
            <span className="w-6 h-[2px] bg-black"></span>
            <span className="w-6 h-[2px] bg-black"></span>
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="lg:hidden mt-4 rounded-2xl border-2 border-black p-6 space-y-6 bg-white">
            <nav className="flex flex-col gap-4">
              {hoverItems.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  className="text-black text-lg font-medium"
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <a href="#" className="btn flex-1 relative rounded-full">
                <div className="btn__content">
                  Schedule <span className="btn__icon">→</span>
                </div>
              </a>

              <a href="#question-jar" className="btn btn--icon relative rounded-full">
                <div className="btn__content btn__content--icon">?</div>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* CSS SAME AS YOURS */}
      <style jsx global>{`
        .navbar-bg {
          background-color: rgb(255, 250, 246);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .navbar-scrolled {
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        /* Remove the old nav-link styles since HoverTab handles it */
        .logo-magnetic {
          transition: transform 0.2s ease-out;
          will-change: transform;
        }

        .logo-img {
          transition: transform 0.2s ease-out;
        }

        .logo-magnetic:hover .logo-img {
          transform: scale(1.04);
        }

        .btn {
          position: relative;
          text-decoration: none;
          border-radius: 9999px;
        }

        .btn::before {
          content: "";
          position: absolute;
          top: 6px;
          left: 6px;
          width: 100%;
          height: 100%;
          background-image: url("/IMAGE.png");
          background-size: cover;
          border: 2px solid black;
          border-radius: inherit;
          transition: 0.2s ease;
        }

        .btn__content {
          position: relative;
          z-index: 2;
          background-color: #63cfbf;
          border: 2px solid black;
          border-radius: inherit;
          padding: 0 14px;
          height: 3.2rem;
          display: flex;
          align-items: center;
          font-size: 1rem;
          font-weight: 500;
          transition: transform 0.2s ease;
        }

        .btn:hover .btn__content {
          transform: translate(6px, 6px);
        }

        .btn:hover::before {
          opacity: 0;
        }

        .btn__icon {
          margin-left: 0.8rem;
          font-size: 1.2rem;
        }

        .btn--icon {
          width: 3.1rem;
          height: 3.1rem;
          min-width: 3.1rem;
        }

        .btn__content--icon {
          width: 3.1rem;
          height: 3.1rem;
          padding: 0;
          font-size: 1.6rem;
          font-weight: 700;
          justify-content: center;
        }
      `}</style>
    </header>
  );
}