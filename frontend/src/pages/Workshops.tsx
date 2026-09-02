import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, Star, Clock, BookOpen, User, Award, ShieldCheck, Search, X } from 'lucide-react';
import { fetchWorkshops } from '../services/api';
import { toast } from 'sonner';

const Workshops: React.FC = () => {
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWorkshopModal, setActiveWorkshopModal] = useState<any | null>(null);
  const [enrolledMap, setEnrolledMap] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchWorkshops().then(setWorkshops);
  }, []);

  const categories = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'Visual Arts', label: 'Visual & Folk Arts' },
    { id: 'Pottery & Crafts', label: 'Pottery & Sculpture' },
    { id: 'Textiles', label: 'Weaving & Dyeing' },
    { id: 'Music & Dance', label: 'Folk Music & Dance' }
  ];

  const filteredWorkshops = workshops.filter((w) => {
    const matchesCat = selectedCategory === 'all' || w.category === selectedCategory;
    const matchesSearch =
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleEnroll = (workshop: any) => {
    setEnrolledMap((prev) => ({ ...prev, [workshop._id]: true }));
    toast.success(`Enrolled in ${workshop.title}`);
  };

  return (
    <div className="min-h-screen bg-[#060A12] text-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-emerald-400 font-accent-cinzel">
            Riwayat Traditional Learning Academy
          </span>
          <h1 className="font-serif-heritage text-4xl sm:text-6xl font-bold gold-gradient-text">
            Masterclasses & Skill Workshops
          </h1>
          <p className="text-sm text-amber-200/70 leading-relaxed font-light">
            Preserving indigenous Indian craftsmanship through direct master-to-student digital workshops. Learn ancient techniques directly from National Awardee artisans.
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
                    ? 'bg-emerald-500 text-black shadow-md'
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
              placeholder="Search masterclasses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D1322] border border-amber-500/30 rounded-lg pl-9 pr-4 py-2 text-xs text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {/* Workshops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkshops.map((workshop) => {
            const isEnrolled = enrolledMap[workshop._id];
            return (
              <div
                key={workshop._id}
                className="glass-card rounded-xl overflow-hidden flex flex-col justify-between group"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={workshop.image}
                    alt={workshop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060A12] via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3 bg-emerald-500 text-black font-bold px-2.5 py-0.5 rounded text-[10px] uppercase">
                    {workshop.difficulty}
                  </div>

                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-amber-200 font-medium">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{workshop.duration}</span>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-amber-400/80 font-semibold">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{workshop.rating} ({workshop.enrolledCount} Enrolled)</span>
                      </span>
                      <span>{workshop.region}</span>
                    </div>

                    <h3 className="font-serif-heritage text-lg font-bold text-amber-100 group-hover:text-emerald-300">
                      {workshop.title}
                    </h3>

                    <p className="text-xs text-amber-200/70 line-clamp-2 leading-relaxed font-light">
                      {workshop.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-amber-500/10 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                        {workshop.instructor.charAt(0)}
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-amber-200">{workshop.instructor}</p>
                        <p className="text-amber-400/60 text-[10px]">{workshop.instructorTitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-serif-heritage text-lg font-bold text-emerald-400">
                        ₹{workshop.price}
                      </span>

                      {isEnrolled ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/40">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Enrolled</span>
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveWorkshopModal(workshop)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold"
                          >
                            Syllabus
                          </button>
                          <button
                            onClick={() => handleEnroll(workshop)}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md"
                          >
                            Enroll
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Workshop Syllabus Modal */}
      {activeWorkshopModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D1322] border border-amber-500/30 rounded-2xl max-w-xl w-full p-6 space-y-6 animate-ent-rise">
            <div className="flex items-start justify-between border-b border-amber-500/20 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Course Syllabus
                </span>
                <h3 className="font-serif-heritage text-2xl font-bold gold-gradient-text mt-1">
                  {activeWorkshopModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveWorkshopModal(null)}
                className="text-amber-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 flex items-center justify-between text-xs">
                <div>
                  <p className="text-amber-300 font-semibold">Master Instructor</p>
                  <p className="text-amber-100">{activeWorkshopModal.instructor}</p>
                </div>
                <div>
                  <p className="text-amber-300 font-semibold">Total Duration</p>
                  <p className="text-amber-100">{activeWorkshopModal.duration}</p>
                </div>
              </div>

              <h4 className="font-semibold text-xs text-amber-200 uppercase tracking-wider">Curriculum Modules:</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {activeWorkshopModal.syllabus?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#060A12] border border-amber-500/10 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <Play className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="text-amber-100 font-medium">{item.title}</span>
                    </div>
                    <span className="text-amber-400/60 font-mono text-[11px]">{item.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-amber-500/20">
              <button
                onClick={() => setActiveWorkshopModal(null)}
                className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEnroll(activeWorkshopModal);
                  setActiveWorkshopModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg"
              >
                Confirm Enrollment (₹{activeWorkshopModal.price})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workshops;
