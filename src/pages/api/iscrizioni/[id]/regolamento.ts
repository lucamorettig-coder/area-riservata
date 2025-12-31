import type { APIRoute } from 'astro';
import { getGenitoreFromSession } from '../../../../lib/auth';
import { getAirtableClient } from '../../../../lib/airtable';

export const POST: APIRoute = async (context) => {
  try {
    console.log('[Regolamento API] Starting POST request');
    
    // Verifica autenticazione
    const genitore = await getGenitoreFromSession(context);
    console.log('[Regolamento API] Genitore found:', !!genitore);
    
    if (!genitore) {
      console.error('[Regolamento API] Not authenticated');
      return new Response(JSON.stringify({ error: 'Non autenticato' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const iscrizioneId = context.params.id;
    console.log('[Regolamento API] Iscrizione ID:', iscrizioneId);
    
    if (!iscrizioneId) {
      return new Response(JSON.stringify({ error: 'ID iscrizione mancante' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ottieni client Airtable
    const client = getAirtableClient(context.locals?.runtime);
    if (!client) {
      console.error('[Regolamento API] Airtable client not configured');
      return new Response(JSON.stringify({ error: 'Configurazione mancante' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verifica che l'iscrizione appartenga al genitore
    const iscrizione = await client.getIscrizioneById(iscrizioneId, genitore.id!);
    console.log('[Regolamento API] Iscrizione found:', !!iscrizione);
    
    if (!iscrizione) {
      console.error('[Regolamento API] Iscrizione not found or not owned by genitore');
      return new Response(JSON.stringify({ error: 'Iscrizione non trovata' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse JSON body
    let body;
    try {
      body = await context.request.json();
      console.log('[Regolamento API] JSON body parsed successfully');
    } catch (e) {
      console.error('[Regolamento API] Error parsing JSON:', e);
      return new Response(JSON.stringify({ error: 'Errore nel parsing dei dati' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { fileData, fileName, fileType, fileSize } = body;

    console.log('[Regolamento API] File present:', !!fileData);
    console.log('[Regolamento API] File name:', fileName);
    console.log('[Regolamento API] File type:', fileType);
    console.log('[Regolamento API] File size:', fileSize);

    if (!fileData) {
      return new Response(JSON.stringify({ error: 'Carica il file del regolamento' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Valida dimensione file (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (fileSize > maxSize) {
      console.error('[Regolamento API] File too large:', fileSize);
      return new Response(JSON.stringify({ error: 'File troppo grande (max 5MB)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Valida tipo file
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(fileType)) {
      console.error('[Regolamento API] Invalid file type:', fileType);
      return new Response(JSON.stringify({ error: 'Formato file non supportato. Usa PDF, JPG o PNG.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('[Regolamento API] File validation passed');

    // Ottieni R2 bucket
    const r2 = context.locals?.runtime?.env?.R2;
    
    if (!r2) {
      console.error('[Regolamento API] R2 bucket not configured');
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
    const r2Key = `regolamenti/${iscrizioneId}/${timestamp}-${sanitizedFileName}`;

    console.log('[Regolamento API] Uploading to R2:', r2Key);

    // Carica su R2
    await r2.put(r2Key, bytes, {
      httpMetadata: {
        contentType: fileType,
      },
    });

    console.log('[Regolamento API] File uploaded to R2 successfully');

    // Genera URL pubblico per Airtable
    const r2PublicDomain = context.locals?.runtime?.env?.R2_PUBLIC_DOMAIN || context.url.origin;
    const publicUrl = `${r2PublicDomain}/api/certificati/${r2Key}`;

    console.log('[Regolamento API] Public URL:', publicUrl);

    // Data di firma del regolamento (data corrente in formato YYYY-MM-DD)
    const dataFirma = new Date().toISOString().split('T')[0];
    console.log('[Regolamento API] Data firma:', dataFirma);

    // Aggiorna Airtable con l'URL pubblico e la data di firma
    const updated = await client.updateRegolamentoFirmato(
      iscrizioneId,
      genitore.id!,
      publicUrl,
      dataFirma
    );

    if (!updated) {
      console.error('[Regolamento API] Failed to update Airtable');
      // Pulisci R2 in caso di errore
      await r2.delete(r2Key);
      return new Response(JSON.stringify({ error: 'Errore durante il salvataggio in database' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('[Regolamento API] Regolamento uploaded successfully');
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Regolamento caricato con successo',
      url: publicUrl,
      dataFirma: dataFirma
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[Regolamento API] Unexpected error:', error);
    return new Response(JSON.stringify({ 
      error: 'Errore interno del server',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
