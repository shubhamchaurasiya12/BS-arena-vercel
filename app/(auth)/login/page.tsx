"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-[rgb(255,250,246)]">

      {/* LEFT LOGIN PANEL */}
      <div className="flex-1 flex items-center justify-center px-10">
        <div className="p-8 w-full max-w-md">

          <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

          {/* GOOGLE LOGIN */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full border p-3 rounded mt-4 flex items-center justify-center gap-2 hover:bg-gray-100 transition"
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>

          {/* GITHUB LOGIN */}
          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="w-full bg-black text-white p-3 rounded mt-3 flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            <FaGithub size={22} />
            Continue with GitHub
          </button>

        </div>
      </div>

      {/* RIGHT VIDEO SECTION */}
      <div className="flex-1 mt-44 -ml-33 hidden lg:block">
        <video
          autoPlay
          loop
          muted
          className="w-[600px] h-[400px] object-cover rounded-xl "
          src="/login.mp4"
        />
      </div>

    </div>
  );
}