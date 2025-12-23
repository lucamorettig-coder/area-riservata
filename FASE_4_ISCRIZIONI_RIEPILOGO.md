# FASE 4: GESTIONE ISCRIZIONI - RIEPILOGO IMPLEMENTAZIONE

## ✅ COMPLETATO

La Fase 4 implementa la **gestione delle iscrizioni** permettendo ai genitori di iscrivere i propri bambini alla scuola per l'anno corrente.

---

## 📋 COSA È STATO IMPLEMENTATO

### 1. INTERFACCE AIRTABLE

**File:** `src/lib/airtable.ts`

#### Nuove Interfacce:

```typescript
// Tariffa - rappresenta le tariffe annuali della scuola
interface Tariffa {
  id?: string;
  fields: {
    ANNO_ISCRIZIONE: string;          // es. "2025"
    QUOTA_TOTALE_ANNO: number;        // quota annuale totale
    IMPORTO_ISCRIZIONE: number;       // da pagare subito
    NUMERO_RATE: number;              // numero rate successive
    IMPORTO_RATA: number;             // importo singola rata
    SCADENZA_RATE?: string;           // descrizione scadenze
    IMPORTO_KIT_SCUOLA?: number;      // costo kit (opzionale)
    DESCRIZIONE_KIT?: string;         // descrizione kit
    ATTIVA: boolean;                  // tariffa attiva
  };
}

// Iscrizione - rappresenta l'iscrizione di un bambino
interface Iscrizione {
  id?: string;
  fields: {
    TABELLA_GENITORI: string[];      // linked record (OBBLIGATORIO)
    TABELLA_BAMBINI: string[];       // linked record (OBBLIGATORIO)
    TABELLA_TARIFFE: string[];       // linked record (OBBLIGATORIO)
    DATA_ISCRIZIONE?: string;        // auto-popolato da Airtable
    STATO_ISCRIZIONE?: string;       // formula/lookup (READ ONLY)
    ANNO_ISCRIZIONE?: string;        // lookup da tariffa (READ ONLY)
  };
}
```

#### Nuovi Metodi AirtableClient:

**Tariffe:**
- `getTariffe()` - recupera tutte le tariffe
- `getTariffaAttivaPerAnno(anno: string)` - recupera la tariffa attiva per un anno specifico

**Iscrizioni:**
- `createIscrizione(fields)` - crea una nuova iscrizione
- `getIscrizioniByGenitore(genitoreId)` - recupera iscrizioni di un genitore
- `getIscrizioniByBambino(bambinoId, genitoreId)` - recupera iscrizioni di un bambino
- `checkIscrizioneDuplicata(bambinoId, tariffaId, genitoreId)` - verifica se esiste già un'iscrizione

---

### 2. API ENDPOINTS

#### `/api/tariffe/attiva` (GET)

**File:** `src/pages/api/tariffe/attiva.ts`

- Recupera la tariffa attiva per l'anno corrente
- Richiede autenticazione
- Determina automaticamente l'anno corrente
- Restituisce errore 404 se non esiste una tariffa attiva

**Response:**
```json
{
  "tariffa": { ... },
  "annoCorrente": "2025"
}
```

#### `/api/iscrizioni` (GET)

**File:** `src/pages/api/iscrizioni/index.ts`

- Recupera tutte le iscrizioni del genitore loggato
- Richiede autenticazione
- Include solo iscrizioni del genitore autenticato

**Response:**
```json
{
  "iscrizioni": [ ... ]
}
```

#### `/api/iscrizioni` (POST)

**File:** `src/pages/api/iscrizioni/index.ts`

- Crea una nuova iscrizione
- Richiede autenticazione
- Verifica che il bambino appartenga al genitore
- Determina automaticamente l'anno corrente
- Recupera la tariffa attiva
- Controlla duplicati
- Collega automaticamente genitore, bambino e tariffa

**Body:**
```json
{
  "bambinoId": "recXXXXXXXXXX"
}
```

**Validazioni:**
- Bambino deve appartenere al genitore
- Deve esistere una tariffa attiva per l'anno corrente
- Non deve esistere già un'iscrizione per lo stesso bambino/anno

**Response successo:**
```json
{
  "success": true,
  "message": "Iscrizione creata correttamente",
  "iscrizione": { ... }
}
```

**Errori:**
- `"Le iscrizioni per l'anno corrente non sono ancora disponibili."` - nessuna tariffa attiva
- `"Esiste già un'iscrizione per questo bambino per l'anno corrente."` - duplicato
- `"Bambino non trovato o non autorizzato"` - bambino non appartiene al genitore

---

### 3. COMPONENTI REACT

#### `IscrizioniBambino.tsx`

**File:** `src/components/IscrizioniBambino.tsx`

**Funzionalità:**
- Visualizza le iscrizioni di un bambino specifico
- Mostra anno e stato di ogni iscrizione
- Pulsante "Nuova iscrizione" che porta al form
- Stati: loading, errore, nessuna iscrizione, elenco iscrizioni

