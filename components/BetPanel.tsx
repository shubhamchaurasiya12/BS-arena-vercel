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
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-3">
        Place Your Bet
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        Available Points:{" "}
        <strong>{user?.total_points ?? 0}</strong>
      </p>

      <input
        type="number"
        min={1}
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        placeholder="Enter bet amount"
        className="w-full border rounded px-3 py-2 mb-4"
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
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full"
      >
        Confirm Bet
      </button>
    </div>
  );
}
