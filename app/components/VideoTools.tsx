"use client";

import { useState } from "react";
import { FaClock, FaCalculator, FaChartLine, FaQuestionCircle } from "react-icons/fa";

export default function VideoTools() {
  const [showTools, setShowTools] = useState(false);
  const [hoverTools, setHoverTools] = useState(false);

  const showTab = showTools || hoverTools;

  return (
    <div className="relative rounded-2xl shadow-lg h-full">
      {/* Video Background */}
      <video
        src="/study-tools.mp4"
        className="w-full h-full object-cover rounded-2xl shadow-lg z-0"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* HEADER OVERLAY */}
      <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-[rgb(224,216,212)] to-[rgb(239,229,219)] bg-opacity-90 p-4 flex flex-col justify-center items-center z-10">
        <h1
          style={{
            fontFamily: "PPE",
            fontWeight: 400,
            fontSize: "50px",
            lineHeight: "70px",
            color: "rgb(0, 0, 0)",
          }}
        >
          Your Study
        </h1>
        <h1
          style={{
            fontFamily: "PPE",
            fontWeight: 400,
            fontSize: "50px",
            lineHeight: "70px",
            color: "rgb(0, 0, 0)",
          }}
        >
          Tools
        </h1>
      </div>

      {/* BUTTON + TOOL TAB CONTAINER */}
      <div className="absolute bottom-0 h-45 left-0 w-full bg-gradient-to-t from-[rgb(225,220,213)] to-[rgb(239,229,219)] bg-opacity-90 p-4 flex justify-center items-center z-20">
        <div
          className="relative"
          onMouseEnter={() => setHoverTools(true)}
          onMouseLeave={() => setHoverTools(false)}
        >
          {/* TOGGLE BUTTON */}
          <button
            onClick={() => setShowTools(!showTools)}
            className="px-6 py-3 bg-black text-white text-lg rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 relative z-30"
          >
            {showTools ? "Hide Tools" : "Show Tools"}
          </button>

          {/* TOOLS TAB - Positioned slightly left with 3D rotate */}
          {showTab && (
            <div className="absolute bottom-24 left-1/2 -translate-x-[55%] w-72 bg-[rgb(225,220,213)] rounded-xl shadow-xl p-4 flex flex-col gap-3 z-50 rotate-360-tab">
              <Tool title="Pomodoro Timer" icon={<FaClock />} color="from-black to-black" small />
              <Tool title="Grade Calculator" icon={<FaCalculator />} color="from-black to-black" small />
              <Tool title="Grade Predictor" icon={<FaChartLine />} color="from-black to-black" small />
              <Tool title="FAQ & Help" icon={<FaQuestionCircle />} color="from-black to-black" small />
            </div>
          )}
        </div>
      </div>

      {/* 3D Rotation Animation */}
      <style jsx>{`
        .rotate-360-tab {
          animation: rotate-360 0.8s ease-out 0.1s forwards;
          transform-style: preserve-3d;
          backface-visibility: visible; /* Keep tab visible even at 180° */
        }

        @keyframes rotate-360 {
          0% {
            opacity: 0;
            transform: rotateY(0deg);
          }
          50% {
            opacity: 1;
            transform: rotateY(180deg);
          }
          100% {
            opacity: 1;
            transform: rotateY(360deg);
          }
        }
      `}</style>
    </div>
  );
}

/* ================= TOOL COMPONENT ================= */
function Tool({ title, icon, color, small }: any) {
  return (
    <div
      className={`relative bg-gradient-to-br ${color} rounded-xl p-${small ? "2" : "5"} shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden flex items-center gap-3`}
    >
      <div
        className={`flex items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white text-lg ${
          small ? "w-8 h-8" : "w-12 h-12"
        } group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <div>
        <h3 className={`font-bold text-white ${small ? "text-sm" : "text-lg"}`}>{title}</h3>
      </div>
    </div>
  );
}