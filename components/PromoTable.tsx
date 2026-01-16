
import React from 'react';
import { ChainConfig, Month, PromoState, PromotionStatus, LibraryPromotion } from '../types';
import { PromoCellGroup } from './PromoCellGroup';
import { Plus, Trash2 } from 'lucide-react';

interface PromoTableProps {
  chains: ChainConfig[];
  months: Month[];
  data: PromoState;
  onUpdate: (chainId: string, rowId: string, month: string, field: string, value: string | PromotionStatus) => void;
  library: LibraryPromotion[];
  onApplyPromo: (chainId: string, rowId: string, month: string, promo: LibraryPromotion) => void;
  onAddToLibrary: (promo: Omit<LibraryPromotion, 'id'>) => void;
  onAddRow: (chainId: string) => void;
  onRemoveRow: (chainId: string, rowId: string) => void;
}

export const PromoTable: React.FC<PromoTableProps> = ({ 
  chains, 
  months, 
  data, 
  onUpdate,
  library,
  onApplyPromo,
  onAddToLibrary,
  onAddRow,
  onRemoveRow
}) => {
  return (
    <div className="overflow-x-auto print:overflow-visible">
      <table className="w-full border-collapse table-fixed min-w-[1500px] print:min-w-0 bg-white">
        <thead>
          <tr className="bg-slate-900 border-b border-slate-900">
            <th className="w-64 p-3 border-r border-slate-700 text-left font-black text-blue-400 uppercase text-[9px] tracking-[0.3em]">ENTITY</th>
            <th className="w-16 p-3 border-r border-slate-700 text-center font-black text-blue-400 uppercase text-[9px] tracking-[0.3em]">FIELD</th>
            {months.map(month => (
              <th key={month} className="p-3 border-r border-slate-700 text-center font-black text-white tracking-[0.2em] text-[10px] uppercase whitespace-nowrap">
                {month}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chains.map((chain) => {
            const rows = data[chain.id] || [];
            return rows.map((row, rowIdx) => (
              <React.Fragment key={row.id}>
                {/* PKG Row */}
                <tr className="border-b border-slate-300 group/row">
                  {rowIdx === 0 && (
                    <td rowSpan={rows.length * 4} className="p-4 border-r-2 border-slate-400 font-black text-slate-900 bg-slate-50 text-center align-middle relative group/client">
                      <div className="text-xl leading-none mb-6 tracking-tighter uppercase font-black text-slate-900 border-b-2 border-slate-300 pb-2 inline-block w-full">{chain.name}</div>
                      <div className="no-print">
                        <button 
                          onClick={() => onAddRow(chain.id)}
                          className="mx-auto flex items-center justify-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-md text-[8px] font-black hover:bg-blue-600 transition-all uppercase tracking-widest shadow-md active:scale-95"
                        >
                          <Plus className="w-3 h-3" />
                          Add Promo Row
                        </button>
                      </div>
                    </td>
                  )}
                  <td className="p-1 border-r border-slate-300 bg-slate-100 text-[9px] font-black text-slate-800 text-center uppercase tracking-tighter relative group/field">
                    PKG
                    {rows.length > 1 && (
                      <button 
                        onClick={() => onRemoveRow(chain.id, row.id)}
                        className="no-print absolute top-0.5 right-0.5 opacity-0 group-hover/field:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </td>
                  {months.map(month => (
                    <PromoCellGroup 
                      key={`${row.id}-${month}-pkg`}
                      chainId={chain.id}
                      rowId={row.id}
                      month={month}
                      field="pkg"
                      value={row.months[month]?.pkg || ''}
                      status={row.months[month]?.status || PromotionStatus.NONE}
                      onUpdate={onUpdate}
                      library={library}
                      onApplyPromo={onApplyPromo}
                      onAddToLibrary={onAddToLibrary}
                      entry={row.months[month]}
                    />
                  ))}
                </tr>
                
                {/* COST Row */}
                <tr className="border-b border-slate-200">
                  <td className="p-1 border-r border-slate-300 bg-white text-[9px] font-black text-slate-400 text-center uppercase tracking-tighter">COST</td>
                  {months.map(month => (
                    <td key={`${row.id}-${month}-cost`} className={`p-0 border-r border-slate-200 transition-colors ${getStatusBg(row.months[month]?.status)}`}>
                      <input 
                        type="text" 
                        value={row.months[month]?.cost || ''}
                        onChange={(e) => onUpdate(chain.id, row.id, month, 'cost', e.target.value)}
                        className="w-full h-full p-1.5 bg-transparent outline-none text-[10px] font-bold text-slate-800 text-center uppercase tracking-tight"
                        placeholder="-"
                      />
                    </td>
                  ))}
                </tr>

                {/* SRP Row */}
                <tr className="border-b border-slate-200">
                  <td className="p-1 border-r border-slate-300 bg-white text-[9px] font-black text-slate-400 text-center uppercase tracking-tighter">SRP</td>
                  {months.map(month => (
                    <td key={`${row.id}-${month}-srp`} className={`p-0 border-r border-slate-200 transition-colors ${getStatusBg(row.months[month]?.status)}`}>
                      <input 
                        type="text" 
                        value={row.months[month]?.srp || ''}
                        onChange={(e) => onUpdate(chain.id, row.id, month, 'srp', e.target.value)}
                        className="w-full h-full p-1.5 bg-transparent outline-none text-[10px] font-bold text-slate-800 text-center uppercase tracking-tight"
                        placeholder="-"
                      />
                    </td>
                  ))}
                </tr>

                {/* Detail Row */}
                <tr className={`border-b ${rowIdx === rows.length - 1 ? 'border-b-[12px] border-slate-200' : 'border-b border-slate-100'}`}>
                  <td className="p-1 border-r border-slate-300 bg-slate-50 text-[8px] font-black text-slate-400 text-center uppercase italic tracking-tighter">NOTES</td>
                  {months.map(month => (
                    <td key={`${row.id}-${month}-notes`} className="p-0 border-r border-slate-200 bg-slate-50/10">
                      <textarea 
                        value={row.months[month]?.notes || ''}
                        onChange={(e) => onUpdate(chain.id, row.id, month, 'notes', e.target.value)}
                        className="w-full h-full p-1.5 bg-transparent outline-none text-[9px] font-semibold text-slate-500 resize-none min-h-[32px] custom-scrollbar"
                        placeholder="..."
                      />
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
};

function getStatusBg(status?: PromotionStatus) {
  switch (status) {
    case PromotionStatus.APPROVED: return 'bg-emerald-500/5';
    case PromotionStatus.WAITING: return 'bg-amber-400/5';
    case PromotionStatus.DENIED: return 'bg-rose-500/5';
    default: return 'bg-white';
  }
}
