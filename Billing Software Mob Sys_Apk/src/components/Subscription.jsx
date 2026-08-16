import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Star, Zap, Shield, ChevronRight, X, Loader2, Smartphone, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const Subscription = () => {
  const [activePlan, setActivePlan] = useState('pro');
  const [showCardModal, setShowCardModal] = useState(false);
  const [methodType, setMethodType] = useState('card');
  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvc: '' });
  const [upiId, setUpiId] = useState('');
  const [cards, setCards] = useState([
    { id: 1, type: 'VISA', last4: '4242', expiry: '12/28', isDefault: true }
  ]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const defaultMethod = cards.find(c => c.isDefault) || cards[0];

  const handleUpgradeClick = (planId) => {
    if (planId === activePlan) return;
    setSelectedPlan(planId);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setActivePlan(selectedPlan);
      setShowUpgradeModal(false);
    }, 1500);
  };

  const handleAddMethod = (e) => {
    e.preventDefault();
    if (methodType === 'card') {
      if (!newCard.number || !newCard.expiry) return;
      const cardData = {
        id: Date.now(),
        type: newCard.number.startsWith('5') ? 'MasterCard' : 'VISA',
        last4: newCard.number.slice(-4) || '1234',
        expiry: newCard.expiry,
        isDefault: cards.length === 0
      };
      setCards([...cards, cardData]);
    } else {
      if (!upiId) return;
      const upiData = {
        id: Date.now(),
        type: 'UPI',
        last4: upiId,
        expiry: 'AutoPay',
        isDefault: cards.length === 0
      };
      setCards([...cards, upiData]);
    }
    
    setShowCardModal(false);
    setNewCard({ number: '', expiry: '', cvc: '' });
    setUpiId('');
  };

  const removeCard = (id) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for small shops getting started.',
      icon: <Star className="text-slate-400" size={24} />,
      features: ['Up to 50 Products', 'Basic POS Checkout', 'Daily Sales Report', 'Single User'],
      color: 'bg-slate-800 border-surface-hover',
      buttonColor: 'bg-surface hover:bg-surface-hover text-white'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'Everything you need for a growing supermarket.',
      icon: <Zap className="text-amber-400" size={24} />,
      features: ['Unlimited Products', 'Advanced POS & Inventory', 'Detailed Analytics', 'Up to 5 Users', 'Priority Support'],
      color: 'bg-gradient-to-b from-primary-900/40 to-surface border-primary-500/50 relative overflow-hidden',
      buttonColor: 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'Advanced tools for multi-store operations.',
      icon: <Shield className="text-emerald-400" size={24} />,
      features: ['Multi-store Management', 'Custom Integrations', 'Dedicated Account Manager', 'Unlimited Users', 'API Access'],
      color: 'bg-surface border-surface-hover',
      buttonColor: 'bg-surface hover:bg-surface-hover border border-surface-hover text-white'
    }
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-fade-in">
      
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-white mb-4">Choose Your Plan</h1>
        <p className="text-slate-400">Upgrade your AS Supermarket experience with premium features. Cancel or change your plan at any time.</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`rounded-3xl p-6 md:p-8 border flex flex-col ${plan.color} ${activePlan === plan.id ? 'ring-2 ring-primary-500 ring-offset-4 ring-offset-surface-hover' : ''}`}
          >
            {plan.id === 'pro' && (
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-indigo-500"></div>
            )}
            
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-surface-hover border border-surface flex items-center justify-center">
                {plan.icon}
              </div>
              {plan.id === 'pro' && (
                <span className="px-3 py-1 bg-primary-500/20 text-primary-400 text-xs font-bold rounded-full border border-primary-500/30">
                  RECOMMENDED
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-sm text-slate-400 mb-6 h-10">{plan.description}</p>
            
            <div className="mb-6 flex items-baseline">
              <span className="text-4xl font-extrabold text-white">{plan.price}</span>
              {plan.period && <span className="text-slate-400 ml-1 font-medium">{plan.period}</span>}
            </div>
            
            <div className="flex-1 space-y-4 mb-8">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300 font-medium">{feature}</span>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => handleUpgradeClick(plan.id)}
              disabled={activePlan === plan.id}
              className={`w-full py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${plan.buttonColor}`}
            >
              {activePlan === plan.id ? 'Current Plan' : 'Upgrade'}
              {activePlan !== plan.id && <ChevronRight size={18} />}
            </button>
          </div>
        ))}
      </div>

      {/* Payment Method Section */}
      <div className="max-w-3xl mx-auto mt-12 bg-surface rounded-3xl p-6 md:p-8 border border-surface-hover shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CreditCard className="text-primary-500" /> Payment Methods
            </h2>
            <p className="text-sm text-slate-400 mt-1">Manage your billing information securely.</p>
          </div>
          <button onClick={() => { setMethodType('card'); setShowCardModal(true); }} className="text-sm font-semibold text-primary-500 hover:text-primary-400 bg-primary-500/10 hover:bg-primary-500/20 px-4 py-2 rounded-lg transition-colors">
            Add Method
          </button>
        </div>
        
        <div className="space-y-3">
          {cards.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No payment methods found. Please add a card.</p>
          ) : (
            cards.map(card => (
              <div key={card.id} className="flex items-center justify-between p-4 bg-surface-hover rounded-xl border border-surface border-opacity-50 animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-zinc-800 rounded flex items-center justify-center border border-zinc-700">
                    {card.type === 'UPI' ? <Smartphone size={16} className="text-white"/> : <span className="text-xs font-black italic text-white">{card.type}</span>}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{card.type === 'UPI' ? card.last4 : `${card.type} ending in ${card.last4}`}</p>
                    <p className="text-xs text-slate-400">{card.type === 'UPI' ? 'UPI AutoPay Enabled' : `Expires ${card.expiry}`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {card.isDefault && <span className="px-2 py-1 bg-surface text-slate-300 text-xs font-semibold rounded border border-surface-hover">Default</span>}
                  <button onClick={() => removeCard(card.id)} className="text-sm text-rose-500 font-medium hover:underline">Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-surface rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-surface-hover">
            <div className="p-4 border-b border-surface-hover flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2"><CreditCard size={18}/> Add Payment Method</h3>
              <button onClick={() => setShowCardModal(false)} className="text-slate-400 hover:text-white transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={handleAddMethod} className="p-5 space-y-4">
              <div className="flex gap-2 p-1 bg-surface-hover rounded-xl mb-4">
                <button type="button" onClick={() => setMethodType('card')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${methodType === 'card' ? 'bg-surface shadow-sm text-white' : 'text-slate-400'}`}>Credit/Debit Card</button>
                <button type="button" onClick={() => setMethodType('upi')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${methodType === 'upi' ? 'bg-surface shadow-sm text-white' : 'text-slate-400'}`}>UPI / QR</button>
              </div>

              {methodType === 'card' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Card Number</label>
                    <input 
                      type="text" required placeholder="0000 0000 0000 0000" maxLength="19"
                      value={newCard.number} onChange={(e) => setNewCard({...newCard, number: e.target.value})}
                      className="w-full px-3 py-2 bg-surface-hover border border-surface-hover rounded-lg text-white focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-300 mb-1">Expiry Date</label>
                      <input 
                        type="text" required placeholder="MM/YY" maxLength="5"
                        value={newCard.expiry} onChange={(e) => setNewCard({...newCard, expiry: e.target.value})}
                        className="w-full px-3 py-2 bg-surface-hover border border-surface-hover rounded-lg text-white focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-300 mb-1">CVC</label>
                      <input 
                        type="password" required placeholder="123" maxLength="4"
                        value={newCard.cvc} onChange={(e) => setNewCard({...newCard, cvc: e.target.value})}
                        className="w-full px-3 py-2 bg-surface-hover border border-surface-hover rounded-lg text-white focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">UPI ID</label>
                  <input 
                    type="text" required placeholder="username@bank"
                    value={upiId} onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-hover border border-surface-hover rounded-lg text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                  <p className="text-xs text-slate-400 mt-2">A mandate request will be sent to your UPI app.</p>
                </div>
              )}
              
              <button type="submit" className="w-full mt-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl shadow-sm transition-colors">
                Save Method
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Upgrade Confirmation Modal */}
      {showUpgradeModal && selectedPlan && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-surface rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center border border-surface-hover">
            {defaultMethod?.type === 'UPI' ? (
              <div className="mb-4 p-4 bg-surface-hover rounded-xl flex flex-col items-center">
                <div className="bg-white p-2 rounded-lg mb-3 shadow-sm">
                  <QRCodeSVG value={`upi://pay?pa=assupermarket@upi&pn=AS%20Supermarket&am=${plans.find(p => p.id === selectedPlan)?.price.replace('$', '') || '0'}&cu=INR`} size={120} />
                </div>
                <p className="text-xs text-slate-400 mb-3 text-center">Scan with any UPI App or tap below if on mobile</p>
                
                <div className="flex gap-2 w-full justify-center px-2">
                 <a href={`gpay://upi/pay?pa=assupermarket@upi&pn=AS%20Supermarket&am=${plans.find(p => p.id === selectedPlan)?.price.replace('$', '') || '0'}&cu=INR`} className="flex-1 py-1.5 bg-surface border border-surface-hover rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:border-slate-500 text-center transition-all">GPay</a>
                 <a href={`phonepe://pay?pa=assupermarket@upi&pn=AS%20Supermarket&am=${plans.find(p => p.id === selectedPlan)?.price.replace('$', '') || '0'}&cu=INR`} className="flex-1 py-1.5 bg-surface border border-surface-hover rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:border-slate-500 text-center transition-all">PhonePe</a>
                 <a href={`paytmmp://pay?pa=assupermarket@upi&pn=AS%20Supermarket&am=${plans.find(p => p.id === selectedPlan)?.price.replace('$', '') || '0'}&cu=INR`} className="flex-1 py-1.5 bg-surface border border-surface-hover rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:border-slate-500 text-center transition-all">Paytm</a>
                </div>

                <p className="font-bold text-primary-400 mt-3">{defaultMethod.last4}</p>
              </div>
            ) : (
              <div className="w-16 h-16 bg-primary-500/10 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} />
              </div>
            )}
            <h3 className="text-xl font-bold text-white mb-2">Confirm Subscription</h3>
            <p className="text-slate-400 text-sm mb-6">
              You are about to switch to the <strong className="text-white">{plans.find(p => p.id === selectedPlan).name}</strong> plan for <strong className="text-white">{plans.find(p => p.id === selectedPlan).price}</strong>/month.
            </p>
            <div className="flex gap-3">
              <button disabled={isProcessing} onClick={() => setShowUpgradeModal(false)} className="flex-1 py-2.5 bg-surface-hover text-slate-300 font-semibold rounded-xl hover:bg-slate-700 transition-colors">
                Cancel
              </button>
              <button disabled={isProcessing} onClick={confirmUpgrade} className="flex-1 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 disabled:opacity-70">
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Subscription;
