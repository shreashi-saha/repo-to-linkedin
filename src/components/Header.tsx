import React from 'react';
import { Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/Icons';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <GithubIcon className="w-5 h-5" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              Repo<span className="text-blue-600 font-extrabold">-to-</span>LinkedIn
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 rounded-full">
              MVP
            </span>
          </div>
        </div>

        {/* Right Info Badge */}
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>No login required</span>
        </div>
      </div>
    </header>
  );
};
