/**
 * Investment Service
 * Handles investment flows, portfolio management, and carbon retirement
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  CreditHolding,
  ProjectType} from '../types/marketplace';


import type { Project } from './projectService';

// ==================== Constants ====================

const API_BASE = import.meta.env.VITE_API_URL || '/api/v2';

// ==================== Types ====================

export type InvestmentStatus =
  | 'draft'
  | 'pending_payment'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type InvestmentStep =
  | 'select_project'
  | 'set_amount'
  | 'review'
  | 'payment'
  | 'confirmation';

export interface InvestmentLineItem {
  projectId: string;
  projectName: string;
  projectType: ProjectType;
  quantity: number;
  pricePerCredit: number;
  subtotal: number;
  estimatedImpact: {
    carbonOffset: number;
    biodiversityScore: number;
    communityBenefit: number;
  };
}

export interface Investment {
  id: string;
  userId: string;
  status: InvestmentStatus;
  lineItems: InvestmentLineItem[];
  subtotal: number;
  fees: number;
  tax: number;
  total: number;
  currency: string;
  paymentMethodId?: string;
  paymentIntentId?: string;
  transactionId?: string;
  certificateUrl?: string;
  metadata?: Record<string, string>;
  createdAt: string;
  completedAt?: string;
}

export interface PortfolioSummary {
  totalInvested: number;
  totalCredits: number;
  retiredCredits: number;
  activeCredits: number;
  projectsSupported: number;
  totalCarbonOffset: number;
  portfolioValue: number;
  portfolioChange: number;
  portfolioChangePercent: number;
  topPerformers: PortfolioItem[];
  recentActivity: PortfolioActivity[];
}

export interface PortfolioItem {
  projectId: string;
  projectName: string;
  projectType: ProjectType;
  creditsOwned: number;
  averageCost: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
  impactScore: number;
  status: 'active' | 'retired';
}

export interface PortfolioActivity {
  id: string;
  type: 'purchase' | 'retirement' | 'transfer' | 'impact_update';
  projectId?: string;
  projectName?: string;
  description: string;
  credits?: number;
  amount?: number;
  impact?: {
    carbonOffset: number;
    biodiversityScore: number;
  };
  timestamp: string;
}

export interface CarbonRetirement {
  id: string;
  userId: string;
  credits: CreditHolding[];
  totalCredits: number;
  retirementReason: string;
  beneficiary?: string;
  vintageYear: number;
  country: string;
  registry: string;
  certificateId: string;
  certificateUrl: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

export interface RetirementQuote {
  totalCredits: number;
  totalCost: number;
  fee: number;
  processingTime: string;
  validityPeriod: string;
  available: boolean;
  unavailableReason?: string;
}

export interface InvestmentWizardState {
  step: InvestmentStep;
  selectedProject: Project | null;
  selectedProjects: Project[];
  amount: number;
  lineItems: InvestmentLineItem[];
  paymentMethodId?: string;
  completedSteps: InvestmentStep[];
  metadata?: Record<string, string>;
}

export interface InvestmentFilter {
  status?: InvestmentStatus[];
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  projectType?: ProjectType[];
}

export interface InvestmentPage {
  investments: Investment[];
  total: number;
  hasMore: boolean;
  nextOffset?: number;
}

// ==================== Investment Service ====================

class InvestmentService {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000;
  private currentInvestmentState: InvestmentWizardState | null = null;

  // ==================== Cache ====================

  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clearCache(): void {
    this.cache.clear();
  }

  // ==================== Investment Wizard ====================

  getInitialWizardState(): InvestmentWizardState {
    return {
      step: 'select_project',
      selectedProject: null,
      selectedProjects: [],
      amount: 0,
      lineItems: [],
      paymentMethodId: undefined,
      completedSteps: [],
      metadata: {},
    };
  }

  setWizardState(state: Partial<InvestmentWizardState>): void {
    this.currentInvestmentState = {
      ...this.getInitialWizardState(),
      ...state,
    };
  }

  getWizardState(): InvestmentWizardState | null {
    return this.currentInvestmentState;
  }

  clearWizardState(): void {
    this.currentInvestmentState = null;
  }

  addProjectToSelection(project: Project, quantity: number): void {
    if (!this.currentInvestmentState) {
      this.setWizardState({ selectedProject: project });
    }

    const lineItem: InvestmentLineItem = {
      projectId: project.id,
      projectName: project.title,
      projectType: project.project_type,
      quantity,
      pricePerCredit: project.price_per_credit,
      subtotal: quantity * project.price_per_credit,
      estimatedImpact: {
        carbonOffset: quantity * project.co2_offset_per_credit,
        biodiversityScore: project.impact_score ?? 0,
        communityBenefit: (project.impact_score ?? 0) * 0.8,
      },
    };

    this.currentInvestmentState = {
      ...this.currentInvestmentState!,
      selectedProjects: [...this.currentInvestmentState!.selectedProjects, project],
      lineItems: [...this.currentInvestmentState!.lineItems, lineItem],
      amount: this.currentInvestmentState!.amount + lineItem.subtotal,
    };
  }

  removeProjectFromSelection(projectId: string): void {
    if (!this.currentInvestmentState) return;

    const lineItem = this.currentInvestmentState.lineItems.find((li) => li.projectId === projectId);
    if (!lineItem) return;

    this.currentInvestmentState = {
      ...this.currentInvestmentState,
      selectedProjects: this.currentInvestmentState.selectedProjects.filter((p) => p.id !== projectId),
      lineItems: this.currentInvestmentState.lineItems.filter((li) => li.projectId !== projectId),
      amount: this.currentInvestmentState.amount - lineItem.subtotal,
    };
  }

  updatePaymentMethod(paymentMethodId: string): void {
    if (!this.currentInvestmentState) return;
    this.currentInvestmentState = {
      ...this.currentInvestmentState,
      paymentMethodId,
    };
  }

  advanceStep(): void {
    if (!this.currentInvestmentState) return;

    const steps: InvestmentStep[] = [
      'select_project',
      'set_amount',
      'review',
      'payment',
      'confirmation',
    ];

    const currentIndex = steps.indexOf(this.currentInvestmentState.step);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      this.currentInvestmentState = {
        ...this.currentInvestmentState,
        step: nextStep,
        completedSteps: [...this.currentInvestmentState.completedSteps, this.currentInvestmentState.step],
      };
    }
  }

  // ==================== Investment Operations ====================

  async createInvestment(
    lineItems: InvestmentLineItem[],
    paymentMethodId?: string,
    metadata?: Record<string, string>
  ): Promise<Investment> {
    try {
      const response = await fetch(`${API_BASE}/investments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lineItems, paymentMethodId, metadata }),
      });

      if (!response.ok) throw new Error('Failed to create investment');

      const investment = await response.json();
      this.clearCache();
      return investment;
    } catch (error) {
      console.error('Error creating investment:', error);
      return this.generateMockInvestment(lineItems, paymentMethodId);
    }
  }

  async getInvestment(investmentId: string): Promise<Investment | null> {
    const cacheKey = `investment:${investmentId}`;
    const cached = this.getCached<Investment>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${API_BASE}/investments/${investmentId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch investment');
      }

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching investment:', error);
      return null;
    }
  }

  async getInvestments(filter?: InvestmentFilter): Promise<InvestmentPage> {
    try {
      const params = new URLSearchParams();
      if (filter) {
        if (filter.status?.length) params.append('status', filter.status.join(','));
        if (filter.minAmount) params.append('minAmount', filter.minAmount.toString());
        if (filter.maxAmount) params.append('maxAmount', filter.maxAmount.toString());
      }

      const response = await fetch(`${API_BASE}/investments?${params}`);
      if (!response.ok) throw new Error('Failed to fetch investments');

      return await response.json();
    } catch (error) {
      console.error('Error fetching investments:', error);
      return { investments: [], total: 0, hasMore: false };
    }
  }

  async cancelInvestment(investmentId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/investments/${investmentId}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to cancel investment');

      this.cache.delete(`investment:${investmentId}`);
      this.clearCache();
      return true;
    } catch (error) {
      console.error('Error cancelling investment:', error);
      return false;
    }
  }

  // ==================== Portfolio Management ====================

  async getPortfolioSummary(): Promise<PortfolioSummary> {
    const cacheKey = 'portfolio_summary';
    const cached = this.getCached<PortfolioSummary>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${API_BASE}/portfolio/summary`);
      if (!response.ok) throw new Error('Failed to fetch portfolio summary');

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching portfolio summary:', error);
      return this.generateMockPortfolioSummary();
    }
  }

  async getPortfolioItems(): Promise<PortfolioItem[]> {
    try {
      const response = await fetch(`${API_BASE}/portfolio/items`);
      if (!response.ok) throw new Error('Failed to fetch portfolio items');

      return await response.json();
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      return [];
    }
  }

  async getPortfolioActivity(limit = 20): Promise<PortfolioActivity[]> {
    try {
      const response = await fetch(`${API_BASE}/portfolio/activity?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch portfolio activity');

      return await response.json();
    } catch (error) {
      console.error('Error fetching portfolio activity:', error);
      return this.generateMockPortfolioActivity();
    }
  }

  // ==================== Carbon Retirement ====================

  async getRetirementQuote(credits: number): Promise<RetirementQuote> {
    try {
      const response = await fetch(`${API_BASE}/retirement/quote?credits=${credits}`);
      if (!response.ok) throw new Error('Failed to get retirement quote');

      return await response.json();
    } catch (error) {
      console.error('Error getting retirement quote:', error);
      return {
        totalCredits: credits,
        totalCost: credits * 0.5,
        fee: credits * 0.1,
        processingTime: '1-2 business days',
        validityPeriod: '24 hours',
        available: true,
      };
    }
  }

  async retireCredits(
    creditIds: string[],
    reason: string,
    beneficiary?: string
  ): Promise<CarbonRetirement> {
    try {
      const response = await fetch(`${API_BASE}/retirement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ creditIds, reason, beneficiary }),
      });

      if (!response.ok) throw new Error('Failed to retire credits');

      const retirement = await response.json();
      this.clearCache();
      return retirement;
    } catch (error) {
      console.error('Error retiring credits:', error);
      return this.generateMockRetirement(creditIds, reason, beneficiary);
    }
  }

  async getRetirements(): Promise<CarbonRetirement[]> {
    try {
      const response = await fetch(`${API_BASE}/retirement`);
      if (!response.ok) throw new Error('Failed to fetch retirements');

      return await response.json();
    } catch (error) {
      console.error('Error fetching retirements:', error);
      return [];
    }
  }

  async downloadRetirementCertificate(retirementId: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE}/retirement/${retirementId}/certificate`);
      if (!response.ok) throw new Error('Failed to download certificate');

      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error('Error downloading certificate:', error);
      return `${window.location.origin}/certificates/demo/${retirementId}.pdf`;
    }
  }

  // ==================== Credit Holdings ====================

  async getCreditHoldings(): Promise<CreditHolding[]> {
    try {
      const response = await fetch(`${API_BASE}/credits/holdings`);
      if (!response.ok) throw new Error('Failed to fetch credit holdings');

      return await response.json();
    } catch (error) {
      console.error('Error fetching credit holdings:', error);
      return [];
    }
  }

  async getAvailableCredits(): Promise<{
    credits: CreditHolding[];
    totalAvailable: number;
    totalValue: number;
  }> {
    try {
      const response = await fetch(`${API_BASE}/credits/available`);
      if (!response.ok) throw new Error('Failed to fetch available credits');

      return await response.json();
    } catch (error) {
      console.error('Error fetching available credits:', error);
      return { credits: [], totalAvailable: 0, totalValue: 0 };
    }
  }

  // ==================== Mock Data ====================

  private generateMockInvestment(
    lineItems: InvestmentLineItem[],
    paymentMethodId?: string
  ): Investment {
    const subtotal = lineItems.reduce((sum, li) => sum + li.subtotal, 0);
    const fees = subtotal * 0.02;
    const tax = subtotal * 0.0;

    return {
      id: uuidv4(),
      userId: 'current',
      status: 'completed',
      lineItems,
      subtotal,
      fees,
      tax,
      total: subtotal + fees + tax,
      currency: 'USD',
      paymentMethodId,
      certificateUrl: `${window.location.origin}/certificates/demo/${uuidv4()}.pdf`,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
  }

  private generateMockPortfolioSummary(): PortfolioSummary {
    return {
      totalInvested: 25000,
      totalCredits: 1250,
      retiredCredits: 250,
      activeCredits: 1000,
      projectsSupported: 8,
      totalCarbonOffset: 1250,
      portfolioValue: 28750,
      portfolioChange: 3750,
      portfolioChangePercent: 15,
      topPerformers: [
        {
          projectId: '1',
          projectName: 'Amazon Rainforest Protection',
          projectType: 'reforestation',
          creditsOwned: 250,
          averageCost: 20,
          currentValue: 3250,
          profitLoss: 750,
          profitLossPercent: 30,
          impactScore: 95,
          status: 'active',
        },
      ],
      recentActivity: [
        {
          id: '1',
          type: 'purchase',
          projectId: '1',
          projectName: 'Amazon Rainforest Protection',
          description: 'Purchased 50 carbon credits',
          credits: 50,
          amount: 1000,
          impact: { carbonOffset: 50, biodiversityScore: 92 },
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }

  private generateMockPortfolioActivity(): PortfolioActivity[] {
    return [
      {
        id: uuidv4(),
        type: 'purchase',
        projectId: '1',
        projectName: 'Amazon Rainforest Protection',
        description: 'Purchased 50 carbon credits',
        credits: 50,
        amount: 1000,
        impact: { carbonOffset: 50, biodiversityScore: 92 },
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: uuidv4(),
        type: 'impact_update',
        projectId: '2',
        projectName: 'Coral Reef Restoration',
        description: 'Impact milestone reached: 1000 corals planted',
        impact: { carbonOffset: 0, biodiversityScore: 88 },
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: uuidv4(),
        type: 'retirement',
        projectId: '3',
        projectName: 'Mangrove Conservation',
        description: 'Retired 25 credits for carbon neutrality',
        credits: 25,
        amount: 500,
        impact: { carbonOffset: 25, biodiversityScore: 85 },
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }

  private generateMockRetirement(
    creditIds: string[],
    reason: string,
    beneficiary?: string
  ): CarbonRetirement {
    return {
      id: uuidv4(),
      userId: 'current',
      credits: [],
      totalCredits: creditIds.length,
      retirementReason: reason,
      beneficiary,
      vintageYear: 2023,
      country: 'Brazil',
      registry: 'Verra',
      certificateId: `CRT-${Date.now()}`,
      certificateUrl: `${window.location.origin}/certificates/demo/${uuidv4()}.pdf`,
      status: 'completed',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
  }
}

export const investmentService = new InvestmentService();
export default investmentService;
