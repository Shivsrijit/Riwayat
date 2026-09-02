import React, { useEffect, useState } from 'react';
import { MapPin, ThumbsUp, Plus, Search, BookOpen, Briefcase, Award, ExternalLink, Clock, Share2, X } from 'lucide-react';
import { fetchStories, fetchCreatorJobs } from '../services/api';
import AddStoryForm from '../components/AddStoryForm';
import { toast } from 'sonner';

const Stories: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stories' | 'jobs'>('stories');
  const [stories, setStories] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [activeStoryReader, setActiveStoryReader] = useState<any | null>(null);

  useEffect(() => {
    fetchStories().then(setStories);
    fetchCreatorJobs().then(setJobs);
  }, []);

  const categories = [
    { id: 'all', label: 'All Heritage Stories' },
    { id: 'art', label: 'Art & Crafts' },
    { id: 'dance', label: 'Classical Dance' },
    { id: 'food', label: 'Culinary Traditions' },
    { id: 'festivals', label: 'Festivals & Rituals' },
    { id: 'traditions', label: 'Indigenous Traditions' }
  ];

  const filteredStories = stories.filter((story) => {
    const matchesCat = selectedCategory === 'all' || story.category === selectedCategory;
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleStoryAdded = (newStory: any) => {
    setStories([newStory, ...stories]);
    setIsSubmitModalOpen(false);
    toast.success('Your story has been submitted for publication!');
  };

  const handleUpvote = (storyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStories((prev) =>
      prev.map((s) => (s._id === storyId ? { ...s, upvotes: (s.upvotes || 0) + 1 } : s))
    );
    toast.success('Story upvoted!');
  };

  return (
    <div className="min-h-screen bg-[#060A12] text-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-amber-400 font-accent-cinzel">
              Riwayat Digital Creator Hub
            </span>
            <h1 className="font-serif-heritage text-4xl sm:text-6xl font-bold gold-gradient-text">
              Cultural Heritage Documentation
            </h1>
            <p className="text-sm text-amber-200/70 max-w-2xl font-light">
              Empowering creators, vloggers, bloggers, and journalists to document and publish Indian traditions, indigenous crafts, and vanishing rituals for future generations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold text-xs shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Cultural Story</span>
            </button>
          </div>
        </div>

        {/* Clean Glassmorphic Segmented Navigation Bar with Pixel-Perfect Icon Colors */}
        <div className="inline-flex p-1 rounded-xl bg-[#0D1322] border border-amber-500/30 shadow-xl gap-1">
          <button
            onClick={() => setActiveTab('stories')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'stories'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-amber-200/70 hover:text-amber-200 hover:bg-amber-500/10'
            }`}
          >
            <BookOpen className={`w-4 h-4 ${activeTab === 'stories' ? 'text-black' : 'text-amber-400'}`} />
            <span>Published Stories ({filteredStories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'jobs'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-amber-200/70 hover:text-amber-200 hover:bg-amber-500/10'
            }`}
          >
            <Briefcase className={`w-4 h-4 ${activeTab === 'jobs' ? 'text-black' : 'text-amber-400'}`} />
            <span>Creator Jobs & Grants ({jobs.length})</span>
          </button>
        </div>

        {/* STORIES TAB CONTENT */}
        {activeTab === 'stories' && (
          <div className="space-y-8">
            
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-xl">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-amber-400 text-black shadow-md'
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
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0D1322] border border-amber-500/30 rounded-lg pl-9 pr-4 py-2 text-xs text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Grid of Stories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map((story) => (
                <div
                  key={story._id}
                  onClick={() => setActiveStoryReader(story)}
                  className="glass-card rounded-xl overflow-hidden cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060A12] via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 bg-amber-500/90 text-black font-bold px-2.5 py-0.5 rounded text-[10px] uppercase">
                      {story.category}
                    </div>

                    <div className="absolute top-3 right-3 bg-black/70 text-amber-300 text-[10px] px-2 py-0.5 rounded font-mono">
                      {story.readTime || '5 min read'}
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

                      <p className="text-xs text-amber-200/70 leading-relaxed line-clamp-3 font-light">
                        {story.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-amber-500/10 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-amber-200">{story.author}</p>
                        <p className="text-amber-400/60 text-[10px]">{story.authorRole || 'Creator'}</p>
                      </div>

                      <button
                        onClick={(e) => handleUpvote(story._id, e)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 transition-all"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="font-bold text-xs">{story.upvotes || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CREATOR JOBS & GRANTS TAB CONTENT */}
        {activeTab === 'jobs' && (
          <div className="space-y-6 animate-ent-rise">
            <div className="p-6 rounded-2xl glass-panel-gold space-y-2">
              <h2 className="font-serif-heritage text-2xl font-bold gold-gradient-text">
                Grants & Residencies for Cultural Creators
              </h2>
              <p className="text-xs text-amber-200/80 max-w-2xl leading-relaxed">
                RIWAYAT offers direct grants, field residencies, and documentary commissions for creators preserving Indian traditions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <div key={job._id} className="glass-card p-6 rounded-xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase">
                        {job.type}
                      </span>
                      <span className="text-xs text-amber-400 font-mono">Deadline: {job.deadline}</span>
                    </div>

                    <h3 className="font-serif-heritage text-xl font-bold text-amber-100">
                      {job.title}
                    </h3>
                    <p className="text-xs text-amber-300 font-semibold">{job.organization} · {job.region}</p>

                    <div className="p-3 rounded-xl bg-[#0D1322] border border-amber-500/20 font-serif-heritage text-lg font-bold text-emerald-400">
                      {job.grantAmount}
                    </div>

                    <p className="text-xs text-amber-100/80 leading-relaxed font-light">
                      {job.description}
                    </p>

                    {job.requirements && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-amber-300 uppercase">Requirements:</p>
                        <ul className="list-disc list-inside text-xs text-amber-200/70 space-y-1">
                          {job.requirements.map((req: string, i: number) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-amber-500/15">
                    <a
                      href={job.link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => toast.info(`Applying for ${job.title}`)}
                      className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <span>Apply for Grant</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Story Reader Drawer */}
      {activeStoryReader && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D1322] border border-amber-500/30 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 animate-ent-rise">
            <div className="flex items-start justify-between border-b border-amber-500/20 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  {activeStoryReader.category} · {activeStoryReader.region}
                </span>
                <h2 className="font-serif-heritage text-2xl sm:text-3xl font-bold gold-gradient-text">
                  {activeStoryReader.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveStoryReader(null)}
                className="text-amber-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={activeStoryReader.image}
              alt={activeStoryReader.title}
              className="w-full h-72 object-cover rounded-xl border border-amber-500/20"
            />

            <div className="flex items-center justify-between text-xs text-amber-300/80 p-3 rounded-xl bg-amber-500/5">
              <span>Documented by: <strong>{activeStoryReader.author}</strong> ({activeStoryReader.authorRole})</span>
              <span>Read Time: {activeStoryReader.readTime}</span>
            </div>

            <div className="prose prose-invert text-amber-100/90 text-sm leading-relaxed space-y-4 font-light">
              <p className="text-base font-medium text-amber-200">
                {activeStoryReader.description}
              </p>
              <p>
                {activeStoryReader.content ||
                  "This deep cultural documentation traces ancient techniques passed down through generations of oral masters and family workshops. Through living preservation efforts, communities retain their sacred traditions while creating sustainable livelihoods."}
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-amber-500/20">
              {activeStoryReader.link ? (
                <a
                  href={activeStoryReader.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:underline"
                >
                  <span>View Original Publication</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : <div />}

              <button
                onClick={() => setActiveStoryReader(null)}
                className="px-5 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Story Form Modal */}
      {isSubmitModalOpen && (
        <AddStoryForm
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          onStoryAdded={handleStoryAdded}
        />
      )}
    </div>
  );
};

export default Stories;