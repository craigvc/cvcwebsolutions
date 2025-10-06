'use client';

interface CardProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export function Card({ title, className = '', children }: CardProps) {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 ${className}`}>
      {title && (
        <h2 className="mb-6 text-xl font-bold text-white">{title}</h2>
      )}
      {children}
    </div>
  );
}
