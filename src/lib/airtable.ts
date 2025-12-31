// Airtable client configuration
// Variabili d'ambiente richieste:
// - AIRTABLE_BASE_ID
// - AIRTABLE_TOKEN (o AIRTABLE_API_KEY come fallback)

/**
 * REGOLE DI BUSINESS:
 * 1. Ogni BAMBINO può avere UNA SOLA ISCRIZIONE
 * 2. L'iscrizione vale SOLO per l'anno solare corrente
 * 3. L'anno NON è selezionabile dall'utente
 * 4. Campi formula/lookup sono SEMPRE read-only
 * 
 * IMPORTANTE: I campi lookup in Airtable possono avere o NON avere "(from TABELLA_X)" nel nome!
 * Usare SEMPRE i nomi esatti verificati nell'interfaccia di Airtable!
 */

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
    AUTH_USER_ID?: string;
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
    // Campi scrivibili
    NOME_BAMBINO: string;
    COGNOME_BAMBINO: string;
    DATA_NASCITA_BAMBINO: string;
    LUOGO_NASCITA_BAMBINO: string;
    CODICE_FISCALE_BAMBINO: string;
    VIA_RESIDENZA_BAMBINO: string;
    CITTA_RESIDENZA_BAMBINO: string;
    TABELLA_GENITORI?: string[];
    FOTO_BAMBINO?: AirtableAttachment[];
    CERTIFICATO_MEDICO_FILE?: AirtableAttachment[];
    CERTIFICATO_MEDICO_SCADENZA?: string;
    // Campi read-only (formula/lookup)
    ID_BAMBINO?: string;
    CERTIFICATO_MEDICO_STATO?: string;
    GENITORE_RECORD_ID_LOOKUP?: string[];
  };
}

export interface Tariffa {
  id?: string;
  fields: {
    ANNO_ISCRIZIONE: string;
    QUOTA_TOTALE_ANNO: number;
    IMPORTO_ISCRIZIONE: number;
    NUMERO_RATE: number;
    IMPORTO_RATA: number;
    SCADENZA_RATE?: string;
    IMPORTO_KIT_SCUOLA?: number;
    DESCRIZIONE_KIT?: string;
    ATTIVA: boolean;
  };
}

export interface Iscrizione {
  id?: string;
  fields: {
    // Campi scrivibili
    TABELLA_GENITORI: string[];
    TABELLA_BAMBINI: string[];
    TABELLA_TARIFFE: string[];
    DATA_ISCRIZIONE?: string;
    PRIVACY_MINORE?: boolean;
    TAGLIA_MAGLIA?: string;
    TAGLIA_PANTALONCINO?: string;
    TAGLIA_TUTA?: string;
    PRIVACY_DATI_PERSONALI?: boolean;
    DATA_FIRMA_REGOLAMENTO?: string;
    REGOLAMENTO_FIRMATO?: AirtableAttachment[];
    STATO_ISCRIZIONE?: string;
    // Campi read-only (formula/lookup) - NOMI ESATTI verificati su Airtable
    ID_ISCRIZIONE?: string | string[];
    PROGRESSIVO_ISCRIZIONE?: number | number[];
    CHIAVE_UNIVOCA_ISCRIZIONE?: string | string[];
    CATEGORIA_FCI?: string | string[]; // SENZA "(from TABELLA_BAMBINI)"!
    'NOME_BAMBINO (from TABELLA_BAMBINI)'?: string | string[];
    'COGNOME_BAMBINO (from TABELLA_BAMBINI)'?: string | string[];
    'DATA_NASCITA_BAMBINO (from TABELLA_BAMBINI)'?: string | string[];
    'CODICE_FISCALE_BAMBINO (from TABELLA_BAMBINI)'?: string | string[];
    'VIA_RESIDENZA_BAMBINO (from TABELLA_BAMBINI)'?: string | string[];
    'CITTA_RESIDENZA_BAMBINO (from TABELLA_BAMBINI)'?: string | string[];
    'LUOGO_NASCITA_BAMBINO (from TABELLA_BAMBINI)'?: string | string[];
    'NOME_GENITORE (from TABELLA_GENITORI)'?: string | string[];
    'COGNOME_GENITORE (from TABELLA_GENITORI)'?: string | string[];
    'EMAIL_GENITORE (from TABELLA_GENITORI)'?: string | string[];
    'ANNO_ISCRIZIONE (from TABELLA_TARIFFE)'?: string | string[];
    'QUOTA_TOTALE_ANNO (from TABELLA_TARIFFE)'?: number | number[];
    'NUMERO_RATE (from TABELLA_TARIFFE)'?: number | number[];
    'IMPORTO_RATA (from TABELLA_TARIFFE)'?: number | number[];
    'SCADENZA_RATE (from TABELLA_TARIFFE)'?: string | string[];
    'IMPORTO_KIT_SCUOLA (from TABELLA_TARIFFE)'?: number | number[];
    'IMPORTO_ISCRIZIONE (from TABELLA_TARIFFE)'?: number | number[];
    'CERTIFICATO_MEDICO_STATO (from TABELLA_BAMBINI)'?: string | string[];
    GENITORE_RECORD_ID_LOOKUP?: string[] | string[][];
  };
}

