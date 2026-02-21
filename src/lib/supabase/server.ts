import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicSupabaseConfig } from "./env";

export async function createClient() {
  const config = getPublicSupabaseConfig();
  if (!config) {
    return createPlaceholderServerClient();
  }
  const cookieStore = await cookies();
  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignore in Server Components
        }
      },
    },
  });
}

async function createPlaceholderServerClient() {
  const emptySelect = () => ({
    eq: () => ({
      single: () => Promise.resolve({ data: null, error: { message: "Not configured" } }),
      order: () => Promise.resolve({ data: [], error: null }),
    }),
  });
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getClaims: () => Promise.resolve({ data: { claims: null }, error: null }),
      exchangeCodeForSession: () =>
        Promise.resolve({ error: { message: "Supabase not configured" } }),
    },
    from: () => ({
      select: () => emptySelect(),
      insert: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
    }),
  } as Awaited<ReturnType<typeof createServerClient>>;
}
