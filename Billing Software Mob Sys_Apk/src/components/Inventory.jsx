import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, AlertCircle, X, Package as BoxIcon, ScanLine, Printer } from 'lucide-react';
import Barcode from 'react-barcode';

const Inventory = ({ products = [], onAddProduct, onUpdateProduct, onDeleteProduct }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', category: 'Electronics', price: '', stock: '' });
  const [printBarcodeProduct, setPrintBarcodeProduct] = useState(null);

  const openAddModal = () => {
    setEditingId(null);
    setNewProduct({ name: '', sku: '', category: 'Electronics', price: '', stock: '' });
    setShowAddModal(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    
    const finalSku = newProduct.sku || `PRD-${Math.floor(Math.random() * 10000)}`;

    if (editingId) {
      if (onUpdateProduct) {
        onUpdateProduct(editingId, {
          ...newProduct,
          sku: finalSku,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock) || 0
        });
      }
    } else {
      if (onAddProduct) {
        onAddProduct({
          ...newProduct,
          sku: finalSku,
          id: Date.now(),
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock) || 0,
          img: "📦"
        });
      }
    }
    setShowAddModal(false);
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setNewProduct({ ...product });
    setShowAddModal(true);
  };

  const handleDeleteClick = (product) => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      if (onDeleteProduct) {
        onDeleteProduct(product.id);
      }
    }
  };
  // Dynamically calculate status based on stock
  const displayProducts = products.map(p => ({
    ...p,
    status: p.stock === 0 ? 'Out of Stock' : (p.stock <= 10 ? 'Low Stock' : 'In Stock')
  }));

  const getStatusColor = (status) => {
    switch(status) {
      case 'In Stock': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Low Stock': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Out of Stock': return 'text-rose-700 bg-rose-50 border-rose-200';
      default: return 'text-slate-200 bg-surface-hover border-surface-hover';
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
          <p className="text-slate-400 text-sm mt-1">Manage products, categories, and stock levels.</p>
        </div>
        <button onClick={openAddModal} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm transition-colors flex items-center justify-center gap-2">
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-surface p-4 rounded-2xl shadow-sm border border-surface-hover flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by product name, SKU, or category..." 
            className="w-full pl-10 pr-4 py-2 border border-surface-hover rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm"
          />
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-2 border border-surface-hover rounded-xl text-sm font-medium text-slate-200 bg-surface outline-none focus:ring-2 focus:ring-primary-500">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Cosmetics</option>
          </select>
          <button onClick={() => alert("Opening Advanced Filters...")} className="px-4 py-2 border border-surface-hover rounded-xl text-sm font-medium text-slate-200 bg-surface hover:bg-surface-hover flex items-center gap-2">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl shadow-sm border border-surface-hover overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-hover text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-surface-hover">
                <th className="py-4 px-6">Product Details</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Stock</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {displayProducts.map((prod, i) => (
                <tr key={i} className="hover:bg-surface-hover/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-slate-400 border border-surface-hover">
                        📦
                      </div>
                      <div>
                        <p className="font-bold text-white">{prod.name}</p>
                        <p className="text-xs text-slate-400">{prod.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-300 font-medium">{prod.category}</td>
                  <td className="py-4 px-6 font-bold text-white">${prod.price.toFixed(2)}</td>
                  <td className="py-4 px-6 font-semibold text-slate-200">{prod.stock} Units</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(prod.status)}`}>
                      {prod.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setPrintBarcodeProduct(prod)} className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-colors" title="Print Barcode Label">
                        <ScanLine size={16} />
                      </button>
                      <button onClick={() => handleEditClick(prod)} className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-500/10 rounded-lg transition-colors" title="Edit Product">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteClick(prod)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors" title="Delete Product">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-surface-hover flex items-center justify-between text-sm text-slate-400">
          <p>Showing 1 to 5 of 1,248 products</p>
          <div className="flex gap-1">
            <button onClick={() => alert("Loading previous page...")} className="px-3 py-1 border border-surface-hover rounded-md hover:bg-surface-hover">Prev</button>
            <button onClick={() => alert("Loading next page...")} className="px-3 py-1 border border-surface-hover rounded-md hover:bg-surface-hover">Next</button>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-surface-hover flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BoxIcon size={20} className="text-primary-500" /> {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-300 hover:bg-surface-hover rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">Product Name *</label>
                <input 
                  type="text" required
                  value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-surface-hover rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                  placeholder="e.g. Wireless Mouse"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-slate-200">SKU</label>
                    <button type="button" onClick={() => setNewProduct({...newProduct, sku: `PRD-${Math.floor(Math.random() * 10000)}`})} className="text-[10px] font-bold text-primary-500 hover:text-primary-400">Generate</button>
                  </div>
                  <input 
                    type="text" 
                    value={newProduct.sku} onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    className="w-full px-3 py-2 border border-surface-hover rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm bg-surface"
                    placeholder="e.g. PRD-123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Category</label>
                  <select 
                    value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-3 py-2 border border-surface-hover rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                  >
                    <option>Electronics</option>
                    <option>Clothing</option>
                    <option>Cosmetics</option>
                    <option>Footwear</option>
                    <option>Toys</option>
                    <option>Home & Kitchen</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Price ($) *</label>
                  <input 
                    type="number" step="0.01" required
                    value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-3 py-2 border border-surface-hover rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1">Initial Stock *</label>
                  <input 
                    type="number" required
                    value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full px-3 py-2 border border-surface-hover rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="pt-4 mt-2 border-t border-surface-hover flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 font-semibold text-slate-300 hover:bg-surface-hover rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-sm transition-colors">
                  {editingId ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Barcode Modal */}
      {printBarcodeProduct && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col items-center p-8 border border-slate-200">
            <h3 className="font-bold text-slate-800 text-lg text-center leading-tight mb-1">{printBarcodeProduct.name}</h3>
            <p className="text-slate-500 text-sm mb-6">{printBarcodeProduct.category}</p>
            
            <div className="bg-white p-4 rounded-xl border border-dashed border-slate-300 w-full flex justify-center mb-6">
              <Barcode 
                value={printBarcodeProduct.sku || printBarcodeProduct.id.toString()} 
                width={2} 
                height={80} 
                fontSize={16} 
                background="#ffffff"
                lineColor="#000000"
              />
            </div>
            
            <div className="flex gap-3 w-full">
              <button onClick={() => setPrintBarcodeProduct(null)} className="flex-1 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors border border-slate-200">
                Close
              </button>
              <button onClick={() => window.print()} className="flex-1 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm flex justify-center items-center gap-2">
                <Printer size={18} /> Print Label
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Inventory;
