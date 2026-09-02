import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Plus, User, Tag, Send, Search, X } from 'lucide-react';
import { fetchForumPosts } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Oral Histories');
  const [newContent, setNewContent] = useState('');

  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const { user } = useAuth();

  useEffect(() => {
    fetchForumPosts().then(setPosts);
  }, []);

  const categories = [
    { id: 'all', label: 'All Discussions' },
    { id: 'Oral Histories', label: 'Oral Histories & Songs' },
    { id: 'Artisan Welfare', label: 'Artisan Economy & GI Tags' },
    { id: 'Craft Techniques', label: 'Craft Techniques' },
    { id: 'Architecture', label: 'Monuments & Architecture' }
  ];

  const handleUpvote = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, upvotes: p.upvotes + 1 } : p))
    );
    toast.success('Topic upvoted!');
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    const newComment = {
      author: user?.name || 'Cultural Member',
      authorRole: user?.role || 'Member',
      content: text,
      createdAt: new Date()
    };

    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p
      )
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    toast.success('Reply posted');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const created = {
      _id: 'post-local-' + Date.now(),
      title: newTitle,
      category: newCategory,
      content: newContent,
      author: user?.name || 'Aarav Sharma',
      authorRole: user?.role || 'Creator',
      upvotes: 1,
      tags: [newCategory],
      comments: []
    };

    setPosts([created, ...posts]);
    setNewTitle('');
    setNewContent('');
    setIsCreateModalOpen(false);
    toast.success('New discussion topic published!');
  };

  const filteredPosts = posts.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#060A12] text-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-amber-400 font-accent-cinzel">
              Riwayat Cultural Discussions
            </span>
            <h1 className="font-serif-heritage text-4xl sm:text-5xl font-bold gold-gradient-text">
              Community Forum
            </h1>
            <p className="text-sm text-amber-200/70 max-w-xl font-light">
              Exchange knowledge, discuss regional preservation initiatives, share field recording notes, and connect with heritage scholars.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold text-xs shadow-lg flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Start Discussion</span>
          </button>
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
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D1322] border border-amber-500/30 rounded-lg pl-9 pr-4 py-2 text-xs text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Forum Posts List */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div key={post._id} className="glass-card p-6 rounded-xl space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded text-[10px] font-semibold">
                      {post.category}
                    </span>
                    <span className="text-xs text-amber-300/60">
                      Posted by <strong className="text-amber-200">{post.author}</strong> ({post.authorRole})
                    </span>
                  </div>
                  <h2 className="font-serif-heritage text-xl font-bold text-amber-100">
                    {post.title}
                  </h2>
                </div>

                <button
                  onClick={() => handleUpvote(post._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 transition-all"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="font-bold text-xs">{post.upvotes}</span>
                </button>
              </div>

              <p className="text-xs text-amber-100/80 leading-relaxed font-light">
                {post.content}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  <Tag className="w-3.5 h-3.5 text-amber-400/60" />
                  {post.tags.map((tag: string, i: number) => (
                    <span key={i} className="text-[10px] text-amber-300/70 bg-amber-500/5 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Comments Section */}
              <div className="pt-4 border-t border-amber-500/15 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>{post.comments?.length || 0} Replies</span>
                </div>

                {/* Comment List */}
                <div className="space-y-3 pl-4 border-l-2 border-amber-500/20">
                  {post.comments?.map((c: any, idx: number) => (
                    <div key={idx} className="bg-[#0D1322] p-3 rounded-lg space-y-1">
                      <div className="flex items-center justify-between text-xs text-amber-300/80">
                        <span className="font-semibold text-amber-200">{c.author}</span>
                        <span className="text-[10px] text-amber-400/50">{c.authorRole}</span>
                      </div>
                      <p className="text-xs text-amber-100/70">{c.content}</p>
                    </div>
                  ))}
                </div>

                {/* Add Comment Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a community response..."
                    value={commentInputs[post._id] || ''}
                    onChange={(e) =>
                      setCommentInputs({ ...commentInputs, [post._id]: e.target.value })
                    }
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                    className="flex-1 bg-[#0D1322] border border-amber-500/30 rounded-lg px-3.5 py-2 text-xs text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={() => handleAddComment(post._id)}
                    className="p-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Discussion Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D1322] border border-amber-500/30 rounded-2xl max-w-lg w-full p-6 space-y-6 animate-ent-rise">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <h3 className="font-serif-heritage text-xl font-bold gold-gradient-text">
                Start a Cultural Discussion
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-amber-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-amber-300 mb-1">Topic Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Preserving traditional folk instruments in Kumaon"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#060A12] border border-amber-500/30 rounded-lg px-3.5 py-2 text-xs text-amber-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-amber-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#060A12] border border-amber-500/30 rounded-lg px-3.5 py-2 text-xs text-amber-100"
                >
                  <option value="Oral Histories">Oral Histories & Songs</option>
                  <option value="Artisan Welfare">Artisan Economy & GI Tags</option>
                  <option value="Craft Techniques">Craft Techniques</option>
                  <option value="Architecture">Monuments & Architecture</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-amber-300 mb-1">Discussion Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details, field questions, or document findings..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-[#060A12] border border-amber-500/30 rounded-lg px-3.5 py-2 text-xs text-amber-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-amber-500/20">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-xs"
                >
                  Post Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
