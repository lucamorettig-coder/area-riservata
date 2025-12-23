import type { APIRoute } from 'astro';
import { getAirtableClient } from '../../lib/airtable';
import { getSupabaseClient } from '../../lib/supabase';
import { createSession } from '../../lib/auth';

interface LoginRequest {
  email: string;
  password: string;
}

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  try {
    const body = await request.json() as LoginRequest;
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email e password richieste' }), 
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Ottieni client Supabase
    const supabase = getSupabaseClient(locals?.runtime);
    
    if (!supabase) {
      return new Response(
        JSON.stringify({ 
          error: 'Configurazione Supabase non disponibile. Configura SUPABASE_URL e SUPABASE_ANON_KEY nelle Environment Variables di Webflow.' 
        }), 
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Ottieni client Airtable
    const airtableClient = getAirtableClient(locals?.runtime);
    
    if (!airtableClient) {
      return new Response(
        JSON.stringify({ 
          error: 'Configurazione Airtable non disponibile. Configura AIRTABLE_BASE_ID e AIRTABLE_TOKEN nelle Environment Variables di Webflow.' 
        }), 
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 1. Verifica le credenziali su Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      console.error('Errore Supabase Auth:', authError);
      return new Response(
        JSON.stringify({ error: 'Email o password non corrette' }), 
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 2. Recupera i dati completi da Airtable usando l'email
    // (potremmo anche cercare per AUTH_USER_ID se configurato il campo)
    const genitore = await airtableClient.findGenitoreByEmail(email);
    
    if (!genitore) {
      return new Response(
        JSON.stringify({ error: 'Dati utente non trovati. Contatta il supporto.' }), 
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 3. Crea sessione con i dati di Airtable
    createSession(cookies, {
      genitoreId: genitore.id!,
      email: genitore.fields.EMAIL_GENITORE,
    });

    return new Response(
      JSON.stringify({ success: true }), 
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Errore login:', error);
    return new Response(
      JSON.stringify({ error: 'Errore durante il login' }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
