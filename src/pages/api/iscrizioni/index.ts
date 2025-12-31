// API route per gestire le iscrizioni del genitore autenticato
import type { APIRoute } from 'astro';
import { getAirtableClient, type Iscrizione } from '../../../lib/airtable';
import { getGenitoreFromSession } from '../../../lib/auth';

// GET: ottieni tutte le iscrizioni del genitore (o di un bambino specifico)
export const GET: APIRoute = async (context) => {
  try {
    console.log('[API] GET /api/iscrizioni - Start');
    
    const genitore = await getGenitoreFromSession(context);

    if (!genitore) {
      console.log('[API] Genitore not authenticated');
      return new Response(JSON.stringify({ error: 'Non autenticato' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('[API] Genitore authenticated:', genitore.id);

    const client = getAirtableClient(context.locals?.runtime);
    if (!client) {
      console.error('[API] Airtable client not available');
      return new Response(
        JSON.stringify({ error: 'Configurazione database non disponibile' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Controlla se è richiesto un bambino specifico
    const url = new URL(context.request.url);
    const bambinoId = url.searchParams.get('bambinoId');

    let iscrizioni: Iscrizione[];
    if (bambinoId) {
      console.log('[API] Fetching iscrizioni for bambino:', bambinoId);
      iscrizioni = await client.getIscrizioniByBambino(bambinoId, genitore.id!);
    } else {
      console.log('[API] Fetching all iscrizioni for genitore');
      iscrizioni = await client.getIscrizioniByGenitore(genitore.id!);
    }
    
    console.log('[API] Successfully fetched', iscrizioni.length, 'iscrizioni');

    // Restituisci i dati grezzi da Airtable senza normalizzazione
    return new Response(JSON.stringify({ iscrizioni }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API] Error in GET /api/iscrizioni:', error);
    const errorMessage = error instanceof Error ? error.message : 'Errore nel recupero delle iscrizioni';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST: crea una nuova iscrizione
export const POST: APIRoute = async (context) => {
  try {
    console.log('[API] POST /api/iscrizioni - Start');
    
    const genitore = await getGenitoreFromSession(context);

    if (!genitore) {
      return new Response(JSON.stringify({ error: 'Non autenticato' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('[API] Genitore authenticated:', genitore.id);

    const client = getAirtableClient(context.locals?.runtime);
    if (!client) {
      return new Response(
        JSON.stringify({ error: 'Configurazione database non disponibile' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body: any = await context.request.json();
    console.log('[API] Received body:', Object.keys(body));

    // Validazione campo obbligatorio: solo bambinoId
    if (!body.bambinoId) {
      return new Response(
        JSON.stringify({ error: 'Bambino obbligatorio' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verifica che il bambino appartenga al genitore
    const bambino = await client.getBambinoById(body.bambinoId, genitore.id!);
    if (!bambino) {
      return new Response(
        JSON.stringify({ error: 'Bambino non trovato o non autorizzato' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // REGOLA BUSINESS: Ogni bambino può avere UNA SOLA iscrizione
    const iscrizioneEsistente = await client.checkIscrizioneEsistente(
      body.bambinoId,
      genitore.id!
    );

    if (iscrizioneEsistente) {
      return new Response(
        JSON.stringify({ error: 'Esiste già un\'iscrizione per questo bambino' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Ottieni la tariffa attiva per l'anno corrente
    const tariffa = await client.getTariffaAttivaAnnoCorrente();
    if (!tariffa) {
      return new Response(
        JSON.stringify({ error: 'Nessuna tariffa attiva disponibile per l\'anno corrente' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[API] Using tariffa:', tariffa.id, 'for year:', tariffa.fields.ANNO_ISCRIZIONE);

    // Crea l'iscrizione con la tariffa dell'anno corrente
    const iscrizioneData = {
      TABELLA_GENITORI: [genitore.id!],
      TABELLA_BAMBINI: [body.bambinoId],
      TABELLA_TARIFFE: [tariffa.id!],
    };

    console.log('[API] Creating iscrizione...');
    const iscrizione = await client.createIscrizione(iscrizioneData);
    console.log('[API] Iscrizione created successfully:', iscrizione.id);

    return new Response(JSON.stringify({ success: true, iscrizione }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API] Error in POST /api/iscrizioni:', error);
    const errorMessage = error instanceof Error ? error.message : 'Errore nella creazione dell\'iscrizione';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
