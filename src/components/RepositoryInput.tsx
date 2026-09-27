import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { GithubIcon } from '@/components/Icons';

interface RepositoryInputProps {
  url: string;
  setUrl: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onSelectExample: (exampleUrl: string) => void;
}

const EXAMPLE_REPOS = [
  { label: 'facebook/react', url: 'https://github.com/facebook/react' },
  { label: 'vercel/next.js', url: 'https://github.com/vercel/next.js' },
  { label: 'tailwindlabs/tailwindcss', url: 'https://github.com/tailwindlabs/tailwindcss' },
];

export const RepositoryInput: React.FC<RepositoryInputProps> = ({
  url,
  setUrl,
  onSubmit,
  isLoading,
  onSelectExample,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 transition-all duration-200">
        <form onSubmit={onSubmit} className="space-y-4">
          <label
            htmlFor="github-url-input"
            className="block text-sm font-semibold text-slate-800"
          >
            GitHub Repository URL
          </label>

          <div
            className={`relative flex items-center rounded-xl border transition-all duration-150 bg-slate-50/50 ${
              isFocused
                ? 'border-blue-500 ring-4 ring-blue-500/10 bg-white'
                : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            <div className="pl-3.5 text-slate-400 flex items-center justify-center pointer-events-none">
              <GithubIcon className="w-5 h-5 text-slate-500" />
            </div>

            <input
              id="github-url-input"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="https://github.com/username/repository"
              disabled={isLoading}
              className="w-full py-3 px-3 text-slate-900 placeholder:text-slate-400 bg-transparent text-sm sm:text-base border-none focus:outline-none focus:ring-0 disabled:opacity-60"
              autoComplete="off"
              spellCheck={false}
            />

            {url && !isLoading && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <span className="text-xs text-slate-500 flex items-center space-x-1">
              <span>Public GitHub repositories with a README.md file are supported.</span>
            </span>

            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Processing...' : 'Generate LinkedIn Post'}</span>
            </button>
          </div>
        </form>

        {/* Example repositories quick fill */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Try an example:</span>
          {EXAMPLE_REPOS.map((repo) => (
            <button
              key={repo.label}
              type="button"
              disabled={isLoading}
              onClick={() => onSelectExample(repo.url)}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 text-slate-700 transition-colors disabled:opacity-50"
            >
              {repo.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
