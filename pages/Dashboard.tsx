
import React from 'react';
import { useData } from '../context/DataContext.tsx';
import { IndianRupee, Users, FileText, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { invoices, customers } = useData();

  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.grandTotal, 0);
  const pendingCount = invoices.filter(i => i.status === 'pending').length;

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: <IndianRupee className="text-emerald-500" />, color: 'bg-emerald-50' },
    { label: 'Total Invoices', value: invoices.length, icon: <FileText className="text-blue-500" />, color: 'bg-blue-50' },
    { label: 'Pending Payment', value: pendingCount, icon: <Clock className="text-amber-500" />, color: 'bg-amber-50' },
    { label: 'Active Customers', value: customers.length, icon: <Users className="text-indigo-500" />, color: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Overview of your business performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`${stat.color} p-4 rounded-xl`}>{stat.icon}</div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold mb-4">Recent Invoices</h2>
          <div className="space-y-4">
            {invoices.slice(0, 5).map((inv, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="font-bold text-slate-900">{inv.customerName}</p>
                  <p className="text-xs text-slate-500">{inv.invoiceNumber} • {inv.date}</p>
                </div>
                <p className="font-bold text-emerald-600">₹{inv.grandTotal.toLocaleString()}</p>
              </div>
            ))}
            {invoices.length === 0 && <p className="text-slate-400 text-sm">No recent invoices found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
