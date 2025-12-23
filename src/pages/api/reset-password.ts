import type { APIRoute } from 'astro';
import { createSupabaseClient } from '../../lib/supabase';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { password } = await request.json();

    // Validazione password
    if (!password || typeof password !== 'string' || password.length < 8) {
      return new Response(
        JSON.stringify({ error: 'La password deve contenere almeno 8 caratteri' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Crea il client Supabase
    const supabase = createSupabaseClient(locals);

    console.log('[Reset Password] Attempting to update password');

    // Aggiorna la password dell'utente autenticato
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error('[Reset Password] Supabase error:', error);
      return new Response(
        JSON.stringify({ error: 'Impossibile aggiornare la password. Riprova.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!data.user) {
      return new Response(
        JSON.stringify({ error: 'Sessione non valida. Richiedi un nuovo link di reset.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[Reset Password] Password updated successfully for user:', data.user.id);

    return new Response(
      JSON.stringify({ message: 'Password aggiornata correttamente' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Reset Password] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Errore interno del server' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
