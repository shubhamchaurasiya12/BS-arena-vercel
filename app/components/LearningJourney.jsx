"use client";

import React from "react";

export default function LearningJourney() {
  return (
    <section className="bg-[rgb(255,250,245)] w-full relative">
      {/* Top Image Section */}
      <div className="relative flex justify-center py-10">
        <div className="mt-10 z-10 w-[260px] h-[260px] absolute -translate-y-1/2">
          <img
            src="/top.png"
            alt="Learning Journey"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Main Content Section with left and right margin */}
      <div className="relative bg-white mx-6 lg:mx-20 py-20 flex flex-col lg:flex-row items-center gap-10 rounded-xl shadow-xl">
        {/* Left Side - Heading + Paragraph */}
        <div className=" p-8 flex-1 max-w-xl">
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
            Navigate Your Learning Journey with Confidence
          </h2>
          <p className="text-lg lg:text-xl text-gray-800 leading-relaxed">
            Every student’s path to mastering a subject is unique. Each topic,
            assignment, and quiz is just one of many steps on your personal
            learning roadmap. Sometimes it can feel overwhelming — it’s okay to
            pause and seek guidance. We’re here to help you make sense of it
            all. There isn’t a single path to success; there are many ways to
            achieve your goals. Our platform provides the tools, insights, and
            support you need to reach your learning destination with confidence.
          </p>
        </div>

        {/* Right Side - Video */}
        <div className="flex-1 max-w-xl">
          <video
            src="/feture.mov"
            autoPlay
            loop
            muted
            playsInline
            className="rounded-xl w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
