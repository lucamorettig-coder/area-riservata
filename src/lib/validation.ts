// Validation utilities

export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Campo obbligatorio';
  if (!emailRegex.test(email)) return 'Email non valida';
  return null;
}

export function validateCodiceFiscale(cf: string): string | null {
  if (!cf) return 'Campo obbligatorio';
  const cfUpper = cf.toUpperCase();
  if (cfUpper.length !== 16) return 'Il codice fiscale deve essere di 16 caratteri';
  if (!/^[A-Z0-9]{16}$/.test(cfUpper)) return 'Codice fiscale non valido';
  return null;
}

export function validateRequired(value: string): string | null {
  if (!value || value.trim() === '') {
    return 'Campo obbligatorio';
  }
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone) return 'Campo obbligatorio';
  // Accetta vari formati di numero italiano
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  if (!phoneRegex.test(phone)) return 'Numero di telefono non valido';
  return null;
}

export function validateDate(date: string): string | null {
  if (!date) return 'Campo obbligatorio';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Data non valida';
  return null;
}

export function validateGenitoreData(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validazione campi obbligatori
  const requiredFields = [
    { field: 'NOME_GENITORE', label: 'Nome' },
    { field: 'COGNOME_GENITORE', label: 'Cognome' },
    { field: 'DATA_NASCITA_GENITORE', label: 'Data di nascita' },
    { field: 'LUOGO_NASCITA_GENITORE', label: 'Luogo di nascita' },
    { field: 'VIA_RESIDENZA_GENITORE', label: 'Indirizzo' },
    { field: 'CITTA_RESIDENZA_GENITORE', label: 'Città' },
  ];

  requiredFields.forEach(({ field }) => {
    const error = validateRequired(data[field]);
    if (error) {
      errors.push({ field, message: error });
    }
  });

  // Validazione email
  const emailError = validateEmail(data.EMAIL_GENITORE);
  if (emailError) {
    errors.push({ field: 'EMAIL_GENITORE', message: emailError });
  }

  // Validazione codice fiscale
  const cfError = validateCodiceFiscale(data.CODICE_FISCALE_GENITORE);
  if (cfError) {
    errors.push({ field: 'CODICE_FISCALE_GENITORE', message: cfError });
  }

  // Validazione cellulare
  const phoneError = validatePhone(data.CELLULARE_GENITORE);
  if (phoneError) {
    errors.push({ field: 'CELLULARE_GENITORE', message: phoneError });
  }

  // Validazione data di nascita
  const dateError = validateDate(data.DATA_NASCITA_GENITORE);
  if (dateError) {
    errors.push({ field: 'DATA_NASCITA_GENITORE', message: dateError });
  }

  // Validazione privacy
  if (!data.FLAG_PRIVACY) {
    errors.push({ 
      field: 'FLAG_PRIVACY', 
      message: 'Devi accettare il trattamento dei dati personali' 
    });
  }

  return errors;
}

export function validateBambinoData(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validazione campi obbligatori
  const requiredFields = [
    { field: 'NOME_BAMBINO', label: 'Nome' },
    { field: 'COGNOME_BAMBINO', label: 'Cognome' },
    { field: 'DATA_NASCITA_BAMBINO', label: 'Data di nascita' },
    { field: 'LUOGO_NASCITA_BAMBINO', label: 'Luogo di nascita' },
    { field: 'VIA_RESIDENZA_BAMBINO', label: 'Indirizzo' },
    { field: 'CITTA_RESIDENZA_BAMBINO', label: 'Città' },
  ];

  requiredFields.forEach(({ field }) => {
    const error = validateRequired(data[field]);
    if (error) {
      errors.push({ field, message: error });
    }
  });

  // Validazione codice fiscale
  const cfError = validateCodiceFiscale(data.CODICE_FISCALE_BAMBINO);
  if (cfError) {
    errors.push({ field: 'CODICE_FISCALE_BAMBINO', message: cfError });
  }

  // Validazione data di nascita
  const dateError = validateDate(data.DATA_NASCITA_BAMBINO);
  if (dateError) {
    errors.push({ field: 'DATA_NASCITA_BAMBINO', message: dateError });
  }

  return errors;
}
