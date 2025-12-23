# Test Password Reset - Checklist

## Pre-requisiti

### 1. Variabili d'Ambiente
Verifica che nel file `.env` ci siano:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
APP_ORIGIN=http://localhost:4321
```

### 2. Configurazione Supabase
1. Vai su https://app.supabase.com
2. Seleziona il tuo progetto
3. **Authentication** → **URL Configuration**
4. Aggiungi nei **Redirect URLs**:
   ```
   http://localhost:4321/reset-password
   ```
5. Salva

### 3. Utente di Test
Assicurati di avere un utente registrato nel sistema con email verificata.

## Test Flow

### Step 1: Richiesta Reset Password
1. Avvia l'app: `npm run dev`
2. Vai su: http://localhost:4321/login
3. Clicca su **"Password dimenticata?"**
4. ✅ Si apre una modale
5. Inserisci l'email dell'utente di test
6. Clicca **"Invia link di recupero"**
7. ✅ Vedi il messaggio: "Se l'email è registrata, riceverai un link..."
8. ✅ La modale si chiude automaticamente dopo 5 secondi

### Step 2: Verifica Email
1. Controlla la tua casella email
2. ✅ Dovresti ricevere un'email da Supabase con oggetto simile a "Reset Password"
3. ✅ L'email contiene un link cliccabile

### Step 3: Click sul Link
1. Clicca sul link nell'email
2. ✅ Vieni reindirizzato a: http://localhost:4321/reset-password
3. ✅ La pagina mostra il form "Reimposta Password"
4. ✅ Non vedi errori tipo "Link non valido o scaduto"

### Step 4: Imposta Nuova Password
1. Nel form di reset, inserisci:
   - **Nuova Password**: `NuovaPassword123!`
   - **Conferma Password**: `NuovaPassword123!`
2. Clicca **"Imposta nuova password"**
3. ✅ Vedi il messaggio: "Password aggiornata correttamente!"
4. ✅ Dopo 3 secondi vieni reindirizzato al login

### Step 5: Login con Nuova Password
1. Nella pagina di login, inserisci:
   - **Email**: email del test
   - **Password**: `NuovaPassword123!` (la nuova password)
2. Clicca **"Accedi"**
3. ✅ Login riuscito
4. ✅ Vieni reindirizzato alla dashboard

## Test Negativi

### Test 1: Email Non Valida
1. Apri modale "Password dimenticata?"
2. Inserisci email non valida (es. `test`)
3. ✅ Errore: "Inserisci un'email valida"

### Test 2: Password Non Coincidenti
1. Vai su `/reset-password` (con token valido)
2. Inserisci:
   - **Nuova Password**: `Password123!`
   - **Conferma Password**: `Password456!`
3. ✅ Errore: "Le password non coincidono"

### Test 3: Password Troppo Corta
1. Vai su `/reset-password` (con token valido)
2. Inserisci password < 8 caratteri
3. ✅ Errore: "La password deve contenere almeno 8 caratteri"

### Test 4: Link Scaduto
1. Vai direttamente su http://localhost:4321/reset-password (senza token)
2. ✅ Messaggio: "Link non valido o scaduto"
3. ✅ Pulsante "Torna al Login"

### Test 5: Vecchia Password Non Funziona
1. Dopo aver cambiato la password
2. Prova a fare login con la vecchia password
3. ✅ Errore: "Credenziali non valide"

## Troubleshooting

### Email Non Arriva
**Soluzione 1**: Controlla spam/posta indesiderata
**Soluzione 2**: Verifica i log della console browser
**Soluzione 3**: Controlla Supabase Dashboard → Authentication → Users (dovrebbe esserci un log)

### "Link non valido o scaduto" Subito
**Causa**: Redirect URL non configurato in Supabase
**Soluzione**: Aggiungi `http://localhost:4321/reset-password` nei Redirect URLs di Supabase

### Errore 500 durante la richiesta
**Causa**: Variabili d'ambiente non configurate
**Soluzione**: Verifica `.env` e riavvia il dev server

### "Impossibile inviare l'email di recupero"
**Causa**: Credenziali Supabase non valide
**Soluzione**: 
- Verifica `SUPABASE_URL` e `SUPABASE_ANON_KEY`
- Controlla i log della console per dettagli

## Log Console Utili

Durante il test, monitora la console del browser e del server per questi log:

### Browser Console
- `[ResetPasswordForm] URL hash:` → Mostra se il token è presente
- `[ResetPasswordForm] Valid recovery session detected` → Sessione valida

### Server Console
- `[Reset Password Request] Sending reset email to:` → Email a cui viene inviato il link
- `[Reset Password Request] Redirect URL:` → URL di redirect generato
- `[Reset Password] Attempting to update password` → Tentativo di aggiornamento
- `[Reset Password] Password updated successfully for user:` → Successo

## Checklist Finale

Prima di considerare il test completo, verifica:

- [ ] Email di reset ricevuta correttamente
- [ ] Link di reset funziona e reindirizza alla pagina corretta
- [ ] Form di reset mostra correttamente i campi
- [ ] Validazione password funziona (min 8 caratteri)
- [ ] Validazione conferma password funziona
- [ ] Password aggiornata con successo
- [ ] Login con nuova password funziona
- [ ] Login con vecchia password NON funziona più
- [ ] Messaggio di successo mostrato dopo reset
- [ ] Redirect al login dopo reset funziona
- [ ] Link scaduto/invalido mostra errore appropriato

## Note

- Il token di reset è monouso: dopo aver impostato la nuova password, non può essere riutilizzato
- Il token ha una scadenza (default: 1 ora, configurabile in Supabase)
- L'email viene inviata da Supabase, non dall'app
- La vecchia password viene invalidata immediatamente dopo il reset
