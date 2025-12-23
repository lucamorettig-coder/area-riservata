import type { APIRoute } from 'astro';
import { getGenitoreFromSession } from '../../../lib/auth';
import { getAirtableClient } from '../../../lib/airtable';

// GET: Ottieni i dettagli di un bambino
export const GET: APIRoute = async (context) => {
  try {
    console.log('[API] GET bambino - Start');
    
    // Verifica autenticazione
    const genitore = await getGenitoreFromSession(context);
    if (!genitore) {
      console.log('[API] GET bambino - Non autenticato');
      return new Response(JSON.stringify({ error: 'Non autenticato' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const bambinoId = context.params.id;
    console.log('[API] GET bambino - ID:', bambinoId);
    
    if (!bambinoId) {
      return new Response(JSON.stringify({ error: 'ID bambino mancante' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ottieni client Airtable
    const client = getAirtableClient(context.locals?.runtime);
    if (!client) {
      console.error('[API] GET bambino - Client Airtable non disponibile');
      return new Response(JSON.stringify({ error: 'Configurazione mancante' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Recupera il bambino
    console.log('[API] GET bambino - Fetching from Airtable...');
    const bambino = await client.getBambinoById(bambinoId, genitore.id!);
    
    if (!bambino) {
      console.log('[API] GET bambino - Non trovato');
      return new Response(JSON.stringify({ error: 'Bambino non trovato' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('[API] GET bambino - Success');
    return new Response(JSON.stringify(bambino), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API] GET bambino - Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Errore interno',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// PATCH: Aggiorna un bambino
export const PATCH: APIRoute = async (context) => {
  try {
    console.log('[API] PATCH bambino - Start');
    
    // Verifica autenticazione
    const genitore = await getGenitoreFromSession(context);
    if (!genitore) {
      console.log('[API] PATCH bambino - Non autenticato');
      return new Response(JSON.stringify({ error: 'Non autenticato' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('[API] PATCH bambino - Genitore ID:', genitore.id);

    const bambinoId = context.params.id;
    console.log('[API] PATCH bambino - Bambino ID:', bambinoId);
    
    if (!bambinoId) {
      return new Response(JSON.stringify({ error: 'ID bambino mancante' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse body
    let body;
    try {
      body = await context.request.json();
      console.log('[API] PATCH bambino - Body fields:', Object.keys(body));
    } catch (e) {
      console.error('[API] PATCH bambino - Invalid JSON:', e);
      return new Response(JSON.stringify({ error: 'Dati non validi' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ottieni client Airtable
    const client = getAirtableClient(context.locals?.runtime);
    if (!client) {
      console.error('[API] PATCH bambino - Client Airtable non disponibile');
      return new Response(JSON.stringify({ 
        error: 'Configurazione mancante',
        details: 'Airtable client non disponibile. Verifica le variabili d\'ambiente.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Aggiorna il bambino
    console.log('[API] PATCH bambino - Updating in Airtable...');
    const updated = await client.updateBambino(bambinoId, genitore.id!, body);
    
    if (!updated) {
      console.log('[API] PATCH bambino - Non trovato o non autorizzato');
      return new Response(JSON.stringify({ error: 'Bambino non trovato o non autorizzato' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('[API] PATCH bambino - Success');
    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API] PATCH bambino - Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('[API] PATCH bambino - Error details:', {
      message: errorMessage,
      stack: errorStack
    });
    
    return new Response(JSON.stringify({ 
      error: 'Errore durante l\'aggiornamento',
      details: errorMessage
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// POST: Gestisce anche DELETE tramite _method
export const POST: APIRoute = async (context) => {
  try {
    console.log('[API] POST bambino - Start');
    
    // Leggi il form data
    const formData = await context.request.formData();
    const method = formData.get('_method');

    console.log('[API] POST bambino - _method:', method);

    // Se è un DELETE mascherato da POST
    if (method === 'DELETE') {
      return await handleDelete(context);
    }

    return new Response(JSON.stringify({ error: 'Metodo non supportato' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API] POST bambino - Error:', error);
    return new Response(JSON.stringify({ error: 'Errore interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// DELETE: Elimina un bambino
export const DELETE: APIRoute = async (context) => {
  return await handleDelete(context);
};

// Funzione helper per gestire l'eliminazione
async function handleDelete(context: any) {
  try {
    console.log('[API] DELETE bambino - Start');
    
    // Verifica autenticazione
    const genitore = await getGenitoreFromSession(context);
    if (!genitore) {
      console.log('[API] DELETE bambino - Non autenticato');
      // Per form submissions, reindirizza invece di ritornare JSON
      return context.redirect('/login');
    }

    const bambinoId = context.params.id;
    console.log('[API] DELETE bambino - ID:', bambinoId);
    
    if (!bambinoId) {
      return context.redirect('/dashboard');
    }

    // Ottieni client Airtable
    const client = getAirtableClient(context.locals?.runtime);
    if (!client) {
      console.error('[API] DELETE bambino - Client Airtable non disponibile');
      return new Response(JSON.stringify({ error: 'Configurazione mancante' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Elimina il bambino
    console.log('[API] DELETE bambino - Deleting from Airtable...');
    const deleted = await client.deleteBambino(bambinoId, genitore.id!);
    
    if (!deleted) {
      console.log('[API] DELETE bambino - Non trovato o non autorizzato');
      return new Response(JSON.stringify({ error: 'Bambino non trovato o non autorizzato' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('[API] DELETE bambino - Success, redirecting...');
    // Per form submissions, reindirizza
    return context.redirect('/dashboard');
  } catch (error) {
    console.error('[API] DELETE bambino - Error:', error);
    return new Response(JSON.stringify({ error: 'Errore interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
