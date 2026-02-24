//D:\BS-arena-NextJS\app\(auth)\login\page.tsx
"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function LoginPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');

        :root {
          --cream: #faf7f2;
          --card-bg: #eee9e1;
          --navy: #002147;
          --navy-mid: #003366;
          --gold: #c9a84c;
          --ink: #1a1a1a;
          --muted: #7a7670;
        }

        .login-root {
          min-height: 100vh;
          display: flex;
          background: var(--cream);
          position: relative;
          font-family: 'DM Sans', sans-serif;
        }

        /* Soft dashboard-style texture */
        .login-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(ellipse 70% 50% at 10% 0%, rgba(0,33,71,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 100%, rgba(201,168,76,0.07) 0%, transparent 55%);
          pointer-events: none;
        }

        .login-left {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          position: relative;
          z-index: 1;
        }

        .login-card {
          background: var(--card-bg);
          border-radius: 28px;
          padding: 50px 40px;
          width: 100%;
          max-width: 420px;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 18px 45px rgba(0,0,0,0.08);
          animation: fadeUp 0.5s ease;
        }

        .login-label {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--muted);
          margin-bottom: 8px;
        }

        .login-title {
          font-family: 'Instrument Serif', serif;
          font-size: 2.3rem;
          font-weight: 400;
          margin-bottom: 36px;
          color: var(--ink);
        }

        .login-title em {
          font-style: italic;
          color: var(--navy-mid);
        }

        .oauth-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.25s ease;
          cursor: pointer;
        }

        .google-btn {
          background: white;
          border: 1px solid rgba(0,0,0,0.1);
        }

        .google-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .github-btn {
          background: var(--navy);
          color: white;
          border: none;
          margin-top: 14px;
          box-shadow: 0 6px 18px rgba(0,33,71,0.25);
        }

        .github-btn:hover {
          background: #001a38;
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(0,33,71,0.35);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="login-root">

        {/* LEFT LOGIN PANEL */}
        <div className="login-left">
          <div className="login-card">
            <p className="login-label">Welcome Back</p>

            <h2 className="login-title">
              Sign in to <em>BS Arena</em>
            </h2>

            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="oauth-btn google-btn"
            >
              <FcGoogle size={20} />
              Continue with Google
            </button>

            <button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="oauth-btn github-btn"
            >
              <FaGithub size={18} />
              Continue with GitHub
            </button>
          </div>
        </div>

        {/* RIGHT VIDEO SECTION — UNTOUCHED */}
        <div className="flex-1 mt-44 -ml-33 hidden lg:block relative z-10">
          <video
            autoPlay
            loop
            muted
            className="w-[600px] h-[400px] object-cover rounded-xl"
            src="/login.mp4"
          />
        </div>

      </div>
    </>
  );
}
