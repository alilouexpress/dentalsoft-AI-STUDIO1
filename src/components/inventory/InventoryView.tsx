import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Package, Plus, X, Search, AlertOctagon } from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { inventory, addInventoryItem, t } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'Produits' | 'Fournisseurs' | 'Alertes'>('Produits');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [sku, setSku] = useState('DENT-101');
  const [category, setCategory] = useState<'Anesthésie' | 'Composite' | 'Consommables'>('Composite');
  const [stockCurrent, setStockCurrent] = useState(10);
  const [stockMin, setStockMin] = useState(5);
  const [purchasePrice, setPurchasePrice] = useState(4500);
  const [supplier, setSupplier] = useState('DentalMarket DZ');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addInventoryItem({
      name,
      sku,
      category,
      stockCurrent,
      stockMin,
      stockMax: stockCurrent * 3,
      purchasePrice,
      sellingPrice: 0,
      supplier,
      expirationDate: '2028-12-31',
    });

    setIsModalOpen(false);
    setName('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('stock')}</h1>
          <p className="text-xs font-semibold text-slate-500">
            Gérer les produits, consommables et alertes de stock.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md shadow-sky-500/20 hover:from-sky-600 hover:to-sky-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un produit</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-[28px] border border-sky-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
          {(['Produits', 'Fournisseurs', 'Alertes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeSubTab === tab ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[28px] border border-sky-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">NOM</th>
                <th className="p-4">SKU</th>
                <th className="p-4">CATÉGORIE</th>
                <th className="p-4">STOCK</th>
                <th className="p-4">STOCK MIN</th>
                <th className="p-4">PRIX D'ACHAT</th>
                <th className="p-4">EXPIRATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-sky-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{item.name}</td>
                  <td className="p-4 text-slate-500">{item.sku}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 font-black">
                    <span
                      className={
                        item.stockCurrent <= item.stockMin
                          ? 'text-rose-600 font-black flex items-center gap-1'
                          : 'text-emerald-600'
                      }
                    >
                      {item.stockCurrent} {item.stockCurrent <= item.stockMin && <AlertOctagon className="w-3.5 h-3.5 inline" />}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{item.stockMin}</td>
                  <td className="p-4 font-bold text-slate-900">{item.purchasePrice} DA</td>
                  <td className="p-4 text-slate-500">{item.expirationDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Ajouter un produit</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom du produit *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Anesthésique Septodont"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                  >
                    <option value="Anesthésie">Anesthésie</option>
                    <option value="Composite">Composite</option>
                    <option value="Consommables">Consommables</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock initial</label>
                  <input
                    type="number"
                    value={stockCurrent}
                    onChange={(e) => setStockCurrent(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prix d'achat (DA)</label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-xl shadow-md shadow-sky-500/20 cursor-pointer transition-all"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