**Props:**
```typescript
interface IscrizioniBambinoProps {
  bambinoId: string;
}
```

**Visualizzazione iscrizione:**
- Card con shadow
- Anno iscrizione
- Badge con stato (se disponibile)

#### `NuovaIscrizioneForm.tsx`

**File:** `src/components/NuovaIscrizioneForm.tsx`

**Funzionalità:**
- Form per creare una nuova iscrizione
- Select per scegliere il bambino (solo bambini del genitore)
- Riepilogo automatico dei costi dalla tariffa attiva
- Gestione errori e successo
- Redirect automatico dopo creazione

**Props:**
```typescript
interface NuovaIscrizioneFormProps {
  bambinoIdPreselezionato?: string | null;
}
```

**Sezioni del form:**

1. **Selezione Bambino**
   - Dropdown con elenco bambini del genitore
   - Campo obbligatorio

2. **Riepilogo Costi** (read-only)
   - Anno di iscrizione
   - Importo da pagare ora (evidenziato)
   - Quota annuale totale
   - Rate successive (numero × importo)
   - Scadenze rate
   - Kit scuola (se presente)
   - Descrizione kit

3. **Conferma**
   - Messaggio informativo
   - Pulsante "Conferma iscrizione"
   - Disabled se nessun bambino selezionato

**Stati:**
- Loading iniziale
- Errore nel caricamento
- Form attivo
- Submitting
- Successo (con redirect)

---

### 4. PAGINE

#### `/iscrizioni/nuova`

**File:** `src/pages/iscrizioni/nuova.astro`

- Pagina per creare una nuova iscrizione
- Richiede autenticazione
- Supporta query param `?bambinoId=XXX` per preselezionare un bambino
- Layout con card centrale
- Link "Torna alla dashboard" in fondo

**Integrazione:**
```astro
<NuovaIscrizioneForm 
  client:only="react" 
  bambinoIdPreselezionato={bambinoIdPreselezionato}
/>
```

#### `/bambini/[id].astro` (AGGIORNATO)

**File:** `src/pages/bambini/[id].astro`

**Aggiunto:**
- Sezione "Iscrizioni" dopo il certificato medico
- Componente `IscrizioniBambino`
- Separatore prima e dopo la sezione

```astro
<IscrizioniBambino 
  client:only="react" 
  bambinoId={bambinoId}
/>
```

---

## 🔐 SICUREZZA

### Implementate:

✅ **Autenticazione obbligatoria** - tutte le API richiedono sessione attiva

✅ **Autorizzazione genitore** - il genitore può:
- Vedere solo i propri bambini
- Vedere solo le proprie iscrizioni
- Creare iscrizioni solo per i propri bambini

✅ **Collegamento automatico genitore** - il campo `TABELLA_GENITORI` è popolato automaticamente dall'ID del genitore autenticato

✅ **Validazioni server-side**:
- Verifica proprietà bambino
- Verifica esistenza tariffa attiva
- Controllo duplicati
- Anno corrente calcolato automaticamente (non modificabile)

✅ **Protezione campi read-only** - i campi formula/lookup non sono mai modificati dal client

---

## 🎯 LOGICA DI BUSINESS

### Anno e Tariffa:

1. **Anno corrente** determinato automaticamente: `new Date().getFullYear()`
2. **Tariffa attiva** cercata con filtro: `ANNO_ISCRIZIONE = "2025" AND ATTIVA = true`
3. **Collegamento automatico** della tariffa all'iscrizione

### Controllo Duplicati:

- Si verifica se esiste già un'iscrizione per:
  - Stesso bambino (`TABELLA_BAMBINI`)
  - Stessa tariffa (`TABELLA_TARIFFE` = stesso anno)
- Se duplicato → errore: `"Esiste già un'iscrizione per questo bambino per l'anno corrente."`

### Blocco Iscrizioni:

Se non esiste una tariffa attiva per l'anno corrente:
- Form non si carica
- Messaggio: `"Le iscrizioni per l'anno corrente non sono ancora disponibili."`

---

## 📊 CAMPI AIRTABLE UTILIZZATI

### TABELLA_ISCRIZIONI:

**Campi obbligatori gestiti dall'app:**
- `TABELLA_GENITORI` (linked record) - impostato automaticamente
- `TABELLA_BAMBINI` (linked record) - selezionato dal genitore
- `TABELLA_TARIFFE` (linked record) - determinato automaticamente

**Campi read-only (formula/lookup):**
- `ANNO_ISCRIZIONE` - lookup da `TABELLA_TARIFFE`
- `STATO_ISCRIZIONE` - formula Airtable
- `DATA_ISCRIZIONE` - auto-popolato da Airtable

### TABELLA_TARIFFE:

