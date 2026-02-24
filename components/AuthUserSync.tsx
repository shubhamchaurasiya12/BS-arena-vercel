//D:\BS-arena-NextJS\components\AuthUserSync.tsx
"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

type User = {
  id: string;
  name: string;
  email: string;
  total_points: number;
  active_subject_count: number;
};

export default function AuthUserSync({ user }: { user: User }) {
  const { setUser } = useAuth();

  useEffect(() => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  }, [user, setUser]);

  return null; // no UI
}