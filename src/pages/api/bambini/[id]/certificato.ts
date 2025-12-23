import type { APIRoute } from 'astro';
import { getGenitoreFromSession } from '../../../../lib/auth';
import { getAirtableClient } from '../../../../lib/airtable';

export const POST: APIRoute = async (context) => {
  try {
    console.log('[Certificato API] Starting POST request');
    
    // Verifica autenticazione
    const genitore = await getGenitoreFromSession(context);
    console.log('[Certificato API] Genitore found:', !!genitore);
    
    if (!genitore) {
      console.error('[Certificato API] Not authenticated');
      return new Response(JSON.stringify({ error: 'Non autenticato' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const bambinoId = context.params.id;
    console.log('[Certificato API] Bambino ID:', bambinoId);
    
    if (!bambinoId) {
      return new Response(JSON.stringify({ error: 'ID bambino mancante' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ottieni client Airtable
    const client = getAirtableClient(context.locals?.runtime);
    if (!client) {
      console.error('[Certificato API] Airtable client not configured');
      return new Response(JSON.stringify({ error: 'Configurazione mancante' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verifica che il bambino appartenga al genitore
    const bambino = await client.getBambinoById(bambinoId, genitore.id!);
    console.log('[Certificato API] Bambino found:', !!bambino);
    
    if (!bambino) {
      console.error('[Certificato API] Bambino not found or not owned by genitore');
      return new Response(JSON.stringify({ error: 'Bambino non trovato' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse JSON body
    let body;
    try {
      body = await context.request.json();
      console.log('[Certificato API] JSON body parsed successfully');
    } catch (e) {
      console.error('[Certificato API] Error parsing JSON:', e);
      return new Response(JSON.stringify({ error: 'Errore nel parsing dei dati' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { fileData, fileName, fileType, fileSize, scadenza } = body;

    console.log('[Certificato API] File present:', !!fileData);
    console.log('[Certificato API] File name:', fileName);
    console.log('[Certificato API] File type:', fileType);
    console.log('[Certificato API] File size:', fileSize);
    console.log('[Certificato API] Scadenza:', scadenza);

    if (!fileData) {
      return new Response(JSON.stringify({ error: 'Carica il file del certificato' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!scadenza) {
      return new Response(JSON.stringify({ error: 'Seleziona la data di scadenza' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Valida dimensione file (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (fileSize > maxSize) {
      console.error('[Certificato API] File too large:', fileSize);
      return new Response(JSON.stringify({ error: 'File troppo grande (max 10MB)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Valida tipo file
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(fileType)) {
      console.error('[Certificato API] Invalid file type:', fileType);
      return new Response(JSON.stringify({ error: 'Formato file non supportato. Usa PDF, JPG o PNG.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('[Certificato API] File validation passed');

    // Ottieni R2 bucket (usa il binding "R2" configurato in wrangler.jsonc)
    const r2 = context.locals?.runtime?.env?.R2;
    
    if (!r2) {
      console.error('[Certificato API] R2 bucket not configured');
      return new Response(JSON.stringify({ 
        error: 'Storage non configurato. Contatta l\'amministratore per configurare R2 bucket.',
        details: 'R2 binding not found in runtime environment'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Converti data URL in buffer
    const base64Data = fileData.split(',')[1];
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Genera nome file unico
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const r2Key = `certificati/${bambinoId}/${timestamp}-${sanitizedFileName}`;

    console.log('[Certificato API] Uploading to R2:', r2Key);

    // Carica su R2
    await r2.put(r2Key, bytes, {
      httpMetadata: {
        contentType: fileType,
      },
    });

    console.log('[Certificato API] File uploaded to R2 successfully');

    // Genera URL pubblico per Airtable
    // Usa il dominio pubblico di R2 configurato o il dominio del worker
    const r2PublicDomain = context.locals?.runtime?.env?.R2_PUBLIC_DOMAIN || context.url.origin;
    const publicUrl = `${r2PublicDomain}/api/certificati/${r2Key}`;

    console.log('[Certificato API] Public URL:', publicUrl);

    // Aggiorna Airtable con l'URL pubblico
    const updated = await client.updateCertificatoMedico(
      bambinoId,
      genitore.id!,
      publicUrl,
      scadenza
    );

    if (!updated) {
      console.error('[Certificato API] Failed to update Airtable');
      // Pulisci R2 in caso di errore
      await r2.delete(r2Key);
      return new Response(JSON.stringify({ error: 'Errore durante il salvataggio in database' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('[Certificato API] Certificate uploaded successfully');
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Certificato caricato con successo',
      url: publicUrl
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[Certificato API] Unexpected error:', error);
    return new Response(JSON.stringify({ 
      error: 'Errore interno del server',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
