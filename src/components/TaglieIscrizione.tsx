import { useState } from 'react';
import { baseUrl } from '../lib/base-url';
import type { Iscrizione } from '../lib/airtable';
import { ButtonPrimary } from './ButtonPrimary';

interface TaglieIscrizioneProps {
  iscrizione: Iscrizione;
  onUpdate: () => void;
}

const TAGLIE_MAGLIA_PANTALONCINO = ['5XS', '4XS', '3XS', '2XS', 'XS'];
const TAGLIE_TUTA = ['110/120', '130/140'];

export default function TaglieIscrizione({ iscrizione, onUpdate }: TaglieIscrizioneProps) {
  const [tagliaMaglia, setTagliaMaglia] = useState(iscrizione.fields.TAGLIA_MAGLIA || '');
  const [tagliaPantaloncino, setTagliaPantaloncino] = useState(iscrizione.fields.TAGLIA_PANTALONCINO || '');
  const [tagliaTuta, setTagliaTuta] = useState(iscrizione.fields.TAGLIA_TUTA || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const hasAnyTaglia = !!(iscrizione.fields.TAGLIA_MAGLIA || iscrizione.fields.TAGLIA_PANTALONCINO || iscrizione.fields.TAGLIA_TUTA);
  const hasChanges = 
    tagliaMaglia !== (iscrizione.fields.TAGLIA_MAGLIA || '') ||
    tagliaPantaloncino !== (iscrizione.fields.TAGLIA_PANTALONCINO || '') ||
    tagliaTuta !== (iscrizione.fields.TAGLIA_TUTA || '');

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
          TAGLIA_MAGLIA: tagliaMaglia || undefined,
          TAGLIA_PANTALONCINO: tagliaPantaloncino || undefined,
          TAGLIA_TUTA: tagliaTuta || undefined,
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
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
          </div>
          <h4 className="text-xl font-bold text-slate-700 uppercase tracking-wide truncate">
            Taglie Kit Scuola
          </h4>
        </div>
        
        {/* Badge Stato */}
        {hasAnyTaglia ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 border border-green-300 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-700">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span className="text-xs font-semibold text-green-700 whitespace-nowrap">Inserite</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 border border-blue-300 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span className="text-xs font-semibold text-blue-700 whitespace-nowrap">Opzionale</span>
          </div>
        )}
      </div>

      {/* Descrizione */}
      <p className="text-sm text-slate-600 mb-6">
        Indica le taglie per il kit scuola. Questa informazione è opzionale ma ci aiuterà 
        a preparare il materiale della taglia corretta per il tuo bambino.
      </p>

      {/* Form Taglie */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        {/* Taglia Maglia */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Taglia Maglia
          </label>
          <select
            value={tagliaMaglia}
            onChange={(e) => setTagliaMaglia(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-colors"
            disabled={saving}
          >
            <option value="">Seleziona...</option>
            {TAGLIE_MAGLIA_PANTALONCINO.map((taglia) => (
              <option key={taglia} value={taglia}>
                {taglia}
              </option>
            ))}
          </select>
        </div>

        {/* Taglia Pantaloncino */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Taglia Pantaloncino
          </label>
          <select
            value={tagliaPantaloncino}
            onChange={(e) => setTagliaPantaloncino(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-colors"
            disabled={saving}
          >
            <option value="">Seleziona...</option>
            {TAGLIE_MAGLIA_PANTALONCINO.map((taglia) => (
              <option key={taglia} value={taglia}>
                {taglia}
              </option>
            ))}
          </select>
        </div>

        {/* Taglia Tuta */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Taglia Tuta
          </label>
          <select
            value={tagliaTuta}
            onChange={(e) => setTagliaTuta(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 transition-colors"
            disabled={saving}
          >
            <option value="">Seleziona...</option>
            {TAGLIE_TUTA.map((taglia) => (
              <option key={taglia} value={taglia}>
                {taglia}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messaggi di stato */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
          <p className="text-sm text-green-700">✓ Taglie salvate con successo!</p>
        </div>
      )}

      {/* Pulsante Salva */}
      {hasChanges && (
        <div className="flex justify-end">
          <ButtonPrimary
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-standard"
          >
            {saving ? 'Salvataggio...' : 'Salva Taglie'}
          </ButtonPrimary>
        </div>
      )}
    </div>
  );
}
