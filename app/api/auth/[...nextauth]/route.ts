// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { supabase } from "@/lib/supabase";

// ✅ NextAuth Config
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // ✅ Runs when user logs in
    async signIn({ user }: any) {
      if (!user?.email) return false;

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.email)
        .single();

      // Create user if not exists
      if (!data) {
        await supabase.from("users").insert({
          id: crypto.randomUUID(),
          name: user.name,
          email: user.email,
          total_points: 0,
          active_subject_count: 0,
        });
      }

      return true;
    },

    // ✅ Attach DB user info to session
    async session({ session }: any) {
      if (!session?.user?.email) return session;

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("email", session.user.email)
        .single();

      if (data) {
        session.user.id = data.id;
        session.user.total_points = data.total_points;
        session.user.active_subject_count = data.active_subject_count;
      }

      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },
};

// ✅ NextAuth Handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };