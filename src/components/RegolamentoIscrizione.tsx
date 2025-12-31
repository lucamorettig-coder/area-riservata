import { useState } from 'react';
import { baseUrl } from '../lib/base-url';
import imageCompression from 'browser-image-compression';

interface RegolamentoIscrizioneProps {
  iscrizioneId: string;
  regolamentoEsistente?: {
    url: string;
    nome: string;
  } | null;
  onUploadSuccess?: () => void;
}

// --- COMPONENTI UI CONDIVISI ---

const SectionIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white shrink-0">
    {children}
  </div>
);

const StatusBadge = ({ label, type }: { label: string; type: 'success' | 'warning' | 'error' | 'info' }) => {
  const styles = {
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-orange-100 text-orange-700 border-orange-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${styles[type]}`}>
      {label}
    </span>
  );
};

const GrayCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-slate-100 rounded-3xl border border-slate-200 p-6 sm:p-8 ${className}`}>
    {children}
  </div>
);

export default function RegolamentoIscrizione({ 
  iscrizioneId, 
  regolamentoEsistente = null,
  onUploadSuccess 
}: RegolamentoIscrizioneProps) {
  const [regolamentoFile, setRegolamentoFile] = useState<{ nome: string; url: string } | null>(regolamentoEsistente);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const LINK_MODULO = 'https://drive.google.com/file/d/1fS4i1lNIS_e7YEMmpm3JFnAgdiXkGiTd/view?usp=drive_link';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      // Validazioni
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('Il file è troppo grande. Dimensione massima: 5MB');
      }

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo di file non valido. Usa PDF, JPG o PNG');
      }

      let processedFile = file;

      // Comprimi immagini se necessario
      if (file.type.startsWith('image/')) {
        console.log('[REGOLAMENTO] Compressing image...');
        processedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });
        console.log('[REGOLAMENTO] Image compressed from', file.size, 'to', processedFile.size);
      }

      // Converti in base64 (COME IL CERTIFICATO MEDICO)
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(processedFile);
      });

      console.log('[REGOLAMENTO] Sending request to:', `${baseUrl}/api/iscrizioni/${iscrizioneId}/regolamento`);

      // Invia al server con JSON (COME IL CERTIFICATO MEDICO)
      const response = await fetch(`${baseUrl}/api/iscrizioni/${iscrizioneId}/regolamento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: base64,
          fileName: file.name,
          fileType: file.type,
          fileSize: processedFile.size,
        }),
      });

      console.log('[REGOLAMENTO] Response status:', response.status);

      const data = await response.json();
      console.log('[REGOLAMENTO] Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante il caricamento');
      }

      console.log('[REGOLAMENTO] Upload successful');

      // Aggiorna lo stato locale
      setRegolamentoFile({
        nome: file.name,
        url: data.url,
      });

      // Callback per aggiornare la pagina padre
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err: any) {
      console.error('[REGOLAMENTO] Error:', err);
      setError(err.message || 'Errore durante il caricamento del file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSostituisci = () => {
    setRegolamentoFile(null);
    setError(null);
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SectionIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </SectionIcon>
          <h4 className="text-xl font-bold text-slate-700 uppercase tracking-wide">Regolamento</h4>
        </div>
        <StatusBadge label={regolamentoFile ? "Caricato" : "Mancante"} type={regolamentoFile ? "success" : "warning"} />
      </div>

      <GrayCard>
        <div className="flex flex-col gap-4">
          {/* Istruzioni */}
          <p className="text-sm text-slate-600">
            Scarica il modulo, firmalo e caricalo qui sotto (PDF o Foto).
          </p>

          {/* Messaggio di errore */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* BOX INFO DOCUMENTO */}
          {!regolamentoFile ? (
            // STATO VUOTO
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:border-blue-300 transition-all">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-sm">Modulo Iscrizione Scuola Ciclismo</span>
                  <span className="text-xs text-slate-500">Documento da firmare</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={LINK_MODULO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 transition-all flex items-center justify-center gap-2 no-underline"
                  title="Scarica modulo vuoto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Scarica modulo
                </a>
              </div>
            </div>
          ) : (
            // STATO CARICATO
            <div className="bg-white rounded-2xl border-2 border-green-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0 border border-green-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-sm">{regolamentoFile.nome}</span>
                  <span className="text-xs text-green-600 font-medium">✓ Caricato con successo</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={regolamentoFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 transition-all flex items-center justify-center gap-2 no-underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  Visualizza
                </a>

                <button
                  onClick={handleSostituisci}
                  disabled={isUploading}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-blue-900 text-white text-xs font-bold hover:bg-blue-800 shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Sostituisci
                </button>
              </div>
            </div>
          )}

          {/* AREA DRAG & DROP */}
          {!regolamentoFile && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center text-center transition-all ${
                isUploading 
                  ? 'cursor-wait opacity-60' 
                  : isDragging 
                  ? 'border-blue-500 bg-blue-50 cursor-pointer' 
                  : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer'
              }`}
            >
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
              />

              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-blue-700">Caricamento in corso...</p>
                </div>
              ) : (
                <>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all ${
                    isDragging ? 'bg-blue-100 text-blue-600 scale-110' : 'bg-white text-slate-400 border-2 border-slate-200'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>

                  <p className="text-sm font-bold text-slate-700 mb-1">
                    {isDragging ? 'Rilascia il file qui' : 'Trascina qui il regolamento firmato'}
                  </p>
                  <p className="text-xs text-slate-500">
                    oppure clicca per selezionare il file (PDF o Foto, max 5MB)
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </GrayCard>
    </section>
  );
}
