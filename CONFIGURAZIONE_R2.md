# Configurazione Cloudflare R2 per i Certificati Medici

## Problema
Airtable non accetta file caricati direttamente come base64. Richiede URL pubblici da cui scaricare i file.

## Soluzione
Usare **Cloudflare R2** (storage object gratuito fino a 10GB) per salvare i file PDF/immagini dei certificati medici.

## 📋 Setup R2 Bucket

### 1. Crea il R2 Bucket
1. Vai su Cloudflare Dashboard
2. Seleziona **R2** dal menu laterale
3. Clicca **Create bucket**
4. Nome bucket: `certificati-medici` (o altro nome a tua scelta)
5. Clicca **Create bucket**

### 2. Configura il Binding in wrangler.jsonc

Apri `wrangler.jsonc` e aggiungi il binding R2:

```jsonc
{
  "name": "parent-portal",
  "compatibility_date": "2024-01-01",
  // ... altre configurazioni ...
  "r2_buckets": [
    {
      "binding": "R2_BUCKET",
      "bucket_name": "certificati-medici"
    }
  ]
}
```

### 3. Aggiungi variabile d'ambiente (opzionale)

Se vuoi usare un dominio personalizzato per R2, aggiungi in `.env`:

```env
R2_PUBLIC_DOMAIN=https://tuodominio.com
```

Altrimenti verrà usato automaticamente il dominio del worker.

### 4. Deploy

Dopo aver configurato R2, fai il deploy:

```bash
npm run build
wrangler deploy
```

## 🔄 Come Funziona

1. **Utente carica certificato** → file convertito in base64 lato client
2. **Invio al server** → POST con JSON contenente base64
3. **Server salva su R2** → file salvato in `certificati/{bambinoId}/{timestamp}-{filename}`
4. **Genera URL pubblico** → `{origin}/api/certificati/certificati/{bambinoId}/{timestamp}-{filename}`
5. **Salva su Airtable** → URL pubblico salvato nel campo `CERTIFICATO_MEDICO_FILE`
6. **Download** → Quando serve, l'endpoint `/api/certificati/[...path]` serve il file da R2

## 📁 Struttura File su R2

```
certificati/
  ├── {bambinoId1}/
  │   ├── 1234567890-certificato.pdf
  │   └── 1234567891-certificato_aggiornato.pdf
  ├── {bambinoId2}/
  │   └── 1234567892-certificato.pdf
  └── ...
```

## ⚠️ Fallback senza R2

Se R2 non è configurato, l'app:
- Tenta di salvare solo la data di scadenza (senza file)
- Mostra errore: "Storage non configurato. Contatta l'amministratore per configurare R2 bucket."

## 💰 Costi R2

- **Gratuito** fino a:
  - 10 GB di storage
  - 1 milione di operazioni di scrittura al mese
  - 10 milioni di operazioni di lettura al mese
- Oltre i limiti gratuiti: prezzi molto bassi (~$0.015/GB/mese)

## 🔒 Sicurezza

- I file sono accessibili solo tramite l'endpoint API
- L'endpoint verifica che il bambino appartenga al genitore autenticato
- URL dei file non sono facilmente indovinabili (contengono timestamp)
- Cache impostata a 1 anno per performance

## 🧪 Test Locale

Per testare in locale con R2:

```bash
npx wrangler dev
```

Wrangler creerà un bucket R2 locale temporaneo per i test.

## ✅ Verifica Configurazione

Dopo il setup, prova a caricare un certificato dall'app. I log del server mostreranno:

```
[Certificato API] Uploading to R2: certificati/{bambinoId}/{timestamp}-{filename}
[Certificato API] File uploaded to R2 successfully
[Certificato API] Public URL: {url}
[Certificato API] Certificate uploaded successfully
```

Se vedi questi log, R2 è configurato correttamente! ✨
