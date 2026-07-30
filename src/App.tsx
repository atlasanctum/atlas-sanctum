import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/next"
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import ApiStatus from './components/ApiStatus';
import NewsletterBanner from './components/NewsletterBanner';
import Layout from './components/Layout';
import BackToTop from './components/BackToTop';
import { EnhancedAuthProvider } from './contexts/EnhancedAuthContext.tsx';
import AuthFallback from './components/AuthFallback';
import { SentryErrorBoundary } from './lib/errorReporting';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import AdminProtectedRoute from './components/AdminProtectedRoute.tsx';
import { OnboardingProvider } from '@/context/OnboardingContext';
import LoadingFallback from './components/LoadingFallback';
import { AIProvider } from './contexts/AIContext';
import { BlockchainProvider } from './contexts/BlockchainContext';

// ── Pages (lazy-loaded for code splitting) ──────────────────────────────────
const Index = lazy(() => import('./pages/Index'));
const BusinessModel = lazy(() => import('./pages/BusinessModel'));
const CriticalInnovations = lazy(() => import('./pages/CriticalInnovations'));
const AzureProductionStrategy = lazy(() => import('./pages/AzureProductionStrategy'));
const EthicalGovernance = lazy(() => import('./pages/EthicalGovernance'));
const RegenerativeValueExchange = lazy(() => import('./pages/RegenerativeValueExchange'));
const DataMetricsEngine = lazy(() => import('./pages/DataMetricsEngine'));
const CulturalKnowledgeImpact = lazy(() => import('./pages/CulturalKnowledgeImpact'));
const GlobalImpactEconomy = lazy(() => import('./pages/GlobalImpactEconomy'));
const EndToEndExperience = lazy(() => import('./pages/EndToEndExperience'));
const EngineeringArchitecture = lazy(() => import('./pages/EngineeringArchitecture'));
const RVXInnovations = lazy(() => import('./pages/RVXInnovations'));
const DashboardWithSidebar = lazy(() => import('./pages/DashboardWithSidebar'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Auth = lazy(() => import('./pages/Auth'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Profile = lazy(() => import('./pages/Profile'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const TransactionHistory = lazy(() => import('./pages/TransactionHistory'));
const Status = lazy(() => import('./pages/Status'));
const Demo = lazy(() => import('./pages/Demo'));
const Bioregions = lazy(() => import('./pages/Bioregions'));
const Measurements = lazy(() => import('./pages/Measurements'));
const Valuation = lazy(() => import('./pages/Valuation'));
const Governance = lazy(() => import('./pages/Governance'));
const RegenerativeAgriculture = lazy(() => import('./pages/RegenerativeAgriculture'));
const Health = lazy(() => import('./pages/Health'));
const Security = lazy(() => import('./pages/Security'));
const Adoption = lazy(() => import('./pages/Adoption'));
const Outreach = lazy(() => import('./pages/Outreach'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const Contact = lazy(() => import('./pages/Contact'));
const Payment = lazy(() => import('./pages/Payment'));
const RegenerativeFinance = lazy(() => import('./pages/RegenerativeFinance'));
const DeFi = lazy(() => import('./pages/DeFi'));
const Community = lazy(() => import('./pages/Community'));
const Education = lazy(() => import('./pages/Education'));
const CarbonCalculator = lazy(() => import('./pages/CarbonCalculator'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const CardanoLayer = lazy(() => import('./pages/CardanoLayer'));
const AdminCommandCenter = lazy(() => import('./pages/admin/AdminCommandCenter'));
const FeatureFlagsAdmin = lazy(() => import('./pages/admin/FeatureFlags'));
const NewsletterAttempts = lazy(() => import('./pages/admin/NewsletterAttempts'));
const Careers = lazy(() => import('./pages/Careers'));
const NotFound = lazy(() => import('./pages/NotFound'));
const SegmentSelection = lazy(() => import('./pages/SegmentSelection'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const DashboardOverview = lazy(() => import('./pages/DashboardOverview'));
const ReportsAnalytics = lazy(() => import('./pages/ReportsAnalytics'));
const Settings = lazy(() => import('./pages/Settings'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Transactions = lazy(() => import('./pages/Transactions'));
const About = lazy(() => import('./pages/About'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const Accessibility = lazy(() => import('./pages/Accessibility'));
const MediaKit = lazy(() => import('./pages/MediaKit'));
const APIDocumentation = lazy(() => import('./pages/APIDocumentation'));
const DonorDashboard = lazy(() => import('./pages/DonorDashboard'));
const FieldAgentDashboard = lazy(() => import('./pages/FieldAgentDashboard'));
const AdministratorDashboard = lazy(() => import('./pages/AdministratorDashboard'));
const CommunityDashboard = lazy(() => import('./pages/CommunityDashboard'));
const EnterpriseDashboard = lazy(() => import('./pages/EnterpriseDashboard'));
const GovernmentDashboard = lazy(() => import('./pages/GovernmentDashboard'));
const DeFiDashboard = lazy(() => import('./pages/DeFiDashboard'));
const NGODashboard = lazy(() => import('./pages/NGODashboard'));
const BillingDashboard = lazy(() => import('./pages/enterprise/BillingDashboard'));
const InvoicesManagement = lazy(() => import('./pages/enterprise/InvoicesManagement'));
const PaymentMethods = lazy(() => import('./pages/enterprise/PaymentMethods'));
const APIAnalyticsDashboard = lazy(() => import('./pages/enterprise/APIAnalyticsDashboard'));
const APIKeyManagement = lazy(() => import('./pages/enterprise/APIKeyManagement'));
const MFASetup = lazy(() => import('./pages/enterprise/MFASetup'));
const Checkout = lazy(() => import('./pages/Checkout'));
const CustomerPortal = lazy(() => import('./pages/CustomerPortal'));
const SubscriptionPlans = lazy(() => import('./pages/SubscriptionPlans'));
const ExploreVerifiedProjects = lazy(() => import('./pages/ExploreVerifiedProjects'));
const DemoLogin = lazy(() => import('./pages/DemoLogin'));
const AIInsights = lazy(() => import('./components/ai/AIInsights'));
const IntelligenceArchitecture = lazy(() => import('./pages/IntelligenceArchitecture'));
const CarbonCreditMarketplace = lazy(() => import('./components/defi/CarbonCreditMarketplace'));
const GamificationHub = lazy(() => import('./components/gamification/GamificationHub'));
const BlockchainVerification = lazy(() => import('./components/blockchain/BlockchainVerification'));
const DecentralizedGovernanceDashboard = lazy(() => import('./layers/Decentralizedaigovernancedesign-main/src/app/App'));
const Prototype = lazy(() => import('./pages/Prototype'));
const DashboardHub = lazy(() => import('./pages/DashboardHub'));
const MythicArchitect = lazy(() => import('./pages/MythicArchitect'));
const SanctumAI = lazy(() => import('./pages/sanctum/SanctumAI'));
const BeatificAlignment = lazy(() => import('./pages/BeatificAlignment'));
const CarbonOffsetting = lazy(() => import('./pages/InfrastructurePages').then(m => ({ default: m.CarbonOffsetting })));
const ImpactInvestment = lazy(() => import('./pages/InfrastructurePages').then(m => ({ default: m.ImpactInvestment })));
const RegulatoryCompliance = lazy(() => import('./pages/InfrastructurePages').then(m => ({ default: m.RegulatoryCompliance })));
const EnterpriseSolutions = lazy(() => import('./pages/InfrastructurePages').then(m => ({ default: m.EnterpriseSolutions })));
const SMBSolutions = lazy(() => import('./pages/InfrastructurePages').then(m => ({ default: m.SMBSolutions })));
const AgricultureSolutions = lazy(() => import('./pages/InfrastructurePages').then(m => ({ default: m.AgricultureSolutions })));
const RenewableEnergy = lazy(() => import('./pages/InfrastructurePages').then(m => ({ default: m.RenewableEnergy })));
const EducationHub = lazy(() => import('./pages/InfrastructurePages').then(m => ({ default: m.EducationHub })));
const IntegrationStatus = lazy(() => import('./pages/IntegrationStatus'));
const Certifications = lazy(() => import('./pages/InfrastructurePages').then(m => ({ default: m.Certifications })));

// ── Roadmap Phase Pages ──────────────────────────────────────────────────────
const Roadmap = lazy(() => import('./pages/Roadmap'));
// Phase 2
const KnowledgeGraph = lazy(() => import('./pages/KnowledgeGraph'));
const SatelliteIntegration = lazy(() => import('./pages/SatelliteIntegration'));
const PredictiveAnalytics = lazy(() => import('./pages/PredictiveAnalytics'));
const MobileApplication = lazy(() => import('./pages/MobileApplication'));
const PublicAPIs = lazy(() => import('./pages/PublicAPIs'));
// Phase 3
const MultiAgentIntelligence = lazy(() => import('./pages/MultiAgentIntelligence'));
const DigitalTwins = lazy(() => import('./pages/DigitalTwins'));
const SimulationEngine = lazy(() => import('./pages/SimulationEngine'));
const DecisionIntelligence = lazy(() => import('./pages/DecisionIntelligence'));
const EnterprisePlatform = lazy(() => import('./pages/EnterprisePlatform'));
// Phase 4
const GlobalMarketplace = lazy(() => import('./pages/GlobalMarketplace'));
const OpenResearchPlatform = lazy(() => import('./pages/OpenResearchPlatform'));
const CommunityEcosystem = lazy(() => import('./pages/CommunityEcosystem'));
const DeveloperSDK = lazy(() => import('./pages/DeveloperSDK'));
const PluginMarketplace = lazy(() => import('./pages/PluginMarketplace'));

/**
 * AnimatedRoutes — lives inside BrowserRouter so useLocation() is available.
 */
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {/* Key on the Routes element so AnimatePresence sees a new child on every route change */}
      <Routes location={location} key={location.pathname}>
        <Route path="/prototype" element={<PageTransition><Prototype /></PageTransition>} />
        <Route path="/hub" element={<PageTransition><DashboardHub /></PageTransition>} />
        <Route path="/mythic-architect" element={<PageTransition><MythicArchitect /></PageTransition>} />
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/auth" element={<PageTransition variant="scale"><Auth /></PageTransition>} />
        <Route path="/marketplace" element={<PageTransition><Marketplace /></PageTransition>} />
        <Route path="/explore-verified-projects" element={<PageTransition><ExploreVerifiedProjects /></PageTransition>} />
        <Route path="/portfolio" element={<PageTransition><Portfolio /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/bioregions" element={<PageTransition variant="slideRight"><Bioregions /></PageTransition>} />
        <Route path="/measurements" element={<PageTransition><Measurements /></PageTransition>} />
        <Route path="/valuation" element={<PageTransition variant="slideRight"><Valuation /></PageTransition>} />
        <Route path="/governance" element={<PageTransition><Governance /></PageTransition>} />
        <Route path="/regenerative-agriculture" element={<PageTransition variant="slideRight"><RegenerativeAgriculture /></PageTransition>} />
        <Route path="/health" element={<PageTransition><Health /></PageTransition>} />
        <Route path="/security" element={<PageTransition variant="fade"><Security /></PageTransition>} />
        <Route path="/adoption" element={<PageTransition variant="fade"><Adoption /></PageTransition>} />
        <Route path="/outreach" element={<PageTransition><Outreach /></PageTransition>} />
        <Route path="/help-center" element={<PageTransition><HelpCenter /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/pricing" element={<PageTransition><SubscriptionPlans /></PageTransition>} />
        <Route path="/payment" element={<PageTransition><Payment /></PageTransition>} />
        <Route path="/payment/:reference" element={<PageTransition><Payment /></PageTransition>} />
        <Route path="/regenerative-finance" element={<PageTransition><RegenerativeFinance /></PageTransition>} />
        <Route path="/regenerative-finance/:id" element={<PageTransition><RegenerativeFinance /></PageTransition>} />
        <Route path="/defi" element={<PageTransition><DeFi /></PageTransition>} />
        <Route path="/defi/:id" element={<PageTransition><DeFi /></PageTransition>} />
        <Route path="/community" element={<PageTransition><Community /></PageTransition>} />
        <Route path="/community/:id" element={<PageTransition><Community /></PageTransition>} />
        <Route path="/education" element={<PageTransition><Education /></PageTransition>} />
        <Route path="/education/:id" element={<PageTransition><Education /></PageTransition>} />
        <Route path="/business-model" element={<PageTransition><BusinessModel /></PageTransition>} />
        <Route path="/critical-innovations" element={<PageTransition><CriticalInnovations /></PageTransition>} />
        <Route path="/azure-strategy" element={<PageTransition><AzureProductionStrategy /></PageTransition>} />
        <Route path="/ethical-governance" element={<PageTransition><EthicalGovernance /></PageTransition>} />
        <Route path="/regenerative-value-exchange" element={<PageTransition><RegenerativeValueExchange /></PageTransition>} />
        <Route path="/data-metrics-engine" element={<PageTransition><DataMetricsEngine /></PageTransition>} />
        <Route path="/cultural-knowledge-impact" element={<PageTransition><CulturalKnowledgeImpact /></PageTransition>} />
        <Route path="/global-impact-economy" element={<PageTransition><GlobalImpactEconomy /></PageTransition>} />
        <Route path="/end-to-end-experience" element={<PageTransition><EndToEndExperience /></PageTransition>} />
        <Route path="/engineering-architecture" element={<PageTransition><EngineeringArchitecture /></PageTransition>} />
        <Route path="/rvx-innovations" element={<PageTransition><RVXInnovations /></PageTransition>} />
        <Route path="/dashboard-with-sidebar" element={<PageTransition><DashboardWithSidebar /></PageTransition>} />
        <Route path="/status" element={<PageTransition><Status /></PageTransition>} />
        <Route path="/demo" element={<PageTransition><Demo /></PageTransition>} />
        <Route path="/project/:id" element={<PageTransition variant="slideRight"><ProjectDetail /></PageTransition>} />
        <Route path="/transactions" element={<PageTransition><TransactionHistory /></PageTransition>} />
        <Route path="/calculator" element={<PageTransition><CarbonCalculator /></PageTransition>} />
        <Route path="/leaderboard" element={<PageTransition><Leaderboard /></PageTransition>} />
        <Route path="/cardano-layer" element={<PageTransition><CardanoLayer /></PageTransition>} />
        <Route path="/architecture" element={<PageTransition><EngineeringArchitecture /></PageTransition>} />
        <Route path="/dashboards" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/careers" element={<PageTransition><Careers /></PageTransition>} />
        <Route path="/admin" element={<AdminProtectedRoute><PageTransition variant="fade"><AdminCommandCenter /></PageTransition></AdminProtectedRoute>} />
        <Route path="/admin/flags" element={<AdminProtectedRoute><PageTransition variant="fade"><FeatureFlagsAdmin /></PageTransition></AdminProtectedRoute>} />
        <Route path="/admin/newsletter" element={<AdminProtectedRoute><PageTransition variant="fade"><NewsletterAttempts /></PageTransition></AdminProtectedRoute>} />
        <Route path="/segment-selection" element={<PageTransition variant="scale"><SegmentSelection /></PageTransition>} />
        <Route path="/onboarding" element={<PageTransition variant="scale"><Onboarding /></PageTransition>} />
        <Route path="/dashboard-overview" element={<PageTransition><DashboardOverview /></PageTransition>} />
        <Route path="/reports-analytics" element={<PageTransition><ReportsAnalytics /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
        <Route path="/privacy-policy" element={<PageTransition variant="fade"><PrivacyPolicy /></PageTransition>} />
        <Route path="/terms-of-service" element={<PageTransition variant="fade"><TermsOfService /></PageTransition>} />
        <Route path="/my-transactions" element={<PageTransition><Transactions /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/cookie-policy" element={<PageTransition variant="fade"><CookiePolicy /></PageTransition>} />
        <Route path="/accessibility" element={<PageTransition variant="fade"><Accessibility /></PageTransition>} />
        <Route path="/media-kit" element={<PageTransition><MediaKit /></PageTransition>} />
        <Route path="/help" element={<PageTransition><HelpCenter /></PageTransition>} />
        <Route path="/help/documentation" element={<PageTransition><APIDocumentation /></PageTransition>} />
        <Route path="/dashboard/donor" element={<ProtectedRoute requiredDashboard="donor"><PageTransition><DonorDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/field-agent" element={<ProtectedRoute requiredDashboard="field-agent"><PageTransition><FieldAgentDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/administrator" element={<ProtectedRoute requiredDashboard="administrator"><PageTransition><AdministratorDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/community" element={<ProtectedRoute requiredDashboard="community"><PageTransition><CommunityDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/enterprise" element={<ProtectedRoute requiredDashboard="enterprise"><PageTransition><EnterpriseDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/government" element={<ProtectedRoute requiredDashboard="government"><PageTransition><GovernmentDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/defi" element={<ProtectedRoute requiredDashboard="defi"><PageTransition><DeFiDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard/ngo" element={<ProtectedRoute requiredDashboard="ngo"><PageTransition><NGODashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute requiredRole="enterprise"><PageTransition><BillingDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/invoices" element={<ProtectedRoute requiredRole="enterprise"><PageTransition><InvoicesManagement /></PageTransition></ProtectedRoute>} />
        <Route path="/payment-methods" element={<ProtectedRoute requiredRole="enterprise"><PageTransition><PaymentMethods /></PageTransition></ProtectedRoute>} />
        <Route path="/api-analytics" element={<ProtectedRoute requiredRole="enterprise"><PageTransition><APIAnalyticsDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/api-keys" element={<ProtectedRoute requiredRole="enterprise"><PageTransition><APIKeyManagement /></PageTransition></ProtectedRoute>} />
        <Route path="/mfa-setup" element={<ProtectedRoute><PageTransition variant="scale"><MFASetup /></PageTransition></ProtectedRoute>} />
        <Route path="/checkout" element={<PageTransition variant="scale"><Checkout /></PageTransition>} />
        <Route path="/customer-portal" element={<PageTransition><CustomerPortal /></PageTransition>} />
        <Route path="/carbon-offsetting" element={<PageTransition variant="slideRight"><CarbonOffsetting /></PageTransition>} />
        <Route path="/impact-investment" element={<PageTransition variant="slideRight"><ImpactInvestment /></PageTransition>} />
        <Route path="/regulatory-compliance" element={<PageTransition variant="slideRight"><RegulatoryCompliance /></PageTransition>} />
        <Route path="/enterprise-solutions" element={<PageTransition variant="slideRight"><EnterpriseSolutions /></PageTransition>} />
        <Route path="/smb-solutions" element={<PageTransition variant="slideRight"><SMBSolutions /></PageTransition>} />
        <Route path="/agriculture-solutions" element={<PageTransition variant="slideRight"><AgricultureSolutions /></PageTransition>} />
        <Route path="/renewable-energy" element={<PageTransition variant="slideRight"><RenewableEnergy /></PageTransition>} />
        <Route path="/education-hub" element={<PageTransition><EducationHub /></PageTransition>} />
        <Route path="/certifications" element={<PageTransition><Certifications /></PageTransition>} />
        <Route path="/demo-login" element={<PageTransition variant="scale"><DemoLogin /></PageTransition>} />
        <Route path="/ai-insights" element={<PageTransition><AIInsights /></PageTransition>} />
        <Route path="/carbon-marketplace" element={<PageTransition><CarbonCreditMarketplace /></PageTransition>} />
        <Route path="/impact-challenges" element={<PageTransition><GamificationHub /></PageTransition>} />
        <Route path="/blockchain-verification" element={<PageTransition><BlockchainVerification /></PageTransition>} />
        <Route path="/decentralized-governance" element={<PageTransition><DecentralizedGovernanceDashboard /></PageTransition>} />
        {/* Roadmap */}
        <Route path="/roadmap" element={<PageTransition><Roadmap /></PageTransition>} />
        {/* Phase 2 */}
        <Route path="/knowledge-graph" element={<PageTransition><KnowledgeGraph /></PageTransition>} />
        <Route path="/satellite-integration" element={<PageTransition><SatelliteIntegration /></PageTransition>} />
        <Route path="/predictive-analytics" element={<PageTransition><PredictiveAnalytics /></PageTransition>} />
        <Route path="/mobile-app" element={<PageTransition><MobileApplication /></PageTransition>} />
        <Route path="/public-apis" element={<PageTransition><PublicAPIs /></PageTransition>} />
        {/* Phase 3 */}
        <Route path="/multi-agent-intelligence" element={<PageTransition><MultiAgentIntelligence /></PageTransition>} />
        <Route path="/digital-twins" element={<PageTransition><DigitalTwins /></PageTransition>} />
        <Route path="/simulation-engine" element={<PageTransition><SimulationEngine /></PageTransition>} />
        <Route path="/decision-intelligence" element={<PageTransition><DecisionIntelligence /></PageTransition>} />
        <Route path="/enterprise-platform" element={<PageTransition><EnterprisePlatform /></PageTransition>} />
        {/* Phase 4 */}
        <Route path="/global-marketplace" element={<PageTransition><GlobalMarketplace /></PageTransition>} />
        <Route path="/open-research" element={<PageTransition><OpenResearchPlatform /></PageTransition>} />
        <Route path="/community-ecosystem" element={<PageTransition><CommunityEcosystem /></PageTransition>} />
        <Route path="/developer-sdk" element={<PageTransition><DeveloperSDK /></PageTransition>} />
        <Route path="/plugin-marketplace" element={<PageTransition><PluginMarketplace /></PageTransition>} />
        <Route path="*" element={<PageTransition variant="fade"><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <OnboardingProvider>
      <EnhancedAuthProvider>
        <AIProvider>
          <BlockchainProvider>
            <SentryErrorBoundary fallback={<AuthFallback />}>
              <BrowserRouter>
                <RouteErrorBoundary>
                  <AnimatedRoutes />
                  <BackToTop />
                  <Analytics />
                </RouteErrorBoundary>
              </BrowserRouter>
            </SentryErrorBoundary>
          </BlockchainProvider>
        </AIProvider>
      </EnhancedAuthProvider>
    </OnboardingProvider>
  );
};

export default App;
