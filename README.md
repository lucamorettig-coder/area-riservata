# Area Riservata Triono

Portale genitori per la gestione delle iscrizioni alla Scuola di Ciclismo Triono.

## 🚀 Funzionalità

### ✅ Fase 1 - Gestione Genitori (Completata)
- Registrazione genitore con autenticazione Supabase
- Login con email e password
- Recupero password tramite email
- Modifica profilo genitore
- Integrazione con Airtable per lo storage dati

### ✅ Fase 2 - Gestione Bambini (Completata)
- Aggiunta bambini (anagrafica completa)
- Modifica dati bambino
- Upload foto bambino (storage su Cloudflare R2)
- Upload certificato medico con scadenza
- Visualizzazione stato certificato (valido/scadenza/scaduto)
- Calcolo automatico categoria in base alla data di nascita

### ✅ Fase 3 - Gestione Iscrizioni (Completata)
- Creazione nuova iscrizione per un bambino
- Selezione tariffa anno corrente
- Gestione consensi privacy GDPR FCI
- Selezione taglie kit scuola (maglia, pantaloncino, tuta)
- Upload regolamento firmato (PDF)
- Visualizzazione dettaglio iscrizione con tariffe
- Dashboard completa con riepilogo bambini e iscrizioni

## 🛠 Tech Stack

- **Framework**: Astro 5
- **UI Components**: React 19 + shadcn/ui
- **Styling**: TailwindCSS 4 + Webflow Design System
- **Database**: Airtable
- **Auth**: Supabase Auth
- **File Storage**: Cloudflare R2
- **Deploy**: Cloudflare Workers (via Webflow)

## 📋 Struttura Airtable

### Tabella GENITORI
- Dati anagrafici completi
- Email (univoca)
- Codice fiscale (univoco)
- Contatti
- `AUTH_USER_ID` (collegamento con Supabase)
- Privacy flag

### Tabella BAMBINI
- Dati anagrafici bambino
- Collegamento al genitore (linked record)
- Foto bambino (attachment)
- Certificato medico file + scadenza
- Stato certificato (formula automatica)
- Categoria (formula da data nascita)

### Tabella TARIFFE
- Anno iscrizione
- Quota totale anno
- Importo iscrizione
- Numero rate e importo rata
- Scadenza rate
- Kit scuola (importo e descrizione)
- Flag ATTIVA

### Tabella ISCRIZIONI
- Collegamento genitore (linked record)
- Collegamento bambino (linked record)
- Collegamento tariffa (linked record)
- Privacy GDPR FCI
- Taglie kit (maglia, pantaloncino, tuta)
- Regolamento firmato (attachment)
- Campi lookup: nome/cognome bambino, categoria, anno
- Stato iscrizione (formula)

## 🔐 Variabili d'Ambiente

Crea un file `.env` con le seguenti variabili:

```bash
# Airtable
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_API_KEY=your_api_key

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key

# App Config
APP_ORIGIN=https://your-domain.com

# Cloudflare R2 (per upload file)
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://your-r2-public-url
```

## 📦 Installazione

```bash
# Installa dipendenze
npm install

# Avvia in sviluppo
npm run dev

# Build per produzione
npm run build

# Preview build
npm run preview
```

## 🚀 Deploy su Webflow

Il progetto è configurato per il deploy automatico su Webflow Cloud tramite Cloudflare Workers.

### Configurazione Deploy

1. **Variabili d'ambiente** su Webflow:
   - Vai nelle impostazioni del sito
   - Aggiungi tutte le variabili d'ambiente necessarie
   - Redeploy l'applicazione

2. **Supabase - Redirect URLs**:
   - Aggiungi l'URL di produzione in Supabase Authentication → URL Configuration
   - Redirect URL: `https://your-domain.com/reset-password`

3. **Cloudflare R2**:
   - Configura il bucket R2 per lo storage dei file
   - Imposta le CORS policy per permettere l'upload
   - Aggiungi le credenziali nelle env vars

## 📚 Documentazione

Per maggiori dettagli consulta i file di documentazione nella root del progetto:

- `START_HERE.md` - Guida rapida per iniziare
- `DOCUMENTAZIONE_APP.md` - Documentazione completa dell'applicazione
- `FASE_*_RIEPILOGO.md` - Riepilogo delle varie fasi di sviluppo
- `SETUP_*.md` - Guide di configurazione specifiche

## 🔧 Struttura Progetto

```
/src
  /components         # Componenti React
    /ui              # shadcn/ui components
    *.tsx            # Form e componenti custom
  /layouts           # Layout Astro
  /lib               # Utility e client (Airtable, Supabase)
  /pages             # Pagine e API routes
    /api             # Endpoint API
    /bambini         # Pagine gestione bambini
    /iscrizioni      # Pagine gestione iscrizioni
  /site-components   # Componenti Webflow Devlink
  /styles            # Stili globali

/generated           # File generati da Webflow (CSS, fonts)
```

## 🤝 Contribuire

Questo è un progetto privato per la Scuola di Ciclismo Triono.

## 📄 Licenza

Privato - Tutti i diritti riservati

## 👨‍💻 Sviluppo

Sviluppato con ❤️ per la Scuola di Ciclismo Triono

---

**Ultimo aggiornamento**: Dicembre 2024
**Versione**: 1.0.0
