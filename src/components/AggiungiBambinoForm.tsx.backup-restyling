import { useState } from 'react';
import { ButtonPrimary } from './ButtonPrimary';
import { ButtonSecondary } from './ButtonSecondary';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { baseUrl } from '../lib/base-url';

interface FormData {
  NOME_BAMBINO: string;
  COGNOME_BAMBINO: string;
  DATA_NASCITA_BAMBINO: string;
  LUOGO_NASCITA_BAMBINO: string;
  CODICE_FISCALE_BAMBINO: string;
  VIA_RESIDENZA_BAMBINO: string;
  CITTA_RESIDENZA_BAMBINO: string;
}

interface FormErrors {
  [key: string]: string;
}

interface ApiError {
  error?: string;
  errors?: Array<{ field: string; message: string }>;
  details?: string;
}

export default function AggiungiBambinoForm() {
  const [formData, setFormData] = useState<FormData>({
    NOME_BAMBINO: '',
    COGNOME_BAMBINO: '',
    DATA_NASCITA_BAMBINO: '',
    LUOGO_NASCITA_BAMBINO: '',
    CODICE_FISCALE_BAMBINO: '',
    VIA_RESIDENZA_BAMBINO: '',
    CITTA_RESIDENZA_BAMBINO: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitErrorDetails, setSubmitErrorDetails] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCodiceFiscaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      CODICE_FISCALE_BAMBINO: value.toUpperCase() 
    }));
    if (errors.CODICE_FISCALE_BAMBINO) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.CODICE_FISCALE_BAMBINO;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitErrorDetails('');
    setErrors({});

    try {
      console.log('[Form] Submitting bambino data...');
      const response = await fetch(`${baseUrl}/api/bambini`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('[Form] Response status:', response.status);
      const data = await response.json() as ApiError;
      console.log('[Form] Response data:', data);

      if (!response.ok) {
        if (data.errors) {
          const errorMap: FormErrors = {};
          data.errors.forEach((err) => {
            errorMap[err.field] = err.message;
          });
          setErrors(errorMap);
        } else {
          setSubmitError(data.error || 'Errore durante l\'aggiunta del bambino');
          if (data.details) {
            setSubmitErrorDetails(data.details);
          }
        }
      } else {
        // Redirect alla dashboard con parametro di successo
        console.log('[Form] Success! Redirecting to dashboard...');
        window.location.href = `${baseUrl}/dashboard?bambino-aggiunto=true`;
      }
    } catch (error) {
      console.error('[Form] Fetch error:', error);
      setSubmitError('Errore di connessione. Riprova più tardi.');
      setSubmitErrorDetails(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Titolo principale */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h3 className="text-xl sm:text-2xl font-bold font-heading" style={{ wordBreak: 'break-word' }}>
          Aggiungi Bambino
        </h3>
        <p className="text-sm text-muted-foreground">Compila tutti i campi per registrare un bambino</p>
      </div>

      {submitError && (
        <>
          <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>
          <div style={{ padding: '0.75rem 1rem' }} className="bg-red-50 border border-red-200 text-red-800 text-sm">
            <p className="font-semibold">{submitError}</p>
            {submitErrorDetails && (
              <p className="text-xs mt-2 opacity-80">{submitErrorDetails}</p>
            )}
          </div>
        </>
      )}

      {/* Separatore */}
      <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

      {/* SEZIONE: Dati anagrafici */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="5"></circle>
              <path d="M20 21a8 8 0 1 0-16 0"></path>
            </svg>
          </div>
          <h4 className="font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontSize: '1.6rem', margin: 0 }}>
            Dati anagrafici
          </h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <Label htmlFor="NOME_BAMBINO" className="text-sm">Nome *</Label>
            <Input
              id="NOME_BAMBINO"
              name="NOME_BAMBINO"
              value={formData.NOME_BAMBINO}
              onChange={handleChange}
              autoComplete="given-name"
              className={`h-9 ${errors.NOME_BAMBINO ? 'border-red-500' : ''}`}
            />
            {errors.NOME_BAMBINO && (
              <p className="text-xs text-red-600">{errors.NOME_BAMBINO}</p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <Label htmlFor="COGNOME_BAMBINO" className="text-sm">Cognome *</Label>
            <Input
              id="COGNOME_BAMBINO"
              name="COGNOME_BAMBINO"
              value={formData.COGNOME_BAMBINO}
              onChange={handleChange}
              autoComplete="family-name"
              className={`h-9 ${errors.COGNOME_BAMBINO ? 'border-red-500' : ''}`}
            />
            {errors.COGNOME_BAMBINO && (
              <p className="text-xs text-red-600">{errors.COGNOME_BAMBINO}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <Label htmlFor="DATA_NASCITA_BAMBINO" className="text-sm">Data di nascita *</Label>
            <Input
              id="DATA_NASCITA_BAMBINO"
              name="DATA_NASCITA_BAMBINO"
              type="date"
              value={formData.DATA_NASCITA_BAMBINO}
              onChange={handleChange}
              autoComplete="bday"
              className={`h-9 ${errors.DATA_NASCITA_BAMBINO ? 'border-red-500' : ''}`}
            />
            {errors.DATA_NASCITA_BAMBINO && (
              <p className="text-xs text-red-600">{errors.DATA_NASCITA_BAMBINO}</p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <Label htmlFor="LUOGO_NASCITA_BAMBINO" className="text-sm">Luogo di nascita *</Label>
            <Input
              id="LUOGO_NASCITA_BAMBINO"
              name="LUOGO_NASCITA_BAMBINO"
              value={formData.LUOGO_NASCITA_BAMBINO}
              onChange={handleChange}
              className={`h-9 ${errors.LUOGO_NASCITA_BAMBINO ? 'border-red-500' : ''}`}
            />
            {errors.LUOGO_NASCITA_BAMBINO && (
              <p className="text-xs text-red-600">{errors.LUOGO_NASCITA_BAMBINO}</p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          <Label htmlFor="CODICE_FISCALE_BAMBINO" className="text-sm">Codice fiscale *</Label>
          <Input
            id="CODICE_FISCALE_BAMBINO"
            name="CODICE_FISCALE_BAMBINO"
            value={formData.CODICE_FISCALE_BAMBINO}
            onChange={handleCodiceFiscaleChange}
            maxLength={16}
            placeholder="RSSMRA15A01H501U"
            className={`h-9 ${errors.CODICE_FISCALE_BAMBINO ? 'border-red-500' : ''}`}
          />
          {errors.CODICE_FISCALE_BAMBINO && (
            <p className="text-xs text-red-600">{errors.CODICE_FISCALE_BAMBINO}</p>
          )}
        </div>
      </div>

      {/* Separatore */}
      <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

      {/* SEZIONE: Residenza */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <h4 className="font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontSize: '1.6rem', margin: 0 }}>
            Residenza
          </h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: '1rem' }}>
          <div className="sm:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <Label htmlFor="VIA_RESIDENZA_BAMBINO" className="text-sm">Indirizzo *</Label>
            <Input
              id="VIA_RESIDENZA_BAMBINO"
              name="VIA_RESIDENZA_BAMBINO"
              value={formData.VIA_RESIDENZA_BAMBINO}
              onChange={handleChange}
              placeholder="Via Roma, 123"
              autoComplete="street-address"
              className={`h-9 ${errors.VIA_RESIDENZA_BAMBINO ? 'border-red-500' : ''}`}
            />
            {errors.VIA_RESIDENZA_BAMBINO && (
              <p className="text-xs text-red-600">{errors.VIA_RESIDENZA_BAMBINO}</p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <Label htmlFor="CITTA_RESIDENZA_BAMBINO" className="text-sm">Città *</Label>
            <Input
              id="CITTA_RESIDENZA_BAMBINO"
              name="CITTA_RESIDENZA_BAMBINO"
              value={formData.CITTA_RESIDENZA_BAMBINO}
              onChange={handleChange}
              autoComplete="address-level2"
              className={`h-9 ${errors.CITTA_RESIDENZA_BAMBINO ? 'border-red-500' : ''}`}
            />
            {errors.CITTA_RESIDENZA_BAMBINO && (
              <p className="text-xs text-red-600">{errors.CITTA_RESIDENZA_BAMBINO}</p>
            )}
          </div>
        </div>
      </div>

      {/* Separatore */}
      <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

      {/* CTA */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <ButtonPrimary type="submit" disabled={isSubmitting} className="h-10 shrink-0">
          {isSubmitting ? 'Salvataggio in corso...' : 'Aggiungi bambino'}
        </ButtonPrimary>
        <ButtonSecondary 
          type="button" 
          onClick={() => window.location.href = `${baseUrl}/dashboard`}
          className="h-10 shrink-0"
        >
          Annulla
        </ButtonSecondary>
      </div>
    </form>
  );
}
