import type { APIRoute } from 'astro';

/**
 * API di test per registrazione - versione minimale per debug
 * Testa ogni componente separatamente
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const steps: any = {
    timestamp: new Date().toISOString(),
    step1_parseBody: { status: 'pending', error: null },
    step2_checkEnv: { status: 'pending', error: null },
    step3_supabaseClient: { status: 'pending', error: null },
    step4_airtableClient: { status: 'pending', error: null },
    step5_supabaseSignup: { status: 'pending', error: null },
    step6_airtableCreate: { status: 'pending', error: null },
  };

  try {
    // STEP 1: Parse body
    console.log('[TEST] Step 1: Parsing body');
    let body;
    try {
      body = await request.json();
      steps.step1_parseBody = {
        status: 'success',
        hasEmail: !!body?.EMAIL_GENITORE,
        hasPassword: !!body?.PASSWORD,
        fieldCount: Object.keys(body || {}).length
      };
      console.log('[TEST] Step 1: SUCCESS', steps.step1_parseBody);
    } catch (error) {
      steps.step1_parseBody = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      console.error('[TEST] Step 1: FAILED', error);
      return new Response(JSON.stringify(steps, null, 2), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // STEP 2: Check environment variables
    console.log('[TEST] Step 2: Checking env');
    try {
      const supabaseUrl = locals?.runtime?.env?.SUPABASE_URL || import.meta.env.SUPABASE_URL;
      const supabaseKey = locals?.runtime?.env?.SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;
      const airtableBaseId = locals?.runtime?.env?.AIRTABLE_BASE_ID || import.meta.env.AIRTABLE_BASE_ID;
      const airtableToken = locals?.runtime?.env?.AIRTABLE_TOKEN || 
                           locals?.runtime?.env?.AIRTABLE_API_KEY || 
                           import.meta.env.AIRTABLE_TOKEN || 
                           import.meta.env.AIRTABLE_API_KEY;

      steps.step2_checkEnv = {
        status: 'success',
        supabaseUrl: !!supabaseUrl,
        supabaseKey: !!supabaseKey,
        airtableBaseId: !!airtableBaseId,
        airtableToken: !!airtableToken,
        hasRuntime: !!locals?.runtime,
        hasRuntimeEnv: !!locals?.runtime?.env,
      };
      console.log('[TEST] Step 2: SUCCESS', steps.step2_checkEnv);
    } catch (error) {
      steps.step2_checkEnv = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      console.error('[TEST] Step 2: FAILED', error);
    }

    // STEP 3: Try to import and create Supabase client
    console.log('[TEST] Step 3: Creating Supabase client');
    let supabaseClient;
    try {
      const { getSupabaseClient } = await import('../../lib/supabase');
      supabaseClient = getSupabaseClient(locals?.runtime);
      steps.step3_supabaseClient = {
        status: supabaseClient ? 'success' : 'failed',
        clientCreated: !!supabaseClient
      };
      console.log('[TEST] Step 3:', steps.step3_supabaseClient.status.toUpperCase());
    } catch (error) {
      steps.step3_supabaseClient = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      };
      console.error('[TEST] Step 3: FAILED', error);
    }

    // STEP 4: Try to import and create Airtable client
    console.log('[TEST] Step 4: Creating Airtable client');
    let airtableClient;
    try {
      const { getAirtableClient } = await import('../../lib/airtable');
      airtableClient = getAirtableClient(locals?.runtime);
      steps.step4_airtableClient = {
        status: airtableClient ? 'success' : 'failed',
        clientCreated: !!airtableClient
      };
      console.log('[TEST] Step 4:', steps.step4_airtableClient.status.toUpperCase());
    } catch (error) {
      steps.step4_airtableClient = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      };
      console.error('[TEST] Step 4: FAILED', error);
    }

    // STEP 5: Try Supabase signup (only if client exists)
    console.log('[TEST] Step 5: Testing Supabase signup');
    if (supabaseClient && body?.EMAIL_GENITORE && body?.PASSWORD) {
      try {
        const { data, error } = await supabaseClient.auth.signUp({
          email: body.EMAIL_GENITORE,
          password: body.PASSWORD,
        });
        steps.step5_supabaseSignup = {
          status: error ? 'error' : 'success',
          hasData: !!data,
          hasUser: !!data?.user,
          userId: data?.user?.id,
          error: error ? error.message : null
        };
        console.log('[TEST] Step 5:', steps.step5_supabaseSignup.status.toUpperCase());
      } catch (error) {
        steps.step5_supabaseSignup = {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        };
        console.error('[TEST] Step 5: FAILED', error);
      }
    } else {
      steps.step5_supabaseSignup = {
        status: 'skipped',
        reason: !supabaseClient ? 'No Supabase client' : 'Missing email or password'
      };
      console.log('[TEST] Step 5: SKIPPED', steps.step5_supabaseSignup.reason);
    }

    // STEP 6: Try Airtable create (skip for now to avoid creating test records)
    steps.step6_airtableCreate = {
      status: 'skipped',
      reason: 'Test endpoint - not creating records'
    };

    console.log('[TEST] All steps completed');
    return new Response(JSON.stringify(steps, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[TEST] Unexpected error:', error);
    return new Response(JSON.stringify({
      ...steps,
      unexpectedError: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }
    }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
