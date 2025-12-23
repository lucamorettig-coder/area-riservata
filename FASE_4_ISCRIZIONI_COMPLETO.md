# Fase 4: Sistema Iscrizioni - Implementazione Completa

## Panoramica
È stato implementato un sistema completo per la gestione delle iscrizioni dei bambini ai corsi di ciclismo, con tutte le funzionalità richieste.

## Modifiche al Database (Airtable)

### Aggiornamenti Interfacce TypeScript

#### 1. Interfaccia `Bambino` Aggiornata
```typescript
interface Bambino {
  CATEGORIA?: string; // Nuova: Categoria del bambino (es. "G6", "Esordienti")
  // ... altri campi esistenti
}
```

#### 2. Interfaccia `Iscrizione` Estesa
```typescript
interface Iscrizione {
  fields: {
    // Linked Records (OBBLIGATORI)
    TABELLA_GENITORI: string[];
    TABELLA_BAMBINI: string[];
    TABELLA_TARIFFE: string[];
    
    // Campi read-only (formula/lookup da Airtable)
    DATA_ISCRIZIONE?: string;
    STATO_ISCRIZIONE?: string; // "Completa", "Incompleta"
    ANNO_ISCRIZIONE?: string;
    NOME_BAMBINO?: string;
    COGNOME_BAMBINO?: string;
    CATEGORIA?: string;
    
    // Gestione Privacy GDPR per FCI
    PRIVACY_GDPR_FCI?: boolean;
    
    // Gestione Kit Scuola
    TAGLIA_MAGLIA?: string;
    TAGLIA_PANTALONCINO?: string;
    TAGLIA_TUTA?: string;
    
    // Regolamento firmato
    REGOLAMENTO_FIRMATO_FILE?: AirtableAttachment[];
  };
}
```

### Nuovi Metodi AirtableClient

#### Gestione Iscrizioni
- `getIscrizioniByGenitore(genitoreId)` - Lista iscrizioni del genitore
- `getIscrizioniByBambino(bambinoId, genitoreId)` - Iscrizioni di un bambino
- `getIscrizioneById(iscrizioneId, genitoreId)` - Dettaglio iscrizione
- `createIscrizione(fields)` - Crea nuova iscrizione
- `updateIscrizione(iscrizioneId, genitoreId, fields)` - Aggiorna iscrizione
- `checkIscrizioneDuplicata(bambinoId, tariffaId, genitoreId)` - Verifica duplicati
- `updateRegolamentoFirmato(iscrizioneId, genitoreId, fileUrl)` - Carica regolamento

## Nuovi Componenti React

### 1. DettaglioIscrizione.tsx
Componente completo per visualizzare e gestire i dettagli di un'iscrizione.

**Funzionalità:**
- Visualizza dati bambino (nome, cognome, categoria)
- Badge categoria evidenziato con shadow
- Mostra anno iscrizione
- Tabella tariffe dettagliata con tutti gli importi
- Gestione privacy GDPR per FCI (checkbox)
- Gestione taglie kit scuola (3 campi input)
- Descrizione kit scuola (dal campo DESCRIZIONE_KIT della tariffa)
- Upload regolamento firmato (PDF, max 5MB)
- Possibilità di sostituire il regolamento
- Salvataggio dati con feedback visivo
- Pulsante indietro alla dashboard

**Stile:**
- Card con shadow `0 2px 5px 0 rgba(0,0,0,0.2)`
- Icone svg per ogni sezione
- Messaggi di successo/errore con colori del design system

### 2. ListaIscrizioni.tsx
Componente per visualizzare la lista delle iscrizioni (dashboard e dettaglio bambino).

**Funzionalità:**
- Lista iscrizioni con card cliccabili
- Filtro opzionale per bambino specifico
- Badge stato iscrizione (Completa/Incompleta)
- Categoria bambino in badge
- Data iscrizione e anno
- Indicatori visivi per: Privacy GDPR, Regolamento, Kit Scuola
- Pulsante "Nuova Iscrizione"
- Stato vuoto con messaggio informativo

**Stile:**
- Card con shadow e hover effect
- Badge colorati per stato
- Icone check per dati completati

### 3. NuovaIscrizioneForm.tsx
Form per creare una nuova iscrizione.

