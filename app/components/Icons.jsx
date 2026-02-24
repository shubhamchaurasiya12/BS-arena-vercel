//D:\BS-arena-NextJS\app\components\Icons.jsx
"use client";

import {
  FaRobot,
  FaCheck,
  FaTrophy,
  FaClock,
  FaClipboardList,
  FaCalculator,
  FaChartLine,
} from "react-icons/fa";

// Features data
export const Features = [
  { name: "AI notes", icon: <FaRobot /> },
  { name: "Weekly quizzes", icon: <FaCheck /> },
  { name: "Leaderboard", icon: <FaTrophy /> },
  { name: "Pomodoro", icon: <FaClock /> },
  { name: "Todo app", icon: <FaClipboardList /> },
  { name: "Grades calculator app", icon: <FaCalculator /> },
  { name: "Grades predictor app", icon: <FaChartLine /> },
];

export default function FeaturesSection() {
  return (
    <section className="relative mt-20 px-6 lg:px-12 overflow-hidden bg-[rgb(255,250,246)]">
      {/* Top line with fade */}
      <div className="relative mb-6 h-[2px] w-full">
        <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

      {/* Section title */}
      <h2 className="text-3xl font-bold text-black mb-2 text-center ppe-header">
        Our Features
      </h2>

      {/* Fade Left for marquee */}
      <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-[rgb(255,250,246)] to-transparent z-10 pointer-events-none" />

      {/* Fade Right for marquee */}
      <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[rgb(255,250,246)] to-transparent z-10 pointer-events-none" />

      {/* Marquee container */}
      <div className="overflow-hidden">
        <div className="marquee flex items-center whitespace-nowrap gap-6">
          {[...Features, ...Features].map((feature, idx) => (
            <div
              key={idx}
              className="inline-flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-lg shadow-lg w-44 hover:scale-105 transition-transform"
            >
              <div className="text-4xl text-gray-800 flex items-center justify-center">
                {feature.icon}
              </div>
              <p className="text-center text-black font-medium text-sm break-words ppe-text">
                {feature.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom line with fade */}
      <div className="mt-15 relative mt-2 mb-10 h-[2px] w-full">
        <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

      {/* CSS */}
      <style jsx>{`
        @font-face {
          font-family: "PPE";
          src: url("/fonts/PPE.woff2") format("woff2");
          font-weight: 400;
          font-style: normal;
        }

        .ppe-header {
          font-family: "PPE";
          font-weight: 400;
          color: rgb(0, 0, 0);
        }

        .ppe-text {
          font-family: "PPE";
          font-weight: 400;
          color: rgb(0, 0, 0);
        }

        .marquee {
          display: inline-flex;
          animation: scroll 20s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
