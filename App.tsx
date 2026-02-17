
import React, { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import CreateInvoice from './pages/CreateInvoice.tsx';
import SalesRegister from './pages/SalesRegister.tsx';
import Customers from './pages/Customers.tsx';
import Items from './pages/Items.tsx';
import { DataProvider } from './context/DataContext.tsx';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'create-invoice': return <CreateInvoice onSave={() => setCurrentPage('sales-register')} />;
      case 'sales-register': return <SalesRegister />;
      case 'customers': return <Customers />;
      case 'items': return <Items />;
      default: return <Dashboard />;
    }
  };

  return (
    <DataProvider>
      <AppLayout activePage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </AppLayout>
    </DataProvider>
  );
};

export default App;
