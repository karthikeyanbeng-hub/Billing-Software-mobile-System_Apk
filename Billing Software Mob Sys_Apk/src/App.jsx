import React, { useState } from 'react';
import { Home, ShoppingCart, Package, Users, BarChart3, Settings, LogOut, Menu, UserCircle, Bell, Search, ScanLine, Smartphone, CreditCard } from 'lucide-react';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import Inventory from './components/Inventory';
import Customers from './components/Customers';
import Auth from './components/Auth';
import Reports from './components/Reports';
import Subscription from './components/Subscription';
import './App.css'; // Might be removed or kept

const initialProducts = [
  { id: 1, name: "Sony Wireless Headphones", category: "Electronics", price: 120.00, img: "🎧", stock: 45, sku: 'PRD-001' },
  { id: 2, name: "Cotton T-Shirt - Blue", category: "Clothing", price: 25.50, img: "👕", stock: 12, sku: 'PRD-002' },
  { id: 3, name: "Smart Watch Series 5", category: "Electronics", price: 299.99, img: "⌚", stock: 0, sku: 'PRD-003' },
  { id: 4, name: "Moisturizer Cream 50ml", category: "Cosmetics", price: 45.00, img: "🧴", stock: 150, sku: 'PRD-004' },
  { id: 5, name: "Ceramic Coffee Mug", category: "Home & Kitchen", price: 12.50, img: "☕", stock: 8, sku: 'PRD-005' },
  { id: 6, name: "Fresh Organic Bananas", category: "Groceries", price: 2.99, img: "🍌", stock: 120, sku: 'PRD-006' },
  { id: 7, name: "Whole Wheat Bread", category: "Groceries", price: 3.49, img: "🍞", stock: 35, sku: 'PRD-007' },
  { id: 8, name: "Farm Fresh Eggs (12 pack)", category: "Groceries", price: 4.99, img: "🥚", stock: 60, sku: 'PRD-008' },
  { id: 9, name: "Orange Juice 1L", category: "Beverages", price: 5.50, img: "🧃", stock: 40, sku: 'PRD-009' },
  { id: 10, name: "Potato Chips - Classic", category: "Snacks", price: 1.99, img: "🥔", stock: 85, sku: 'PRD-010' },
  { id: 11, name: "Dark Chocolate Bar", category: "Snacks", price: 2.50, img: "🍫", stock: 55, sku: 'PRD-011' },
  { id: 12, name: "Sparkling Water 500ml", category: "Beverages", price: 1.25, img: "💧", stock: 200, sku: 'PRD-012' },
  { id: 13, name: "Fresh Red Apples (1kg)", category: "Groceries", price: 4.20, img: "🍎", stock: 90, sku: 'PRD-013' },
  { id: 14, name: "Cheddar Cheese Block", category: "Groceries", price: 6.75, img: "🧀", stock: 25, sku: 'PRD-014' },
  { id: 15, name: "Premium Coffee Beans", category: "Groceries", price: 14.99, img: "☕", stock: 15, sku: 'PRD-015' },
  { id: 16, name: "Green Tea Pack", category: "Beverages", price: 4.50, img: "🍵", stock: 45, sku: 'PRD-016' },
  { id: 17, name: "Tomatoes (1kg)", category: "Groceries", price: 3.10, img: "🍅", stock: 75, sku: 'PRD-017' },
  { id: 18, name: "Mixed Nuts 250g", category: "Snacks", price: 8.99, img: "🥜", stock: 30, sku: 'PRD-018' },
  { id: 19, name: "Cola Soda 6-Pack", category: "Beverages", price: 5.99, img: "🥤", stock: 65, sku: 'PRD-019' },
  { id: 20, name: "Strawberry Yogurt", category: "Groceries", price: 1.50, img: "🍨", stock: 110, sku: 'PRD-020' },
  { id: 21, name: "Shampoo 400ml", category: "Cosmetics", price: 7.99, img: "🧴", stock: 40, sku: 'PRD-021' },
  { id: 22, name: "Dishwashing Liquid", category: "Home & Kitchen", price: 3.50, img: "🧼", stock: 80, sku: 'PRD-022' },
  { id: 23, name: "AA Batteries (4 Pack)", category: "Electronics", price: 5.99, img: "🔋", stock: 150, sku: 'PRD-023' }
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('Admin'); // Admin, Cashier, Manager
  const [userName, setUserName] = useState('Admin'); // Extracted login name
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState(initialProducts);

  if (!isAuthenticated) {
    return <Auth onLogin={(role, name) => { 
      setIsAuthenticated(true); 
      setUserRole(role); 
      setUserName(name); 
    }} />;
  }

  const handleCheckout = (bill) => {
    setTransactions([bill, ...transactions]);
    // Deduct stock in real-time
    setProducts(prevProducts => {
      let updated = [...prevProducts];
      bill.items.forEach(cartItem => {
        updated = updated.map(p => 
          p.id === cartItem.id ? { ...p, stock: Math.max(0, p.stock - cartItem.qty) } : p
        );
      });
      return updated;
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard transactions={transactions} products={products} />;
      case 'pos': return <POS onCheckout={handleCheckout} products={products} />;
      case 'inventory': return <Inventory 
        products={products} 
        onAddProduct={(p) => setProducts([p, ...products])} 
        onUpdateProduct={(id, updated) => setProducts(products.map(p => p.id === id ? updated : p))}
        onDeleteProduct={(id) => setProducts(products.filter(p => p.id !== id))}
      />;
      case 'customers': return <Customers transactions={transactions} />;
      case 'reports': return <Reports transactions={transactions} products={products} />;
      case 'subscription': return <Subscription />;
      default: return <Dashboard transactions={transactions} products={products} />;
    }
  };

  return (
    <div className="flex h-screen bg-surface-hover overflow-hidden font-sans text-slate-100">
      
      {/* Sidebar for Tablet/Desktop (Hidden on small mobile) */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-surface-hover z-10 shadow-sm">
        <div className="p-6 flex items-center gap-3 border-b border-surface-hover">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
            <ShoppingCart size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-white">AS Supermarket</h1>
            <p className="text-xs text-slate-400 font-medium">Enterprise POS</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <NavItem icon={<Home size={20} />} label="Dashboard" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<ScanLine size={20} />} label="Billing / POS" isActive={activeTab === 'pos'} onClick={() => setActiveTab('pos')} />
          <NavItem icon={<Package size={20} />} label="Inventory" isActive={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
          <NavItem icon={<Users size={20} />} label="Customers" isActive={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />
          <NavItem icon={<BarChart3 size={20} />} label="Reports" isActive={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
          <NavItem icon={<CreditCard size={20} />} label="Subscription" isActive={activeTab === 'subscription'} onClick={() => setActiveTab('subscription')} />
        </div>

        <div className="p-4 border-t border-surface-hover">
          <div className="flex items-center gap-3 mb-4 bg-surface-hover p-3 rounded-xl border border-surface-hover">
            <UserCircle size={36} className="text-slate-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate capitalize">{userName}</p>
              <p className="text-xs text-primary-500 font-medium">{userRole}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium text-slate-300 hover:text-red-500 hover:bg-red-950/30 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        
        {/* Mobile Header */}
        <header className="md:hidden glass z-20 px-4 py-3 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
              <ShoppingCart size={16} />
            </div>
            <h1 className="font-bold text-lg text-white">AS Supermarket</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => alert("Opening Notifications...")} className="p-2 rounded-full bg-surface shadow-sm text-slate-400 hover:text-primary-500">
              <Bell size={18} />
            </button>
            <button onClick={() => alert("Opening Profile Settings...")} className="p-2 rounded-full bg-surface shadow-sm text-slate-400 hover:text-primary-500">
              <UserCircle size={18} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pb-20 md:pb-0 relative scroll-smooth">
          {renderContent()}
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden glass fixed bottom-0 w-full px-2 py-2 flex justify-around items-center border-t border-surface-hover/50 pb-safe z-30">
          <MobileNavTab icon={<Home size={22} />} label="Home" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <MobileNavTab icon={<ScanLine size={22} />} label="POS" isActive={activeTab === 'pos'} onClick={() => setActiveTab('pos')} />
          <MobileNavTab icon={<Package size={22} />} label="Stock" isActive={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
          <MobileNavTab icon={<Users size={22} />} label="CRM" isActive={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />
        </nav>
      </main>
    </div>
  );
}

const NavItem = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive 
        ? 'bg-primary-500/10 text-primary-300 font-semibold shadow-sm' 
        : 'text-slate-300 hover:bg-surface-hover font-medium hover:text-white'
    }`}
  >
    <div className={isActive ? 'text-primary-500' : 'text-slate-400'}>{icon}</div>
    <span>{label}</span>
  </button>
);

const MobileNavTab = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-2 min-w-[64px] transition-colors ${
      isActive ? 'text-primary-500' : 'text-slate-400'
    }`}
  >
    <div className={`mb-1 transition-transform ${isActive ? 'scale-110' : ''}`}>{icon}</div>
    <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
  </button>
);

export default App;
