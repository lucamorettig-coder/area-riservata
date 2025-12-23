# Setup Password Reset - Supabase Auth

## Funzionalità Implementata

È stata implementata la funzionalità "Password dimenticata?" che permette agli utenti di:
1. Richiedere un link di reset password via email
2. Reimpostare la password tramite un link sicuro
3. Accedere con la nuova password

## Componenti Creati

### 1. Frontend Components
- **`RecuperoPasswordModal.tsx`**: Modale per richiedere il reset password
- **`ResetPasswordForm.tsx`**: Form per impostare la nuova password
- **`LoginForm.tsx`**: Aggiornato con link "Password dimenticata?"

### 2. Pages
- **`/reset-password`**: Pagina pubblica per reimpostare la password

### 3. API Endpoints
- **`/api/reset-password-request`**: Gestisce la richiesta di reset password
- **`/api/reset-password`**: Gestisce l'aggiornamento della password

## Configurazione Supabase (IMPORTANTE!)

Per far funzionare correttamente il reset password, devi configurare Supabase:

### 1. Accedi alla Dashboard Supabase
1. Vai su https://app.supabase.com
2. Seleziona il tuo progetto
3. Vai su **Authentication** → **URL Configuration**

### 2. Configura i Redirect URLs

Aggiungi questi URL alla lista dei **Redirect URLs** consentiti:

#### Per Sviluppo Locale:
```
http://localhost:4321/reset-password
```

#### Per Produzione:
```
https://tuodominio.com/reset-password
```

**NOTA**: Se l'app gira su un mount path (es. `/app`), l'URL sarà:
```
https://tuodominio.com/app/reset-password
```

### 3. Configura Site URL (opzionale)
Nella stessa sezione, imposta anche il **Site URL**:
- **Locale**: `http://localhost:4321`
- **Produzione**: `https://tuodominio.com` (o con mount path se applicabile)

### 4. Email Templates (opzionale)
Se vuoi personalizzare l'email di reset password:
1. Vai su **Authentication** → **Email Templates**
2. Seleziona **Reset Password**
3. Personalizza il template
4. Assicurati che il link contenga: `{{ .ConfirmationURL }}`

## Variabili d'Ambiente

Assicurati di avere queste variabili nel file `.env`:

```env
# Supabase
SUPABASE_URL=https://tuo-progetto.supabase.co
SUPABASE_ANON_KEY=tuo_anon_key

# App Origin (per i redirect)
APP_ORIGIN=http://localhost:4321
```

In produzione (Webflow):
- `SUPABASE_URL`: URL del progetto Supabase
- `SUPABASE_ANON_KEY`: Chiave anonima (public)
- `APP_ORIGIN`: URL pubblico dell'app (es. `https://tuodominio.com` o con mount path)

## Flusso Utente

### 1. Richiesta Reset Password
1. L'utente clicca su "Password dimenticata?" nella pagina di login
2. Si apre una modale dove inserisce la sua email
3. Viene inviata una richiesta a `/api/reset-password-request`
4. Supabase invia un'email con il link di reset
5. L'utente vede il messaggio: "Se l'email è registrata, riceverai un link..."

### 2. Reset Password
1. L'utente clicca sul link nell'email
2. Viene reindirizzato a `/reset-password` con un token nella URL
3. Il componente verifica la presenza del token di recovery
4. L'utente inserisce la nuova password (min 8 caratteri)
5. Conferma la password
6. Clicca su "Imposta nuova password"
7. La password viene aggiornata tramite `/api/reset-password`
8. L'utente viene reindirizzato al login con messaggio di successo

## Sicurezza

### Anti-Enumeration
Il sistema implementa misure anti-enumeration:
- Il messaggio di risposta è sempre lo stesso, indipendentemente dal fatto che l'email esista o meno
- Questo previene attacchi di enumerazione degli utenti registrati

### Validazioni
- **Email**: Validazione formato email
- **Password**: Minimo 8 caratteri
- **Conferma**: Le due password devono coincidere
- **Token**: Verifica della sessione di recovery

### Session Management
- Dopo il reset, la vecchia sessione viene invalidata
- L'utente deve fare login con la nuova password

## Troubleshooting

### "Link non valido o scaduto"
**Causa**: Il token di recovery non è presente o è scaduto
**Soluzione**: 
- Richiedere un nuovo link di reset
- Verificare che l'URL di redirect sia configurato correttamente in Supabase

### "Impossibile inviare l'email di recupero"
**Causa**: Errore Supabase o configurazione email
**Soluzione**:
- Verificare le credenziali Supabase
- Controllare i log della console per dettagli
- Verificare che l'email sia configurata in Supabase (Authentication → Email Templates)

### Email non arriva
**Causa**: Problemi di configurazione email in Supabase
**Soluzione**:
- Verificare in Supabase Dashboard → Authentication → Email Templates
- Controllare lo spam/posta indesiderata
- Verificare che Supabase abbia un provider email configurato (default: servizio integrato)

### Redirect non funziona
**Causa**: URL non presente nella lista dei Redirect URLs consentiti
**Soluzione**:
- Aggiungere l'URL completo in Supabase → Authentication → URL Configuration
- Verificare che `APP_ORIGIN` nelle variabili d'ambiente sia corretto

## Testing

### Test Locale
1. Avvia l'app: `npm run dev`
2. Vai su http://localhost:4321/login
3. Clicca "Password dimenticata?"
4. Inserisci un'email registrata
5. Controlla la tua email
6. Clicca sul link di reset
7. Inserisci la nuova password
8. Verifica che il login funzioni con la nuova password

### Test Produzione
1. Assicurati che tutte le variabili d'ambiente siano configurate
2. Verifica che i Redirect URLs siano corretti in Supabase
3. Testa il flusso completo come in locale

## Note Importanti

1. **Solo Supabase Auth**: Questa funzionalità usa SOLO Supabase per la gestione password, Airtable non è coinvolto
2. **Nessun dato salvato**: Durante il processo di reset, nessun dato viene salvato su Airtable
3. **Token temporaneo**: Il token di recovery è valido per un tempo limitato (configurabile in Supabase)
4. **Una sola sessione**: Il reset invalida eventuali altre sessioni attive
5. **Email verificate**: Assicurati che gli utenti abbiano email verificate per ricevere il link

## Prossimi Step (Opzionali)

- [ ] Personalizzare il template email in Supabase
- [ ] Aggiungere requisiti password più stringenti (maiuscole, numeri, simboli)
- [ ] Implementare rate limiting per prevenire abusi
- [ ] Aggiungere 2FA (Two-Factor Authentication)
- [ ] Log degli accessi e reset password per audit
