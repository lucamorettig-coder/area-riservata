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
    const { maglia, pantaloncino, tuta } = body;

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

    console.log('[API] Saving taglie per iscrizione:', iscrizioneId);

    // Prepara i campi da aggiornare (solo quelli forniti)
    const updates: any = {};
    if (maglia !== undefined) updates.TAGLIA_MAGLIA = maglia || undefined;
    if (pantaloncino !== undefined) updates.TAGLIA_PANTALONCINO = pantaloncino || undefined;
    if (tuta !== undefined) updates.TAGLIA_TUTA = tuta || undefined;

    // Aggiorna iscrizione con le taglie - PASSA ANCHE genitoreId
    const updatedIscrizione = await client.updateIscrizione(
      iscrizioneId,
      genitore.id!,
      updates
    );

    console.log('[API] Taglie salvate con successo');

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
    console.error('[API] Errore salvataggio taglie:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Errore durante il salvataggio delle taglie',
      }),
      { status: 500 }
    );
  }
};
