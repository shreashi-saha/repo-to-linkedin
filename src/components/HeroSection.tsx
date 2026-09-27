import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="text-center py-8 sm:py-12 max-w-3xl mx-auto px-4">
      {/* Visual pill tag */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs sm:text-sm font-medium mb-6 shadow-xs">
        <FileText className="w-4 h-4 text-blue-600" />
        <span>README.md → Professional Social Post</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight">
        Turn your GitHub project into a{' '}
        <span className="text-blue-600 underline decoration-blue-200 underline-offset-4 decoration-2">
          LinkedIn-ready post.
        </span>
      </h1>

      {/* Supporting Text */}
      <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
        Paste your public GitHub repository URL and let AI transform your README documentation into a polished, professional post for your tech network.
      </p>
    </div>
  );
};
