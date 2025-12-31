import { useState, useEffect } from 'react';
import { baseUrl } from '../lib/base-url';

interface Bambino {
  id: string;
  fields: {
    NOME_BAMBINO: string;
    COGNOME_BAMBINO: string;
    DATA_NASCITA_BAMBINO: string;
    LUOGO_NASCITA_BAMBINO: string;
    CODICE_FISCALE_BAMBINO: string;
    VIA_RESIDENZA_BAMBINO: string;
    CITTA_RESIDENZA_BAMBINO: string;
    CATEGORIA?: string;
    CERTIFICATO_MEDICO_STATO?: string;
    FOTO_BAMBINO?: Array<{ url: string }>;
  };
}

interface IscrizioneInfo {
  hasIscrizioneCompleta: boolean;
  statoIscrizione?: string;
}

interface BambiniResponse {
  bambini: Bambino[];
  iscrizioniMap?: Record<string, IscrizioneInfo>;
}

interface ErrorResponse {
  error?: string;
}

export default function ListaBambini() {
  const [bambini, setBambini] = useState<Bambino[]>([]);
  const [iscrizioniMap, setIscrizioniMap] = useState<Record<string, IscrizioneInfo>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBambini();
  }, []);

  const fetchBambini = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/bambini`);
      const data = (await response.json()) as BambiniResponse | ErrorResponse;

      if (!response.ok) {
        throw new Error((data as ErrorResponse).error || 'Errore nel caricamento bambini');
      }

      setBambini((data as BambiniResponse).bambini);
      setIscrizioniMap((data as BambiniResponse).iscrizioniMap || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Helper per lo stile dei badge (Certificato) - ALLINEATO con CertificatoMedico.tsx
  const getCertColorStyle = (stato?: string) => {
    switch (stato?.toLowerCase()) {
      case 'valido': 
        return 'bg-green-600 text-white border-green-600';
      case 'in scadenza': 
        return 'bg-orange-500 text-white border-orange-500';
      case 'scaduto': 
        return 'bg-red-600 text-white border-red-600';
      default: 
        return 'bg-slate-200 text-slate-800 border-slate-200';
    }
  };

  // Helper per lo stile dei badge (Iscrizione)
  const getSubColorStyle = (stato?: string) => {
    if (!stato) return 'bg-blue-50 text-blue-700 border-blue-200'; // Default "Nuova"
    switch (stato.toLowerCase()) {
      case 'completa': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'incompleta': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'in attesa': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  if (loading) return <div className="text-slate-500 text-sm py-4">Caricamento profili...</div>;
  
  if (error) return <div className="text-red-600 text-sm py-4 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>;

  if (bambini.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
             <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <p className="text-slate-600 font-medium text-sm">Nessun bambino registrato</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {bambini.map((bambino) => {
        const fotoUrl = bambino.fields.FOTO_BAMBINO?.[0]?.url;
        const iscrizioneInfo = iscrizioniMap[bambino.id];
        const certStato = bambino.fields.CERTIFICATO_MEDICO_STATO;
        const statoIscrizione = iscrizioneInfo?.statoIscrizione;

        return (
          <a
            key={bambino.id}
            href={`${baseUrl}/bambini/${bambino.id}`}
            className="group rounded-2xl border border-slate-200 p-5 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col gap-4 text-left no-underline relative overflow-hidden"
            style={{ 
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 5px 0 rgba(0,0,0,0.2)' 
            }}
          >
            {/* 1. Header Card: Avatar e Info Principali */}
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                {fotoUrl ? (
                  <img src={fotoUrl} alt="Foto" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-blue-900 bg-blue-100 w-full h-full flex items-center justify-center">
                    {bambino.fields.NOME_BAMBINO.charAt(0)}{bambino.fields.COGNOME_BAMBINO.charAt(0)}
                  </span>
                )}
              </div>

              {/* Testi */}
              <div className="flex-1 min-w-0 pt-0.5">
                <h5 className="font-bold text-slate-900 text-lg leading-tight truncate group-hover:text-blue-700 transition-colors">
                  {bambino.fields.NOME_BAMBINO} {bambino.fields.COGNOME_BAMBINO}
                </h5>
                <p className="text-sm text-slate-500 mt-1">
                  Nato il {formatDate(bambino.fields.DATA_NASCITA_BAMBINO)}
                </p>
                {bambino.fields.CATEGORIA && (
                   <span className="inline-block mt-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wide">
                     {bambino.fields.CATEGORIA}
                   </span>
                )}
              </div>

              {/* Freccetta navigazione */}
              <div className="text-slate-300 group-hover:text-blue-600 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
            </div>

            {/* Divisore leggero */}
            <div className="h-px bg-slate-100 w-full" />

            {/* 2. Footer Card: Badge di Stato */}
            <div className="flex flex-wrap gap-2">
              
              {/* Badge Certificato - ALLINEATO con CertificatoMedico.tsx */}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-wide ${getCertColorStyle(certStato)}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                   {certStato?.toLowerCase() === 'valido' && <polyline points="9 11 12 14 22 4" />}
                 </svg>
                 <span>Cert: {certStato || 'Mancante'}</span>
              </div>

              {/* Badge Iscrizione */}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-wide ${getSubColorStyle(statoIscrizione)}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                 </svg>
                 <span>Iscr: {statoIscrizione || 'Nuova'}</span>
              </div>

            </div>
          </a>
        );
      })}
    </div>
  );
}
