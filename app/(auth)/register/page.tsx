"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegistrationPage() {
  const router = useRouter();
  const { login } = useAuth(); // use the actual method name from your auth context

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      login(data.user, data.token);
      document.cookie = `token=${data.token}; path=/;`;

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[rgb(255,250,246)]">
      {/* ================= LEFT SIDE: VIDEO ================= */}
      <div className="flex-1 flex items-center justify-center mt-44 ml-[-2rem] relative">
        <video
          autoPlay
          loop
          muted
          className="w-140 h-100 ml-55 mb-40 object-fit"
          src="/register.mp4"
        />
      </div>

      {/* ================= RIGHT SIDE: REGISTRATION FORM ================= */}
      <div className="flex-1 flex items-center justify-center px-10">
        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-2xl w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-black">
            Register
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 p-3 rounded mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#63cfbf]"
            required
            disabled={loading}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#63cfbf]"
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#63cfbf]"
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 p-3 mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#63cfbf]"
            required
            disabled={loading}
          />

          {/* ================= 3D REGISTER BUTTON ================= */}
          <button
            type="submit"
            disabled={loading}
            className="btn relative rounded-full w-full"
          >
            <div className="btn__content flex items-center justify-center w-full">
              {loading ? "Registering..." : "Register"}
            </div>
          </button>

          <p className="text-center mt-5 text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-[#63cfbf] hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>

      {/* ================= GLOBAL BUTTON CSS ================= */}
      <style jsx global>{`
        .btn {
          text-decoration: none;
          border-radius: 9999px;
          position: relative;
          white-space: nowrap;
          width: 100%;
          display: block;
        }

        .btn::before {
          content: "";
          position: absolute;
          top: 6px;
          left: 6px;
          width: 100%;
          height: 100%;
          background-image: url("/IMAGE.png");
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          border: 2px solid black;
          border-radius: inherit;
          z-index: 0;
          transition: 0.2s ease;
        }

        .btn__content {
          position: relative;
          z-index: 2;
          background-color: #63cfbf;
          border: 2px solid black;
          border-radius: inherit;
          height: 3.2rem;
          font-size: 1rem;
          font-weight: 500;
          color: black;
          transition: transform 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn:hover .btn__content {
          transform: translate(6px, 6px);
        }

        .btn:hover::before {
          opacity: 0;
        }

        .btn:disabled {
          opacity: 0.6;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}