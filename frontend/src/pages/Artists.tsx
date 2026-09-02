import React, { useEffect, useState } from 'react';
import { Search, Star, MapPin, Award, CheckCircle2, Phone, Mail, Compass, X } from 'lucide-react';
import { fetchArtists } from '../services/api';
import { toast } from 'sonner';

const Artists: React.FC = () => {
  const [artists, setArtists] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtistModal, setSelectedArtistModal] = useState<any | null>(null);
  const [bookedMap, setBookedMap] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchArtists().then(setArtists);
  }, []);

  const filteredArtists = artists.filter((artist) => {
    const matchesSearch =
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.craft.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleBookSession = (artist: any) => {
    setBookedMap((prev) => ({ ...prev, [artist._id]: true }));
    toast.success(`Requested master session with ${artist.name}`);
  };

  return (
    <div className="min-h-screen bg-[#060A12] text-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-amber-400 font-accent-cinzel">
            Living Heritage Masters
          </span>
          <h1 className="font-serif-heritage text-4xl sm:text-6xl font-bold gold-gradient-text">
            Meet the Artisans of India
          </h1>
          <p className="text-sm text-amber-200/70 leading-relaxed font-light">
            Connecting global art lovers and institutions directly with master craftsmen, weavers, painters, and folk musicians.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400/60" />
            <input
              type="text"
              placeholder="Search by artist name, craft form, or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D1322] border border-amber-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-400 shadow-xl"
            />
          </div>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => {
            const isBooked = bookedMap[artist._id];
            return (
              <div key={artist._id} className="glass-card rounded-xl p-6 text-center space-y-4 flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-amber-400/60 shadow-xl">
                    <img src={artist.image} alt={artist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                      {artist.craft}
                    </span>
                    <h3 className="font-serif-heritage text-lg font-bold text-amber-100">
                      {artist.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1 text-xs text-amber-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{artist.region}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-xs text-amber-300">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-bold">{artist.rating || 4.9}</span>
                    <span className="text-amber-400/50 font-normal">({artist.experienceYears || 25} Yrs Experience)</span>
                  </div>

                  <p className="text-xs text-amber-200/70 leading-relaxed line-clamp-3 font-light">
                    {artist.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-amber-500/10 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setSelectedArtistModal(artist)}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold"
                  >
                    Biography
                  </button>

                  {isBooked ? (
                    <span className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                      Session Requested
                    </span>
                  ) : (
                    <button
                      onClick={() => handleBookSession(artist)}
                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold text-xs shadow-md"
                    >
                      Book Master Class
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Artist Bio Modal */}
      {selectedArtistModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D1322] border border-amber-500/30 rounded-2xl max-w-lg w-full p-6 space-y-6 animate-ent-rise">
            <div className="flex items-start justify-between border-b border-amber-500/20 pb-4">
              <div className="flex items-center gap-3">
                <img src={selectedArtistModal.image} alt="" className="w-12 h-12 rounded-full object-cover border border-amber-400" />
                <div>
                  <h3 className="font-serif-heritage text-xl font-bold gold-gradient-text">{selectedArtistModal.name}</h3>
                  <p className="text-xs text-amber-300">{selectedArtistModal.craft} · {selectedArtistModal.region}</p>
                </div>
              </div>
              <button onClick={() => setSelectedArtistModal(null)} className="text-amber-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-amber-100/90 leading-relaxed font-light">
              <p className="font-medium text-amber-200">{selectedArtistModal.bio}</p>
              
              {selectedArtistModal.story && (
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-1">
                  <p className="font-bold text-amber-300">In the Artist's Words:</p>
                  <p className="italic text-amber-100/80">"{selectedArtistModal.story}"</p>
                </div>
              )}

              {selectedArtistModal.specialties && (
                <div className="space-y-1">
                  <p className="font-bold text-amber-300">Craft Specialties:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedArtistModal.specialties.map((spec: string, i: number) => (
                      <span key={i} className="bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded text-[10px]">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-amber-500/20">
              <button
                onClick={() => setSelectedArtistModal(null)}
                className="px-5 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Artists;