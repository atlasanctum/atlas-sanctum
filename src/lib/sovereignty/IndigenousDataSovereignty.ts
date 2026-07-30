// Indigenous Data Sovereignty Protocol
export interface DataSovereignty {
  indigenousControl: boolean;
  culturalProtection: boolean;
  consentMechanism: 'continuous' | 'revocable' | 'project_based';
  benefitSharing: number; // % to communities
}

export interface CommunityConsent {
  communityId: string;
  consentType: 'data_collection' | 'data_sharing' | 'commercialization';
  granted: boolean;
  timestamp: number;
  validators: string[];
  revocable: boolean;
  expiryDate?: number;
}

export interface CulturalProtocol {
  name: string;
  guardianCommunity: string;
  dataRights: 'sovereign' | 'shared' | 'restricted';
  validationRequired: boolean;
  sacredDataProtection: boolean;
}

export class IndigenousDataSovereignty {
  private communityConsents: Map<string, CommunityConsent[]> = new Map();
  private culturalProtocols: Map<string, CulturalProtocol> = new Map();

  async requestCommunityConsent(
    communityId: string,
    consentType: 'data_collection' | 'data_sharing' | 'commercialization',
    validators: string[]
  ): Promise<CommunityConsent> {
    const consent: CommunityConsent = {
      communityId,
      consentType,
      granted: false, // Requires community validation
      timestamp: Date.now(),
      validators,
      revocable: true,
      expiryDate: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 year
    };

    const existing = this.communityConsents.get(communityId) || [];
    existing.push(consent);
    this.communityConsents.set(communityId, existing);

    return consent;
  }

  async validateCommunityConsent(
    communityId: string,
    consentId: string,
    validator: string,
    granted: boolean
  ): Promise<boolean> {
    const consents = this.communityConsents.get(communityId) || [];
    const consent = consents.find(c => c.timestamp.toString() === consentId);
    
    if (!consent || !consent.validators.includes(validator)) {
      return false;
    }

    consent.granted = granted;
    return true;
  }

  async revokeCommunityConsent(communityId: string, consentId: string): Promise<boolean> {
    const consents = this.communityConsents.get(communityId) || [];
    const consentIndex = consents.findIndex(c => c.timestamp.toString() === consentId);
    
    if (consentIndex === -1) return false;
    
    consents[consentIndex].granted = false;
    return true;
  }

  async registerCulturalProtocol(protocol: CulturalProtocol): Promise<void> {
    this.culturalProtocols.set(protocol.name, protocol);
  }

  async validateDataAccess(
    communityId: string,
    dataType: string,
    accessType: 'collection' | 'sharing' | 'commercialization'
  ): Promise<{ allowed: boolean; benefitSharing: number; restrictions: string[] }> {
    const consents = this.communityConsents.get(communityId) || [];
    const validConsent = consents.find(c => 
      c.consentType === `data_${accessType}` && 
      c.granted && 
      (!c.expiryDate || c.expiryDate > Date.now())
    );

    if (!validConsent) {
      return { allowed: false, benefitSharing: 0, restrictions: ['No valid consent'] };
    }

    // Check cultural protocols
    const protocol = Array.from(this.culturalProtocols.values())
      .find(p => p.guardianCommunity === communityId);

    const restrictions: string[] = [];
    let benefitSharing = 70; // Default 70% to community

    if (protocol) {
      if (protocol.dataRights === 'sovereign') {
        benefitSharing = 90; // Higher benefit sharing for sovereign data
      } else if (protocol.dataRights === 'restricted') {
        restrictions.push('Restricted data access - cultural validation required');
      }

      if (protocol.sacredDataProtection) {
        restrictions.push('Sacred data protection protocols apply');
      }
    }

    return { allowed: true, benefitSharing, restrictions };
  }

  async calculateCommunityBenefits(
    communityId: string,
    totalRevenue: number,
    dataContribution: number
  ): Promise<{ communityShare: number; culturalFund: number; governanceFund: number }> {
    const validation = await this.validateDataAccess(communityId, 'ecosystem_data', 'commercialization');
    
    if (!validation.allowed) {
      return { communityShare: 0, culturalFund: 0, governanceFund: 0 };
    }

    const benefitPercentage = validation.benefitSharing / 100;
    const communityRevenue = totalRevenue * dataContribution * benefitPercentage;
    
    return {
      communityShare: communityRevenue * 0.7, // 70% direct to community
      culturalFund: communityRevenue * 0.2,   // 20% to cultural preservation
      governanceFund: communityRevenue * 0.1  // 10% to governance
    };
  }
}

export const indigenousDataSovereignty = new IndigenousDataSovereignty();