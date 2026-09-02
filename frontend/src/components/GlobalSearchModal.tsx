import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, ShoppingBag, Award, MapPin, Users, Calendar, ArrowRight } from 'lucide-react';
import { fetchStories, fetchProducts, fetchWorkshops, fetchDestinations, fetchArtists, fetchEvents } from '../services/api';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [stories, setStories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchStories().then(setStories);
      fetchProducts().then(setProducts);
      fetchWorkshops().then(setWorkshops);
      fetchDestinations().then(setDestinations);
      fetchArtists().then(setArtists);
      fetchEvents().then(setEvents);
    }
  }, [isOpen]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingStories = q ? stories.filter(s => s.title.toLowerCase().includes(q) || s.region?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q)) : [];
  const matchingProducts = q ? products.filter(p => p.title.toLowerCase().includes(q) || p.craftType?.toLowerCase().includes(q) || p.region?.toLowerCase().includes(q)) : [];
  const matchingWorkshops = q ? workshops.filter(w => w.title.toLowerCase().includes(q) || w.instructor?.toLowerCase().includes(q)) : [];
  const matchingDestinations = q ? destinations.filter(d => d.name.toLowerCase().includes(q) || d.region?.toLowerCase().includes(q)) : [];
  const matchingArtists = q ? artists.filter(a => a.name.toLowerCase().includes(q) || a.craft?.toLowerCase().includes(q)) : [];
  const matchingEvents = q ? events.filter(e => e.title.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q)) : [];

  const totalResults = matchingStories.length + matchingProducts.length + matchingWorkshops.length + matchingDestinations.length + matchingArtists.length + matchingEvents.length;

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center pt-20 px-4">
      <div className="bg-[#0D1322] border border-amber-500/30 rounded-2xl max-w-3xl w-full p-6 space-y-6 shadow-2xl animate-ent-rise">
        
        {/* Search Bar Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search across all Indian Heritage archives, crafts, masterclasses, monuments..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#060A12] border border-amber-500/40 rounded-xl pl-12 pr-12 py-3.5 text-sm text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-400 font-medium shadow-inner"
          />
          <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Display */}
        <div className="max-h-[60vh] overflow-y-auto space-y-6 pr-2">
          {!q ? (
            <div className="text-center py-10 text-amber-300/60 text-xs space-y-2">
              <p className="font-semibold text-amber-200">Start typing to search Indian Cultural Heritage</p>
              <p>Try searching: "Banarasi", "Kathakali", "Khajuraho", "Madhubani", "Pashmina", "Hampi"</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-10 text-amber-400/60 text-xs font-serif-heritage">
              No matching cultural items found for "{query}". Try searching another keyword.
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Destinations */}
              {matchingDestinations.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Monuments & Hotspots ({matchingDestinations.length})</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchingDestinations.slice(0, 4).map((d) => (
                      <div
                        key={d._id}
                        onClick={() => handleSelect('/destinations')}
                        className="p-2.5 rounded-xl bg-[#060A12] border border-amber-500/15 hover:border-amber-400 flex items-center gap-3 cursor-pointer group"
                      >
                        <img src={d.image} alt={d.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif-heritage text-xs font-bold text-amber-100 group-hover:text-amber-300 truncate">{d.name}</h4>
                          <p className="text-[10px] text-amber-300/60">{d.region}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stories */}
              {matchingStories.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Cultural Stories & Documentation ({matchingStories.length})</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchingStories.slice(0, 4).map((s) => (
                      <div
                        key={s._id}
                        onClick={() => handleSelect('/stories')}
                        className="p-2.5 rounded-xl bg-[#060A12] border border-amber-500/15 hover:border-amber-400 flex items-center gap-3 cursor-pointer group"
                      >
                        <img src={s.image} alt={s.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif-heritage text-xs font-bold text-amber-100 group-hover:text-amber-300 truncate">{s.title}</h4>
                          <p className="text-[10px] text-amber-300/60">{s.category} · {s.region}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {matchingProducts.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Handcrafted Products ({matchingProducts.length})</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchingProducts.slice(0, 4).map((p) => (
                      <div
                        key={p._id}
                        onClick={() => handleSelect('/marketplace')}
                        className="p-2.5 rounded-xl bg-[#060A12] border border-amber-500/15 hover:border-amber-400 flex items-center gap-3 cursor-pointer group"
                      >
                        <img src={p.image} alt={p.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif-heritage text-xs font-bold text-amber-100 group-hover:text-amber-300 truncate">{p.title}</h4>
                          <p className="text-[10px] text-amber-400 font-bold">₹{p.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Workshops */}
              {matchingWorkshops.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Masterclass Workshops ({matchingWorkshops.length})</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchingWorkshops.slice(0, 4).map((w) => (
                      <div
                        key={w._id}
                        onClick={() => handleSelect('/workshops')}
                        className="p-2.5 rounded-xl bg-[#060A12] border border-amber-500/15 hover:border-amber-400 flex items-center gap-3 cursor-pointer group"
                      >
                        <img src={w.image} alt={w.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif-heritage text-xs font-bold text-amber-100 group-hover:text-amber-300 truncate">{w.title}</h4>
                          <p className="text-[10px] text-amber-300/60">{w.instructor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        <div className="pt-3 border-t border-amber-500/15 flex items-center justify-between text-xs text-amber-300/60">
          <span>Showing results across 8 cultural databases</span>
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-amber-400 text-black font-bold text-xs">
            Close Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
