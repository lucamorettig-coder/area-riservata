# ✅ Risoluzione Errore Certificato Medico

## 🐛 Errore Ricevuto

```json
{
  "error": "Errore interno del server",
  "details": "Airtable API error: 422 - {\"error\":{\"type\":\"INVALID_ATTACHMENT_OBJECT\",\"message\":...}"
}
```

## 🔍 Causa

Airtable **non accetta** file caricati direttamente come base64 (data URL). 

L'API di Airtable richiede che gli allegati siano specificati come **URL pubblici** da cui Airtable può scaricare il file.

## 💡 Soluzione Implementata

Ho implementato **Cloudflare R2** (storage object gratuito) per:

1. **Salvare i file** caricati dagli utenti
2. **Generare URL pubblici** per accedere ai file
3. **Passare gli URL ad Airtable** invece del contenuto base64

## 📂 File Modificati/Creati

### File Modificati:
- `src/pages/api/bambini/[id]/certificato.ts` - Gestisce upload su R2
- `src/lib/airtable.ts` - Metodi per certificato medico
- `wrangler.jsonc` - Configurazione R2 binding

### File Nuovi:
- `src/pages/api/certificati/[...path].ts` - Serve i file da R2
- `CONFIGURAZIONE_R2.md` - Documentazione tecnica completa
- `SETUP_R2_QUICK.md` - Guida setup rapido
- `verify-r2.sh` - Script di verifica configurazione
- `RISOLUZIONE_ERRORE_CERTIFICATO.md` - Questo documento

## 🚀 Come Funziona Ora

```
┌─────────────┐
│   Browser   │ Carica file PDF/immagine
└──────┬──────┘
       │ POST /api/bambini/{id}/certificato
       │ { fileData: "data:application/pdf;base64,...", scadenza: "2025-12-31" }
       ↓
┌──────────────────┐
│  Astro API       │
│  certificato.ts  │
│                  │
│  1. Converte     │
│     base64 → bin │
│                  │
│  2. Upload su R2 │ ──────────→ ┌─────────────────┐
│                  │              │  Cloudflare R2  │
│  3. Genera URL   │ ←────────── │   Bucket        │
│                  │              │  certificati-   │
│  4. Salva URL    │              │   medici        │
│     su Airtable  │              └─────────────────┘
└────────┬─────────┘
         ↓
┌─────────────────────────────────┐
│         Airtable                │
│  TABELLA_BAMBINI                │
│  ├─ CERTIFICATO_MEDICO_FILE     │ ← URL pubblico
│  └─ CERTIFICATO_MEDICO_SCADENZA │ ← Data scadenza
└─────────────────────────────────┘
```

## 📋 Setup Necessario

### 1. Crea R2 Bucket su Cloudflare

1. Vai su https://dash.cloudflare.com
2. Seleziona **R2** dal menu laterale
3. Clicca **Create bucket**
4. Nome: `certificati-medici`
5. Clicca **Create bucket**

### 2. Deploy

```bash
npm run build
wrangler deploy
```

## ✅ Verifica Setup

Esegui lo script di verifica:

```bash
./verify-r2.sh
```

Output atteso:
```
🔍 Verifica configurazione R2...

✅ wrangler.jsonc configurato correttamente
   Nome bucket: certificati-medici

📋 Prossimi passi:
1. Vai su https://dash.cloudflare.com
2. Seleziona R2 dal menu
3. Crea un bucket chiamato: certificati-medici
4. Esegui: npm run build && wrangler deploy
```

## 🧪 Test Funzionalità

1. Accedi all'app come genitore
2. Vai su un bambino
3. Clicca "Carica certificato medico"
4. Seleziona un PDF o immagine
5. Seleziona data di scadenza
6. Clicca "Carica certificato"

**Risultato atteso**: "Certificato caricato con successo! ✅"

## 🔧 Debug

Se ricevi ancora errori, controlla i log:

```bash
wrangler tail
```

Poi prova a caricare un certificato e osserva i log in tempo reale.

### Log di successo:
```
[Certificato API] Starting POST request
[Certificato API] Genitore found: true
[Certificato API] Bambino ID: rec123abc...
[Certificato API] Bambino found: true
[Certificato API] File present: true
[Certificato API] File validation passed
[Certificato API] Uploading to R2: certificati/rec123abc.../1234567890-certificato.pdf
[Certificato API] File uploaded to R2 successfully
[Certificato API] Public URL: https://yourapp.com/api/certificati/...
[Airtable] Success response for TABELLA_BAMBINI/rec123abc...
[Certificato API] Certificate uploaded successfully
```

## 💰 Costi R2

**GRATUITO** fino a:
- 10 GB storage
- 1M write/mese
- 10M read/mese

Per una scuola di ciclismo con ~100 bambini × 2 certificati/anno × 2MB/file = **400 MB/anno**

Totale costo: **€ 0,00** 🎉

## 🔐 Sicurezza

- ✅ File accessibili solo tramite API autenticata
- ✅ Verifica che il genitore sia proprietario del bambino
- ✅ URL con timestamp difficili da indovinare
- ✅ Cache HTTP per performance (1 anno)
- ✅ File organizzati per bambino

## 📖 Documentazione

- **Setup rapido**: `SETUP_R2_QUICK.md`
- **Dettagli tecnici**: `CONFIGURAZIONE_R2.md`
- **Questo documento**: `RISOLUZIONE_ERRORE_CERTIFICATO.md`

## ✨ Stato Attuale

- ✅ Codice aggiornato e pronto
- ✅ Configurazione R2 in wrangler.jsonc
- ✅ Types generati
- ⏳ **Manca solo**: Creare il bucket R2 su Cloudflare Dashboard
- ⏳ **Poi**: Deploy con `wrangler deploy`

---

**Pronto per il deploy! 🚀**
