
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Eye, Download, Search } from 'lucide-react';
import { generateInvoicePDF } from '../utils/pdfGenerator';

const SalesRegister: React.FC = () => {
  const { invoices } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = invoices.filter(inv => 
    inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sales Register</h1>
          <p className="text-slate-500">A detailed record of all transactions.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none w-64"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-slate-500 text-sm font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Invoice #</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{inv.invoiceNumber}</td>
                <td className="px-6 py-4 text-slate-700">{inv.customerName}</td>
                <td className="px-6 py-4 text-slate-500">{inv.date}</td>
                <td className="px-6 py-4 font-bold text-emerald-600">₹{inv.grandTotal.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => generateInvoicePDF(inv)} className="p-2 text-slate-400 hover:text-emerald-500 transition-colors">
                    <Download size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesRegister;
