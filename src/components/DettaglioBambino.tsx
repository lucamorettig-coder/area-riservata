import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { baseUrl } from '../lib/base-url';

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
  bambinoId: string;
  fotoUrl?: string;
}

// Componente helper per i campi dati
const InfoField = ({ label, value, className = "" }: { label: string; value: string; className?: string }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
      {label}
    </span>
    <span className="text-base font-medium text-slate-800 break-words">
      {value || "-"}
    </span>
  </div>
);

// Componente helper per le icone rotonde
const SectionIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white shrink-0">
    {children}
  </div>
);

export default function DettaglioBambino({ bambino, bambinoId, fotoUrl }: DettaglioBambinoProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(fotoUrl);
  const [uploadProgress, setUploadProgress] = useState('');

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

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
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: file.type,
      };

      let compressedFile = file;
      
      if (file.size > 1024 * 1024) {
        try {
          compressedFile = await imageCompression(file, options);
        } catch (compressionError) {
          console.warn('Errore nella compressione, uso file originale:', compressionError);
          compressedFile = file;
        }
      }

      // Validazione dimensione finale (max 5MB)
      if (compressedFile.size > 5 * 1024 * 1024) {
        setMessage('⚠️ L\'immagine è troppo grande. Prova con un\'immagine più piccola.');
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
          const timeoutId = setTimeout(() => controller.abort(), 60000);

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
            if (result.bambino?.fields?.FOTO_BAMBINO?.[0]?.url) {
              setCurrentPhotoUrl(result.bambino.fields.FOTO_BAMBINO[0].url);
            }
            setUploadProgress('');
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            setMessage(`❌ ${result.error || 'Errore durante il caricamento'}`);
            setUploadProgress('');
          }

          setIsUploading(false);
        } catch (fetchError: any) {
          if (fetchError.name === 'AbortError') {
            setMessage('❌ Il caricamento ha impiegato troppo tempo.');
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
      setMessage('❌ Errore durante l\'elaborazione dell\'immagine');
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Header Sezione */}
      <div className="flex items-center gap-3">
        <SectionIcon>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="5"></circle>
            <path d="M20 21a8 8 0 1 0-16 0"></path>
          </svg>
        </SectionIcon>
        <h4 className="text-xl sm:text-2xl font-bold text-slate-700 uppercase tracking-wide leading-none m-0">
          Dati Anagrafici
        </h4>
      </div>

      {/* Card Container */}
      <div className="bg-slate-100 rounded-3xl border border-slate-200 p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 items-start">
          
          {/* Colonna Sinistra: Foto */}
          <div className="flex flex-col items-center gap-4">
            {/* Foto Profilo */}
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-200 flex items-center justify-center">
              {currentPhotoUrl ? (
                <img
                  src={currentPhotoUrl}
                  alt={`${bambino.NOME_BAMBINO} ${bambino.COGNOME_BAMBINO}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-400"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </div>

            {/* Pulsante Cambia Foto - MODIFICATO CON STILI INLINE FORZATI */}
            <label 
              className={`h-10 rounded-full px-6 text-sm font-semibold transition-colors flex items-center justify-center gap-2 bg-blue-900 text-white hover:bg-blue-800 ${
                isUploading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
              }`}
              style={{
                // FORZA stili inline per impedire wrap
                display: 'inline-flex',
                whiteSpace: 'nowrap',
                minWidth: 'max-content',
                maxWidth: '100%',
                width: 'fit-content',
              }}
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
                style={{ flexShrink: 0 }}
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span style={{ whiteSpace: 'nowrap' }}>
                {isUploading ? 'Caricamento...' : 'Cambia foto'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            {/* Progress / Message */}
            {uploadProgress && (
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-900 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-600">{uploadProgress}</p>
              </div>
            )}

            {message && (
              <div
                className={`rounded-full px-4 py-2 text-xs font-medium ${
                  message.includes('✅')
                    ? 'bg-green-600 text-white'
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}
              >
                {message}
              </div>
            )}
          </div>

          {/* Colonna Destra: Dati */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
            <InfoField label="Nome" value={bambino.NOME_BAMBINO} />
            <InfoField label="Cognome" value={bambino.COGNOME_BAMBINO} />
            <InfoField label="Data di nascita" value={formatDate(bambino.DATA_NASCITA_BAMBINO)} />
            <InfoField label="Luogo di nascita" value={bambino.LUOGO_NASCITA_BAMBINO} />
            <InfoField label="Codice Fiscale" value={bambino.CODICE_FISCALE_BAMBINO} className="font-mono" />
            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <InfoField label="Indirizzo" value={bambino.VIA_RESIDENZA_BAMBINO} />
              <InfoField label="Città" value={bambino.CITTA_RESIDENZA_BAMBINO} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
