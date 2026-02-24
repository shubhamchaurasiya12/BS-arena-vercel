// D:\BS-arena-NextJS\context\PomodoroContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

type Mode = "SHORT" | "LONG";

type PomodoroSession = {
  id: string;
  start_time: string;
  duration: number;
  mode: Mode;
};

type PomodoroContextType = {
  session: PomodoroSession | null;
  remainingTime: number;
  isBreak: boolean;
  isPaused: boolean;
  start: (mode: Mode) => Promise<void>;
  pause: () => void;
  resume: () => void;
  reset: () => Promise<void>;
  invalidate: () => Promise<void>;
};

const PomodoroContext = createContext<PomodoroContextType | undefined>(
  undefined
);

export const PomodoroProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<PomodoroSession | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pausedRemainingRef = useRef<number>(0);

  /* ================= FETCH ACTIVE ================= */

  useEffect(() => {
    const fetchActive = async () => {
      const res = await fetch("/api/pomodoro/active");
      const data = await res.json();

      if (data) {
        setSession({
          id: data.id,
          start_time: data.start_time,
          duration: data.duration,
          mode: data.mode,
        });
      }
    };

    fetchActive();
  }, []);

  /* ================= TIMER ENGINE ================= */

  useEffect(() => {
    if (!session || isPaused) return;

    const calculateRemaining = () => {
      const start = new Date(session.start_time).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);
      const remaining = session.duration - elapsed;

      if (remaining <= 0) {
        clearInterval(intervalRef.current!);
        handleSessionEnd();
      } else {
        setRemainingTime(remaining);
      }
    };

    calculateRemaining();
    intervalRef.current = setInterval(calculateRemaining, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session, isPaused]);

  /* ================= HANDLE SESSION END ================= */

  const handleSessionEnd = async () => {
    if (!session) return;

    setRemainingTime(0);

    if (isBreak) {
      // End break cleanly
      setSession(null);
      setIsBreak(false);
      setIsPaused(false);
      return;
    }

    // Complete focus
    await fetch("/api/pomodoro/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: session.id }),
    });

    // Start break
    const breakDuration = session.mode === "SHORT" ? 300 : 600;

    setIsBreak(true);
    setIsPaused(false);
    setSession({
      id: "break",
      start_time: new Date().toISOString(),
      duration: breakDuration,
      mode: session.mode,
    });
  };

  /* ================= TAB TITLE ================= */

  useEffect(() => {
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    };

    if (!session) {
      document.title = "Pomodoro | BS Arena";
      return;
    }

    if (remainingTime > 0) {
      document.title = `(${formatTime(remainingTime)}) ${
        isBreak ? "Break" : "Focus"
      }`;
    }
  }, [remainingTime, session, isBreak]);

  /* ================= PREVENT REFRESH ================= */

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!session || session.id === "break") return;

      e.preventDefault();
      e.returnValue = "";

      navigator.sendBeacon(
        "/api/pomodoro/invalidate",
        JSON.stringify({ sessionId: session.id })
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [session]);

  /* ================= ACTIONS ================= */

  const start = async (mode: Mode) => {
    if (session) return;

    const res = await fetch("/api/pomodoro/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode }),
    });

    const data = await res.json();

    setIsPaused(false);
    setIsBreak(false);

    setSession({
      id: data.sessionId,
      start_time: data.startTime,
      duration: data.duration,
      mode: data.mode,
    });
  };

  const pause = () => {
    if (!session) return;
    setIsPaused(true);
    pausedRemainingRef.current = remainingTime;
    clearInterval(intervalRef.current!);
  };

  const resume = () => {
    if (!session) return;

    const newStart = new Date(
      Date.now() - (session.duration - pausedRemainingRef.current) * 1000
    ).toISOString();

    setSession({
      ...session,
      start_time: newStart,
    });

    setIsPaused(false);
  };

  const reset = async () => {
    if (!session || session.id === "break") return;
    await invalidate();
  };

  const invalidate = async () => {
    if (!session || session.id === "break") return;

    await fetch("/api/pomodoro/invalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: session.id }),
    });

    setSession(null);
    setIsBreak(false);
    setIsPaused(false);
    setRemainingTime(0);
  };

  return (
    <PomodoroContext.Provider
      value={{
        session,
        remainingTime,
        isBreak,
        isPaused,
        start,
        pause,
        resume,
        reset,
        invalidate,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error("usePomodoro must be used inside PomodoroProvider");
  }
  return context;
};
