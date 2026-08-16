import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { QRCodeSVG } from 'qrcode.react';
import { Search, ScanLine, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, Receipt, CheckCircle, Printer, X, QrCode } from 'lucide-react';

const POS = ({ onCheckout, products = [] }) => {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [activePayment, setActivePayment] = useState('Cash');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [billData, setBillData] = useState(null);
  const [scanningUPI, setScanningUPI] = useState(false);
  const [processingCard, setProcessingCard] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannerInput, setScannerInput] = useState('');
  const [scannerError, setScannerError] = useState('');
  const scannerRef = useRef(null);

  useEffect(() => {
    if (showScanner) {
      const html5QrCode = new Html5Qrcode("reader");
      html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
          const product = products.find(p => p.sku.toLowerCase() === decodedText.toLowerCase() || p.id.toString() === decodedText);
          if (product) {
            addToCart(product);
            html5QrCode.stop().then(() => {
              setShowScanner(false);
            });
          } else {
            setScannerError(`Scanned ${decodedText}, but product not found.`);
          }
        },
        (errorMessage) => {
          // ignore parsing errors as they happen constantly until scan is successful
        }
      ).catch(err => {
        setScannerError("Camera not accessible. Please check permissions.");
      });

      scannerRef.current = html5QrCode;
    } else {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => console.log("Stop error", err));
        scannerRef.current = null;
      }
    }
    
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => console.log("Cleanup error", err));
      }
    }
  }, [showScanner, products]);

  const categories = ['All Items', 'Clothing', 'Electronics', 'Cosmetics', 'Footwear', 'Toys', 'Home & Kitchen'];

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All Items' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      updateQty(product.id, 1);
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handlePayment = () => {
    if (cart.length === 0) {
      alert("Cart is empty! Add items to bill first.");
      return;
    }
    if (!customerPhone) {
      alert("Please enter a Customer Phone Number before proceeding with the payment.");
      return;
    }
    
    // Generate Bill
    const newBill = {
      items: [...cart],
      subtotal, tax, total, activePayment,
      customerName, customerPhone,
      invoiceNo: `INV-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toLocaleString()
    };
    
    setBillData(newBill);
    if (onCheckout) onCheckout(newBill);
  };

  const closeBill = () => {
    setBillData(null);
    setCart([]);
    setCustomerPhone('');
    setCustomerName('');
  };

  const simulateUPIScan = () => {
    if (cart.length === 0) {
      alert("Cart is empty! Add items to bill first.");
      return;
    }
    if (!customerPhone) {
      alert("Please enter a Customer Phone Number before scanning.");
      return;
    }
    
    setScanningUPI(true);
    setTimeout(() => {
      setScanningUPI(false);
      handlePayment();
    }, 1500);
  };

  const processCardPayment = () => {
    if (cart.length === 0) {
      alert("Cart is empty! Add items to bill first.");
      return;
    }
    if (!customerPhone) {
      alert("Please enter a Customer Phone Number before proceeding.");
      return;
    }
    
    setProcessingCard(true);
    setTimeout(() => {
      setProcessingCard(false);
      handlePayment();
    }, 1500);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      const product = products.find(p => p.sku.toLowerCase() === searchQuery.toLowerCase() || p.id.toString() === searchQuery);
      if (product) {
        addToCart(product);
        setSearchQuery('');
      } else {
        alert("Product not found. Try a different SKU.");
      }
    }
  };

  const handleScannerSubmit = (e) => {
    e.preventDefault();
    const product = products.find(p => p.sku.toLowerCase() === scannerInput.toLowerCase() || p.id.toString() === scannerInput);
    if (product) {
      addToCart(product);
      setShowScanner(false);
      setScannerInput('');
    } else {
      alert("Product not found! Check the SKU.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full max-h-screen p-2 md:p-4 gap-4 animate-fade-in">
      
      {/* Products Section */}
      <div className="flex-1 flex flex-col bg-surface rounded-2xl shadow-sm border border-surface-hover overflow-hidden">
        <div className="p-4 border-b border-surface-hover flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products or scan barcode..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-hover border border-surface-hover rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-surface outline-none transition-all text-sm"
            />
          </div>
          <button 
            onClick={() => setShowScanner(true)}
            className="p-2.5 bg-primary-500/10 text-primary-500 rounded-xl hover:bg-primary-100 transition-colors"
            title="Open Camera Scanner"
          >
            <ScanLine size={20} />
          </button>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto p-3 gap-2 border-b border-slate-50 no-scrollbar">
          {categories.map((cat, i) => (
            <button 
              key={i} 
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat ? 'bg-slate-800 text-white' : 'bg-zinc-800 text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(prod => (
              <div 
                key={prod.id} 
                onClick={() => addToCart(prod)}
                className="group relative bg-surface border border-surface-hover rounded-2xl p-4 flex flex-col items-center text-center hover:border-primary-500 hover:shadow-md transition-all cursor-pointer active:scale-95"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{prod.img}</div>
                <h4 className="text-sm font-semibold text-slate-100 line-clamp-2 leading-tight mb-1">{prod.name}</h4>
                <p className="text-primary-500 font-bold mt-auto">${prod.price.toFixed(2)}</p>
                
                {/* Overlay Add Indicator */}
                <div className="absolute top-2 right-2 bg-primary-500/100 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus size={14} />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-10 text-slate-400">
              <Search size={48} className="mb-4 opacity-20" />
              <p>No products found in this category.</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart / Billing Section */}
      <div className="w-full lg:w-96 flex flex-col bg-surface rounded-2xl shadow-sm border border-surface-hover overflow-hidden shrink-0">
        <div className="p-4 border-b border-surface-hover bg-slate-800 text-white flex justify-between items-center">
          <h2 className="font-bold flex items-center gap-2"><Receipt size={18} /> Current Order</h2>
          <span className="text-xs bg-slate-700 px-2 py-1 rounded-md">
            {cart.length > 0 ? `${cart.reduce((a,c) => a + c.qty, 0)} items` : 'Empty'}
          </span>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Receipt size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">Your cart is empty</p>
              <p className="text-xs mt-1">Tap products to add them to bill</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-3 bg-surface-hover p-3 rounded-xl border border-surface-hover animate-fade-in">
                <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center text-2xl shadow-sm">
                  {item.img}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-100 leading-tight">{item.name}</h4>
                  <p className="text-primary-500 font-bold text-sm">${item.price.toFixed(2)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 bg-surface border border-surface-hover rounded-lg px-2 py-1">
                      <button onClick={() => updateQty(item.id, -1)} className="text-slate-400 hover:text-slate-100"><Minus size={14} /></button>
                      <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="text-slate-400 hover:text-slate-100"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-rose-500 p-1 hover:bg-rose-50 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & Payment */}
        <div className="p-4 bg-surface-hover border-t border-surface-hover">
          {/* Customer Info Input */}
          <div className="mb-4 space-y-2">
            <input 
              type="tel" 
              placeholder="Customer Phone Number *" 
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-surface-hover rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-surface"
              required
            />
            <input 
              type="text" 
              placeholder="Customer Name (Optional)" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-surface-hover rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-surface"
            />
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-slate-300">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-300">
              <span>Tax (GST 18%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-300">
              <span>Discount</span>
              <span className="text-emerald-500">-$0.00</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-surface-hover">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { id: 'Cash', icon: <Banknote size={20} /> },
              { id: 'UPI', icon: <Smartphone size={20} /> },
            ].map(method => (
              <button 
                key={method.id}
                onClick={() => setActivePayment(method.id)}
                className={`flex flex-col items-center justify-center gap-1 p-2 border rounded-xl transition-colors ${
                  activePayment === method.id 
                    ? 'bg-primary-500/10 border-primary-500 text-primary-300 shadow-sm' 
                    : 'bg-surface border-surface-hover hover:border-primary-300 text-slate-300'
                }`}
              >
                {method.icon}
                <span className="text-xs font-semibold">{method.id}</span>
                {activePayment === method.id && (
                  <CheckCircle size={12} className="absolute top-1 right-1 text-primary-500" />
                )}
              </button>
            ))}
          </div>

          {activePayment === 'UPI' && (
            <div className="bg-surface p-4 rounded-xl border border-surface-hover mb-3 flex flex-col items-center justify-center animate-fade-in shadow-inner relative overflow-hidden">
              {scanningUPI ? (
                <div className="absolute inset-0 bg-surface/90 z-10 flex flex-col items-center justify-center animate-fade-in backdrop-blur-sm">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="font-bold text-emerald-600">Verifying Payment...</p>
                </div>
              ) : null}
              <div className="bg-white p-2 rounded-lg mb-2 cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all shadow-sm" onClick={simulateUPIScan} title="Click QR to simulate successful scan">
                <QRCodeSVG value={`upi://pay?pa=assupermarket@upi&pn=AS%20Supermarket&am=${total.toFixed(2)}&cu=INR`} size={150} />
              </div>
              <p className="text-sm font-bold text-white mb-3">Scan to Pay ${total.toFixed(2)}</p>
              
              <div className="flex gap-2 w-full justify-center px-2">
                 <a href={`gpay://upi/pay?pa=assupermarket@upi&pn=AS%20Supermarket&am=${total.toFixed(2)}&cu=INR`} className="flex-1 py-1.5 bg-surface border border-surface-hover rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:border-slate-500 text-center transition-all">GPay</a>
                 <a href={`phonepe://pay?pa=assupermarket@upi&pn=AS%20Supermarket&am=${total.toFixed(2)}&cu=INR`} className="flex-1 py-1.5 bg-surface border border-surface-hover rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:border-slate-500 text-center transition-all">PhonePe</a>
                 <a href={`paytmmp://pay?pa=assupermarket@upi&pn=AS%20Supermarket&am=${total.toFixed(2)}&cu=INR`} className="flex-1 py-1.5 bg-surface border border-surface-hover rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:border-slate-500 text-center transition-all">Paytm</a>
              </div>

              <button onClick={simulateUPIScan} className="text-xs text-primary-500 font-bold hover:underline mt-3">
                Click QR to simulate scan
              </button>
            </div>
          )}

          <button 
            onClick={handlePayment}
            className={`w-full font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-lg ${
              cart.length > 0 
                ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/30 active:scale-95' 
                : 'bg-slate-300 text-slate-400 cursor-not-allowed'
            }`}
          >
            Pay ${total.toFixed(2)}
          </button>
        </div>
      </div>

      {/* Bill Receipt Modal */}
      {billData && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col max-h-full">
            <div className="bg-slate-800 p-4 flex items-center justify-between text-white">
              <h3 className="font-bold">Invoice Details</h3>
              <button onClick={closeBill} className="text-slate-300 hover:text-white transition-colors"><X size={20}/></button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto relative">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] z-0 select-none overflow-hidden">
                <h1 className="text-8xl font-black text-white -rotate-45 whitespace-nowrap tracking-tighter">
                  AS SUPERMARKET
                </h1>
              </div>

              <div className="relative z-10 text-center mb-6 border-b border-dashed border-slate-300 pb-6">
                <h2 className="text-2xl font-bold text-white">AS Supermarket</h2>
                <p className="text-sm text-slate-400">123 Market Street, NY 10001</p>
                <div className="mt-4 text-left text-sm text-slate-300 space-y-1">
                  <p><strong>Invoice:</strong> #{billData.invoiceNo}</p>
                  <p><strong>Date:</strong> {billData.date}</p>
                  <p><strong>Customer:</strong> {billData.customerName || billData.customerPhone}</p>
                  <p><strong>Payment:</strong> {billData.activePayment}</p>
                </div>
              </div>

              <div className="relative z-10 space-y-3 mb-6">
                {billData.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-slate-200 flex-1 pr-2">{item.name} <span className="text-slate-400">x{item.qty}</span></span>
                    <span className="font-semibold text-white">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="relative z-10 border-t border-dashed border-slate-300 pt-4 space-y-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${billData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span>${billData.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-surface-hover">
                  <span>Total</span>
                  <span>${billData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-surface-hover bg-surface-hover flex gap-3">
              <button onClick={() => window.print()} className="flex-1 bg-surface border border-surface-hover text-slate-200 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-hover transition-colors">
                <Printer size={18}/> Print
              </button>
              <button onClick={closeBill} className="flex-1 bg-primary-600 text-white font-semibold py-2.5 rounded-xl hover:bg-primary-700 transition-colors shadow-sm">
                New Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-surface rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col border border-surface-hover">
            <div className="p-4 border-b border-surface-hover flex justify-between items-center bg-slate-800">
              <h3 className="font-bold text-white flex items-center gap-2"><ScanLine size={18}/> Scan Barcode</h3>
              <button onClick={() => setShowScanner(false)} className="text-slate-400 hover:text-white transition-colors"><X size={20}/></button>
            </div>
            
            <div className="p-6 flex flex-col items-center">
              {/* Camera viewfinder */}
              <div 
                id="reader"
                className="w-full h-64 border-2 border-primary-500/50 rounded-xl mb-4 relative overflow-hidden bg-black shadow-inner"
              ></div>
              
              {scannerError && <p className="text-rose-500 text-sm font-medium mb-4 text-center">{scannerError}</p>}

              <p className="text-slate-400 text-sm mb-4 text-center">Or enter the barcode/SKU manually</p>
              
              <form onSubmit={handleScannerSubmit} className="w-full flex gap-2">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Enter SKU (e.g. PRD-001)"
                  value={scannerInput}
                  onChange={(e) => setScannerInput(e.target.value)}
                  className="flex-1 px-4 py-3 bg-surface-hover border border-surface-hover rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-xl font-bold shadow-sm transition-colors">
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
