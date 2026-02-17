
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, Item, Invoice } from '../types';

interface DataContextType {
  customers: Customer[];
  items: Item[];
  invoices: Invoice[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  addItem: (item: Omit<Item, 'id' | 'createdAt'>) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  getNextInvoiceNumber: () => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Mock initial data
  useEffect(() => {
    setCustomers([
      { id: '1', name: 'ABC PHARMA', gstin: '24AAAAA0000A1Z5', address: 'JAMNAGAR, GUJARAT', createdAt: new Date().toISOString() }
    ]);
    setItems([
      { id: '1', name: 'BRASS BUSH', hsnCode: '8401', rate: 150, createdAt: new Date().toISOString() }
    ]);
  }, []);

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer = { ...customer, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const addItem = (item: Omit<Item, 'id' | 'createdAt'>) => {
    const newItem = { ...item, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
    setItems(prev => [...prev, newItem]);
  };

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInvoice = { 
      ...invoice, 
      id: Math.random().toString(36).substr(2, 9), 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setInvoices(prev => [newInvoice, ...prev]);
  };

  const getNextInvoiceNumber = () => {
    const count = invoices.length + 1;
    return `INV-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`;
  };

  return (
    <DataContext.Provider value={{ customers, items, invoices, addCustomer, addItem, addInvoice, getNextInvoiceNumber }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
