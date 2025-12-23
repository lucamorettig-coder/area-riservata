import { useState, useEffect } from 'react';
import { ButtonPrimary } from './ButtonPrimary';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { baseUrl } from '../lib/base-url';

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  useEffect(() => {
    // Verifica se c'è un hash nella URL (token di recovery da Supabase)
    const checkRecoverySession = () => {
      const hash = window.location.hash;
      console.log('[ResetPasswordForm] URL hash:', hash);

      // Supabase usa diversi parametri nell'hash per il recovery
      // Può essere: #access_token=...&type=recovery
      // Oppure: #error=...&error_description=...
      
      if (hash) {
        // Verifica se c'è un errore nell'hash
        if (hash.includes('error=')) {
          console.log('[ResetPasswordForm] Error in hash, invalid session');
          setIsValidSession(false);
          return;
        }

        // Verifica se c'è type=recovery o access_token
        if (hash.includes('type=recovery') || hash.includes('access_token=')) {
          console.log('[ResetPasswordForm] Valid recovery session detected');
          setIsValidSession(true);
          return;
        }
      }

      // Nessun hash o hash non valido
      console.log('[ResetPasswordForm] No valid recovery session');
      setIsValidSession(false);
    };

    checkRecoverySession();

    // Listener per cambiamenti nell'URL (se l'utente torna indietro)
    const handleHashChange = () => {
      checkRecoverySession();
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validazione campi
    if (!password || !confirmPassword) {
      setError('Compila tutti i campi');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setError('La password deve contenere almeno 8 caratteri');
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Le password non coincidono');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setPassword('');
        setConfirmPassword('');
        
        // Redirect al login dopo 3 secondi
        setTimeout(() => {
          window.location.href = `${baseUrl}/login?reset=success`;
        }, 3000);
      } else {
        setError(data.error || 'Errore durante l\'aggiornamento della password');
      }
    } catch (error) {
      console.error('[ResetPasswordForm] Error:', error);
      setError('Errore di connessione. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostra messaggio di caricamento durante la verifica della sessione
  if (isValidSession === null) {
    return (
      <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h3 className="text-xl sm:text-2xl font-bold font-heading">
            Reimposta Password
          </h3>
          <p className="text-sm text-muted-foreground">Verifica sessione in corso...</p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid var(--muted)',
              borderTop: '4px solid var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          ></div>
        </div>
      </div>
    );
  }

  // Se la sessione non è valida, mostra messaggio di errore
  if (!isValidSession) {
    return (
      <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h3 className="text-xl sm:text-2xl font-bold font-heading">
            Reimposta Password
          </h3>
          <p className="text-sm text-muted-foreground">Link non valido o scaduto</p>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              backgroundColor: 'var(--destructive)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              opacity: 0.1,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--destructive)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <p className="text-sm text-muted-foreground" style={{ margin: 0 }}>
              Il link di reset password non è valido o è scaduto. 
              Per motivi di sicurezza, i link hanno una validità limitata nel tempo.
            </p>
            <p className="text-sm text-muted-foreground" style={{ margin: '0.5rem 0 0 0' }}>
              Richiedi un nuovo link dalla pagina di login cliccando su "Password dimenticata?".
            </p>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

        <ButtonPrimary
          onClick={() => window.location.href = `${baseUrl}/login`}
          className="w-full h-10"
        >
          Torna al Login
        </ButtonPrimary>
      </div>
    );
  }

  // Form di reset password
  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Titolo principale */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h3 className="text-xl sm:text-2xl font-bold font-heading" style={{ wordBreak: 'break-word' }}>
          Reimposta Password
        </h3>
        <p className="text-sm text-muted-foreground">
          Inserisci la tua nuova password
        </p>
      </div>

      {success && (
        <>
          <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>
          <div style={{ padding: '0.75rem 1rem', borderRadius: '0' }} className="bg-green-50 border border-green-200 text-green-800 text-sm">
            Password aggiornata correttamente! Reindirizzamento al login...
          </div>
        </>
      )}

      {error && (
        <>
          <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>
          <div style={{ padding: '0.75rem 1rem', borderRadius: '0' }} className="bg-red-50 border border-red-200 text-red-800 text-sm">
            {error}
          </div>
        </>
      )}

      {/* Separatore */}
      <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

      {/* SEZIONE: Campi password */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          <Label htmlFor="password" className="text-sm">Nuova Password *</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Inserisci la nuova password"
            autoComplete="new-password"
            className="h-9"
            disabled={isSubmitting || success}
          />
          <p className="text-xs text-muted-foreground" style={{ margin: 0 }}>
            Almeno 8 caratteri
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          <Label htmlFor="confirm-password" className="text-sm">Conferma Password *</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Conferma la nuova password"
            autoComplete="new-password"
            className="h-9"
            disabled={isSubmitting || success}
          />
        </div>
      </div>

      {/* Separatore */}
      <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

      {/* CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <ButtonPrimary type="submit" disabled={isSubmitting || success} className="w-full h-10">
          {isSubmitting ? 'Aggiornamento password...' : 'Imposta nuova password'}
        </ButtonPrimary>
        <div className="text-center">
          <button
            type="button"
            onClick={() => window.location.href = `${baseUrl}/login`}
            className="text-primary hover:underline text-sm"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            disabled={isSubmitting}
          >
            Torna al Login
          </button>
        </div>
      </div>
    </form>
  );
}
