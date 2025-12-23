import React, { useState } from 'react';
import { baseUrl } from '../lib/base-url';

interface CertificatoMedicoProps {
  bambinoId: string;
  certificato: {
    file?: string;
    scadenza?: string;
    stato?: string;
  };
}

export default function CertificatoMedico({ bambinoId, certificato }: CertificatoMedicoProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [scadenza, setScadenza] = useState('');
  const [message, setMessage] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Calcola colore badge in base allo stato
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

  // Calcola colore del testo in base allo stato
  const getBadgeTextColor = (stato?: string) => {
    if (!stato) return 'var(--foreground)';
    
    switch (stato.toLowerCase()) {
      case 'valido':
      case 'in scadenza':
      case 'scaduto':
        return 'white';
      default:
        return 'var(--foreground)';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!file) {
      setMessage('⚠️ Seleziona un file');
      return;
    }

    if (!scadenza) {
      setMessage('⚠️ Seleziona la data di scadenza');
      return;
    }

    // Validazione dimensione file (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage('⚠️ Il file è troppo grande (max 10MB)');
      return;
    }

    // Validazione tipo file
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setMessage('⚠️ Formato non supportato. Usa PDF, JPG o PNG.');
      return;
    }

    setIsUploading(true);

    try {
      // Converti file in base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const fileData = reader.result as string;

        const response = await fetch(`${baseUrl}/api/bambini/${bambinoId}/certificato`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileData,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            scadenza,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setMessage('✅ Certificato caricato con successo!');
          setFile(null);
          setScadenza('');
          setShowUploadForm(false);
          // Ricarica la pagina dopo 2 secondi
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          setMessage(`❌ ${result.error || 'Errore durante il caricamento'}`);
        }

        setIsUploading(false);
      };

      reader.onerror = () => {
        setMessage('❌ Errore nella lettura del file');
        setIsUploading(false);
      };
    } catch (error) {
      setMessage('❌ Errore di rete');
      setIsUploading(false);
    }
  };

  const handleViewCertificate = () => {
    if (!certificato.file) {
      console.error('[CertificatoMedico] No file URL available');
      return;
    }

    // L'URL dal campo CERTIFICATO_MEDICO_FILE di Airtable è già completo e pubblico
    console.log('[CertificatoMedico] Opening certificate URL:', certificato.file);
    window.open(certificato.file, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Titolo Sezione */}
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
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <line x1="10" y1="9" x2="8" y2="9"></line>
          </svg>
        </div>
        <h4 className="font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontSize: '1.6rem', margin: 0 }}>
          Certificato Medico
        </h4>
      </div>

      {/* Card Stato Certificato */}
      {certificato.file && certificato.scadenza ? (
        <div 
          className="card-rounded" 
          style={{ 
            padding: '1rem 1.5rem',
            backgroundColor: 'var(--_redesign---neutral--neutral-100)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 2px 5px 0 rgba(0,0,0,0.2)'
          }}
        >
          {/* Stato con badge colorato */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <p className="text-sm font-medium text-muted-foreground" style={{ margin: 0 }}>Stato:</p>
            <span
              style={{
                backgroundColor: getBadgeColor(certificato.stato),
                color: getBadgeTextColor(certificato.stato),
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {certificato.stato || 'Non disponibile'}
            </span>
          </div>

          {/* Data scadenza */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ minWidth: '100px', margin: 0 }}>
              Scadenza
            </p>
            <p className="text-base" style={{ margin: 0 }}>
              {formatDate(certificato.scadenza)}
            </p>
          </div>

          {/* Pulsanti azione - Desktop */}
          <div className="hidden sm:flex" style={{ gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <button
              onClick={handleViewCertificate}
              className="pulsante1 btn-standard inline-flex items-center justify-center gap-2"
              style={{ 
                padding: '0 1.5rem',
                flexShrink: 0
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Visualizza
            </button>
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="pulsante1 is-secondary btn-standard inline-flex items-center justify-center gap-2"
              style={{ 
                padding: '0 1.5rem',
                flexShrink: 0
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Aggiorna
            </button>
          </div>

          {/* Pulsanti azione - Mobile (solo icone) */}
          <div className="flex sm:hidden" style={{ gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <button
              onClick={handleViewCertificate}
              className="pulsante1 btn-standard inline-flex items-center justify-center"
              style={{ 
                width: '2.5rem',
                height: '2.5rem',
                padding: 0,
                minWidth: 'unset',
                flexShrink: 0
              }}
              title="Visualizza certificato"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="pulsante1 is-secondary btn-standard inline-flex items-center justify-center"
              style={{ 
                width: '2.5rem',
                height: '2.5rem',
                padding: 0,
                minWidth: 'unset',
                flexShrink: 0
              }}
              title="Aggiorna certificato"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div 
          className="card-rounded" 
          style={{ 
            padding: '1rem 1.5rem',
            backgroundColor: 'var(--muted)/50',
            border: '2px dashed var(--border)'
          }}
        >
          <p className="text-sm text-muted-foreground" style={{ margin: 0 }}>
            Nessun certificato caricato
          </p>
          <button
            onClick={() => setShowUploadForm(true)}
            className="pulsante1 btn-standard"
            style={{ marginTop: '1rem' }}
          >
            Carica certificato
          </button>
        </div>
      )}

      {/* Form Upload/Aggiornamento (mostra solo quando richiesto) */}
      {showUploadForm && (
        <form id="upload-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="file" className="text-sm font-medium">
              Seleziona file
            </label>
            <input
              type="file"
              id="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={isUploading}
              style={{
                padding: '0.5rem',
                border: '1px solid var(--input)',
                borderRadius: 'var(--radius)',
                backgroundColor: 'var(--background)',
              }}
            />
            <p className="text-xs text-muted-foreground" style={{ margin: 0 }}>
              Formati supportati: PDF, JPG, PNG (max 10MB)
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="scadenza" className="text-sm font-medium">
              Data di scadenza
            </label>
            <input
              type="date"
              id="scadenza"
              value={scadenza}
              onChange={(e) => setScadenza(e.target.value)}
              disabled={isUploading}
              min={new Date().toISOString().split('T')[0]}
              required
              className="btn-standard"
              style={{
                padding: '0 0.75rem',
                border: '1px solid var(--input)',
                borderRadius: 'var(--radius)',
                backgroundColor: 'var(--background)',
              }}
            />
          </div>

          {message && (
            <div
              className="card-rounded"
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: message.includes('✅') ? 'var(--_redesign---palette-brand--verde)' : 'var(--muted)',
                color: message.includes('✅') ? 'white' : 'var(--foreground)',
              }}
            >
              <p className="text-sm" style={{ margin: 0 }}>{message}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="submit"
              disabled={isUploading}
              className="pulsante1 btn-standard"
              style={{
                opacity: isUploading ? 0.5 : 1,
                cursor: isUploading ? 'not-allowed' : 'pointer',
                flex: 1
              }}
            >
              {isUploading ? 'Caricamento...' : 'Carica'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowUploadForm(false);
                setFile(null);
                setScadenza('');
                setMessage('');
              }}
              className="pulsante1 is-secondary btn-standard"
              style={{ flex: 1 }}
            >
              Annulla
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
