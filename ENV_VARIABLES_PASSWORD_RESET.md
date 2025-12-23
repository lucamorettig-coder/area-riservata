# Variabili d'Ambiente per Password Reset

## Variabili Necessarie

Aggiungi queste variabili al tuo file `.env` locale e alle Environment Variables di Webflow in produzione:

### 1. Supabase (già configurate)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. App Origin (NUOVA - NECESSARIA)
```env
APP_ORIGIN=http://localhost:4321
```

## Configurazione per Ambiente

### Sviluppo Locale
Nel file `.env`:
```env
APP_ORIGIN=http://localhost:4321
```

### Produzione Webflow
Nelle Environment Variables di Webflow:

**Se l'app è sulla root:**
```
APP_ORIGIN=https://tuodominio.com
```

**Se l'app è su un mount path (es. /app):**
```
APP_ORIGIN=https://tuodominio.com/app
```

## A Cosa Serve APP_ORIGIN

`APP_ORIGIN` è utilizzata per costruire l'URL di redirect quando l'utente clicca sul link di reset password nell'email.

**Esempio:**
- Se `APP_ORIGIN=http://localhost:4321`
- Il redirect URL sarà: `http://localhost:4321/reset-password`
- Supabase reindirizzerà l'utente a questo URL dopo aver cliccato sul link nell'email

## Verifica Configurazione

1. **Locale**: L'app deve essere accessibile all'URL specificato in `APP_ORIGIN`
2. **Supabase**: L'URL di redirect (`APP_ORIGIN + /reset-password`) deve essere presente nella lista dei Redirect URLs consentiti in Supabase Dashboard
3. **Produzione**: Dopo il deploy, verifica che il redirect funzioni correttamente

## Troubleshooting

### Redirect non funziona
- Verifica che `APP_ORIGIN` sia configurato correttamente
- Controlla che l'URL completo (`APP_ORIGIN/reset-password`) sia presente nei Redirect URLs di Supabase
- In produzione, assicurati di usare il dominio corretto (con o senza mount path)

### Email non arriva con il link corretto
- Controlla i log della console per vedere quale URL viene generato
- Verifica che `APP_ORIGIN` non abbia slash finale (es. `http://localhost:4321` ✅, `http://localhost:4321/` ❌)
