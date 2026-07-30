import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckoutModal } from "@/components/pricing/CheckoutModal";
import type { PlanDetails } from "@/components/pricing/CheckoutModal";

const BONDS = [
  { id: '5yr-regen', name: '5-Year Regen Bond', coupon: '3.8%', denominations: '$1M–$100M', billingPeriod: 'contract' as const, price: 1000000 },
  { id: '10yr-regen', name: '10-Year Regen Bond', coupon: '5.2%', denominations: '$5M–$500M', billingPeriod: 'contract' as const, price: 5000000 },
  { id: 'perpetual-regen', name: 'Perpetual Regen Bond', coupon: '6.5%', denominations: 'Unlimited', billingPeriod: 'contract' as const, price: 0 },
  { id: 'green-impact', name: 'Green Impact Bond', coupon: '4.5%', denominations: 'Proceeds fund new projects', billingPeriod: 'contract' as const, price: 0 },
];

export const MarketplaceBondsTab: React.FC = () => {
  const [selectedBond, setSelectedBond] = useState<PlanDetails | null>(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Regeneration-Backed Bonds</CardTitle>
          <CardDescription>Long-term financial instruments secured by regenerative assets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-l-green-500 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Regen Bond Structure</h4>
              <p className="text-sm text-green-800">
                Bonds backed by escrow of physical RIUs. Principal returned at maturity; interest paid quarterly. Risk-free asset backed by regenerative assets that only increase in value.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {BONDS.map(bond => (
                <div key={bond.id} className="p-4 border rounded-lg">
                  <p className="font-semibold text-sm mb-2">{bond.name}</p>
                  <p className="text-3xl font-bold text-emerald-600">{bond.coupon}</p>
                  <p className="text-xs text-muted-foreground">Annual coupon</p>
                  <p className="text-xs text-slate-700 mt-2">{bond.denominations}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 w-full"
                    onClick={() => setSelectedBond({
                      id: bond.id,
                      name: bond.name,
                      price: bond.price,
                      billingPeriod: bond.billingPeriod,
                      features: [`${bond.coupon} annual coupon`, bond.denominations],
                      segmentType: 'enterprise',
                    })}
                  >
                    Request Bond
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <CheckoutModal
        isOpen={!!selectedBond}
        onClose={() => setSelectedBond(null)}
        plan={selectedBond}
      />
    </div>
  );
};
