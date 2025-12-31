# ✅ CORREZIONE FINALE: Nomi Esatti dei Campi Airtable

## Problema Risolto

I campi **lookup** in Airtable **NON** seguono una regola uniforme. Alcuni hanno il suffisso `(from TABELLA_X)` e altri **NO**!

---

## 📋 Nomi Esatti Verificati per TABELLA_ISCRIZIONI

### ✅ CAMPI CON suffisso "(from TABELLA_X)":

#### Da TABELLA_BAMBINI:
- ✅ `'NOME_BAMBINO (from TABELLA_BAMBINI)'`
- ✅ `'COGNOME_BAMBINO (from TABELLA_BAMBINI)'`
- ✅ `'DATA_NASCITA_BAMBINO (from TABELLA_BAMBINI)'`
- ✅ `'CODICE_FISCALE_BAMBINO (from TABELLA_BAMBINI)'`
- ✅ `'VIA_RESIDENZA_BAMBINO (from TABELLA_BAMBINI)'`
- ✅ `'CITTA_RESIDENZA_BAMBINO (from TABELLA_BAMBINI)'`
- ✅ `'LUOGO_NASCITA_BAMBINO (from TABELLA_BAMBINI)'`
- ✅ `'CERTIFICATO_MEDICO_STATO (from TABELLA_BAMBINI)'`

#### Da TABELLA_GENITORI:
- ✅ `'NOME_GENITORE (from TABELLA_GENITORI)'`
- ✅ `'COGNOME_GENITORE (from TABELLA_GENITORI)'`
- ✅ `'EMAIL_GENITORE (from TABELLA_GENITORI)'`

#### Da TABELLA_TARIFFE:
- ✅ `'ANNO_ISCRIZIONE (from TABELLA_TARIFFE)'`
- ✅ `'QUOTA_TOTALE_ANNO (from TABELLA_TARIFFE)'`
- ✅ `'NUMERO_RATE (from TABELLA_TARIFFE)'`
- ✅ `'IMPORTO_RATA (from TABELLA_TARIFFE)'`
- ✅ `'SCADENZA_RATE (from TABELLA_TARIFFE)'`
- ✅ `'IMPORTO_KIT_SCUOLA (from TABELLA_TARIFFE)'`
- ✅ `'IMPORTO_ISCRIZIONE (from TABELLA_TARIFFE)'`

### ⚠️ CAMPI SENZA suffisso "(from TABELLA_X)":

- ❌ NON usare: `'STATO_ISCRIZIONE (from TABELLA_TARIFFE)'`
  - ✅ Usare: `STATO_ISCRIZIONE`

- ❌ NON usare: `'CATEGORIA_FCI (from TABELLA_BAMBINI)'`
  - ✅ Usare: `CATEGORIA_FCI`

---

## 🔧 File Corretti

### 1. **src/lib/airtable.ts**
```typescript
export interface Iscrizione {
  id?: string;
  fields: {
    // ...
    STATO_ISCRIZIONE?: string | string[]; // ⚠️ SENZA suffisso!
    CATEGORIA_FCI?: string | string[]; // ⚠️ SENZA suffisso!
    'NOME_BAMBINO (from TABELLA_BAMBINI)'?: string | string[]; // ✅ CON suffisso
    'COGNOME_BAMBINO (from TABELLA_BAMBINI)'?: string | string[]; // ✅ CON suffisso
    'ANNO_ISCRIZIONE (from TABELLA_TARIFFE)'?: string | string[]; // ✅ CON suffisso
    // ...
  };
}
```

### 2. **src/components/ListaIscrizioni.tsx**
```typescript
const nomeBambino = iscrizione.fields['NOME_BAMBINO (from TABELLA_BAMBINI)']?.[0] || 'N/D';
const cognomeBambino = iscrizione.fields['COGNOME_BAMBINO (from TABELLA_BAMBINI)']?.[0] || '';
const anno = iscrizione.fields['ANNO_ISCRIZIONE (from TABELLA_TARIFFE)']?.[0] || 'N/D';
const stato = iscrizione.fields.STATO_ISCRIZIONE?.[0]; // ⚠️ SENZA suffisso!
```

### 3. **src/components/DettaglioIscrizione.tsx**
```typescript
const nomeBambino = normalizeLookup(fields['NOME_BAMBINO (from TABELLA_BAMBINI)']) || '-';
const cognomeBambino = normalizeLookup(fields['COGNOME_BAMBINO (from TABELLA_BAMBINI)']) || '-';
const categoria = normalizeLookup(fields.CATEGORIA_FCI); // ⚠️ SENZA suffisso!
const annoIscrizione = normalizeLookup(fields['ANNO_ISCRIZIONE (from TABELLA_TARIFFE)']);
```

### 4. **src/pages/api/bambini/index.ts**
```typescript
const statoIscrizione = iscrizione.fields.STATO_ISCRIZIONE; // ⚠️ SENZA suffisso!
```

---

## 📌 Regola Importante

**NON assumere** che tutti i campi lookup abbiano il suffisso `(from TABELLA_X)`!

### Come Verificare il Nome Corretto:
1. Apri Airtable nell'interfaccia web
2. Vai sulla tabella TABELLA_ISCRIZIONI
3. Clicca sull'icona ⚙️ del campo per vedere i dettagli
4. Il nome che vedi nell'API è quello **esatto** che devi usare nel codice

Oppure:

5. Fai una chiamata GET all'API di Airtable per un singolo record
6. Guarda i nomi dei campi nella risposta JSON
7. Usa **esattamente** quei nomi nel codice TypeScript

---

## 🎯 Risultato

Ora il codice usa i **nomi esatti** dei campi come li restituisce Airtable API:

- ✅ `STATO_ISCRIZIONE` (senza suffisso)
- ✅ `CATEGORIA_FCI` (senza suffisso)
- ✅ `'NOME_BAMBINO (from TABELLA_BAMBINI)'` (con suffisso)
- ✅ `'COGNOME_BAMBINO (from TABELLA_BAMBINI)'` (con suffisso)
- ✅ `'ANNO_ISCRIZIONE (from TABELLA_TARIFFE)'` (con suffisso)

---

## 🚀 Prossimi Passi

1. ✅ Deploy su Webflow
2. ✅ Testa la lista iscrizioni
3. ✅ Verifica che ora i dati vengano caricati correttamente

---

## 💡 Lezione Appresa

Airtable aggiunge il suffisso `(from TABELLA_X)` ai campi lookup **solo quando è necessario** per disambiguare campi con lo stesso nome provenienti da tabelle diverse.

Se nella stessa tabella hai:
- Un lookup `STATO_ISCRIZIONE` da TABELLA_TARIFFE
- Nessun altro campo con lo stesso nome

Allora Airtable **non aggiunge** il suffisso perché non c'è ambiguità!

Ma se hai:
- Un lookup `NOME` da TABELLA_BAMBINI
- Un lookup `NOME` da TABELLA_GENITORI

Allora Airtable **deve aggiungere** il suffisso per distinguerli:
- `'NOME (from TABELLA_BAMBINI)'`
- `'NOME (from TABELLA_GENITORI)'`

**Morale:** Verifica **sempre** i nomi esatti nell'API, non assumere nulla! 🎯
