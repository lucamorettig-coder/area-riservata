# ✅ Checklist Deploy - Area Genitori

## Pre-Deploy

### 🔧 Configurazione Airtable
- [ ] Ho creato un Personal Access Token su Airtable
- [ ] Il token ha gli scope: `data.records:read`, `data.records:write`, `schema.bases:read`
- [ ] Il token ha accesso al Base `appszpkU1aXb3xrFM`
- [ ] La tabella `TABELLA_GENITORI` esiste nel Base
- [ ] La tabella contiene tutti i campi necessari (vedi DOCUMENTAZIONE_APP.md)

### ⚙️ Configurazione Webflow
- [ ] Ho aggiunto la variabile `AIRTABLE_BASE_ID` = `appszpkU1aXb3xrFM`
- [ ] Ho aggiunto la variabile `AIRTABLE_TOKEN` = `pat_...` (il mio token)
- [ ] Ho cliccato **Save** nelle Environment Variables

### 🚀 Deploy
- [ ] Ho cliccato **Deploy** in Webflow
- [ ] Il deploy è completato con successo
- [ ] Non ci sono errori nel log di deploy

---

## Post-Deploy - Test Funzionalità

### 🏠 Home Page
- [ ] La home page si carica correttamente
- [ ] Il pulsante "Registrati" funziona
- [ ] Il pulsante "Accedi" funziona

### 📝 Registrazione
- [ ] Il form di registrazione si visualizza correttamente
- [ ] Posso compilare tutti i campi
- [ ] Il codice fiscale viene convertito in maiuscolo
- [ ] La validazione mostra errori se compilo male i campi
- [ ] Il checkbox privacy è obbligatorio
- [ ] La registrazione crea un record su Airtable
- [ ] Dopo la registrazione vengo reindirizzato al login

### 🔐 Login
- [ ] Il form di login si visualizza correttamente
- [ ] Posso accedere con l'email appena registrata
- [ ] Se inserisco un'email non esistente, vedo l'errore
- [ ] Dopo il login vengo reindirizzato alla dashboard

### 📊 Dashboard
- [ ] La dashboard si carica correttamente
- [ ] Vedo il mio nome e cognome nel benvenuto
- [ ] Vedo tutti i miei dati anagrafici
- [ ] Il pulsante "Modifica profilo" funziona
- [ ] Il pulsante "Esci" funziona
- [ ] Se non sono autenticato, vengo reindirizzato al login

### ✏️ Modifica Profilo
- [ ] Il form si carica con i miei dati precompilati
- [ ] Posso modificare tutti i campi
- [ ] La validazione funziona
- [ ] Il salvataggio aggiorna i dati su Airtable
- [ ] Dopo il salvataggio vengo reindirizzato alla dashboard
- [ ] Il pulsante "Annulla" mi riporta alla dashboard

### 🔒 Sicurezza
- [ ] Se provo ad accedere a `/dashboard` senza login, vengo reindirizzato a `/login`
- [ ] Se provo ad accedere a `/modifica-profilo` senza login, vengo reindirizzato a `/login`
- [ ] Dopo il logout, non posso più accedere alle pagine protette
- [ ] Posso accedere solo ai miei dati, non a quelli di altri genitori

---

## Verifica Airtable

### 📊 Controllo Dati
- [ ] Ho aperto il Base Airtable `appszpkU1aXb3xrFM`
- [ ] Ho aperto la tabella `TABELLA_GENITORI`
- [ ] Vedo il record del genitore registrato
- [ ] Tutti i campi sono compilati correttamente
- [ ] Il codice fiscale è in maiuscolo
- [ ] Il FLAG_PRIVACY è spuntato

### 🔄 Test Aggiornamento
- [ ] Ho modificato un campo tramite l'app
- [ ] Il campo è stato aggiornato su Airtable
- [ ] Non ci sono record duplicati

---

## Test Mobile

### 📱 Responsive
- [ ] Ho testato su smartphone
- [ ] Tutti i form sono utilizzabili
- [ ] I pulsanti sono cliccabili
- [ ] Il testo è leggibile
- [ ] Non ci sono scroll orizzontali

---

## Performance e UX

### ⚡ Velocità
- [ ] Le pagine si caricano velocemente
- [ ] I form rispondono immediatamente
- [ ] I redirect funzionano senza ritardi

### 🎨 Design
- [ ] Il font Montserrat è applicato
- [ ] I colori sono consistenti
- [ ] L'interfaccia è pulita e professionale
- [ ] I messaggi di errore sono chiari

---

## Errori Comuni

### ❌ "Configurazione Airtable non disponibile"
- [ ] Ho verificato che le variabili d'ambiente siano configurate
- [ ] Ho fatto un nuovo deploy dopo aver configurato le variabili
- [ ] I valori delle variabili sono corretti (no spazi extra)

### ❌ "Email già registrata"
- [ ] È normale, l'email esiste già nel database
- [ ] Uso il login invece della registrazione

### ❌ Redirect loop
- [ ] Ho cancellato i cookie del browser
- [ ] Ho provato in modalità incognito

---

## 🎉 Deploy Completato!

Quando tutti i test sono ✅:
- [ ] L'app è pronta per l'uso in produzione
- [ ] Ho documentato eventuali problemi riscontrati
- [ ] Ho comunicato agli utenti che l'app è disponibile

---

## 📞 Supporto

Se qualcosa non funziona:
1. Controlla il log di deploy su Webflow
2. Verifica le variabili d'ambiente
3. Testa in modalità incognito (per escludere problemi di cache)
4. Consulta `DOCUMENTAZIONE_APP.md` per troubleshooting dettagliato

---

**✅ Checklist completata!**

Data: _______________  
Tester: _______________  
Note: _______________
