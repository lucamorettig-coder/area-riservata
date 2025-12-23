// API route per gestire i bambini del genitore autenticato
import type { APIRoute } from 'astro';
import { getAirtableClient } from '../../../lib/airtable';
import { getGenitoreFromSession } from '../../../lib/auth';

// GET: ottieni tutti i bambini del genitore autenticato
export const GET: APIRoute = async (context) => {
  try {
    console.log('[API] GET /api/bambini - Start');
    
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

    console.log('[API] Fetching bambini from Airtable...');
    const bambini = await client.getBambiniByGenitore(genitore.id!);
    
    console.log('[API] Successfully fetched', bambini.length, 'bambini');

    // Fetch iscrizioni per ogni bambino
    console.log('[API] Fetching iscrizioni...');
    const iscrizioni = await client.getIscrizioniByGenitore(genitore.id!);
    console.log('[API] Successfully fetched', iscrizioni.length, 'iscrizioni');

    // Crea una mappa bambinoId -> iscrizione info
    const iscrizioniMap: Record<string, {
      hasIscrizioneCompleta: boolean;
      statoIscrizione?: string;
    }> = {};

    for (const iscrizione of iscrizioni) {
      const bambinoId = iscrizione.fields.TABELLA_BAMBINI?.[0];
      if (bambinoId) {
        const statoIscrizione = iscrizione.fields.STATO_ISCRIZIONE;
        const isCompleta = statoIscrizione?.toLowerCase().includes('completa');
        
        iscrizioniMap[bambinoId] = {
          hasIscrizioneCompleta: isCompleta || false,
          statoIscrizione: statoIscrizione,
        };
      }
    }

    return new Response(JSON.stringify({ bambini, iscrizioniMap }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API] Error in GET /api/bambini:', error);
    const errorMessage = error instanceof Error ? error.message : 'Errore nel recupero dei bambini';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: 'Verifica che la tabella TABELLA_BAMBINI esista in Airtable con tutti i campi necessari'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST: crea un nuovo bambino
export const POST: APIRoute = async (context) => {
  try {
    console.log('[API] POST /api/bambini - Start');
    
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

    // Validazione campi obbligatori
    const requiredFields = [
      'NOME_BAMBINO',
      'COGNOME_BAMBINO',
      'DATA_NASCITA_BAMBINO',
      'LUOGO_NASCITA_BAMBINO',
      'CODICE_FISCALE_BAMBINO',
      'VIA_RESIDENZA_BAMBINO',
      'CITTA_RESIDENZA_BAMBINO',
    ];

    const errors: Array<{ field: string; message: string }> = [];

    for (const field of requiredFields) {
      if (!body[field] || body[field].trim() === '') {
        const fieldLabels: Record<string, string> = {
          NOME_BAMBINO: 'Nome',
          COGNOME_BAMBINO: 'Cognome',
          DATA_NASCITA_BAMBINO: 'Data di nascita',
          LUOGO_NASCITA_BAMBINO: 'Luogo di nascita',
          CODICE_FISCALE_BAMBINO: 'Codice fiscale',
          VIA_RESIDENZA_BAMBINO: 'Indirizzo',
          CITTA_RESIDENZA_BAMBINO: 'Città',
        };
        errors.push({
          field,
          message: `${fieldLabels[field]} è obbligatorio`,
        });
      }
    }

    // Validazione codice fiscale
    if (body.CODICE_FISCALE_BAMBINO) {
      const cf = body.CODICE_FISCALE_BAMBINO.trim().toUpperCase();
      if (cf.length !== 16) {
        errors.push({
          field: 'CODICE_FISCALE_BAMBINO',
          message: 'Il codice fiscale deve essere di 16 caratteri',
        });
      }
      body.CODICE_FISCALE_BAMBINO = cf;
    }

    if (errors.length > 0) {
      console.log('[API] Validation errors:', errors);
      return new Response(JSON.stringify({ errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Aggiungi il collegamento al genitore usando il nome corretto del campo
    const bambinoData = {
      NOME_BAMBINO: body.NOME_BAMBINO.trim(),
      COGNOME_BAMBINO: body.COGNOME_BAMBINO.trim(),
      DATA_NASCITA_BAMBINO: body.DATA_NASCITA_BAMBINO,
      LUOGO_NASCITA_BAMBINO: body.LUOGO_NASCITA_BAMBINO.trim(),
      CODICE_FISCALE_BAMBINO: body.CODICE_FISCALE_BAMBINO,
      VIA_RESIDENZA_BAMBINO: body.VIA_RESIDENZA_BAMBINO.trim(),
      CITTA_RESIDENZA_BAMBINO: body.CITTA_RESIDENZA_BAMBINO.trim(),
      CATEGORIA: body.CATEGORIA?.trim() || undefined, // Categoria opzionale
      TABELLA_GENITORI: [genitore.id!], // Campo con il nome corretto
    };

    console.log('[API] Creating bambino with TABELLA_GENITORI:', genitore.id);
    const bambino = await client.createBambino(bambinoData);
    console.log('[API] Bambino created successfully:', bambino.id);

    return new Response(JSON.stringify({ success: true, bambino }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API] Error in POST /api/bambini:', error);
    const errorMessage = error instanceof Error ? error.message : 'Errore nella creazione del bambino';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: 'Verifica che la tabella TABELLA_BAMBINI esista in Airtable con il campo TABELLA_GENITORI (Linked Record) configurato correttamente'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
