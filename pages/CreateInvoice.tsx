
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext.tsx';
import { InvoiceItem, Invoice } from '../types.ts';
import { Plus, Trash2, Save, Eye } from 'lucide-react';
import { InvoicePreview } from '../components/InvoicePreview.tsx';
import { generateInvoicePDF } from '../utils/pdfGenerator.ts';

interface CreateInvoiceProps {
  onSave: () => void;
}

const CreateInvoice: React.FC<CreateInvoiceProps> = ({ onSave }) => {
  const { addInvoice, getNextInvoiceNumber } = useData();
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    gstin: '',
    address: '',
    invoiceNumber: getNextInvoiceNumber(),
    date: new Date().toISOString().split('T')[0],
    po: '',
    status: 'pending' as 'paid' | 'pending'
  });

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { id: '1', name: '', hsnCode: '', rate: 0, qty: 1, cgstPercent: 9, sgstPercent: 9, amount: 0, cgstAmount: 0, sgstAmount: 0, total: 0 }
  ]);

  const calculations = useMemo(() => {
    const subtotal = invoiceItems.reduce((acc, item) => acc + item.amount, 0);
    const cgst = invoiceItems.reduce((acc, item) => acc + item.cgstAmount, 0);
    const sgst = invoiceItems.reduce((acc, item) => acc + item.sgstAmount, 0);
    const total = subtotal + cgst + sgst;
    const grandTotal = Math.round(total);
    const roundOff = parseFloat((grandTotal - total).toFixed(2));
    
    return { subtotal, cgst, sgst, total, grandTotal, roundOff };
  }, [invoiceItems]);

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoiceItems(prev => prev.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };
        const rate = field === 'rate' ? Number(value) : item.rate;
        const qty = field === 'qty' ? Number(value) : item.qty;
        const cgstP = field === 'cgstPercent' ? Number(value) : item.cgstPercent;
        const sgstP = field === 'sgstPercent' ? Number(value) : item.sgstPercent;
        
        newItem.amount = rate * qty;
        newItem.cgstAmount = newItem.amount * (cgstP / 100);
        newItem.sgstAmount = newItem.amount * (sgstP / 100);
        newItem.total = newItem.amount + newItem.cgstAmount + newItem.sgstAmount;
        
        return newItem;
      }
      return item;
    }));
  };

  const addItem = () => {
    setInvoiceItems(prev => [...prev, { 
      id: Math.random().toString(), name: '', hsnCode: '', rate: 0, qty: 1, 
      cgstPercent: 9, sgstPercent: 9, amount: 0, cgstAmount: 0, sgstAmount: 0, total: 0 
    }]);
  };

  const handleSave = () => {
    const invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'> = {
      ...formData,
      items: invoiceItems,
      withoutGst: calculations.subtotal,
      cgstTotal: calculations.cgst,
      sgstTotal: calculations.sgst,
      gstAmount: calculations.cgst + calculations.sgst,
      roundOff: calculations.roundOff,
      grandTotal: calculations.grandTotal,
    };
    addInvoice(invoice);
    onSave();
  };

  const currentInvoiceData: Invoice = {
    id: 'preview',
    ...formData,
    items: invoiceItems,
    withoutGst: calculations.subtotal,
    cgstTotal: calculations.cgst,
    sgstTotal: calculations.sgst,
    gstAmount: calculations.cgst + calculations.sgst,
    roundOff: calculations.roundOff,
    grandTotal: calculations.grandTotal,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return (
    <div className="space-y-8 no-print">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Create New Invoice</h1>
          <p className="text-slate-500">Fill the details for S.K. Enterprise.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowPreview(!showPreview)} 
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all"
          >
            <Eye size={18} />
            {showPreview ? 'Edit Details' : 'Preview A4'}
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all"
          >
            <Save size={18} />
            Save Invoice
          </button>
        </div>
      </div>

      {!showPreview ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <h3 className="text-lg font-bold border-b pb-2">Client Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Customer Name</label>
                  <input 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-bold" 
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">GSTIN</label>
                  <input 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                    value={formData.gstin}
                    onChange={(e) => setFormData({...formData, gstin: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Address</label>
                <textarea 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-bold">Items Table</h3>
                <button onClick={addItem} className="text-emerald-600 font-bold text-sm flex items-center gap-1 hover:underline">
                  <Plus size={16} /> Add Row
                </button>
              </div>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-400 font-medium">
                    <th className="py-2 w-1/3">Description</th>
                    <th className="py-2">Rate</th>
                    <th className="py-2">Qty</th>
                    <th className="py-2">GST%</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoiceItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 pr-4">
                        <input 
                          className="w-full px-2 py-1 bg-slate-50 rounded" 
                          placeholder="Item name"
                          value={item.name}
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        />
                      </td>
                      <td className="py-3 pr-2">
                        <input 
                          className="w-16 px-2 py-1 bg-slate-50 rounded" 
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                        />
                      </td>
                      <td className="py-3 pr-2">
                        <input 
                          className="w-12 px-2 py-1 bg-slate-50 rounded" 
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                        />
                      </td>
                      <td className="py-3 pr-2">
                        <select 
                          className="px-2 py-1 bg-slate-50 rounded"
                          value={item.cgstPercent}
                          onChange={(e) => {
                            updateItem(item.id, 'cgstPercent', Number(e.target.value));
                            updateItem(item.id, 'sgstPercent', Number(e.target.value));
                          }}
                        >
                          <option value={9}>18%</option>
                          <option value={6}>12%</option>
                          <option value={2.5}>5%</option>
                          <option value={14}>28%</option>
                        </select>
                      </td>
                      <td className="py-3 text-right font-bold">₹{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <h3 className="text-lg font-bold border-b pb-2">Financials</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-bold">₹{calculations.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CGST</span>
                  <span className="font-bold">₹{calculations.cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">SGST</span>
                  <span className="font-bold">₹{calculations.sgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t text-lg">
                  <span className="font-black">Total</span>
                  <span className="font-black text-emerald-600">₹{calculations.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center bg-slate-100 p-8 rounded-3xl overflow-auto max-h-[85vh]">
          <div id="invoice-preview">
            <InvoicePreview invoice={currentInvoiceData} />
          </div>
          <button 
            onClick={() => generateInvoicePDF(currentInvoiceData)}
            className="mt-8 px-12 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-2xl hover:bg-black transition-all hover:scale-105 active:scale-95 no-print"
          >
            Download Official Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateInvoice;
