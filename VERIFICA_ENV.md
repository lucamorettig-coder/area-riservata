# Guida alla Verifica delle Variabili d'Ambiente

## 🔍 PASSO 1: Endpoint di Debug

Dopo aver fatto il **Publish** della nuova versione, visita questo URL:

```
https://triono.webflow.io/parent-portal/api/debug-env
```

Questo ti mostrerà esattamente quali variabili sono disponibili e dove.

## ✅ PASSO 2: Controlla le Variabili in Webflow

1. Vai su **Webflow Dashboard** → **Apps** → **Parent Portal**
2. Clicca su **Settings** → **Environment Variables**
3. Verifica che siano presenti:
   - `AIRTABLE_BASE_ID`
   - `AIRTABLE_TOKEN`

### Formato Corretto delle Variabili

**AIRTABLE_BASE_ID:**
- Formato: `appXXXXXXXXXXXXXX` (inizia con "app" seguito da 14 caratteri)
- Esempio: `app1234567890abc`
- Dove trovarlo: URL di Airtable quando apri la tua base → `https://airtable.com/appXXXXXXXXXXXXXX/...`

**AIRTABLE_TOKEN:**
- Formato: stringa lunga che inizia con `pat` (Personal Access Token)
- Esempio: `patAbCdEfGhIjKlMnOpQrStUvWxYz1234567890`
- Dove crearlo: 
  - Account Airtable → Developer Hub → Personal Access Tokens
  - **IMPORTANTE:** Quando crei il token, devi:
    1. Selezionare la base specifica (`triono`)
    2. Dare i permessi:
       - ✅ `data.records:read`
       - ✅ `data.records:write`
       - ✅ `schema.bases:read`

## 📝 PASSO 3: Come Vedere i Log

### Opzione A: Console del Browser
1. Apri la pagina di login o registrazione
2. Premi **F12** per aprire DevTools
3. Vai su **Console**
4. Prova a fare login/registrazione
5. Vedrai i log dettagliati che iniziano con `=== AIRTABLE CLIENT INITIALIZATION ===`

### Opzione B: Log di Cloudflare (se hai accesso)
1. Vai su Cloudflare Dashboard
2. Workers & Pages → [tua app]
3. Logs

## 🔧 PASSO 4: Interpretare i Log

Quando fai una chiamata API, dovresti vedere qualcosa tipo:

```
=== AIRTABLE CLIENT INITIALIZATION ===
Runtime provided: true
Runtime.env exists: true
Runtime.env.AIRTABLE_BASE_ID: true
Runtime.env.AIRTABLE_TOKEN: true
Final baseId found: true
Final token found: true
✅ Airtable client created successfully
======================================
```

### Cosa Significano i Valori

- **Runtime provided: false** → Il contesto di Astro non sta passando locals correttamente
- **Runtime.env exists: false** → Le variabili non sono in runtime.env
- **Runtime.env.AIRTABLE_BASE_ID: false** → La variabile BASE_ID non è configurata o non è accessibile
- **Runtime.env.AIRTABLE_TOKEN: false** → La variabile TOKEN non è configurata o non è accessibile
- **Final baseId found: false** → Nessun metodo è riuscito a trovare il BASE_ID
- **Final token found: false** → Nessun metodo è riuscito a trovare il TOKEN

## 🎯 PASSO 5: Soluzioni Comuni

### Problema: Tutte le variabili sono "false"

**Soluzione:**
1. Verifica che le variabili siano salvate in Webflow (non nel file .env locale)
2. **Fai il Publish dell'app** (le variabili non si aggiornano senza publish)
3. Aspetta 1-2 minuti dopo il publish
4. Prova di nuovo

### Problema: "Runtime provided: false"

**Soluzione:**
Questo è strano e indica un problema con Astro/Cloudflare. Prova:
1. Fai un nuovo Publish
2. Svuota la cache del browser (Ctrl+F5)

### Problema: Le variabili esistono ma ottieni errore 401 da Airtable

