# Aggiornamento: Pulsanti Unificati e Colori Brand

## Modifiche Implementate

### 1. Classe Button Unificata
- Creata classe `.btn-standard` in `src/styles/global.css`
- Definisce altezza fissa: `height: 2.5rem` e `min-height: 2.5rem`
- Applicata a tutti i pulsanti dell'applicazione per uniformità

### 2. Pulsante "Modifica" con Icona
- **Dashboard**: Il link "Modifica il tuo profilo" è stato sostituito con un pulsante che include:
  - Icona di matita a sinistra
  - Testo "Modifica"
  - Classe `pulsante1` per stile coerente
  - Classe `btn-standard` per altezza uniforme

- **Dettaglio Bambino**: Pulsante "Modifica" con icona aggiunto nella barra dei pulsanti

### 3. Pulsante Elimina con Colore Rosso
- **Colore**: Utilizza `var(--_redesign---palette-brand--rosso)` dal design system
- **Icona**: X bianca centrata
- **Posizionamento**: Nella pagina di dettaglio bambino, insieme a "Indietro" e "Modifica"
- **Funzionalità**: Apre un dialog di conferma prima dell'eliminazione

### 4. Card Bambini con Sfondo Sky
- **Colore**: Utilizza `var(--_redesign---palette-brand--sky)` dal design system
- **Applicato a**:
  - Card nella lista bambini (`ListaBambini.tsx`)
  - Card principale nel dettaglio bambino (`DettaglioBambino.tsx`)
- **Contrasto**: Icone e testi in bianco per migliore leggibilità

### 5. Pulsanti Homepage
- Aggiunta classe `btn-standard` ai pulsanti "Registrati" e "Accedi"
- Altezza uniforme con il resto dell'applicazione

## File Modificati

1. **src/styles/global.css**
   - Aggiunta classe `.btn-standard` con altezza uniforme

2. **src/components/DashboardGenitore.tsx**
   - Sostituito ButtonPrimary con link `<a>` che usa `pulsante1` e icona
   - Aggiunta classe `btn-standard` al pulsante "Esci"

3. **src/components/DettaglioBambino.tsx**
   - Sfondo sky per la card principale
   - Pulsante "Elimina" rosso con icona X
   - Tutti i pulsanti con classe `btn-standard`

4. **src/components/ListaBambini.tsx**
   - Sfondo sky per le card dei bambini
   - Icone e testi in bianco per contrasto
   - Pulsante "Aggiungi" con classe `btn-standard`

5. **src/pages/index.astro**
   - Classe `btn-standard` sui pulsanti CTA

## Colori Brand Utilizzati

```css
/* Colore Sky - per card bambini */
var(--_redesign---palette-brand--sky)
/* hsla(210.48387096774195, 53.45%, 54.51%, 1.00) */

/* Colore Rosso - per pulsante elimina */
var(--_redesign---palette-brand--rosso)
/* hsla(0, 77.67%, 42.16%, 1.00) */
```

## Consistenza Visiva

Tutti i pulsanti ora hanno:
- ✅ Altezza uniforme di 2.5rem
- ✅ Stile coerente con i componenti Devlink
- ✅ Icone allineate e dimensionate correttamente
- ✅ Colori dal design system per elementi brand

## Note per il Futuro

- La classe `.btn-standard` può essere estesa per altri componenti button
- I colori brand sono centralizzati in `src/site-components/global.css`
- Tutti i pulsanti mantengono la responsività mobile-first
