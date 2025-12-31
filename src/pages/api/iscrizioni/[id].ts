// API route per gestire una singola iscrizione
import type { APIRoute } from 'astro';
import { getAirtableClient } from '../../../lib/airtable';
import { getGenitoreFromSession } from '../../../lib/auth';

// GET: ottieni dettaglio di una iscrizione
export const GET: APIRoute = async (context) => {
  try {
    const { id } = context.params;
    console.log('[API] GET /api/iscrizioni/[id] - Start, id:', id);
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID iscrizione mancante' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const genitore = await getGenitoreFromSession(context);
    if (!genitore) {
      return new Response(JSON.stringify({ error: 'Non autenticato' }), {
        status: 401,
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

    const iscrizione = await client.getIscrizioneById(id, genitore.id!);
    
    if (!iscrizione) {
      return new Response(
        JSON.stringify({ error: 'Iscrizione non trovata o non autorizzato' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ iscrizione }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API] Error in GET /api/iscrizioni/[id]:', error);
    return new Response(
      JSON.stringify({ error: 'Errore nel recupero dell\'iscrizione' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// PATCH: aggiorna una iscrizione (privacy, taglie kit)
export const PATCH: APIRoute = async (context) => {
  try {
    const { id } = context.params;
    console.log('[API] PATCH /api/iscrizioni/[id] - Start, id:', id);
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID iscrizione mancante' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const genitore = await getGenitoreFromSession(context);
    if (!genitore) {
      return new Response(JSON.stringify({ error: 'Non autenticato' }), {
        status: 401,
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

    // Prima recupera l'iscrizione corrente per verificare lo stato
    const iscrizioneCorrente = await client.getIscrizioneById(id, genitore.id!);
    if (!iscrizioneCorrente) {
      return new Response(
        JSON.stringify({ error: 'Iscrizione non trovata o non autorizzato' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body: any = await context.request.json();
    console.log('[API] Received fields to update:', Object.keys(body));

    // Crea oggetto con i campi da aggiornare
    const fieldsToUpdate: any = {};
    
    // Privacy GDPR (vecchio campo)
    if (body.PRIVACY_MINORE !== undefined) {
      fieldsToUpdate.PRIVACY_MINORE = body.PRIVACY_MINORE;
    }
    
    // Privacy Dati Personali (nuovo campo)
    if (body.PRIVACY_DATI_PERSONALI !== undefined) {
      fieldsToUpdate.PRIVACY_DATI_PERSONALI = body.PRIVACY_DATI_PERSONALI;
    }
    
    // Taglie kit
    if (body.TAGLIA_MAGLIA !== undefined) {
      fieldsToUpdate.TAGLIA_MAGLIA = body.TAGLIA_MAGLIA?.trim() || undefined;
    }
    if (body.TAGLIA_PANTALONCINO !== undefined) {
      fieldsToUpdate.TAGLIA_PANTALONCINO = body.TAGLIA_PANTALONCINO?.trim() || undefined;
    }
    if (body.TAGLIA_TUTA !== undefined) {
      fieldsToUpdate.TAGLIA_TUTA = body.TAGLIA_TUTA?.trim() || undefined;
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
      return new Response(
        JSON.stringify({ error: 'Nessun campo da aggiornare' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Calcola lo stato iscrizione
    // Consideriamo i valori aggiornati + quelli esistenti
    const privacyFinal = fieldsToUpdate.PRIVACY_DATI_PERSONALI !== undefined 
      ? fieldsToUpdate.PRIVACY_DATI_PERSONALI 
      : iscrizioneCorrente.fields.PRIVACY_DATI_PERSONALI;
    
    const regolamentoFinal = iscrizioneCorrente.fields.REGOLAMENTO_FIRMATO;
    
    const hasPrivacy = privacyFinal === true;
    const hasRegolamento = regolamentoFinal && regolamentoFinal.length > 0;
    
    // Aggiorna lo stato solo se abbiamo tutti i dati obbligatori
    fieldsToUpdate.STATO_ISCRIZIONE = (hasPrivacy && hasRegolamento) ? 'Completa' : 'Da completare';

    console.log('[API] Calculated STATO_ISCRIZIONE:', fieldsToUpdate.STATO_ISCRIZIONE);
    console.log('[API] Updating iscrizione with fields:', fieldsToUpdate);
    
    const iscrizione = await client.updateIscrizione(id, genitore.id!, fieldsToUpdate);
    
    if (!iscrizione) {
      return new Response(
        JSON.stringify({ error: 'Iscrizione non trovata o non autorizzato' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[API] Iscrizione updated successfully');

    return new Response(JSON.stringify({ success: true, iscrizione }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API] Error in PATCH /api/iscrizioni/[id]:', error);
    return new Response(
      JSON.stringify({ error: 'Errore nell\'aggiornamento dell\'iscrizione' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
