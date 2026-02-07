"use client";

import { useEffect, useState } from "react";

const navItems = ["Home", "About", "Programs", "Contact"];

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
    document.querySelectorAll(".nav-link").forEach((link) => {
      const text = link.getAttribute("data-text") || "";
      link.innerHTML = "";

      text.split("").forEach((letter, index) => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.setAttribute("data-letter", letter);
        span.style.setProperty("--i", String(index));
        link.appendChild(span);
      });
    });

    /* ================= MAGNETIC LOGO EFFECT ================= */
    const logo = document.querySelector(".logo-magnetic");

    const handleMove = (e) => {
      const rect = logo.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      logo.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    };

    const handleLeave = () => {
      logo.style.transform = "translate(0, 0)";
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

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex gap-[45px] flex-1 justify-end">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                data-text={item}
                className="nav-link text-black text-[16px] font-medium inline-block overflow-hidden whitespace-nowrap"
              />
            ))}
          </nav>

          {/* DESKTOP BUTTONS */}
          <div className="hidden lg:flex items-center gap-6">
            <a href="#" className="btn relative rounded-full">
              <div className="btn__content">
                Dive in Battle <span className="btn__icon">→</span>
              </div>
            </a>

            <a href="#" className="btn btn--icon relative rounded-full">
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
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-black text-lg font-medium"
                  onClick={() => setOpen(false)}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <a href="#" className="btn flex-1 relative rounded-full">
                <div className="btn__content">
                  Schedule <span className="btn__icon">→</span>
                </div>
              </a>

              <a href="#" className="btn btn--icon relative rounded-full">
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

        .nav-link span {
          display: inline-block;
          position: relative;
          transition: transform 0.45s cubic-bezier(0.19, 1, 0.22, 1);
          transition-delay: calc(var(--i) * 0.05s);
        }

        .nav-link span::before {
          content: attr(data-letter);
          position: absolute;
          top: 100%;
          left: 0;
          font-family: "C", cursive;
          font-size: 18px;
          font-weight: 600;
        }

        .nav-link:hover span {
          transform: translateY(-100%);
        }

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
