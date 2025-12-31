import { useState } from 'react';
import { baseUrl } from '../lib/base-url';
import ActionButton from './ActionButton';
import RegolamentoIscrizione from './RegolamentoIscrizione';

interface DettaglioIscrizioneProps {
  iscrizioneId: string;
  bambino: {
    nome: string;
    categoria: string;
  };
  regolamentoEsistente?: {
    url: string;
    nome: string;
  } | null;
  privacy: {
    accettata: boolean;
    dataAccettazione?: string;
  };
  taglie: {
    maglia?: string;
    pantaloncino?: string;
    tuta?: string;
  };
  tariffe: {
    quotaAnno: number;
    iscrizione: number;
    kit: number;
  };
  statoIscrizione: string;
}

// --- COMPONENTI UI CONDIVISI ---

const SectionIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white shrink-0">
    {children}
  </div>
);

const StatusBadge = ({ label, type }: { label: string; type: 'success' | 'warning' | 'error' | 'info' }) => {
  const styles = {
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-orange-100 text-orange-700 border-orange-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${styles[type]}`}>
      {label}
    </span>
  );
};

const GrayCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-slate-100 rounded-3xl border border-slate-200 p-6 sm:p-8 ${className}`}>
    {children}
  </div>
);

const StepItem = ({ status, label }: { status: 'done' | 'current' | 'pending'; label: string }) => {
   const config = {
      done: { iconBg: 'bg-green-500 border-green-500', iconText: 'text-white', text: 'text-slate-400 line-through decoration-slate-300' },
      current: { iconBg: 'bg-white border-orange-500', iconText: 'text-orange-500', text: 'text-slate-900 font-bold' },
      pending: { iconBg: 'bg-white border-slate-200', iconText: 'text-transparent', text: 'text-slate-500' }
   };
   
   const style = config[status];

   return (
      <div className="flex items-center gap-4 py-3 relative z-10">
         <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${style.iconBg}`}>
            {status === 'done' && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
            {status === 'current' && <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>}
         </div>
         <span className={`text-sm ${style.text}`}>{label}</span>
      </div>
   );
};

export default function DettaglioIscrizione({
  iscrizioneId,
  bambino,
  regolamentoEsistente = null,
  privacy,
  taglie,
  tariffe,
  statoIscrizione
}: DettaglioIscrizioneProps) {
  // Stati per i campi modificabili
  const [privacyAccepted, setPrivacyAccepted] = useState(privacy.accettata);
  const [taglieState, setTaglieState] = useState({
    maglia: taglie.maglia || '',
    pantaloncino: taglie.pantaloncino || '',
    tuta: taglie.tuta || ''
  });

  // Stati per la checklist (si aggiornano solo dopo il salvataggio)
  const [regolamentoSalvato, setRegolamentoSalvato] = useState(!!regolamentoEsistente);
  const [privacySalvata, setPrivacySalvata] = useState(privacy.accettata);
  const [taglieSalvate, setTaglieSalvate] = useState(!!(taglie.maglia || taglie.pantaloncino || taglie.tuta));

  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);
  const [isSavingTaglie, setIsSavingTaglie] = useState(false);
  const [errorPrivacy, setErrorPrivacy] = useState<string | null>(null);
  const [errorTaglie, setErrorTaglie] = useState<string | null>(null);
  const [successPrivacy, setSuccessPrivacy] = useState(false);
  const [successTaglie, setSuccessTaglie] = useState(false);
  
  const taglieMagliaPantaloncino = ['5XS', '4XS', '3XS', '2XS', 'XS'];
  const taglieTuta = ['110/120', '130/140'];

  const handleLogout = async () => {
    try {
      await fetch(`${baseUrl}/api/logout`, { method: 'POST' });
      window.location.href = `${baseUrl}/login`;
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  // Funzione per ricaricare i dati dell'iscrizione da Airtable
  const ricaricaIscrizione = async () => {
    try {
      console.log('[DettaglioIscrizione] Ricaricamento dati iscrizione...');
      const res = await fetch(`${baseUrl}/api/iscrizioni/${iscrizioneId}`);
      if (res.ok) {
        const data = await res.json();
        const iscrizione = data.iscrizione;
        
        // Aggiorna gli stati della checklist con i dati freschi da Airtable
        setRegolamentoSalvato(!!(iscrizione.fields.REGOLAMENTO_FIRMATO && iscrizione.fields.REGOLAMENTO_FIRMATO.length > 0));
        setPrivacySalvata(!!iscrizione.fields.PRIVACY_MINORE);
        setTaglieSalvate(!!(iscrizione.fields.TAGLIA_MAGLIA || iscrizione.fields.TAGLIA_PANTALONCINO || iscrizione.fields.TAGLIA_TUTA));
        
        console.log('[DettaglioIscrizione] Dati aggiornati con successo');
      }
    } catch (error) {
      console.error('[DettaglioIscrizione] Errore ricaricamento:', error);
    }
  };

  const handleRegolamentoUploadSuccess = async () => {
    console.log('Regolamento caricato, ricarico dati iscrizione');
    await ricaricaIscrizione();
  };

  const handleSalvaPrivacy = async () => {
    setIsSavingPrivacy(true);
    setErrorPrivacy(null);
    setSuccessPrivacy(false);

    try {
      const response = await fetch(`${baseUrl}/api/iscrizioni/${iscrizioneId}/privacy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privacyAccettata: privacyAccepted,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante il salvataggio');
      }

      console.log('Privacy salvata con successo, ricarico dati');
      setSuccessPrivacy(true);
      
      // RICARICA DATI DA AIRTABLE
      await ricaricaIscrizione();

      // Nascondi messaggio successo dopo 3 secondi
      setTimeout(() => setSuccessPrivacy(false), 3000);
    } catch (err: any) {
      console.error('Errore salvataggio privacy:', err);
      setErrorPrivacy(err.message || 'Errore durante il salvataggio della privacy');
    } finally {
      setIsSavingPrivacy(false);
    }
  };

  const handleSalvaTaglie = async () => {
    setIsSavingTaglie(true);
    setErrorTaglie(null);
    setSuccessTaglie(false);

    try {
      const response = await fetch(`${baseUrl}/api/iscrizioni/${iscrizioneId}/taglie`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maglia: taglieState.maglia || null,
          pantaloncino: taglieState.pantaloncino || null,
          tuta: taglieState.tuta || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante il salvataggio');
      }

      console.log('Taglie salvate con successo, ricarico dati');
      setSuccessTaglie(true);
      
      // RICARICA DATI DA AIRTABLE
      await ricaricaIscrizione();

      // Nascondi messaggio successo dopo 3 secondi
      setTimeout(() => setSuccessTaglie(false), 3000);
    } catch (err: any) {
      console.error('Errore salvataggio taglie:', err);
      setErrorTaglie(err.message || 'Errore durante il salvataggio delle taglie');
    } finally {
      setIsSavingTaglie(false);
    }
  };

  // Calcola stato checklist - USA GLI STATI "SALVATI"
  const stepRegolamento = regolamentoSalvato ? 'done' : 'current';
  const stepPrivacy = regolamentoSalvato ? (privacySalvata ? 'done' : 'current') : 'pending';
  const stepTaglie = (regolamentoSalvato && privacySalvata) ? (taglieSalvate ? 'done' : 'current') : 'pending';

  // Conta passaggi mancanti - USA GLI STATI "SALVATI"
  const passaggiMancanti = [
    !regolamentoSalvato,
    !privacySalvata
  ].filter(Boolean).length;

  // USA LO STATO DA AIRTABLE
  const statoIscrizioneBadge = statoIscrizione === 'Completa' ? 'success' : 'warning';
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 flex flex-col gap-8">
        
        {/* HEADER PAGINA */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
           <div className="flex items-center gap-4">
               <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dettaglio Iscrizione</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-500 text-sm">Pratica:</span>
                    <span className="font-semibold text-slate-800 text-sm">{bambino.nome} • 2025</span>
                  </div>
               </div>
           </div>
           
           <div className="flex items-center gap-2">
              <div className="hidden sm:block mr-2">
                <StatusBadge label={statoIscrizione} type={statoIscrizioneBadge} />
              </div>
              <ActionButton type="back" href={`${baseUrl}/dashboard`} />
              <ActionButton type="logout" onClick={handleLogout} />
           </div>
        </div>

        {/* CONTENUTO PRINCIPALE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLONNA SINISTRA: TASKS */}
          <div className="lg:col-span-8 flex flex-col gap-8">

             {/* 1. SEZIONE REGOLAMENTO */}
             <RegolamentoIscrizione 
               iscrizioneId={iscrizioneId}
               regolamentoEsistente={regolamentoEsistente}
               onUploadSuccess={handleRegolamentoUploadSuccess}
             />

             {/* 2. SEZIONE PRIVACY */}
             <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <SectionIcon>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      </SectionIcon>
                      <h4 className="text-xl font-bold text-slate-700 uppercase tracking-wide">Privacy</h4>
                   </div>
                   <StatusBadge label={privacySalvata ? "Confermato" : "Da confermare"} type={privacySalvata ? "success" : "warning"} />
                </div>

                <GrayCard>
                   {/* Messaggio successo */}
                   {successPrivacy && (
                     <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 mb-4">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 shrink-0 mt-0.5">
                         <polyline points="20 6 9 17 4 12"></polyline>
                       </svg>
                       <p className="text-sm text-green-700 font-medium">Privacy salvata con successo!</p>
                     </div>
                   )}

                   {/* Messaggio errore */}
                   {errorPrivacy && (
                     <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-4">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 shrink-0 mt-0.5">
                         <circle cx="12" cy="12" r="10"></circle>
                         <line x1="12" y1="8" x2="12" y2="12"></line>
                         <line x1="12" y1="16" x2="12.01" y2="16"></line>
                       </svg>
                       <p className="text-sm text-red-700">{errorPrivacy}</p>
                     </div>
                   )}

                   <div className="bg-white rounded-3xl border border-slate-200 p-5 h-40 overflow-y-auto text-xs text-slate-600 mb-5 leading-relaxed shadow-sm">
                      <p className="font-bold text-slate-800 mb-2 block">Informativa Privacy per il trattamento dei dati personali</p>
                      <p>Ai sensi del Regolamento UE 2016/679 (GDPR), i dati personali del minore saranno trattati dalla Scuola di Ciclismo per le finalità istituzionali e organizzative relative all'iscrizione presso la Federazione Ciclistica Italiana (FCI), la gestione delle attività sportive, formative ed educative, comunicazioni relative ai corsi e agli eventi, adempimenti amministrativi e contabili necessari alla corretta gestione dell'iscrizione.</p>
                      <p className="mt-2">I dati saranno conservati per il tempo strettamente necessario alla gestione dell'iscrizione e per gli obblighi di legge previsti dalla normativa vigente. Il genitore o tutore legale ha diritto di accedere, rettificare, cancellare i dati e limitarne il trattamento secondo le modalità previste dal GDPR.</p>
                      <p className="mt-2">Per maggiori informazioni o per esercitare i diritti previsti dalla normativa privacy: privacy@scuolaciclismo.it</p>
                   </div>
                   
                   <div className="flex items-start gap-3 p-3 -ml-3 hover:bg-white/50 rounded-xl transition-colors cursor-pointer group select-none">
                      <div className="relative flex items-center mt-0.5 shrink-0">
                        <input 
                          type="checkbox" 
                          checked={privacyAccepted}
                          onChange={(e) => setPrivacyAccepted(e.target.checked)}
                          className="w-5 h-5 rounded border-slate-300 text-blue-900 focus:ring-blue-900 cursor-pointer" 
                        />
                      </div>
                      <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors leading-snug break-words">
                         Dichiaro di aver letto l'informativa e acconsento al trattamento dei dati personali del minore per l'iscrizione presso la FCI <span className="text-red-500">*</span>
                      </span>
                   </div>

                   <div className="flex justify-end mt-6 pt-6 border-t border-slate-200/60">
                      <button 
                        disabled={!privacyAccepted || isSavingPrivacy} 
                        onClick={handleSalvaPrivacy}
                        className="h-10 rounded-full px-8 text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                      >
                         {isSavingPrivacy ? (
                           <>
                             <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                             </svg>
                             Salvataggio...
                           </>
                         ) : (
                           'Salva consenso'
                         )}
                      </button>
                   </div>
                </GrayCard>
             </section>

             {/* 3. SEZIONE KIT SCUOLA */}
             <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <SectionIcon>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path></svg>
                      </SectionIcon>
                      <h4 className="text-xl font-bold text-slate-700 uppercase tracking-wide">Kit Scuola</h4>
                   </div>
                   <StatusBadge label="Opzionale" type="info" />
                </div>

                <GrayCard>
                   {/* Messaggio successo */}
                   {successTaglie && (
                     <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 mb-4">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 shrink-0 mt-0.5">
                         <polyline points="20 6 9 17 4 12"></polyline>
                       </svg>
                       <p className="text-sm text-green-700 font-medium">Taglie salvate con successo!</p>
                     </div>
                   )}

                   {/* Messaggio errore */}
                   {errorTaglie && (
                     <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-4">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 shrink-0 mt-0.5">
                         <circle cx="12" cy="12" r="10"></circle>
                         <line x1="12" y1="8" x2="12" y2="12"></line>
                         <line x1="12" y1="16" x2="12.01" y2="16"></line>
                       </svg>
                       <p className="text-sm text-red-700">{errorTaglie}</p>
                     </div>
                   )}

                   <div className="flex items-start gap-3 mb-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-slate-600"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                      <p className="text-xs text-slate-600">Seleziona le taglie per il kit. Questa informazione ci aiuta a preparare il materiale corretto per tuo figlio.</p>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {/* Maglia */}
                      <div className="flex flex-col gap-2">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Taglia Maglia</label>
                         <div className="relative">
                            <select 
                              value={taglieState.maglia}
                              onChange={(e) => setTaglieState({ ...taglieState, maglia: e.target.value })}
                              className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none appearance-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-sm"
                            >
                               <option value="">Seleziona...</option>
                               {taglieMagliaPantaloncino.map(taglia => (
                                  <option key={taglia} value={taglia}>{taglia}</option>
                               ))}
                            </select>
                            <div className="absolute right-4 top-4 pointer-events-none text-slate-400">
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                         </div>
                      </div>

                      {/* Pantaloncino */}
                      <div className="flex flex-col gap-2">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Taglia Pantaloncino</label>
                         <div className="relative">
                            <select 
                              value={taglieState.pantaloncino}
                              onChange={(e) => setTaglieState({ ...taglieState, pantaloncino: e.target.value })}
                              className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none appearance-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-sm"
                            >
                               <option value="">Seleziona...</option>
                               {taglieMagliaPantaloncino.map(taglia => (
                                  <option key={taglia} value={taglia}>{taglia}</option>
                               ))}
                            </select>
                            <div className="absolute right-4 top-4 pointer-events-none text-slate-400">
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                         </div>
                      </div>

                      {/* Tuta */}
                      <div className="flex flex-col gap-2">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Taglia Tuta</label>
                         <div className="relative">
                            <select 
                              value={taglieState.tuta}
                              onChange={(e) => setTaglieState({ ...taglieState, tuta: e.target.value })}
                              className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none appearance-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-sm"
                            >
                               <option value="">Seleziona...</option>
                               {taglieTuta.map(taglia => (
                                  <option key={taglia} value={taglia}>{taglia}</option>
                               ))}
                            </select>
                            <div className="absolute right-4 top-4 pointer-events-none text-slate-400">
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="flex justify-end mt-8 pt-6 border-t border-slate-200/60">
                      <button 
                        onClick={handleSalvaTaglie}
                        disabled={isSavingTaglie}
                        className="h-10 rounded-full px-8 text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                      >
                         {isSavingTaglie ? (
                           <>
                             <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                             </svg>
                             Salvataggio...
                           </>
                         ) : (
                           'Salva preferenze'
                         )}
                      </button>
                   </div>
                </GrayCard>
             </section>

          </div>

          {/* COLONNA DESTRA: SIDEBAR (Sticky) */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-6">
             
             {/* 1. CARD RIEPILOGO */}
             <GrayCard className="!p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                   <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Dati Iscritto</h5>
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-600 text-sm font-medium">Nominativo</span>
                      <span className="font-bold text-slate-900 text-sm">{bambino.nome}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-slate-600 text-sm font-medium">Categoria</span>
                      <span className="bg-blue-900 text-white px-2 py-0.5 rounded text-[10px] font-bold">{bambino.categoria}</span>
                   </div>
                </div>

                <div className="p-6 bg-white">
                   <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Riepilogo Costi</h5>
                   <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-slate-600">
                         <span>Quota anno</span>
                         <span className="font-bold text-slate-900">{tariffe.quotaAnno.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-xs">
                         <span>Iscrizione</span>
                         <span>{tariffe.iscrizione.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-xs">
                         <span>Kit scuola</span>
                         <span>{tariffe.kit.toFixed(2)} €</span>
                      </div>
                      <div className="h-px bg-slate-100 my-2"></div>
                      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg -mx-2">
                         <span className="font-bold text-slate-700 text-xs">Scadenza Rate</span>
                         <span className="text-xs text-slate-500 font-mono">GEN • MAR • MAG</span>
                      </div>
                   </div>
                </div>
             </GrayCard>

             {/* 2. CARD STATO */}
             <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-6 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                   Stato Avanzamento
                </h5>
                
                <div className="space-y-0 relative pl-2">
                   <div className="absolute left-[15px] top-3 bottom-6 w-0.5 bg-slate-100"></div>

                   <StepItem status="done" label="Dati bambino" />
                   <StepItem status={stepRegolamento} label="Regolamento firmato" />
                   <StepItem status={stepPrivacy} label="Privacy trattamento dati" />
                   <StepItem status={stepTaglie} label="Taglie kit scuola (Opz.)" />
                </div>
                
                {passaggiMancanti > 0 && (
                  <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex gap-3 items-start">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500 shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                     <div>
                        <p className="text-xs font-bold text-orange-800 mb-1">Attenzione</p>
                        <p className="text-xs text-orange-700 leading-relaxed">
                           Mancano <strong>{passaggiMancanti} passaggi obbligatori</strong> per completare l'iscrizione di {bambino.nome.split(' ')[0]}.
                        </p>
                     </div>
                  </div>
                )}

                {passaggiMancanti === 0 && (
                  <div className="mt-8 p-4 bg-green-50 rounded-2xl border border-green-200 flex gap-3 items-start">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                     <div>
                        <p className="text-xs font-bold text-green-800 mb-1">Completo</p>
                        <p className="text-xs text-green-700 leading-relaxed">
                           Tutti i passaggi obbligatori sono stati completati!
                        </p>
                     </div>
                  </div>
                )}
             </div>

          </div>

        </div>
      </div>
    </div>
  );
}
