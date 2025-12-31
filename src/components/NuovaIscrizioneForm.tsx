import { useState, useEffect } from 'react';
import { baseUrl } from '../lib/base-url';
import type { Bambino, Tariffa } from '../lib/airtable';

interface NuovaIscrizioneFormProps {
  preSelectedBambinoId?: string;
}

export default function NuovaIscrizioneForm({ preSelectedBambinoId }: NuovaIscrizioneFormProps) {
  const [bambini, setBambini] = useState<Bambino[]>([]);
  const [tariffa, setTariffa] = useState<Tariffa | null>(null);
  const [selectedBambinoId, setSelectedBambinoId] = useState(preSelectedBambinoId || '');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch bambini
      const bambiniRes = await fetch(`${baseUrl}/api/bambini`, {
        credentials: 'include',
      });

      if (!bambiniRes.ok) {
        throw new Error('Errore nel caricamento dei bambini');
      }

      const bambiniData = await bambiniRes.json();
      setBambini(bambiniData.bambini || []);

      // Fetch tariffa attiva per anno corrente
      const anno = new Date().getFullYear().toString();
      const tariffaRes = await fetch(`${baseUrl}/api/tariffe/attiva?anno=${anno}`, {
        credentials: 'include',
      });

      if (!tariffaRes.ok) {
        throw new Error('Nessuna tariffa attiva disponibile per l\'anno corrente');
      }

      const tariffaData = await tariffaRes.json();
      setTariffa(tariffaData.tariffa);

    } catch (err: any) {
      setError(err.message || 'Errore nel caricamento');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBambinoId) {
      setError('Seleziona un bambino');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // REGOLA BUSINESS: L'anno e la tariffa sono automatici, non selezionabili
      const response = await fetch(`${baseUrl}/api/iscrizioni`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          bambinoId: selectedBambinoId,
          // tariffaId non è più necessario, viene gestito automaticamente
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Errore nella creazione dell\'iscrizione');
      }

      const data = await response.json();
      setSuccess(true);
      
      // Redirect al dettaglio iscrizione dopo 1 secondo
      setTimeout(() => {
        window.location.href = `${baseUrl}/iscrizioni/${data.iscrizione.id}`;
      }, 1000);

    } catch (err: any) {
      setError(err.message || 'Errore nella creazione dell\'iscrizione');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return '-';
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !tariffa) {
    return (
      <div className="space-y-4">
        <div style={{ padding: '1rem 1.5rem', border: '1px solid var(--destructive)', backgroundColor: 'var(--destructive)', color: 'white' }}>
          <p className="text-sm">{error}</p>
        </div>
        <a href={`${baseUrl}/dashboard`} className="pulsante1 is-secondary btn-standard">
          Torna alla Dashboard
        </a>
      </div>
    );
  }

  if (bambini.length === 0) {
    return (
      <div className="space-y-4">
        <div style={{ padding: '1rem 1.5rem', border: '1px solid var(--border)', backgroundColor: 'var(--muted)' }}>
          <p className="text-sm">Non hai bambini registrati. Aggiungi prima un bambino per procedere con l'iscrizione.</p>
        </div>
        <div className="flex gap-4">
          <a href={`${baseUrl}/bambini/aggiungi`} className="pulsante1 btn-standard">
            Aggiungi Bambino
          </a>
          <a href={`${baseUrl}/dashboard`} className="pulsante1 is-secondary btn-standard">
            Torna alla Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ padding: '1rem 1.5rem', border: '1px solid var(--primary)', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
        <p className="text-sm">✓ Iscrizione creata con successo! Reindirizzamento...</p>
      </div>
    );
  }

  const tariffaFields = tariffa?.fields;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header - SENZA back button perché c'è Annulla in basso */}
      <div>
        <h2 className="text-2xl font-heading font-bold">
          Nuova Iscrizione
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Crea una nuova iscrizione per l'anno corrente
        </p>
      </div>

      {/* Errore globale */}
      {error && (
        <div style={{ padding: '1rem 1.5rem', border: '1px solid var(--destructive)', backgroundColor: 'var(--destructive)', color: 'white' }}>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Selezione Bambino */}
      <div className="card-rounded border bg-card shadow-sm" style={{ padding: '1.5rem 2rem', boxShadow: '0 2px 5px 0 rgba(0,0,0,0.2)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h3 className="text-lg font-heading font-semibold text-muted-foreground uppercase tracking-wider">
            Seleziona Bambino
          </h3>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-muted-foreground mb-2 block">
            Bambino da iscrivere <span className="text-destructive">*</span>
          </span>
          <select
            value={selectedBambinoId}
            onChange={(e) => setSelectedBambinoId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
          >
            <option value="">-- Seleziona --</option>
            {bambini.map((bambino) => (
              <option key={bambino.id} value={bambino.id}>
                {bambino.fields.NOME_BAMBINO} {bambino.fields.COGNOME_BAMBINO}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Tariffa - Visualizzazione informativa (non selezionabile) */}
      {tariffaFields && (
        <div className="card-rounded border bg-card shadow-sm" style={{ padding: '1.5rem 2rem', boxShadow: '0 2px 5px 0 rgba(0,0,0,0.2)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <h3 className="text-lg font-heading font-semibold text-muted-foreground uppercase tracking-wider">
              Tariffa Anno {tariffaFields.ANNO_ISCRIZIONE}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Voce</th>
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground">Importo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-2 px-3">Quota totale anno</td>
                  <td className="py-2 px-3 text-right font-medium">{formatCurrency(tariffaFields.QUOTA_TOTALE_ANNO)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3">Importo iscrizione</td>
                  <td className="py-2 px-3 text-right font-medium">{formatCurrency(tariffaFields.IMPORTO_ISCRIZIONE)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3">Numero rate</td>
                  <td className="py-2 px-3 text-right font-medium">{tariffaFields.NUMERO_RATE || '-'}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-3">Importo rata</td>
                  <td className="py-2 px-3 text-right font-medium">{formatCurrency(tariffaFields.IMPORTO_RATA)}</td>
                </tr>
                {tariffaFields.IMPORTO_KIT_SCUOLA && (
                  <tr className="border-b border-border">
                    <td className="py-2 px-3">Kit scuola</td>
                    <td className="py-2 px-3 text-right font-medium">{formatCurrency(tariffaFields.IMPORTO_KIT_SCUOLA)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {tariffaFields.SCADENZA_RATE && (
            <div className="mt-4 p-3 bg-muted/50 rounded">
              <p className="text-xs text-muted-foreground mb-1">Scadenza rate</p>
              <p className="text-sm">{tariffaFields.SCADENZA_RATE}</p>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="card-rounded bg-muted/50" style={{ padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: 'var(--muted-foreground)', opacity: 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <p className="text-sm font-medium text-muted-foreground" style={{ margin: 0 }}>
            Informazioni importanti
          </p>
        </div>
        <ul className="text-xs text-muted-foreground space-y-1" style={{ paddingLeft: '2.75rem', margin: 0 }}>
          <li>• L'iscrizione viene creata automaticamente per l'anno {new Date().getFullYear()}</li>
          <li>• Ogni bambino può avere una sola iscrizione attiva</li>
          <li>• Dopo la creazione potrai completare privacy, taglie e regolamento</li>
        </ul>
      </div>

      {/* Pulsanti */}
      <div className="flex justify-end gap-4 pt-4">
        <a
          href={`${baseUrl}/dashboard`}
          className="pulsante1 is-secondary btn-standard"
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          Annulla
        </a>
        <button
          type="submit"
          disabled={submitting || !selectedBambinoId}
          className="pulsante1 btn-standard"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              Creazione...
            </span>
          ) : (
            'Crea Iscrizione'
          )}
        </button>
      </div>
    </form>
  );
}
