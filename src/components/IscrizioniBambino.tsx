import { useState } from 'react';
import { baseUrl } from '../lib/base-url';
import ListaIscrizioni from './ListaIscrizioni';

interface IscrizioniBambinoProps {
  bambinoId: string;
}

export default function IscrizioniBambino({ bambinoId }: IscrizioniBambinoProps) {
  const [showList, setShowList] = useState(false);

  const handleSelectIscrizione = (iscrizioneId: string) => {
    window.location.href = `${baseUrl}/iscrizioni/${iscrizioneId}`;
  };

  const handleNuovaIscrizione = () => {
    window.location.href = `${baseUrl}/iscrizioni/nuova?bambinoId=${bambinoId}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <h4 className="font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontSize: '1.6rem', margin: 0 }}>
            Iscrizioni
          </h4>
        </div>
        
        {/* Toggle button */}
        <button
          onClick={() => setShowList(!showList)}
          className="pulsante1 is-secondary btn-standard inline-flex items-center justify-center gap-2"
          style={{ 
            paddingLeft: '1rem',
            paddingRight: '1rem'
          }}
        >
          {showList ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
              Nascondi
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              Mostra
            </>
          )}
        </button>
      </div>

      {/* Lista iscrizioni (collapsible) */}
      {showList && (
        <div className="mt-2">
          <ListaIscrizioni 
            bambinoId={bambinoId}
            onSelectIscrizione={handleSelectIscrizione}
            onNuovaIscrizione={handleNuovaIscrizione}
          />
        </div>
      )}
    </div>
  );
}
