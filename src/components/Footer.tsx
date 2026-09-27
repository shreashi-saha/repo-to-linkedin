import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-6 mt-auto">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Built to turn project documentation into professional stories.
        </p>
      </div>
    </footer>
  );
};
