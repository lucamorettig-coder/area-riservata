import type { APIRoute } from 'astro';
import { createSupabaseClient } from '../../lib/supabase';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { email } = await request.json();

    // Validazione email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Inserisci un\'email valida' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Crea il client Supabase
    const supabase = createSupabaseClient(locals);

    // Ottieni l'origin dell'app
    const appOrigin = locals?.runtime?.env?.APP_ORIGIN || import.meta.env.APP_ORIGIN || 'http://localhost:4321';
    
    // Costruisci l'URL di redirect per la pagina di reset
    const redirectTo = `${appOrigin}/reset-password`;

    console.log('[Reset Password Request] Sending reset email to:', email);
    console.log('[Reset Password Request] Redirect URL:', redirectTo);

    // Invia l'email di reset tramite Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      console.error('[Reset Password Request] Supabase error:', error);
      // Non esporre dettagli specifici per motivi di sicurezza
      return new Response(
        JSON.stringify({ error: 'Impossibile inviare l\'email di recupero, riprova.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[Reset Password Request] Reset email sent successfully');

    // Restituisci sempre un messaggio neutro (anti-enumeration)
    return new Response(
      JSON.stringify({ 
        message: 'Se l\'email è registrata, riceverai un link per reimpostare la password.' 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Reset Password Request] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Errore interno del server' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
