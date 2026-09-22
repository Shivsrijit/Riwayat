import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Compass, BookOpen, ShoppingBag, Award, LogOut, ShieldCheck, MapPin, Plus, ExternalLink, Star, CheckCircle2, Bookmark, FileText, ChevronRight, Crown, Sparkles, Loader2, Wand2, X, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddStoryForm from '../components/AddStoryForm';
import { fetchStories, fetchWorkshops } from '../services/api';
import { toast } from 'sonner';
import { generateHeritageStory, GeneratedStory } from '../services/aiService';

// Official Heritage Badges Data Model
const CULTURAL_HERITAGE_BADGES = [
  {
    id: 'badge-1',
    title: 'Parampara Ratna',
    subtext: 'Rashtriya Cultural Jewel',
    category: 'Documentation',
    icon: Award,
    colorTheme: 'from-amber-500 via-amber-400 to-orange-500',
    borderColor: 'border-amber-400/50',
    glowColor: 'shadow-glow-gold',
    badgeSeal: 'LEVEL II FELLOW',
    criteria: 'Published field stories on vanishing Indian crafts'
  },
  {
    id: 'badge-2',
    title: 'Hastkala Sanrakshak',
    subtext: 'Master Craft Protector',
    category: 'Direct Fair-Trade',
    icon: ShieldCheck,
    colorTheme: 'from-emerald-500 via-teal-400 to-emerald-600',
    borderColor: 'border-emerald-400/50',
    glowColor: 'shadow-[0_0_20px_rgba(52,211,153,0.3)]',
    badgeSeal: 'VERIFIED PATRON',
    criteria: 'Supported rural handloom weavers & direct fair-wage orders'
  },
  {
    id: 'badge-3',
    title: 'Guru-Shishya Scholar',
    subtext: 'Living Traditions Fellow',
    category: 'Masterclasses',
    icon: BookOpen,
    colorTheme: 'from-orange-500 via-amber-500 to-yellow-500',
    borderColor: 'border-orange-400/50',
    glowColor: 'shadow-glow-terracotta',
    badgeSeal: 'ACADEMY HONORS',
    criteria: 'Completed masterclass modules under master gurus'
  },
  {
    id: 'badge-4',
    title: 'Dharohar Yatri',
    subtext: 'UNESCO Monument Chronicler',
    category: 'Heritage Map',
    icon: Compass,
    colorTheme: 'from-cyan-500 via-blue-400 to-teal-500',
    borderColor: 'border-cyan-400/50',
    glowColor: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]',
    badgeSeal: 'CHRONICLER',
    criteria: 'Mapped & bookmarked sacred monuments on the Leaflet map'
  }
];

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'stories' | 'workshops' | 'saved' | 'badges'>('badges');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const [userStories, setUserStories] = useState<any[]>([]);
  const [userWorkshops, setUserWorkshops] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // AI Story Generator state
  const [isAIStoryOpen, setIsAIStoryOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGeneratedStory, setAiGeneratedStory] = useState<GeneratedStory | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoadingData(true);
      try {
        const [storiesData, workshopsData] = await Promise.all([
          fetchStories(),
          fetchWorkshops()
        ]);
        setUserStories(storiesData.slice(0, 4));
        setUserWorkshops(workshopsData.slice(0, 2));
      } catch (e) {
        console.warn('Dashboard data fetch error:', e);
      } finally {
        setLoadingData(false);
      }
    };
    loadDashboardData();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#060A12] text-amber-50 flex items-center justify-center p-4">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center space-y-6 max-w-md animate-ent-rise">
          <img
            src="/riwayat-logo.png"
            alt="RIWAYAT Crest"
            className="w-16 h-16 object-contain mx-auto rounded-2xl border border-amber-500/40 p-1 bg-[#060A12] shadow-2xl"
          />
          <div className="space-y-2">
            <h2 className="font-serif-heritage text-3xl font-bold gold-gradient-text">
              Heritage Passport Required
            </h2>
            <p className="text-xs text-amber-200/70 leading-relaxed font-light">
              Please sign in or create a creator account to access your personal Riwayat Heritage Passport & Creator Studio.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-xs uppercase tracking-wider shadow-xl"
          >
            Return to Exploration Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060A12] text-amber-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* ROYAL HERITAGE PASSPORT BANNER CARD */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-amber-500/30 p-6 sm:p-10 shadow-2xl space-y-8 animate-ent-rise">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-6">
              {/* Gold Crest Avatar */}
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-orange-500 p-0.5 shadow-2xl">
                  <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center text-3xl sm:text-4xl font-serif-heritage font-black gold-gradient-text">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 bg-amber-400 text-black p-1 rounded-full shadow-lg">
                  <Crown className="w-4 h-4" />
                </div>
              </div>

              {/* User Bio Details */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-serif-heritage text-2xl sm:text-4xl font-bold text-amber-100">
                    {user.name}
                  </h1>
                  <span className="bg-amber-400 text-black font-bold text-[10px] uppercase px-3 py-0.5 rounded-full shadow-md tracking-wider">
                    {user.role}
                  </span>
                </div>

                <p className="text-xs text-amber-300/80 font-mono">{user.email}</p>

                <div className="flex items-center gap-4 text-xs text-amber-300/70 pt-1 font-light">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{user.region || 'Rajasthan, India'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 border-l border-amber-500/20 pl-4">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-semibold">Verified Cultural Fellow</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Documentation</span>
              </button>

              <button
                onClick={() => setIsAIStoryOpen(true)}
                className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg border border-purple-500/30"
              >
                <Wand2 className="w-4 h-4" />
                <span>AI Generate Story</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  toast.info('Signed out of Riwayat');
                  navigate('/');
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* PROPER INDIAN CULTURAL HERITAGE MEDALLION BADGES SECTION */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.25em] font-accent-cinzel">
                Conferred Honours & Medallions
              </span>
              <h2 className="font-serif-heritage text-2xl sm:text-3xl font-bold gold-gradient-text">
                Cultural Heritage Badges
              </h2>
            </div>
            <span className="text-xs text-amber-300/70 font-mono">4 Honors Earned</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CULTURAL_HERITAGE_BADGES.map((badge) => {
              const IconComp = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`glass-card p-6 rounded-2xl border ${badge.borderColor} space-y-4 text-center relative overflow-hidden group ${badge.glowColor}`}
                >
                  {/* Top Seal Ribbon */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#060A12] border border-amber-500/30 text-[9px] font-mono font-bold text-amber-300 uppercase">
                    {badge.badgeSeal}
                  </div>

                  {/* Medallion Icon Seal Circle */}
                  <div className="relative w-20 h-20 mx-auto mt-2">
                    <div className={`w-full h-full rounded-2xl bg-gradient-to-tr ${badge.colorTheme} p-0.5 shadow-2xl transform group-hover:scale-105 transition-transform duration-300`}>
                      <div className="w-full h-full bg-[#060A12] rounded-[14px] flex items-center justify-center">
                        <IconComp className="w-10 h-10 text-amber-300" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif-heritage text-lg font-bold text-amber-100 group-hover:text-amber-300">
                      {badge.title}
                    </h3>
                    <p className="text-[11px] font-accent-cinzel text-amber-400 font-semibold uppercase">
                      {badge.subtext}
                    </p>
                  </div>

                  <p className="text-xs text-amber-200/70 leading-relaxed font-light pt-2 border-t border-amber-500/15">
                    {badge.criteria}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* TABBED ACTIVITY HUB */}
        <div className="space-y-6 pt-4">
          
          {/* Tab Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-amber-500/20">
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'badges'
                  ? 'bg-amber-400 text-black shadow-lg'
                  : 'bg-[#0D1322] text-amber-200/70 hover:text-amber-200 border border-amber-500/20'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Conferred Badges & Medals</span>
            </button>

            <button
              onClick={() => setActiveTab('stories')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'stories'
                  ? 'bg-amber-400 text-black shadow-lg'
                  : 'bg-[#0D1322] text-amber-200/70 hover:text-amber-200 border border-amber-500/20'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>My Published Documentation ({userStories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('workshops')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'workshops'
                  ? 'bg-amber-400 text-black shadow-lg'
                  : 'bg-[#0D1322] text-amber-200/70 hover:text-amber-200 border border-amber-500/20'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Enrolled Masterclasses ({userWorkshops.length})</span>
            </button>
          </div>

          {/* TAB 1: BADGES DETAIL */}
          {activeTab === 'badges' && (
            <div className="p-6 rounded-2xl glass-panel space-y-4 animate-ent-rise">
              <h3 className="font-serif-heritage text-xl font-bold gold-gradient-text">
                National Heritage Recognition Framework
              </h3>
              <p className="text-xs text-amber-200/80 leading-relaxed max-w-3xl font-light">
                RIWAYAT cultural badges are official digital seals conferred to journalists, creators, and artisan patrons documenting Indian living traditions, ancient manuscripts, and endangered craft forms.
              </p>
            </div>
          )}

          {/* TAB 2: DYNAMIC STORIES */}
          {activeTab === 'stories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-ent-rise">
              {loadingData ? (
                <div className="col-span-2 text-center py-10 text-amber-300/70 text-xs">Loading documentation...</div>
              ) : userStories.map((story) => (
                <div key={story._id} className="glass-card rounded-2xl overflow-hidden p-4 flex gap-4 items-center">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-28 h-28 rounded-xl object-cover border border-amber-500/20 flex-shrink-0"
                  />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[10px] text-amber-400 font-semibold uppercase">
                      <span>{story.category}</span>
                      <span>{story.region || 'India'}</span>
                    </div>
                    <h3 className="font-serif-heritage text-base font-bold text-amber-100 line-clamp-1">
                      {story.title}
                    </h3>
                    <p className="text-xs text-amber-200/70 line-clamp-2 leading-relaxed font-light">
                      {story.description}
                    </p>
                    <div className="pt-1 flex items-center justify-between text-xs text-amber-300">
                      <span className="text-[10px] font-mono">{story.readTime || '5 min read'}</span>
                      <button
                        onClick={() => navigate('/stories')}
                        className="text-amber-400 font-bold hover:underline text-xs flex items-center gap-1"
                      >
                        <span>View Article</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: DYNAMIC WORKSHOPS */}
          {activeTab === 'workshops' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-ent-rise">
              {loadingData ? (
                <div className="col-span-2 text-center py-10 text-amber-300/70 text-xs">Loading masterclasses...</div>
              ) : userWorkshops.map((ws) => (
                <div key={ws._id} className="glass-card rounded-2xl p-5 space-y-4">
                  <div className="flex gap-4 items-center">
                    <img src={ws.image} alt={ws.title} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="space-y-1 flex-1">
                      <h4 className="font-serif-heritage text-base font-bold text-amber-100">{ws.title}</h4>
                      <p className="text-xs text-amber-300/80">Instructor: {ws.instructor}</p>
                      <p className="text-[10px] text-emerald-400 font-semibold">
                        Enrolled & Active Course
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/workshops')}
                    className="w-full py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-500/30"
                  >
                    <span>Continue Workshop Video</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Story Submission Modal */}
      {isSubmitModalOpen && (
        <AddStoryForm
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          onStoryAdded={(newStory) => {
            setIsSubmitModalOpen(false);
            setUserStories((prev) => [newStory, ...prev]);
            toast.success('Story submitted to Creator Studio');
          }}
        />
      )}

      {/* ── AI STORY GENERATOR MODAL ─────────────────────────────────── */}
      {isAIStoryOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D1322] border border-purple-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 animate-ent-rise shadow-2xl shadow-purple-900/30">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-serif-heritage text-xl font-bold text-white">AI Story Generator</h3>
                  <p className="text-[10px] text-purple-300/70 font-mono">Powered by Google Gemini · Riwayat AI</p>
                </div>
              </div>
              <button
                onClick={() => { setIsAIStoryOpen(false); setAiGeneratedStory(null); setAiPrompt(''); }}
                className="text-purple-400/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prompt Input */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-purple-300 uppercase tracking-widest">
                Describe the cultural tradition, art form, or artisan story
              </label>
              <textarea
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="e.g., 'Pattachitra palm leaf scroll paintings of Raghurajpur village in Odisha' or 'The Dhrupad classical music tradition of Varanasi'"
                rows={3}
                className="w-full bg-[#0A0F1C] border border-purple-500/30 rounded-xl px-4 py-3 text-xs text-amber-100 placeholder-purple-300/30 focus:outline-none focus:border-purple-400 resize-none"
              />
              <div className="flex flex-wrap gap-2">
                {['Madhubani painting Bihar', 'Kathakali Kerala', 'Banarasi silk weaving', 'Dhokra metal craft'].map(example => (
                  <button
                    key={example}
                    onClick={() => setAiPrompt(example)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={async () => {
                if (!aiPrompt.trim()) return toast.warning('Please describe the cultural topic first.');
                setAiGenerating(true);
                setAiGeneratedStory(null);
                try {
                  const story = await generateHeritageStory(aiPrompt);
                  setAiGeneratedStory(story);
                  toast.success('Heritage story generated by Sahayak AI!');
                } catch {
                  toast.error('AI generation failed. Please try again.');
                } finally {
                  setAiGenerating(false);
                }
              }}
              disabled={aiGenerating || !aiPrompt.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all"
            >
              {aiGenerating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Sahayak AI is writing your story...</span></>
              ) : (
                <><Sparkles className="w-4 h-4" /><span>Generate Heritage Documentation</span></>
              )}
            </button>

            {/* Generated Story Result */}
            {aiGeneratedStory && (
              <div className="space-y-4 border border-amber-500/20 rounded-2xl p-5 bg-[#080D1A]">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">{aiGeneratedStory.category}</span>
                      <span className="text-[10px] text-amber-300/60">📍 {aiGeneratedStory.region}</span>
                      <span className="text-[10px] text-amber-300/60">⏱ {aiGeneratedStory.readTime}</span>
                    </div>
                    <h4 className="font-serif-heritage text-lg font-bold gold-gradient-text leading-tight">{aiGeneratedStory.title}</h4>
                    <p className="text-[10px] text-amber-300/70">By {aiGeneratedStory.author} · {aiGeneratedStory.authorRole}</p>
                  </div>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        `${aiGeneratedStory.title}\n\n${aiGeneratedStory.description}\n\n${aiGeneratedStory.content}`
                      );
                      setCopied(true);
                      toast.success('Story copied to clipboard!');
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs hover:bg-amber-500/20 transition-colors flex-shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <p className="text-xs text-amber-200/80 italic leading-relaxed border-l-2 border-amber-500/30 pl-3">{aiGeneratedStory.description}</p>
                <p className="text-xs text-amber-100/70 leading-relaxed">{aiGeneratedStory.content}</p>

                {aiGeneratedStory.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-amber-500/10">
                    {aiGeneratedStory.tags.map((tag, i) => (
                      <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/15">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => {
                    setIsAIStoryOpen(false);
                    setIsSubmitModalOpen(true);
                    toast.info('Opening submission form — paste the AI-generated content in!');
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-md mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Submit This Story to Riwayat
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;