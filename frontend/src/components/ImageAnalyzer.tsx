import React, { useState, useRef } from 'react';
import { Upload, Search, Loader2, Sparkles, X, CheckCircle, AlertCircle, ZoomIn } from 'lucide-react';
import { analyzeHeritageImage, ImageAnalysis } from '../services/aiService';

const ImageAnalyzer: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ImageAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('Image must be under 4MB. Please compress and try again.');
      return;
    }

    setMimeType(file.type);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      // Strip "data:image/jpeg;base64," prefix
      const b64 = dataUrl.split(',')[1];
      setBase64(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleAnalyze = async () => {
    if (!base64) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeHeritageImage(base64, mimeType);
      setResult(analysis);
    } catch {
      setError('Analysis failed. Please try a different image.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    setBase64(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const confidenceColor = (c?: string) => {
    if (c === 'High') return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (c === 'Medium') return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-orange-400 border-orange-500/40 bg-orange-500/10';
  };

  return (
    <div className="w-full space-y-5">
      {/* Upload Zone */}
      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 group ${
            isDragging
              ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
              : 'border-amber-500/30 hover:border-amber-400/60 hover:bg-amber-500/5'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-100">Drop an image here or click to upload</p>
              <p className="text-xs text-amber-400/60 mt-1">JPG, PNG, WEBP · Max 4MB</p>
            </div>
            <p className="text-xs text-amber-400/50 italic">Works best with Indian art, crafts, textiles, dance, architecture</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Image Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 bg-[#080D1A]">
            <img src={preview} alt="Upload preview" className="w-full max-h-64 object-contain" />
            <button
              onClick={handleReset}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/90 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            {result && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <span className="text-xs font-bold text-amber-300">{result.craftType}</span>
              </div>
            )}
          </div>

          {/* Analyze Button */}
          {!result && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/30 disabled:opacity-60 transition-all"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Heritage Image...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Identify Indian Cultural Art</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {result.identified ? (
            <>
              {/* Identification Header */}
              <div className="flex items-start justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <h3 className="font-serif-heritage text-base font-bold text-amber-100">{result.craftType}</h3>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-amber-300">📍 {result.region}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${confidenceColor(result.confidence)}`}>
                      {result.confidence} Confidence
                    </span>
                  </div>
                </div>
                <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              </div>

              {/* Cultural Significance */}
              <div className="p-3.5 rounded-xl bg-[#080D1A] border border-amber-500/15 space-y-1.5">
                <p className="text-[10px] uppercase tracking-widest font-bold text-amber-400">Cultural Significance</p>
                <p className="text-xs text-amber-100/80 leading-relaxed">{result.culturalSignificance}</p>
              </div>

              {/* Characteristics */}
              {result.characteristics?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-amber-400">Visual Characteristics</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.characteristics.map((c, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Analyze another */}
              <button
                onClick={handleReset}
                className="w-full py-2.5 rounded-xl border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/10 transition-colors"
              >
                Analyze Another Image
              </button>
            </>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2 text-center">
              <ZoomIn className="w-6 h-6 text-amber-400 mx-auto" />
              <p className="text-sm font-semibold text-amber-100">No Indian Cultural Art Detected</p>
              <p className="text-xs text-amber-300/70">{result.notCultural}</p>
              <button onClick={handleReset} className="text-xs text-amber-400 underline mt-1">Try another image</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;
