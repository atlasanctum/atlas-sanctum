import React from 'react';
import EnterpriseHeader from './EnterpriseHeader';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen bg-background">
      <EnterpriseHeader />
      <main className={`pt-20 ${className}`}>
        {children}
      </main>
    </div>
  );
};

export default PageLayout;