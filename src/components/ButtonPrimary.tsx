import React from 'react';

interface ButtonPrimaryProps {
  label?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: 'check' | 'arrow' | 'none';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function ButtonPrimary({
  label,
  children,
  onClick,
  isLoading = false,
  disabled = false,
  icon = 'none',
  className = "",
  type = 'button'
}: ButtonPrimaryProps) {
  
  const isDisabled = isLoading || disabled;

  // Icone disponibili
  const renderIcon = () => {
    if (isLoading) {
      return (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
      );
    }

    if (icon === 'check') {
      return (
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
          className="shrink-0"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      );
    }

    if (icon === 'arrow') {
      return (
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
          className="shrink-0"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      );
    }

    return null;
  };

  // Determina il contenuto da mostrare
  const content = children || label;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`pulsante1 h-10 rounded-full px-6 text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm w-full sm:w-auto ${className}`}
    >
      {/* Testo */}
      {typeof content === 'string' ? (
        <span className="whitespace-nowrap leading-none">
          {isLoading ? 'Caricamento...' : content}
        </span>
      ) : (
        content
      )}
      
      {/* Icona (a destra del testo) - solo se non c'è isLoading e non ci sono children custom */}
      {!children && renderIcon()}
    </button>
  );
}
