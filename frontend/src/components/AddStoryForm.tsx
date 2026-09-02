import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface AddStoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryAdded: (story: any) => void;
}

const AddStoryForm: React.FC<AddStoryFormProps> = ({ isOpen, onClose, onStoryAdded }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('art');
  const [region, setRegion] = useState('Rajasthan');
  const [image, setImage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('Please complete the title and summary fields');
      return;
    }

    const newStory = {
      _id: 'story-local-' + Date.now(),
      title,
      description,
      content,
      category,
      region,
      image: image || 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80',
      author: user?.name || 'Aarav Sharma',
      authorRole: user?.role || 'Cultural Journalist',
      readTime: '5 min read',
      upvotes: 1
    };

    onStoryAdded(newStory);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0D1322] border border-amber-500/30 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-ent-rise">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif-heritage text-2xl font-bold gold-gradient-text">
              Submit Cultural Documentation
            </h2>
          </div>
          <button onClick={onClose} className="text-amber-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-amber-300 mb-1">Story Title</label>
              <input
                type="text"
                required
                placeholder="e.g. The Vanishing Kadwa Silk Weavers of Banaras"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#060A12] border border-amber-500/30 rounded-lg px-3.5 py-2 text-xs text-amber-100 placeholder-amber-400/40"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-amber-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#060A12] border border-amber-500/30 rounded-lg px-3.5 py-2 text-xs text-amber-100"
              >
                <option value="art">Art & Crafts</option>
                <option value="dance">Classical Dance</option>
                <option value="food">Culinary Traditions</option>
                <option value="festivals">Festivals & Rituals</option>
                <option value="traditions">Indigenous Traditions</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-amber-300 mb-1">Region / State</label>
              <input
                type="text"
                required
                placeholder="e.g. Uttar Pradesh"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-[#060A12] border border-amber-500/30 rounded-lg px-3.5 py-2 text-xs text-amber-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-amber-300 mb-1">Header Cover Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-[#060A12] border border-amber-500/30 rounded-lg px-3.5 py-2 text-xs text-amber-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-amber-300 mb-1">Short Executive Summary</label>
            <textarea
              required
              rows={2}
              placeholder="Provide a concise 2-sentence summary of the story..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#060A12] border border-amber-500/30 rounded-lg px-3.5 py-2 text-xs text-amber-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-amber-300 mb-1">Full Article Documentation</label>
            <textarea
              rows={5}
              placeholder="Document the heritage history, master artisans interviewed, techniques used, and field notes..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#060A12] border border-amber-500/30 rounded-lg px-3.5 py-2 text-xs text-amber-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-amber-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-xs shadow-lg"
            >
              Publish Story
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStoryForm;