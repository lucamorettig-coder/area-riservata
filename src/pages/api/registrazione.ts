import type { APIRoute } from 'astro';
import { getAirtableClient, type Genitore } from '../../lib/airtable';
import { getSupabaseClient } from '../../lib/supabase';
import { validateGenitoreData } from '../../lib/validation';

type GenitoreRegistrationData = Genitore['fields'] & {
  PASSWORD: string;
};

export const POST: APIRoute = async ({ request, locals }) => {
  console.log('=== REGISTRAZIONE START ===');
  
  try {
    // 1. Parse body
    console.log('[Registrazione] Step 1: Parsing request body');
    const body = await request.json() as GenitoreRegistrationData;
    console.log('[Registrazione] Body parsed successfully');

    // 2. Validazione dati
    console.log('[Registrazione] Step 2: Validating data');
    const errors = validateGenitoreData(body);
    
    // Valida anche la password
    if (!body.PASSWORD || body.PASSWORD.length < 6) {
      errors.push({
        field: 'PASSWORD',
        message: 'La password deve contenere almeno 6 caratteri'
      });
    }

    if (errors.length > 0) {
      console.log('[Registrazione] Validation errors:', errors);
      return new Response(JSON.stringify({ errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    console.log('[Registrazione] Validation passed');

    // 3. Ottieni client Airtable (prima di Supabase per verificare il CF)
    console.log('[Registrazione] Step 3: Getting Airtable client');
    const airtableClient = getAirtableClient(locals?.runtime);
    
    if (!airtableClient) {
      console.error('[Registrazione] Airtable client is null');
      return new Response(
        JSON.stringify({ 
          error: 'Configurazione Airtable non disponibile. Configura AIRTABLE_BASE_ID e AIRTABLE_TOKEN nelle Environment Variables di Webflow.' 
        }), 
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    console.log('[Registrazione] Airtable client created');

    // 4. Verifica se il codice fiscale esiste già
    console.log('[Registrazione] Step 4: Checking if codice fiscale already exists');
    console.log('[Registrazione] Codice fiscale:', body.CODICE_FISCALE_GENITORE);
    
    try {
      const existingGenitore = await airtableClient.findGenitoreByCF(body.CODICE_FISCALE_GENITORE);
      
      if (existingGenitore) {
        console.log('[Registrazione] Codice fiscale already exists:', existingGenitore.id);
        return new Response(
          JSON.stringify({ 
            error: 'Esiste già un\'utenza registrata con questo codice fiscale. Se hai dimenticato la password, contatta il supporto.' 
          }), 
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      console.log('[Registrazione] Codice fiscale is available');
    } catch (error) {
      console.error('[Registrazione] Error checking codice fiscale:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Errore durante la verifica del codice fiscale. Riprova più tardi.' 
        }), 
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 5. Ottieni client Supabase
    console.log('[Registrazione] Step 5: Getting Supabase client');
    const supabase = getSupabaseClient(locals?.runtime);
    
    if (!supabase) {
      console.error('[Registrazione] Supabase client is null');
      return new Response(
        JSON.stringify({ 
          error: 'Configurazione Supabase non disponibile. Configura SUPABASE_URL e SUPABASE_ANON_KEY nelle Environment Variables di Webflow.' 
        }), 
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    console.log('[Registrazione] Supabase client created');

    // 6. Crea l'utente su Supabase Auth
    console.log('[Registrazione] Step 6: Creating user on Supabase');
    console.log('[Registrazione] Email:', body.EMAIL_GENITORE);
    
    let authData;
    let authError;
    
    try {
      const result = await supabase.auth.signUp({
        email: body.EMAIL_GENITORE,
        password: body.PASSWORD,
      });
      authData = result.data;
      authError = result.error;
      
      console.log('[Registrazione] Supabase signUp completed');
      console.log('[Registrazione] Auth error:', authError?.message || 'none');
      console.log('[Registrazione] User created:', !!authData?.user);
    } catch (err) {
      console.error('[Registrazione] Exception during signUp:', err);
      throw err;
    }

    if (authError) {
      console.error('[Registrazione] Supabase Auth error:', authError);
      
      // Gestisci errori specifici
      if (authError.message.includes('already registered') || authError.message.includes('already been registered')) {
        return new Response(
          JSON.stringify({ error: 'Email già registrata' }), 
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Errore durante la creazione delle credenziali: ' + authError.message 
        }), 
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!authData.user) {
      console.error('[Registrazione] No user returned from Supabase');
      return new Response(
        JSON.stringify({ error: 'Errore durante la creazione dell\'utente' }), 
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('[Registrazione] User created with ID:', authData.user.id);

    // 7. Salva i dati su Airtable con l'AUTH_USER_ID
    console.log('[Registrazione] Step 7: Saving data to Airtable');
    try {
      const genitore = await airtableClient.createGenitore({
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
        AUTH_USER_ID: authData.user.id,
      } as any);

      console.log('[Registrazione] Airtable record created:', genitore.id);
      console.log('=== REGISTRAZIONE SUCCESS ===');

      return new Response(
        JSON.stringify({ success: true, genitore }), 
        {
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (airtableError) {
      console.error('[Registrazione] Airtable error:', airtableError);
      console.error('[Registrazione] Error details:', airtableError instanceof Error ? airtableError.message : airtableError);
      
      // Se fallisce la creazione su Airtable, segnala il problema
      // L'utente esiste su Supabase ma non su Airtable
      return new Response(
        JSON.stringify({ 
          error: 'Errore durante il salvataggio dei dati. L\'account è stato creato ma i dati non sono stati salvati. Contatta il supporto.' 
        }), 
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('=== REGISTRAZIONE ERROR ===');
    console.error('[Registrazione] Unexpected error:', error);
    console.error('[Registrazione] Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    return new Response(
      JSON.stringify({ 
        error: 'Errore durante la registrazione: ' + (error instanceof Error ? error.message : 'Unknown error')
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
