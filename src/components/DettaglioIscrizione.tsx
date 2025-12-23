import { useState, useEffect } from 'react';
import { baseUrl } from '../lib/base-url';
import type { Iscrizione, Tariffa } from '../lib/airtable';

interface DettaglioIscrizioneProps {
  iscrizioneId: string;
}

export default function DettaglioIscrizione({ iscrizioneId }: DettaglioIscrizioneProps) {
  const [iscrizione, setIscrizione] = useState<Iscrizione | null>(null);
  const [tariffa, setTariffa] = useState<Tariffa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Stati per gestione form
  const [privacyGdpr, setPrivacyGdpr] = useState(false);
  const [tagliaMaglia, setTagliaMaglia] = useState('');
  const [tagliaPantaloncino, setTagliaPantaloncino] = useState('');
  const [tagliaTuta, setTagliaTuta] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Stato upload regolamento
  const [uploadingRegolamento, setUploadingRegolamento] = useState(false);
  const [uploadRegolamentoSuccess, setUploadRegolamentoSuccess] = useState(false);

  useEffect(() => {
    fetchDettaglioIscrizione();
  }, [iscrizioneId]);

  const fetchDettaglioIscrizione = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dettaglio iscrizione
      const response = await fetch(`${baseUrl}/api/iscrizioni/${iscrizioneId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Errore nel caricamento dell\'iscrizione');
      }

      const data = await response.json() as { iscrizione: Iscrizione };
      setIscrizione(data.iscrizione);
      
      // Fetch tariffa se disponibile
      if (data.iscrizione.fields.TABELLA_TARIFFE?.[0]) {
        const tariffaRes = await fetch(
          `${baseUrl}/api/tariffe/${data.iscrizione.fields.TABELLA_TARIFFE[0]}`,
          { credentials: 'include' }
        );
        if (tariffaRes.ok) {
          const tariffaData = await tariffaRes.json() as { tariffa: Tariffa };
          setTariffa(tariffaData.tariffa);
        }
      }
      
      // Popola i form con i dati esistenti
      setPrivacyGdpr(data.iscrizione.fields.PRIVACY_GDPR_FCI || false);
      setTagliaMaglia(data.iscrizione.fields.TAGLIA_MAGLIA || '');
      setTagliaPantaloncino(data.iscrizione.fields.TAGLIA_PANTALONCINO || '');
      setTagliaTuta(data.iscrizione.fields.TAGLIA_TUTA || '');
      
    } catch (err: any) {
      setError(err.message || 'Errore nel caricamento');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveData = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch(`${baseUrl}/api/iscrizioni/${iscrizioneId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          PRIVACY_GDPR_FCI: privacyGdpr,
          TAGLIA_MAGLIA: tagliaMaglia,
          TAGLIA_PANTALONCINO: tagliaPantaloncino,
          TAGLIA_TUTA: tagliaTuta,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || 'Errore nel salvataggio');
      }

      const data = await response.json() as { iscrizione: Iscrizione };
      setIscrizione(data.iscrizione);
      setSuccessMessage('Dati salvati con successo!');
      
      // Nascondi il messaggio dopo 3 secondi
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Errore nel salvataggio');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadRegolamento = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validazione file (solo PDF)
    if (!file.type.includes('pdf')) {
      setError('Per favore carica un file PDF');
      return;
    }

    // Limite dimensione (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Il file è troppo grande. Dimensione massima: 5MB');
      return;
    }

    try {
      setUploadingRegolamento(true);
      setError(null);
      setUploadRegolamentoSuccess(false);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${baseUrl}/api/iscrizioni/${iscrizioneId}/regolamento`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || 'Errore nel caricamento del regolamento');
      }

      const data = await response.json() as { iscrizione: Iscrizione };
      setIscrizione(data.iscrizione);
      setUploadRegolamentoSuccess(true);
      
      // Nascondi il successo dopo 3 secondi
      setTimeout(() => setUploadRegolamentoSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Errore nel caricamento');
    } finally {
      setUploadingRegolamento(false);
    }
  };

  const getBadgeColor = (categoria?: string) => {
    if (!categoria) return 'bg-muted text-muted-foreground';
    return 'bg-primary text-primary-foreground';
  };

  const getBadgeTextColor = (categoria?: string) => {
    if (!categoria) return 'text-foreground';
    return 'text-primary-foreground';
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

  if (error && !iscrizione) {
    return (
      <div className="space-y-4">
        <div style={{ padding: '1rem 1.5rem', border: '1px solid var(--destructive)', backgroundColor: 'var(--destructive)', color: 'white' }}>
          <p className="text-sm">{error}</p>
        </div>
        <a href={`${baseUrl}/dashboard`} className="pulsante1 is-secondary btn-standard" style={{ textDecoration: "none", display: "inline-block" }}>
          Torna indietro
        </a>
      </div>
    );
  }

  if (!iscrizione) {
    return (
      <div>
        <p className="text-muted-foreground">Iscrizione non trovata</p>
        <a href={`${baseUrl}/dashboard`} className="pulsante1 is-secondary btn-standard mt-4" style={{ textDecoration: "none", display: "inline-block" }}>
          Torna indietro
        </a>
      </div>
    );
  }

  const fields = iscrizione.fields;
  const tariffaFields = tariffa?.fields;
  
  // Estrai i dati del bambino dagli array lookup
  const nomeBambino = fields['NOME BAMBINO']?.[0] || '-';
  const cognomeBambino = fields['COGNOME BAMBINO']?.[0] || '-';
  const categoria = fields.CATEGORIA?.[0];

  return (
    <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header con titolo e pulsante indietro */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h3 className="text-xl sm:text-2xl font-bold font-heading" style={{ wordBreak: 'break-word' }}>
            Dettaglio Iscrizione
          </h3>
          <p className="text-sm text-muted-foreground">
            {nomeBambino} {cognomeBambino}
          </p>
        </div>
        <a
          href={`${baseUrl}/dashboard`}
          className="pulsante1 is-secondary btn-standard inline-flex items-center justify-center"
          style={{ 
            width: '2.5rem',
            height: '2.5rem',
            padding: 0,
            minWidth: 'unset',
            textDecoration: 'none'
          }}
          title="Torna alla dashboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </a>
      </div>

      {/* Separatore */}
      <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

      {/* Messaggio di successo globale */}
      {successMessage && (
        <div style={{ padding: '1rem 1.5rem', border: '1px solid var(--primary)', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
          <p className="text-sm">{successMessage}</p>
        </div>
      )}

      {/* Messaggio di errore globale */}
      {error && (
        <div style={{ padding: '1rem 1.5rem', border: '1px solid var(--destructive)', backgroundColor: 'var(--destructive)', color: 'white' }}>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Sezione: Dati Bambino */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h4 className="font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontSize: '1.6rem', margin: 0 }}>
            Dati Bambino
          </h4>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Nome e Cognome</p>
          <p className="text-base" style={{ margin: 0 }}>
            {nomeBambino} {cognomeBambino}
          </p>
        </div>
        
        {categoria && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Categoria</p>
            <span 
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium ${getBadgeColor(categoria)}`}
              style={{ boxShadow: '0 2px 5px 0 rgba(0,0,0,0.2)' }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={getBadgeTextColor(categoria)}
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span className={getBadgeTextColor(categoria)}>{categoria}</span>
            </span>
          </div>
        )}
        
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '120px', margin: 0 }}>Anno Iscrizione</p>
          <p className="text-base" style={{ margin: 0 }}>{fields.ANNO_ISCRIZIONE || '-'}</p>
        </div>
      </div>

      {/* Separatore */}
      <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

      {/* Sezione: Tariffe */}
      {tariffaFields && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h4 className="font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontSize: '1.6rem', margin: 0 }}>
                Tariffe Anno {tariffaFields.ANNO_ISCRIZIONE}
              </h4>
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
              <div className="card-rounded bg-muted/50" style={{ padding: '1rem 1.5rem' }}>
                <p className="text-xs text-muted-foreground mb-1">Scadenza rate</p>
                <p className="text-sm">{tariffaFields.SCADENZA_RATE}</p>
              </div>
            )}
          </div>

          {/* Separatore */}
          <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>
        </>
      )}

      {/* Sezione: Privacy GDPR FCI */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h4 className="font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontSize: '1.6rem', margin: 0 }}>
            Privacy GDPR per FCI
          </h4>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Per iscrivere il bambino alla Federazione Ciclistica Italiana (FCI) è necessario fornire il consenso al trattamento dei dati personali del minore secondo il GDPR.
        </p>
        
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={privacyGdpr}
            onChange={(e) => setPrivacyGdpr(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm">
            Acconsento al trattamento dei dati personali del minore per l'iscrizione presso la FCI secondo quanto previsto dal Regolamento UE 2016/679 (GDPR)
          </span>
        </label>
      </div>

      {/* Separatore */}
      <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

      {/* Sezione: Kit Scuola */}
      {tariffaFields?.DESCRIZIONE_KIT && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
              </div>
              <h4 className="font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontSize: '1.6rem', margin: 0 }}>
                Kit Scuola
              </h4>
            </div>
            
            <div className="card-rounded bg-muted/50" style={{ padding: '1rem 1.5rem' }}>
              <p className="text-sm whitespace-pre-line">{tariffaFields.DESCRIZIONE_KIT}</p>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Taglia Maglia
                </label>
                <input
                  type="text"
                  value={tagliaMaglia}
                  onChange={(e) => setTagliaMaglia(e.target.value)}
                  placeholder="es. S, M, L"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Taglia Pantaloncino
                </label>
                <input
                  type="text"
                  value={tagliaPantaloncino}
                  onChange={(e) => setTagliaPantaloncino(e.target.value)}
                  placeholder="es. S, M, L"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Taglia Tuta
                </label>
                <input
                  type="text"
                  value={tagliaTuta}
                  onChange={(e) => setTagliaTuta(e.target.value)}
                  placeholder="es. S, M, L"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Separatore */}
          <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>
        </>
      )}

      {/* Sezione: Regolamento Firmato */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h4 className="font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontSize: '1.6rem', margin: 0 }}>
            Regolamento Firmato
          </h4>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Carica il regolamento della scuola firmato (PDF). Puoi scaricare il modulo, firmarlo e caricarlo qui.
        </p>
        
        {fields.REGOLAMENTO_FIRMATO_FILE && fields.REGOLAMENTO_FIRMATO_FILE.length > 0 ? (
          <div className="card-rounded border border-border bg-muted/30" style={{ padding: '1rem' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary flex-shrink-0">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {fields.REGOLAMENTO_FIRMATO_FILE[0].filename || 'Regolamento firmato'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(fields.REGOLAMENTO_FIRMATO_FILE[0].size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <a
                href={fields.REGOLAMENTO_FIRMATO_FILE[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="pulsante1 is-secondary btn-standard flex-shrink-0"
              >
                Visualizza
              </a>
            </div>
            
            {/* Possibilità di sostituire */}
            <div className="mt-4 pt-4 border-t border-border">
              <label className="pulsante1 btn-standard inline-block cursor-pointer">
                {uploadingRegolamento ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Caricamento...
                  </span>
                ) : (
                  'Sostituisci file'
                )}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleUploadRegolamento}
                  className="hidden"
                  disabled={uploadingRegolamento}
                />
              </label>
            </div>
          </div>
        ) : (
          <div>
            <label className="pulsante1 btn-standard inline-block cursor-pointer">
              {uploadingRegolamento ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Caricamento...
                </span>
              ) : (
                'Carica Regolamento (PDF)'
              )}
              <input
                type="file"
                accept="application/pdf"
                onChange={handleUploadRegolamento}
                className="hidden"
                disabled={uploadingRegolamento}
              />
            </label>
            <p className="text-xs text-muted-foreground mt-2">
              Dimensione massima: 5MB • Formato: PDF
            </p>
          </div>
        )}
        
        {uploadRegolamentoSuccess && (
          <div style={{ padding: '0.75rem 1rem', border: '1px solid var(--primary)', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
            <p className="text-sm">Regolamento caricato con successo!</p>
          </div>
        )}
      </div>

      {/* Separatore */}
      <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

      {/* Pulsante Salva */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleSaveData}
          disabled={saving}
          className="pulsante1 btn-standard"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              Salvataggio...
            </span>
          ) : (
            'Salva Modifiche'
          )}
        </button>
      </div>
    </div>
  );
}
