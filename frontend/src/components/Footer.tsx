import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass, Landmark } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#070B14] border-t border-amber-500/20 text-amber-100/70 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-amber-500/10">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/riwayat-logo.png"
                alt="RIWAYAT Heritage Crest Logo"
                className="w-10 h-10 object-contain rounded-xl border border-amber-500/30 p-0.5 shadow-lg bg-[#060A12]"
              />
              <span className="font-serif-heritage text-2xl font-bold gold-gradient-text">
                RIWAYAT
              </span>
            </div>
            <p className="text-xs text-amber-200/60 leading-relaxed font-light">
              Rediscovering roots, reviving traditions. Empowering creators, vloggers, and local artisans to document and preserve India's cultural heritage.
            </p>
          </div>

          {/* Column 2: Ecosystem */}
          <div className="space-y-3">
            <h3 className="font-serif-heritage text-base font-bold text-amber-100">Heritage Modules</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/stories" className="hover:text-amber-400 transition-colors">Creator Hub & Field Stories</Link></li>
              <li><Link to="/workshops" className="hover:text-amber-400 transition-colors">Masterclasses & Workshops</Link></li>
              <li><Link to="/marketplace" className="hover:text-amber-400 transition-colors">Artisan Handcrafted Marketplace</Link></li>
              <li><Link to="/destinations" className="hover:text-amber-400 transition-colors">Interactive Cultural Hotspots Map</Link></li>
            </ul>
          </div>

          {/* Column 3: Community */}
          <div className="space-y-3">
            <h3 className="font-serif-heritage text-base font-bold text-amber-100">Community & Forum</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/forum" className="hover:text-amber-400 transition-colors">Discussion Boards</Link></li>
              <li><Link to="/artists" className="hover:text-amber-400 transition-colors">Craftsman Directory</Link></li>
              <li><Link to="/recent-events" className="hover:text-amber-400 transition-colors">Cultural Festivals Calendar</Link></li>
              <li><Link to="/dashboard" className="hover:text-amber-400 transition-colors">Creator Dashboard</Link></li>
            </ul>
          </div>

          {/* Column 4: National Heritage Initiative */}
          <div className="space-y-3">
            <h3 className="font-serif-heritage text-base font-bold text-amber-100">Riwayat Initiative</h3>
            <p className="text-xs text-amber-200/60 leading-relaxed">
              National Digital Platform dedicated to preserving and empowering Indian cultural traditions, crafts, and master artisans.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amber-400/50">
          <p>© {new Date().getFullYear()} RIWAYAT. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Preserving Indian traditions with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;