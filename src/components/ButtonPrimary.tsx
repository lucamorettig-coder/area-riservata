import React from 'react';

interface ButtonPrimaryProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}

export function ButtonPrimary({ 
  href, 
  onClick, 
  children, 
  type = 'button',
  disabled = false,
  className = ''
}: ButtonPrimaryProps) {
  if (href) {
    return (
      <a 
        href={href}
        className={`pulsante1 ${className}`}
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
      className={`pulsante1 ${className}`}
    >
      {children}
    </button>
  );
}
