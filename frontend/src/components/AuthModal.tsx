import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, X, Compass, Feather, Palette, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userType, setUserType] = useState<'visitor' | 'creator' | 'artisan'>('creator');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await register(name, email, password, userType);
        toast.success(`Welcome to RIWAYAT, ${name}! Your account is active.`);
      } else {
        await login(email, password);
        toast.success('Successfully signed in to RIWAYAT Heritage Hub');
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-ent-fade">
      <div className="bg-[#0D1322] border border-amber-500/35 rounded-3xl w-full max-w-lg p-8 relative shadow-2xl animate-ent-rise text-amber-50 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-amber-400/60 hover:text-white transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Crest Header */}
        <div className="text-center space-y-3">
          <img
            src="/riwayat-logo.png"
            alt="RIWAYAT Crest Logo"
            className="w-16 h-16 object-contain mx-auto rounded-2xl border border-amber-500/40 p-1 shadow-2xl bg-[#060A12]"
          />
          <div>
            <h2 className="font-serif-heritage text-3xl font-bold gold-gradient-text">
              {isSignUp ? 'Join RIWAYAT Heritage' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-amber-200/70 mt-1 font-light">
              {isSignUp
                ? 'Be part of preserving India\'s living cultural traditions & master crafts'
                : 'Sign in to access your saved archives, orders & creator dashboard'}
            </p>
          </div>
        </div>

        {/* Sign In vs Sign Up Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-[#060A12] border border-amber-500/25 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(''); }}
            className={`py-2 rounded-lg transition-all ${
              !isSignUp ? 'bg-amber-400 text-black shadow-md' : 'text-amber-300/70 hover:text-amber-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError(''); }}
            className={`py-2 rounded-lg transition-all ${
              isSignUp ? 'bg-amber-400 text-black shadow-md' : 'text-amber-300/70 hover:text-amber-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Role Selector for Sign Up */}
        {isSignUp && (
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-widest">
              Select Your Role:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUserType('visitor')}
                className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                  userType === 'visitor'
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-md'
                    : 'border-amber-500/20 bg-[#060A12] text-amber-100/60 hover:border-amber-500/40'
                }`}
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-xs font-bold">Explorer</div>
                  <div className="text-[9px] text-amber-300/60 leading-tight">Archives & Trips</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setUserType('creator')}
                className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                  userType === 'creator'
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-md'
                    : 'border-amber-500/20 bg-[#060A12] text-amber-100/60 hover:border-amber-500/40'
                }`}
              >
                <Feather className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-xs font-bold">Creator</div>
                  <div className="text-[9px] text-amber-300/60 leading-tight">Field Stories</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setUserType('artisan')}
                className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                  userType === 'artisan'
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-md'
                    : 'border-amber-500/20 bg-[#060A12] text-amber-100/60 hover:border-amber-500/40'
                }`}
              >
                <Palette className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-xs font-bold">Artisan</div>
                  <div className="text-[9px] text-amber-300/60 leading-tight">Craft Store</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isSignUp && (
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-amber-400/70" />
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#060A12] border border-amber-500/30 rounded-xl pl-10 pr-4 py-3 text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-400"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-amber-400/70" />
            <input
              type="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#060A12] border border-amber-500/30 rounded-xl pl-10 pr-4 py-3 text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-amber-400/70" />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#060A12] border border-amber-500/30 rounded-xl pl-10 pr-4 py-3 text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-400"
            />
          </div>

          {error && <div className="text-rose-400 text-xs text-center font-semibold">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Processing...' : isSignUp ? 'Complete Registration' : 'Sign In to RIWAYAT'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;