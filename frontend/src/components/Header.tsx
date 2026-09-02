import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import GlobalSearchModal from './GlobalSearchModal';

interface HeaderProps {
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const location = useLocation();
  const { user, cart, setIsCartOpen } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { label: 'Explore', path: '/' },
    { label: 'Creator Hub', path: '/stories' },
    { label: 'Masterclasses', path: '/workshops' },
    { label: 'Artisan Store', path: '/marketplace' },
    { label: 'Community', path: '/forum' },
    { label: 'Heritage Map', path: '/destinations' },
    { label: 'Events', path: '/recent-events' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0B0F19]/95 backdrop-blur-xl border-b border-amber-500/15 shadow-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-2 flex-nowrap">
            
            {/* Real Premium Brand Logo Asset */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <img
                src="/riwayat-logo.png"
                alt="RIWAYAT Heritage Crest Logo"
                className="w-10 h-10 sm:w-11 sm:h-11 object-contain rounded-xl border border-amber-500/30 p-0.5 shadow-xl group-hover:scale-105 transition-transform duration-300 bg-[#060A12]"
              />
              <div className="flex flex-col">
                <span className="font-serif-heritage text-xl sm:text-2xl font-bold tracking-widest gold-gradient-text leading-tight">
                  RIWAYAT
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-[0.2em] text-amber-300/70 font-accent-cinzel uppercase -mt-0.5">
                  Heritage Hub
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Compact & Non-wrapping) */}
            <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-2 whitespace-nowrap flex-shrink-0">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-2.5 py-1.5 text-xs xl:text-sm font-medium tracking-wide transition-all duration-200 ${
                      active
                        ? 'text-amber-300 font-semibold'
                        : 'text-amber-100/70 hover:text-amber-200'
                    }`}
                  >
                    <span>{link.label}</span>
                    {active && (
                      <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User Actions */}
            <div className="hidden lg:flex items-center space-x-2.5 flex-shrink-0">
              
              {/* Global Search Button */}
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-300 transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs font-semibold"
                aria-label="Search Heritage Portal"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300/70 hidden xl:inline">Search</span>
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-300 transition-all duration-300 hover:scale-105"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-amber-400 text-black text-[10px] sm:text-[11px] font-bold rounded-full flex items-center justify-center shadow-lg">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* Auth / Profile Button */}
              {user ? (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs xl:text-sm font-semibold transition-all shadow-md whitespace-nowrap"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-black font-bold flex items-center justify-center text-[11px]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg whitespace-nowrap"
                >
                  Join Community
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex lg:hidden items-center space-x-2">
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300"
              >
                <Search className="w-5 h-5 text-amber-400" />
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300"
              >
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-amber-200 hover:text-white bg-amber-500/10 border border-amber-500/30"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-amber-500/20 animate-ent-rise">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-amber-100/80 hover:bg-amber-500/10 hover:text-amber-200'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-amber-500/20">
                  {user ? (
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 font-semibold text-sm"
                    >
                      <span>My Dashboard</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onAuthClick();
                      }}
                      className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-sm shadow-lg"
                    >
                      Join RIWAYAT Community
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
};

export default Header;