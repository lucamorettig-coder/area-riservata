import type { APIRoute } from 'astro';
import { getGenitoreFromSession } from '../../../../lib/auth';
import { getAirtableClient } from '../../../../lib/airtable';

export const POST: APIRoute = async (context) => {
  try {
    // Verifica autenticazione
    const genitore = await getGenitoreFromSession(context);
    if (!genitore) {
      return new Response(JSON.stringify({ error: 'Non autenticato' }), { status: 401 });
    }

    const iscrizioneId = context.params.id;
    if (!iscrizioneId) {
      return new Response(JSON.stringify({ error: 'ID iscrizione mancante' }), { status: 400 });
    }

    // Parse request body
    const body = await context.request.json();
    const { privacyAccettata } = body;

    if (typeof privacyAccettata !== 'boolean') {
      return new Response(JSON.stringify({ error: 'Valore privacy non valido' }), { status: 400 });
    }

    const client = getAirtableClient(context.locals?.runtime);
    if (!client) {
      return new Response(JSON.stringify({ error: 'Configurazione Airtable mancante' }), { status: 500 });
    }

    // Verifica che l'iscrizione appartenga al genitore
    const iscrizione = await client.getIscrizioneById(iscrizioneId, genitore.id!);
    if (!iscrizione) {
      return new Response(JSON.stringify({ error: 'Iscrizione non trovata' }), { status: 404 });
    }

    // Verifica che il bambino dell'iscrizione appartenga al genitore
    const bambinoId = iscrizione.fields.TABELLA_BAMBINI?.[0];
    if (!bambinoId) {
      return new Response(JSON.stringify({ error: 'Bambino non trovato per questa iscrizione' }), { status: 404 });
    }

    const bambino = await client.getBambinoById(bambinoId, genitore.id!);
    if (!bambino) {
      return new Response(JSON.stringify({ error: 'Non autorizzato' }), { status: 403 });
    }

    console.log('[API] Saving privacy per iscrizione:', iscrizioneId);

    // Aggiorna iscrizione con privacy - SOLO il campo PRIVACY_MINORE
    const updatedIscrizione = await client.updateIscrizione(
      iscrizioneId, 
      genitore.id!,
      {
        PRIVACY_MINORE: privacyAccettata,
      }
    );

    console.log('[API] Privacy salvata con successo');

    return new Response(
      JSON.stringify({
        success: true,
        iscrizione: updatedIscrizione,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('[API] Errore salvataggio privacy:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Errore durante il salvataggio della privacy',
      }),
      { status: 500 }
    );
  }
};
