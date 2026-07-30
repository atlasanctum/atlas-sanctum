import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingFallback: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <RefreshCw className="w-8 h-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
};

export default LoadingFallback;