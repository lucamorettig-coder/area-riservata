import { useState } from 'react';
import { baseUrl } from '../lib/base-url';
import UploadButton from './UploadButton';
import { ButtonPrimary } from './ButtonPrimary';

interface CertificatoMedicoProps {
  bambinoId: string;
  certificato: {
    file?: string;
    scadenza?: string;
    stato?: string;
  };
}

// Classe utility per pulsante secondario
const btnSecondary = "h-10 rounded-full px-6 text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm whitespace-nowrap no-underline";

// Helper per formattare dimensione file
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

export default function CertificatoMedico({ bambinoId, certificato }: CertificatoMedicoProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expiryDate, setExpiryDate] = useState('');

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non disponibile';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Logica colori basata sullo stato
  const getStatusColors = () => {
    const stato = certificato.stato?.toLowerCase();
    
    if (stato === 'valido') {
      return {
        iconBg: 'bg-green-100',
        iconText: 'text-green-600',
        badgeBg: 'bg-green-600',
        badgeText: 'text-white'
      };
    } else if (stato === 'in scadenza') {
      return {
        iconBg: 'bg-orange-100',
        iconText: 'text-orange-600',
        badgeBg: 'bg-orange-500',
        badgeText: 'text-white'
      };
    } else if (stato === 'scaduto') {
      return {
        iconBg: 'bg-red-100',
        iconText: 'text-red-600',
        badgeBg: 'bg-red-600',
        badgeText: 'text-white'
      };
    } else {
      return {
        iconBg: 'bg-slate-100',
        iconText: 'text-slate-400',
        badgeBg: 'bg-slate-200',
        badgeText: 'text-slate-800'
      };
    }
  };

  const colors = getStatusColors();
  const stato = certificato.stato || 'Non disponibile';
  const needsAttention = !certificato.file || stato.toLowerCase() === 'scaduto' || stato.toLowerCase() === 'in scadenza';

  const handleFileSelect = (file: File) => {
    // Validazione tipo file
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Formato file non valido. Usa PDF, JPG o PNG.');
      return;
    }

    // Validazione dimensione (max 10MB per allineamento con API)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Il file è troppo grande. Dimensione massima: 10MB.');
      return;
    }

    setSelectedFile(file);
    setUploadError(null);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setExpiryDate('');
    setUploadError(null);
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) {
      setUploadError('Seleziona un file');
      return;
    }

    if (!expiryDate) {
      setUploadError('Seleziona la data di scadenza del certificato');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Converti file in base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);

      reader.onload = async () => {
        const fileData = reader.result as string;

        try {
          const response = await fetch(`${baseUrl}/api/bambini/${bambinoId}/certificato`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileData,
              fileName: selectedFile.name,
              fileType: selectedFile.type,
              fileSize: selectedFile.size,
              scadenza: expiryDate,
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || 'Errore durante il caricamento');
          }

          // Ricarica la pagina per mostrare il nuovo certificato
          window.location.reload();
        } catch (error) {
          setUploadError(error instanceof Error ? error.message : 'Errore durante il caricamento');
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setUploadError('Errore nella lettura del file');
        setIsUploading(false);
      };
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Errore durante il caricamento');
      setIsUploading(false);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Titolo sezione */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <h4 className="text-xl sm:text-2xl font-bold text-slate-700 uppercase tracking-wide leading-none m-0">
          Certificato Medico
        </h4>
      </div>

      {/* Card Status Row */}
      <div 
        className="bg-slate-100 rounded-3xl border border-slate-200 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6"
        style={{ boxShadow: '0 2px 5px 0 rgba(0,0,0,0.2)' }}
      >
        {/* Elemento 1: Icona di Stato */}
        <div className={`w-14 h-14 rounded-full ${colors.iconBg} flex items-center justify-center shrink-0`}>
          {needsAttention ? (
            // Icona di attenzione (punto esclamativo)
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-7 h-7 ${colors.iconText}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          ) : (
            // Icona documento con spunta
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-7 h-7 ${colors.iconText}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <polyline points="9 13 11 15 15 11"></polyline>
            </svg>
          )}
        </div>

        {/* Elemento 2: Informazioni (Centro - Espanso) */}
        <div className="flex-1 flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Scadenza certificato
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xl font-bold text-slate-900">
              {formatDate(certificato.scadenza)}
            </span>
            <span className={`${colors.badgeBg} ${colors.badgeText} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide inline-flex items-center gap-2 w-fit whitespace-nowrap`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {stato}
            </span>
          </div>
        </div>

        {/* Elemento 3: Azioni (Destra) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
          {certificato.file && (
            <a
              href={certificato.file}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btnSecondary} w-full sm:w-auto leading-none`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-4 h-4 -translate-y-px"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Visualizza
            </a>
          )}

          <UploadButton
            label={certificato.file ? 'Aggiorna' : 'Carica'}
            onFileSelect={handleFileSelect}
            isLoading={isUploading}
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>
      </div>

      {/* Form Upload - NUOVO DESIGN con margine maggiore */}
      {selectedFile && (
        <div className="mt-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm animate-in fade-in slide-in-from-top-2">
          
          {/* Header Form */}
          <h5 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">1</span>
            Conferma i dati del certificato
          </h5>

          <div className="flex flex-col gap-5">
            
            {/* 1. Anteprima File (Stile "Card") */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              {/* Icona File */}
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              {/* Dettagli File */}
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold text-slate-700 truncate" title={selectedFile.name}>
                  {selectedFile.name}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {formatFileSize(selectedFile.size)} • Pronto per l'upload
                </span>
              </div>
            </div>

            {/* 2. Input Data Scadenza */}
            <div className="flex flex-col gap-2">
              <label htmlFor="scadenza" className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
                Data di scadenza *
              </label>
              <input 
                type="date" 
                id="scadenza"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="h-11 rounded-xl border border-slate-300 shadow-sm focus:border-blue-900 focus:ring-1 focus:ring-blue-900 text-slate-700 text-sm px-3 w-full"
                required
              />
              <p className="text-[10px] text-slate-400 ml-1">
                Inserisci la data indicata sul certificato
              </p>
            </div>

            {/* Separatore */}
            <hr className="border-slate-100" />

            {/* 3. Pulsanti (Chiari e Leggibili) */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={handleCancel}
                disabled={isUploading}
                className="h-10 rounded-full px-6 text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-800 transition-colors flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annulla
              </button>
              
              <ButtonPrimary
                label="Conferma e Salva"
                onClick={handleConfirmUpload}
                isLoading={isUploading}
                disabled={!expiryDate}
                icon="check"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Messaggio di errore con margine maggiore */}
      {uploadError && (
        <div className="mt-2" style={{ padding: '0.75rem 1rem' }}>
          <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg p-3">
            {uploadError}
          </div>
        </div>
      )}

      {/* Info box con margine maggiore */}
      <div className="mt-2 bg-slate-50 rounded-2xl p-4 border border-slate-200">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-slate-300 flex items-center justify-center shrink-0 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700 mb-1">
              Formati accettati
            </p>
            <p className="text-xs text-slate-600">
              PDF, JPG, PNG • Dimensione massima: 10MB
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
