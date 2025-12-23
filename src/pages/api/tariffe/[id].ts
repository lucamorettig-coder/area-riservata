// API route per ottenere una tariffa specifica per ID
import type { APIRoute } from 'astro';
import { getAirtableClient } from '../../../lib/airtable';

export const GET: APIRoute = async (context) => {
  try {
    const { id } = context.params;
    console.log('[API] GET /api/tariffe/[id] - ID:', id);

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID tariffa mancante' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = getAirtableClient(context.locals?.runtime);
    if (!client) {
      return new Response(
        JSON.stringify({ error: 'Configurazione database non disponibile' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Usa il metodo request direttamente per ottenere una tariffa per ID
    // (non abbiamo un metodo getTariffaById nel client, quindi lo facciamo qui)
    const tariffa = await client['request'](`TABELLA_TARIFFE/${id}`);
    
    if (!tariffa) {
      return new Response(
        JSON.stringify({ error: 'Tariffa non trovata' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ tariffa }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API] Error in GET /api/tariffe/[id]:', error);
    return new Response(
      JSON.stringify({ error: 'Errore nel recupero della tariffa' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
