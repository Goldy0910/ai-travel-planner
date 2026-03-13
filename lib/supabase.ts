import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Beginner-friendly helpers.
 * - `supabaseBrowser()` for client components
 * - `supabaseServer()` for server components / route handlers
 */
export const supabaseBrowser = createSupabaseBrowserClient;
export const supabaseServer = createSupabaseServerClient;

