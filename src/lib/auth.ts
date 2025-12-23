import type { AstroCookies } from 'astro';
import { getAirtableClient } from './airtable';

const SESSION_COOKIE = 'session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 giorni

export interface SessionData {
  genitoreId: string;
  email: string;
}

export function createSession(cookies: AstroCookies, data: SessionData) {
  cookies.set(SESSION_COOKIE, JSON.stringify(data), {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
  });
}

export function getSession(cookies: AstroCookies): SessionData | null {
  const sessionCookie = cookies.get(SESSION_COOKIE);
  
  if (!sessionCookie) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie.value) as SessionData;
  } catch {
    return null;
  }
}

export function destroySession(cookies: AstroCookies) {
  cookies.delete(SESSION_COOKIE, {
    path: '/',
  });
}

export function requireAuth(cookies: AstroCookies): SessionData {
  const session = getSession(cookies);
  if (!session) {
    throw new Error('Not authenticated');
  }
  return session;
}

// Funzione helper per recuperare i dati del genitore dalla sessione
export async function getGenitoreFromSession(astro: any) {
  try {
    const session = getSession(astro.cookies);
    
    if (!session) {
      return null;
    }

    const client = getAirtableClient(astro.locals?.runtime);
    
    if (!client) {
      console.error('Client Airtable non disponibile');
      return null;
    }

    const genitore = await client.getGenitoreById(session.genitoreId);
    return genitore;
  } catch (error) {
    console.error('Errore nel recupero del genitore:', error);
    return null;
  }
}
