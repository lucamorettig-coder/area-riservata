import React from 'react';

interface ButtonSecondaryProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}

export function ButtonSecondary({ 
  href, 
  onClick, 
  children, 
  type = 'button',
  disabled = false,
  className = ''
}: ButtonSecondaryProps) {
  if (href) {
    return (
      <a 
        href={href}
        className={`pulsante1 is-secondary ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`pulsante1 is-secondary ${className}`}
    >
      {children}
    </button>
  );
}
