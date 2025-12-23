# 🚴 Area Genitori - Scuola di Ciclismo

Web application per la gestione dell'area privata dei genitori di una scuola di ciclismo.

## 📋 Fase 1 - Gestione Anagrafica Genitori

Questa prima versione dell'app permette ai genitori di:

- ✅ Registrarsi al portale
- ✅ Accedere con la propria email
- ✅ Visualizzare i propri dati anagrafici
- ✅ Modificare i propri dati anagrafici

Le funzionalità di gestione bambini e iscrizioni saranno implementate nelle fasi successive.

---

## 🚀 Quick Start

### 1️⃣ Configurazione

Configura le variabili d'ambiente necessarie (vedere `ISTRUZIONI_RAPIDE.md`):

```env
AIRTABLE_BASE_ID=appszpkU1aXb3xrFM
AIRTABLE_TOKEN=pat_your_token_here
```

### 2️⃣ Deploy

1. Configura le variabili in **Webflow** → **Apps** → **Environment Variables**
2. Clicca **Deploy**
3. L'app è live! 🎉

---

## 📄 Documentazione

- **[ISTRUZIONI_RAPIDE.md](./ISTRUZIONI_RAPIDE.md)** - Setup rapido in 3 passi
- **[RIEPILOGO_CREAZIONE.md](./RIEPILOGO_CREAZIONE.md)** - Riepilogo completo dell'app
- **[DOCUMENTAZIONE_APP.md](./DOCUMENTAZIONE_APP.md)** - Documentazione tecnica dettagliata
- **[ENV_SETUP.md](./ENV_SETUP.md)** - Guida configurazione variabili d'ambiente

---

## 🏗️ Architettura

### Frontend
- **Framework**: Astro + React
- **UI**: shadcn/ui + Tailwind CSS
- **Font**: Montserrat

### Backend
- **API**: Astro API Routes
- **Database**: Airtable
- **Auth**: Cookie-based sessions

### Deployment
- **Platform**: Webflow Apps
- **Runtime**: Cloudflare Workers

---

## 📊 Struttura Database

### Tabella Airtable: `TABELLA_GENITORI`

| Campo | Tipo | Obbligatorio |
|---|---|---|
| NOME_GENITORE | Text | ✅ |
| COGNOME_GENITORE | Text | ✅ |
| DATA_NASCITA_GENITORE | Date | ✅ |
| LUOGO_NASCITA_GENITORE | Text | ✅ |
| CODICE_FISCALE_GENITORE | Text (16 char) | ✅ |
| VIA_RESIDENZA_GENITORE | Text | ✅ |
| CITTA_RESIDENZA_GENITORE | Text | ✅ |
| EMAIL_GENITORE | Email | ✅ |
| CELLULARE_GENITORE | Phone | ✅ |
| FLAG_PRIVACY | Checkbox | ✅ |

---

## 🔐 Sicurezza

- ✅ Autenticazione cookie-based
- ✅ Sessioni protette (HTTP-only cookies)
- ✅ Isolamento dati (ogni genitore vede solo i propri dati)
- ✅ Validazioni server-side e client-side
- ✅ Email univoca
- ✅ Privacy GDPR obbligatoria

---

## 🎨 Design

- 📱 **Mobile-first**: Ottimizzato per smartphone
- 🎨 **UI moderna**: shadcn/ui components
- 🔤 **Font Montserrat**: Applicato globalmente
- 🎯 **UX semplice**: Interfaccia intuitiva e rassicurante

---

## 🛠️ Sviluppo Locale

### Installazione
```bash
npm install
```

### Configurazione
```bash
cp .env.local.example .env
# Modifica .env con i tuoi valori
```

### Sviluppo
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Type Check
```bash
npm run astro check
```

---

## 📱 Pagine

| Rotta | Descrizione | Protetta |
|---|---|---|
| `/` | Home page | ❌ |
| `/registrazione` | Registrazione nuovo genitore | ❌ |
| `/login` | Login | ❌ |
| `/dashboard` | Area personale | ✅ |
| `/modifica-profilo` | Modifica dati | ✅ |

---

## 🔄 User Flow

```
Home → Registrazione → Login → Dashboard ⇄ Modifica Profilo
                  ↓                 ↓
            [Airtable]          [Airtable]
```

---

## 🎯 Roadmap

### ✅ Fase 1 - Anagrafica Genitori (COMPLETATA)
- [x] Registrazione genitore
- [x] Login genitore
- [x] Dashboard genitore
- [x] Modifica profilo genitore

### 📅 Fase 2 - Gestione Bambini (Future)
- [ ] Anagrafica bambini
- [ ] Collegamento genitore-bambini
- [ ] CRUD bambini

### 📅 Fase 3 - Gestione Iscrizioni (Future)
- [ ] Lista corsi disponibili
- [ ] Iscrizione bambini ai corsi
- [ ] Visualizzazione stato iscrizioni

---

## 🆘 Troubleshooting

### Errore: "Configurazione Airtable non disponibile"
➡️ Configura `AIRTABLE_BASE_ID` e `AIRTABLE_TOKEN` nelle Environment Variables

### Errore: "Email già registrata"
➡️ L'email esiste già. Usa il login.

### Errore: "Email non trovata"
➡️ Registrati prima di fare login.

---

## 📞 Supporto

Per problemi o domande, consulta la documentazione:
- `ISTRUZIONI_RAPIDE.md` per setup veloce
- `DOCUMENTAZIONE_APP.md` per dettagli tecnici
- `ENV_SETUP.md` per configurazione variabili

---

## 📝 Note

- ⚠️ **NON** committare il file `.env` con credenziali reali
- ⚠️ Il token Airtable è sensibile, trattalo come una password
- ✅ Il file `.env` è già nel `.gitignore`

---

## 🏗️ Built With

- [Astro](https://astro.build/) - Framework
- [React](https://react.dev/) - UI Components
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Airtable](https://airtable.com/) - Database
- [Webflow](https://webflow.com/) - Hosting & Deployment

---

**Versione**: 1.0.0 (Fase 1)  
**Licenza**: Proprietaria  
**Data**: Dicembre 2025
