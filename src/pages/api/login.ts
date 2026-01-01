import type { APIRoute } from 'astro';
import { getAirtableClient } from '../../lib/airtable';
import { createSupabaseClient } from '../../lib/supabase';
import { createSession } from '../../lib/auth';

interface LoginRequest {
  email: string;
  password: string;
}

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  console.log('➡️ /api/login called');

  try {
    // --------------------------------------------------
    // 1. Parse & validate body
    // --------------------------------------------------
    let body: LoginRequest;

    try {
      body = (await request.json()) as LoginRequest;
    } catch {
      return new Response(
        JSON.stringify({ error: 'Body JSON non valido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email e password richieste' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('🔐 Login attempt for:', email);

    // --------------------------------------------------
    // 2. Supabase Auth (SERVER SIDE)
    // --------------------------------------------------
    const supabase = createSupabaseClient(locals);

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData?.user) {
      console.error('❌ Supabase signIn error:', authError);
      return new Response(
        JSON.stringify({ error: authError?.message ?? 'Credenziali non valide' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Supabase auth OK, user id:', authData.user.id);

    // --------------------------------------------------
    // 3. Airtable lookup
    // --------------------------------------------------
    const airtableClient = getAirtableClient(locals?.runtime);

    if (!airtableClient) {
      console.error('❌ Airtable client not configured');
      return new Response(
        JSON.stringify({
          error:
            'Configurazione Airtable non disponibile. Contatta il supporto.',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const genitore = await airtableClient.findGenitoreByEmail(email);

    if (!genitore) {
      console.error('❌ Airtable user not found for email:', email);
      return new Response(
        JSON.stringify({
          error: 'Dati utente non trovati. Contatta il supporto.',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // --------------------------------------------------
    // 4. Create session
    // --------------------------------------------------
    createSession(cookies, {
      genitoreId: genitore.id!,
      email: genitore.fields.EMAIL_GENITORE,
    });

    console.log('🍪 Session created for:', email);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('❌ Login handler exception:', err);

    return new Response(
      JSON.stringify({
        error: err?.message ?? 'Errore interno durante il login',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};