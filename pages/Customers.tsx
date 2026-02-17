
import React from 'react';
import { useData } from '../context/DataContext';
import { Users, Plus } from 'lucide-react';

const Customers: React.FC = () => {
  const { customers } = useData();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-500">Manage your client database.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-black transition-all">
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-slate-100 p-4 rounded-xl text-slate-600">
                <Users size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{customer.name}</h3>
                <p className="text-xs text-slate-500 uppercase">{customer.gstin}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 italic line-clamp-2">{customer.address}</p>
            <div className="pt-4 border-t flex justify-between">
              <button className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase">View History</button>
              <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase">Edit Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customers;
