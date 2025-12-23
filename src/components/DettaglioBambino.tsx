import React from 'react';

interface DettaglioBambinoProps {
  bambino: {
    NOME_BAMBINO: string;
    COGNOME_BAMBINO: string;
    DATA_NASCITA_BAMBINO: string;
    LUOGO_NASCITA_BAMBINO: string;
    CODICE_FISCALE_BAMBINO: string;
    VIA_RESIDENZA_BAMBINO: string;
    CITTA_RESIDENZA_BAMBINO: string;
    FOTO_BAMBINO?: Array<{ url: string }>;
  };
  certificatoStato?: string;
  bambinoId: string;
  showActions?: boolean;
}

export default function DettaglioBambino({ bambino }: DettaglioBambinoProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* SEZIONE: Dati anagrafici */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="5"></circle>
              <path d="M20 21a8 8 0 1 0-16 0"></path>
            </svg>
          </div>
          <h4 className="font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontSize: '1.6rem', margin: 0 }}>
            Dati Anagrafici
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Nome</p>
            <p className="text-base" style={{ margin: 0 }}>{bambino.NOME_BAMBINO}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Cognome</p>
            <p className="text-base" style={{ margin: 0 }}>{bambino.COGNOME_BAMBINO}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Data di nascita</p>
            <p className="text-base" style={{ margin: 0 }}>{formatDate(bambino.DATA_NASCITA_BAMBINO)}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Luogo di nascita</p>
            <p className="text-base" style={{ margin: 0 }}>{bambino.LUOGO_NASCITA_BAMBINO}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Codice fiscale</p>
          <p className="text-base font-mono" style={{ margin: 0 }}>{bambino.CODICE_FISCALE_BAMBINO}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Indirizzo</p>
          <p className="text-base" style={{ margin: 0 }}>{bambino.VIA_RESIDENZA_BAMBINO}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Città</p>
          <p className="text-base" style={{ margin: 0 }}>{bambino.CITTA_RESIDENZA_BAMBINO}</p>
        </div>
      </div>
    </div>
  );
}
