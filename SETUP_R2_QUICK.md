# 🚀 Setup Rapido R2 per Certificati Medici

## 📝 Cosa è successo

Ho risolto l'errore `INVALID_ATTACHMENT_OBJECT` che ricevevi quando cercavi di salvare il certificato medico.

**Problema**: Airtable non accetta file in formato base64 (data URL). Richiede URL pubblici da cui scaricare i file.

**Soluzione**: Uso Cloudflare R2 (storage gratuito) per salvare i file e generare URL pubblici.

## ⚡ Setup in 3 passi

### 1️⃣ Crea il R2 Bucket su Cloudflare

1. Vai su https://dash.cloudflare.com
2. Seleziona il tuo account
3. Nel menu laterale, clicca **R2**
4. Clicca **Create bucket**
5. Nome: **`certificati-medici`** (importante: usa esattamente questo nome)
6. Clicca **Create bucket**

### 2️⃣ Verifica la configurazione

Il file `wrangler.jsonc` è già configurato con:

```jsonc
"r2_buckets": [
  {
    "binding": "R2_BUCKET",
    "bucket_name": "certificati-medici"
  }
]
```

Se hai usato un nome diverso per il bucket, modifica `bucket_name` in `wrangler.jsonc`.

### 3️⃣ Deploy

```bash
npm run build
wrangler deploy
```

## ✅ Tutto fatto!

Ora puoi caricare i certificati medici. Il sistema:
- Salva il file su R2
- Genera un URL pubblico
- Salva l'URL su Airtable

## 🧪 Come testare

1. Vai sulla pagina di dettaglio di un bambino
2. Clicca su "Carica certificato medico"
3. Seleziona un file PDF o immagine
4. Seleziona la data di scadenza
5. Clicca "Carica certificato"

Se tutto funziona, vedrai il messaggio "Certificato caricato con successo! ✅"

## 💰 Costi

**GRATUITO** fino a:
- 10 GB di storage
- 1 milione di upload al mese
- 10 milioni di download al mese

Per una scuola di ciclismo, questo è più che sufficiente! 🚴‍♂️

## ❓ Problemi?

Se R2 non è configurato, l'app mostrerà:
> "Storage non configurato. Contatta l'amministratore per configurare R2 bucket."

In questo caso, verifica di aver creato il bucket R2 su Cloudflare.

## 📂 Dove vengono salvati i file?

I file sono organizzati così su R2:

```
certificati-medici/
  ├── certificati/
  │   ├── rec123abc.../
  │   │   ├── 1234567890-certificato.pdf
  │   │   └── 1234567891-nuovo-certificato.pdf
  │   └── rec456def.../
  │       └── 1234567892-certificato.pdf
```

Ogni bambino ha la sua cartella identificata dall'ID Airtable.

## 🔐 Sicurezza

- I file sono accessibili solo tramite l'API
- L'API verifica che il genitore sia autenticato
- L'API verifica che il bambino appartenga al genitore
- URL dei file contengono timestamp casuali

## 📖 Documentazione completa

Leggi `CONFIGURAZIONE_R2.md` per maggiori dettagli tecnici.
