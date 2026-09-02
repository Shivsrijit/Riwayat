import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, ExternalLink, Search, Flame } from 'lucide-react';
import { fetchEvents } from '../services/api';

const RecentEvents: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] text-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-amber-400 font-accent-cinzel">
            Living Cultural Calendar
          </span>
          <h1 className="font-serif-heritage text-4xl sm:text-6xl font-bold gold-gradient-text">
            Cultural Events & Festivals
          </h1>
          <p className="text-sm sm:text-base text-amber-200/70 leading-relaxed font-light">
            Stay connected with annual literature meets, folk music gatherings, craft expos, and sacred temple dance festivals across India.
          </p>
        </div>

        {/* Search */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400/60" />
            <input
              type="text"
              placeholder="Search events, cities, or festivals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D1322] border border-amber-500/30 rounded-2xl pl-10 pr-4 py-3 text-xs text-amber-100 placeholder-amber-400/50 focus:outline-none shadow-xl"
            />
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div key={event._id} className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group">
              <div className="relative h-56 overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3 bg-amber-500 text-black font-bold text-xs px-3 py-1 rounded-full">
                  {event.category || 'Festival'}
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-amber-300 font-bold bg-black/70 px-2.5 py-1 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-amber-400/80">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{event.location}</span>
                  </div>

                  <h3 className="font-serif-heritage text-xl font-bold text-amber-100 group-hover:text-amber-300">
                    {event.title}
                  </h3>

                  <p className="text-xs text-amber-200/70 leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-amber-500/10">
                  {event.link ? (
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Festival Pass & Details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-amber-400/60 font-semibold block text-center">Entry details coming soon</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentEvents;