import React, { useEffect, useState } from 'react';
import { ShoppingBag, Star, Filter, Search, CheckCircle2, ShieldCheck, Heart, ArrowRight, X } from 'lucide-react';
import { fetchProducts } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  const { addToCart } = useAuth();

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const handleAdd = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`Added ${product.title} to cart`);
  };

  const categories = [
    { id: 'all', label: 'All Artifacts' },
    { id: 'Paintings', label: 'Folk Paintings' },
    { id: 'Textiles', label: 'Handloom Textiles' },
    { id: 'Handicrafts', label: 'Bronze & Metal Craft' },
    { id: 'Pottery', label: 'Terracotta & Pottery' }
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.craftType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#060A12] text-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-orange-400 font-accent-cinzel">
            Fair Trade Artisan Marketplace
          </span>
          <h1 className="font-serif-heritage text-4xl sm:text-6xl font-bold gold-gradient-text">
            Handcrafted Indian Heritage Store
          </h1>
          <p className="text-sm text-amber-200/70 leading-relaxed font-light">
            Directly supporting rural craftsmen and indigenous weaving cooperatives. Every purchase preserves generational artisan skills.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-xl">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-orange-500 text-black shadow-md'
                    : 'bg-amber-500/10 text-amber-200/80 hover:bg-amber-500/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400/60" />
            <input
              type="text"
              placeholder="Search crafts & artisans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D1322] border border-amber-500/30 rounded-lg pl-9 pr-4 py-2 text-xs text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-orange-400"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="glass-card rounded-xl overflow-hidden p-4 space-y-4 flex flex-col justify-between group"
            >
              <div
                onClick={() => setQuickViewProduct(product)}
                className="relative h-60 rounded-lg overflow-hidden cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060A12]/80 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3 bg-black/80 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded">
                  {product.region}
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-amber-300 font-bold bg-black/60 px-2 py-0.5 rounded">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{product.rating || 4.9}</span>
                </div>
              </div>

              <div className="space-y-1.5 flex-1">
                <span className="text-[10px] uppercase font-bold text-orange-400 font-mono">
                  {product.craftType}
                </span>
                <h3
                  onClick={() => setQuickViewProduct(product)}
                  className="font-serif-heritage text-base font-bold text-amber-100 group-hover:text-orange-300 cursor-pointer line-clamp-1"
                >
                  {product.title}
                </h3>
                <p className="text-xs text-amber-200/70">Artisan: <span className="text-amber-200 font-semibold">{product.artisanName}</span></p>
              </div>

              <div className="pt-3 border-t border-amber-500/10 flex items-center justify-between">
                <span className="font-serif-heritage text-lg font-bold text-amber-400">
                  ₹{product.price.toLocaleString()}
                </span>

                <button
                  onClick={(e) => handleAdd(product, e)}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold text-xs shadow-md transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D1322] border border-amber-500/30 rounded-2xl max-w-2xl w-full p-6 space-y-6 animate-ent-rise">
            <div className="flex items-start justify-between border-b border-amber-500/20 pb-4">
              <div>
                <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
                  {quickViewProduct.craftType} · {quickViewProduct.region}
                </span>
                <h2 className="font-serif-heritage text-2xl font-bold gold-gradient-text mt-1">
                  {quickViewProduct.title}
                </h2>
              </div>
              <button
                onClick={() => setQuickViewProduct(null)}
                className="text-amber-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.title}
                className="w-full h-64 object-cover rounded-xl border border-amber-500/20"
              />

              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <p className="text-xs text-amber-200/80 leading-relaxed">
                    {quickViewProduct.description}
                  </p>
                  <p className="text-xs text-amber-300">
                    Artisan Origin: <strong className="text-amber-100">{quickViewProduct.artisanName}</strong>
                  </p>

                  {quickViewProduct.highlights && (
                    <div className="space-y-1 pt-2">
                      <p className="text-[10px] font-bold text-orange-400 uppercase">Craft Guarantee:</p>
                      <ul className="space-y-1">
                        {quickViewProduct.highlights.map((h: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-1.5 text-xs text-amber-100/90">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-3 border-t border-amber-500/15">
                  <span className="font-serif-heritage text-2xl font-bold text-amber-400 block">
                    ₹{quickViewProduct.price.toLocaleString()}
                  </span>

                  <button
                    onClick={(e) => {
                      handleAdd(quickViewProduct, e);
                      setQuickViewProduct(null);
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-xs shadow-lg"
                  >
                    Add to Cart & Support Artisan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;