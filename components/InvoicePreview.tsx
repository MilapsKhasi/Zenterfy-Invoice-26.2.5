
import React from 'react';
import { Invoice } from '../types.ts';
import { format } from 'date-fns';
import { numberToWords } from '../utils/numberToWords.ts';

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

  return (
    <div 
      className="bg-white mx-auto text-black print:p-0 overflow-hidden shadow-2xl print:shadow-none"
      style={{ 
        width: '210mm', 
        height: '297mm',
        padding: '10mm 12mm',
        border: '1px solid #000',
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
        <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">S. K. ENTERPRISE</h1>
        <p className="text-[10px] font-bold uppercase tracking-tight mt-1">TRADING IN MILIGIAN SPARE & PARTS OR BRASS PARTS</p>
        <p className="text-[9px] leading-tight mt-1 max-w-[85%] mx-auto">
          SHOP NO 28, GOLDEN POINT, COMMERCIAL COMPLEX, NEAR SHIVOM CIRCLE, PHASE - III DARED, JAMNAGAR (GUJARAT) - 361 005
        </p>
      </div>

      {/* Title Bar */}
      <div className="text-center border-y-2 border-black py-1 mb-2 bg-gray-100">
        <h2 className="text-lg font-black uppercase tracking-[0.3em]">Tax - Invoice</h2>
      </div>

      {/* Client and Metadata */}
      <div className="grid grid-cols-2 border border-black text-[11px] mb-2">
        <div className="p-2 border-r border-black flex flex-col gap-1 min-h-[100px]">
          <div className="flex gap-2">
            <span className="font-bold min-w-[40px]">M/s :</span> 
            <span className="font-black text-[13px] uppercase flex-1">{invoice.customerName}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold min-w-[40px]">Add :</span> 
            <span className="leading-tight flex-1 uppercase font-semibold">{invoice.address || 'Jamnagar, Gujarat'}</span>
          </div>
          <div className="flex gap-2 mt-auto">
            <span className="font-bold min-w-[40px]">GST :</span> 
            <span className="font-black tracking-wider">{invoice.gstin || '-'}</span>
          </div>
        </div>
        <div className="p-2 flex flex-col gap-1.5">
          <div className="flex justify-between border-b border-gray-300 pb-0.5">
            <span className="font-bold">Invoice No:</span> 
            <span className="font-black text-[14px]">{invoice.invoiceNumber}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-0.5">
            <span className="font-bold">Date:</span> 
            <span className="font-bold">{format(new Date(invoice.date), 'dd/MM/yyyy')}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-0.5">
            <span className="font-bold">Order No:</span> 
            <span className="font-medium">{invoice.po || '-'}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-0.5">
            <span className="font-bold">Place of Supply:</span> 
            <span className="font-black">GUJARAT (24)</span>
          </div>
        </div>
      </div>

      {/* Items Table - Robust Fixed Layout */}
      <div className="border border-black overflow-hidden">
        <table className="w-full text-[10px] border-collapse table-fixed">
          <thead className="bg-gray-100 font-bold border-b border-black">
            <tr>
              <th className="border-r border-black w-[5%] py-2" rowSpan={2}>Sr.</th>
              <th className="border-r border-black w-[30%] py-2 text-left px-2" rowSpan={2}>Description of Goods</th>
              <th className="border-r border-black w-[10%] py-2" rowSpan={2}>HSN</th>
              <th className="border-r border-black w-[6%] py-2" rowSpan={2}>QTY</th>
              <th className="border-r border-black w-[10%] py-2" rowSpan={2}>RATE</th>
              <th className="border-r border-black w-[12%] py-2" rowSpan={2}>AMOUNT</th>
              <th className="border-r border-black py-1 text-center" colSpan={2}>CGST</th>
              <th className="border-r border-black py-1 text-center" colSpan={2}>SGST</th>
              <th className="w-[12%] py-2" rowSpan={2}>TOTAL</th>
            </tr>
            <tr className="border-t border-black text-[8px]">
              <th className="border-r border-black w-[3%] py-1">%</th>
              <th className="border-r border-black w-[6%] py-1">AMT</th>
              <th className="border-r border-black w-[3%] py-1">%</th>
              <th className="border-r border-black w-[6%] py-1">AMT</th>
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
                <td className="border-r border-black text-right px-1 py-1 font-medium">{formatNumber(item.amount)}</td>
                <td className="border-r border-black text-center py-1 text-[9px]">{item.cgstPercent}</td>
                <td className="border-r border-black text-right px-1 py-1">{formatNumber(item.cgstAmount)}</td>
                <td className="border-r border-black text-center py-1 text-[9px]">{item.sgstPercent}</td>
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
            <tr className="bg-gray-50 font-black border-t-2 border-black h-10 text-[11px]">
              <td className="border-r border-black text-center uppercase" colSpan={5}>GRAND TOTAL ITEMS VALUE</td>
              <td className="border-r border-black text-right px-1">{formatNumber(totals.amount)}</td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black text-right px-1">{formatNumber(totals.cgstAmount)}</td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black text-right px-1">{formatNumber(totals.sgstAmount)}</td>
              <td className="text-right px-1 underline decoration-double text-[12px]">{formatNumber(totals.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Calculation Section */}
      <div className="grid grid-cols-2 border-x border-b border-black text-[10px]">
        <div className="p-3 border-r border-black space-y-4 flex flex-col">
          <div className="flex-1">
            <p className="font-bold underline italic mb-1 text-[11px]">Amount Chargeable (In words):</p>
            <p className="font-black uppercase leading-tight bg-gray-50 p-3 border border-black rounded-lg text-[12px]">
              {numberToWords(invoice.grandTotal)}
            </p>
          </div>
          <div className="bg-slate-50 p-2 border border-dashed border-slate-400 rounded">
            <p className="font-bold underline uppercase text-[10px] mb-2">Bank Details:</p>
            <div className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1">
              <span className="font-bold text-gray-600">Bank Name:</span> <span className="font-bold">KOTAK MAHINDRA BANK</span>
              <span className="font-bold text-gray-600">A/c No:</span> <span className="font-black text-sm">4711625484</span>
              <span className="font-bold text-gray-600">IFSC:</span> <span className="font-black">KKBK0002936</span>
              <span className="font-bold text-gray-600">Branch:</span> <span className="font-medium">PHASE-III, JAMNAGAR</span>
            </div>
          </div>
        </div>
        <div className="p-0">
          <table className="w-full border-collapse table-fixed">
            <tbody className="font-bold text-[11px]">
              <tr className="border-b border-black">
                <td className="py-2.5 px-4 border-r border-black w-2/3">Taxable Amount</td>
                <td className="py-2.5 px-4 text-right w-1/3 font-black">{formatNumber(totals.amount)}</td>
              </tr>
              <tr className="border-b border-black">
                <td className="py-2 px-4 border-r border-black italic text-[10px]">Add: Central Tax (CGST)</td>
                <td className="py-2 px-4 text-right">{formatNumber(totals.cgstAmount)}</td>
              </tr>
              <tr className="border-b border-black">
                <td className="py-2 px-4 border-r border-black italic text-[10px]">Add: State Tax (SGST)</td>
                <td className="py-2 px-4 text-right">{formatNumber(totals.sgstAmount)}</td>
              </tr>
              <tr className="border-b border-black">
                <td className="py-2 px-4 border-r border-black italic text-[10px]">Round Off (+/-)</td>
                <td className="py-2 px-4 text-right">{invoice.roundOff > 0 ? '+' : ''}{formatNumber(invoice.roundOff)}</td>
              </tr>
              <tr className="bg-black text-white h-16">
                <td className="px-4 uppercase font-black tracking-widest text-[13px]">Grand Total</td>
                <td className="px-4 text-right text-2xl font-black">{formatNumber(invoice.grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Terms and Signature */}
      <div className="grid grid-cols-[1.4fr_1fr] gap-6 mt-4">
        <div className="text-[10px] leading-relaxed">
          <p className="font-black uppercase underline mb-1 text-[11px]">Terms & Conditions:</p>
          <ol className="list-decimal list-inside space-y-1 text-gray-800 font-medium">
            <li>Goods once sold will not be taken back.</li>
            <li>Interest @ 12% will be charged if not paid within 7 days.</li>
            <li>No complaint will be entertained after 2 days of delivery.</li>
            <li>Subject to <span className="font-bold">JAMNAGAR</span> Jurisdiction only.</li>
          </ol>
        </div>
        <div className="text-right flex flex-col justify-between items-end pr-2">
          <div className="text-center">
            <p className="font-black text-xs italic uppercase mb-1">For, S. K. ENTERPRISE</p>
            <div className="w-[200px] h-[70px] flex items-center justify-center italic text-gray-300 text-[10px]">
              (Place Stamp/Sign Here)
            </div>
            <div className="w-[220px] border-t-2 border-black pt-1 text-center font-black uppercase text-[10px] tracking-widest">
              Authorised Signature
            </div>
          </div>
        </div>
      </div>

      {/* Print Footer */}
      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-end text-[8px] italic text-gray-400">
        <div>Zenterfy Invoice System v2.1</div>
        <div className="text-center font-bold text-gray-500 uppercase">Computer Generated - No Signature Required</div>
        <div>Page 1 of 1</div>
      </div>
    </div>
  );
};
