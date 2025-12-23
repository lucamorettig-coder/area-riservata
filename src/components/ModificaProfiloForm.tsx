import { useState } from 'react';
import { ButtonPrimary } from './ButtonPrimary';
import { ButtonSecondary } from './ButtonSecondary';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { baseUrl } from '../lib/base-url';

interface GenitoreData {
  NOME_GENITORE: string;
  COGNOME_GENITORE: string;
  DATA_NASCITA_GENITORE: string;
  LUOGO_NASCITA_GENITORE: string;
  CODICE_FISCALE_GENITORE: string;
  VIA_RESIDENZA_GENITORE: string;
  CITTA_RESIDENZA_GENITORE: string;
  EMAIL_GENITORE: string;
  CELLULARE_GENITORE: string;
  FLAG_PRIVACY: boolean;
}

interface FormErrors {
  [key: string]: string;
}

interface ApiError {
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

interface ModificaProfiloFormProps {
  genitore: GenitoreData;
}

export default function ModificaProfiloForm({ genitore }: ModificaProfiloFormProps) {
  const [formData, setFormData] = useState<GenitoreData>(genitore);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
      CODICE_FISCALE_GENITORE: value.toUpperCase() 
    }));
    if (errors.CODICE_FISCALE_GENITORE) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.CODICE_FISCALE_GENITORE;
        return newErrors;
      });
    }
  };

  const handlePrivacyChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, FLAG_PRIVACY: checked }));
    if (errors.FLAG_PRIVACY) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.FLAG_PRIVACY;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setErrors({});
    setSubmitSuccess(false);

    try {
      const response = await fetch(`${baseUrl}/api/profilo`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json() as ApiError;

      if (!response.ok) {
        if (data.errors) {
          const errorMap: FormErrors = {};
          data.errors.forEach((err) => {
            errorMap[err.field] = err.message;
          });
          setErrors(errorMap);
        } else {
          setSubmitError(data.error || 'Errore durante l\'aggiornamento');
        }
      } else {
        setSubmitSuccess(true);
        // Redirect dopo 2 secondi
        setTimeout(() => {
          window.location.href = `${baseUrl}/dashboard`;
        }, 2000);
      }
    } catch (error) {
      setSubmitError('Errore di connessione. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div style={{ padding: '1rem 1.5rem' }} className="bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg sm:text-xl font-bold text-green-800" style={{ marginBottom: '0.5rem' }}>
          Profilo aggiornato!
        </h3>
        <p className="text-sm text-green-700">I tuoi dati sono stati salvati con successo. Verrai reindirizzato alla dashboard...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Titolo principale */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h3 className="text-xl sm:text-2xl font-bold font-heading" style={{ wordBreak: 'break-word' }}>
          Modifica Profilo
        </h3>
        <p className="text-sm text-muted-foreground">Aggiorna i tuoi dati personali</p>
      </div>

      {submitError && (
        <>
          <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>
          <div style={{ padding: '0.75rem 1rem' }} className="bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {submitError}
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
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h4 className="font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontSize: '1.6rem', margin: 0 }}>
            Dati anagrafici
          </h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <Label htmlFor="NOME_GENITORE" className="text-sm">Nome *</Label>
            <Input
              id="NOME_GENITORE"
              name="NOME_GENITORE"
              value={formData.NOME_GENITORE}
              onChange={handleChange}
              autoComplete="given-name"
              className={`h-9 ${errors.NOME_GENITORE ? 'border-red-500' : ''}`}
            />
            {errors.NOME_GENITORE && (
              <p className="text-xs text-red-600">{errors.NOME_GENITORE}</p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <Label htmlFor="COGNOME_GENITORE" className="text-sm">Cognome *</Label>
            <Input
              id="COGNOME_GENITORE"
              name="COGNOME_GENITORE"
              value={formData.COGNOME_GENITORE}
              onChange={handleChange}
              autoComplete="family-name"
              className={`h-9 ${errors.COGNOME_GENITORE ? 'border-red-500' : ''}`}
            />
            {errors.COGNOME_GENITORE && (
              <p className="text-xs text-red-600">{errors.COGNOME_GENITORE}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <Label htmlFor="DATA_NASCITA_GENITORE" className="text-sm">Data di nascita *</Label>
            <Input
              id="DATA_NASCITA_GENITORE"
              name="DATA_NASCITA_GENITORE"
              type="date"
              value={formData.DATA_NASCITA_GENITORE}
              onChange={handleChange}
              autoComplete="bday"
              className={`h-9 ${errors.DATA_NASCITA_GENITORE ? 'border-red-500' : ''}`}
            />
            {errors.DATA_NASCITA_GENITORE && (
              <p className="text-xs text-red-600">{errors.DATA_NASCITA_GENITORE}</p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <Label htmlFor="LUOGO_NASCITA_GENITORE" className="text-sm">Luogo di nascita *</Label>
            <Input
              id="LUOGO_NASCITA_GENITORE"
              name="LUOGO_NASCITA_GENITORE"
              value={formData.LUOGO_NASCITA_GENITORE}
              onChange={handleChange}
              className={`h-9 ${errors.LUOGO_NASCITA_GENITORE ? 'border-red-500' : ''}`}
            />
            {errors.LUOGO_NASCITA_GENITORE && (
              <p className="text-xs text-red-600">{errors.LUOGO_NASCITA_GENITORE}</p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          <Label htmlFor="CODICE_FISCALE_GENITORE" className="text-sm">Codice fiscale *</Label>
          <Input
            id="CODICE_FISCALE_GENITORE"
            name="CODICE_FISCALE_GENITORE"
            value={formData.CODICE_FISCALE_GENITORE}
            onChange={handleCodiceFiscaleChange}
            maxLength={16}
            placeholder="RSSMRA80A01H501U"
            className={`h-9 ${errors.CODICE_FISCALE_GENITORE ? 'border-red-500' : ''}`}
          />
          {errors.CODICE_FISCALE_GENITORE && (
            <p className="text-xs text-red-600">{errors.CODICE_FISCALE_GENITORE}</p>
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
            <Label htmlFor="VIA_RESIDENZA_GENITORE" className="text-sm">Indirizzo *</Label>
            <Input
              id="VIA_RESIDENZA_GENITORE"
              name="VIA_RESIDENZA_GENITORE"
              value={formData.VIA_RESIDENZA_GENITORE}
              onChange={handleChange}
              placeholder="Via Roma, 123"
              autoComplete="street-address"
              className={`h-9 ${errors.VIA_RESIDENZA_GENITORE ? 'border-red-500' : ''}`}
            />
            {errors.VIA_RESIDENZA_GENITORE && (
              <p className="text-xs text-red-600">{errors.VIA_RESIDENZA_GENITORE}</p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <Label htmlFor="CITTA_RESIDENZA_GENITORE" className="text-sm">Città *</Label>
            <Input
              id="CITTA_RESIDENZA_GENITORE"
              name="CITTA_RESIDENZA_GENITORE"
              value={formData.CITTA_RESIDENZA_GENITORE}
              onChange={handleChange}
              autoComplete="address-level2"
              className={`h-9 ${errors.CITTA_RESIDENZA_GENITORE ? 'border-red-500' : ''}`}
            />
            {errors.CITTA_RESIDENZA_GENITORE && (
              <p className="text-xs text-red-600">{errors.CITTA_RESIDENZA_GENITORE}</p>
            )}
          </div>
        </div>
      </div>

      {/* Separatore */}
      <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

      {/* SEZIONE: Contatti */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </div>
          <h4 className="font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontSize: '1.6rem', margin: 0 }}>
            Contatti
          </h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <Label htmlFor="EMAIL_GENITORE" className="text-sm">Email *</Label>
            <Input
              id="EMAIL_GENITORE"
              name="EMAIL_GENITORE"
              type="email"
              value={formData.EMAIL_GENITORE}
              onChange={handleChange}
              autoComplete="email"
              className={`h-9 ${errors.EMAIL_GENITORE ? 'border-red-500' : ''}`}
            />
            {errors.EMAIL_GENITORE && (
              <p className="text-xs text-red-600">{errors.EMAIL_GENITORE}</p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <Label htmlFor="CELLULARE_GENITORE" className="text-sm">Cellulare *</Label>
            <Input
              id="CELLULARE_GENITORE"
              name="CELLULARE_GENITORE"
              type="tel"
              value={formData.CELLULARE_GENITORE}
              onChange={handleChange}
              placeholder="+39 123 456 7890"
              autoComplete="tel"
              className={`h-9 ${errors.CELLULARE_GENITORE ? 'border-red-500' : ''}`}
            />
            {errors.CELLULARE_GENITORE && (
              <p className="text-xs text-red-600">{errors.CELLULARE_GENITORE}</p>
            )}
          </div>
        </div>
      </div>

      {/* Separatore */}
      <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

      {/* BOX GDPR DEDICATO */}
      <div>
        <div className="card-rounded bg-accent/50" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <Checkbox
            id="FLAG_PRIVACY"
            checked={formData.FLAG_PRIVACY}
            onCheckedChange={handlePrivacyChange}
            className={`mt-0.5 h-5 w-5 flex-shrink-0 ${errors.FLAG_PRIVACY ? 'border-red-500' : ''}`}
          />
          <div className="flex-1">
            <label
              htmlFor="FLAG_PRIVACY"
              className="text-sm font-medium cursor-pointer block"
              style={{ lineHeight: '1.5' }}
            >
              Acconsento al trattamento dei dati personali secondo quanto previsto dal Regolamento Europeo GDPR 679/2016 *
            </label>
            {errors.FLAG_PRIVACY && (
              <p className="text-xs text-red-600" style={{ marginTop: '0.5rem' }}>
                {errors.FLAG_PRIVACY}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Separatore */}
      <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

      {/* CTA */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <ButtonPrimary type="submit" disabled={isSubmitting} className="h-10 shrink-0">
          {isSubmitting ? 'Salvataggio in corso...' : 'Salva modifiche'}
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
