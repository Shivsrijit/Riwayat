import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateCartQuantity, clearCart } = useAuth();
  const [isCheckedOut, setIsCheckedOut] = useState(false);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setIsCheckedOut(true);
    toast.success('Artisan order inquiry submitted successfully!');
    setTimeout(() => {
      clearCart();
      setIsCheckedOut(false);
      setIsCartOpen(false);
    }, 2500);
  };

  const handleRemove = (id: string, title: string) => {
    removeFromCart(id);
    toast.info(`Removed ${title} from cart`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md animate-ent-fade">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0D1322] border-l border-amber-500/20 text-amber-50 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif-heritage text-xl font-bold gold-gradient-text">
                  Artisan Inquiry Basket
                </h2>
                <p className="text-xs text-amber-300/60 font-mono">
                  {cart.length} Handcrafted {cart.length === 1 ? 'Item' : 'Items'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-amber-400 hover:text-white hover:bg-amber-500/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {isCheckedOut ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-ent-rise">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif-heritage text-2xl font-bold text-amber-100">
                  Order Request Transmitted!
                </h3>
                <p className="text-xs text-amber-200/70 max-w-xs">
                  Your direct order request has been sent to the artisan cooperative. They will reach out to confirm handweaving & shipping details.
                </p>
              </div>
            ) : cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-amber-500/30" />
                <p className="font-serif-heritage text-lg text-amber-200/80">Your basket is empty</p>
                <p className="text-xs text-amber-400/60 max-w-xs">
                  Browse our Artisan Marketplace to support rural weavers and traditional craft masters directly.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item._id}
                  className="p-4 rounded-xl bg-[#060A12] border border-amber-500/15 flex gap-4 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover border border-amber-500/20"
                  />
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] text-orange-400 font-mono uppercase">
                      {item.craftType || 'Handicraft'}
                    </span>
                    <h4 className="font-serif-heritage text-sm font-bold text-amber-100 line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs font-serif-heritage font-bold text-amber-400">
                      ₹{item.price.toLocaleString()}
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex items-center border border-amber-500/30 rounded bg-[#0D1322]">
                        <button
                          onClick={() => updateCartQuantity(item._id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-amber-300 hover:bg-amber-500/20"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono text-amber-100">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-amber-300 hover:bg-amber-500/20"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(item._id, item.title)}
                    className="p-2 text-amber-400/50 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && !isCheckedOut && (
            <div className="p-6 border-t border-amber-500/20 bg-[#0A0F1D] space-y-4">
              <div className="space-y-2 text-xs text-amber-200/80">
                <div className="flex justify-between">
                  <span>Craft Artifact Subtotal:</span>
                  <span className="font-mono font-bold text-amber-200">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Artisan Direct Fair Wage:</span>
                  <span>100% Guaranteed</span>
                </div>
                <div className="flex justify-between font-serif-heritage text-lg font-bold text-amber-300 pt-2 border-t border-amber-500/15">
                  <span>Total Inquiry Value:</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl"
              >
                <span>Transmit Order Inquiry to Artisan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
