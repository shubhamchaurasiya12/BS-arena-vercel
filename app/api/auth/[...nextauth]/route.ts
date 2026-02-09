// app/api/auth/[...nextauth]/route.ts

import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { supabase } from "@/lib/supabase";

// ================= NEXTAUTH OPTIONS =================
export const authOptions: NextAuthOptions = {
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

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    /**
     * Runs on every login (OAuth)
     * - Creates user on first login
     * - Grants welcome bonus exactly once
     */
    async signIn({ user }) {
      if (!user?.email) return false;

      const { data: existingUser, error } = await supabase
        .from("users")
        .select("id, has_received_welcome_bonus")
        .eq("email", user.email)
        .maybeSingle();

      if (error) {
        console.error("SignIn DB lookup error:", error);
        return false;
      }

      // 🆕 First-time OAuth login
      if (!existingUser) {
        const { error: insertError } = await supabase.from("users").insert({
          id: crypto.randomUUID(),
          name: user.name ?? "User",
          email: user.email,
          total_points: 100,                // 🎁 Welcome bonus
          active_subject_count: 0,
          has_received_welcome_bonus: true, // 🛡 Guard
        });

        if (insertError) {
          console.error("User insert error:", insertError);
          return false;
        }

        return true;
      }

      // 🛡 Safety net: user exists but bonus not applied (migration case)
      if (!existingUser.has_received_welcome_bonus) {
        const { error: updateError } = await supabase
          .from("users")
          .update({
            total_points: 100,
            has_received_welcome_bonus: true,
          })
          .eq("id", existingUser.id);

        if (updateError) {
          console.error("Welcome bonus update error:", updateError);
          return false;
        }
      }

      return true;
    },

    /**
     * Attach DB user info to session
     */
    async session({ session }) {
      if (!session.user?.email) return session;

      const { data, error } = await supabase
        .from("users")
        .select("id, total_points, active_subject_count")
        .eq("email", session.user.email)
        .maybeSingle();

      if (!error && data) {
        session.user.id = data.id;
        session.user.total_points = data.total_points;
        session.user.active_subject_count = data.active_subject_count;
      }

      return session;
    },
  },
};

// ================= NEXTAUTH HANDLER =================
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
