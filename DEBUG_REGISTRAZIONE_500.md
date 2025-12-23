# 🐛 Debug Errore 500 sulla Registrazione

## Problema
Ricevi un errore 500 (Internal Server Error) quando provi a registrarti.

## Strumenti di Debug Creati

### 1. Pagina Debug Configurazione
**URL**: `https://triono.webflow.io/parent-portal/debug-config`

Questa pagina mostra:
- ✅/❌ Stato variabili Supabase (URL e ANON_KEY)
- ✅/❌ Stato variabili Airtable (BASE_ID e TOKEN)
- Link ai test API

### 2. API Debug Supabase
**URL**: `https://triono.webflow.io/parent-portal/api/debug-supabase`

Restituisce un JSON con:
- Presenza delle variabili d'ambiente
- Stato del client Supabase
- Stato del client Airtable
- Eventuali errori

### 3. API Registrazione con Log Dettagliati
L'API `/api/registrazione` ora logga ogni step del processo.

## Come Debuggare

### Step 1: Verifica Configurazione Build-Time
1. Vai su: `https://triono.webflow.io/parent-portal/debug-config`
2. Controlla se le variabili sono **SET** o **MISSING**
3. Se sono MISSING, le variabili non erano presenti durante il build

### Step 2: Verifica Configurazione Runtime
1. Vai su: `https://triono.webflow.io/parent-portal/api/debug-supabase`
2. Controlla il JSON restituito:
   ```json
   {
     "supabase": {
       "url": "https://xxx.supabase.co...",
       "anonKeyPresent": true,
       "clientCreated": true,
       "error": null
     },
     "airtable": {
       "baseIdPresent": true,
       "tokenPresent": true,
       "clientCreated": true
     }
   }
   ```
3. Se `clientCreated` è `false`, c'è un problema con le credenziali

### Step 3: Controlla i Log di Cloudflare
1. Vai su **Webflow Dashboard** → **Apps** → **Parent Portal**
2. Cerca i **Logs** o **Real-time logs**
3. Prova a registrarti di nuovo
4. Guarda i log in tempo reale, dovresti vedere:
   ```
   === REGISTRAZIONE START ===
   [Registrazione] Step 1: Parsing request body
   [Registrazione] Body parsed successfully
   [Registrazione] Step 2: Validating data
   [Registrazione] Validation passed
   [Registrazione] Step 3: Getting Supabase client
   === SUPABASE CLIENT INITIALIZATION ===
   ...
   ```
5. Identifica dove si blocca il processo

## Cause Comuni dell'Errore 500

### 1. Variabili d'Ambiente Mancanti ❌
**Sintomo**: `clientCreated: false` o errore "Configurazione non disponibile"

**Soluzione**:
1. Vai su **Webflow Apps Settings** → **Environment Variables**
2. Aggiungi:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. **IMPORTANTE**: Dopo aver aggiunto le variabili, devi fare un **nuovo deploy** dell'app

### 2. Campo AUTH_USER_ID Mancante su Airtable ❌
**Sintomo**: Errore nei log "Invalid field" o "Unknown field"

**Soluzione**:
1. Vai su Airtable → Base → Tabella `TABELLA_GENITORI`
2. Aggiungi un nuovo campo:
   - Nome: `AUTH_USER_ID`
   - Tipo: **Single line text**

### 3. Supabase Auth Non Configurato ❌
**Sintomo**: Errore Supabase durante `signUp`

**Soluzione**:
1. Vai su [Supabase Dashboard](https://app.supabase.com)
2. Seleziona il tuo progetto
3. Vai su **Authentication** → **Providers**
4. Assicurati che **Email** sia abilitato
5. Controlla **URL Configuration** se hai redirect personalizzati

### 4. CORS o Network Error ❌
**Sintomo**: Errore di rete o timeout

**Soluzione**:
1. Verifica che il tuo progetto Supabase sia attivo
2. Controlla le **API Settings** su Supabase
3. Assicurati che non ci siano firewall che bloccano le chiamate

### 5. Password Troppo Debole ❌
**Sintomo**: Supabase rifiuta la password

**Soluzione**:
- Supabase richiede minimo 6 caratteri (default)
- Puoi cambiare i requisiti su: **Authentication** → **Policies**

## Test Manuale Completo

### Test 1: Verifica Connettività Supabase
```bash
# Usando curl o Postman
curl -X POST 'https://YOUR_PROJECT.supabase.co/auth/v1/signup' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

### Test 2: Verifica Connettività Airtable
```bash
curl -X GET 'https://api.airtable.com/v0/YOUR_BASE_ID/TABELLA_GENITORI' \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Checklist Configurazione Completa

- [ ] **Supabase**
  - [ ] Progetto creato
  - [ ] Email Auth abilitato
  - [ ] `SUPABASE_URL` copiato
  - [ ] `SUPABASE_ANON_KEY` copiato
  
- [ ] **Airtable**
  - [ ] Base creata
  - [ ] Tabella `TABELLA_GENITORI` esiste
  - [ ] Campo `AUTH_USER_ID` (Single line text) aggiunto
  - [ ] `AIRTABLE_BASE_ID` copiato
  - [ ] `AIRTABLE_TOKEN` (PAT) creato e copiato
  
- [ ] **Webflow**
  - [ ] Variabili d'ambiente configurate:
    - [ ] `SUPABASE_URL`
    - [ ] `SUPABASE_ANON_KEY`
    - [ ] `AIRTABLE_BASE_ID`
    - [ ] `AIRTABLE_TOKEN` (o `AIRTABLE_API_KEY`)
  - [ ] **Deploy eseguito dopo aver aggiunto le variabili**

## Prossimi Step Dopo il Fix

Una volta risolto l'errore 500:

1. ✅ Testa la registrazione completa
2. ✅ Verifica che l'utente venga creato su Supabase
3. ✅ Verifica che i dati vengano salvati su Airtable
4. ✅ Verifica che `AUTH_USER_ID` sia popolato
5. ✅ Testa il login
6. ✅ Verifica accesso alla dashboard

## Contatti per Supporto

Se dopo questi step l'errore persiste:
1. Copia il JSON da `/api/debug-supabase`
2. Copia i log di Cloudflare (screenshot)
3. Descrivi esattamente quando si verifica l'errore
4. Invia tutto per ricevere supporto

---

**Nota**: I log dettagliati sono stati aggiunti temporaneamente per il debug. Una volta risolto il problema, considera di rimuovere alcuni log per motivi di sicurezza e performance.