**Funzionalità:**
- Select per scegliere il bambino (con categoria se presente)
- Pre-selezione bambino da query string (`?bambinoId=xxx`)
- Visualizzazione tariffa attiva anno corrente
- Tabella dettagliata con tutti gli importi
- Validazione: controllo duplicati (bambino + anno)
- Redirect automatico al dettaglio dopo creazione
- Pulsanti Annulla/Crea

**Gestione Stati:**
- Nessun bambino registrato → Link "Aggiungi Bambino"
- Nessuna tariffa attiva → Messaggio errore
- Duplicato → Messaggio errore specifico

### 4. IscrizioniBambino.tsx
Componente wrapper per la sezione iscrizioni nel dettaglio bambino.

**Funzionalità:**
- Sezione collassabile (Mostra/Nascondi)
- Header con icona e titolo
- Include ListaIscrizioni filtrato per bambino
- Pulsante per nuova iscrizione (con bambinoId pre-compilato)

## Nuove API Routes

### Iscrizioni

#### `/api/iscrizioni` (GET)
- Ottiene tutte le iscrizioni del genitore autenticato
- Supporta query param `?bambinoId=xxx` per filtrare
- Ritorna: `{ iscrizioni: Iscrizione[] }`

#### `/api/iscrizioni` (POST)
- Crea una nuova iscrizione
- Body: `{ bambinoId: string, tariffaId: string }`
- Validazioni:
  - Verifica proprietà bambino
  - Controllo duplicati (bambino + tariffa)
- Ritorna: `{ success: true, iscrizione: Iscrizione }`

#### `/api/iscrizioni/[id]` (GET)
- Ottiene dettaglio iscrizione
- Verifica proprietà genitore
- Ritorna: `{ iscrizione: Iscrizione }`

#### `/api/iscrizioni/[id]` (PATCH)
- Aggiorna iscrizione (privacy, taglie)
- Body: `{ PRIVACY_GDPR_FCI?, TAGLIA_MAGLIA?, TAGLIA_PANTALONCINO?, TAGLIA_TUTA? }`
- Campi read-only automaticamente esclusi
- Ritorna: `{ success: true, iscrizione: Iscrizione }`

#### `/api/iscrizioni/[id]/regolamento` (POST)
- Upload regolamento firmato (PDF)
- FormData con campo `file`
- Validazioni:
  - Solo PDF
  - Max 5MB
- Upload su R2 bucket
- Salva URL in Airtable
- Ritorna: `{ success: true, iscrizione: Iscrizione, fileUrl: string }`

### Tariffe

#### `/api/tariffe/attiva` (GET)
- Ottiene tariffa attiva per anno
- Query param: `?anno=2025` (default: anno corrente)
- Ritorna: `{ tariffa: Tariffa }`

#### `/api/tariffe/[id]` (GET)
- Ottiene tariffa specifica per ID
- Ritorna: `{ tariffa: Tariffa }`

### Aggiornamento `/api/bambini` (GET)
- Ora include mappa iscrizioni: `iscrizioniMap`
- Per ogni bambino indica:
  - `hasIscrizioneCompleta: boolean`
  - `statoIscrizione?: string`
- Ritorna: `{ bambini: Bambino[], iscrizioniMap: Record<string, IscrizioneInfo> }`

## Nuove Pagine Astro

### `/iscrizioni/[id].astro`
- Pagina dettaglio iscrizione
- Render componente `DettaglioIscrizione`
- Protezione autenticazione
- Redirect a dashboard se ID mancante

### `/iscrizioni/nuova.astro`
- Pagina creazione nuova iscrizione
- Render componente `NuovaIscrizioneForm`
- Protezione autenticazione
- Supporto query param `?bambinoId=xxx`

## Aggiornamenti Componenti Esistenti

### ListaBambini.tsx
**Nuove funzionalità:**
- Badge "Categoria" evidenziato con shadow per ogni bambino
- Badge/CTA "Iscrizione":
  - Se iscrizione completa → Badge "Iscritto" (verde con check)
  - Altrimenti → Pulsante "Iscrivi" (link a nuova iscrizione)
- Gestione `iscrizioniMap` dall'API

**Stile:**
- Shadow `0 2px 5px 0 rgba(0,0,0,0.2)` su card bambino
- Badge categoria con colori primari
- Badge "Iscritto" con icona check

### DashboardGenitore.tsx
**Nuova sezione:**
- Aggiunta sezione "Iscrizioni" dopo sezione bambini
- Include `ListaIscrizioni` completo
- Header con pulsante "Nuova Iscrizione"
- Separatore prima e dopo

