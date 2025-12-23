# Configurazione Supabase

## Setup Iniziale

### 1. Installazione (già completata)
```bash
npm install @supabase/supabase-js
```

### 2. Variabili d'Ambiente

Aggiungi queste variabili al tuo file `.env`:

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

#### Come ottenere le credenziali:

1. Vai su [https://supabase.com](https://supabase.com)
2. Accedi o crea un account
3. Crea un nuovo progetto (o seleziona uno esistente)
4. Vai su **Settings** → **API**
5. Copia:
   - **Project URL** → `SUPABASE_URL`
   - **anon/public key** → `SUPABASE_ANON_KEY`

### 3. Configurazione Cloudflare Workers (Produzione)

Quando fai il deploy su Webflow Cloud, aggiungi le variabili d'ambiente anche lì:

1. Vai su **Webflow Apps** → **Settings** → **Environment Variables**
2. Aggiungi:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

## Utilizzo

### In API Routes (server-side)

```typescript
import { getSupabaseClient } from '../lib/supabase';

export const GET: APIRoute = async ({ locals }) => {
  // Usa getSupabaseClient con runtime env per Cloudflare Workers
  const supabase = getSupabaseClient(locals?.runtime);
  
  // Ora puoi usare supabase
  const { data, error } = await supabase
    .from('your_table')
    .select('*');
    
  // ...
};
```

### In file .astro (server-side)

```astro
---
import { getSupabaseClient } from '../lib/supabase';

const supabase = getSupabaseClient(Astro.locals?.runtime);

const { data, error } = await supabase
  .from('your_table')
  .select('*');
---
```

### In componenti React (client-side)

Per il client-side, dovrai chiamare le tue API routes che a loro volta useranno Supabase:

```typescript
// Nel componente React
const response = await fetch(`${baseUrl}/api/your-endpoint`);
const data = await response.json();
```

## Note Importanti

1. **Non esporre mai la Service Role Key** nel codice client o nelle variabili d'ambiente client-side
2. La **anon/public key** è sicura per uso client-side ma usa Row Level Security (RLS)
3. Configura sempre le **RLS policies** in Supabase per proteggere i dati
4. Il client Supabase è configurato con `persistSession: true` per mantenere la sessione utente

## Row Level Security (RLS)

Ricorda di abilitare RLS sulle tue tabelle Supabase:

```sql
-- Abilita RLS
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Esempio di policy: solo lettura per tutti
CREATE POLICY "Allow public read access"
ON your_table FOR SELECT
TO public
USING (true);

-- Esempio: scrittura solo per utenti autenticati
CREATE POLICY "Allow authenticated users to insert"
ON your_table FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

## Migrazione da Airtable

Se stai migrando da Airtable a Supabase:

1. Esporta i dati da Airtable (CSV)
2. Crea le tabelle in Supabase
3. Importa i dati usando il dashboard di Supabase
4. Aggiorna le API routes per usare Supabase invece di Airtable
5. Testa accuratamente prima di rimuovere il codice Airtable

## Risorse

- [Documentazione Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
