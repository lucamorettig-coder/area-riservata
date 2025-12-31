interface StatoIscrizioneGlobaleProps {
  hasPrivacy: boolean;
  hasRegolamento: boolean;
}

export default function StatoIscrizioneGlobale({ hasPrivacy, hasRegolamento }: StatoIscrizioneGlobaleProps) {
  const isCompleta = hasPrivacy && hasRegolamento;
  const mancanti = [];
  
  if (!hasPrivacy) mancanti.push('Privacy');
  if (!hasRegolamento) mancanti.push('Regolamento');

  if (isCompleta) {
    return (
      <div 
        className="bg-slate-100 rounded-3xl border border-slate-200 p-6 sm:p-8"
        style={{ boxShadow: '0 2px 5px 0 rgba(0,0,0,0.2)' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-green-800 mb-1">
              Iscrizione Completa
            </h3>
            <p className="text-sm text-slate-600">
              Tutti i documenti obbligatori sono stati caricati correttamente
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-slate-100 rounded-3xl border border-slate-200 p-6 sm:p-8"
      style={{ boxShadow: '0 2px 5px 0 rgba(0,0,0,0.2)' }}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-amber-800 mb-1">
            Iscrizione da Completare
          </h3>
          <p className="text-sm text-slate-600">
            {mancanti.length === 1 ? 'Manca' : 'Mancano'} {mancanti.length} {mancanti.length === 1 ? 'passaggio obbligatorio' : 'passaggi obbligatori'}
          </p>
        </div>
      </div>
    </div>
  );
}
