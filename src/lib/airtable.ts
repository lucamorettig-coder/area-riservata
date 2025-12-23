// Airtable client configuration
// Variabili d'ambiente da configurare:
// - AIRTABLE_BASE_ID
// - AIRTABLE_API_KEY (o AIRTABLE_TOKEN)

export interface Genitore {
  id?: string;
  fields: {
    NOME_GENITORE: string;
    COGNOME_GENITORE: string;
    DATA_NASCITA_GENITORE: string;
    LUOGO_NASCITA_GENITORE: string;
    CODICE_FISCALE_GENITORE: string;
    VIA_RESIDENZA_GENITORE: string;
    CITTA_RESIDENZA_GENITORE: string;
    EMAIL_GENITORE: string;
    CELLULARE_GENITORE: string;
    FLAG_PRIVACY: boolean;
    AUTH_USER_ID?: string; // ID dell'utente Supabase Auth
  };
}

export interface AirtableAttachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
}

export interface Bambino {
  id?: string;
  fields: {
    NOME_BAMBINO: string;
    COGNOME_BAMBINO: string;
    DATA_NASCITA_BAMBINO: string;
    LUOGO_NASCITA_BAMBINO: string;
    CODICE_FISCALE_BAMBINO: string;
    VIA_RESIDENZA_BAMBINO: string;
    CITTA_RESIDENZA_BAMBINO: string;
    TABELLA_GENITORI?: string[]; // Array di record IDs (linked record field)
    FOTO_BAMBINO?: AirtableAttachment[]; // Attachment field
    CERTIFICATO_MEDICO_FILE?: AirtableAttachment[]; // Attachment field
    CERTIFICATO_MEDICO_SCADENZA?: string; // Date field (YYYY-MM-DD)
    CERTIFICATO_MEDICO_STATO?: string; // Formula/Lookup field (READ ONLY)
    ID_BAMBINO?: string; // Formula field (READ ONLY)
  };
}

export interface Tariffa {
  id?: string;
  fields: {
    ANNO_ISCRIZIONE: string; // es. "2025"
    QUOTA_TOTALE_ANNO: number; // valuta
    IMPORTO_ISCRIZIONE: number; // valuta - importo da pagare al momento dell'iscrizione
    NUMERO_RATE: number; // numero di rate
    IMPORTO_RATA: number; // valuta - importo singola rata
    SCADENZA_RATE?: string; // descrizione scadenze
    IMPORTO_KIT_SCUOLA?: number; // valuta
    DESCRIZIONE_KIT?: string; // testo
    ATTIVA: boolean; // checkbox - indica se la tariffa è attiva
  };
}

export interface Iscrizione {
  id?: string;
  fields: {
    TABELLA_GENITORI: string[]; // linked record - OBBLIGATORIO
    TABELLA_BAMBINI: string[]; // linked record - OBBLIGATORIO
    TABELLA_TARIFFE: string[]; // linked record - OBBLIGATORIO
    // Campi modificabili
    PRIVACY_GDPR_FCI?: boolean; // checkbox privacy
    TAGLIA_MAGLIA?: string; // taglia maglia
    TAGLIA_PANTALONCINO?: string; // taglia pantaloncino
    TAGLIA_TUTA?: string; // taglia tuta
    REGOLAMENTO_FIRMATO_FILE?: AirtableAttachment[]; // Attachment field
    // Campi read-only (gestiti da Airtable)
    DATA_ISCRIZIONE?: string; // auto-popolato da Airtable
    STATO_ISCRIZIONE?: string; // formula/lookup (READ ONLY)
    ANNO_ISCRIZIONE?: string; // lookup da tariffa (READ ONLY)
    // Lookup fields dai bambini (arrivano come array)
    'NOME BAMBINO'?: string[]; // lookup (READ ONLY)
    'COGNOME BAMBINO'?: string[]; // lookup (READ ONLY)
    CATEGORIA?: string[]; // lookup (READ ONLY)
  };
}

