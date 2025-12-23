import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  // Questo endpoint mostra quali variabili sono disponibili (senza mostrare i valori)
  
  const debug = {
    hasLocals: !!locals,
    hasRuntime: !!locals?.runtime,
    hasRuntimeEnv: !!locals?.runtime?.env,
    runtimeKeys: locals?.runtime ? Object.keys(locals.runtime) : [],
    envKeys: locals?.runtime?.env ? Object.keys(locals.runtime.env) : [],
    
    // Controlla se le variabili specifiche esistono (senza mostrare i valori)
    airtableBaseIdExists: !!(locals?.runtime?.env?.AIRTABLE_BASE_ID || import.meta.env.AIRTABLE_BASE_ID),
    airtableTokenExists: !!(
      locals?.runtime?.env?.AIRTABLE_API_KEY || 
      locals?.runtime?.env?.AIRTABLE_TOKEN || 
      import.meta.env.AIRTABLE_API_KEY || 
      import.meta.env.AIRTABLE_TOKEN
    ),
    
    // Specifica quale nome del token è stato trovato
    tokenFoundAs: locals?.runtime?.env?.AIRTABLE_API_KEY ? 'AIRTABLE_API_KEY' :
                  locals?.runtime?.env?.AIRTABLE_TOKEN ? 'AIRTABLE_TOKEN' :
                  import.meta.env.AIRTABLE_API_KEY ? 'AIRTABLE_API_KEY (import.meta)' :
                  import.meta.env.AIRTABLE_TOKEN ? 'AIRTABLE_TOKEN (import.meta)' :
                  'NOT FOUND',
    
    // Info import.meta.env
    importMetaEnvKeys: Object.keys(import.meta.env),
    hasAirtableBaseIdInImportMeta: !!import.meta.env.AIRTABLE_BASE_ID,
    hasAirtableApiKeyInImportMeta: !!import.meta.env.AIRTABLE_API_KEY,
    hasAirtableTokenInImportMeta: !!import.meta.env.AIRTABLE_TOKEN,
  };

  return new Response(
    JSON.stringify(debug, null, 2), 
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
