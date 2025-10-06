'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Textarea } from './Textarea';

// Dynamically import the RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(
  () => import('./RichTextEditor').then(mod => ({ default: mod.RichTextEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="border border-gray-600 rounded-lg bg-gray-700 p-4 min-h-[200px] animate-pulse">
        <div className="h-8 bg-gray-600 rounded mb-2"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-600 rounded w-3/4"></div>
          <div className="h-4 bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    )
  }
);

interface RichTextEditorWrapperProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fallback?: boolean;
}

export function RichTextEditorWrapper({
  value,
  onChange,
  placeholder,
  fallback = false
}: RichTextEditorWrapperProps) {
  const [isClient, setIsClient] = useState(false);
  const [useFallback, setUseFallback] = useState(fallback);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fallback to textarea if editor fails
  if (useFallback) {
    return (
      <Textarea
        value={value}
        onChange={onChange}
        rows={8}
        placeholder={placeholder}
        helperText="Rich text editor unavailable. Using plain text editor."
      />
    );
  }

  // Show loading or editor based on client-side rendering
  if (!isClient) {
    return (
      <div className="border border-gray-600 rounded-lg bg-gray-700 p-4 min-h-[200px]">
        <p className="text-gray-400">Loading editor...</p>
      </div>
    );
  }

  return (
    <RichTextEditor
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}