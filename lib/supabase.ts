// D:\BS-arena-NextJS\lib\supabase.ts

import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client
 * Uses SERVICE ROLE KEY — never import in client components
 */

const supabaseUrl = process.env.SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Supabase environment variables are not set");
}

export const supabase = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      persistSession: false,
    },
  }
);
