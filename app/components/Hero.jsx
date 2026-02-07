"use client";

import React from "react";

const Hero = () => {
  return (
    <section className="mt-25 relative w-full min-h-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-150 object-cover"
        src="/hero-vid.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* TEXT ONLY OVER VIDEO */}
      <div className="relative z-10 flex h-full items-center justify-center text-center px-6">
        <div>
          {/* Heading */}
          <h1
            style={{
              fontFamily: "PPE",
              fontWeight: 400,
              fontSize: "80px",
              lineHeight: "80px",
              color: "rgb(0, 0, 0)",
            }}
          >
            A focused study space <br />
            for everyone.
          </h1>

          {/* Subheading */}
          <p
            style={{
              marginTop: "16px",
              fontFamily: "Neue",
              fontWeight: 400,
              fontSize: "22px",
              lineHeight: "18px",
              color: "rgb(0, 0, 0)",
            }}
          >
            Progress comes with patience. Learn calmly.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
