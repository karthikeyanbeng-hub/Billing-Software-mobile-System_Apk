import React, { useState } from 'react';
import { BarChart3, Download, Calendar, DollarSign, ShoppingBag, FileText, ArrowDownToLine } from 'lucide-react';

const Reports = ({ transactions = [], products = [] }) => {
  const [reportType, setReportType] = useState('sales'); // sales, inventory
  const [timeFilter, setTimeFilter] = useState('All Time');

  const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalOrders = transactions.length;

  const productSales = {};
  transactions.forEach(t => {
    t.items.forEach(item => {
      if (!productSales[item.id]) {
        productSales[item.id] = { name: item.name, qty: 0, revenue: 0 };
      }
      productSales[item.id].qty += item.qty;
      productSales[item.id].revenue += (item.price * item.qty);
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue);

  const downloadReport = () => {
    if (transactions.length === 0) {
      alert("No data available to download.");
      return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,Invoice,Date,Customer,Amount,Payment Method\n";
    transactions.forEach(t => {
      const customer = `"${t.customerName || t.customerPhone}"`;
      csvContent += `${t.invoiceNo},${t.date},${customer},${t.total.toFixed(2)},${t.activePayment}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `full_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadProductReport = () => {
    if (topProducts.length === 0) {
      alert("No product data available to download.");
      return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,Rank,Product Name,Units Sold,Revenue\n";
    topProducts.forEach((p, idx) => {
      csvContent += `${idx + 1},"${p.name}",${p.qty},${p.revenue.toFixed(2)}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `product_sales_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Detailed Reports</h1>
          <p className="text-slate-400 text-sm mt-1">Comprehensive view of your business performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-surface border border-surface-hover text-sm font-medium text-slate-200 py-2.5 px-4 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>All Time</option>
          </select>
          <button onClick={downloadReport} className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 text-sm">
            <ArrowDownToLine size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface rounded-2xl p-6 shadow-sm border border-surface-hover flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Gross Revenue ({timeFilter})</p>
            <h3 className="text-3xl font-bold text-white">${totalSales.toFixed(2)}</h3>
          </div>
        </div>
        <div className="bg-surface rounded-2xl p-6 shadow-sm border border-surface-hover flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Total Transactions ({timeFilter})</p>
            <h3 className="text-3xl font-bold text-white">{totalOrders}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* High Sale Products Section */}
        <div className="bg-surface rounded-2xl shadow-sm border border-surface-hover overflow-hidden flex flex-col max-h-[500px]">
          <div className="p-5 border-b border-surface-hover flex items-center justify-between sticky top-0 bg-surface z-10">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag size={18} className="text-primary-500" /> High Sale Products
            </h2>
            <button 
              onClick={downloadProductReport} 
              className="text-slate-400 hover:text-primary-500 hover:bg-primary-500/10 p-1.5 rounded-lg transition-colors" 
              title="Download Product Report"
            >
              <Download size={18} />
            </button>
          </div>
          <div className="p-5 overflow-y-auto flex-1">
            <div className="space-y-4">
              {topProducts.length > 0 ? topProducts.map((prod, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold text-sm shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm line-clamp-1">{prod.name}</p>
                      <p className="text-xs text-slate-400">{prod.qty} Units Sold</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="font-bold text-emerald-600 text-sm">${prod.revenue.toFixed(2)}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center text-slate-400 text-sm py-6">
                  No product sales yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Complete Transaction Log */}
        <div className="bg-surface rounded-2xl shadow-sm border border-surface-hover overflow-hidden lg:col-span-2">
          <div className="p-5 border-b border-surface-hover flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText size={18} className="text-primary-500" /> Complete Transaction Log
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-hover text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-surface-hover">
                <th className="py-4 px-6">Invoice No.</th>
                <th className="py-4 px-6">Date & Time</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Payment Method</th>
                <th className="py-4 px-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {transactions.length > 0 ? transactions.map((row, i) => (
                <tr key={i} className="hover:bg-surface-hover transition-colors">
                  <td className="py-4 px-6 font-medium text-white">{row.invoiceNo}</td>
                  <td className="py-4 px-6 text-slate-400">{row.date}</td>
                  <td className="py-4 px-6 text-slate-200">{row.customerName || row.customerPhone}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-zinc-800 text-slate-200 rounded-md text-xs font-bold">
                      {row.activePayment}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-white">${row.total.toFixed(2)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-base font-medium">No report data generated yet</p>
                    <p className="text-sm mt-1">Process transactions in the POS to see report details here.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      </div>
    </div>
  );
};

export default Reports;