**Tutti i campi usati:**
- `ANNO_ISCRIZIONE` (string) - filtro per trovare tariffa attiva
- `ATTIVA` (checkbox) - filtro per trovare tariffa attiva
- `QUOTA_TOTALE_ANNO` (valuta) - visualizzato nel riepilogo
- `IMPORTO_ISCRIZIONE` (valuta) - visualizzato nel riepilogo
- `NUMERO_RATE` (numero) - visualizzato nel riepilogo
- `IMPORTO_RATA` (valuta) - visualizzato nel riepilogo
- `SCADENZA_RATE` (string) - visualizzato nel riepilogo
- `IMPORTO_KIT_SCUOLA` (valuta) - visualizzato nel riepilogo
- `DESCRIZIONE_KIT` (testo) - visualizzato nel riepilogo

---

## 🎨 STILE E UX

### Design System:
- Font: **Montserrat** (tutto il form)
- Card: `var(--card)` con `border: 1px solid var(--border)`
- Shadow: `0 2px 5px 0 rgba(0,0,0,0.2)` sulle card iscrizioni
- Border radius: `var(--card-radius)`
- Colori: variabili CSS da `webflow.css`

### Responsive:
- Layout a una colonna
- Select e pulsanti full-width
- Gap generosi tra sezioni (REM)
- Padding ariosi nelle card

### Stati UI:
- **Loading:** messaggio "Caricamento..."
- **Errore:** div rosso con messaggio
- **Successo:** div verde con checkmark + redirect
- **Submitting:** pulsante disabilitato con testo "Creazione in corso..."

### Icone:
- 👤 Bambino (cerchio + persona)
- 💰 Costi (simbolo euro)
- 📄 Iscrizioni (documento)

---

## ❌ NON IMPLEMENTATO (come richiesto)

- ❌ Gestione pagamenti
- ❌ Gestione rate
- ❌ Modifica iscrizioni
- ❌ Eliminazione iscrizioni
- ❌ Funzionalità admin
- ❌ Modifica tariffe
- ❌ Storico pagamenti

**Questa fase riguarda SOLO la creazione e visualizzazione delle iscrizioni.**

---

## 📁 FILE CREATI/MODIFICATI

### Nuovi file:
1. `src/pages/api/tariffe/attiva.ts` - API tariffa attiva
2. `src/pages/api/iscrizioni/index.ts` - API iscrizioni (GET/POST)
3. `src/components/IscrizioniBambino.tsx` - visualizzazione iscrizioni bambino
4. `src/components/NuovaIscrizioneForm.tsx` - form nuova iscrizione
5. `src/pages/iscrizioni/nuova.astro` - pagina nuova iscrizione
6. `FASE_4_ISCRIZIONI_RIEPILOGO.md` - questa documentazione

### File modificati:
1. `src/lib/airtable.ts` - aggiunte interfacce Tariffa e Iscrizione + metodi
2. `src/pages/bambini/[id].astro` - aggiunta sezione iscrizioni

---

## 🧪 TESTING

### Per testare la funzionalità:

1. **Configurare Airtable:**
   - Creare `TABELLA_TARIFFE`
   - Creare `TABELLA_ISCRIZIONI`
   - Aggiungere una tariffa con `ANNO_ISCRIZIONE = "2025"` e `ATTIVA = true`

2. **Testare il flusso:**
   - Login come genitore
   - Vai a dettaglio bambino
   - Clicca "Nuova iscrizione" nella sezione Iscrizioni
   - Seleziona bambino
   - Verifica riepilogo costi
   - Conferma iscrizione
   - Verifica creazione e redirect

3. **Testare validazioni:**
   - Prova a creare duplicato → errore
   - Disattiva tariffa → messaggio non disponibile
   - Prova senza bambini → select vuoto

---

## 🎯 PROSSIMI PASSI (FUTURE FASI)

La Fase 4 getta le basi per future funzionalità:

- **Fase 5:** Gestione pagamenti iscrizione
- **Fase 6:** Gestione rate e scadenze
- **Fase 7:** Storico pagamenti
- **Fase 8:** Dashboard admin per gestire iscrizioni

---

## ✅ CHECKLIST COMPLETAMENTO

- [x] Interfacce TypeScript per Tariffa e Iscrizione
- [x] Metodi AirtableClient per tariffe
- [x] Metodi AirtableClient per iscrizioni
- [x] API GET tariffa attiva
- [x] API GET iscrizioni
- [x] API POST nuova iscrizione
- [x] Componente visualizzazione iscrizioni
- [x] Componente form nuova iscrizione
- [x] Pagina nuova iscrizione
- [x] Integrazione nel dettaglio bambino
- [x] Validazioni e controllo duplicati
- [x] Gestione errori
- [x] UI/UX responsive
- [x] Sicurezza e autorizzazioni
- [x] Documentazione

**🎉 FASE 4 COMPLETATA CON SUCCESSO!**
