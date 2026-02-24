//D:\BS-arena-NextJS\components\BetPanel.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

type BetPanelProps = {
  onConfirm: (bet: number) => void;
};

export default function BetPanel({ onConfirm }: BetPanelProps) {
  const { user } = useAuth();
  const [betAmount, setBetAmount] = useState("");

  return (
    <div className="bg-[rgb(225,220,213)] p-6 rounded-2xl shadow-xl border border-gray-200 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-3 text-gray-800">
        Place Your Bet
      </h2>

      <p className="text-sm text-gray-700 mb-4">
        Available Points: <strong>{user?.total_points ?? 0}</strong>
      </p>

      <input
        type="number"
        min={1}
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        placeholder="Enter bet amount"
        className="w-full border border-gray-300 rounded-xl px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-all duration-300"
      />

      <button
        onClick={() => {
          const bet = Number(betAmount);
          if (!bet || bet <= 0) {
            alert("Enter a valid bet amount");
            return;
          }
          onConfirm(bet);
        }}
        className="bg-black text-white px-6 py-3 rounded-2xl shadow-md hover:bg-gray-900 w-full transition-all duration-300"
      >
        Confirm Bet
      </button>
    </div>
  );
}