import type { APIRoute } from 'astro';
import { getAirtableClient } from '../../lib/airtable';
import { getGenitoreFromSession } from '../../lib/auth';

export const GET: APIRoute = async (context) => {
  try {
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
        JSON.stringify({ error: 'Airtable client not available' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch bambini
    const bambini = await client.getBambiniByGenitore(genitore.id!);

    // Debug info
    const debugInfo = {
      genitore: {
        id: genitore.id,
        nome: genitore.fields.NOME_GENITORE,
        cognome: genitore.fields.COGNOME_GENITORE,
        email: genitore.fields.EMAIL_GENITORE,
      },
      bambini: {
        count: bambini.length,
        records: bambini.map(b => ({
          id: b.id,
          nome: b.fields.NOME_BAMBINO,
          cognome: b.fields.COGNOME_BAMBINO,
          TABELLA_GENITORI: b.fields.TABELLA_GENITORI,
          TABELLA_GENITORI_includes_genitoreId: b.fields.TABELLA_GENITORI?.includes(genitore.id!),
        })),
      },
      airtableFormula: `FIND(",${genitore.id},", "," & ARRAYJOIN({TABELLA_GENITORI}) & ",")`,
    };

    return new Response(JSON.stringify(debugInfo, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Debug API] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      }, null, 2),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
