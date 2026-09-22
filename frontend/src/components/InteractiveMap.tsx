import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Info, ExternalLink, Star, ChevronRight, Layers, Eye, ChevronDown } from 'lucide-react';
import L from 'leaflet';
import { fetchDestinations } from '../services/api';
import { toast } from 'sonner';

type MapTileStyle = 'osm' | 'esri' | 'cartodb';

const INDIAN_STATES = [
  'All Regions & States of India',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi (UT)'
];

const InteractiveMap: React.FC = () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<any | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [filterRegion, setFilterRegion] = useState('all');
  const [tileStyle, setTileStyle] = useState<MapTileStyle>('osm');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    fetchDestinations().then((data) => {
      setDestinations(data);
      if (data.length > 0) setSelectedDestination(data[0]);
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          toast.success('GPS Location Active for Travel Distance');
        },
        () => {
          setUserCoords({ lat: 28.6139, lng: 77.2090 });
        }
      );
    }
  }, []);

  // Map Tile Providers Config
  const TILE_PROVIDERS = {
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      name: 'OpenStreetMap Standard (Themed)'
    },
    esri: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      name: 'Esri Satellite 4K'
    },
    cartodb: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      name: 'Heritage Dark Atlas'
    }
  };

  // Init Leaflet Map with OpenStreetMap Default
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [22.5937, 78.9629],
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    const initialLayer = L.tileLayer(TILE_PROVIDERS.osm.url, {
      attribution: TILE_PROVIDERS.osm.attribution,
      maxZoom: 18,
    }).addTo(map);

    tileLayerRef.current = initialLayer;
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Tile Provider Switching
  const handleTileChange = (style: MapTileStyle) => {
    setTileStyle(style);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const newProvider = TILE_PROVIDERS[style];
    const newLayer = L.tileLayer(newProvider.url, {
      attribution: newProvider.attribution,
      maxZoom: 18,
    }).addTo(map);

    tileLayerRef.current = newLayer;
    toast.success(`Switched map provider to ${newProvider.name}`);
  };

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const filtered = destinations.filter(
      (d) => filterRegion === 'all' || d.region === filterRegion
    );

    filtered.forEach((dest) => {
      // Skip destinations with missing or invalid coordinates
      if (dest.lat == null || dest.lng == null || isNaN(dest.lat) || isNaN(dest.lng)) return;

      const isSelected = selectedDestination?._id === dest._id;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `
          <div style="
            width: ${isSelected ? '36px' : '30px'};
            height: ${isSelected ? '36px' : '30px'};
            background: ${isSelected ? '#D4A373' : '#0E1627'};
            border: 2px solid #FFF;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 20px ${isSelected ? 'rgba(212, 163, 115, 0.9)' : 'rgba(0, 0, 0, 0.8)'};
            cursor: pointer;
            transition: all 0.3s ease;
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${isSelected ? '#000' : '#D4A373'}" stroke-width="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });

      const marker = L.marker([dest.lat, dest.lng], { icon: customIcon }).addTo(map);

      marker.bindPopup(`
        <div style="width: 220px; padding: 4px; font-family: Outfit, sans-serif;">
          <img src="${dest.image}" style="width:100%; height:100px; object-fit:cover; border-radius:8px; margin-bottom:8px;" />
          <span style="color:#D4A373; font-size:10px; font-weight:bold; text-transform:uppercase;">${dest.heritage}</span>
          <strong style="color:#FFF; font-size:14px; display:block; margin-top:2px;">${dest.name}</strong>
          <span style="color:#aaa; font-size:11px;">${dest.region}</span>
        </div>
      `);

      marker.on('click', () => {
        setSelectedDestination(dest);
        toast.info(`Selected ${dest.name}`);
      });

      markersRef.current.push(marker);
    });
  }, [destinations, filterRegion, selectedDestination]);

  const calculateDistance = (lat2: number, lng2: number) => {
    if (!userCoords) return null;
    const R = 6371;
    const dLat = ((lat2 - userCoords.lat) * Math.PI) / 180;
    const dLng = ((lng2 - userCoords.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userCoords.lat * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Filter & Map Provider Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* All States & Union Territories Dropdown Filter */}
        <div className="flex items-center gap-3 bg-[#0D1322] border border-amber-500/30 px-4 py-2.5 rounded-xl shadow-lg">
          <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-xs font-bold text-amber-300 whitespace-nowrap">State / UT Filter:</span>
          <select
            value={filterRegion}
            onChange={(e) => {
              const val = e.target.value;
              setFilterRegion(val);
              toast.info(val === 'all' ? 'Showing all regions of India' : `Filtered by ${val}`);
            }}
            className="bg-[#060A12] border border-amber-500/40 rounded-lg px-3 py-1.5 text-xs text-amber-100 font-semibold focus:outline-none focus:border-amber-400 cursor-pointer shadow-inner"
          >
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state === 'All Regions & States of India' ? 'all' : state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Tile Layer Selector */}
        <div className="flex items-center justify-end gap-1.5 p-1 rounded-xl bg-[#0D1322] border border-amber-500/30 text-xs font-semibold">
          <button
            onClick={() => handleTileChange('osm')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              tileStyle === 'osm' ? 'bg-amber-400 text-black font-bold' : 'text-amber-300/70 hover:text-amber-200'
            }`}
          >
            OpenStreetMap
          </button>
          <button
            onClick={() => handleTileChange('esri')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              tileStyle === 'esri' ? 'bg-amber-400 text-black font-bold' : 'text-amber-300/70 hover:text-amber-200'
            }`}
          >
            Satellite 4K
          </button>
          <button
            onClick={() => handleTileChange('cartodb')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              tileStyle === 'cartodb' ? 'bg-amber-400 text-black font-bold' : 'text-amber-300/70 hover:text-amber-200'
            }`}
          >
            Heritage Dark
          </button>
        </div>
      </div>

      {/* Main Map Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Leaflet Map Stage Container with Dynamic Theme Class */}
        <div className={`lg:col-span-2 relative h-[560px] bg-[#0A0F1D] border border-amber-500/20 rounded-2xl overflow-hidden shadow-2xl map-theme-${tileStyle}`}>
          
          {/* Header Overlay over Map */}
          <div className="absolute top-4 left-4 z-[1000] bg-[#0D1322]/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-amber-500/30 flex items-center gap-3">
            <Layers className="w-4 h-4 text-amber-400" />
            <div>
              <h3 className="font-serif-heritage text-sm font-bold text-amber-100">
                Map of India Heritage Hotspots
              </h3>
              <p className="text-[10px] text-amber-300/70 font-mono">Provider: {TILE_PROVIDERS[tileStyle].name}</p>
            </div>
          </div>

          {/* Leaflet Map Container */}
          <div ref={mapContainerRef} className="w-full h-full z-10" />
        </div>

        {/* Selected Destination Detail Drawer */}
        {selectedDestination ? (
          <div className="glass-card rounded-2xl p-6 space-y-6 animate-ent-rise">
            <div className="relative h-48 rounded-xl overflow-hidden border border-amber-500/20">
              <img
                src={selectedDestination.image}
                alt={selectedDestination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent" />
              
              <div className="absolute top-3 left-3 bg-amber-400 text-black text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                {selectedDestination.heritage}
              </div>

              <div className="absolute bottom-3 left-3">
                <span className="text-xs text-amber-300 font-bold block">{selectedDestination.region}</span>
                <h4 className="font-serif-heritage text-xl font-bold text-white">
                  {selectedDestination.name}
                </h4>
              </div>
            </div>

            <div className="space-y-4 text-xs text-amber-100/80">
              <p className="leading-relaxed font-light">{selectedDestination.description}</p>

              {userCoords && selectedDestination.lat != null && selectedDestination.lng != null && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-300">
                    <Navigation className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold">Distance from your location:</span>
                  </div>
                  <span className="font-mono font-bold text-amber-200">
                    ~{calculateDistance(selectedDestination.lat, selectedDestination.lng)} km
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#0D1322] border border-amber-500/15">
                  <span className="text-amber-400/60 block text-[10px] uppercase">Best Season</span>
                  <span className="font-bold text-amber-200">{selectedDestination.bestTime}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0D1322] border border-amber-500/15">
                  <span className="text-amber-400/60 block text-[10px] uppercase">Entry Fee</span>
                  <span className="font-bold text-amber-200">{selectedDestination.entryFee}</span>
                </div>
              </div>

              {selectedDestination.highlights && (
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                    Heritage Highlights:
                  </span>
                  <ul className="space-y-1.5">
                    {selectedDestination.highlights.map((h: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-amber-400 flex-shrink-0">
                        <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-amber-500/15">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  selectedDestination.name + ' ' + selectedDestination.region
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Navigate via Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center text-amber-300/60 text-xs">
            Click any pin on the map of India to view detailed heritage guide.
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;