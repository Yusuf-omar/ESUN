import { createBrowserClient } from "@supabase/ssr";
import { getPublicSupabaseConfig } from "./env";

export function createClient() {
  const config = getPublicSupabaseConfig();
  if (!config) {
    return createPlaceholderClient() as ReturnType<typeof createBrowserClient>;
  }
  return createBrowserClient(config.url, config.anonKey);
}

function createPlaceholderClient() {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      signOut: () => Promise.resolve({ error: null }),
      signInWithPassword: () =>
        Promise.resolve({
          error: { message: "Supabase not configured. Add .env.local with Supabase URL and anon key." },
        }),
      signUp: () =>
        Promise.resolve({
          error: { message: "Supabase not configured. Add .env.local with Supabase URL and anon key." },
        }),
    },
  };
}
