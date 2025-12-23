# Configurazione Variabili d'Ambiente

Questa app richiede due variabili d'ambiente per connettersi ad Airtable.

## 📋 Variabili Richieste

### 1. AIRTABLE_BASE_ID
Il Base ID della tua base Airtable.

**Come trovarlo:**
1. Vai su Airtable e apri la tua base "triono"
2. Guarda l'URL nella barra degli indirizzi
3. Cerca la parte che inizia con `app` seguito da lettere/numeri
4. Esempio URL: `https://airtable.com/app1234567890abcd/tblXXXXXX/viwYYYY`
5. Il Base ID è: `app1234567890abcd`

**Formato:** `appXXXXXXXXXXXXXX` (sempre 17 caratteri, inizia con "app")

### 2. AIRTABLE_API_KEY
Il token di accesso personale (Personal Access Token) di Airtable.

**Come crearlo:**
1. Vai su [Airtable Developer Hub](https://airtable.com/create/tokens)
2. Clicca su "Create new token"
3. Dai un nome al token (es. "Parent Portal")
4. Sotto "Scopes", seleziona:
   - ✅ `data.records:read`
   - ✅ `data.records:write`
   - ✅ `schema.bases:read`
5. Sotto "Access", clicca "Add a base" e seleziona la base "triono"
6. Clicca "Create token"
7. **IMPORTANTE:** Copia subito il token, non lo vedrai più!

**Formato:** inizia con `pat` seguito da lettere/numeri (es. `patAbCdEf1234567890...`)

## ⚙️ Come Configurarle in Webflow

### Durante lo Sviluppo (Locale)

1. Crea un file `.env` nella root del progetto (se non esiste già)
2. Aggiungi queste righe:
   ```
   AIRTABLE_BASE_ID=app_tuo_base_id_qui
   AIRTABLE_API_KEY=pat_tuo_token_qui
   ```
3. **NON** committare il file `.env` su Git (è già in .gitignore)

### In Produzione (Webflow)

1. Vai sulla dashboard di Webflow
2. Apri la sezione **Apps**
3. Seleziona l'app **Parent Portal**
4. Vai su **Settings** → **Environment Variables**
5. Aggiungi le due variabili:
   - Nome: `AIRTABLE_BASE_ID`
     Valore: il tuo Base ID (es. `app1234567890abcd`)
   
   - Nome: `AIRTABLE_API_KEY`
     Valore: il tuo token (es. `patAbCdEf1234567890...`)

6. Clicca **Save**
7. **Importante:** Fai il **Publish** dell'app per applicare le modifiche
8. Aspetta 1-2 minuti dopo il publish prima di testare

## ✅ Verifica della Configurazione

Dopo aver configurato le variabili, puoi verificare che funzionino:

1. Fai il **Publish** dell'app
2. Aspetta 1-2 minuti
3. Visita: `https://triono.webflow.io/parent-portal/api/debug-env`
4. Dovresti vedere:
   ```json
   {
     "airtableBaseIdExists": true,
     "airtableTokenExists": true,
     ...
   }
   ```

Se vedi `false` per una delle due, significa che la variabile non è configurata correttamente.

## 🔒 Sicurezza

- **Mai** condividere il tuo token API pubblicamente
- **Mai** committare il file `.env` nel repository
- Se pensi che il token sia stato compromesso:
  1. Vai su Airtable Developer Hub
  2. Revoca il token vecchio
  3. Crea un nuovo token
  4. Aggiorna la variabile in Webflow

## ❌ Problemi Comuni

### "Configurazione Airtable non disponibile"
- **Causa:** Le variabili non sono configurate o il nome è sbagliato
- **Soluzione:** 
  - Verifica che i nomi siano esattamente `AIRTABLE_BASE_ID` e `AIRTABLE_API_KEY`
  - Fai il Publish e aspetta 2 minuti
  - Usa `/api/debug-env` per verificare

### "Airtable API error: 401"
- **Causa:** Token non valido o scaduto
- **Soluzione:** 
  - Verifica che il token sia attivo su Airtable
  - Rigenera un nuovo token se necessario

### "Airtable API error: 403"
- **Causa:** Il token non ha i permessi necessari
- **Soluzione:**
  - Vai su Airtable Developer Hub
  - Edita il token
  - Assicurati che abbia accesso alla base "triono"
  - Verifica che abbia i permessi `data.records:read` e `data.records:write`

### "Airtable API error: 404"
- **Causa:** Base ID errato o tabella non trovata
- **Soluzione:**
  - Verifica il Base ID nell'URL di Airtable
  - Assicurati che la tabella si chiami esattamente `TABELLA_GENITORI`

## 📝 Nota per il File .env.local.example

Il file `.env.local.example` nella root del progetto mostra un esempio di come configurare le variabili localmente:

```
# Airtable Configuration
AIRTABLE_BASE_ID=your_base_id_here
AIRTABLE_API_KEY=your_api_key_here
```

Questo è solo un esempio. Per usarlo:
1. Copia il file e rinominalo in `.env`
2. Sostituisci i valori placeholder con i tuoi veri valori
3. Mai committare il file `.env` su Git
