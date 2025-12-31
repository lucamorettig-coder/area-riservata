# ✅ Navigazione Lineare - Riepilogo Completo

## 📋 **Regola Generale**

**NON avere mai contemporaneamente il pulsante "Indietro" (←) e il pulsante "Annulla".**

---

## 🗺️ **Mappa di Navigazione**

### **Dashboard** (`/dashboard`)
- ❌ Nessun pulsante indietro
- ❌ Nessun pulsante annulla
- ✅ Pulsante "Esci" per logout
- ✅ Pulsanti CTA per azioni (Aggiungi bambino, Nuova iscrizione, Modifica profilo)

---

### **Gestione Bambini**

#### 1. **Lista Bambini** (nella Dashboard)
- Ogni card bambino ha:
  - Pulsante "Vedi dettagli" → Va a `/bambini/[id]`

#### 2. **Dettaglio Bambino** (`/bambini/[id]`)
- ✅ **Back button (←)** in basso: "Indietro" → Torna a `/dashboard`
- ❌ **NO** pulsante "Annulla"
- ✅ Pulsante "Modifica" → Va a `/bambini/[id]/modifica`
- ✅ Pulsante "Elimina" (con conferma)

#### 3. **Aggiungi Bambino** (`/bambini/aggiungi`)
- ❌ **NO** back button in alto
- ✅ **Pulsante "Annulla"** in basso → Torna a `/dashboard`
- ✅ Pulsante "Aggiungi Bambino" (submit)

#### 4. **Modifica Bambino** (`/bambini/[id]/modifica`)
- ❌ **NO** back button in alto
- ✅ **Pulsante "Annulla"** in basso → Torna a `/bambini/[id]`
- ✅ Pulsante "Salva modifiche" (submit)

---

### **Gestione Iscrizioni**

#### 1. **Lista Iscrizioni** (nella Dashboard)
- Ogni card iscrizione ha:
  - Pulsante "Vedi dettagli" → Va a `/iscrizioni/[id]`

#### 2. **Dettaglio Iscrizione** (`/iscrizioni/[id]`)
- ✅ **Back button (←)** in alto a destra (icona) → Torna a `/dashboard`
- ❌ **NO** pulsante "Annulla"
- ✅ Pulsante "Salva modifiche" per aggiornare dati iscrizione

#### 3. **Nuova Iscrizione** (`/iscrizioni/nuova`)
- ❌ **NO** back button in alto
- ✅ **Pulsante "Annulla"** in basso → Torna a `/dashboard`
- ✅ Pulsante "Crea Iscrizione" (submit)

---

### **Gestione Profilo**

#### 1. **Modifica Profilo** (`/modifica-profilo`)
- ❌ **NO** back button in alto
- ✅ **Pulsante "Annulla"** in basso → Torna a `/dashboard`
- ✅ Pulsante "Salva modifiche" (submit)

---

## 🎯 **Logica Decisionale**

### **Quando usare BACK BUTTON (←)**
**Scenario:** Pagina di SOLA VISUALIZZAZIONE (dettaglio/lettura)

**Caratteristiche:**
- L'utente sta guardando informazioni
- NON sta compilando un form
- NON ci sono modifiche da salvare/annullare
- Esempio: Dettaglio bambino, Dettaglio iscrizione

**Posizione:**
- In alto (vicino al titolo) o in basso (tra i pulsanti)
- Icona freccia sinistra: `←`

---

### **Quando usare ANNULLA**
**Scenario:** Pagina con FORM di modifica/creazione

**Caratteristiche:**
- L'utente sta compilando campi
- Ci sono modifiche che possono essere scartate
- È un'azione che può essere abbandonata
- Esempio: Aggiungi bambino, Modifica bambino, Modifica profilo, Nuova iscrizione

**Posizione:**
- In basso, accanto al pulsante di submit
- Stile secondario (bordo)

---

## 📊 **Tabella Riepilogativa**

| Pagina | Back (←) | Annulla | Salva/Submit |
|--------|----------|---------|--------------|
| **Dashboard** | ❌ | ❌ | - |
| **Dettaglio Bambino** | ✅ (in basso) | ❌ | - |
| **Aggiungi Bambino** | ❌ | ✅ (in basso) | ✅ |
| **Modifica Bambino** | ❌ | ✅ (in basso) | ✅ |
| **Dettaglio Iscrizione** | ✅ (in alto dx) | ❌ | ✅ (salva dati) |
| **Nuova Iscrizione** | ❌ | ✅ (in basso) | ✅ |
| **Modifica Profilo** | ❌ | ✅ (in basso) | ✅ |

---

## ✨ **Principi UX Applicati**

### 1. **Consistenza**
- Stesso pattern in tutta l'app
- Stessi stili per pulsanti simili

### 2. **Prevedibilità**
- L'utente sa sempre come tornare indietro
- Nessuna confusione tra "Indietro" e "Annulla"

### 3. **Sicurezza**
- "Annulla" nei form = protezione da perdita dati accidentale
- "Indietro" nelle pagine di dettaglio = navigazione sicura

### 4. **Linearità**
- Flusso chiaro: Dashboard → Dettaglio → Form → Dashboard
- Ogni azione ha un punto di uscita chiaro

---

## 🚀 **Implementazione Completata**

### ✅ File Aggiornati:
1. `src/components/AggiungiBambinoForm.tsx` → NO back, SI annulla
2. `src/components/ModificaBambinoForm.tsx` → NO back, SI annulla
3. `src/components/NuovaIscrizioneForm.tsx` → NO back, SI annulla
4. `src/components/ModificaProfiloForm.tsx` → NO back, SI annulla
5. `src/pages/bambini/[id].astro` → SI back (già presente)
6. `src/components/DettaglioIscrizione.tsx` → SI back (già presente)

### ✅ Verificato:
- Dashboard non ha back/annulla (corretto)
- Ogni form ha solo Annulla
- Ogni dettaglio ha solo Back
- Nessuna pagina ha entrambi

---

## 📝 **Note per il Futuro**

Se dovessi aggiungere nuove pagine:

1. **È una pagina di VISUALIZZAZIONE?**
   → Aggiungi BACK button

2. **È una pagina con FORM?**
   → Aggiungi pulsante ANNULLA

3. **Mai usare entrambi sulla stessa pagina**

---

**Data aggiornamento:** 30 Dicembre 2025  
**Stato:** ✅ Navigazione lineare completa e coerente
