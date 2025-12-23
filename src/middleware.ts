import type {MiddlewareHandler} from 'astro';

export const onRequest: MiddlewareHandler = async (ctx, next) => {
  const {request, locals} = ctx;
  const url = new URL(request.url);

  // Debug delle variabili d'ambiente
  if (url.pathname.startsWith('/api/')) {
    console.log('=== DEBUG ENVIRONMENT VARIABLES ===');
    console.log('locals:', Object.keys(locals || {}));
    console.log('locals.runtime:', !!locals?.runtime);
    console.log('locals.runtime.env:', locals?.runtime?.env ? Object.keys(locals.runtime.env) : 'undefined');
    
    // Prova diversi modi di accedere alle env vars
    console.log('Check AIRTABLE_BASE_ID:');
    console.log('  - locals.runtime?.env?.AIRTABLE_BASE_ID:', !!locals?.runtime?.env?.AIRTABLE_BASE_ID);
    console.log('  - import.meta.env.AIRTABLE_BASE_ID:', !!import.meta.env.AIRTABLE_BASE_ID);
    
    console.log('Check AIRTABLE_TOKEN:');
    console.log('  - locals.runtime?.env?.AIRTABLE_TOKEN:', !!locals?.runtime?.env?.AIRTABLE_TOKEN);
    console.log('  - import.meta.env.AIRTABLE_TOKEN:', !!import.meta.env.AIRTABLE_TOKEN);
    console.log('===================================');
  }

  if (import.meta.env.DEV && url.pathname === '/-wf/ready') {
    const resHeaders = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return new Response(JSON.stringify({ready: true}), {
      headers: resHeaders,
    });
  }

  return next();
};
