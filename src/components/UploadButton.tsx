import React from 'react';

interface UploadButtonProps {
  label: string;
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  accept?: string;
  className?: string;
}

export default function UploadButton({
  label,
  onFileSelect,
  isLoading = false,
  accept = "image/*",
  className = ""
}: UploadButtonProps) {
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    e.target.value = '';
  };

  // Stili base del pulsante
  // 1. flex (non inline-flex): Permette di controllare meglio la larghezza (w-full vs w-auto)
  // 2. justify-center: Centra il contenuto (icona + testo) quando il bottone è largo
  // 3. min-w-max: Impedisce al testo di andare a capo anche se il bottone si stringe (sicurezza)
  const baseButtonStyles = "h-10 rounded-full px-6 text-sm font-medium transition-colors flex items-center justify-center gap-2 bg-blue-900 text-white hover:bg-blue-800 shadow-sm border-0 min-w-max";
  
  const disabledStyles = isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer";

  return (
    // LABEL CONTAINER:
    // - w-full: Occupa tutta la larghezza su mobile
    // - sm:w-auto: Torna alla larghezza del contenuto su desktop
    <label className={`block w-full sm:w-auto ${disabledStyles} ${className}`}>
      
      {/* BUTTON DIV:
        - w-full: Si espande per riempire la label su mobile
        - sm:w-auto: Si stringe sul contenuto su desktop
      */}
      <div className={`${baseButtonStyles} w-full sm:w-auto`}>
        
        {/* Icona Upload - shrink-0 vitale */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-4 h-4 shrink-0" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>

        {/* SPAN TESTO:
           - whitespace-nowrap: Impedisce il wrap del testo
           - Il testo rimarrà su una riga e centrato grazie a justify-center del padre
        */}
        <span className="whitespace-nowrap leading-none pt-[1px]">
          {isLoading ? 'Caricamento...' : label}
        </span>
      </div>

      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={isLoading}
        className="hidden"
      />
    </label>
  );
}