### DettaglioBambino (pagina)
**Già implementato:**
- Include componente `IscrizioniBambino`
- Posizionato prima dei pulsanti azione
- Con separatore

## Flusso Utente Completo

### 1. Dashboard Genitore
```
- Sezione "I tuoi bambini"
  - Card bambino con:
    * Foto
    * Nome/Cognome
    * Data nascita
    * Badge Categoria (se presente)
    * Badge Certificato
    * Badge "Iscritto" OPPURE CTA "Iscrivi"

- Sezione "Iscrizioni" (NUOVA)
  - Lista iscrizioni con badge stato
  - Pulsante "Nuova Iscrizione"
```

### 2. Creazione Iscrizione
```
Click "Iscrivi" su card bambino o "Nuova Iscrizione"
  ↓
Pagina /iscrizioni/nuova
  ↓
Selezione bambino + visualizza tariffa
  ↓
Click "Crea Iscrizione"
  ↓
Redirect automatico a dettaglio iscrizione
```

### 3. Completamento Dati Iscrizione
```
Dettaglio iscrizione (/iscrizioni/[id])
  ↓
Sezioni da completare:
  1. Privacy GDPR FCI (checkbox)
  2. Taglie Kit Scuola (3 campi)
  3. Upload Regolamento Firmato (PDF)
  ↓
Click "Salva Modifiche"
  ↓
Iscrizione aggiornata (stato diventa "Completa")
```

### 4. Visualizzazione Iscrizioni Bambino
```
Dettaglio bambino (/bambini/[id])
  ↓
Sezione "Iscrizioni"
  ↓
Click "Mostra"
  ↓
Lista iscrizioni del bambino
  ↓
Click su iscrizione → Dettaglio
```

## Configurazione Airtable Richiesta

### Tabella TABELLA_BAMBINI
- Aggiungere campo: `CATEGORIA` (Single Line Text o Select)

### Tabella TABELLA_ISCRIZIONI
**Campi linked records:**
- `TABELLA_GENITORI` (Link to TABELLA_GENITORI) - OBBLIGATORIO
- `TABELLA_BAMBINI` (Link to TABELLA_BAMBINI) - OBBLIGATORIO
- `TABELLA_TARIFFE` (Link to TABELLA_TARIFFE) - OBBLIGATORIO

**Campi read-only (Formula/Lookup):**
- `DATA_ISCRIZIONE` (Created time)
- `STATO_ISCRIZIONE` (Formula) - suggerito:
  ```
  IF(
    AND(
      {PRIVACY_GDPR_FCI},
      {REGOLAMENTO_FIRMATO_FILE},
      OR({TAGLIA_MAGLIA}, {TAGLIA_PANTALONCINO}, {TAGLIA_TUTA})
    ),
    "Completa",
    "Incompleta"
  )
  ```
- `ANNO_ISCRIZIONE` (Lookup from TABELLA_TARIFFE → ANNO_ISCRIZIONE)
- `NOME_BAMBINO` (Lookup from TABELLA_BAMBINI → NOME_BAMBINO)
- `COGNOME_BAMBINO` (Lookup from TABELLA_BAMBINI → COGNOME_BAMBINO)
- `CATEGORIA` (Lookup from TABELLA_BAMBINI → CATEGORIA)

**Campi editabili:**
- `PRIVACY_GDPR_FCI` (Checkbox)
- `TAGLIA_MAGLIA` (Single Line Text o Select)
- `TAGLIA_PANTALONCINO` (Single Line Text o Select)
- `TAGLIA_TUTA` (Single Line Text o Select)
- `REGOLAMENTO_FIRMATO_FILE` (Attachment)

### Tabella TABELLA_TARIFFE
**Campi esistenti confermati:**
- `ANNO_ISCRIZIONE` (Single Line Text) - es. "2025"
- `QUOTA_TOTALE_ANNO` (Currency)
- `IMPORTO_ISCRIZIONE` (Currency)
- `NUMERO_RATE` (Number)
- `IMPORTO_RATA` (Currency)
- `SCADENZA_RATE` (Long Text)
- `IMPORTO_KIT_SCUOLA` (Currency)
- `DESCRIZIONE_KIT` (Long Text) - Descrizione contenuto kit
- `ATTIVA` (Checkbox) - Indica tariffa attiva per l'anno

