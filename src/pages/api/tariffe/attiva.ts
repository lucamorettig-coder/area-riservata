// API route per ottenere la tariffa attiva per l'anno corrente
import type { APIRoute } from 'astro';
import { getAirtableClient } from '../../../lib/airtable';

/**
 * GET: Ottieni la tariffa attiva per l'anno corrente
 * Query param opzionale: anno (default: anno corrente)
 */
export const GET: APIRoute = async (context) => {
  try {
    // L'anno può essere passato come query param per test, ma di default usa l'anno corrente
    const url = new URL(context.request.url);
    const anno = url.searchParams.get('anno') || new Date().getFullYear().toString();
    
    console.log('[API] GET /api/tariffe/attiva - Anno richiesto:', anno);

    const client = getAirtableClient(context.locals?.runtime);
    if (!client) {
      return new Response(
        JSON.stringify({ error: 'Configurazione database non disponibile' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // REGOLA BUSINESS: Usa sempre l'anno corrente per la tariffa attiva
    const tariffa = await client.getTariffaAttivaAnnoCorrente();
    
    if (!tariffa) {
      console.warn('[API] No active tariffa found for current year');
      return new Response(
        JSON.stringify({ error: 'Nessuna tariffa attiva disponibile per l\'anno corrente' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[API] Found active tariffa:', tariffa.id, 'for year:', tariffa.fields.ANNO_ISCRIZIONE);

    return new Response(JSON.stringify({ tariffa }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API] Error in GET /api/tariffe/attiva:', error);
    return new Response(
      JSON.stringify({ error: 'Errore nel recupero della tariffa' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
