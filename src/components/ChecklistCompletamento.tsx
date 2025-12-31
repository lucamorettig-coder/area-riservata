interface ChecklistCompletamentoProps {
  hasPrivacy: boolean;
  hasRegolamento: boolean;
  hasTaglie: boolean;
}

export default function ChecklistCompletamento({ 
  hasPrivacy, 
  hasRegolamento,
  hasTaglie 
}: ChecklistCompletamentoProps) {
  
  const CheckItem = ({ 
    completed, 
    label, 
    optional = false 
  }: { 
    completed: boolean; 
    label: string;
    optional?: boolean;
  }) => (
    <div className="flex items-center gap-3">
      {completed ? (
        <div className="w-6 h-6 rounded-full bg-blue-900 flex items-center justify-center text-white shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      ) : (
        <div className={`w-6 h-6 rounded-full border-2 shrink-0 ${
          optional ? 'border-blue-400 bg-blue-50' : 'border-amber-500 bg-amber-50'
        }`}>
          {!optional && (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          )}
        </div>
      )}
      <p className={`text-sm ${completed ? 'text-slate-700 font-medium' : 'text-slate-600'}`}>
        {label}
        {optional && !completed && <span className="text-blue-600 ml-2 text-xs">(opzionale)</span>}
      </p>
    </div>
  );

  const mancanti = [!hasPrivacy, !hasRegolamento].filter(Boolean).length;

  return (
    <div 
      className="bg-slate-100 rounded-3xl border border-slate-200 p-6 sm:p-8"
      style={{ boxShadow: '0 2px 5px 0 rgba(0,0,0,0.2)' }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <line x1="10" y1="9" x2="8" y2="9"></line>
          </svg>
        </div>
        <h4 className="text-xl font-bold text-slate-700 uppercase tracking-wide">
          Completamento Iscrizione
        </h4>
      </div>

      <div className="space-y-4">
        <CheckItem 
          completed={true} 
          label="Dati bambino confermati" 
        />
        <CheckItem 
          completed={hasPrivacy} 
          label="Privacy per trattamento dati personali" 
        />
        <CheckItem 
          completed={hasRegolamento} 
          label="Regolamento firmato caricato" 
        />
        <CheckItem 
          completed={hasTaglie} 
          label="Taglie kit scuola" 
          optional={true}
        />
      </div>

      {mancanti > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-300">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-amber-700">
              {mancanti === 1 ? 'Manca 1 passaggio obbligatorio' : `Mancano ${mancanti} passaggi obbligatori`}
            </span>
            {' '}per completare l'iscrizione
          </p>
        </div>
      )}
    </div>
  );
}
