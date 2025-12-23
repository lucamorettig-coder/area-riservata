import { useState } from 'react';
import { ButtonPrimary } from './ButtonPrimary';
import { ButtonSecondary } from './ButtonSecondary';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { baseUrl } from '../lib/base-url';

interface RecuperoPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecuperoPasswordModal({ isOpen, onClose }: RecuperoPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    // Validazione email
    if (!email || !email.includes('@')) {
      setMessage('Inserisci un\'email valida');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/reset-password-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Se l\'email è registrata, riceverai un link per reimpostare la password.');
        setEmail('');
        // Chiudi la modale dopo 5 secondi
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setMessage('');
        }, 5000);
      } else {
        setMessage(data.error || 'Impossibile inviare l\'email di recupero, riprova.');
      }
    } catch (error) {
      setMessage('Errore di connessione. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setMessage('');
    setIsSuccess(false);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '1rem',
      }}
      onClick={handleClose}
    >
      <div
        className="card-rounded border bg-card"
        style={{
          maxWidth: '500px',
          width: '100%',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxShadow: '0 10px 25px 0 rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Titolo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--primary-foreground)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold font-heading" style={{ margin: 0 }}>
              Recupero Password
            </h3>
          </div>
          <button
            onClick={handleClose}
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--muted-foreground)',
            }}
            className="hover:bg-muted"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Separatore */}
        <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

        {/* Descrizione */}
        <p className="text-sm text-muted-foreground" style={{ margin: 0 }}>
          Inserisci il tuo indirizzo email. Se è registrato nel sistema, riceverai un link per
          reimpostare la password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <Label htmlFor="recovery-email" className="text-sm">
              Email *
            </Label>
            <Input
              id="recovery-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tua.email@esempio.it"
              autoComplete="email"
              className="h-9"
              disabled={isSubmitting || isSuccess}
            />
          </div>

          {message && (
            <>
              <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>
              <div
                style={{ padding: '0.75rem 1rem', borderRadius: '0' }}
                className={
                  isSuccess
                    ? 'bg-green-50 border border-green-200 text-green-800 text-sm'
                    : 'bg-red-50 border border-red-200 text-red-800 text-sm'
                }
              >
                {message}
              </div>
            </>
          )}

          {/* Separatore */}
          <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

          {/* Pulsanti */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <ButtonPrimary
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="flex-1 h-10"
            >
              {isSubmitting ? 'Invio in corso...' : 'Invia il link'}
            </ButtonPrimary>
            <ButtonSecondary
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 h-10"
            >
              Annulla
            </ButtonSecondary>
          </div>
        </form>
      </div>
    </div>
  );
}
