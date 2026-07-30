import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Sidebar } from '../../../../components/admin/adminFigma/components/Sidebar';
import { TopBar } from '../../../../components/admin/adminFigma/components/TopBar';
import { DashboardOverview } from '../../../../components/admin/adminFigma/components/DashboardOverview';
import { AIConsole } from '../../../../components/admin/adminFigma/components/AIConsole';
import { BlockchainMonitor } from '../../../../components/admin/adminFigma/components/BlockchainMonitor';
import { ImpactDashboard } from '../../../../components/admin/adminFigma/components/ImpactDashboard';
import { KnowledgeHub } from '../../../../components/admin/adminFigma/components/KnowledgeHub';
import { ReFiConsole } from '../../../../components/admin/adminFigma/components/ReFiConsole';
import { DAOGovernance } from '../../../../components/admin/adminFigma/components/DAOGovernance';
import { SystemHealth } from '../../../../components/admin/adminFigma/components/SystemHealth';
import { AlertsCenter } from '../../../../components/admin/adminFigma/components/AlertsCenter';
import { UserManagement } from '../../../../components/admin/adminFigma/components/UserManagement';
import { ActivityLog } from '../../../../components/admin/adminFigma/components/ActivityLog';
import { APIConfiguration } from '../../../../components/admin/adminFigma/components/APIConfiguration';
import { DataBackup } from '../../../../components/admin/adminFigma/components/DataBackup';
import { Settings } from '../../../../components/admin/adminFigma/components/Settings';
import { AnalyticsDashboard } from '../../../../components/admin/adminFigma/components/AnalyticsDashboard';
import { RolePermissions } from '../../../../components/admin/adminFigma/components/RolePermissions';
import { SecurityMonitor } from '../../../../components/admin/adminFigma/components/SecurityMonitor';
import { SupportTickets } from '../../../../components/admin/adminFigma/components/SupportTickets';
import { FileManager } from '../../../../components/admin/adminFigma/components/FileManager';
import { PredictiveImpact } from '../../../../components/admin/adminFigma/components/PredictiveImpact';
import { NLQueryInterface } from '../../../../components/admin/adminFigma/components/NLQueryInterface';
import { AutonomousAgents } from '../../../../components/admin/adminFigma/components/AutonomousAgents';
import { DynamicNFTs } from '../../../../components/admin/adminFigma/components/DynamicNFTs';
import { ZeroKnowledgeProofs } from '../../../../components/admin/adminFigma/components/ZeroKnowledgeProofs';
import { ImpactGlobe } from '../../../../components/admin/adminFigma/components/ImpactGlobe';
import { ImpactROICalculator } from '../../../../components/admin/adminFigma/components/ImpactROICalculator';
import { AutomatedCompliance } from '../../../../components/admin/adminFigma/components/AutomatedCompliance';
import { ImpactLeaderboards } from '../../../../components/admin/adminFigma/components/ImpactLeaderboards';
import { CollaborativeCanvas } from '../../../../components/admin/adminFigma/components/CollaborativeCanvas';
import { BlockchainAuditTrail } from '../../../../components/admin/adminFigma/components/BlockchainAuditTrail';
import { EdgeComputing } from '../../../../components/admin/adminFigma/components/EdgeComputing';
import { VirtualTours } from '../../../../components/admin/adminFigma/components/VirtualTours';
import { ARImpactOverlay } from '../../../../components/admin/adminFigma/components/ARImpactOverlay';
import { GraphQLFederation } from '../../../../components/admin/adminFigma/components/GraphQLFederation';
import { UniversalDesign } from '../../../../components/admin/adminFigma/components/UniversalDesign';
import { AICoPilot } from '../../../../components/admin/adminFigma/components/AICoPilot';

export default function App() {
  const [activeView, setActiveView] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <DashboardOverview />;
      case 'ai-console':
        return <AIConsole />;
      case 'blockchain':
        return <BlockchainMonitor />;
      case 'impact':
        return <ImpactDashboard />;
      case 'knowledge':
        return <KnowledgeHub />;
      case 'finance':
        return <ReFiConsole />;
      case 'governance':
        return <DAOGovernance />;
      case 'predictive':
        return <PredictiveImpact />;
      case 'nl-query':
        return <NLQueryInterface />;
      case 'autonomous-agents':
        return <AutonomousAgents />;
      case 'dynamic-nfts':
        return <DynamicNFTs />;
      case 'zk-proofs':
        return <ZeroKnowledgeProofs />;
      case 'impact-globe':
        return <ImpactGlobe />;
      case 'roi-calculator':
        return <ImpactROICalculator />;
      case 'compliance':
        return <AutomatedCompliance />;
      case 'leaderboards':
        return <ImpactLeaderboards />;
      case 'collaborative-canvas':
        return <CollaborativeCanvas />;
      case 'blockchain-audit':
        return <BlockchainAuditTrail />;
      case 'edge-computing':
        return <EdgeComputing />;
      case 'virtual-tours':
        return <VirtualTours />;
      case 'ar-overlay':
        return <ARImpactOverlay />;
      case 'graphql-federation':
        return <GraphQLFederation />;
      case 'universal-design':
        return <UniversalDesign />;
      case 'health':
        return <SystemHealth />;
      case 'alerts':
        return <AlertsCenter />;
      case 'users':
        return <UserManagement />;
      case 'activity-log':
        return <ActivityLog />;
      case 'api-config':
        return <APIConfiguration />;
      case 'data-backup':
        return <DataBackup />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'roles':
        return <RolePermissions />;
      case 'security':
        return <SecurityMonitor />;
      case 'support':
        return <SupportTickets />;
      case 'files':
        return <FileManager />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar activeView={activeView} onViewChange={handleViewChange} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 w-full">
        {/* Top Bar */}
        <TopBar currentView={activeView} />
        
        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {renderView()}
        </div>
      </div>

      {/* AI Co-Pilot */}
      <AICoPilot />
    </div>
  );
}