"use client";

import React, { useState } from "react";
import {
  FaHome,
  FaTrophy,
  FaQuestion,
  FaHistory,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Dock() {
  const dockItems = [
    { name: "Home", icon: <FaHome />, active: true },
    { name: "Leaderboard", icon: <FaTrophy /> },
    { name: "Quiz", icon: <FaQuestion /> },
    { name: "History", icon: <FaHistory /> },
    { name: "Settings", icon: <FaCog /> },
    { name: "Logout", icon: <FaSignOutAlt />, special: true },
  ];

  const [hoverIndex, setHoverIndex] = useState(null);

  const getScale = (index) => {
    if (hoverIndex === null) return 1;
    const distance = Math.abs(index - hoverIndex);
    if (distance === 0) return 1.5; // hovered icon
    if (distance === 1) return 1.25; // immediate neighbors
    if (distance === 2) return 1.1; // next neighbors
    return 1;
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-3xl bg-white/30 backdrop-blur-md shadow-xl flex items-end gap-4 z-50">
      {dockItems.map((item, index) => {
        const scale = getScale(index);
        const isHovered = index === hoverIndex;

        return (
          <a
            key={item.name}
            href={item.name === "Home" ? "/" : `/${item.name.toLowerCase()}`}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            className={`flex flex-col items-center cursor-pointer ${isHovered ? "z-50" : "z-10"}`}
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)", // faster and smooth
            }}
          >
            <div
              className={`flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full shadow-md transition-all duration-200 ${
                item.active
                  ? "bg-white text-black"
                  : item.special
                    ? "bg-white text-red-500 hover:bg-red-100"
                    : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="text-xl md:text-2xl">{item.icon}</div>
            </div>
            <span className="text-xs mt-1 font-medium text-center truncate w-16">
              {item.name}
            </span>
          </a>
        );
      })}
    </div>
  );
}
