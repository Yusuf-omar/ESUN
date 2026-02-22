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

const ADMIN_CONFIG_ERROR = {
  message:
    "Supabase admin client is not configured. Set SUPABASE_SERVICE_ROLE_KEY in environment variables.",
};

function createSelectQueryFallback() {
  const response = Promise.resolve({
    data: [],
    count: 0,
    error: ADMIN_CONFIG_ERROR,
  });

  const chain = {
    eq: () => chain,
    neq: () => chain,
    gt: () => chain,
    gte: () => chain,
    lt: () => chain,
    lte: () => chain,
    in: () => chain,
    order: () => chain,
    limit: () => chain,
    single: () => Promise.resolve({ data: null, error: ADMIN_CONFIG_ERROR }),
    maybeSingle: () => Promise.resolve({ data: null, error: ADMIN_CONFIG_ERROR }),
    then: response.then.bind(response),
    catch: response.catch.bind(response),
    finally: response.finally.bind(response),
  };

  return chain;
}

function createMutationQueryFallback() {
  const response = Promise.resolve({
    data: null,
    error: ADMIN_CONFIG_ERROR,
  });

  return {
    eq: () => response,
    neq: () => response,
    gt: () => response,
    gte: () => response,
    lt: () => response,
    lte: () => response,
    in: () => response,
    then: response.then.bind(response),
    catch: response.catch.bind(response),
    finally: response.finally.bind(response),
  };
}

function createPlaceholderAdminClient() {
  return {
    from: () => ({
      select: () => createSelectQueryFallback(),
      update: () => createMutationQueryFallback(),
      delete: () => createMutationQueryFallback(),
      insert: () => Promise.resolve({ data: null, error: ADMIN_CONFIG_ERROR }),
    }),
    auth: {
      admin: {
        deleteUser: async () => ({ data: null, error: ADMIN_CONFIG_ERROR }),
      },
    },
  };
}
