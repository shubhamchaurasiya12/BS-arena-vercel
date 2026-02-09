// app/dashboard/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";


import DeleteSubjectButton from "@/components/DeleteSubjectButton";
import AuthUserSync from "@/components/AuthUserSync";
import VideoTools from "../components/VideoTools";
import Dock from "../components/Dock";
import { FaDownload, FaPlus } from "react-icons/fa";

import { supabase } from "@/lib/supabase";

type DashboardData = {
  user?: {
    id: string;
    name: string;
    email: string;
    total_points: number;
    active_subject_count: number;
  };
  subjects?: {
    subject_id: string;
    subjects: { name: string };
  }[];
};

export default async function DashboardPage() {
  // ✅ Get NextAuth session
  const session = await getServerSession(authOptions);

  // If not logged in → redirect
  if (!session || !session.user) redirect("/login");

  // ✅ Fetch user from Supabase
  const { data: user } = await supabase
    .from("users")
    .select("id, name, email, total_points, active_subject_count")
    .eq("email", session.user.email)
    .maybeSingle();

  if (!user) redirect("/login");

  // ✅ Fetch subjects
  const { data: subjects } = await supabase
    .from("user_subjects")
    .select("subject_id, subjects(name)")
    .eq("user_id", user.id);

  const data: DashboardData = {
    user,
    subjects: subjects || [],
  };

  return (
    <main className="min-h-screen bg-[rgb(255,250,246)] p-6 md:p-10 font-sans relative">
      {/* USER SYNC */}
      {data.user && <AuthUserSync user={data.user} />}

      {/* ================= HEADER ================= */}
      <div className="relative mb-10 md:mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
              Welcome back, <span className="text-[#003366]">{data.user?.name || "Student"}</span>
            </h1>
            <p className="text-gray-600">Track your progress and manage your subjects</p>
          </div>

          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-black text-white rounded-xl font-medium shadow-md hover:bg-gray-900 transition-all duration-300">
              Rate App
            </button>
          </div>
        </div>

        <div className="mt-6 h-[1px] bg-gradient-to-r from-transparent via-[#003366]/20 to-transparent"></div>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 relative">
        {/* ================= LEFT SIDE - STUDENT CARD ================= */}
        <div className="lg:col-span-2">
          <div className="bg-[rgb(225,220,213)] rounded-2xl p-7 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 w-full mb-8 relative overflow-hidden group">
            <h2 className="font-bold text-xl text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-black rounded-full"></div>
              Student Profile
            </h2>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-[#000000] to-[#b7b8ba] rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  {data.user?.name?.[0] || "S"}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-white text-sm shadow-md">
                  ✓
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <p className="font-bold text-2xl text-gray-900 mb-1">{data.user?.name || "Student"}</p>
                <p className="text-gray-600 mb-4">{data.user?.email || "your@email.com"}</p>
                <p className="text-gray-700 mb-6 max-w-md">
                  Welcome to your personalized academic dashboard. Track your subjects, grades, and progress all in one place.
                </p>

                <button className="px-6 py-3 bg-black text-white rounded-xl font-medium shadow-md hover:bg-gray-900 transition-all duration-300 flex items-center gap-2 mx-auto md:mx-0">
                  <FaDownload />
                  Download Student Card
                </button>
              </div>
            </div>
          </div>

          {/* ================= SUBJECTS GRID ================= */}
          <div className="bg-[rgb(225,220,213)] rounded-2xl p-7 shadow-xl border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                <div className="w-2 h-6 bg-black rounded-full"></div>
                Your Subjects
              </h2>
              <span className="text-sm text-gray-500">{data.subjects?.length || 0} of 4 subjects</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.subjects?.slice(0, 4).map((s) => (
                <div key={s.subject_id} className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5 h-[140px] group hover:shadow-lg hover:border-[#003366]/30 transition-all duration-300 cursor-pointer overflow-hidden">
                  <a href={`/notes?subjectId=${s.subject_id}`} className="font-bold text-lg text-gray-800 group-hover:text-[#003366] transition-colors duration-300 relative z-10 block h-full">
                    <div className="flex flex-col h-full justify-between">
                      <span className="line-clamp-2">{s.subjects.name}</span>
                      <span className="text-sm text-gray-500 mt-2">View notes & resources →</span>
                    </div>
                  </a>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <DeleteSubjectButton subjectId={s.subject_id} />
                  </div>
                </div>
              ))}

              {Array.from({ length: Math.max(0, 4 - (data.subjects?.length || 0)) }).map((_, i) => (
                <a key={i} href="/subject-selection" className="border-2 border-dashed border-gray-300 rounded-xl h-[140px] flex flex-col items-center justify-center font-medium text-gray-400 bg-gray-50 hover:bg-gradient-to-br hover:from-gray-50 hover:to-[#003366]/5 hover:border-[#003366]/30 hover:text-[#003366] transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#003366]/10 to-[#003366]/5 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <FaPlus className="text-[#003366]" />
                  </div>
                  <span className="text-lg">Add Subject</span>
                  <span className="text-sm mt-1">Click to explore</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-1 relative">
          <VideoTools />
        </div>
      </div>

      <Dock />
    </main>
  );
}