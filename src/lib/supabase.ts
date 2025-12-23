import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Ottiene le credenziali Supabase da diverse fonti
 * Supporta sia l'ambiente di sviluppo che Cloudflare Workers
 */
function getSupabaseCredentials(runtime?: any): { url: string; key: string } | null {
  let supabaseUrl: string | undefined;
  let supabaseAnonKey: string | undefined;

  // Prova in ordine di priorità:
  // 1. process.env (Node.js/build time)
  if (typeof process !== 'undefined' && process.env) {
    supabaseUrl = process.env.SUPABASE_URL;
    supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  }

  // 2. import.meta.env (Astro/Vite)
  if (!supabaseUrl) {
    supabaseUrl = (import.meta as any)?.env?.SUPABASE_URL;
  }
  if (!supabaseAnonKey) {
    supabaseAnonKey = (import.meta as any)?.env?.SUPABASE_ANON_KEY;
  }

  // 3. runtime.env (Cloudflare Workers)
  if (!supabaseUrl && runtime?.env) {
    supabaseUrl = runtime.env.SUPABASE_URL;
  }
  if (!supabaseAnonKey && runtime?.env) {
    supabaseAnonKey = runtime.env.SUPABASE_ANON_KEY;
  }

  // 4. runtime direttamente (alcune configurazioni Cloudflare)
  if (!supabaseUrl && runtime?.SUPABASE_URL) {
    supabaseUrl = runtime.SUPABASE_URL;
  }
  if (!supabaseAnonKey && runtime?.SUPABASE_ANON_KEY) {
    supabaseAnonKey = runtime.SUPABASE_ANON_KEY;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase credentials not found');
    console.error('Missing:', {
      supabaseUrl: !supabaseUrl,
      supabaseAnonKey: !supabaseAnonKey
    });
    return null;
  }

  return { url: supabaseUrl, key: supabaseAnonKey };
}

/**
 * Crea un client Supabase con le credenziali appropriate
 * Supporta sia l'ambiente di sviluppo che Cloudflare Workers
 * 
 * @param locals - Astro.locals object contenente runtime environment
 * @returns SupabaseClient instance
 * @throws Error se le credenziali non sono configurate
 */
export function createSupabaseClient(locals?: any): SupabaseClient {
  const runtime = locals?.runtime;
  const credentials = getSupabaseCredentials(runtime);
  
  if (!credentials) {
    throw new Error('Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
  }

  const client = createClient(credentials.url, credentials.key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce', // Recommended for better security
    },
  });
  
  return client;
}

/**
 * Crea un client Supabase con le credenziali appropriate (legacy)
 * Supporta sia l'ambiente di sviluppo che Cloudflare Workers
 * 
 * @param runtime - Runtime environment da Astro.locals (opzionale)
 * @returns SupabaseClient instance o null se le credenziali non sono configurate
 */
export function getSupabaseClient(runtime?: any): SupabaseClient | null {
  const credentials = getSupabaseCredentials(runtime);
  
  if (!credentials) {
    return null;
  }

  try {
    const client = createClient(credentials.url, credentials.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    });
    return client;
  } catch (error) {
    console.error('❌ Error creating Supabase client:', error);
    return null;
  }
}

/**
 * Client Supabase per uso diretto (build time)
 * Questo viene esportato per compatibilità, ma è preferibile usare createSupabaseClient(locals)
 */
const supabaseUrl =
  process.env.SUPABASE_URL ??
  (import.meta as any)?.env?.SUPABASE_URL;

const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ??
  (import.meta as any)?.env?.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.warn('⚠️ SUPABASE_URL not found at build time. Make sure it is configured in Environment Variables.');
}
if (!supabaseAnonKey) {
  console.warn('⚠️ SUPABASE_ANON_KEY not found at build time. Make sure it is configured in Environment Variables.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : null;

// Per TypeScript: assicuriamoci che supabase non sia null quando viene usato
if (!supabase) {
  console.error('❌ Failed to create default Supabase client. Use createSupabaseClient(locals) instead.');
}
