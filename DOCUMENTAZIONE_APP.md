# 🚴 Area Genitori - Scuola di Ciclismo

Web app per la gestione dell'area privata dei genitori di una scuola di ciclismo.

## 📋 Indice

- [Scopo dell'App (Fase 1)](#scopo-dellapp-fase-1)
- [Pagine Create](#pagine-create)
- [Campi Utilizzati](#campi-utilizzati)
- [Architettura Tecnica](#architettura-tecnica)
- [Configurazione](#configurazione)
- [Sicurezza e Permessi](#sicurezza-e-permessi)

---

## 🎯 Scopo dell'App (Fase 1)

Questa prima versione permette SOLO di:

✅ Registrarsi come genitore  
✅ Accedere (login) con email  
✅ Visualizzare i propri dati anagrafici  
✅ Modificare i propri dati anagrafici  

### Cosa NON è incluso in questa fase:
- ❌ Gestione bambini
- ❌ Gestione iscrizioni ai corsi

Queste funzionalità verranno aggiunte nelle fasi successive.

---

## 📄 Pagine Create

### 1. **Home Page** (`/`)
- Pagina di benvenuto con informazioni sull'app
- Link a registrazione e login
- Descrizione delle funzionalità disponibili

**Route**: `/`

---

### 2. **Registrazione Genitore** (`/registrazione`)
Permette a un nuovo genitore di creare il proprio account.

**Campi del form**:
- Nome *
- Cognome *
- Data di nascita *
- Luogo di nascita *
- Codice fiscale * (16 caratteri, maiuscolo automatico)
- Indirizzo (via e numero civico) *
- Città *
- Email *
- Cellulare *
- Acconsento al trattamento dati (GDPR) * (checkbox)

**Validazioni**:
- Tutti i campi obbligatori
- Email formato valido
- Codice fiscale 16 caratteri
- Privacy obbligatoria
- Email univoca (non duplicata)

**Route**: `/registrazione`

---

### 3. **Login** (`/login`)
Permette l'accesso all'area riservata tramite email.

**Campi del form**:
- Email

**Funzionamento**:
- Cerca il genitore per email in Airtable
- Se trovato, crea sessione e reindirizza a dashboard
- Se non trovato, mostra errore con invito a registrarsi

**Route**: `/login`

---

### 4. **Dashboard / Area Personale** (`/dashboard`)
Area riservata che mostra i dati del genitore autenticato.

**Contenuto**:
- Benvenuto personalizzato con nome e cognome
- Card con tutti i dati anagrafici visualizzati
- Pulsante "Modifica profilo"
- Pulsante "Esci" (logout)

**Accesso**: Solo utenti autenticati (redirect a login se non autenticato)

**Route**: `/dashboard`

---

### 5. **Modifica Profilo** (`/modifica-profilo`)
Permette al genitore di modificare i propri dati anagrafici.

**Campi**: Stessi della registrazione, tutti obbligatori

**Validazioni**: Stesse della registrazione

**Accesso**: Solo utenti autenticati

**Route**: `/modifica-profilo`

---

## 📊 Campi Utilizzati

### Tabella Airtable: `TABELLA_GENITORI`

| Campo Airtable | Label UI | Tipo | Obbligatorio | Note |
|---|---|---|---|---|
| `NOME_GENITORE` | Nome | Text | ✅ | |
| `COGNOME_GENITORE` | Cognome | Text | ✅ | |
| `DATA_NASCITA_GENITORE` | Data di nascita | Date | ✅ | |
| `LUOGO_NASCITA_GENITORE` | Luogo di nascita | Text | ✅ | |
| `CODICE_FISCALE_GENITORE` | Codice fiscale | Text | ✅ | 16 caratteri, maiuscolo |
| `VIA_RESIDENZA_GENITORE` | Indirizzo | Text | ✅ | Via e numero civico |
| `CITTA_RESIDENZA_GENITORE` | Città | Text | ✅ | |
| `EMAIL_GENITORE` | Email | Email | ✅ | Univoca, usata per login |
| `CELLULARE_GENITORE` | Cellulare | Phone | ✅ | |
| `FLAG_PRIVACY` | Consenso GDPR | Checkbox | ✅ | Obbligatorio per registrazione |

### Campi NON visibili/modificabili dall'utente:
- ID record Airtable (gestito automaticamente)
- Campi formula/lookup (se presenti)
- Created time / Modified time

---

## 🏗️ Architettura Tecnica

### Frontend
- **Framework**: Astro + React
- **Componenti UI**: shadcn/ui (preinstallati)
- **Styling**: Tailwind CSS con Montserrat font
- **Client components**: React con `client:only="react"`

### Backend
- **API Routes**: Astro API routes (`/src/pages/api/*`)
- **Database**: Airtable (single source of truth)
- **Autenticazione**: Cookie-based session

### Struttura file principali

```
src/
├── components/
│   ├── RegistrazioneForm.tsx      # Form registrazione
│   ├── LoginForm.tsx               # Form login
│   ├── DashboardGenitore.tsx       # Dashboard area personale
│   └── ModificaProfiloForm.tsx     # Form modifica profilo
├── pages/
│   ├── index.astro                 # Home page
│   ├── registrazione.astro         # Pagina registrazione
│   ├── login.astro                 # Pagina login
│   ├── dashboard.astro             # Pagina dashboard
│   ├── modifica-profilo.astro      # Pagina modifica profilo
│   └── api/
│       ├── registrazione.ts        # API: crea genitore
│       ├── login.ts                # API: login genitore
│       ├── logout.ts               # API: logout
│       └── profilo.ts              # API: GET/PATCH profilo
├── lib/
│   ├── airtable.ts                 # Client Airtable
│   ├── auth.ts                     # Gestione autenticazione
│   ├── validation.ts               # Validazioni form
│   └── base-url.ts                 # Base URL configurazione
└── styles/
    └── global.css                  # Stili globali + Montserrat
```

---

## ⚙️ Configurazione

### Variabili d'Ambiente

L'app richiede due variabili d'ambiente per funzionare:

1. **`AIRTABLE_BASE_ID`** = `appszpkU1aXb3xrFM`
2. **`AIRTABLE_TOKEN`** = Il tuo Personal Access Token

### Configurazione in Webflow

1. Vai in **Apps** > **[Nome App]** > **Settings** > **Environment Variables**
2. Aggiungi le due variabili sopra
3. Salva e fai **Deploy**

📖 **Guida dettagliata**: Vedi il file `ENV_SETUP.md`

---

## 🔒 Sicurezza e Permessi

### Autenticazione
- Login semplificato tramite email (nessuna password in Fase 1)
- Sessione salvata in cookie HTTP-only
- Durata sessione: 7 giorni

### Autorizzazione
- L'utente autenticato può vedere/modificare **SOLO** il proprio record
- Nessun accesso ai dati di altri genitori
- Le pagine protette (`/dashboard`, `/modifica-profilo`) richiedono autenticazione

### Validazioni
- **Server-side**: Tutte le validazioni sono replicate lato server
- **Client-side**: Feedback immediato all'utente
- **Obbligatorietà**: Tutti i campi sono obbligatori, blocco salvataggio se mancanti

### Privacy
- Flag `FLAG_PRIVACY` obbligatorio per registrazione
- Dati salvati su Airtable (GDPR compliant)
- Nessun dato sensibile esposto in URL o client-side

---

## 🎨 UI/UX

### Design
- **Mobile-first**: Ottimizzato per smartphone
- **Font**: Montserrat (Google Fonts)
- **Palette**: Basata su variabili CSS di shadcn/ui
- **Componenti**: shadcn/ui preconfigurati

### User Flow

```
Home (/)
  ├─→ Registrazione (/registrazione)
  │     └─→ Login (/login) [dopo registrazione]
  │           └─→ Dashboard (/dashboard)
  │                 ├─→ Modifica Profilo (/modifica-profilo)
  │                 │     └─→ Dashboard [dopo salvataggio]
  │                 └─→ Logout → Login
  └─→ Login (/login)
        └─→ Dashboard (/dashboard)
              └─→ [vedi sopra]
```

---

## 🚀 Prossime Fasi

### Fase 2 (Future)
- Gestione bambini (anagrafica)
- Collegamento genitore-bambini

### Fase 3 (Future)
- Gestione iscrizioni ai corsi
- Visualizzazione corsi disponibili
- Stato iscrizioni

---

## 📝 Note Tecniche

### Connessione Airtable
- **Metodo**: REST API via `webflow-api` SDK (non utilizzato, implementazione custom)
- **Autenticazione**: Bearer token in header
- **Endpoint**: `https://api.airtable.com/v0/{baseId}/{tableName}`

### Gestione errori
- Graceful degradation se Airtable non configurato
- Messaggi utente-friendly per tutti gli errori
- Logging server-side per debugging

### Performance
- Server-side rendering delle pagine protette
- Client-side validation per UX immediata
- Fetch API per chiamate asincrone

---

## 🆘 Troubleshooting

### "Configurazione Airtable non disponibile"
➡️ Le variabili `AIRTABLE_BASE_ID` e `AIRTABLE_TOKEN` non sono configurate.  
Vedi `ENV_SETUP.md` per la configurazione.

### "Email già registrata"
➡️ Esiste già un genitore con quella email. Usa il login invece della registrazione.

### "Email non trovata"
➡️ Nessun genitore registrato con quella email. Registrati prima di accedere.

### Redirect loop su dashboard
➡️ Problema con i cookie di sessione. Cancella i cookie del browser e riprova.

---

## 📞 Contatti / Supporto

Per domande o problemi tecnici, fare riferimento alla documentazione Webflow Apps o Airtable API.

---

**Versione**: 1.0 (Fase 1)  
**Data**: Dicembre 2025  
**Tecnologie**: Astro, React, TypeScript, Airtable, Tailwind CSS
