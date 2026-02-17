
export interface Customer {
  id: string;
  name: string;
  gstin: string;
  address: string;
  createdAt: string;
}

export interface Item {
  id: string;
  name: string;
  hsnCode: string;
  rate: number;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  itemId?: string;
  name: string;
  hsnCode: string;
  rate: number;
  qty: number;
  cgstPercent: number;
  sgstPercent: number;
  amount: number;
  cgstAmount: number;
  sgstAmount: number;
  total: number;
}

export interface Invoice {
  id: string;
  customerId?: string;
  customerName: string;
  gstin: string;
  address: string;
  invoiceNumber: string;
  date: string;
  po: string;
  items: InvoiceItem[];
  withoutGst: number;
  cgstTotal: number;
  sgstTotal: number;
  gstAmount: number;
  roundOff: number;
  grandTotal: number;
  status: 'paid' | 'pending';
  createdAt: string;
  updatedAt: string;
}
