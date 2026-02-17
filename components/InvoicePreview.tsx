
import React from 'react';
import { Invoice } from '../types';
import { format } from 'date-fns';
import { numberToWords } from '../utils/numberToWords';

interface InvoicePreviewProps {
  invoice: Invoice;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const totals = {
    amount: invoice.items.reduce((sum, item) => sum + item.amount, 0),
    cgstAmount: invoice.items.reduce((sum, item) => sum + item.cgstAmount, 0),
    sgstAmount: invoice.items.reduce((sum, item) => sum + item.sgstAmount, 0),
    total: invoice.items.reduce((sum, item) => sum + item.total, 0),
  };

  // Fixed padding and dimensions for A4 stability
  return (
    <div 
      className="bg-white mx-auto text-black print:p-0 overflow-hidden shadow-2xl print:shadow-none"
      style={{ 
        width: '210mm', 
        height: '297mm',
        padding: '10mm 12mm',
        border: '1px solid #e2e8f0',
        boxSizing: 'border-box'
      }}
    >
      {/* Header Info */}
      <div className="flex justify-between items-start text-[10px] font-bold mb-1">
        <div>GSTIN: <span className="text-[11px]">24CMAPK3117Q1ZZ</span></div>
        <div className="text-right">Mobile: <span className="text-[11px]">7990713846</span></div>
      </div>

      {/* Main Identity */}
      <div className="text-center border-b-2 border-black pb-2 mb-2">
        <h1 className="text-4xl font-black tracking-tighter uppercase">S. K. ENTERPRISE</h1>
        <p className="text-[10px] font-bold uppercase tracking-tight">TRADING IN MILIGIAN SPARE & PARTS OR BRASS PARTS</p>
        <p className="text-[9px] leading-tight mt-1 max-w-[80%] mx-auto">
          SHOP NO 28, GOLDEN POINT, COMMERCIAL COMPLEX, NEAR SHIVOM CIRCLE, PHASE - III DARED, JAMNAGAR (GUJARAT) - 361 005
        </p>
      </div>

      {/* Title Bar */}
      <div className="text-center border-y-2 border-black py-1 mb-2 bg-gray-50">
        <h2 className="text-lg font-black uppercase tracking-[0.2em]">Tax - Invoice</h2>
      </div>

      {/* Client and Metadata */}
      <div className="grid grid-cols-2 border border-black text-[11px] mb-2">
        <div className="p-2 border-r border-black flex flex-col gap-1 min-h-[90px]">
          <div className="flex gap-2">
            <span className="font-bold min-w-[35px]">M/s :</span> 
            <span className="font-black text-sm uppercase">{invoice.customerName}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold min-w-[35px]">Add :</span> 
            <span className="leading-tight flex-1 uppercase">{invoice.address || 'Jamnagar, Gujarat'}</span>
          </div>
          <div className="flex gap-2 mt-auto">
            <span className="font-bold min-w-[35px]">GST :</span> 
            <span className="font-bold">{invoice.gstin || '-'}</span>
          </div>
        </div>
        <div className="p-2 flex flex-col gap-1">
          <div className="flex justify-between border-b border-gray-200 pb-0.5">
            <span className="font-bold">Invoice No:</span> 
            <span className="font-black text-[13px]">{invoice.invoiceNumber}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-0.5">
            <span className="font-bold">Date:</span> 
            <span className="font-bold">{format(new Date(invoice.date), 'dd/MM/yyyy')}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-0.5">
            <span className="font-bold">Order No:</span> 
            <span>{invoice.po || '-'}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-0.5">
            <span className="font-bold">Place of Supply:</span> 
            <span className="font-bold">GUJARAT (24)</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="border border-black">
        <table className="w-full text-[10px] border-collapse table-fixed">
          <thead className="bg-gray-100 font-bold border-b border-black">
            <tr>
              <th className="border-r border-black w-[4%] py-2" rowSpan={2}>Sr.</th>
              <th className="border-r border-black w-[35%] py-2 text-left px-2" rowSpan={2}>Description of Goods</th>
              <th className="border-r border-black w-[10%] py-2" rowSpan={2}>HSN</th>
              <th className="border-r border-black w-[6%] py-2" rowSpan={2}>QTY</th>
              <th className="border-r border-black w-[10%] py-2" rowSpan={2}>RATE</th>
              <th className="border-r border-black w-[12%] py-2" rowSpan={2}>AMOUNT</th>
              <th className="border-r border-black py-1 text-center" colSpan={2}>CGST</th>
              <th className="border-r border-black py-1 text-center" colSpan={2}>SGST</th>
              <th className="w-[12%] py-2" rowSpan={2}>TOTAL</th>
            </tr>
            <tr className="border-t border-black text-[8px]">
              <th className="border-r border-black w-[4%] py-0.5">%</th>
              <th className="border-r border-black w-[7%] py-0.5">AMT</th>
              <th className="border-r border-black w-[4%] py-0.5">%</th>
              <th className="border-r border-black w-[7%] py-0.5">AMT</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={item.id} className="border-b border-black align-top h-7">
                <td className="border-r border-black text-center py-1">{index + 1}</td>
                <td className="border-r border-black px-2 py-1 font-bold uppercase truncate">{item.name}</td>
                <td className="border-r border-black text-center py-1">{item.hsnCode}</td>
                <td className="border-r border-black text-center py-1 font-bold">{item.qty}</td>
                <td className="border-r border-black text-right px-1 py-1">{formatNumber(item.rate)}</td>
                <td className="border-r border-black text-right px-1 py-1">{formatNumber(item.amount)}</td>
                <td className="border-r border-black text-center py-1">{item.cgstPercent}</td>
                <td className="border-r border-black text-right px-1 py-1">{formatNumber(item.cgstAmount)}</td>
                <td className="border-r border-black text-center py-1">{item.sgstPercent}</td>
                <td className="border-r border-black text-right px-1 py-1">{formatNumber(item.sgstAmount)}</td>
                <td className="text-right px-1 py-1 font-black">{formatNumber(item.total)}</td>
              </tr>
            ))}
            {/* Fill empty space */}
            {Array.from({ length: Math.max(0, 15 - invoice.items.length) }).map((_, i) => (
              <tr key={`empty-${i}`} className="border-b border-black h-7">
                <td className="border-r border-black"></td><td className="border-r border-black"></td>
                <td className="border-r border-black"></td><td className="border-r border-black"></td>
                <td className="border-r border-black"></td><td className="border-r border-black"></td>
                <td className="border-r border-black"></td><td className="border-r border-black"></td>
                <td className="border-r border-black"></td><td className="border-r border-black"></td>
                <td></td>
              </tr>
            ))}
            {/* Total Row */}
            <tr className="bg-gray-50 font-black border-t border-black h-8 text-[11px]">
              <td className="border-r border-black text-center" colSpan={5}>GRAND TOTAL ITEMS VALUE</td>
              <td className="border-r border-black text-right px-1">{formatNumber(totals.amount)}</td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black text-right px-1">{formatNumber(totals.cgstAmount)}</td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black text-right px-1">{formatNumber(totals.sgstAmount)}</td>
              <td className="text-right px-1 underline decoration-double">{formatNumber(totals.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Calculation Section */}
      <div className="grid grid-cols-2 border-x border-b border-black text-[10px]">
        <div className="p-2 border-r border-black space-y-4 flex flex-col">
          <div className="flex-1">
            <p className="font-bold underline italic mb-1">Amount Chargeable (In words):</p>
            <p className="font-black uppercase leading-tight bg-gray-50 p-2 border border-black rounded">
              {numberToWords(invoice.grandTotal)}
            </p>
          </div>
          <div>
            <p className="font-bold underline uppercase text-[9px] mb-1">Bank Details:</p>
            <div className="grid grid-cols-[60px_1fr] gap-x-2 gap-y-0.5">
              <span className="font-bold">Bank Name:</span> <span>KOTAK MAHINDRA BANK</span>
              <span className="font-bold">A/c No:</span> <span className="font-black text-sm">4711625484</span>
              <span className="font-bold">IFSC:</span> <span className="font-bold">KKBK0002936</span>
              <span className="font-bold">Branch:</span> <span>PHASE-III, JAMNAGAR</span>
            </div>
          </div>
        </div>
        <div className="p-0">
          <table className="w-full border-collapse">
            <tbody className="font-bold text-[11px]">
              <tr className="border-b border-black">
                <td className="py-1.5 px-3 border-r border-black">Taxable Amount</td>
                <td className="py-1.5 px-3 text-right">{formatNumber(totals.amount)}</td>
              </tr>
              <tr className="border-b border-black">
                <td className="py-1.5 px-3 border-r border-black italic">Add: Central Tax (CGST)</td>
                <td className="py-1.5 px-3 text-right">{formatNumber(totals.cgstAmount)}</td>
              </tr>
              <tr className="border-b border-black">
                <td className="py-1.5 px-3 border-r border-black italic">Add: State Tax (SGST)</td>
                <td className="py-1.5 px-3 text-right">{formatNumber(totals.sgstAmount)}</td>
              </tr>
              {invoice.roundOff !== 0 && (
                <tr className="border-b border-black">
                  <td className="py-1.5 px-3 border-r border-black italic">Round Off (+/-)</td>
                  <td className="py-1.5 px-3 text-right">{invoice.roundOff > 0 ? '+' : ''}{formatNumber(invoice.roundOff)}</td>
                </tr>
              )}
              <tr className="bg-black text-white h-12">
                <td className="px-3 uppercase font-black tracking-widest">Grand Total</td>
                <td className="px-3 text-right text-xl font-black">{formatCurrency(invoice.grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Terms and Signature */}
      <div className="grid grid-cols-[1.5fr_1fr] gap-4 mt-4">
        <div className="text-[9px] leading-relaxed">
          <p className="font-bold uppercase underline mb-1">Terms & Conditions:</p>
          <ol className="list-decimal list-inside space-y-0.5 text-gray-700">
            <li>Goods are dispatched on buyer's risk.</li>
            <li>Interest @ 12% will be charged if not paid within 7 days.</li>
            <li>No complaint will be entertained after 2 days of delivery.</li>
            <li>Subject to <span className="font-bold">JAMNAGAR</span> Jurisdiction only.</li>
          </ol>
        </div>
        <div className="text-right flex flex-col justify-between items-end">
          <p className="font-black text-xs italic uppercase">For, S. K. ENTERPRISE</p>
          <div className="w-[180px] border-t border-black mt-16 pt-1 text-center font-bold uppercase text-[9px] tracking-widest">
            Authorised Signature
          </div>
        </div>
      </div>

      {/* Print instructions hidden on screen */}
      <div className="hidden print:block text-[8px] mt-2 border-t pt-1 italic text-center text-gray-400">
        Computer Generated Invoice - No signature required unless specified.
      </div>
    </div>
  );
};
