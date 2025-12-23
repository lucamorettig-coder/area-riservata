# 🚀 Istruzioni Rapide - Deploy Area Genitori

## ⚡ Setup in 3 Passi

### Passo 1: Ottieni il Token Airtable
1. Vai su https://airtable.com/create/tokens
2. Clicca **Create new token**
3. Nome: "Webflow App Token"
4. Seleziona scope:
   - ✅ `data.records:read`
   - ✅ `data.records:write`
   - ✅ `schema.bases:read`
5. Seleziona Base: `appszpkU1aXb3xrFM`
6. Clicca **Create token**
7. **COPIA il token** (inizia con `pat_`)

---

### Passo 2: Configura le Variabili in Webflow
1. Vai nel **Dashboard Webflow**
2. Seleziona il tuo sito
3. **Apps** → **[Nome della tua App]** → **Settings** → **Environment Variables**
4. Aggiungi queste 2 variabili:

```
Nome: AIRTABLE_BASE_ID
Valore: appszpkU1aXb3xrFM

Nome: AIRTABLE_TOKEN
Valore: [il token che hai copiato al Passo 1]
```

5. Clicca **Save**

---

### Passo 3: Deploy
1. Clicca sul pulsante **Deploy** in Webflow
2. Attendi il completamento del deploy
3. ✅ **L'app è live!**

---

## 🎯 Test dell'App

Dopo il deploy, testa queste funzionalità:

1. **Home** → Vai su `/` (la tua app)
2. **Registrazione** → Clicca "Registrati" e compila il form
3. **Login** → Accedi con l'email appena registrata
4. **Dashboard** → Verifica che i tuoi dati siano visualizzati
5. **Modifica Profilo** → Prova a modificare un campo e salvare
6. **Logout** → Esci e riaccedi

---

## ✅ Verifica su Airtable

1. Apri la tua Base Airtable (`appszpkU1aXb3xrFM`)
2. Vai alla tabella `TABELLA_GENITORI`
3. Dovresti vedere il record del genitore appena registrato

---

## 📱 Pagine Disponibili

- `/` - Home page
- `/registrazione` - Registrazione nuovo genitore
- `/login` - Login
- `/dashboard` - Area personale (richiede login)
- `/modifica-profilo` - Modifica dati (richiede login)

---

## 🆘 Problemi?

### "Configurazione Airtable non disponibile"
➡️ Le variabili non sono configurate. Ripeti il Passo 2.

### "Email già registrata"
➡️ Usa il login invece della registrazione.

### "Email non trovata"
➡️ Registrati prima di fare login.

---

## 📚 Documentazione Completa

Per maggiori dettagli, consulta:
- `RIEPILOGO_CREAZIONE.md` - Riepilogo completo
- `DOCUMENTAZIONE_APP.md` - Documentazione tecnica
- `ENV_SETUP.md` - Guida configurazione variabili

---

**🎉 Fatto! L'app è pronta all'uso!**
