import React, { useState } from 'react';
import { Lock, Mail, Smartphone, Shield, KeyRound, ChevronRight, User } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../firebase';

const Auth = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [role, setRole] = useState('Manager');
  const [inputName, setInputName] = useState('');
  
  // Firebase specific states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      onLogin(role, user.displayName || inputName || email.split('@')[0]);
    } catch (err) {
      setError("Invalid credentials or user not found.");
    }
    setLoading(false);
  };

  const handleEmailSignup = async () => {
    if (!email || !password) {
      setError("Please fill all required fields");
      return;
    }
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Usually you'd update profile with inputName here
      onLogin(role, inputName || email.split('@')[0]);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      onLogin(role, user.displayName || 'Google User');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-hover relative overflow-hidden py-10">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-primary-600 to-indigo-700 transform -skew-y-6 origin-top-left -z-10"></div>
      
      <div className="w-full max-w-md p-6">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface shadow-xl shadow-primary-500/20 mb-4">
            <Lock className="text-primary-500" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">AS Supermarket</h1>
          <p className="text-primary-100 mt-2 font-medium">Enterprise Management System</p>
        </div>

        <div className="bg-surface rounded-3xl shadow-2xl p-6 sm:p-8 border border-surface-hover animate-fade-in">
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center font-medium animate-fade-in">
              {error}
            </div>
          )}

          <>
            {/* Auth Mode Tabs: Sign In vs Sign Up */}
            <div className="flex bg-zinc-800 p-1 rounded-xl mb-6">
              <button 
                onClick={() => { setAuthMode('signin'); setError(''); }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMode === 'signin' ? 'bg-surface shadow-sm text-primary-300' : 'text-slate-400'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setAuthMode('signup'); setError(''); }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMode === 'signup' ? 'bg-surface shadow-sm text-primary-300' : 'text-slate-400'}`}
              >
                Create Account
              </button>
            </div>

            {authMode === 'signin' && (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">Select Role</label>
                    <select 
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="block w-full px-3 py-3 border border-surface-hover bg-surface-hover rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-white appearance-none"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Cashier">Cashier</option>
                    </select>
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">Email / User ID</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        type="email" 
                        placeholder="admin@assupermarket.com" 
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setInputName(e.target.value.split('@')[0]); }}
                        className="block w-full pl-10 pr-3 py-3 bg-surface border border-surface-hover rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyRound className="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 bg-surface border border-surface-hover rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-white"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  disabled={loading}
                  onClick={handleEmailLogin}
                  className="w-full mt-6 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Processing...' : 'Sign In'}</span>
                  {!loading && <ChevronRight size={18} />}
                </button>

                  <div className="mt-6 flex items-center justify-center gap-3">
                    <div className="h-px bg-surface-hover flex-1"></div>
                    <span className="text-xs text-slate-400 font-medium uppercase">Or continue with</span>
                    <div className="h-px bg-surface-hover flex-1"></div>
                  </div>

                  {/* Google Login Button */}
                  <button 
                    disabled={loading}
                    onClick={handleGoogleLogin}
                    className="w-full mt-6 bg-surface border border-surface-hover hover:bg-surface-hover text-slate-200 disabled:opacity-50 font-semibold py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Sign in with Google</span>
                  </button>
                </>
              )}

              {authMode === 'signup' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">Select Role</label>
                    <select 
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="block w-full px-3 py-3 border border-surface-hover bg-surface-hover rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-white appearance-none"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Cashier">Cashier</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 bg-surface border border-surface-hover rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        type="email" 
                        placeholder="john@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 bg-surface border border-surface-hover rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Smartphone className="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        type="tel" 
                        placeholder="+91 98765 43210" 
                        className="block w-full pl-10 pr-3 py-3 bg-surface border border-surface-hover rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyRound className="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        type="password" 
                        placeholder="Create a strong password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 bg-surface border border-surface-hover rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-white"
                      />
                    </div>
                  </div>

                  <button 
                    disabled={loading}
                    onClick={handleEmailSignup}
                    className="w-full mt-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Processing...' : 'Create Account'}</span>
                    {!loading && <ChevronRight size={18} />}
                  </button>
                  
                  <p className="text-xs text-center text-slate-400 mt-4">
                    By registering, you agree to our <a href="#" className="text-primary-500 hover:underline">Terms of Service</a> & <a href="#" className="text-primary-500 hover:underline">Privacy Policy</a>
                  </p>
                </div>
              )}
            </>
        </div>
        
        <p className="text-center text-sm text-slate-400 mt-8 font-medium">
          Protected by AES-256 Encryption & JWT Authentication
        </p>
      </div>
    </div>
  );
};

export default Auth;
