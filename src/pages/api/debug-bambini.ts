// Debug endpoint per verificare la struttura della TABELLA_BAMBINI
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  try {
    const baseId = context.locals?.runtime?.env?.AIRTABLE_BASE_ID || import.meta.env.AIRTABLE_BASE_ID;
    const token = context.locals?.runtime?.env?.AIRTABLE_API_KEY || 
                  context.locals?.runtime?.env?.AIRTABLE_TOKEN || 
                  import.meta.env.AIRTABLE_API_KEY || 
                  import.meta.env.AIRTABLE_TOKEN;
    
    if (!baseId || !token) {
      return new Response(JSON.stringify({ error: 'Missing credentials' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = `https://api.airtable.com/v0/${baseId}/TABELLA_BAMBINI`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data: any = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ 
        error: 'Airtable error',
        status: response.status,
        details: data
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Analizza la struttura
    const analysis: any = {
      totalRecords: data.records?.length || 0,
      tableExists: true,
      fields: []
    };

    if (data.records && data.records.length > 0) {
      const firstRecord = data.records[0];
      analysis.sampleRecord = firstRecord;
      analysis.fields = Object.keys(firstRecord.fields);
    }

    return new Response(JSON.stringify(analysis, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
