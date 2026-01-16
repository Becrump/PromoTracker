
import React, { useState, useEffect, useCallback } from 'react';
import { PromoTable } from './components/PromoTable';
import { PromotionLibrary } from './components/PromotionLibrary';
import { PromoState, LibraryPromotion, PromotionStatus, MONTHS, ChainPromotion, SavedSession } from './types';
import { PlusCircle, RefreshCcw, History, Printer, Search, Archive, Download } from 'lucide-react';

const DEFAULT_CHAINS = [
  { id: 'motomart', name: 'MOTOMART' },
  { id: 'rhodes', name: 'RHODES' },
  { id: 'buchheits', name: 'BUCHHEIT\'S' },
  { id: 'hucks', name: 'HUCK\'S' }
];

const createEmptyPromoRow = (): ChainPromotion => ({
  id: crypto.randomUUID(),
  months: {}
});

const createInitialState = (): PromoState => {
  const state: PromoState = {};
  DEFAULT_CHAINS.forEach(chain => {
    state[chain.id] = [createEmptyPromoRow()];
  });
  return state;
};

const App: React.FC = () => {
  const [promoData, setPromoData] = useState<PromoState>(() => {
    const saved = localStorage.getItem('promo_planning_data');
    return saved ? JSON.parse(saved) : createInitialState();
  });

  const [history, setHistory] = useState<SavedSession[]>(() => {
    const saved = localStorage.getItem('promo_planning_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [library, setLibrary] = useState<LibraryPromotion[]>(() => {
    const saved = localStorage.getItem('promo_library');
    return saved ? JSON.parse(saved) : [];
  });

  const [view, setView] = useState<'h1' | 'h2' | 'full'>('h1');

  useEffect(() => {
    localStorage.setItem('promo_planning_data', JSON.stringify(promoData));
  }, [promoData]);

  useEffect(() => {
    localStorage.setItem('promo_planning_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('promo_library', JSON.stringify(library));
  }, [library]);

  const addToLibrary = useCallback((promo: Omit<LibraryPromotion, 'id'>) => {
    setLibrary(prev => {
      const normalizedPkg = (promo.pkg || '').trim().toLowerCase();
      const normalizedSrp = (promo.srp || '').trim();
      
      const exists = prev.some(p => 
        p.pkg.toLowerCase().trim() === normalizedPkg && 
        (p.srp || '').trim() === normalizedSrp
      );

      if (exists || !normalizedPkg || normalizedPkg.length < 2) return prev;
      
      return [...prev, { ...promo, id: crypto.randomUUID(), name: promo.pkg }];
    });
  }, []);

  const updateCell = (chainId: string, rowId: string, month: string, field: string, value: string | PromotionStatus) => {
    setPromoData(prev => {
      const chainRows = [...(prev[chainId] || [])];
      const rowIndex = chainRows.findIndex(r => r.id === rowId);
      if (rowIndex === -1) return prev;

      const row = { ...chainRows[rowIndex] };
      const currentMonthData = row.months[month] || {
        pkg: '', cost: '', srp: '', notes: '', status: PromotionStatus.NONE
      };

      const updatedMonthData = { ...currentMonthData, [field]: value };
      row.months = { ...row.months, [month]: updatedMonthData };
      chainRows[rowIndex] = row;

      return { ...prev, [chainId]: chainRows };
    });
  };

  const addRowToChain = (chainId: string) => {
    setPromoData(prev => ({
      ...prev,
      [chainId]: [...(prev[chainId] || []), createEmptyPromoRow()]
    }));
  };

  const removeRowFromChain = (chainId: string, rowId: string) => {
    setPromoData(prev => {
      const chainRows = prev[chainId].filter(r => r.id !== rowId);
      if (chainRows.length === 0) chainRows.push(createEmptyPromoRow());
      return { ...prev, [chainId]: chainRows };
    });
  };

  const startNewSession = () => {
    if (confirm("Archive current plan and start fresh?")) {
      const newSession: SavedSession = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        name: `Promo Plan - ${new Date().toLocaleDateString()}`,
        data: promoData
      };
      setHistory(prev => [newSession, ...prev]);
      setPromoData(createInitialState());
    }
  };

  const applyLibraryPromo = (chainId: string, rowId: string, month: string, promo: LibraryPromotion) => {
    updateCell(chainId, rowId, month, 'pkg', promo.pkg);
    updateCell(chainId, rowId, month, 'cost', promo.cost);
    updateCell(chainId, rowId, month, 'srp', promo.srp);
  };

  const monthsToShow = view === 'h1' ? MONTHS.slice(0, 6) : view === 'h2' ? MONTHS.slice(6, 12) : MONTHS;

  return (
    <div className="min-h-screen p-4 md:p-6 print:p-0 bg-slate-50">
      <header className="max-w-[1800px] mx-auto flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6 no-print">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-900 rounded-xl shadow-lg">
             <Search className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Promo Tracker</h1>
              <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest shadow-sm">Enterprise</span>
            </div>
            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.2em] mt-0.5">Annual Promotional Master Calendar</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-white rounded-lg shadow-sm border border-slate-200 p-1 mr-2">
            {(['h1', 'h2', 'full'] as const).map((v) => (
              <button 
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${view === v ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {v === 'h1' ? 'JAN-JUN' : v === 'h2' ? 'JUL-DEC' : 'FULL YEAR'}
              </button>
            ))}
          </div>

          <button 
            onClick={startNewSession}
            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-[9px] font-black text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest"
          >
            <RefreshCcw className="w-3.5 h-3.5 text-amber-500" />
            Archive & Clear
          </button>
          
          <button 
            onClick={() => {
              const originalView = view;
              setView('full');
              setTimeout(() => {
                window.print();
                setView(originalView);
              }, 100);
            }}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-lg text-[9px] font-black hover:bg-black shadow-lg transition-all uppercase tracking-widest"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Form
          </button>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto space-y-8">
        <section className="bg-white rounded-xl shadow-xl border border-slate-300 overflow-hidden print:shadow-none print:border-none">
          <PromoTable 
            chains={DEFAULT_CHAINS}
            months={monthsToShow}
            data={promoData}
            onUpdate={updateCell}
            library={library}
            onApplyPromo={applyLibraryPromo}
            onAddToLibrary={addToLibrary}
            onAddRow={addRowToChain}
            onRemoveRow={removeRowFromChain}
          />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 no-print">
          <section className="xl:col-span-8">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 h-full">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest">
                  <PlusCircle className="w-4 h-4 text-blue-600" />
                  Product Library
                </h2>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Syncing with Grid...</span>
              </div>
              <PromotionLibrary 
                library={library} 
                onDelete={(id) => setLibrary(prev => prev.filter(p => p.id !== id))}
                onAdd={addToLibrary}
              />
            </div>
          </section>

          <section className="xl:col-span-4">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 h-full">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 mb-6 uppercase tracking-widest">
                <History className="w-4 h-4 text-blue-600" />
                History
              </h2>
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-slate-300">
                  <Archive className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-[9px] font-black uppercase tracking-widest italic">No previous versions</p>
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                  {history.map(session => (
                    <div key={session.id} className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-all cursor-pointer group" onClick={() => {
                      if(confirm("Restore this version?")) setPromoData(session.data);
                    }}>
                      <div className="font-black text-slate-800 text-[10px] mb-0.5 uppercase tracking-wide">{session.name}</div>
                      <div className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{new Date(session.timestamp).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="max-w-[1800px] mx-auto mt-12 pb-8 text-center no-print border-t border-slate-200 pt-6">
        <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.5em]">2025 MASTER PROMO PLANNING SUITE</p>
      </footer>
    </div>
  );
};

export default App;
