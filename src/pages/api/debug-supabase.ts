import type { APIRoute } from 'astro';
import { getSupabaseClient } from '../../lib/supabase';
import { getAirtableClient } from '../../lib/airtable';

export const GET: APIRoute = async ({ locals }) => {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      hasRuntime: !!locals?.runtime,
      hasRuntimeEnv: !!locals?.runtime?.env,
    },
    supabase: {
      url: undefined as string | undefined,
      anonKeyPresent: false,
      clientCreated: false,
      error: null as string | null,
    },
    airtable: {
      baseIdPresent: false,
      tokenPresent: false,
      clientCreated: false,
    }
  };

  // Check Supabase
  try {
    // Check env vars
    let supabaseUrl: string | undefined;
    let supabaseAnonKey: string | undefined;

    if (locals?.runtime?.env) {
      supabaseUrl = locals.runtime.env.SUPABASE_URL;
      supabaseAnonKey = locals.runtime.env.SUPABASE_ANON_KEY;
    }

    if (!supabaseUrl) {
      supabaseUrl = import.meta.env.SUPABASE_URL;
    }
    if (!supabaseAnonKey) {
      supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;
    }

    diagnostics.supabase.url = supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : undefined;
    diagnostics.supabase.anonKeyPresent = !!supabaseAnonKey;

    const supabaseClient = getSupabaseClient(locals?.runtime);
    diagnostics.supabase.clientCreated = !!supabaseClient;

    if (supabaseClient) {
      // Try a simple query to test connection
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) {
        diagnostics.supabase.error = error.message;
      }
    }
  } catch (error) {
    diagnostics.supabase.error = error instanceof Error ? error.message : 'Unknown error';
  }

  // Check Airtable
  try {
    let baseId: string | undefined;
    let token: string | undefined;

    if (locals?.runtime?.env) {
      baseId = locals.runtime.env.AIRTABLE_BASE_ID;
      token = locals.runtime.env.AIRTABLE_API_KEY || locals.runtime.env.AIRTABLE_TOKEN;
    }

    if (!baseId) {
      baseId = import.meta.env.AIRTABLE_BASE_ID;
    }
    if (!token) {
      token = import.meta.env.AIRTABLE_API_KEY || import.meta.env.AIRTABLE_TOKEN;
    }

    diagnostics.airtable.baseIdPresent = !!baseId;
    diagnostics.airtable.tokenPresent = !!token;

    const airtableClient = getAirtableClient(locals?.runtime);
    diagnostics.airtable.clientCreated = !!airtableClient;
  } catch (error) {
    // Airtable errors are already logged
  }

  return new Response(JSON.stringify(diagnostics, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
