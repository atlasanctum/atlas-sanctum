import type { ProbabilisticValueUnit, SimulationParameters, SimulationResult, CivilizationScenario, RegenerationMarket, AdaptiveGovernanceCurve } from '../../cardano/CardanoLayerArchitecture';
import { CardanoLayer } from '../../cardano/CardanoLayerArchitecture';

// Initialize the Cardano Layer
let cardanoLayer: CardanoLayer | null = null;

/**
 * Initialize the Cardano Layer
 */
export const initializeCardanoLayer = (): void => {
  if (!cardanoLayer) {
    cardanoLayer = new CardanoLayer();
    console.log('Cardano Layer initialized');
  }
};

/**
 * Get the current state of the Atlas Probabilistic Oracle (APO)
 */
export const getOracleState = () => {
  if (!cardanoLayer) {
    initializeCardanoLayer();
  }
  
  return cardanoLayer!.getOracle();
};

/**
 * Update the Atlas Probabilistic Oracle (APO)
 */
export const updateOracle = async (): Promise<CardanoLayer['oracle']> => {
  if (!cardanoLayer) {
    initializeCardanoLayer();
  }
  
  return await cardanoLayer!.updateOracle();
};

/**
 * Calculate Probabilistic Value Units (PVUs)
 */
export const calculatePVU = (investmentId: string, baseValue: number): ProbabilisticValueUnit => {
  if (!cardanoLayer) {
    initializeCardanoLayer();
  }
  
  return cardanoLayer!.calculatePVU(investmentId, baseValue);
};

/**
 * Run civilization simulations
 */
export const runSimulation = (parameters: SimulationParameters): SimulationResult[] => {
  if (!cardanoLayer) {
    initializeCardanoLayer();
  }
  
  return cardanoLayer!.runSimulation(parameters);
};

/**
 * Get civilization scenarios
 */
export const getScenarios = (): CivilizationScenario[] => {
  if (!cardanoLayer) {
    initializeCardanoLayer();
  }
  
  return cardanoLayer!.getOracle().scenarios;
};

/**
 * Get risk heatmap
 */
export const getRiskHeatmap = () => {
  if (!cardanoLayer) {
    initializeCardanoLayer();
  }
  
  return cardanoLayer!.getOracle().riskHeatmap;
};

/**
 * Create a new regeneration market
 */
export const createRegenerationMarket = (marketData: Omit<RegenerationMarket, 'id' | 'status' | 'participants'>): RegenerationMarket => {
  if (!cardanoLayer) {
    initializeCardanoLayer();
  }
  
  return cardanoLayer!.createRegenerationMarket(marketData);
};

/**
 * Get all regeneration markets
 */
export const getRegenerationMarkets = (): RegenerationMarket[] => {
  if (!cardanoLayer) {
    initializeCardanoLayer();
  }
  
  return cardanoLayer!.getMarkets();
};

/**
 * Create an adaptive governance curve
 */
export const createAdaptiveGovernanceCurve = (
  policyId: string, 
  thresholds: any[]
): AdaptiveGovernanceCurve => {
  if (!cardanoLayer) {
    initializeCardanoLayer();
  }
  
  return cardanoLayer!.createAdaptiveGovernanceCurve(policyId, thresholds);
};

/**
 * Get all adaptive governance curves
 */
export const getAdaptiveGovernanceCurves = (): AdaptiveGovernanceCurve[] => {
  if (!cardanoLayer) {
    initializeCardanoLayer();
  }
  
  return cardanoLayer!.getGovernanceCurves();
};

/**
 * Update all adaptive governance curves
 */
export const updateGovernanceCurves = (): AdaptiveGovernanceCurve[] => {
  if (!cardanoLayer) {
    initializeCardanoLayer();
  }
  
  return cardanoLayer!.updateGovernanceCurves();
};

/**
 * Get the Cardano Layer instance
 */
export const getCardanoLayer = (): CardanoLayer => {
  if (!cardanoLayer) {
    initializeCardanoLayer();
  }
  
  return cardanoLayer!;
};

/**
 * Health check for the Cardano Layer
 */
export const healthCheck = (): { status: string; version: string } => {
  return {
    status: 'healthy',
    version: '1.0.0'
  };
};