## Configurazione R2 (Cloudflare)

### Variabili Ambiente Richieste
```bash
# In .env o variabili Cloudflare Workers
R2_BUCKET=nome-bucket
R2_PUBLIC_DOMAIN=pub-yourdomain.r2.dev  # opzionale
```

### Binding Wrangler
In `wrangler.jsonc`:
```json
{
  "r2_buckets": [
    {
      "binding": "R2_BUCKET",
      "bucket_name": "nome-bucket"
    }
  ]
}
```

### Note R2
- I regolamenti firmati vengono salvati in `regolamenti/` nel bucket
- Formato filename: `{iscrizioneId}_{timestamp}_{random}.pdf`
- URL pubblico generato automaticamente
- Validazioni: solo PDF, max 5MB

## Testing

### Test Creazione Iscrizione
1. Login come genitore
2. Vai su Dashboard
3. Click "Iscrivi" su card bambino
4. Seleziona bambino
5. Verifica visualizzazione tariffa
6. Click "Crea Iscrizione"
7. Verifica redirect a dettaglio

### Test Completamento Dati
1. Dalla dashboard, sezione "Iscrizioni"
2. Click su iscrizione "Incompleta"
3. Compila Privacy GDPR (check)
4. Compila taglie kit
5. Upload regolamento PDF
6. Click "Salva Modifiche"
7. Verifica stato diventa "Completa"

### Test Badge Dashboard
1. Verifica badge categoria su card bambino
2. Verifica badge "Iscritto" per bambini con iscrizione completa
3. Verifica CTA "Iscrivi" per bambini senza iscrizione

### Test Dettaglio Bambino
1. Click su card bambino
2. Vai alla sezione "Iscrizioni"
3. Click "Mostra"
4. Verifica lista iscrizioni
5. Click su iscrizione per dettaglio

## File Creati/Modificati

### Nuovi File
- `src/components/DettaglioIscrizione.tsx`
- `src/components/ListaIscrizioni.tsx`
- `src/components/NuovaIscrizioneForm.tsx`
- `src/components/IscrizioniBambino.tsx`
- `src/pages/iscrizioni/[id].astro`
- `src/pages/iscrizioni/nuova.astro` (già esistente, aggiornato)
- `src/pages/api/iscrizioni/index.ts`
- `src/pages/api/iscrizioni/[id].ts`
- `src/pages/api/iscrizioni/[id]/regolamento.ts`
- `src/pages/api/tariffe/attiva.ts`
- `src/pages/api/tariffe/[id].ts`

### File Aggiornati
- `src/lib/airtable.ts` - Interfacce e metodi iscrizioni
- `src/components/ListaBambini.tsx` - Badge categoria e iscrizione
- `src/components/DashboardGenitore.tsx` - Sezione iscrizioni
- `src/pages/api/bambini/index.ts` - Mappa iscrizioni

## Prossimi Passi Consigliati

1. **Testing Completo**
   - Test tutti i flussi utente
   - Verifica validazioni
   - Test upload regolamento

2. **Configurazione Airtable**
   - Creare tutte le formule consigliate
   - Testare lookup fields
   - Verificare stato iscrizione automatico

3. **Configurazione R2**
   - Setup bucket Cloudflare
   - Configurare custom domain (opzionale)
   - Test upload file

4. **UX Miglioramenti**
   - Aggiungere tooltip informativi
   - Loading states più dettagliati
   - Messaggi di errore più specifici

5. **Funzionalità Future**
   - Gestione pagamenti iscrizioni
   - Storia iscrizioni anni precedenti
   - Export dati iscrizione (PDF)
   - Notifiche email conferma iscrizione

## Conclusioni

Il sistema di gestione iscrizioni è ora completo con tutte le funzionalità richieste:
✅ Pagina dettaglio iscrizione con tutti i dati
✅ Tabella tariffe visualizzata
✅ Gestione privacy GDPR FCI
✅ Gestione taglie kit scuola con descrizione
✅ Upload regolamento firmato (PDF)
✅ Sezione iscrizioni in dashboard genitore
✅ Sezione iscrizioni in dettaglio bambino
✅ Badge categoria e stato iscrizione su card bambino
✅ CTA "Iscrivi" per bambini senza iscrizione
✅ Badge "Iscritto" per bambini con iscrizione completa

Tutte le funzionalità sono integrate e pronte per il testing.
