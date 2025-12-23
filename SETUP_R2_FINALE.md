# ✅ Setup R2 Completato - Pronto per il Deploy

## 🎉 Stato Attuale

- ✅ Bucket R2 `certificati-medici` creato su Cloudflare
- ✅ Binding R2 configurato in `wrangler.jsonc`
- ✅ Types generati correttamente
- ✅ Codice API aggiornato per usare il binding `R2`
- ✅ Endpoint per servire i file configurato

## 📋 Configurazione Finale

### wrangler.jsonc
```jsonc
"r2_buckets": [
  {
    "binding": "R2",
    "bucket_name": "certificati-medici"
  }
]
```

### TypeScript Types Generati
```typescript
declare namespace Cloudflare {
  interface Env {
    R2: R2Bucket;
    ASSETS: Fetcher;
  }
}
```

## 🚀 Deploy

Ora puoi fare il deploy:

```bash
npm run build
wrangler deploy
```

## 🧪 Test

Dopo il deploy, testa il caricamento:

1. Accedi come genitore
2. Vai su un bambino
3. Clicca "Carica certificato medico"
4. Seleziona un PDF o immagine
5. Seleziona data di scadenza
6. Clicca "Carica certificato"

**Risultato atteso**: "Certificato caricato con successo! ✅"

## 📂 Struttura File su R2

I file vengono salvati con questa struttura:

```
certificati-medici/
  └── certificati/
      ├── rec123abc.../
      │   ├── 1234567890-certificato.pdf
      │   └── 1234567891-nuovo-certificato.pdf
      └── rec456def.../
          └── 1234567892-certificato.pdf
```

## 🔍 Debug

Se hai problemi, usa Wrangler per vedere i log in tempo reale:

```bash
wrangler tail
```

Poi prova a caricare un certificato e osserva i log.

### Log di Successo
```
[Certificato API] Starting POST request
[Certificato API] Genitore found: true
[Certificato API] Bambino ID: rec123abc...
[Certificato API] Bambino found: true
[Certificato API] File validation passed
[Certificato API] Uploading to R2: certificati/rec123abc.../1234567890-certificato.pdf
[Certificato API] File uploaded to R2 successfully
[Certificato API] Public URL: https://yourapp.com/api/certificati/...
[Certificato API] Certificate uploaded successfully
```

### Possibili Errori

#### Errore: "Storage non configurato"
- **Causa**: R2 binding non trovato
- **Soluzione**: Verifica che il bucket esista su Cloudflare e che `wrangler.jsonc` sia corretto

#### Errore: "INVALID_ATTACHMENT_OBJECT"
- **Causa**: R2 non sta funzionando e l'app sta provando a salvare direttamente su Airtable
- **Soluzione**: Controlla i log per vedere se R2 sta restituendo errori

#### Errore: "File not found" quando scarichi
- **Causa**: File non caricato correttamente su R2
- **Soluzione**: Controlla i log di upload e verifica che `r2.put()` abbia successo

## 💾 Backup e Gestione

### Vedere i file su R2
1. Vai su Cloudflare Dashboard
2. Seleziona **R2**
3. Clicca sul bucket `certificati-medici`
4. Naviga nelle cartelle

### Scaricare un file manualmente
Puoi scaricare i file direttamente dalla dashboard R2 di Cloudflare.

### Eliminare file vecchi
Se un genitore carica un nuovo certificato, il vecchio file rimane su R2 ma non è più referenziato da Airtable. In futuro potresti voler implementare una pulizia periodica.

## 🔐 Sicurezza

- ✅ File accessibili solo tramite API autenticata
- ✅ Verifica che il genitore sia proprietario del bambino
- ✅ URL con timestamp per evitare collisioni
- ✅ Validazione tipo file (solo PDF, JPG, PNG)
- ✅ Limite dimensione file (10MB)

## 📊 Monitoraggio

### Uso Storage
Vai su Cloudflare Dashboard → R2 → certificati-medici → Metrics per vedere:
- Spazio utilizzato
- Numero di file
- Operazioni di lettura/scrittura

### Limiti Gratuiti
- 10 GB storage
- 1M write operations/mese
- 10M read operations/mese

## ✨ Pronto!

Tutto è configurato. Dopo il deploy con `wrangler deploy`, l'app sarà in grado di caricare e servire i certificati medici! 🚀
