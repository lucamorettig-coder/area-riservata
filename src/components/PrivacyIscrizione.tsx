import { useState } from 'react';
import { baseUrl } from '../lib/base-url';
import type { Iscrizione } from '../lib/airtable';
import { ButtonPrimary } from './ButtonPrimary';

interface PrivacyIscrizioneProps {
  iscrizione: Iscrizione;
  onUpdate: () => void;
}

export default function PrivacyIscrizione({ iscrizione, onUpdate }: PrivacyIscrizioneProps) {
  const [privacyAccettata, setPrivacyAccettata] = useState(
    iscrizione.fields.PRIVACY_DATI_PERSONALI || false
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isCompleted = iscrizione.fields.PRIVACY_DATI_PERSONALI === true;
  const hasChanges = privacyAccettata !== iscrizione.fields.PRIVACY_DATI_PERSONALI;

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const response = await fetch(`${baseUrl}/api/iscrizioni/${iscrizione.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          PRIVACY_DATI_PERSONALI: privacyAccettata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || 'Errore nel salvataggio');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onUpdate();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Errore nel salvataggio');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div 
      className="bg-slate-100 rounded-3xl border border-slate-200 p-6 sm:p-8"
      style={{ boxShadow: '0 2px 5px 0 rgba(0,0,0,0.2)' }}
    >
      {/* Header Sezione */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h4 className="text-xl font-bold text-slate-700 uppercase tracking-wide truncate">
            Privacy
          </h4>
        </div>
        
        {/* Badge Stato */}
        {isCompleted ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 border border-green-300 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-700">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span className="text-xs font-semibold text-green-700 whitespace-nowrap">Confermata</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-700">
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span className="text-xs font-semibold text-amber-700 whitespace-nowrap">Da confermare</span>
          </div>
        )}
      </div>

      {/* Descrizione */}
      <p className="text-sm text-slate-600 mb-6">
        Per completare l'iscrizione alla Federazione Ciclistica Italiana (FCI) è necessario fornire il consenso 
        al trattamento dei dati personali del minore secondo il Regolamento UE 2016/679 (GDPR).
      </p>

      {/* Checkbox Privacy */}
      <label className="flex items-start gap-3 cursor-pointer mb-6 p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-900 transition-colors">
        <input
          type="checkbox"
          checked={privacyAccettata}
          onChange={(e) => setPrivacyAccettata(e.target.checked)}
          className="mt-1 w-5 h-5 accent-blue-900 cursor-pointer"
          disabled={saving}
        />
        <span className="text-sm text-slate-700 flex-1">
          Acconsento al trattamento dei dati personali del minore per l'iscrizione presso la FCI 
          secondo quanto previsto dal GDPR
          <span className="text-red-600 ml-1">*</span>
        </span>
      </label>

      {/* Messaggi di stato */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
          <p className="text-sm text-green-700">✓ Privacy salvata con successo!</p>
        </div>
      )}

      {/* Pulsante Salva */}
      {hasChanges && (
        <div className="flex justify-end">
          <ButtonPrimary
            type="button"
            onClick={handleSave}
            disabled={saving || !privacyAccettata}
            className="btn-standard"
          >
            {saving ? 'Salvataggio...' : 'Salva Privacy'}
          </ButtonPrimary>
        </div>
      )}
    </div>
  );
}
