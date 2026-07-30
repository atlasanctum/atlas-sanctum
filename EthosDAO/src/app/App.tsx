import React, { useState } from 'react';
import { Sidebar } from './components/dashboard/Sidebar';
import { Header } from './components/dashboard/Header';
import { Overview } from './components/dashboard/Overview';
import { Governance } from './components/dashboard/Governance';
import { Exchange } from './components/dashboard/Exchange';
import { Metrics } from './components/dashboard/Metrics';
import { Knowledge } from './components/dashboard/Knowledge';
import { Economy } from './components/dashboard/Economy';
import { Workspace } from './components/dashboard/Workspace';
import { Engineering } from './components/dashboard/Engineering';
import { Platform } from './components/dashboard/Platform';
import { DashboardProvider } from './context/DashboardContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { Toaster } from './components/ui/sonner';
import { logger } from './services/logger.service';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  // Log app initialization
  React.useEffect(() => {
    logger.info('Application initialized', 'App', {
      version: '1.0.0',
      environment: process.env.NODE_ENV
    });
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview setActiveTab={setActiveTab} />;
      case 'workspace':
        return (
          <ErrorBoundary>
            <WorkspaceProvider>
              <Workspace />
            </WorkspaceProvider>
          </ErrorBoundary>
        );
      case 'engineering':
        return (
          <ErrorBoundary>
            <Engineering />
          </ErrorBoundary>
        );
      case 'platform':
        return (
          <ErrorBoundary>
            <Platform />
          </ErrorBoundary>
        );
      case 'governance':
        return (
          <ErrorBoundary>
            <Governance />
          </ErrorBoundary>
        );
      case 'exchange':
        return (
          <ErrorBoundary>
            <Exchange />
          </ErrorBoundary>
        );
      case 'metrics':
        return (
          <ErrorBoundary>
            <Metrics />
          </ErrorBoundary>
        );
      case 'knowledge':
        return (
          <ErrorBoundary>
            <Knowledge />
          </ErrorBoundary>
        );
      case 'economy':
        return (
          <ErrorBoundary>
            <Economy />
          </ErrorBoundary>
        );
      default:
        return <Overview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <ErrorBoundary>
      <DashboardProvider>
        <div className="flex h-screen w-full bg-slate-950 text-slate-50 overflow-hidden font-sans">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex flex-col flex-1 h-full overflow-hidden">
            <Header activeTab={activeTab} />
            <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              <div className="max-w-7xl mx-auto space-y-8">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
        <Toaster position="top-right" expand={false} richColors />
      </DashboardProvider>
    </ErrorBoundary>
  );
}