**Causa:** Token non valido o senza permessi
**Soluzione:**
1. Vai su Airtable → Developer Hub → Personal Access Tokens
2. Verifica che il token sia attivo
3. Verifica che il token abbia accesso alla base `triono`
4. Verifica i permessi (read/write)
5. Se necessario, crea un nuovo token

## 📋 PASSO 6: Checklist Completa

- [ ] Le variabili sono salvate in Webflow Dashboard → Settings → Environment Variables
- [ ] Il `AIRTABLE_BASE_ID` inizia con "app" ed ha 17 caratteri totali
- [ ] Il `AIRTABLE_TOKEN` inizia con "pat"
- [ ] Il token ha i permessi su data.records:read e data.records:write
- [ ] Il token ha accesso alla base corretta
- [ ] Hai fatto il **Publish** dell'app dopo aver configurato le variabili
- [ ] Hai aspettato 1-2 minuti dopo il publish
- [ ] La tabella Airtable si chiama esattamente `TABELLA_GENITORI`
- [ ] Hai provato l'endpoint `/api/debug-env` per vedere i log

## 🗂️ PASSO 7: Verifica Struttura Airtable

La tabella `TABELLA_GENITORI` deve avere esattamente questi campi (case-sensitive):

| Nome Campo | Tipo in Airtable |
|------------|------------------|
| `NOME_GENITORE` | Single line text |
| `COGNOME_GENITORE` | Single line text |
| `DATA_NASCITA_GENITORE` | Single line text o Date |
| `LUOGO_NASCITA_GENITORE` | Single line text |
| `CODICE_FISCALE_GENITORE` | Single line text |
| `VIA_RESIDENZA_GENITORE` | Single line text |
| `CITTA_RESIDENZA_GENITORE` | Single line text |
| `EMAIL_GENITORE` | Email |
| `CELLULARE_GENITORE` | Phone number o Single line text |
| `FLAG_PRIVACY` | Checkbox |

## 🚨 Errori Comuni e Soluzioni

### Errore: "Configurazione Airtable non disponibile" (503)
- **Causa:** Le variabili d'ambiente non sono impostate o non sono accessibili
- **Cosa fare:**
  1. Visita `/api/debug-env` per vedere i dettagli
  2. Verifica i log nella console (F12)
  3. Controlla che le variabili siano in Webflow (non solo in .env locale)
  4. Fai Publish e aspetta 1-2 minuti

### Errore: "Airtable API error: 401"
- **Causa:** Token non valido o scaduto
- **Cosa fare:**
  1. Verifica che il token sia attivo in Airtable
  2. Verifica che il token abbia i permessi corretti
  3. Rigenera un nuovo token se necessario

### Errore: "Airtable API error: 404"
- **Causa:** Base ID errato o tabella non trovata
- **Cosa fare:**
  1. Verifica il Base ID nell'URL di Airtable
  2. Verifica che la tabella si chiami esattamente `TABELLA_GENITORI`

### Errore: "Airtable API error: 403"
- **Causa:** Il token non ha i permessi necessari sulla base
- **Cosa fare:**
  1. Vai su Airtable → Developer Hub → Personal Access Tokens
  2. Clicca sul token → Edit
  3. Aggiungi la base specifica
  4. Assicurati di avere `data.records:read` e `data.records:write`

## 🧪 PASSO 8: Test Finale

Dopo aver configurato tutto:

1. Fai il **Publish** dell'app
2. Aspetta 2 minuti
3. Visita `https://triono.webflow.io/parent-portal/api/debug-env`
4. Verifica che tutte le variabili siano `true`
5. Vai su `/registrazione`
6. Compila il form
7. Clicca "Registrati"
8. Se funziona → tutto OK! ✅
9. Se non funziona → guarda i log nella console (F12)

## 📞 Supporto

Se continui ad avere problemi:
1. Visita `/api/debug-env` e copia l'output
2. Apri la console del browser (F12) e copia i log
3. Fai screenshot della sezione Environment Variables in Webflow
4. Condividi questi dettagli (ma **NON** condividere mai il token completo!)
