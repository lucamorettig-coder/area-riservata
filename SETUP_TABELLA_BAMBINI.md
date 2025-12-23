# 🔧 Setup TABELLA_BAMBINI in Airtable

## ❌ Problema Attuale

Stai ricevendo un errore 500 quando provi ad accedere a `/api/bambini`. Questo significa che la **TABELLA_BAMBINI** non esiste ancora in Airtable o non è configurata correttamente.

---

## ✅ SOLUZIONE: Creazione Tabella in Airtable

### Step 1: Crea la Tabella TABELLA_BAMBINI

1. Vai nel tuo **Airtable Base** (lo stesso dove hai TABELLA_GENITORI)
2. Clicca su **"Add or Import"** → **"Create empty table"**
3. Rinomina la tabella in: **`TABELLA_BAMBINI`**

### Step 2: Crea i Campi Richiesti

Crea questi campi **ESATTAMENTE** con questi nomi (maiuscole/minuscole sono importanti):

| Nome Campo | Tipo Campo | Configurazione |
|-----------|-----------|----------------|
| `NOME_BAMBINO` | Single line text | - |
| `COGNOME_BAMBINO` | Single line text | - |
| `DATA_NASCITA_BAMBINO` | Date | Format: Local |
| `LUOGO_NASCITA_BAMBINO` | Single line text | - |
| `CODICE_FISCALE_BAMBINO` | Single line text | - |
| `VIA_RESIDENZA_BAMBINO` | Single line text | - |
| `CITTA_RESIDENZA_BAMBINO` | Single line text | - |
| **`GENITORE`** | **Link to another record** | **Link to: TABELLA_GENITORI** |

### Step 3: Configura il Campo GENITORE (IMPORTANTE!)

Questo è il campo più importante per collegare bambini ai genitori:

1. Clicca su **"+"** per aggiungere un nuovo campo
2. Seleziona tipo: **"Link to another record"**
3. Nome campo: **`GENITORE`** (tutto maiuscolo)
4. Link to table: **TABELLA_GENITORI**
5. **NON** permettere di linkare a più record (lascia deselezionato "Allow linking to multiple records")
6. Clicca **"Create field"**

### Step 4: Verifica la Configurazione

La tua tabella TABELLA_BAMBINI dovrebbe avere:
- ✅ 8 campi in totale
- ✅ 7 campi di testo/data
- ✅ 1 campo "Link to another record" chiamato GENITORE

---

## 🔍 VERIFICA: Come Testare se Funziona

### Metodo 1: Prova nell'interfaccia Airtable

1. Vai su TABELLA_BAMBINI
2. Clicca su "+" per aggiungere un record manualmente
3. Compila tutti i campi
4. Nel campo GENITORE, dovresti vedere una lista dei genitori da TABELLA_GENITORI
5. Seleziona un genitore
6. Salva il record

### Metodo 2: Prova nell'app

1. Fai il login nell'app come genitore
2. Vai alla Dashboard
3. La sezione "I tuoi bambini" dovrebbe mostrare "Nessun bambino registrato"
4. Clicca su "Aggiungi bambino"
5. Compila il form
6. Salva

Se la configurazione è corretta, il bambino verrà creato e collegato automaticamente al tuo account genitore.

---

## 🚨 ERRORI COMUNI E SOLUZIONI

### Errore: "Could not find table TABELLA_BAMBINI"
**Soluzione**: Il nome della tabella deve essere **esattamente** `TABELLA_BAMBINI` (tutto maiuscolo, con underscore).

### Errore: "Field GENITORE does not exist"
**Soluzione**: Assicurati di aver creato il campo GENITORE come "Link to another record" che punta a TABELLA_GENITORI.

### Errore: "Invalid value for GENITORE field"
**Soluzione**: Il campo GENITORE deve essere configurato per accettare un array di record IDs. Verifica che sia di tipo "Link to another record".

### I bambini non compaiono nella dashboard
**Possibile causa**: Il collegamento GENITORE non è stato impostato correttamente.

**Verifica**:
1. Apri TABELLA_BAMBINI in Airtable
2. Controlla se il campo GENITORE contiene il link al record del genitore
3. Se è vuoto, il bambino non apparirà nella dashboard di quel genitore

---

## 📊 STRUTTURA FINALE DELLE TABELLE

### TABELLA_GENITORI (già esistente)
```
Fields:
- NOME_GENITORE (text)
- COGNOME_GENITORE (text)
- DATA_NASCITA_GENITORE (date)
- LUOGO_NASCITA_GENITORE (text)
- CODICE_FISCALE_GENITORE (text)
- VIA_RESIDENZA_GENITORE (text)
- CITTA_RESIDENZA_GENITORE (text)
- EMAIL_GENITORE (email)
- CELLULARE_GENITORE (phone)
- FLAG_PRIVACY (checkbox)
```

### TABELLA_BAMBINI (da creare)
```
Fields:
- NOME_BAMBINO (text)
- COGNOME_BAMBINO (text)
- DATA_NASCITA_BAMBINO (date)
- LUOGO_NASCITA_BAMBINO (text)
- CODICE_FISCALE_BAMBINO (text)
- VIA_RESIDENZA_BAMBINO (text)
- CITTA_RESIDENZA_BAMBINO (text)
- GENITORE (link to TABELLA_GENITORI) ← CAMPO CHIAVE
```

---

## 🔗 RELAZIONE TRA LE TABELLE

```
TABELLA_GENITORI
    ↑
    │ (1)
    │
    │ GENITORE field
    │
    │ (N)
    ↓
TABELLA_BAMBINI
```

- Un genitore può avere **molti** bambini
- Ogni bambino ha **un solo** genitore (nel campo GENITORE)

---

## 🎯 DOPO LA CONFIGURAZIONE

Una volta creata la tabella con tutti i campi:

1. **Republish** l'app su Webflow Cloud
2. Fai **login** come genitore
3. Vai alla **Dashboard**
4. Dovresti vedere la sezione "I tuoi bambini" senza errori
5. Prova ad **aggiungere un bambino**
6. Il bambino dovrebbe apparire nella lista

---

## 📞 DEBUG: Verifica in Tempo Reale

Se vuoi verificare cosa sta succedendo:

1. Apri la **Console del Browser** (F12)
2. Vai alla tab **Console**
3. Ricarica la Dashboard
4. Dovresti vedere log tipo:
   ```
   [Airtable] Making request to: TABELLA_BAMBINI
   [Airtable] Total records in TABELLA_BAMBINI: 0
   [Airtable] No bambini found in table
   ```

Se vedi errori rossi, condividili per ulteriore aiuto.

---

## ✅ CHECKLIST FINALE

- [ ] Tabella TABELLA_BAMBINI creata
- [ ] Tutti i 7 campi testo/data creati con nomi corretti
- [ ] Campo GENITORE creato come "Link to another record"
- [ ] Campo GENITORE punta a TABELLA_GENITORI
- [ ] App republicata su Webflow Cloud
- [ ] Dashboard carica senza errore 500
- [ ] Possibile aggiungere bambini tramite form

---

**Nota**: Se dopo aver configurato tutto continui ad avere problemi, verifica che le variabili d'ambiente `AIRTABLE_BASE_ID` e `AIRTABLE_TOKEN` siano configurate correttamente in Webflow Cloud.
