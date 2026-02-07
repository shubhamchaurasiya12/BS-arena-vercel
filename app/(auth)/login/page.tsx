"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Login
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
          required
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-6 rounded"
          required
          disabled={loading}
        />

        {/* ================= 3D LOGIN BUTTON ================= */}
        <button
          type="submit"
          disabled={loading}
          className="btn relative rounded-full w-full"
        >
          <div className="btn__content flex items-center justify-center w-full">
            {loading ? "Logging in..." : "Login"}
          </div>
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </form>

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