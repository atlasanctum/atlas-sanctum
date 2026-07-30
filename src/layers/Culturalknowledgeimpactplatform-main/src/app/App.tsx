import React, { useState } from 'react';
import { DashboardSidebar } from './dashboard/Sidebar';
import { DashboardTopNav } from './dashboard/TopNav';
import { DashboardOverview } from './dashboard/Overview';
import { MyProjects } from './dashboard/MyProjects';
import { TaskBoard } from './dashboard/TaskBoard';
import { ImpactStories } from './components/ImpactStories';
import { ResearchHub } from './components/ResearchHub';
import { CollaborationHub } from './components/CollaborationHub';
import { GlobalStats } from './components/GlobalStats';
import { Settings } from './dashboard/Settings';
import { Toaster } from './components/ui/sonner';
import { ErrorBoundary } from './components/ErrorBoundary';

const App = () => {
  const [activeView, setActiveView] = useState('overview');

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <DashboardOverview />;
      case 'my-projects':
        return <MyProjects />;
      case 'tasks':
        return <TaskBoard />;
      case 'analytics':
        return <GlobalStats />;
      case 'stories':
        return (
            <div>
                <div className="container mx-auto px-4 pt-8">
                    <h2 className="text-3xl font-bold tracking-tight">Global Stories</h2>
                    <p className="text-muted-foreground">Explore impact stories from the network.</p>
                </div>
                <ImpactStories />
            </div>
        );
      case 'research':
        return <ResearchHub />;
      case 'collaborate':
        return <CollaborationHub />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans antialiased">
        {/* Sidebar */}
        <DashboardSidebar activeView={activeView} onNavigate={setActiveView} />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Navigation */}
          <DashboardTopNav />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/20">
            {renderContent()}
          </main>
        </div>
        <Toaster />
      </div>
    </ErrorBoundary>
  );
};

export default App;