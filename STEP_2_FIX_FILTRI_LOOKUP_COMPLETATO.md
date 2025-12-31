# ✅ FIX COMPLETATO: Nomi Completi dei Campi Lookup

## Problema Risolto

I campi **lookup** in Airtable includono automaticamente il suffisso `(from TABELLA_X)` nel nome del campo. Questo causava errori perché il codice usava solo i nomi "corti" dei campi.

---

## Campi Lookup Corretti in `TABELLA_ISCRIZIONI`

### ✅ Da TABELLA_BAMBINI:
- ❌ VECCHIO: `NOME_BAMBINO` → ✅ NUOVO: `'NOME_BAMBINO (from TABELLA_BAMBINI)'`
- ❌ VECCHIO: `COGNOME_BAMBINO` → ✅ NUOVO: `'COGNOME_BAMBINO (from TABELLA_BAMBINI)'`
- ❌ VECCHIO: `DATA_NASCITA_BAMBINO` → ✅ NUOVO: `'DATA_NASCITA_BAMBINO (from TABELLA_BAMBINI)'`
- ❌ VECCHIO: `CODICE_FISCALE_BAMBINO` → ✅ NUOVO: `'CODICE_FISCALE_BAMBINO (from TABELLA_BAMBINI)'`
- ❌ VECCHIO: `VIA_RESIDENZA_BAMBINO` → ✅ NUOVO: `'VIA_RESIDENZA_BAMBINO (from TABELLA_BAMBINI)'`
- ❌ VECCHIO: `CITTA_RESIDENZA_BAMBINO` → ✅ NUOVO: `'CITTA_RESIDENZA_BAMBINO (from TABELLA_BAMBINI)'`
- ❌ VECCHIO: `LUOGO_NASCITA_BAMBINO` → ✅ NUOVO: `'LUOGO_NASCITA_BAMBINO (from TABELLA_BAMBINI)'`
- ❌ VECCHIO: `CATEGORIA_FCI` → ✅ NUOVO: `'CATEGORIA_FCI (from TABELLA_BAMBINI)'`
- ❌ VECCHIO: `CERTIFICATO_MEDICO_STATO` → ✅ NUOVO: `'CERTIFICATO_MEDICO_STATO (from TABELLA_BAMBINI)'`

### ✅ Da TABELLA_GENITORI:
- ❌ VECCHIO: `NOME_GENITORE` → ✅ NUOVO: `'NOME_GENITORE (from TABELLA_GENITORI)'`
- ❌ VECCHIO: `COGNOME_GENITORE` → ✅ NUOVO: `'COGNOME_GENITORE (from TABELLA_GENITORI)'`
- ❌ VECCHIO: `EMAIL_GENITORE` → ✅ NUOVO: `'EMAIL_GENITORE (from TABELLA_GENITORI)'`

### ✅ Da TABELLA_TARIFFE:
- ❌ VECCHIO: `ANNO_ISCRIZIONE` → ✅ NUOVO: `'ANNO_ISCRIZIONE (from TABELLA_TARIFFE)'`
- ❌ VECCHIO: `STATO_ISCRIZIONE` → ✅ NUOVO: `'STATO_ISCRIZIONE (from TABELLA_TARIFFE)'`
- ❌ VECCHIO: `QUOTA_TOTALE_ANNO` → ✅ NUOVO: `'QUOTA_TOTALE_ANNO (from TABELLA_TARIFFE)'`
- ❌ VECCHIO: `NUMERO_RATE` → ✅ NUOVO: `'NUMERO_RATE (from TABELLA_TARIFFE)'`
- ❌ VECCHIO: `IMPORTO_RATA` → ✅ NUOVO: `'IMPORTO_RATA (from TABELLA_TARIFFE)'`
- ❌ VECCHIO: `SCADENZA_RATE` → ✅ NUOVO: `'SCADENZA_RATE (from TABELLA_TARIFFE)'`
- ❌ VECCHIO: `IMPORTO_KIT_SCUOLA` → ✅ NUOVO: `'IMPORTO_KIT_SCUOLA (from TABELLA_TARIFFE)'`
- ❌ VECCHIO: `IMPORTO_ISCRIZIONE` → ✅ NUOVO: `'IMPORTO_ISCRIZIONE (from TABELLA_TARIFFE)'`

---

## File Aggiornati

### 1. **src/lib/airtable.ts**
- ✅ Aggiornata interfaccia `Iscrizione` con tutti i nomi completi dei campi lookup
- ✅ Corretti i metodi `createIscrizione()` e `updateIscrizione()` per escludere i campi read-only con i nomi corretti

### 2. **src/components/ListaIscrizioni.tsx**
- ✅ Uso dei nomi completi: `'NOME_BAMBINO (from TABELLA_BAMBINI)'`, `'COGNOME_BAMBINO (from TABELLA_BAMBINI)'`, `'ANNO_ISCRIZIONE (from TABELLA_TARIFFE)'`, `'STATO_ISCRIZIONE (from TABELLA_TARIFFE)'`

### 3. **src/components/DettaglioIscrizione.tsx**
- ✅ Corretto accesso ai campi: `fields['NOME_BAMBINO (from TABELLA_BAMBINI)']`, `fields['COGNOME_BAMBINO (from TABELLA_BAMBINI)']`, `fields['CATEGORIA_FCI (from TABELLA_BAMBINI)']`, `fields['ANNO_ISCRIZIONE (from TABELLA_TARIFFE)']`

### 4. **src/pages/api/bambini/index.ts**
- ✅ Corretto `iscrizione.fields['STATO_ISCRIZIONE (from TABELLA_TARIFFE)']`

---

## Perché Questo Fix è Importante

Airtable **genera automaticamente** i nomi dei campi lookup aggiungendo il suffisso `(from TABELLA_X)` per disambiguare i campi che provengono da tabelle linkate. 

**Esempio:**
Se hai una tabella `TABELLA_ISCRIZIONI` che ha:
- Un campo lookup `NOME_BAMBINO` che prende il valore da `TABELLA_BAMBINI`
- Un campo lookup `NOME_GENITORE` che prende il valore da `TABELLA_GENITORI`

Airtable li chiamerà:
- `NOME_BAMBINO (from TABELLA_BAMBINI)`
- `NOME_GENITORE (from TABELLA_GENITORI)`

**Non possiamo usare i nomi "corti"** (`NOME_BAMBINO`) perché Airtable non li riconosce nell'API.

---

## Prossimi Passi

1. ✅ Deploy su Webflow
2. ✅ Verifica che la lista delle iscrizioni ora carichi correttamente i dati
3. ✅ Verifica che il dettaglio iscrizione mostri nome/cognome bambino e anno

---

## Note per il Futuro

**REGOLA D'ORO:** Quando usi campi **lookup** in Airtable API, verifica **sempre** il nome completo del campo nell'interfaccia di Airtable (o tramite API) prima di scriverlo nel codice.

Il nome che vedi nell'interfaccia web di Airtable **NON è** il nome che devi usare nell'API se è un lookup!

**Come verificare il nome corretto:**
1. Apri Airtable
2. Vai sulla tabella
3. Clicca sull'icona del campo per vedere i dettagli
4. Il nome del campo nell'API include **tutto**, incluso il suffisso `(from TABELLA_X)`
