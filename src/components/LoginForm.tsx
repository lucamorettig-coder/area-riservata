import { useState, useEffect } from 'react';
import { ButtonPrimary } from './ButtonPrimary';
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
    
    if (params.get('registered') === 'true') {
      setShowRegisteredMessage(true);
    }
    
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight m-0">
              Accedi
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">Inserisci le tue credenziali</p>
          </div>
        </div>

        {/* Messaggi di sistema */}
        {showRegisteredMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm p-3">
            Registrazione completata! Ora puoi accedere con le tue credenziali.
          </div>
        )}

        {showResetSuccessMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm p-3">
            Password aggiornata con successo! Ora puoi accedere con la nuova password.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-3">
            {error}
          </div>
        )}

        {/* Divisore */}
        <div className="h-px bg-slate-200 w-full" />

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tua.email@esempio.it"
              autoComplete="email"
              className="h-11 rounded-xl border border-slate-300 shadow-sm focus:border-blue-900 focus:ring-1 focus:ring-blue-900 text-slate-700 text-sm px-3 w-full"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Password *
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Inserisci la tua password"
              autoComplete="current-password"
              className="h-11 rounded-xl border border-slate-300 shadow-sm focus:border-blue-900 focus:ring-1 focus:ring-blue-900 text-slate-700 text-sm px-3 w-full"
              required
            />
          </div>

          {/* Link Password dimenticata */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowRecoveryModal(true)}
              className="text-sm text-blue-700 hover:text-blue-900 hover:underline transition-colors"
            >
              Password dimenticata?
            </button>
          </div>
        </div>

        {/* Divisore */}
        <div className="h-px bg-slate-200 w-full" />

        {/* CTA */}
        <div className="flex flex-col gap-4">
          <ButtonPrimary 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full"
            isLoading={isSubmitting}
            label={isSubmitting ? 'Accesso in corso...' : 'Accedi'}
          />
          
          <div className="text-center">
            <a
              href={`${baseUrl}/registrazione`}
              className="text-sm text-blue-700 hover:text-blue-900 hover:underline transition-colors no-underline"
            >
              Non hai un account? Registrati
            </a>
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
