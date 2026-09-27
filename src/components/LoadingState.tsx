import React, { useEffect, useState } from 'react';
import { Loader2, FileSearch, Brain, Sparkles, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { label: 'Reading your README...', icon: FileSearch },
  { label: 'Understanding your project...', icon: Brain },
  { label: 'Crafting your LinkedIn post...', icon: Sparkles },
];

export const LoadingState: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 1800);
    const timer2 = setTimeout(() => setCurrentStep(2), 4200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-8">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mb-2 shadow-inner">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            {STEPS[currentStep].label}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Analyzing repository documentation with Gemini AI
          </p>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto pt-2">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={step.label}
                className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-300 ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-50/50 text-blue-700 font-semibold'
                    : isDone
                    ? 'border-emerald-200 bg-emerald-50/40 text-emerald-700'
                    : 'border-slate-100 bg-slate-50/50 text-slate-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
                ) : (
                  <Icon className={`w-5 h-5 mb-1 ${isCurrent ? 'animate-pulse text-blue-600' : 'text-slate-400'}`} />
                )}
                <span className="text-[11px] leading-tight text-center">
                  Step {idx + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
