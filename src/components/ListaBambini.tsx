import { useState, useEffect } from 'react';
import { baseUrl } from '../lib/base-url';

interface Bambino {
  id: string;
  fields: {
    NOME_BAMBINO: string;
    COGNOME_BAMBINO: string;
    DATA_NASCITA_BAMBINO: string;
    LUOGO_NASCITA_BAMBINO: string;
    CODICE_FISCALE_BAMBINO: string;
    VIA_RESIDENZA_BAMBINO: string;
    CITTA_RESIDENZA_BAMBINO: string;
    CATEGORIA?: string;
    CERTIFICATO_MEDICO_STATO?: string;
    FOTO_BAMBINO?: Array<{ url: string }>;
  };
}

interface IscrizioneInfo {
  hasIscrizioneCompleta: boolean;
  statoIscrizione?: string;
}

interface BambiniResponse {
  bambini: Bambino[];
  iscrizioniMap?: Record<string, IscrizioneInfo>; // Map bambinoId -> iscrizione info
}

interface ErrorResponse {
  error?: string;
}

export default function ListaBambini() {
  const [bambini, setBambini] = useState<Bambino[]>([]);
  const [iscrizioniMap, setIscrizioniMap] = useState<Record<string, IscrizioneInfo>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBambini();
  }, []);

  const fetchBambini = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/bambini`);
      const data = (await response.json()) as BambiniResponse | ErrorResponse;

      if (!response.ok) {
        throw new Error((data as ErrorResponse).error || 'Errore nel caricamento bambini');
      }

      setBambini((data as BambiniResponse).bambini);
      setIscrizioniMap((data as BambiniResponse).iscrizioniMap || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Calcola colore badge categoria
  const getCategoriaColor = () => {
    return 'var(--primary)';
  };

  const getCategoriaTextColor = () => {
    return 'var(--primary-foreground)';
  };

  // Calcola colore badge in base allo stato del certificato
  const getBadgeColor = (stato?: string) => {
    if (!stato) return 'var(--muted)';
    
    switch (stato.toLowerCase()) {
      case 'valido':
        return 'var(--_redesign---palette-brand--verde)';
      case 'in scadenza':
        return 'var(--_redesign---palette-brand--arancio)';
      case 'scaduto':
        return 'var(--_redesign---palette-brand--rosso)';
      default:
        return 'var(--muted)';
    }
  };

  // Calcola colore del testo in base allo stato del certificato
  const getBadgeTextColor = (stato?: string) => {
    if (!stato) return 'var(--foreground)'; // testo scuro per sfondo chiaro
    
    switch (stato.toLowerCase()) {
      case 'valido':
      case 'in scadenza':
      case 'scaduto':
        return 'white';
      default:
        return 'var(--foreground)'; // testo scuro per sfondo chiaro
    }
  };

  // Colore badge iscrizione in base allo stato
  const getIscrizioneBadgeColor = (stato?: string) => {
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

  const getIscrizioneBadgeTextColor = (stato?: string) => {
    if (!stato) return 'var(--foreground)';
    return 'white';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h4 className="font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontSize: '1.6rem', margin: 0 }}>
              I tuoi bambini
            </h4>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Caricamento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h4 className="font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontSize: '1.6rem', margin: 0 }}>
              I tuoi bambini
            </h4>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm" style={{ padding: '0.75rem 1rem' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Desktop: Header con pulsante in linea */}
      <div className="hidden sm:flex" style={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h4 className="font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontSize: '1.6rem', margin: 0 }}>
            I tuoi bambini
          </h4>
        </div>
        <a
          href={`${baseUrl}/bambini/aggiungi`}
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
          Aggiungi
        </a>
      </div>

      {/* Mobile: Header senza pulsante */}
      <div className="flex sm:hidden" style={{ alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <h4 className="font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontSize: '1.6rem', margin: 0 }}>
          I tuoi bambini
        </h4>
      </div>

      {bambini.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', padding: '2rem 1rem', textAlign: 'center' }}>
          <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div>
            <p className="font-medium text-foreground" style={{ marginBottom: '0.5rem' }}>
              Nessun bambino registrato
            </p>
            <p className="text-sm text-muted-foreground">
              Clicca sul pulsante "Aggiungi" per iniziare
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          {bambini.map((bambino) => {
            const fotoUrl = bambino.fields.FOTO_BAMBINO?.[0]?.url;
            const iscrizioneInfo = iscrizioniMap[bambino.id];
            
            return (
              <button
                key={bambino.id}
                onClick={() => window.location.href = `${baseUrl}/bambini/${bambino.id}`}
                className="card-rounded border hover:border-primary transition-colors text-left"
                style={{ 
                  padding: '1rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.75rem', 
                  cursor: 'pointer',
                  backgroundColor: 'var(--_redesign---neutral--neutral-100)',
                  borderColor: 'var(--border)',
                  boxShadow: '0 2px 5px 0 rgba(0,0,0,0.2)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* Foto o icona */}
                  <div style={{ 
                    width: '2.5rem', 
                    height: '2.5rem', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--primary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0,
                    overflow: 'hidden'
                  }}>
                    {fotoUrl ? (
                      <img
                        src={fotoUrl}
                        alt={`${bambino.fields.NOME_BAMBINO} ${bambino.fields.COGNOME_BAMBINO}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="5"></circle>
                        <path d="M20 21a8 8 0 1 0-16 0"></path>
                      </svg>
                    )}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="font-semibold" style={{ marginBottom: '0.125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {bambino.fields.NOME_BAMBINO} {bambino.fields.COGNOME_BAMBINO}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Nato il {formatDate(bambino.fields.DATA_NASCITA_BAMBINO)}
                    </p>
                  </div>
                </div>
                
                {/* Categoria */}
                {bambino.fields.CATEGORIA && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <span className="text-xs text-muted-foreground" style={{ minWidth: '75px' }}>Categoria:</span>
                    <span
                      style={{
                        backgroundColor: getCategoriaColor(),
                        color: getCategoriaTextColor(),
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        boxShadow: '0 2px 5px 0 rgba(0,0,0,0.2)'
                      }}
                    >
                      {bambino.fields.CATEGORIA}
                    </span>
                  </div>
                )}
                
                {/* Certificato e Iscrizione in riga */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {/* Certificato */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="text-xs text-muted-foreground" style={{ minWidth: '75px' }}>Certificato:</span>
                    <span
                      style={{
                        backgroundColor: getBadgeColor(bambino.fields.CERTIFICATO_MEDICO_STATO),
                        color: getBadgeTextColor(bambino.fields.CERTIFICATO_MEDICO_STATO),
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        flex: 1
                      }}
                    >
                      {bambino.fields.CERTIFICATO_MEDICO_STATO || 'Non disponibile'}
                    </span>
                  </div>
                  
                  {/* Iscrizione: stato badge o CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="text-xs text-muted-foreground" style={{ minWidth: '75px' }}>Iscrizione:</span>
                    {iscrizioneInfo?.hasIscrizioneCompleta ? (
                      <span
                        style={{
                          backgroundColor: getIscrizioneBadgeColor(iscrizioneInfo.statoIscrizione),
                          color: getIscrizioneBadgeTextColor(iscrizioneInfo.statoIscrizione),
                          padding: '0.125rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          flex: 1
                        }}
                      >
                        {iscrizioneInfo.statoIscrizione || 'Iscritto'}
                      </span>
                    ) : (
                      <a
                        href={`${baseUrl}/iscrizioni/nuova?bambino=${bambino.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="pulsante1 btn-standard inline-flex items-center justify-center gap-1"
                        style={{
                          textDecoration: 'none',
                          fontSize: '0.75rem',
                          height: '1.75rem',
                          paddingLeft: '0.75rem',
                          paddingRight: '0.75rem',
                          flex: 1
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14"/>
                          <path d="M12 5v14"/>
                        </svg>
                        Crea iscrizione
                      </a>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Mobile: Pulsante Aggiungi in basso */}
      {bambini.length > 0 && (
        <>
          <div className="flex sm:hidden" style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>
          <div className="flex sm:hidden" style={{ justifyContent: 'center' }}>
            <a
              href={`${baseUrl}/bambini/aggiungi`}
              className="pulsante1 btn-standard inline-flex items-center justify-center"
              style={{ 
                textDecoration: 'none',
                width: '2.5rem',
                height: '2.5rem',
                padding: 0,
                minWidth: 'unset'
              }}
              title="Aggiungi bambino"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="M12 5v14"/>
              </svg>
            </a>
          </div>
        </>
      )}
    </div>
  );
}
