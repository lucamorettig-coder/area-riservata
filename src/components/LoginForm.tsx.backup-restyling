import { useState, useEffect } from 'react';
import { ButtonPrimary } from './ButtonPrimary';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { baseUrl } from '../lib/base-url';
import RecuperoPasswordModal from './RecuperoPasswordModal';

interface ApiError {
  error?: string;
}

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRegisteredMessage, setShowRegisteredMessage] = useState(false);
  const [showResetSuccessMessage, setShowResetSuccessMessage] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Verifica se c'è il parametro "registered=true" nell'URL
    if (params.get('registered') === 'true') {
      setShowRegisteredMessage(true);
    }
    
    // Verifica se c'è il parametro "reset=success" nell'URL
    if (params.get('reset') === 'success') {
      setShowResetSuccessMessage(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!email || !password) {
      setError('Inserisci email e password');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json() as ApiError;

      if (!response.ok) {
        setError(data.error || 'Errore durante il login');
      } else {
        // Redirect alla dashboard
        window.location.href = `${baseUrl}/dashboard`;
      }
    } catch (error) {
      setError('Errore di connessione. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Titolo principale */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h3 className="text-xl sm:text-2xl font-bold font-heading" style={{ wordBreak: 'break-word' }}>
            Accedi
          </h3>
          <p className="text-sm text-muted-foreground">Inserisci le tue credenziali per accedere</p>
        </div>

        {showRegisteredMessage && (
          <>
            <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>
            <div style={{ padding: '0.75rem 1rem', borderRadius: '0' }} className="bg-green-50 border border-green-200 text-green-800 text-sm">
              Registrazione completata! Ora puoi accedere con le tue credenziali.
            </div>
          </>
        )}

        {showResetSuccessMessage && (
          <>
            <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>
            <div style={{ padding: '0.75rem 1rem', borderRadius: '0' }} className="bg-green-50 border border-green-200 text-green-800 text-sm">
              Password aggiornata con successo! Ora puoi accedere con la nuova password.
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

        {/* SEZIONE: Campi login (senza titolo) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <Label htmlFor="email" className="text-sm">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tua.email@esempio.it"
              autoComplete="email"
              className="h-9"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <Label htmlFor="password" className="text-sm">Password *</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Inserisci la tua password"
              autoComplete="current-password"
              className="h-9"
            />
          </div>

          {/* Link Password dimenticata */}
          <div style={{ textAlign: 'right' }}>
            <button
              type="button"
              onClick={() => setShowRecoveryModal(true)}
              className="text-sm text-primary hover:underline"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Password dimenticata?
            </button>
          </div>
        </div>

        {/* Separatore */}
        <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ButtonPrimary type="submit" disabled={isSubmitting} className="w-full h-10">
            {isSubmitting ? 'Accesso in corso...' : 'Accedi'}
          </ButtonPrimary>
          <div className="text-center">
            <button
              type="button"
              onClick={() => window.location.href = `${baseUrl}/registrazione`}
              className="text-primary hover:underline text-sm"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Non hai un account? Registrati
            </button>
          </div>
        </div>
      </form>

      {/* Modale Recupero Password */}
      <RecuperoPasswordModal
        isOpen={showRecoveryModal}
        onClose={() => setShowRecoveryModal(false)}
      />
    </>
  );
}
