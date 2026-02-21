const PUBLIC_URL_PLACEHOLDER = "your-project.supabase.co";
const PUBLIC_ANON_PLACEHOLDER = "your-anon-key";
const SERVICE_ROLE_PLACEHOLDER = "your-service-role-key";

type PublicSupabaseConfig = {
  url: string;
  anonKey: string;
};

function normalize(value: string | undefined) {
  return value?.trim() ?? "";
}

function isPlaceholderUrl(value: string) {
  return value.includes(PUBLIC_URL_PLACEHOLDER);
}

function isPlaceholderAnonKey(value: string) {
  return value === PUBLIC_ANON_PLACEHOLDER;
}

function isPlaceholderServiceRoleKey(value: string) {
  return value === SERVICE_ROLE_PLACEHOLDER;
}

export function getPublicSupabaseConfig(): PublicSupabaseConfig | null {
  const url = normalize(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = normalize(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!url || !anonKey) return null;
  if (isPlaceholderUrl(url) || isPlaceholderAnonKey(anonKey)) return null;

  return { url, anonKey };
}

export function hasPublicSupabaseConfig() {
  return getPublicSupabaseConfig() !== null;
}

export function getServiceRoleKey() {
  const key = normalize(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!key || isPlaceholderServiceRoleKey(key)) return null;
  return key;
}

