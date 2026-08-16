import React, { useState } from 'react';
import { TrendingUp, Users, ShoppingBag, AlertTriangle, ArrowUpRight, DollarSign, Download, MoreHorizontal, Edit2, EyeOff, Trash2 } from 'lucide-react';

const Dashboard = ({ transactions = [], products = [] }) => {
  const [timeFilter, setTimeFilter] = useState('Today');
  const [hiddenCards, setHiddenCards] = useState([]);
  const [activeCardMenu, setActiveCardMenu] = useState(null);

  // Filter transactions based on timeFilter (simulation logic)
  const filteredTransactions = transactions; // In a real app, filter by Date based on timeFilter

  // Calculate live stats
  const totalSales = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalOrders = filteredTransactions.length;
  const lowStockItems = products.filter(p => p.stock <= 10);
  const lowStockCount = lowStockItems.length;

  // Calculate top selling products
  const productSales = {};
  filteredTransactions.forEach(t => {
    t.items.forEach(item => {
      if (!productSales[item.id]) {
        productSales[item.id] = { name: item.name, qty: 0, revenue: 0 };
      }
      productSales[item.id].qty += item.qty;
      productSales[item.id].revenue += (item.price * item.qty);
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const downloadReport = () => {
    if (filteredTransactions.length === 0) {
      alert("No sales data available to download.");
      return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,Invoice,Date,Customer,Amount,Payment Method\n";
    // Sort by highest sales for the report
    const sortedTrans = [...filteredTransactions].sort((a, b) => b.total - a.total);
    
    sortedTrans.forEach(t => {
      // Escape commas in customer names
      const customer = `"${t.customerName || t.customerPhone}"`;
      csvContent += `${t.invoiceNo},${t.date},${customer},${t.total.toFixed(2)},${t.activePayment}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `high_sales_report_${timeFilter.toLowerCase().replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Fallback to static numbers if no live data yet
  const displaySales = totalSales > 0 ? `$${totalSales.toFixed(2)}` : "$0.00";
  const displayOrders = totalOrders > 0 ? totalOrders : "0";

  const stats = [
    { title: "Today's Sales", value: displaySales, icon: <DollarSign size={20} />, trend: "+14%", color: "bg-blue-500/100" },
    { title: "Total Orders", value: displayOrders, icon: <ShoppingBag size={20} />, trend: "+5%", color: "bg-purple-500" },
    { title: "Low Stock Items", value: lowStockCount, icon: <AlertTriangle size={20} />, trend: "-4", color: "bg-rose-500", negative: true },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-fade-in">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time metrics tracking your active POS session.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 mr-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-semibold text-emerald-600">Live</span>
          </div>
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-surface border border-surface-hover text-sm font-medium text-slate-200 py-2 px-3 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
          <button 
            onClick={downloadReport}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors"
          >
            <Download size={16} /> Download Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, idx) => !hiddenCards.includes(idx) && (
          <div key={idx} className="bg-surface rounded-2xl p-4 md:p-5 shadow-sm border border-surface-hover hover:shadow-md transition-shadow relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${stat.color} bg-opacity-90`}>
                {stat.icon}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
                  stat.negative ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50'
                }`}>
                  {stat.trend} <TrendingUp size={12} className={stat.negative ? 'rotate-180' : ''} />
                </span>
                
                {/* Card Operations Menu Toggle */}
                <button 
                  onClick={() => setActiveCardMenu(activeCardMenu === idx ? null : idx)}
                  className="p-1 text-slate-400 hover:text-slate-300 hover:bg-surface-hover rounded-md transition-colors"
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
            
            {/* Card Operations Dropdown */}
            {activeCardMenu === idx && (
              <div className="absolute right-4 top-12 w-36 bg-surface rounded-xl shadow-lg border border-surface-hover py-2 z-10 animate-fade-in">
                <button onClick={() => { alert("Edit Card Config"); setActiveCardMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-surface-hover flex items-center gap-2">
                  <Edit2 size={14} /> Edit
                </button>
                <button onClick={() => { setHiddenCards([...hiddenCards, idx]); setActiveCardMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-surface-hover flex items-center gap-2">
                  <EyeOff size={14} /> Hide
                </button>
                <button onClick={() => { setHiddenCards([...hiddenCards, idx]); setActiveCardMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}

            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-surface rounded-2xl p-5 shadow-sm border border-surface-hover">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Live Transactions</h2>
            <button onClick={() => alert("Navigating to full Reports...")} className="text-sm text-primary-500 font-semibold hover:text-primary-300 flex items-center">
              View All <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-surface-hover">
                  <th className="pb-3 pl-2">Invoice</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredTransactions.length > 0 ? filteredTransactions.slice(0, 5).map((row, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-surface-hover transition-colors animate-fade-in">
                    <td className="py-3 pl-2 font-medium text-slate-200">{row.invoiceNo}</td>
                    <td className="py-3 text-slate-300">{row.customerName || row.customerPhone}</td>
                    <td className="py-3 font-semibold text-white">${row.total.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600`}>
                        Completed
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-slate-400 text-sm">
                      No live transactions yet. Make a sale in the POS!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Top Selling Products */}
          <div className="bg-surface rounded-2xl p-5 shadow-sm border border-surface-hover">
            <h2 className="text-lg font-bold text-white mb-6">High Sale Products</h2>
            <div className="space-y-4">
              {topProducts.length > 0 ? topProducts.map((prod, idx) => (
                <div key={idx} className="flex items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold text-sm">
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm line-clamp-1">{prod.name}</p>
                      <p className="text-xs text-slate-400">{prod.qty} Units Sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white text-sm">${prod.revenue.toFixed(2)}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center text-slate-400 text-sm py-6">
                  No product data yet.
                </div>
              )}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-surface rounded-2xl p-5 shadow-sm border border-surface-hover">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <AlertTriangle size={18} className="text-rose-500" /> Low Stock Alerts
            </h2>
            <div className="space-y-4">
              {lowStockItems.length > 0 ? lowStockItems.slice(0, 5).map((prod, idx) => (
                <div key={idx} className="flex items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center text-lg shrink-0">
                      {prod.img}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-sm truncate">{prod.name}</p>
                      <p className="text-xs text-slate-400">{prod.category}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="whitespace-nowrap px-2.5 py-1 bg-rose-500/10 text-rose-400 font-bold text-xs rounded-md border border-rose-500/20">
                      {prod.stock} Left
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center text-slate-400 text-sm py-6">
                  All items are well stocked!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
