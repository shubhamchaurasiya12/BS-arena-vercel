// types/next-auth.d.ts
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id:                   string;
      name:                 string;
      email:                string;
      image?:               string | null;
      total_points:         number;
      active_subject_count: number;
      role:                 string;
    };
  }

  interface User {
    id:                   string;
    total_points?:        number;
    active_subject_count?: number;
    role?:                string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id:                   string;
    total_points:         number;
    active_subject_count: number;
    role:                 string;
  }
}