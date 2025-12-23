import type { APIRoute } from 'astro';
import { getAirtableClient } from '../../lib/airtable';
import { getGenitoreFromSession } from '../../lib/auth';

export const GET: APIRoute = async (context) => {
  try {
    const genitore = await getGenitoreFromSession(context);
    
    if (!genitore) {
      return new Response(JSON.stringify({ error: 'Non autenticato' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const client = getAirtableClient(context.locals?.runtime);
    if (!client) {
      return new Response(JSON.stringify({ error: 'Client non disponibile' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const iscrizioni = await client.getIscrizioniByGenitore(genitore.id!);
    
    // Restituisci tutto in formato leggibile
    return new Response(JSON.stringify({
      count: iscrizioni.length,
      iscrizioni: iscrizioni.map(i => ({
        id: i.id,
        fields: i.fields,
        // Mostra tutti i campi per debug
        allFields: Object.keys(i.fields)
      }))
    }, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[DEBUG] Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Errore',
      stack: error instanceof Error ? error.stack : undefined
    }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
