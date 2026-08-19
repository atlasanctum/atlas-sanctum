/**
 * PLAAS Kernel — Sovereignty Enforcer
 * Every cross-layer data request is gated here.
 * Indigenous data sovereignty is non-negotiable.
 */

import type { DataSovereigntyPolicy } from '../packages/protocols';
import type { NodeRole } from '../packages/types';

export interface AccessRequest {
  requesterId: string;
  requesterRole: NodeRole;
  bioregion: string;
  dataType: string;
  indigenousData: boolean;
  consentToken?: string;
}

export interface AccessDecision {
  granted: boolean;
  reason: string;
  policy: DataSovereigntyPolicy | null;
}

export class SovereigntyEnforcer {
  private readonly policies = new Map<string, DataSovereigntyPolicy>(); // key: `${bioregion}:${dataType}`

  registerPolicy(policy: DataSovereigntyPolicy & { dataType: string }): void {
    this.policies.set(`${policy.bioregion}:${policy.dataType}`, policy);
  }

  evaluate(req: AccessRequest): AccessDecision {
    const key = `${req.bioregion}:${req.dataType}`;
    const policy = this.policies.get(key) ?? this.policies.get(`*:${req.dataType}`);

    if (!policy) {
      // No policy registered — default allow for non-indigenous data
      if (req.indigenousData) {
        return { granted: false, reason: 'No policy for indigenous data — deny by default', policy: null };
      }
      return { granted: true, reason: 'No policy — open data', policy: null };
    }

    if (req.indigenousData && policy.indigenousProtected && !req.consentToken) {
      return { granted: false, reason: 'Indigenous data requires explicit consent token', policy };
    }

    if (!policy.allowedRoles.includes(req.requesterRole)) {
      return { granted: false, reason: `Role '${req.requesterRole}' not permitted by policy`, policy };
    }

    if (policy.requiresConsent && !req.consentToken) {
      return { granted: false, reason: 'Consent token required', policy };
    }

    return { granted: true, reason: 'Access approved', policy };
  }
}
