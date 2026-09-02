import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Play, BookOpen, ShoppingBag, Users, Calendar, Award, Star, Compass, ChevronRight, Flame, Search, ShieldCheck, FileText, Globe, Landmark, Palette } from 'lucide-react';
import { fetchStories, fetchDestinations, fetchEvents, fetchProducts, fetchWorkshops } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const HERO_SLIDES = [
  {
    id: 'slide-1',
    category: 'LIVING HANDLOOM HERITAGE',
    title: 'RIWAYAT',
    subtitle: 'Rediscovering Roots, Reviving Indian Heritage',
    description: 'Empowering traditional master craftsmen, weavers, folklorists, and independent journalists to preserve India dying arts and sacred monuments.',
    bgImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1600&q=80',
    stat: '10,000+ Archives & Living Arts',
    ctaLink: '/stories'
  },
  {
    id: 'slide-2',
    category: 'SACRED PERFORMANCE RITUALS',
    title: 'RIWAYAT',
    subtitle: 'Mystic Kathakali Mudras & Folk Ballads of Malabar',
    description: 'Step into pre-dawn temple ritual preparations where Kathakali performers apply natural mineral pigments to transform into cosmic figures.',
    bgImage: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1600&q=80',
    stat: '1,500+ Registered Artisans',
    ctaLink: '/workshops'
  },
  {
    id: 'slide-3',
    category: 'MONUMENTS & ARCHITECTURE',
    title: 'RIWAYAT',
    subtitle: 'Interactive Leaflet Map of Indian Heritage Hotspots',
    description: 'Explore UNESCO heritage monuments, Nagara stone carvings, and traditional artisan villages on an interactive vector map of India.',
    bgImage: 'https://images.unsplash.com/photo-1600011689032-8b628b8a874b?auto=format&fit=crop&w=1600&q=80',
    stat: '28 States & 8 UTs Covered',
    ctaLink: '/destinations'
  }
];

const PORTAL_CATEGORIES = [
  { name: 'Cultural Archives', icon: FileText, path: '/stories', color: 'from-amber-500/20 to-orange-500/10' },
  { name: 'Masterclass Academy', icon: Award, path: '/workshops', color: 'from-emerald-500/20 to-teal-500/10' },
  { name: 'Artisan Store', icon: ShoppingBag, path: '/marketplace', color: 'from-orange-500/20 to-amber-500/10' },
  { name: 'Heritage Map', icon: Globe, path: '/destinations', color: 'from-cyan-500/20 to-blue-500/10' },
  { name: 'Folk Performing Arts', icon: Palette, path: '/recent-events', color: 'from-purple-500/20 to-pink-500/10' },
  { name: 'Living Masters', icon: Users, path: '/artists', color: 'from-yellow-500/20 to-amber-500/10' }
];

