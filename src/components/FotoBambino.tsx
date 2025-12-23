import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { baseUrl } from '../lib/base-url';

interface FotoBambinoProps {
  bambinoId: string;
  fotoUrl?: string;
  nomeBambino: string;
}

export default function FotoBambino({ bambinoId, fotoUrl, nomeBambino }: FotoBambinoProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(fotoUrl);
  const [uploadProgress, setUploadProgress] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage('');
    setUploadProgress('');

    // Validazione tipo file
    if (!file.type.startsWith('image/')) {
      setMessage('⚠️ Seleziona un\'immagine valida (JPG, PNG, GIF)');
      return;
    }

    setIsUploading(true);
    setUploadProgress('Compressione immagine in corso...');

    try {
      // Comprimi l'immagine
      const options = {
        maxSizeMB: 1, // Massimo 1MB dopo la compressione
        maxWidthOrHeight: 1920, // Massimo 1920px di larghezza o altezza
        useWebWorker: true,
        fileType: file.type,
      };

      let compressedFile = file;
      
      // Comprimi solo se il file è più grande di 1MB
      if (file.size > 1024 * 1024) {
        try {
          compressedFile = await imageCompression(file, options);
          console.log(`Immagine compressa da ${(file.size / 1024 / 1024).toFixed(2)}MB a ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
        } catch (compressionError) {
          console.warn('Errore nella compressione, uso file originale:', compressionError);
          // Se la compressione fallisce, usa il file originale
          compressedFile = file;
        }
      }

      // Validazione dimensione finale (max 5MB)
      if (compressedFile.size > 5 * 1024 * 1024) {
        setMessage('⚠️ L\'immagine è troppo grande anche dopo la compressione. Prova con un\'immagine più piccola.');
        setIsUploading(false);
        setUploadProgress('');
        return;
      }

      setUploadProgress('Caricamento in corso...');

      // Converti file in base64
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      
      reader.onload = async () => {
        const fileData = reader.result as string;

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 secondi di timeout

          const response = await fetch(`${baseUrl}/api/bambini/${bambinoId}/foto`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileData,
              fileName: compressedFile.name,
              fileType: compressedFile.type,
              fileSize: compressedFile.size,
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          const result = await response.json();

          if (response.ok) {
            setMessage('✅ Foto caricata con successo!');
            // Aggiorna l'URL della foto
            if (result.bambino?.fields?.FOTO_BAMBINO?.[0]?.url) {
              setCurrentPhotoUrl(result.bambino.fields.FOTO_BAMBINO[0].url);
            }
            setShowUploadForm(false);
            setUploadProgress('');
            // Ricarica la pagina dopo 2 secondi
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            setMessage(`❌ ${result.error || 'Errore durante il caricamento'}`);
            setUploadProgress('');
          }

          setIsUploading(false);
        } catch (fetchError: any) {
          if (fetchError.name === 'AbortError') {
            setMessage('❌ Il caricamento ha impiegato troppo tempo. Prova con un\'immagine più piccola.');
          } else {
            setMessage('❌ Errore di rete durante il caricamento');
          }
          setIsUploading(false);
          setUploadProgress('');
        }
      };

      reader.onerror = () => {
        setMessage('❌ Errore nella lettura del file');
        setIsUploading(false);
        setUploadProgress('');
      };
    } catch (error) {
      console.error('Errore generale:', error);
      setMessage('❌ Errore durante l\'elaborazione dell\'immagine');
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Card Foto */}
      <div 
        className="card-rounded" 
        style={{ 
          padding: '1rem 1.5rem',
          backgroundColor: 'var(--_redesign---neutral--neutral-100)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
          boxShadow: '0 2px 5px 0 rgba(0,0,0,0.2)'
        }}
      >
        {/* Miniatura foto */}
        <div
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: 'var(--muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid var(--border)',
          }}
        >
          {currentPhotoUrl ? (
            <img
              src={currentPhotoUrl}
              alt={`Foto di ${nomeBambino}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--muted-foreground)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          )}
        </div>

        {/* Pulsanti azione - Desktop */}
        <div className="hidden sm:flex" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="pulsante1 btn-standard inline-flex items-center justify-center gap-2"
            disabled={isUploading}
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
            {currentPhotoUrl ? 'Cambia foto' : 'Carica foto'}
          </button>
        </div>

        {/* Pulsanti azione - Mobile (solo icona) */}
        <div className="flex sm:hidden" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="pulsante1 btn-standard inline-flex items-center justify-center"
            disabled={isUploading}
            style={{ 
              width: '2.5rem',
              height: '2.5rem',
              padding: 0,
              minWidth: 'unset',
              flexShrink: 0
            }}
            title={currentPhotoUrl ? 'Cambia foto' : 'Carica foto'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Form Upload (mostra solo quando richiesto) */}
      {showUploadForm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="photo-upload" className="text-sm font-medium">
              Seleziona immagine
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
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
              Le immagini verranno automaticamente compresse se troppo grandi
            </p>
          </div>

          {uploadProgress && (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid var(--muted)',
                  borderTop: '4px solid var(--primary)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto',
                }}
              />
              <p className="text-sm text-muted-foreground" style={{ marginTop: '0.5rem', margin: 0 }}>
                {uploadProgress}
              </p>
            </div>
          )}

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
              type="button"
              onClick={() => {
                setShowUploadForm(false);
                setMessage('');
                setUploadProgress('');
              }}
              className="pulsante1 is-secondary btn-standard"
              disabled={isUploading}
              style={{ flex: 1 }}
            >
              Annulla
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
