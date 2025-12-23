# Integrazione Supabase Auth + Airtable

## Panoramica

L'applicazione ora utilizza **Supabase per l'autenticazione** e **Airtable per i dati anagrafici**, offrendo:
- Autenticazione sicura con password
- Gestione centralizzata delle credenziali
- Dati anagrafici completi su Airtable

## Architettura

```
┌─────────────┐
│   Utente    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│      Form Registrazione/Login       │
│  (email + password + dati completi) │
└──────┬──────────────────────────────┘
       │
       ├──────────────┐
       ▼              ▼
┌──────────┐   ┌──────────────┐
│ Supabase │   │   Airtable   │
│   Auth   │   │  TABELLA_    │
│          │   │   GENITORI   │
│ • email  │   │              │
│ • pass   │   │ • Tutti i    │
│ • user_id│   │   dati       │
│          │   │ • AUTH_USER_ │
│          │   │   ID (link)  │
└──────────┘   └──────────────┘
```

## Flusso di Registrazione

1. **L'utente compila il form** con:
   - Dati anagrafici (nome, cognome, data nascita, ecc.)
   - Contatti (cellulare, indirizzo, città)
   - **Credenziali** (email, password)
   - Privacy consent

2. **API `/api/registrazione`**:
   - Valida tutti i dati
   - Crea l'utente su **Supabase Auth** (`signUp`)
   - Ottiene l'`AUTH_USER_ID` da Supabase
   - Salva tutti i dati su **Airtable** includendo `AUTH_USER_ID`

3. **Redirect** al login con messaggio di successo

## Flusso di Login

1. **L'utente inserisce** email e password

2. **API `/api/login`**:
   - Verifica le credenziali su **Supabase Auth** (`signInWithPassword`)
   - Se valide, recupera i dati completi da **Airtable** usando l'email
   - Crea una sessione locale con `genitoreId` di Airtable
   - Redirect alla dashboard

3. **Middleware** protegge le rotte private

## Modifiche UI

### Pagina Registrazione
- ✅ **Sezione "Dati anagrafici"**: nome, cognome, data/luogo nascita, CF
- ✅ **Sezione "Contatti"**: cellulare, indirizzo, città (spostati da Residenza)
- ✅ **Sezione "Credenziali di accesso"**: email + password
- ❌ Rimossa sezione "Residenza" (campi unificati in Contatti)

### Pagina Login
- ✅ **Sezione "Credenziali di accesso"**: email + password
- ✅ Icona lucchetto per indicare sicurezza
- ✅ Validazione client-side

## Configurazione Airtable

### Campi TABELLA_GENITORI

Aggiungi il nuovo campo:

```
AUTH_USER_ID (Single line text)
- Contiene l'ID utente di Supabase
- Serve per collegare l'account auth ai dati anagrafici
- Viene popolato automaticamente durante la registrazione
```

## Variabili d'Ambiente

### Supabase (nuove)

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Airtable (esistenti)

```env
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TOKEN=patXXXXXXXXXXXXXX
```

## Come Ottenere le Credenziali Supabase

1. Vai su [https://supabase.com](https://supabase.com)
2. Crea un nuovo progetto o seleziona uno esistente
3. Vai su **Settings** → **API**
4. Copia:
   - **Project URL** → `SUPABASE_URL`
   - **anon/public key** → `SUPABASE_ANON_KEY`

## File Modificati

### Frontend
- ✅ `src/components/RegistrazioneForm.tsx` - Aggiunto campo password, riorganizzate sezioni
- ✅ `src/components/LoginForm.tsx` - Aggiunto campo password

### Backend
- ✅ `src/lib/supabase.ts` - Client Supabase con pattern env vars di Webflow
- ✅ `src/lib/airtable.ts` - Aggiunto campo `AUTH_USER_ID` all'interfaccia `Genitore`
- ✅ `src/pages/api/registrazione.ts` - Integrazione Supabase + Airtable
- ✅ `src/pages/api/login.ts` - Verifica su Supabase, recupero dati da Airtable

## Validazione Password

La password deve avere **minimo 6 caratteri** (requisito di Supabase di default).

Per personalizzare i requisiti, vai su Supabase Dashboard → **Authentication** → **Policies**.

## Gestione Errori

### Registrazione
- ❌ Email già registrata → Bloccato da Supabase
- ❌ Password troppo corta → Validazione client + server
- ❌ Dati mancanti → Validazione esistente
- ⚠️  Errore Airtable dopo Supabase → L'utente viene creato su Supabase ma non su Airtable (da gestire)

### Login
- ❌ Credenziali errate → Supabase restituisce errore generico
- ❌ Utente esistente su Supabase ma non su Airtable → Errore "Dati utente non trovati"

## Sicurezza

✅ **Password**: Mai salvate in chiaro, gestite da Supabase
✅ **Sessione**: Gestita tramite cookie HTTP-only
✅ **Auth Token**: Supabase gestisce refresh automatico
✅ **Middleware**: Protegge tutte le rotte `/dashboard`, `/bambini`, `/modifica-profilo`

## Prossimi Passi (Opzionali)

1. **Email verification**: Attivare su Supabase per confermare email
2. **Password reset**: Implementare funzionalità "Password dimenticata"
3. **Rollback transazionale**: Se Airtable fallisce, eliminare l'utente da Supabase
4. **Rate limiting**: Proteggere le API da tentativi multipli
5. **2FA**: Aggiungere autenticazione a due fattori

## Testing

### Test Registrazione

1. Vai su `/registrazione`
2. Compila tutti i campi inclusa la password
3. Verifica che:
   - L'utente venga creato su Supabase
   - Il record venga salvato su Airtable con `AUTH_USER_ID`
   - Redirect a `/login` con messaggio successo

### Test Login

1. Vai su `/login`
2. Inserisci email e password
3. Verifica che:
   - Le credenziali vengano verificate su Supabase
   - La sessione venga creata
   - Redirect a `/dashboard`

### Test Protezione Rotte

1. Prova ad accedere a `/dashboard` senza login
2. Verifica redirect a `/login`

## Troubleshooting

### "Supabase credentials not configured"
➡️ Aggiungi `SUPABASE_URL` e `SUPABASE_ANON_KEY` nelle env vars di Webflow

### "Email già registrata"
➡️ L'email esiste già su Supabase, usa un'altra email o elimina l'utente da Supabase Dashboard

### "Dati utente non trovati"
➡️ L'utente esiste su Supabase ma non su Airtable - verifica i log o ricrea il record manualmente

### Password non accettata
➡️ Verifica che sia di almeno 6 caratteri

## Riferimenti

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Airtable API Reference](https://airtable.com/developers/web/api/introduction)
- [Astro Middleware](https://docs.astro.build/en/guides/middleware/)
