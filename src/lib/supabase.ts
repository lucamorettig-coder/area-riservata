import { createClient, SupabaseClient } from '@supabase/supabase-js';

/* ------------------------------------------------------------------
   ENV STATICI (OBBLIGATORIO PER ASTRO / VITE SSR)
   ------------------------------------------------------------------ */

// ⚠️ ACCESSO STATICO: MAI dinamico
const SUPABASE_URL =
  process.env.SUPABASE_URL ?? import.meta.env.SUPABASE_URL;

const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ?? import.meta.env.SUPABASE_ANON_KEY;

/* ------------------------------------------------------------------
   VALIDAZIONE
   ------------------------------------------------------------------ */

function assertCredentials(url?: string, key?: string) {
  if (!url || !key) {
    throw new Error(
      '❌ Supabase credentials missing. Set SUPABASE_URL and SUPABASE_ANON_KEY in Environment Variables.'
    );
  }
}

/* ------------------------------------------------------------------
   SERVER / API CLIENT (Astro.locals.runtime per Cloudflare)
   ------------------------------------------------------------------ */

export function createSupabaseClient(locals?: any): SupabaseClient {
  // Cloudflare Workers runtime (precedenza MASSIMA)
  const runtimeEnv = locals?.runtime?.env;

  const url =
    runtimeEnv?.SUPABASE_URL ??
    SUPABASE_URL;

  const key =
    runtimeEnv?.SUPABASE_ANON_KEY ??
    SUPABASE_ANON_KEY;

  assertCredentials(url, key);

  return createClient(url!, key!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  });
}

/* ------------------------------------------------------------------
   LEGACY / FALLBACK (se serve davvero)
   ------------------------------------------------------------------ */

export function getSupabaseClient(runtime?: any): SupabaseClient | null {
  try {
    const url =
      runtime?.env?.SUPABASE_URL ??
      SUPABASE_URL;

    const key =
      runtime?.env?.SUPABASE_ANON_KEY ??
      SUPABASE_ANON_KEY;

    assertCredentials(url, key);

    return createClient(url!, key!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    });
  } catch (err) {
    console.error('❌ Error creating Supabase client:', err);
    return null;
  }
}

/* ------------------------------------------------------------------
   DEFAULT CLIENT (BUILD / SIMPLE USAGE)
   ------------------------------------------------------------------ */

assertCredentials(SUPABASE_URL, SUPABASE_ANON_KEY);

export const supabase: SupabaseClient = createClient(
  SUPABASE_URL!,
  SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  }
);