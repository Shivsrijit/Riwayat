import React from 'react';
import InteractiveMap from '../components/InteractiveMap';

const Destinations: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#060A12] text-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-cyan-400 font-accent-cinzel">
            Geographic Cultural Atlas
          </span>
          <h1 className="font-serif-heritage text-4xl sm:text-6xl font-bold gold-gradient-text">
            Cultural Monuments & Heritage Hotspots
          </h1>
          <p className="text-sm sm:text-base text-amber-200/70 leading-relaxed font-light">
            Interactive map featuring UNESCO World Heritage sites, Nagara stone temples, ancient stepwells, and living artisan villages across India.
          </p>
        </div>

        {/* Real Vector India Map Visualizer & Hotspots */}
        <InteractiveMap />
      </div>
    </div>
  );
};

export default Destinations;