import { ButtonSecondary } from './ButtonSecondary';
import ListaBambini from './ListaBambini';
import ListaIscrizioni from './ListaIscrizioni';
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
}

interface DashboardGenitoreProps {
  genitore: GenitoreData;
}

export default function DashboardGenitore({ genitore }: DashboardGenitoreProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleLogout = async () => {
    try {
      await fetch(`${baseUrl}/api/logout`, { method: 'POST' });
      window.location.href = `${baseUrl}/login`;
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  return (
    <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header con titolo e logout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h3 className="text-xl sm:text-2xl font-bold font-heading" style={{ wordBreak: 'break-word' }}>
            Area Personale
          </h3>
          <p className="text-sm text-muted-foreground">
            Benvenuto/a, {genitore.NOME_GENITORE} {genitore.COGNOME_GENITORE}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="pulsante1 is-secondary btn-standard inline-flex items-center justify-center"
          style={{ 
            width: '2.5rem',
            height: '2.5rem',
            padding: 0,
            minWidth: 'unset'
          }}
          title="Esci"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>

      {/* Separatore */}
      <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

      {/* SEZIONE: I tuoi bambini */}
      <ListaBambini />

      {/* Separatore */}
      <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

      {/* SEZIONE: Dati anagrafici - desktop con pulsante in linea */}
      <div className="hidden sm:flex" style={{ flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h4 className="font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontSize: '1.6rem', margin: 0 }}>
              I tuoi dati
            </h4>
          </div>
          <a
            href={`${baseUrl}/modifica-profilo`}
            className="pulsante1 btn-standard inline-flex items-center justify-center gap-2 shrink-0"
            style={{ 
              textDecoration: 'none', 
              paddingLeft: '1.5rem', 
              paddingRight: '1.5rem',
              minWidth: '120px'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
            </svg>
            Modifica
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Nome</p>
            <p className="text-base" style={{ margin: 0 }}>{genitore.NOME_GENITORE}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Cognome</p>
            <p className="text-base" style={{ margin: 0 }}>{genitore.COGNOME_GENITORE}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Data di nascita</p>
            <p className="text-base" style={{ margin: 0 }}>{formatDate(genitore.DATA_NASCITA_GENITORE)}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Luogo di nascita</p>
            <p className="text-base" style={{ margin: 0 }}>{genitore.LUOGO_NASCITA_GENITORE}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Codice fiscale</p>
          <p className="text-base font-mono" style={{ margin: 0 }}>{genitore.CODICE_FISCALE_GENITORE}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Indirizzo</p>
          <p className="text-base" style={{ margin: 0 }}>{genitore.VIA_RESIDENZA_GENITORE}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Città</p>
          <p className="text-base" style={{ margin: 0 }}>{genitore.CITTA_RESIDENZA_GENITORE}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Email</p>
            <p className="text-base" style={{ margin: 0, wordBreak: 'break-word' }}>{genitore.EMAIL_GENITORE}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Cellulare</p>
            <p className="text-base" style={{ margin: 0 }}>{genitore.CELLULARE_GENITORE}</p>
          </div>
        </div>
      </div>

      {/* SEZIONE: Dati anagrafici - mobile con pulsante in linea */}
      <div className="flex sm:hidden" style={{ flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h4 className="font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontSize: '1.6rem', margin: 0 }}>
              I tuoi dati
            </h4>
          </div>
          <a
            href={`${baseUrl}/modifica-profilo`}
            className="pulsante1 btn-standard inline-flex items-center justify-center"
            style={{ 
              textDecoration: 'none',
              width: '2.5rem',
              height: '2.5rem',
              padding: 0,
              minWidth: 'unset'
            }}
            title="Modifica profilo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
            </svg>
          </a>
        </div>
        
        <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Nome</p>
            <p className="text-base" style={{ margin: 0 }}>{genitore.NOME_GENITORE}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Cognome</p>
            <p className="text-base" style={{ margin: 0 }}>{genitore.COGNOME_GENITORE}</p>
          </div>
        </div>

        <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Data di nascita</p>
            <p className="text-base" style={{ margin: 0 }}>{formatDate(genitore.DATA_NASCITA_GENITORE)}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Luogo di nascita</p>
            <p className="text-base" style={{ margin: 0 }}>{genitore.LUOGO_NASCITA_GENITORE}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Codice fiscale</p>
          <p className="text-base font-mono" style={{ margin: 0 }}>{genitore.CODICE_FISCALE_GENITORE}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Indirizzo</p>
          <p className="text-base" style={{ margin: 0 }}>{genitore.VIA_RESIDENZA_GENITORE}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Città</p>
          <p className="text-base" style={{ margin: 0 }}>{genitore.CITTA_RESIDENZA_GENITORE}</p>
        </div>

        <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Email</p>
            <p className="text-base" style={{ margin: 0, wordBreak: 'break-word' }}>{genitore.EMAIL_GENITORE}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Cellulare</p>
            <p className="text-base" style={{ margin: 0 }}>{genitore.CELLULARE_GENITORE}</p>
          </div>
        </div>
      </div>

      {/* Separatore */}
      <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

      {/* SEZIONE: Iscrizioni */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Desktop: Header con pulsante in linea */}
        <div className="hidden sm:flex" style={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
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
          <a
            href={`${baseUrl}/iscrizioni/nuova`}
            className="pulsante1 btn-standard inline-flex items-center justify-center gap-2 shrink-0"
            style={{ 
              textDecoration: 'none', 
              paddingLeft: '1.5rem', 
              paddingRight: '1.5rem',
              minWidth: '120px'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="M12 5v14"/>
            </svg>
            Nuova
          </a>
        </div>

        {/* Mobile: Header senza pulsante */}
        <div className="flex sm:hidden" style={{ alignItems: 'center', gap: '0.75rem' }}>
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
        
        <ListaIscrizioni 
          onSelectIscrizione={(id: string) => window.location.href = `${baseUrl}/iscrizioni/${id}`}
          onNuovaIscrizione={() => window.location.href = `${baseUrl}/iscrizioni/nuova`}
        />

        {/* Mobile: Pulsante Nuova in basso dopo la lista */}
        <div className="flex sm:hidden" style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>
        <div className="flex sm:hidden" style={{ justifyContent: 'center' }}>
          <a
            href={`${baseUrl}/iscrizioni/nuova`}
            className="pulsante1 btn-standard inline-flex items-center justify-center"
            style={{ 
              textDecoration: 'none',
              width: '2.5rem',
              height: '2.5rem',
              padding: 0,
              minWidth: 'unset'
            }}
            title="Nuova iscrizione"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="M12 5v14"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