interface AirtableResponse<T> {
  records?: T[];
}

export class AirtableClient {
  private baseId: string;
  private token: string;
  private baseUrl = 'https://api.airtable.com/v0';

  constructor(baseId: string, token: string) {
    this.baseId = baseId;
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/${this.baseId}/${endpoint}`;
    
    console.log(`[Airtable] Making request to: ${endpoint}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`[Airtable] Error response:`, error);
      throw new Error(`Airtable API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    console.log(`[Airtable] Success response for ${endpoint}`);
    return data;
  }

  // ==================== GENITORI ====================

  // Crea un nuovo genitore
  async createGenitore(fields: Genitore['fields']): Promise<Genitore> {
    const data = await this.request('TABELLA_GENITORI', {
      method: 'POST',
      body: JSON.stringify({ fields }),
    }) as Genitore;
    return data;
  }

  // Trova genitore per email
  async findGenitoreByEmail(email: string): Promise<Genitore | null> {
    const formula = `{EMAIL_GENITORE}="${email}"`;
    const data = await this.request(
      `TABELLA_GENITORI?filterByFormula=${encodeURIComponent(formula)}`
    ) as AirtableResponse<Genitore>;
    
    if (data.records && data.records.length > 0) {
      return data.records[0];
    }
    return null;
  }

  // Trova genitore per codice fiscale
  async findGenitoreByCF(codiceFiscale: string): Promise<Genitore | null> {
    // Normalizza il codice fiscale in maiuscolo per il confronto
    const cfUpper = codiceFiscale.toUpperCase();
    const formula = `UPPER({CODICE_FISCALE_GENITORE})="${cfUpper}"`;
    const data = await this.request(
      `TABELLA_GENITORI?filterByFormula=${encodeURIComponent(formula)}`
    ) as AirtableResponse<Genitore>;
    
    if (data.records && data.records.length > 0) {
      return data.records[0];
    }
    return null;
  }

  // Trova genitore per AUTH_USER_ID (Supabase)
  async findGenitoreByAuthUserId(authUserId: string): Promise<Genitore | null> {
    const formula = `{AUTH_USER_ID}="${authUserId}"`;
    const data = await this.request(
      `TABELLA_GENITORI?filterByFormula=${encodeURIComponent(formula)}`
    ) as AirtableResponse<Genitore>;
    
    if (data.records && data.records.length > 0) {
      return data.records[0];
    }
    return null;
  }

  // Ottieni genitore per ID
  async getGenitoreById(recordId: string): Promise<Genitore> {
    const data = await this.request(`TABELLA_GENITORI/${recordId}`) as Genitore;
    return data;
  }

  // Aggiorna genitore
  async updateGenitore(recordId: string, fields: Partial<Genitore['fields']>): Promise<Genitore> {
    const data = await this.request(`TABELLA_GENITORI/${recordId}`, {
      method: 'PATCH',
      body: JSON.stringify({ fields }),
    }) as Genitore;
    return data;
  }

  // ==================== BAMBINI ====================

  // Crea un nuovo bambino
  async createBambino(fields: Bambino['fields']): Promise<Bambino> {
    console.log('[Airtable] Creating bambino with fields:', fields);
    const data = await this.request('TABELLA_BAMBINI', {
      method: 'POST',
      body: JSON.stringify({ fields }),
    }) as Bambino;
    return data;
  }

  // Ottieni tutti i bambini di un genitore
  async getBambiniByGenitore(genitoreId: string): Promise<Bambino[]> {
    try {
      console.log(`[Airtable] Fetching bambini for genitore: ${genitoreId}`);
      
      // Prova prima senza filtro per vedere se la tabella esiste
      const allData = await this.request('TABELLA_BAMBINI') as AirtableResponse<Bambino>;
      
      console.log('[Airtable] Total records in TABELLA_BAMBINI:', allData.records?.length || 0);
      
      if (!allData.records || allData.records.length === 0) {
        console.log('[Airtable] No bambini found in table');
        return [];
      }

      // Filtra manualmente i bambini del genitore
      const bambini = allData.records.filter(bambino => {
        const hasGenitore = bambino.fields.TABELLA_GENITORI && bambino.fields.TABELLA_GENITORI.includes(genitoreId);
        console.log(`[Airtable] Bambino ${bambino.id}: TABELLA_GENITORI field =`, bambino.fields.TABELLA_GENITORI, 'matches:', hasGenitore);
        return hasGenitore;
      });
      
      console.log(`[Airtable] Found ${bambini.length} bambini for this genitore`);
      return bambini;
    } catch (error) {
      console.error('[Airtable] Error fetching bambini:', error);
      
      // Se la tabella non esiste ancora, restituisci array vuoto invece di errore
      if (error instanceof Error && error.message.includes('404')) {
        console.log('[Airtable] TABELLA_BAMBINI does not exist yet, returning empty array');
        return [];
      }
      
      throw error;
    }
  }

  // Ottieni bambino per ID (con verifica genitore)
  async getBambinoById(bambinoId: string, genitoreId: string): Promise<Bambino | null> {
    try {
      console.log(`[Airtable] Fetching bambino ${bambinoId} for genitore ${genitoreId}`);
      const bambino = await this.request(`TABELLA_BAMBINI/${bambinoId}`) as Bambino;
      
      console.log('[Airtable] Fetched bambino:', bambino.id, 'TABELLA_GENITORI:', bambino.fields.TABELLA_GENITORI);
      
      // Verifica che il bambino appartenga al genitore
      if (bambino.fields.TABELLA_GENITORI && bambino.fields.TABELLA_GENITORI.includes(genitoreId)) {
        console.log('[Airtable] Bambino belongs to genitore - OK');
        return bambino;
      }
      
      console.log('[Airtable] Bambino does not belong to this genitore');
      return null;
    } catch (error) {
      console.error('[Airtable] Error fetching bambino by ID:', error);
      return null;
    }
  }

  // Aggiorna bambino (con verifica genitore)
  async updateBambino(bambinoId: string, genitoreId: string, fields: Partial<Bambino['fields']>): Promise<Bambino | null> {
    try {
      console.log(`[Airtable] updateBambino - Start`);
      console.log(`[Airtable] updateBambino - bambinoId: ${bambinoId}`);
      console.log(`[Airtable] updateBambino - genitoreId: ${genitoreId}`);
      console.log(`[Airtable] updateBambino - fields to update:`, Object.keys(fields));
      
      // Prima verifica che il bambino appartenga al genitore
      const bambino = await this.getBambinoById(bambinoId, genitoreId);
      if (!bambino) {
        console.log('[Airtable] updateBambino - Bambino not found or not authorized');
        return null;
      }

      console.log('[Airtable] updateBambino - Bambino found, proceeding with update');

      // Lista di campi read-only che non devono essere mai modificati
      const readOnlyFields = [
        'TABELLA_GENITORI', 
        'CERTIFICATO_MEDICO_STATO',
        'ID_BAMBINO', // Campo formula/computed
      ];

      // Rimuovi tutti i campi read-only
      const safeFields: any = {};
      for (const [key, value] of Object.entries(fields)) {
        if (!readOnlyFields.includes(key)) {
          safeFields[key] = value;
        } else {
          console.log(`[Airtable] updateBambino - Removed read-only field: ${key}`);
        }
      }

      console.log('[Airtable] updateBambino - Safe fields to update:', Object.keys(safeFields));

      console.log('[Airtable] updateBambino - Making PATCH request...');
      const data = await this.request(`TABELLA_BAMBINI/${bambinoId}`, {
        method: 'PATCH',
        body: JSON.stringify({ fields: safeFields }),
      }) as Bambino;
      
      console.log('[Airtable] updateBambino - Success, updated bambino:', data.id);
      return data;
    } catch (error) {
      console.error('[Airtable] updateBambino - Error:', error);
      if (error instanceof Error) {
        console.error('[Airtable] updateBambino - Error message:', error.message);
        console.error('[Airtable] updateBambino - Error stack:', error.stack);
      }
      throw error;
    }
  }

  // Elimina bambino (con verifica genitore)
  async deleteBambino(bambinoId: string, genitoreId: string): Promise<boolean> {
    // Prima verifica che il bambino appartenga al genitore
    const bambino = await this.getBambinoById(bambinoId, genitoreId);
    if (!bambino) {
      return false;
    }

    await this.request(`TABELLA_BAMBINI/${bambinoId}`, {
      method: 'DELETE',
    });
    return true;
  }

  // ==================== FOTO BAMBINO ====================

  // Aggiorna foto bambino
  async updateFotoBambino(
    bambinoId: string,
    genitoreId: string,
    fileUrl: string
  ): Promise<Bambino | null> {
    // Verifica che il bambino appartenga al genitore
    const bambino = await this.getBambinoById(bambinoId, genitoreId);
    if (!bambino) {
      return null;
    }

    // Aggiorna con la nuova foto
    // Airtable richiede un URL pubblico accessibile
    const fields: Partial<Bambino['fields']> = {
      FOTO_BAMBINO: [{ url: fileUrl } as any],
    };

    const data = await this.request(`TABELLA_BAMBINI/${bambinoId}`, {
      method: 'PATCH',
      body: JSON.stringify({ fields }),
    }) as Bambino;
    
    return data;
  }

  // ==================== CERTIFICATO MEDICO ====================

  // Aggiorna certificato medico (file + scadenza)
  async updateCertificatoMedico(
    bambinoId: string, 
    genitoreId: string, 
    fileUrl: string,
    scadenza: string
  ): Promise<Bambino | null> {
    // Verifica che il bambino appartenga al genitore
    const bambino = await this.getBambinoById(bambinoId, genitoreId);
    if (!bambino) {
      return null;
    }

    // Aggiorna con il nuovo certificato
    // Airtable richiede un URL pubblico accessibile
    const fields: Partial<Bambino['fields']> = {
      CERTIFICATO_MEDICO_FILE: [{ url: fileUrl } as any],
      CERTIFICATO_MEDICO_SCADENZA: scadenza,
    };

    const data = await this.request(`TABELLA_BAMBINI/${bambinoId}`, {
      method: 'PATCH',
      body: JSON.stringify({ fields }),
    }) as Bambino;
    
    return data;
  }

  // Metodo fallback: salva solo la data di scadenza senza file
  // Utile quando R2 non è configurato
  async updateCertificatoMedicoWithBase64(
    bambinoId: string, 
    genitoreId: string, 
    _fileData: string, // Non usato, Airtable non accetta base64
    _fileName: string,
    scadenza: string
  ): Promise<Bambino | null> {
    // Verifica che il bambino appartenga al genitore
    const bambino = await this.getBambinoById(bambinoId, genitoreId);
    if (!bambino) {
      return null;
    }

    // ATTENZIONE: Questo metodo NON può caricare il file perché Airtable
    // richiede URL pubblici. Salva solo la data di scadenza.
    // Per caricare file, configurare R2 bucket.
    console.warn('[Airtable] Cannot upload file without R2. Only updating expiry date.');
    
    const fields: Partial<Bambino['fields']> = {
      CERTIFICATO_MEDICO_SCADENZA: scadenza,
      // Non possiamo aggiornare CERTIFICATO_MEDICO_FILE senza R2
    };

    const data = await this.request(`TABELLA_BAMBINI/${bambinoId}`, {
      method: 'PATCH',
      body: JSON.stringify({ fields }),
    }) as Bambino;
    
    return data;
  }

  // ==================== TARIFFE ====================

  // Ottieni tutte le tariffe
  async getTariffe(): Promise<Tariffa[]> {
    try {
      console.log('[Airtable] Fetching all tariffe');
      const data = await this.request('TABELLA_TARIFFE') as AirtableResponse<Tariffa>;
      return data.records || [];
    } catch (error) {
      console.error('[Airtable] Error fetching tariffe:', error);
      return [];
    }
  }

  // Ottieni tariffa per ID
  async getTariffaById(tariffaId: string): Promise<Tariffa | null> {
    try {
      console.log(`[Airtable] Fetching tariffa: ${tariffaId}`);
      const data = await this.request(`TABELLA_TARIFFE/${tariffaId}`) as Tariffa;
      return data;
    } catch (error) {
      console.error('[Airtable] Error fetching tariffa by ID:', error);
      return null;
    }
  }

  // Ottieni tariffa attiva per anno specifico
  async getTariffaAttivaPerAnno(anno: string): Promise<Tariffa | null> {
    try {
      console.log(`[Airtable] Fetching tariffa attiva for year: ${anno}`);
      const formula = `AND({ANNO_ISCRIZIONE}="${anno}", {ATTIVA}=TRUE())`;
      const data = await this.request(
        `TABELLA_TARIFFE?filterByFormula=${encodeURIComponent(formula)}`
      ) as AirtableResponse<Tariffa>;
      
      if (data.records && data.records.length > 0) {
        console.log('[Airtable] Found active tariffa for year:', anno);
        return data.records[0];
      }
      
      console.log('[Airtable] No active tariffa found for year:', anno);
      return null;
    } catch (error) {
      console.error('[Airtable] Error fetching tariffa attiva:', error);
      return null;
    }
  }

  // ==================== ISCRIZIONI ====================

  // Crea una nuova iscrizione
  async createIscrizione(fields: Iscrizione['fields']): Promise<Iscrizione> {
    console.log('[Airtable] Creating iscrizione with fields:', fields);
    const data = await this.request('TABELLA_ISCRIZIONI', {
      method: 'POST',
      body: JSON.stringify({ fields }),
    }) as Iscrizione;
    return data;
  }

  // Ottieni tutte le iscrizioni di un genitore
  async getIscrizioniByGenitore(genitoreId: string): Promise<Iscrizione[]> {
    try {
      console.log(`[Airtable] Fetching iscrizioni for genitore: ${genitoreId}`);
      
      // Ottieni tutte le iscrizioni
      const allData = await this.request('TABELLA_ISCRIZIONI') as AirtableResponse<Iscrizione>;
      
      if (!allData.records || allData.records.length === 0) {
        console.log('[Airtable] No iscrizioni found');
        return [];
      }

      // Filtra manualmente per genitore
      const iscrizioni = allData.records.filter(iscrizione => {
        return iscrizione.fields.TABELLA_GENITORI && 
               iscrizione.fields.TABELLA_GENITORI.includes(genitoreId);
      });
      
      console.log(`[Airtable] Found ${iscrizioni.length} iscrizioni for this genitore`);
      return iscrizioni;
    } catch (error) {
      console.error('[Airtable] Error fetching iscrizioni:', error);
      
      if (error instanceof Error && error.message.includes('404')) {
        console.log('[Airtable] TABELLA_ISCRIZIONI does not exist yet');
        return [];
      }
      
      throw error;
    }
  }

  // Ottieni iscrizioni per un bambino specifico
  async getIscrizioniByBambino(bambinoId: string, genitoreId: string): Promise<Iscrizione[]> {
    try {
      console.log(`[Airtable] Fetching iscrizioni for bambino: ${bambinoId}`);
      
      const allIscrizioni = await this.getIscrizioniByGenitore(genitoreId);
      
      // Filtra per bambino
      const iscrizioni = allIscrizioni.filter(iscrizione => {
        return iscrizione.fields.TABELLA_BAMBINI && 
               iscrizione.fields.TABELLA_BAMBINI.includes(bambinoId);
      });
      
      console.log(`[Airtable] Found ${iscrizioni.length} iscrizioni for this bambino`);
      return iscrizioni;
    } catch (error) {
      console.error('[Airtable] Error fetching iscrizioni by bambino:', error);
      return [];
    }
  }

  // Controlla se esiste già un'iscrizione per bambino + anno
  async checkIscrizioneDuplicata(bambinoId: string, tariffaId: string, genitoreId: string): Promise<boolean> {
    try {
      const iscrizioni = await this.getIscrizioniByBambino(bambinoId, genitoreId);
      
      // Verifica se esiste già un'iscrizione con la stessa tariffa
      const duplicata = iscrizioni.some(iscrizione => {
        return iscrizione.fields.TABELLA_TARIFFE && 
               iscrizione.fields.TABELLA_TARIFFE.includes(tariffaId);
      });
      
      console.log('[Airtable] Check duplicata:', duplicata);
      return duplicata;
    } catch (error) {
      console.error('[Airtable] Error checking duplicata:', error);
      return false;
    }
  }

  // Ottieni iscrizione per ID (con verifica genitore)
  async getIscrizioneById(iscrizioneId: string, genitoreId: string): Promise<Iscrizione | null> {
    try {
      console.log(`[Airtable] Fetching iscrizione ${iscrizioneId} for genitore ${genitoreId}`);
      const iscrizione = await this.request(`TABELLA_ISCRIZIONI/${iscrizioneId}`) as Iscrizione;
      
      console.log('[Airtable] Fetched iscrizione:', iscrizione.id, 'TABELLA_GENITORI:', iscrizione.fields.TABELLA_GENITORI);
      
      // Verifica che l'iscrizione appartenga al genitore
      if (iscrizione.fields.TABELLA_GENITORI && iscrizione.fields.TABELLA_GENITORI.includes(genitoreId)) {
        console.log('[Airtable] Iscrizione belongs to genitore - OK');
        return iscrizione;
      }
      
      console.log('[Airtable] Iscrizione does not belong to this genitore');
      return null;
    } catch (error) {
      console.error('[Airtable] Error fetching iscrizione by ID:', error);
      return null;
    }
  }

  // Aggiorna iscrizione (con verifica genitore)
  async updateIscrizione(iscrizioneId: string, genitoreId: string, fields: Partial<Iscrizione['fields']>): Promise<Iscrizione | null> {
    try {
      console.log(`[Airtable] updateIscrizione - Start`);
      console.log(`[Airtable] updateIscrizione - iscrizioneId: ${iscrizioneId}`);
      console.log(`[Airtable] updateIscrizione - genitoreId: ${genitoreId}`);
      console.log(`[Airtable] updateIscrizione - fields to update:`, Object.keys(fields));
      
      // Prima verifica che l'iscrizione appartenga al genitore
      const iscrizione = await this.getIscrizioneById(iscrizioneId, genitoreId);
      if (!iscrizione) {
        console.log('[Airtable] updateIscrizione - Iscrizione not found or not authorized');
        return null;
      }

      console.log('[Airtable] updateIscrizione - Iscrizione found, proceeding with update');

      // Lista di campi read-only che non devono essere mai modificati
      const readOnlyFields = [
        'TABELLA_GENITORI',
        'TABELLA_BAMBINI',
        'TABELLA_TARIFFE',
        'DATA_ISCRIZIONE',
        'STATO_ISCRIZIONE',
        'ANNO_ISCRIZIONE',
        'NOME BAMBINO',
        'COGNOME BAMBINO',
        'CATEGORIA',
      ];

      // Rimuovi tutti i campi read-only
      const safeFields: any = {};
      for (const [key, value] of Object.entries(fields)) {
        if (!readOnlyFields.includes(key)) {
          safeFields[key] = value;
        } else {
          console.log(`[Airtable] updateIscrizione - Removed read-only field: ${key}`);
        }
      }

      console.log('[Airtable] updateIscrizione - Safe fields to update:', Object.keys(safeFields));

      console.log('[Airtable] updateIscrizione - Making PATCH request...');
      const data = await this.request(`TABELLA_ISCRIZIONI/${iscrizioneId}`, {
        method: 'PATCH',
        body: JSON.stringify({ fields: safeFields }),
      }) as Iscrizione;
      
      console.log('[Airtable] updateIscrizione - Success, updated iscrizione:', data.id);
      return data;
    } catch (error) {
      console.error('[Airtable] updateIscrizione - Error:', error);
      if (error instanceof Error) {
        console.error('[Airtable] updateIscrizione - Error message:', error.message);
        console.error('[Airtable] updateIscrizione - Error stack:', error.stack);
      }
      throw error;
    }
  }

  // Aggiorna regolamento firmato iscrizione
  async updateRegolamentoFirmato(
    iscrizioneId: string,
    genitoreId: string,
    fileUrl: string
  ): Promise<Iscrizione | null> {
    // Verifica che l'iscrizione appartenga al genitore
    const iscrizione = await this.getIscrizioneById(iscrizioneId, genitoreId);
    if (!iscrizione) {
      return null;
    }

    // Aggiorna con il nuovo regolamento
    const fields: Partial<Iscrizione['fields']> = {
      REGOLAMENTO_FIRMATO_FILE: [{ url: fileUrl } as any],
    };

    const data = await this.request(`TABELLA_ISCRIZIONI/${iscrizioneId}`, {
      method: 'PATCH',
      body: JSON.stringify({ fields }),
    }) as Iscrizione;
    
    return data;
  }
}

// Helper per ottenere il client Airtable con le env vars
export function getAirtableClient(runtime?: any): AirtableClient | null {
  let baseId: string | undefined;
  let token: string | undefined;

  // Prova diversi modi di accedere alle variabili
  // 1. Da runtime.env (Cloudflare Workers in produzione)
  if (runtime?.env) {
    baseId = runtime.env.AIRTABLE_BASE_ID;
    // Prova sia AIRTABLE_API_KEY che AIRTABLE_TOKEN
    token = runtime.env.AIRTABLE_API_KEY || runtime.env.AIRTABLE_TOKEN;
  }

  // 2. Da runtime direttamente (a volte le env vars sono qui)
  if (!baseId && runtime?.AIRTABLE_BASE_ID) {
    baseId = runtime.AIRTABLE_BASE_ID;
  }
  if (!token) {
    token = runtime?.AIRTABLE_API_KEY || runtime?.AIRTABLE_TOKEN;
  }

  // 3. Fallback a import.meta.env (sviluppo locale o build-time)
  if (!baseId) {
    baseId = import.meta.env.AIRTABLE_BASE_ID;
  }
  if (!token) {
    token = import.meta.env.AIRTABLE_API_KEY || import.meta.env.AIRTABLE_TOKEN;
  }

  // 4. Prova anche process.env (per sicurezza)
  if (!baseId && typeof process !== 'undefined' && process.env) {
    baseId = process.env.AIRTABLE_BASE_ID;
  }
  if (!token && typeof process !== 'undefined' && process.env) {
    token = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_TOKEN;
  }

  // Log dettagliato per debugging
  console.log('=== AIRTABLE CLIENT INITIALIZATION ===');
  console.log('Runtime provided:', !!runtime);
  console.log('Runtime.env exists:', !!runtime?.env);
  console.log('Runtime.env.AIRTABLE_BASE_ID:', !!runtime?.env?.AIRTABLE_BASE_ID);
  console.log('Runtime.env.AIRTABLE_API_KEY:', !!runtime?.env?.AIRTABLE_API_KEY);
  console.log('Runtime.env.AIRTABLE_TOKEN:', !!runtime?.env?.AIRTABLE_TOKEN);
  console.log('Final baseId found:', !!baseId);
  console.log('Final token found:', !!token);
  console.log('======================================');

  if (!baseId || !token) {
    console.error('❌ Airtable credentials not configured');
    console.error('Missing:', {
      baseId: !baseId,
      token: !token
    });
    return null;
  }

  console.log('✅ Airtable client created successfully');
  return new AirtableClient(baseId, token);
}
