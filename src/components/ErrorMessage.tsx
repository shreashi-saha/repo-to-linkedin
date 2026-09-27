import React from 'react';
import { AlertCircle, FileQuestion, Lock, SearchX, KeyRound, RefreshCw } from 'lucide-react';
import { GenerateErrorResponse } from '@/types';

interface ErrorMessageProps {
  error: GenerateErrorResponse;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => {
  const getIcon = () => {
    switch (error.code) {
      case 'README_NOT_FOUND':
      case 'README_EMPTY':
        return FileQuestion;
      case 'REPO_PRIVATE':
        return Lock;
      case 'REPO_NOT_FOUND':
        return SearchX;
      case 'MISSING_API_KEY':
        return KeyRound;
      default:
        return AlertCircle;
    }
  };

  const IconComponent = getIcon();

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-8">
      <div className="bg-red-50/70 border border-red-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-start space-x-4">
          <div className="p-2.5 bg-red-100 text-red-600 rounded-xl shrink-0">
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-red-900 tracking-tight">
              {error.code === 'README_NOT_FOUND'
                ? 'README.md Required'
                : error.code === 'README_EMPTY'
                ? 'Insufficient README Content'
                : error.code === 'REPO_PRIVATE'
                ? 'Private Repository'
                : error.code === 'REPO_NOT_FOUND'
                ? 'Repository Not Found'
                : error.code === 'MISSING_API_KEY'
                ? 'API Key Missing'
                : 'Unable to Generate Post'}
            </h3>

            <p className="mt-1.5 text-sm text-red-700 leading-relaxed whitespace-pre-line">
              {error.error}
            </p>

            {onRetry && (
              <div className="mt-4 pt-3 border-t border-red-200/60 flex items-center justify-end">
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-xs transition-colors shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
