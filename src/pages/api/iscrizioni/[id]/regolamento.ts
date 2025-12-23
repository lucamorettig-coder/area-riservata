// API route per caricare il regolamento firmato di un'iscrizione
import type { APIRoute } from 'astro';
import { getAirtableClient } from '../../../../lib/airtable';
import { getGenitoreFromSession } from '../../../../lib/auth';

export const POST: APIRoute = async (context) => {
  try {
    const { id } = context.params;
    console.log('[API] POST /api/iscrizioni/[id]/regolamento - Start, id:', id);
    
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

    // Verifica che l'iscrizione appartenga al genitore
    const iscrizione = await client.getIscrizioneById(id, genitore.id!);
    if (!iscrizione) {
      return new Response(
        JSON.stringify({ error: 'Iscrizione non trovata o non autorizzato' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse form data
    const formData = await context.request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'File mancante' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[API] File ricevuto:', file.name, file.type, file.size);

    // Validazione tipo file (solo PDF)
    if (!file.type.includes('pdf')) {
      return new Response(
        JSON.stringify({ error: 'Solo file PDF sono permessi' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validazione dimensione (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: 'Il file è troppo grande. Dimensione massima: 5MB' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Controlla se R2 è disponibile
    const r2Bucket = context.locals?.runtime?.env?.R2_BUCKET;
    
    if (!r2Bucket) {
      console.warn('[API] R2 bucket not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Servizio storage non configurato',
          details: 'Configura R2_BUCKET nelle variabili d\'ambiente'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Genera un nome file univoco
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExtension = file.name.split('.').pop();
    const fileName = `regolamenti/${id}_${timestamp}_${randomString}.${fileExtension}`;

    console.log('[API] Uploading to R2:', fileName);

    // Upload su R2
    const arrayBuffer = await file.arrayBuffer();
    await r2Bucket.put(fileName, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    console.log('[API] File uploaded to R2');

    // Costruisci URL pubblico del file
    // In produzione, dovrai configurare un custom domain per R2
    // Per ora usiamo la struttura base
    const publicUrl = `https://pub-yourdomain.r2.dev/${fileName}`;
    
    // NOTA: In alternativa, se hai configurato R2 con custom domain:
    // const r2Domain = context.locals?.runtime?.env?.R2_PUBLIC_DOMAIN;
    // const publicUrl = `https://${r2Domain}/${fileName}`;

    console.log('[API] Public URL:', publicUrl);

    // Aggiorna Airtable con l'URL del file
    const updatedIscrizione = await client.updateRegolamentoFirmato(
      id,
      genitore.id!,
      publicUrl
    );

    if (!updatedIscrizione) {
      return new Response(
        JSON.stringify({ error: 'Errore nell\'aggiornamento dell\'iscrizione' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[API] Iscrizione updated with regolamento');

    return new Response(
      JSON.stringify({ 
        success: true, 
        iscrizione: updatedIscrizione,
        fileUrl: publicUrl 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[API] Error in POST /api/iscrizioni/[id]/regolamento:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Errore nel caricamento del regolamento',
        details: error instanceof Error ? error.message : 'Errore sconosciuto'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
