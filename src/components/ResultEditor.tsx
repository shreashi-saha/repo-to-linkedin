import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Sparkles, Hash, Star, ExternalLink } from 'lucide-react';
import { LinkedinIcon } from '@/components/Icons';

interface ResultEditorProps {
  initialPost: string;
  hashtags: string[];
  repoInfo?: {
    owner: string;
    repo: string;
    description: string | null;
    stars: number;
    url: string;
  };
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const ResultEditor: React.FC<ResultEditorProps> = ({
  initialPost,
  hashtags,
  repoInfo,
  onRegenerate,
  isRegenerating,
}) => {
  const [postText, setPostText] = useState(initialPost);
  const [activeHashtags, setActiveHashtags] = useState<string[]>(hashtags);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  useEffect(() => {
    setPostText(initialPost);
    setActiveHashtags(hashtags);
  }, [initialPost, hashtags]);

  const wordCount = postText.trim() ? postText.trim().split(/\s+/).length : 0;
  const charCount = postText.length;

  const getFullPostTextForClipboard = () => {
    let text = postText.trim();
    if (activeHashtags.length > 0) {
      const hashtagString = activeHashtags.join(' ');
      if (!text.includes(hashtagString)) {
        text += `\n\n${hashtagString}`;
      }
    }
    return text;
  };

  const handleCopy = async () => {
    const fullText = getFullPostTextForClipboard();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(fullText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = fullText;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 4000);
    }
  };

  const handleToggleHashtag = (tag: string) => {
    if (activeHashtags.includes(tag)) {
      setActiveHashtags(activeHashtags.filter((t) => t !== tag));
    } else {
      setActiveHashtags([...activeHashtags, tag]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mt-8 mb-12 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Editor Top Bar */}
        <div className="bg-slate-50 px-5 py-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white">
              <LinkedinIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Your LinkedIn Post
              </h2>
              {repoInfo && (
                <a
                  href={repoInfo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-blue-600 inline-flex items-center space-x-1"
                >
                  <span>{repoInfo.owner}/{repoInfo.repo}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-500">
            <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium">
              {wordCount} words
            </span>
            <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium">
              {charCount} chars
            </span>
          </div>
        </div>

        {/* Editable Textarea Body */}
        <div className="p-5 sm:p-6 space-y-5">
          <div className="relative">
            <label htmlFor="post-editor-textarea" className="sr-only">
              Edit Generated LinkedIn Post
            </label>
            <textarea
              id="post-editor-textarea"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              rows={10}
              className="w-full p-4 rounded-xl border border-slate-200 text-slate-800 text-sm sm:text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans resize-y bg-slate-50/30"
              placeholder="Your generated post will appear here..."
              spellCheck={true}
            />
          </div>

          {/* Hashtags Section */}
          {activeHashtags.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                  <Hash className="w-3.5 h-3.5 text-blue-600" />
                  <span>Generated Hashtags (included in copy)</span>
                </span>
                <span className="text-[11px] text-slate-400">Click to toggle</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeHashtags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleHashtag(tag)}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/80 hover:bg-blue-100 transition-colors cursor-pointer select-none"
                    title="Click to remove from post"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Toast / Copy Banner if copied */}
          {copied && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 animate-in fade-in duration-200">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Copied to clipboard! Ready to paste into LinkedIn.</span>
            </div>
          )}

          {copyError && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs sm:text-sm font-medium">
              Could not copy automatically. Please select text and press Ctrl+C / Cmd+C.
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              disabled={isRegenerating}
              onClick={onRegenerate}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 text-sm font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Post</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
