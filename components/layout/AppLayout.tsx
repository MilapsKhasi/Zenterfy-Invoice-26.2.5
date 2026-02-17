
import React, { ReactNode } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Package, 
  ListOrdered, 
  Receipt 
} from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, activePage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'create-invoice', label: 'Create Invoice', icon: <FileText size={20} /> },
    { id: 'sales-register', label: 'Sales Register', icon: <ListOrdered size={20} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
    { id: 'items', label: 'Items', icon: <Package size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white fixed h-full z-10 no-print">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Receipt className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">Zenterfy</span>
        </div>
        
        <nav className="mt-8 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activePage === item.id 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 ml-64 p-8 print:m-0 print:p-0">
        <div className="max-w-6xl mx-auto print:max-w-none">
          {children}
        </div>
      </main>
    </div>
  );
};
