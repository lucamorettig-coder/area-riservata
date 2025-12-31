import { baseUrl } from '../lib/base-url';
import ListaIscrizioni from './ListaIscrizioni';

interface IscrizioniBambinoProps {
  bambinoId: string;
}

export default function IscrizioniBambino({ bambinoId }: IscrizioniBambinoProps) {

  const handleSelectIscrizione = (iscrizioneId: string) => {
    window.location.href = `${baseUrl}/iscrizioni/${iscrizioneId}`;
  };

  const handleNuovaIscrizione = () => {
    window.location.href = `${baseUrl}/iscrizioni/nuova?bambinoId=${bambinoId}`;
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
        </div>
        <h4 className="text-xl sm:text-2xl font-bold text-slate-700 uppercase tracking-wide leading-none m-0">
          Iscrizioni
        </h4>
      </div>

      {/* Contenitore Grigio - Identico alle altre sezioni */}
      <div 
        className="bg-slate-100 rounded-3xl border border-slate-200 p-6 sm:p-8"
        style={{ boxShadow: '0 2px 5px 0 rgba(0,0,0,0.2)' }}
      >
        <ListaIscrizioni 
          bambinoId={bambinoId}
          onSelectIscrizione={handleSelectIscrizione}
          onNuovaIscrizione={handleNuovaIscrizione}
        />
      </div>
    </section>
  );
}
