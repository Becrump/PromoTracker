
import React, { useState } from 'react';
import { PromotionStatus, Month, LibraryPromotion, PromoEntry } from '../types';
import { Check, Clock, X, ChevronDown, BookOpen } from 'lucide-react';

interface PromoCellGroupProps {
  chainId: string;
  rowId: string;
  month: Month;
  field: string;
  value: string;
  status: PromotionStatus;
  entry?: PromoEntry;
  onUpdate: (chainId: string, rowId: string, month: string, field: string, value: string | PromotionStatus) => void;
  library: LibraryPromotion[];
  onApplyPromo: (chainId: string, rowId: string, month: string, promo: LibraryPromotion) => void;
  onAddToLibrary: (promo: Omit<LibraryPromotion, 'id'>) => void;
}

export const PromoCellGroup: React.FC<PromoCellGroupProps> = ({
  chainId,
  rowId,
  month,
  field,
  value,
  status,
  entry,
  onUpdate,
  library,
  onApplyPromo,
  onAddToLibrary
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const getStatusClass = () => {
    switch (status) {
      case PromotionStatus.APPROVED: return 'bg-emerald-500/15 border-emerald-400';
      case PromotionStatus.WAITING: return 'bg-amber-400/15 border-amber-400';
      case PromotionStatus.DENIED: return 'bg-rose-500/15 border-rose-400';
      default: return 'bg-white border-slate-200';
    }
  };

  const getTextColor = () => {
    switch (status) {
      case PromotionStatus.APPROVED: return 'text-emerald-900';
      case PromotionStatus.WAITING: return 'text-amber-900';
      case PromotionStatus.DENIED: return 'text-rose-900';
      default: return 'text-slate-900';
    }
  };

  const handleStatusChange = (newStatus: PromotionStatus) => {
    onUpdate(chainId, rowId, month, 'status', newStatus);
    setShowOptions(false);
  };

  const handleBlur = () => {
    if (field === 'pkg' && value.trim().length > 2) {
      onAddToLibrary({
        name: value.trim(),
        pkg: value.trim(),
        cost: entry?.cost || '',
        srp: entry?.srp || ''
      });
    }
  };

  return (
    <td className={`p-0 border-r border-slate-300 relative group transition-all duration-150 ${getStatusClass()}`}>
      <div className="flex flex-col h-full min-h-[38px]">
        <div className="flex-1 flex items-center relative">
          <input 
            type="text" 
            value={value}
            onChange={(e) => onUpdate(chainId, rowId, month, field, e.target.value)}
            onFocus={() => setShowOptions(true)}
            onBlur={handleBlur}
            className={`w-full h-full p-1.5 bg-transparent outline-none text-[10px] font-black text-center uppercase tracking-tight placeholder-slate-200 ${getTextColor()}`}
            placeholder="..."
          />
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="p-1 opacity-0 group-hover:opacity-100 transition-opacity no-print absolute right-0 bg-white/80 rounded-l shadow-sm"
          >
            <ChevronDown className={`w-3 h-3 ${showOptions ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
          </button>
        </div>

        {showOptions && (
          <div className="absolute top-[100%] left-0 z-50 w-64 bg-white border border-slate-300 shadow-2xl rounded-lg p-3 mt-0.5 no-print animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/5">
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              <button onClick={() => handleStatusChange(PromotionStatus.APPROVED)} className="flex flex-col items-center gap-1 p-2 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors">
                <Check className="w-3.5 h-3.5" />
                <span className="text-[8px] font-black uppercase">Approv</span>
              </button>
              <button onClick={() => handleStatusChange(PromotionStatus.WAITING)} className="flex flex-col items-center gap-1 p-2 rounded bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-colors">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[8px] font-black uppercase">Wait</span>
              </button>
              <button onClick={() => handleStatusChange(PromotionStatus.DENIED)} className="flex flex-col items-center gap-1 p-2 rounded bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors">
                <X className="w-3.5 h-3.5" />
                <span className="text-[8px] font-black uppercase">No</span>
              </button>
            </div>

            {library.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 mb-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  <BookOpen className="w-3 h-3 text-blue-500" />
                  Product Catalog
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {library.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onApplyPromo(chainId, rowId, month, p);
                        setShowOptions(false);
                      }}
                      className="w-full text-left px-2 py-1.5 text-[9px] font-bold text-slate-700 hover:bg-blue-600 hover:text-white rounded transition-colors truncate"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </td>
  );
};
