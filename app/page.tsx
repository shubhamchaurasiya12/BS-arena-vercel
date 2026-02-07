"use client";
import Hero from "./components/Hero";
import FeaturesSection, { Features } from "./components/Icons";
import LearningJourney from "./components/LearningJourney"
import StudentReview from "./components/StudentReview"
import Navbar from "./components/Navbar";
export default function Home() {
  return (
    <>
    <Navbar></Navbar>
    <div className="min-h-screen bg-[rgb(255,250,246)]">
      {/* Hero Section */}
      <Hero />
      {/* Features Section - marquee version */}
      <div className="-mt-50 mb-20">
<FeaturesSection />
      </div>
 <LearningJourney></LearningJourney>
    </div>
    <StudentReview></StudentReview>
    </>
  );
}