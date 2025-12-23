// API route per ottenere la tariffa attiva per un anno specifico
import type { APIRoute } from 'astro';
import { getAirtableClient } from '../../../lib/airtable';

export const GET: APIRoute = async (context) => {
  try {
    const url = new URL(context.request.url);
    const anno = url.searchParams.get('anno') || new Date().getFullYear().toString();
    
    console.log('[API] GET /api/tariffe/attiva - Anno:', anno);

    const client = getAirtableClient(context.locals?.runtime);
    if (!client) {
      return new Response(
        JSON.stringify({ error: 'Configurazione database non disponibile' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const tariffa = await client.getTariffaAttivaPerAnno(anno);
    
    if (!tariffa) {
      return new Response(
        JSON.stringify({ error: 'Nessuna tariffa attiva trovata per l\'anno ' + anno }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

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