const Home: React.FC = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [globalSearch, setGlobalSearch] = useState('');
  const [stories, setStories] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [workshops, setWorkshops] = useState<any[]>([]);
  const navigate = useNavigate();
  const { addToCart } = useAuth();

  const activeSlide = HERO_SLIDES[activeSlideIndex];

  // Auto-advancing moving hero slides every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchStories().then(setStories);
    fetchDestinations().then(setDestinations);
    fetchProducts().then(setProducts);
    fetchWorkshops().then(setWorkshops);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    toast.info(`Searching Riwayat portal for "${globalSearch}"`);
    navigate(`/stories?search=${encodeURIComponent(globalSearch)}`);
  };

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`Added ${product.title} to cart`);
  };

  return (
    <div className="min-h-screen bg-[#060A12] text-amber-50 selection:bg-amber-500 selection:text-black">
      
      {/* 1. GRAND INDIAN CULTURE PORTAL HERO STAGE */}
      <section className="relative w-full min-h-[640px] pt-12 pb-20 overflow-hidden border-b border-amber-500/15 flex items-center">
        
        {/* Background Slides */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeSlideIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={slide.bgImage}
              alt={slide.title}
              className="w-full h-full object-cover filter brightness-[0.28] contrast-110 transform transition-transform duration-7000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060A12] via-[#060A12]/60 to-[#060A12]/40" />
          </div>
        ))}

        {/* Hero Content Stage */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 animate-ent-rise">
          
          {/* Government Portal Style Header Filigree */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-accent-cinzel font-bold uppercase tracking-widest shadow-xl">
            <Landmark className="w-4 h-4 text-amber-400" />
            <span>INDIAN CULTURE REPOSITORY & LIVING TRADITIONS</span>
          </div>

          {/* Primary Hero Title */}
          <div className="space-y-3">
            <h1 className="font-serif-heritage text-5xl sm:text-7xl lg:text-8xl font-black tracking-wider gold-gradient-text drop-shadow-2xl">
              {activeSlide.title}
            </h1>
            <p className="font-accent-cinzel text-lg sm:text-2xl text-amber-200/90 font-medium tracking-wide">
              {activeSlide.subtitle}
            </p>
          </div>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-amber-100/80 leading-relaxed font-light">
            {activeSlide.description}
          </p>

          {/* National Cultural Search Engine Bar (Inspired by IndianCulture.gov.in) */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative shadow-2xl">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-4 text-amber-400/70" />
              <input
                type="text"
                placeholder="Search rare archives, master craftsmen, monuments, performing arts..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full bg-[#0D1322]/90 backdrop-blur-xl border border-amber-500/40 rounded-2xl pl-12 pr-32 py-4 text-xs sm:text-sm text-amber-100 placeholder-amber-300/50 focus:outline-none focus:border-amber-400 shadow-2xl"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Slide Progress Indicators */}
          <div className="flex items-center justify-center gap-3 pt-4">
            {HERO_SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => setActiveSlideIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeSlideIndex ? 'w-8 bg-amber-400' : 'w-2 bg-amber-500/40'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. PORTAL QUICK LAUNCH CATEGORY TILES (Inspired by Indian Culture Portal) */}
      <section className="py-12 bg-[#080D1A] border-b border-amber-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-8">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-400 font-accent-cinzel">
              Explore Cultural Repositories
            </span>
            <h2 className="font-serif-heritage text-2xl sm:text-3xl font-bold gold-gradient-text">
              National Heritage Quick Categories
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {PORTAL_CATEGORIES.map((cat, idx) => {
              const IconComponent = cat.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(cat.path)}
                  className={`p-4 rounded-xl bg-gradient-to-b ${cat.color} border border-amber-500/20 hover:border-amber-400 text-center space-y-3 transition-all duration-300 hover:-translate-y-1 shadow-lg group`}
                >
                  <div className="w-10 h-10 mx-auto rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="font-serif-heritage text-xs font-bold text-amber-100 group-hover:text-amber-300 block">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. PINTEREST EDITORIAL FEATURED STORIES */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-amber-400 font-accent-cinzel">
              Living Cultural Documentation
            </span>
            <h2 className="font-serif-heritage text-3xl sm:text-4xl font-bold gold-gradient-text">
              Field Stories & Rare Heritage Notes
            </h2>
          </div>
          <Link
            to="/stories"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
          >
            <span>Explore All 20 Stories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Pinterest-Style Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.slice(0, 3).map((story) => (
            <div
              key={story._id}
              onClick={() => navigate('/stories')}
              className="glass-card rounded-xl overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#0B0F19]/90 border border-amber-500/30 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase">
                  {story.category}
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400/80 font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{story.region}</span>
                  </div>
                  <h3 className="font-serif-heritage text-lg font-bold text-amber-100 group-hover:text-amber-300 line-clamp-2">
                    {story.title}
                  </h3>
                  <p className="text-xs text-amber-200/70 line-clamp-2 leading-relaxed font-light">
                    {story.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-amber-500/10 flex items-center justify-between text-xs text-amber-300/80">
                  <span>By {story.author}</span>
                  <span className="text-amber-400 font-semibold">Read Documentation</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ARTISAN STORE SPOTLIGHT */}
      <section className="py-16 bg-[#080D1A] border-t border-amber-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-orange-400 font-accent-cinzel">
                Authentic Handcrafted Treasures
              </span>
              <h2 className="font-serif-heritage text-3xl font-bold text-amber-100">
                Direct Artisan Fair-Trade Store
              </h2>
            </div>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300"
            >
              <span>Browse Full Store</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {products.slice(0, 3).map((product) => (
              <div key={product._id} className="glass-card rounded-xl p-4 space-y-3 flex flex-col justify-between">
                <div className="relative h-56 rounded-lg overflow-hidden">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-black/80 text-amber-300 text-[10px] px-2 py-0.5 rounded font-bold">
                    {product.region}
                  </div>
                </div>

                <div className="space-y-1 flex-1">
                  <span className="text-[10px] uppercase font-bold text-orange-400 font-mono">
                    {product.craftType}
                  </span>
                  <h3 className="font-serif-heritage text-base font-bold text-amber-100 line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-xs text-amber-200/70">Artisan: {product.artisanName}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-amber-500/10">
                  <span className="font-serif-heritage text-lg font-bold text-amber-400">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-xs"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;