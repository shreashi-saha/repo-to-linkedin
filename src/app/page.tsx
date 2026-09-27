'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { RepositoryInput } from '@/components/RepositoryInput';
import { LoadingState } from '@/components/LoadingState';
import { ErrorMessage } from '@/components/ErrorMessage';
import { ResultEditor } from '@/components/ResultEditor';
import { Footer } from '@/components/Footer';
import { GenerateErrorResponse, GenerateSuccessResponse } from '@/types';

export default function Home() {
  const [url, setUrl] = useState('');
  const [activeUrl, setActiveUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [result, setResult] = useState<GenerateSuccessResponse | null>(null);
  const [error, setError] = useState<GenerateErrorResponse | null>(null);

  const handleGenerate = async (targetUrl: string, isRegen = false) => {
    const cleanedUrl = targetUrl.trim();
    if (!cleanedUrl) return;

    if (isRegen) {
      setIsRegenerating(true);
    } else {
      setIsLoading(true);
      setResult(null);
      setError(null);
    }

    setActiveUrl(cleanedUrl);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: cleanedUrl }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.error
            ? data
            : {
                success: false,
                code: 'GEMINI_ERROR',
                error: 'An error occurred while generating your post. Please try again.',
              }
        );
        setResult(null);
      } else {
        setResult(data as GenerateSuccessResponse);
        setError(null);
      }
    } catch {
      setError({
        success: false,
        code: 'GEMINI_ERROR',
        error: 'Network connection failed. Please check your internet connection and try again.',
      });
    } finally {
      setIsLoading(false);
      setIsRegenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate(url);
  };

  const handleSelectExample = (exampleUrl: string) => {
    setUrl(exampleUrl);
    handleGenerate(exampleUrl);
  };

  const handleRetry = () => {
    if (url) {
      handleGenerate(url);
    }
  };

  const handleRegenerate = () => {
    const targetUrl = activeUrl || url;
    if (targetUrl) {
      handleGenerate(targetUrl, true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main className="flex-1 pb-16">
        <HeroSection />

        <RepositoryInput
          url={url}
          setUrl={(newUrl) => {
            setUrl(newUrl);
            if (error) setError(null);
          }}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onSelectExample={handleSelectExample}
        />

        {isLoading && <LoadingState />}

        {error && !isLoading && (
          <ErrorMessage error={error} onRetry={handleRetry} />
        )}

        {result && !isLoading && (
          <ResultEditor
            initialPost={result.post}
            hashtags={result.hashtags}
            repoInfo={result.repoInfo}
            onRegenerate={handleRegenerate}
            isRegenerating={isRegenerating}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
