import type { APIRoute } from 'astro';
import { getAirtableClient, type Genitore } from '../../lib/airtable';
import { getSession } from '../../lib/auth';
import { validateGenitoreData } from '../../lib/validation';

type GenitoreUpdateData = Genitore['fields'];

export const GET: APIRoute = async ({ cookies, locals }) => {
  try {
    const session = getSession(cookies);
    
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Non autenticato' }), 
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const client = getAirtableClient(locals?.runtime);
    
    if (!client) {
      return new Response(
        JSON.stringify({ 
          error: 'Configurazione Airtable non disponibile' 
        }), 
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const genitore = await client.getGenitoreById(session.genitoreId);

    return new Response(
      JSON.stringify({ genitore }), 
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Errore recupero profilo:', error);
    return new Response(
      JSON.stringify({ error: 'Errore durante il recupero del profilo' }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

export const PATCH: APIRoute = async ({ request, cookies, locals }) => {
  try {
    const session = getSession(cookies);
    
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Non autenticato' }), 
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const body = await request.json() as GenitoreUpdateData;

    // Validazione dati
    const errors = validateGenitoreData(body);
    if (errors.length > 0) {
      return new Response(JSON.stringify({ errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const client = getAirtableClient(locals?.runtime);
    
    if (!client) {
      return new Response(
        JSON.stringify({ 
          error: 'Configurazione Airtable non disponibile' 
        }), 
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Aggiorna il profilo
    const genitore = await client.updateGenitore(session.genitoreId, {
      NOME_GENITORE: body.NOME_GENITORE,
      COGNOME_GENITORE: body.COGNOME_GENITORE,
      DATA_NASCITA_GENITORE: body.DATA_NASCITA_GENITORE,
      LUOGO_NASCITA_GENITORE: body.LUOGO_NASCITA_GENITORE,
      CODICE_FISCALE_GENITORE: body.CODICE_FISCALE_GENITORE.toUpperCase(),
      VIA_RESIDENZA_GENITORE: body.VIA_RESIDENZA_GENITORE,
      CITTA_RESIDENZA_GENITORE: body.CITTA_RESIDENZA_GENITORE,
      EMAIL_GENITORE: body.EMAIL_GENITORE,
      CELLULARE_GENITORE: body.CELLULARE_GENITORE,
      FLAG_PRIVACY: body.FLAG_PRIVACY,
    });

    return new Response(
      JSON.stringify({ success: true, genitore }), 
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Errore aggiornamento profilo:', error);
    return new Response(
      JSON.stringify({ error: 'Errore durante l\'aggiornamento del profilo' }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
