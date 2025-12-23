import { useState, useEffect } from 'react';
import { baseUrl } from '../lib/base-url';

interface Iscrizione {
  id: string;
  fields: {
    TABELLA_GENITORI: string[];
    TABELLA_BAMBINI: string[];
    TABELLA_TARIFFE: string[];
    DATA_ISCRIZIONE?: string;
    STATO_ISCRIZIONE?: string;
    ANNO_ISCRIZIONE?: string;
    'NOME BAMBINO'?: string[];
    'COGNOME BAMBINO'?: string[];
  };
}

interface IscrizioniResponse {
  iscrizioni: Iscrizione[];
}

interface ErrorResponse {
  error?: string;
}

interface ListaIscrizioniProps {
  onSelectIscrizione?: (id: string) => void;
  onNuovaIscrizione?: () => void;
}

export default function ListaIscrizioni({ onSelectIscrizione, onNuovaIscrizione }: ListaIscrizioniProps) {
  const [iscrizioni, setIscrizioni] = useState<Iscrizione[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchIscrizioni();
  }, []);

  const fetchIscrizioni = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/iscrizioni`);
      const data = (await response.json()) as IscrizioniResponse | ErrorResponse;

      if (!response.ok) {
        throw new Error((data as ErrorResponse).error || 'Errore nel caricamento iscrizioni');
      }

      setIscrizioni((data as IscrizioniResponse).iscrizioni);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/D';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getBadgeColor = (stato?: string) => {
    if (!stato) return 'var(--muted)';
    
    switch (stato.toLowerCase()) {
      case 'completa':
        return 'var(--_redesign---palette-brand--verde)';
      case 'incompleta':
        return 'var(--_redesign---palette-brand--arancio)';
      case 'in attesa':
        return 'var(--_redesign---palette-brand--arancio)';
      default:
        return 'var(--primary)';
    }
  };

  const getBadgeTextColor = (stato?: string) => {
    if (!stato) return 'var(--foreground)';
    return 'white';
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Caricamento...</p>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm" style={{ padding: '0.75rem 1rem' }}>
        {error}
      </div>
    );
  }

  if (iscrizioni.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', padding: '2rem 1rem', textAlign: 'center' }}>
        <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
        </div>
        <div>
          <p className="font-medium text-foreground" style={{ marginBottom: '0.5rem' }}>
            Nessuna iscrizione trovata
          </p>
          <p className="text-sm text-muted-foreground">
            Clicca sul pulsante "Nuova" per creare un'iscrizione
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
      {iscrizioni.map((iscrizione) => {
        const nomeBambino = iscrizione.fields['NOME BAMBINO']?.[0] || 'N/D';
        const cognomeBambino = iscrizione.fields['COGNOME BAMBINO']?.[0] || '';
        const anno = iscrizione.fields.ANNO_ISCRIZIONE || 'N/D';
        const stato = iscrizione.fields.STATO_ISCRIZIONE;

        return (
          <button
            key={iscrizione.id}
            onClick={() => onSelectIscrizione?.(iscrizione.id)}
            className="card-rounded border hover:border-primary transition-colors text-left"
            style={{ 
              padding: '1rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.75rem', 
              cursor: 'pointer',
              backgroundColor: 'var(--_redesign---neutral--neutral-100)',
              borderColor: 'var(--border)',
              boxShadow: '0 2px 5px 0 rgba(0,0,0,0.2)',
              width: '100%'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ 
                width: '2.5rem', 
                height: '2.5rem', 
                borderRadius: '50%', 
                backgroundColor: 'var(--primary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flexShrink: 0 
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="font-semibold" style={{ marginBottom: '0.125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {nomeBambino} {cognomeBambino}
                </p>
                <p className="text-xs text-muted-foreground">
                  Anno {anno}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
              {/* Data iscrizione */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="text-xs text-muted-foreground" style={{ minWidth: '100px' }}>Data iscrizione:</span>
                <span className="text-sm" style={{ flex: 1 }}>
                  {formatDate(iscrizione.fields.DATA_ISCRIZIONE)}
                </span>
              </div>

              {/* Stato */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="text-xs text-muted-foreground" style={{ minWidth: '100px' }}>Stato:</span>
                <span
                  style={{
                    backgroundColor: getBadgeColor(stato),
                    color: getBadgeTextColor(stato),
                    padding: '0.125rem 0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    flex: 1
                  }}
                >
                  {stato || 'N/D'}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
