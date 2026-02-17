
import React from 'react';
import { useData } from '../context/DataContext';
import { Package, Plus } from 'lucide-react';

const Items: React.FC = () => {
  const { items } = useData();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Items Catalog</h1>
          <p className="text-slate-500">Manage products and pricing.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-black transition-all">
          <Plus size={18} />
          Add Item
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-slate-500 text-sm font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4">HSN Code</th>
              <th className="px-6 py-4">Default Rate</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                <td className="px-6 py-4 text-slate-500">{item.hsnCode}</td>
                <td className="px-6 py-4 font-bold text-slate-900">₹{item.rate.toLocaleString()}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="text-xs font-bold text-emerald-600 hover:underline uppercase">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Items;
