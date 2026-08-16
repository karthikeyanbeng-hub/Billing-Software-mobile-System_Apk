import React from 'react';
import { UserPlus, Search, Mail, Phone, Award, Star } from 'lucide-react';

const Customers = ({ transactions = [] }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const customerMap = {};
  transactions.forEach(t => {
    if (!t.customerPhone) return;
    if (!customerMap[t.customerPhone]) {
      customerMap[t.customerPhone] = {
        name: t.customerName || 'Unknown',
        phone: t.customerPhone,
        email: "Not provided",
        totalSpent: 0,
        orders: 0
      };
    }
    customerMap[t.customerPhone].totalSpent += t.total;
    customerMap[t.customerPhone].orders += 1;
  });

  const liveCustomers = Object.values(customerMap).map((c, index) => {
    let tier = 'Member';
    if (c.totalSpent >= 1000) tier = 'Platinum';
    else if (c.totalSpent >= 500) tier = 'Gold';
    else if (c.totalSpent >= 100) tier = 'Silver';

    return {
      ...c,
      id: index + 1,
      tier,
      points: Math.floor(c.totalSpent * 0.5) // 0.5 points per dollar
    };
  }).sort((a, b) => b.totalSpent - a.totalSpent);

  const filteredCustomers = liveCustomers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery)
  );

  const activeLoyaltyMembers = liveCustomers.filter(c => c.tier !== 'Member').length;
  const loyaltyPercentage = liveCustomers.length > 0 ? Math.round((activeLoyaltyMembers / liveCustomers.length) * 100) : 0;

  const getTierColor = (tier) => {
    switch(tier) {
      case 'Platinum': return 'bg-slate-800 text-slate-100';
      case 'Gold': return 'bg-amber-100 text-amber-700';
      case 'Silver': return 'bg-slate-200 text-slate-200';
      default: return 'bg-blue-500/10 text-blue-400';
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Customer CRM</h1>
          <p className="text-slate-400 text-sm mt-1">Manage loyalty programs and customer relationships.</p>
        </div>
        <button onClick={() => alert("Opening New Customer Registration Modal...")} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm transition-colors flex items-center justify-center gap-2">
          <UserPlus size={18} />
          <span>New Customer</span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white/80">Total Customers</h3>
            <UsersIcon />
          </div>
          <p className="text-3xl font-bold">{liveCustomers.length}</p>
          <p className="text-sm mt-2 text-white/70">From live POS transactions</p>
        </div>
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white/80">Active Loyalty Members</h3>
            <Award size={24} className="text-white/50" />
          </div>
          <p className="text-3xl font-bold">{activeLoyaltyMembers}</p>
          <p className="text-sm mt-2 text-white/70">{loyaltyPercentage}% of total base</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl shadow-sm border border-surface-hover overflow-hidden mt-6">
        <div className="p-4 border-b border-surface-hover flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search customers by name or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-surface-hover rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-hover text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-surface-hover">
                <th className="py-4 px-6">Customer Info</th>
                <th className="py-4 px-6">Contact</th>
                <th className="py-4 px-6">Total Spent</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {filteredCustomers.length > 0 ? filteredCustomers.map((cust, i) => (
                <tr key={i} className="hover:bg-surface-hover/50 transition-colors cursor-pointer">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-300 flex items-center justify-center font-bold uppercase">
                        {cust.name.charAt(0)}
                      </div>
                      <p className="font-bold text-white">{cust.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-slate-300 flex flex-col gap-1">
                      <span className="flex items-center gap-1.5 text-xs"><Phone size={12}/> {cust.phone}</span>
                      <span className="flex items-center gap-1.5 text-xs"><Mail size={12}/> {cust.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-white">${cust.totalSpent.toFixed(2)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <UsersIcon className="mx-auto mb-4 opacity-20" />
                    <p className="text-base font-medium">No customers found</p>
                    <p className="text-sm mt-1">Process a sale in the POS with a customer phone number to see them here.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

// Extracted just to keep imports clean
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;

export default Customers;
