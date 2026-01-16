
import React, { useState } from 'react';
import { LibraryPromotion } from '../types';
import { Trash2, Plus, Tag, DollarSign, Archive } from 'lucide-react';

interface PromotionLibraryProps {
  library: LibraryPromotion[];
  onDelete: (id: string) => void;
  onAdd: (promo: Omit<LibraryPromotion, 'id'>) => void;
}

export const PromotionLibrary: React.FC<PromotionLibraryProps> = ({ library, onDelete, onAdd }) => {
  const [newPromo, setNewPromo] = useState<Omit<LibraryPromotion, 'id'>>({
    name: '',
    pkg: '',
    cost: '',
    srp: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPromo.name && newPromo.pkg) {
      onAdd(newPromo);
      setNewPromo({ name: '', pkg: '', cost: '', srp: '' });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Add New To Library */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Quick Add Template
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Friendly Name</label>
            <input 
              required
              className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="e.g. Summer Soda Promo"
              value={newPromo.name}
              onChange={e => setNewPromo(prev => ({...prev, name: e.target.value}))}
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Packaging (PKG)</label>
              <input 
                required
                className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="e.g. 1L CSD"
                value={newPromo.pkg}
                onChange={e => setNewPromo(prev => ({...prev, pkg: e.target.value}))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cost</label>
                <input 
                  className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="$0.00"
                  value={newPromo.cost}
                  onChange={e => setNewPromo(prev => ({...prev, cost: e.target.value}))}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">SRP</label>
                <input 
                  className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="$0.00"
                  value={newPromo.srp}
                  onChange={e => setNewPromo(prev => ({...prev, srp: e.target.value}))}
                />
              </div>
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Add to Library
          </button>
        </form>
      </div>

      {/* Library List */}
      <div className="lg:col-span-2">
        {library.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-12 text-slate-400 bg-slate-50">
            <Archive className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm font-medium">Your library is empty.</p>
            <p className="text-xs">Save promotions from the grid or add one here for quick reuse.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {library.map(promo => (
              <div key={promo.id} className="group relative bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all hover:border-blue-200">
                <button 
                  onClick={() => onDelete(promo.id)}
                  className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <h4 className="font-bold text-slate-800 pr-8 truncate mb-3">{promo.name}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Tag className="w-3 h-3" />
                    <span className="font-semibold text-slate-700">{promo.pkg}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <DollarSign className="w-3 h-3" />
                    <span>Cost: <span className="font-semibold text-slate-700">{promo.cost || 'N/A'}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <DollarSign className="w-3 h-3" />
                    <span>SRP: <span className="font-semibold text-slate-700">{promo.srp || 'N/A'}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