interface AirtableResponse<T> {
  records?: T[];
  offset?: string;
}

/**
 * Helper per normalizzare i lookup che possono arrivare come array
 */
export function normalizeLookup<T>(value: T | T[] | undefined): T | undefined {
  if (value === undefined || value === null) return undefined;
  if (Array.isArray(value)) {
    return value.length > 0 ? value[0] : undefined;
  }
  return value;
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
    
    // Log safe: method + endpoint (no token, no full URL)
    console.log(`[Airtable] ${options.method || 'GET'} ${endpoint.split('?')[0]}`);
    
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
      console.error(`[Airtable] Error ${response.status}:`, error);
      throw new Error(`Airtable API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Helper generico per listare tutti i record con paginazione automatica
   */
  private async listAllRecords<T>(
    tableName: string,
    params: Record<string, string | undefined> = {}
  ): Promise<T[]> {
    const records: T[] = [];
    let offset: string | undefined = undefined;

    do {
      const search = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') search.set(k, v);
      });
      if (offset) search.set('offset', offset);

      const endpoint = `${tableName}?${search.toString()}`;
      const data = await this.request(endpoint) as { records?: T[]; offset?: string };

      if (data.records?.length) records.push(...data.records);
      offset = data.offset;
    } while (offset);

    return records;
  }

  // ==================== GENITORI ====================

  async createGenitore(fields: Genitore['fields']): Promise<Genitore> {
    const data = await this.request('TABELLA_GENITORI', {
      method: 'POST',
      body: JSON.stringify({ fields }),
    }) as Genitore;
    return data;
  }

  async findGenitoreByEmail(email: string): Promise<Genitore | null> {
    const formula = `{EMAIL_GENITORE}="${email}"`;
    const data = await this.request(
      `TABELLA_GENITORI?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`
    ) as AirtableResponse<Genitore>;
    
    return data.records?.[0] || null;
  }

  async findGenitoreByCF(codiceFiscale: string): Promise<Genitore | null> {
    const cfUpper = codiceFiscale.toUpperCase();
    const formula = `UPPER({CODICE_FISCALE_GENITORE})="${cfUpper}"`;
    const data = await this.request(
      `TABELLA_GENITORI?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`
    ) as AirtableResponse<Genitore>;
    
    return data.records?.[0] || null;
  }

  async findGenitoreByAuthUserId(authUserId: string): Promise<Genitore | null> {
    const formula = `{AUTH_USER_ID}="${authUserId}"`;
    const data = await this.request(
      `TABELLA_GENITORI?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`
    ) as AirtableResponse<Genitore>;
    
    return data.records?.[0] || null;
  }

  async getGenitoreById(recordId: string): Promise<Genitore> {
    const data = await this.request(`TABELLA_GENITORI/${recordId}`) as Genitore;
    return data;
  }

  async updateGenitore(recordId: string, fields: Partial<Genitore['fields']>): Promise<Genitore> {
    const data = await this.request(`TABELLA_GENITORI/${recordId}`, {
      method: 'PATCH',
      body: JSON.stringify({ fields }),
    }) as Genitore;
    return data;
  }

  // ==================== BAMBINI ====================

  async createBambino(fields: Bambino['fields']): Promise<Bambino> {
    // Rimuovi campi read-only prima di creare
    const { ID_BAMBINO, CERTIFICATO_MEDICO_STATO, GENITORE_RECORD_ID_LOOKUP, ...safeFields } = fields;
    
    console.log('[Airtable] Creating bambino');
    const data = await this.request('TABELLA_BAMBINI', {
      method: 'POST',
      body: JSON.stringify({ fields: safeFields }),
    }) as Bambino;
    return data;
  }

  /**
   * Ottieni bambini di un genitore usando GENITORE_RECORD_ID_LOOKUP
   * FIX: ARRAYJOIN sui Linked Record restituisce il primary field, non il recordId
   * Usiamo invece GENITORE_RECORD_ID_LOOKUP che contiene i recordId veri
   */
  async getBambiniByGenitore(genitoreId: string): Promise<Bambino[]> {
    console.log(`[Airtable] Fetching bambini for genitore: ${genitoreId}`);

    // Usa GENITORE_RECORD_ID_LOOKUP invece di TABELLA_GENITORI
    const formula = `FIND("${genitoreId}", ARRAYJOIN({GENITORE_RECORD_ID_LOOKUP}, ","))`;
    console.log(`[Airtable] Using formula (bambini): ${formula}`);

    const records = await this.listAllRecords<Bambino>('TABELLA_BAMBINI', {
      filterByFormula: formula,
    });

    console.log(`[Airtable] Found ${records.length} bambini`);
    return records;
  }

  async getBambinoById(bambinoId: string, genitoreId: string): Promise<Bambino | null> {
    try {
      const bambino = await this.request(`TABELLA_BAMBINI/${bambinoId}`) as Bambino;
      
      // Verifica appartenenza usando TABELLA_GENITORI (linked record)
      if (bambino.fields.TABELLA_GENITORI?.includes(genitoreId)) {
        console.log('[Airtable] Bambino belongs to genitore');
        return bambino;
      }
      
      console.warn('[Airtable] Bambino does not belong to this genitore');
      return null;
    } catch (error) {
      console.error('[Airtable] Error fetching bambino:', error);
      return null;
    }
  }

  async updateBambino(
    bambinoId: string, 
    genitoreId: string, 
    fields: Partial<Bambino['fields']>
  ): Promise<Bambino | null> {
    try {
      // Verifica appartenenza
      const bambino = await this.getBambinoById(bambinoId, genitoreId);
      if (!bambino) {
        console.warn('[Airtable] Cannot update: bambino not found or unauthorized');
        return null;
      }

      // Rimuovi campi read-only
      const { 
        TABELLA_GENITORI, 
        ID_BAMBINO, 
        CERTIFICATO_MEDICO_STATO,
        GENITORE_RECORD_ID_LOOKUP,
        ...safeFields 
      } = fields;

      console.log('[Airtable] Updating bambino');
      const data = await this.request(`TABELLA_BAMBINI/${bambinoId}`, {
        method: 'PATCH',
        body: JSON.stringify({ fields: safeFields }),
      }) as Bambino;
      
      return data;
    } catch (error) {
      console.error('[Airtable] Error updating bambino:', error);
      throw error;
    }
  }

  async deleteBambino(bambinoId: string, genitoreId: string): Promise<boolean> {
    const bambino = await this.getBambinoById(bambinoId, genitoreId);
    if (!bambino) return false;

    await this.request(`TABELLA_BAMBINI/${bambinoId}`, {
      method: 'DELETE',
    });
    return true;
  }

  async updateFotoBambino(
    bambinoId: string,
    genitoreId: string,
    fileUrl: string
  ): Promise<Bambino | null> {
    const bambino = await this.getBambinoById(bambinoId, genitoreId);
    if (!bambino) return null;

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

  async updateCertificatoMedico(
    bambinoId: string, 
    genitoreId: string, 
    fileUrl: string,
    scadenza: string
  ): Promise<Bambino | null> {
    const bambino = await this.getBambinoById(bambinoId, genitoreId);
    if (!bambino) return null;

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

  // ==================== TARIFFE ====================

  async getTariffe(): Promise<Tariffa[]> {
    try {
      const data = await this.request('TABELLA_TARIFFE') as AirtableResponse<Tariffa>;
      return data.records || [];
    } catch (error) {
      console.error('[Airtable] Error fetching tariffe:', error);
      return [];
    }
  }

  async getTariffaById(tariffaId: string): Promise<Tariffa | null> {
    try {
      const data = await this.request(`TABELLA_TARIFFE/${tariffaId}`) as Tariffa;
      return data;
    } catch (error) {
      console.error('[Airtable] Error fetching tariffa:', error);
      return null;
    }
  }

  /**
   * Ottieni la tariffa attiva per l'anno corrente
   * Regola: ANNO_ISCRIZIONE = anno corrente E ATTIVA = true
   */
  async getTariffaAttivaAnnoCorrente(): Promise<Tariffa | null> {
    try {
      const annoCorrente = new Date().getFullYear().toString();
      console.log(`[Airtable] Fetching tariffa attiva for year: ${annoCorrente}`);
      
      const formula = `AND({ANNO_ISCRIZIONE}="${annoCorrente}", {ATTIVA}=TRUE())`;
      const data = await this.request(
        `TABELLA_TARIFFE?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`
      ) as AirtableResponse<Tariffa>;
      
      if (data.records && data.records.length > 0) {
        console.log('[Airtable] Found active tariffa');
        return data.records[0];
      }
      
      console.warn('[Airtable] No active tariffa found for current year');
      return null;
    } catch (error) {
      console.error('[Airtable] Error fetching tariffa attiva:', error);
      return null;
    }
  }

  // ==================== ISCRIZIONI ====================

  /**
   * Crea una nuova iscrizione
   * ATTENZIONE: Verificare prima che non esista già un'iscrizione per il bambino
   */
  async createIscrizione(fields: Iscrizione['fields']): Promise<Iscrizione> {
    // Rimuovi tutti i campi read-only (con o senza "(from TABELLA_X)")
    const {
      ID_ISCRIZIONE,
      PROGRESSIVO_ISCRIZIONE,
      STATO_ISCRIZIONE, // SENZA suffisso!
      CHIAVE_UNIVOCA_ISCRIZIONE,
      CATEGORIA_FCI, // SENZA suffisso!
      'NOME_BAMBINO (from TABELLA_BAMBINI)': _nomeBambino,
      'COGNOME_BAMBINO (from TABELLA_BAMBINI)': _cognomeBambino,
      'DATA_NASCITA_BAMBINO (from TABELLA_BAMBINI)': _dataNascitaBambino,
      'CODICE_FISCALE_BAMBINO (from TABELLA_BAMBINI)': _codiceFiscaleBambino,
      'VIA_RESIDENZA_BAMBINO (from TABELLA_BAMBINI)': _viaResidenzaBambino,
      'CITTA_RESIDENZA_BAMBINO (from TABELLA_BAMBINI)': _cittaResidenzaBambino,
      'LUOGO_NASCITA_BAMBINO (from TABELLA_BAMBINI)': _luogoNascitaBambino,
      'NOME_GENITORE (from TABELLA_GENITORI)': _nomeGenitore,
      'COGNOME_GENITORE (from TABELLA_GENITORI)': _cognomeGenitore,
      'EMAIL_GENITORE (from TABELLA_GENITORI)': _emailGenitore,
      'ANNO_ISCRIZIONE (from TABELLA_TARIFFE)': _annoIscrizione,
      'QUOTA_TOTALE_ANNO (from TABELLA_TARIFFE)': _quotaTotaleAnno,
      'NUMERO_RATE (from TABELLA_TARIFFE)': _numeroRate,
      'IMPORTO_RATA (from TABELLA_TARIFFE)': _importoRata,
      'SCADENZA_RATE (from TABELLA_TARIFFE)': _scadenzaRate,
      'IMPORTO_KIT_SCUOLA (from TABELLA_TARIFFE)': _importoKitScuola,
      'IMPORTO_ISCRIZIONE (from TABELLA_TARIFFE)': _importoIscrizione,
      'CERTIFICATO_MEDICO_STATO (from TABELLA_BAMBINI)': _certificatoMedicoStato,
      GENITORE_RECORD_ID_LOOKUP,
      ...safeFields
    } = fields;

    console.log('[Airtable] Creating iscrizione');
    const data = await this.request('TABELLA_ISCRIZIONI', {
      method: 'POST',
      body: JSON.stringify({ fields: safeFields }),
    }) as Iscrizione;
    return data;
  }

  /**
   * Ottieni iscrizioni di un genitore usando GENITORE_RECORD_ID_LOOKUP
   * FIX: ARRAYJOIN sui Linked Record restituisce il primary field, non il recordId
   * Usiamo invece GENITORE_RECORD_ID_LOOKUP che contiene i recordId veri
   */
  async getIscrizioniByGenitore(genitoreId: string): Promise<Iscrizione[]> {
    console.log(`[Airtable] Fetching iscrizioni for genitore: ${genitoreId}`);

    // Usa GENITORE_RECORD_ID_LOOKUP invece di TABELLA_GENITORI
    const formula = `FIND("${genitoreId}", ARRAYJOIN({GENITORE_RECORD_ID_LOOKUP}, ","))`;
    console.log(`[Airtable] Using formula (iscrizioni): ${formula}`);

    const records = await this.listAllRecords<Iscrizione>('TABELLA_ISCRIZIONI', {
      filterByFormula: formula,
    });

    console.log(`[Airtable] Found ${records.length} iscrizioni`);
    return records;
  }

  /**
   * Ottieni iscrizioni per un bambino specifico
   */
  async getIscrizioniByBambino(bambinoId: string, genitoreId: string): Promise<Iscrizione[]> {
    try {
      console.log(`[Airtable] Fetching iscrizioni for bambino: ${bambinoId}`);
      
      const allIscrizioni = await this.getIscrizioniByGenitore(genitoreId);
      
      // Filtra per bambino in memoria (piccolo dataset dopo il primo filtro)
      const iscrizioni = allIscrizioni.filter(iscrizione => {
        return iscrizione.fields.TABELLA_BAMBINI?.includes(bambinoId);
      });
      
      console.log(`[Airtable] Found ${iscrizioni.length} iscrizioni for bambino`);
      return iscrizioni;
    } catch (error) {
      console.error('[Airtable] Error fetching iscrizioni by bambino:', error);
      return [];
    }
  }

  /**
   * REGOLA BUSINESS: Ogni bambino può avere UNA SOLA iscrizione
   * Controlla se esiste già un'iscrizione per il bambino
   */
  async checkIscrizioneEsistente(bambinoId: string, genitoreId: string): Promise<boolean> {
    try {
      console.log(`[Airtable] Checking existing iscrizione for bambino: ${bambinoId}`);
      
      const iscrizioni = await this.getIscrizioniByBambino(bambinoId, genitoreId);
      const esiste = iscrizioni.length > 0;
      
      if (esiste) {
        console.warn('[Airtable] Iscrizione già esistente per questo bambino');
      }
      
      return esiste;
    } catch (error) {
      console.error('[Airtable] Error checking iscrizione esistente:', error);
      return false;
    }
  }

  async getIscrizioneById(iscrizioneId: string, genitoreId: string): Promise<Iscrizione | null> {
    try {
      const iscrizione = await this.request(`TABELLA_ISCRIZIONI/${iscrizioneId}`) as Iscrizione;
      
      // Verifica appartenenza usando TABELLA_GENITORI (linked record)
      if (iscrizione.fields.TABELLA_GENITORI?.includes(genitoreId)) {
        return iscrizione;
      }
      
      console.warn('[Airtable] Iscrizione does not belong to this genitore');
      return null;
    } catch (error) {
      console.error('[Airtable] Error fetching iscrizione:', error);
      return null;
    }
  }

  async updateIscrizione(
    iscrizioneId: string, 
    genitoreId: string, 
    fields: Partial<Iscrizione['fields']>
  ): Promise<Iscrizione | null> {
    try {
      // Verifica appartenenza
      const iscrizione = await this.getIscrizioneById(iscrizioneId, genitoreId);
      if (!iscrizione) {
        console.warn('[Airtable] Cannot update: iscrizione not found or unauthorized');
        return null;
      }

      // Rimuovi TUTTI i campi read-only (con o senza "(from TABELLA_X)")
      const {
        TABELLA_GENITORI,
        TABELLA_BAMBINI,
        TABELLA_TARIFFE,
        ID_ISCRIZIONE,
        PROGRESSIVO_ISCRIZIONE,
        CHIAVE_UNIVOCA_ISCRIZIONE,
        CATEGORIA_FCI, // SENZA suffisso!
        'NOME_BAMBINO (from TABELLA_BAMBINI)': _nomeBambino,
        'COGNOME_BAMBINO (from TABELLA_BAMBINI)': _cognomeBambino,
        'DATA_NASCITA_BAMBINO (from TABELLA_BAMBINI)': _dataNascitaBambino,
        'CODICE_FISCALE_BAMBINO (from TABELLA_BAMBINI)': _codiceFiscaleBambino,
        'VIA_RESIDENZA_BAMBINO (from TABELLA_BAMBINI)': _viaResidenzaBambino,
        'CITTA_RESIDENZA_BAMBINO (from TABELLA_BAMBINI)': _cittaResidenzaBambino,
        'LUOGO_NASCITA_BAMBINO (from TABELLA_BAMBINI)': _luogoNascitaBambino,
        'NOME_GENITORE (from TABELLA_GENITORI)': _nomeGenitore,
        'COGNOME_GENITORE (from TABELLA_GENITORI)': _cognomeGenitore,
        'EMAIL_GENITORE (from TABELLA_GENITORI)': _emailGenitore,
        'ANNO_ISCRIZIONE (from TABELLA_TARIFFE)': _annoIscrizione,
        'QUOTA_TOTALE_ANNO (from TABELLA_TARIFFE)': _quotaTotaleAnno,
        'NUMERO_RATE (from TABELLA_TARIFFE)': _numeroRate,
        'IMPORTO_RATA (from TABELLA_TARIFFE)': _importoRata,
        'SCADENZA_RATE (from TABELLA_TARIFFE)': _scadenzaRate,
        'IMPORTO_KIT_SCUOLA (from TABELLA_TARIFFE)': _importoKitScuola,
        'IMPORTO_ISCRIZIONE (from TABELLA_TARIFFE)': _importoIscrizione,
        'CERTIFICATO_MEDICO_STATO (from TABELLA_BAMBINI)': _certificatoMedicoStato,
        GENITORE_RECORD_ID_LOOKUP,
        ...safeFields
      } = fields;

      console.log('[Airtable] Updating iscrizione');
      const data = await this.request(`TABELLA_ISCRIZIONI/${iscrizioneId}`, {
        method: 'PATCH',
        body: JSON.stringify({ fields: safeFields }),
      }) as Iscrizione;
      
      return data;
    } catch (error) {
      console.error('[Airtable] Error updating iscrizione:', error);
      throw error;
    }
  }

  /**
   * Aggiorna il regolamento firmato con URL pubblico e data di firma
   */
  async updateRegolamentoFirmato(
    iscrizioneId: string,
    genitoreId: string,
    fileUrl: string,
    dataFirma: string
  ): Promise<Iscrizione | null> {
    try {
      const iscrizione = await this.getIscrizioneById(iscrizioneId, genitoreId);
      if (!iscrizione) return null;

      // Aggiorna URL del file E data di firma
      const fields: Partial<Iscrizione['fields']> = {
        REGOLAMENTO_FIRMATO: [{ url: fileUrl } as any],
        DATA_FIRMA_REGOLAMENTO: dataFirma,
      };

      const data = await this.request(`TABELLA_ISCRIZIONI/${iscrizioneId}`, {
        method: 'PATCH',
        body: JSON.stringify({ fields }),
      }) as Iscrizione;
      
      return data;
    } catch (error) {
      // Se fallisce, logga un warning chiaro
      if (error instanceof Error && error.message.includes('UNKNOWN_FIELD_NAME')) {
        console.warn('[Airtable] REGOLAMENTO_FIRMATO or DATA_FIRMA_REGOLAMENTO field does not exist');
      } else if (error instanceof Error && error.message.includes('INVALID_VALUE')) {
        console.warn('[Airtable] REGOLAMENTO_FIRMATO is not an attachment field - cannot upload files');
      }
      throw error;
    }
  }
}

// Helper per ottenere il client Airtable
export function getAirtableClient(runtime?: any): AirtableClient | null {
  let baseId: string | undefined;
  let token: string | undefined;

  // Priorità: runtime.env > import.meta.env > process.env
  if (runtime?.env) {
    baseId = runtime.env.AIRTABLE_BASE_ID;
    token = runtime.env.AIRTABLE_TOKEN || runtime.env.AIRTABLE_API_KEY;
  }

  if (!baseId) {
    baseId = import.meta.env.AIRTABLE_BASE_ID;
  }
  if (!token) {
    token = import.meta.env.AIRTABLE_TOKEN || import.meta.env.AIRTABLE_API_KEY;
  }

  if (typeof process !== 'undefined' && process.env) {
    if (!baseId) baseId = process.env.AIRTABLE_BASE_ID;
    if (!token) token = process.env.AIRTABLE_TOKEN || process.env.AIRTABLE_API_KEY;
  }

  if (!baseId || !token) {
    console.error('[Airtable] Missing credentials');
    return null;
  }

  return new AirtableClient(baseId, token);
}
