import { useState, useEffect } from 'react';
import { baseUrl } from '../lib/base-url';
import ActionButton from './ActionButton';

// Componente helper per l'Icona di Sezione
const SectionIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white shrink-0">
    {children}
  </div>
);

// Componente helper per i Campi Input
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const InputField = ({ label, error, className = "", ...props }: InputFieldProps) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
      {label}
    </label>
    <input
      className={`h-11 rounded-xl border bg-white px-4 text-slate-800 outline-none transition-all focus:border-blue-900 focus:ring-2 focus:ring-blue-100 ${
        error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200'
      } ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
  </div>
);

interface BambinoData {
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
}

interface ModificaBambinoFormProps {
  bambino: BambinoData;
  bambinoId: string;
}

export default function ModificaBambinoForm({ bambino, bambinoId }: ModificaBambinoFormProps) {
  const [formData, setFormData] = useState<BambinoData>(bambino);
  const [originalData, setOriginalData] = useState<BambinoData>(bambino);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    setOriginalData(bambino);
    setFormData(bambino);
  }, [bambino]);

  // Controlla se il form ha modifiche
  const hasUnsavedChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

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

  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      setShowCancelDialog(true);
    } else {
      window.location.href = `${baseUrl}/bambini/${bambinoId}`;
    }
  };

  const handleConfirmCancel = () => {
    window.location.href = `${baseUrl}/bambini/${bambinoId}`;
  };

  const handleLogout = async () => {
    try {
      await fetch(`${baseUrl}/api/logout`, { method: 'POST' });
      window.location.href = `${baseUrl}/login`;
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setErrors({});
    setSubmitSuccess(false);

    try {
      const response = await fetch(`${baseUrl}/api/bambini/${bambinoId}`, {
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
        setTimeout(() => {
          window.location.href = `${baseUrl}/bambini/${bambinoId}`;
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
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto p-4 sm:p-6 flex items-center justify-center min-h-[400px]">
          <div className="bg-white rounded-2xl p-8 text-center" style={{ boxShadow: '0 2px 5px 0 rgba(0,0,0,0.2)' }}>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">Dati aggiornati!</h3>
            <p className="text-slate-600">I dati del bambino sono stati salvati con successo.<br/>Verrai reindirizzato alla scheda...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 flex flex-col gap-8">
        
        {/* --- HEADER PAGINA CON ACTION BUTTONS --- */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Modifica Bambino</h1>
            <p className="text-slate-500 text-sm mt-1">Aggiorna i dati del profilo.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <ActionButton type="cancel" onClick={handleCancel} />
            <ActionButton type="logout" onClick={handleLogout} />
          </div>
        </div>

        {/* Messaggio errore generale */}
        {submitError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 text-sm font-medium">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          
          {/* --- SEZIONE 1: DATI ANAGRAFICI --- */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <SectionIcon>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </SectionIcon>
              <h4 className="text-xl font-bold text-slate-700 uppercase tracking-wide">Dati Anagrafici</h4>
            </div>

            <div className="bg-slate-100 rounded-3xl border border-slate-200 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Nome *" 
                name="NOME_BAMBINO" 
                placeholder="Es. Mario" 
                value={formData.NOME_BAMBINO} 
                onChange={handleChange}
                error={errors.NOME_BAMBINO}
                autoComplete="given-name"
                required 
              />
              <InputField 
                label="Cognome *" 
                name="COGNOME_BAMBINO" 
                placeholder="Es. Rossi" 
                value={formData.COGNOME_BAMBINO} 
                onChange={handleChange}
                error={errors.COGNOME_BAMBINO}
                autoComplete="family-name"
                required 
              />
              <InputField 
                label="Data di Nascita *" 
                name="DATA_NASCITA_BAMBINO" 
                type="date" 
                value={formData.DATA_NASCITA_BAMBINO} 
                onChange={handleChange}
                error={errors.DATA_NASCITA_BAMBINO}
                autoComplete="bday"
                required 
              />
              <InputField 
                label="Luogo di Nascita *" 
                name="LUOGO_NASCITA_BAMBINO" 
                placeholder="Es. Roma" 
                value={formData.LUOGO_NASCITA_BAMBINO} 
                onChange={handleChange}
                error={errors.LUOGO_NASCITA_BAMBINO}
                required 
              />
              <div className="md:col-span-2">
                <InputField 
                  label="Codice Fiscale *" 
                  name="CODICE_FISCALE_BAMBINO" 
                  placeholder="RSSMRA80A01H501U" 
                  maxLength={16}
                  value={formData.CODICE_FISCALE_BAMBINO} 
                  onChange={handleCodiceFiscaleChange}
                  error={errors.CODICE_FISCALE_BAMBINO}
                  className="uppercase font-mono tracking-wider"
                  required 
                />
              </div>
            </div>
          </section>

          {/* --- SEZIONE 2: RESIDENZA --- */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <SectionIcon>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </SectionIcon>
              <h4 className="text-xl font-bold text-slate-700 uppercase tracking-wide">Residenza</h4>
            </div>

            <div className="bg-slate-100 rounded-3xl border border-slate-200 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <InputField 
                  label="Indirizzo *" 
                  name="VIA_RESIDENZA_BAMBINO" 
                  placeholder="Via Roma, 123" 
                  value={formData.VIA_RESIDENZA_BAMBINO} 
                  onChange={handleChange}
                  error={errors.VIA_RESIDENZA_BAMBINO}
                  autoComplete="street-address"
                  required 
                />
              </div>
              <InputField 
                label="Città *" 
                name="CITTA_RESIDENZA_BAMBINO" 
                placeholder="Es. Milano" 
                value={formData.CITTA_RESIDENZA_BAMBINO} 
                onChange={handleChange}
                error={errors.CITTA_RESIDENZA_BAMBINO}
                autoComplete="address-level2"
                required 
              />
            </div>
          </section>

          {/* --- PULSANTE SALVA --- */}
          <div className="flex justify-end pt-6 border-t border-slate-100 mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-full px-8 text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isSubmitting ? 'Salvataggio...' : 'Salva modifiche'}
            </button>
          </div>
        </form>
      </div>

      {/* Dialog di conferma annullamento */}
      {showCancelDialog && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowCancelDialog(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 max-w-md mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-slate-900 mb-3">Modifiche non salvate</h3>
            <p className="text-sm text-slate-600 mb-6">
              Hai apportato delle modifiche. Vuoi uscire senza salvare?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="h-10 rounded-full px-6 text-sm font-semibold transition-colors flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
              >
                Resta
              </button>
              <button
                onClick={handleConfirmCancel}
                className="h-10 rounded-full px-6 text-sm font-semibold transition-colors flex items-center justify-center gap-2 bg-blue-900 text-white hover:bg-blue-800"
              >
                Esci senza salvare
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
