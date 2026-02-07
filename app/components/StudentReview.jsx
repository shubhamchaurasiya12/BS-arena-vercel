"use client";

import React from "react";
import { FaStar } from "react-icons/fa";

// Sample student reviews
const reviews = [
  {
    name: "Anmol Chauhan",
    review:
      "This platform has completely transformed my learning experience. The tools and quizzes make studying so much more engaging!",
    rating: 5,
  },
  {
    name: "Ruhi Sharma",
    review:
      "I love the AI notes feature! It really helps me revise quickly and effectively.",
    rating: 4,
  },
  {
    name: "Aarav Singh",
    review:
      "The Grades Predictor app is amazing. I can plan my learning path more efficiently now.",
    rating: 5,
  },
  {
    name: "Sneha Gupta",
    review:
      "Pomodoro feature keeps me focused. I love the simple layout and ease of use.",
    rating: 5,
  },
];

export default function StudentReviews() {
  return (
    <section className="bg-[rgb(255,250,245)] py-20 px-6 lg:px-20 relative overflow-hidden">
      {/* Header */}
      <h2 className="text-black text-4xl lg:text-5xl font-bold text-center mb-12 z-30 relative">
        Student Reviews
      </h2>
<div className="mt-40 mb-40">
      {/* Left fade image */}
      <div className="absolute  top-48 h-[30rem] w-20 flex items-center justify-start pointer-events-none z-20">
        <img
          src="/quote-side.png"
          alt="Fade Left"
          className="h-full object-cover"
        />
      </div>

      {/* Right fade image */}
      <div className="absolute right-20 top-48 h-[30rem] w-20 flex items-center justify-end pointer-events-none z-20">
        <img
          src="/quote-side.png"
          alt="Fade Right"
          className="h-full object-cover transform rotate-180"
        />
      </div>

      {/* Marquee container */}
      <div className="overflow-hidden relative z-10 mt-8">
        <div className="marquee flex gap-6">
          {[...reviews, ...reviews].map((rev, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-96 border-2 border-black bg-white rounded-xl p-6 flex flex-col justify-between"
            >
              {/* Top SVG */}
              <svg
                className="w-8 h-8 text-gray-400 mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.17 6C4.38 6 2 8.38 2 11.17S4.38 16.34 7.17 16.34c.74 0 1.43-.18 2.05-.51l.78 1.28C9.58 17.44 8.41 17.7 7.17 17.7 3.35 17.7 0 14.35 0 10.53S3.35 3.36 7.17 3.36c.74 0 1.43.18 2.05.51l.78-1.28C9.58 2.56 8.41 2.3 7.17 2.3 3.35 2.3 0 5.65 0 9.47s3.35 7.17 7.17 7.17c.74 0 1.43-.18 2.05-.51l.78 1.28c-.82.45-1.98.71-3.11.71z" />
              </svg>

              {/* Review text */}
              <p className="text-gray-800 text-lg leading-relaxed mb-4">
                {rev.review}
              </p>

              {/* Name + line */}
              <p className="font-bold text-black mb-1">{rev.name}</p>
              <div className="w-20 h-[2px] bg-black mb-2"></div>

              {/* Stars */}
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-xl ${
                      i < rev.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* CSS for scrolling */}
      <style jsx>{`
        .marquee {
          display: flex;
          animation: scroll 30s linear infinite;
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
