import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  try {
    const path = context.params.path;
    
    if (!path) {
      return new Response('File not found', { status: 404 });
    }

    // Ottieni R2 bucket (usa il binding "R2" configurato in wrangler.jsonc)
    const r2 = context.locals?.runtime?.env?.R2;
    
    if (!r2) {
      console.error('[Certificati API] R2 bucket not configured');
      return new Response('Storage not configured', { status: 500 });
    }

    console.log('[Certificati API] Fetching file from R2:', path);

    // Recupera il file da R2
    const object = await r2.get(path);

    if (!object) {
      console.log('[Certificati API] File not found in R2:', path);
      return new Response('File not found', { status: 404 });
    }

    // Restituisci il file con il content type corretto
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000'); // Cache per 1 anno

    return new Response(object.body, {
      headers,
    });

  } catch (error) {
    console.error('[Certificati API] Error serving file:', error);
    return new Response('Internal server error', { status: 500 });
  }
};
