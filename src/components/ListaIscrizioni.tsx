import { useState, useEffect } from 'react';
import { baseUrl } from '../lib/base-url';
import { normalizeLookup } from '../lib/airtable';

interface Iscrizione {
  id: string;
  fields: {
    TABELLA_GENITORI: string[];
    TABELLA_BAMBINI: string[];
    TABELLA_TARIFFE: string[];
    DATA_ISCRIZIONE?: string;
    STATO_ISCRIZIONE?: string;
    CATEGORIA_FCI?: string | string[];
    'NOME_BAMBINO (from TABELLA_BAMBINI)'?: string[];
    'COGNOME_BAMBINO (from TABELLA_BAMBINI)'?: string[];
    'ANNO_ISCRIZIONE (from TABELLA_TARIFFE)'?: string[];
  };
}

interface IscrizioniResponse {
  iscrizioni: Iscrizione[];
}

interface ErrorResponse {
  error?: string;
}

interface ListaIscrizioniProps {
  bambinoId?: string; // ✅ ORA OPZIONALE (undefined = tutte le iscrizioni del genitore)
  onSelectIscrizione: (id: string) => void;
  onNuovaIscrizione: () => void;
}

export default function ListaIscrizioni({ bambinoId, onSelectIscrizione, onNuovaIscrizione }: ListaIscrizioniProps) {
  const [iscrizioni, setIscrizioni] = useState<Iscrizione[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchIscrizioni();
  }, [bambinoId]);

  const fetchIscrizioni = async () => {
    try {
      // ✅ Se bambinoId è undefined, fetch senza query param (tutte le iscrizioni del genitore)
      const url = bambinoId 
        ? `${baseUrl}/api/iscrizioni?bambinoId=${bambinoId}`
        : `${baseUrl}/api/iscrizioni`;
      
      console.log('[ListaIscrizioni] Fetching from:', url);
      
      const response = await fetch(url);
      const data = (await response.json()) as IscrizioniResponse | ErrorResponse;
      
      if (!response.ok) {
        throw new Error((data as ErrorResponse).error || 'Errore nel caricamento iscrizioni');
      }
      
      console.log('[ListaIscrizioni] Fetched', (data as IscrizioniResponse).iscrizioni.length, 'iscrizioni');
      setIscrizioni((data as IscrizioniResponse).iscrizioni);
    } catch (err) {
      console.error('[ListaIscrizioni] Error:', err);
      setError(err instanceof Error ? err.message : 'Errore nel caricamento');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/D';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getBadgeStyle = (stato?: string) => {
    if (!stato) return 'bg-slate-100 text-slate-600 border-slate-200';
    
    switch (stato.toLowerCase()) {
      case 'completa':
      case 'attiva':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'da completare':
      case 'incompleta':
      case 'in attesa':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'scaduta':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="text-slate-500 text-sm">Caricamento iscrizioni...</div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm p-4">
        {error}
      </div>
    );
  }

  // EMPTY STATE - Nessuna iscrizione
  if (iscrizioni.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-6 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-slate-800 font-medium">Nessuna iscrizione attiva</span>
          <span className="text-slate-500 text-sm">
            {bambinoId 
              ? 'Registra una nuova iscrizione per questo bambino.' 
              : 'Aggiungi un bambino e poi crea la sua iscrizione.'}
          </span>
        </div>
        <button 
          onClick={onNuovaIscrizione}
          className="mt-2 h-10 rounded-full px-6 bg-blue-900 text-white font-bold text-sm hover:bg-blue-800 transition-colors shadow-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Crea Nuova Iscrizione
        </button>
      </div>
    );
  }

  // ✅ CASO SINGOLA ISCRIZIONE (DettaglioBambino)
  if (bambinoId && iscrizioni.length === 1) {
    const iscrizione = iscrizioni[0];
    
    const nomeBambino = normalizeLookup(iscrizione.fields['NOME_BAMBINO (from TABELLA_BAMBINI)']) || 'N/D';
    const cognomeBambino = normalizeLookup(iscrizione.fields['COGNOME_BAMBINO (from TABELLA_BAMBINI)']) || '';
    const anno = normalizeLookup(iscrizione.fields['ANNO_ISCRIZIONE (from TABELLA_TARIFFE)']) || 'N/D';
    const categoria = normalizeLookup(iscrizione.fields.CATEGORIA_FCI) || 'N/D';
    const stato = iscrizione.fields.STATO_ISCRIZIONE || 'Da completare';
    const dataIscrizione = iscrizione.fields.DATA_ISCRIZIONE;

    return (
      <div 
        onClick={() => onSelectIscrizione(iscrizione.id)}
        className="group relative bg-white rounded-2xl border border-slate-200/60 p-5 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-200"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Info Principali */}
          <div className="flex items-center gap-4">
            {/* Icona Documento */}
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <path d="M16 13H8"></path>
                <path d="M16 17H8"></path>
                <path d="M10 9H8"></path>
              </svg>
            </div>
            
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-800">
                Anno {anno}
              </span>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="font-medium text-slate-600">Categoria {categoria}</span>
                <span>•</span>
                <span>{dataIscrizione ? `Iscr. il ${formatDate(dataIscrizione)}` : 'Data N/D'}</span>
              </div>
            </div>
          </div>

          {/* Badge Stato + Freccia */}
          <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getBadgeStyle(stato)}`}>
              {stato}
            </span>
            
            {/* Freccia (indicatore di cliccabilità) */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-slate-300 group-hover:text-blue-500 transition-colors ml-auto sm:ml-0"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // ✅ CASO MULTIPLE ISCRIZIONI (Dashboard - tutte le iscrizioni del genitore)
  return (
    <div className="flex flex-col gap-3">
      {iscrizioni.map((iscrizione) => {
        const nomeBambino = normalizeLookup(iscrizione.fields['NOME_BAMBINO (from TABELLA_BAMBINI)']) || 'N/D';
        const cognomeBambino = normalizeLookup(iscrizione.fields['COGNOME_BAMBINO (from TABELLA_BAMBINI)']) || '';
        const anno = normalizeLookup(iscrizione.fields['ANNO_ISCRIZIONE (from TABELLA_TARIFFE)']) || 'N/D';
        const categoria = normalizeLookup(iscrizione.fields.CATEGORIA_FCI) || 'N/D';
        const stato = iscrizione.fields.STATO_ISCRIZIONE || 'Da completare';
        const dataIscrizione = iscrizione.fields.DATA_ISCRIZIONE;

        return (
          <div 
            key={iscrizione.id}
            onClick={() => onSelectIscrizione(iscrizione.id)}
            className="group relative bg-white rounded-2xl border border-slate-200/60 p-5 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              {/* Info Principali */}
              <div className="flex items-center gap-4">
                {/* Icona Documento */}
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                    <path d="M10 9H8"></path>
                  </svg>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-slate-800">
                    {nomeBambino} {cognomeBambino}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="font-medium text-slate-600">Anno {anno}</span>
                    <span>•</span>
                    <span className="font-medium text-slate-600">Categoria {categoria}</span>
                    <span>•</span>
                    <span>{dataIscrizione ? `${formatDate(dataIscrizione)}` : 'Data N/D'}</span>
                  </div>
                </div>
              </div>

              {/* Badge Stato + Freccia */}
              <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getBadgeStyle(stato)}`}>
                  {stato}
                </span>
                
                {/* Freccia (indicatore di cliccabilità) */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-slate-300 group-hover:text-blue-500 transition-colors ml-auto sm:ml-0"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
