import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseConfig, getServiceRoleKey } from "./env";

export function createAdminClient() {
  const config = getPublicSupabaseConfig();
  const key = getServiceRoleKey();
  if (!config || !key) {
    return createPlaceholderAdminClient() as unknown as ReturnType<typeof createClient>;
  }
  return createClient(config.url, key);
}

function createPlaceholderAdminClient() {
  return {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
      }),
    }),
  };
}
