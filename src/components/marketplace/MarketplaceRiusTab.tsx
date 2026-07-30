import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const MarketplaceRiusTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Regenerative Impact Units (RIUs)</CardTitle>
          <CardDescription>Standardized asset class for regenerative carbon & ecosystem value</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border-l-4 border-l-emerald-500 bg-emerald-50 rounded-lg">
            <p className="text-sm text-emerald-900">
              <strong>Definition:</strong> One RIU = 1 metric ton of CO₂ equivalent removed from atmosphere + biodiversity benefits + health impacts, verified through the Valuation Engine
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">RIU Characteristics</h3>
              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold text-sm mb-1">Standardized</p>
                  <p className="text-xs text-muted-foreground">All RIUs meet minimum quality standards; cannot be issued below threshold</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="font-semibold text-sm mb-1">Fungible</p>
                  <p className="text-xs text-muted-foreground">All RIUs are interchangeable; one RIU (from Amazon) = one RIU (from Boreal Forest)</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="font-semibold text-sm mb-1">Liquid</p>
                  <p className="text-xs text-muted-foreground">Traded 24/7 on primary exchange; minimal bid-ask spreads</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="font-semibold text-sm mb-1">Permanent</p>
                  <p className="text-xs text-muted-foreground">Cannot be "un-issued"; retirement is permanent and public</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="font-semibold text-sm mb-1">Multi-Dimensional</p>
                  <p className="text-xs text-muted-foreground">Each RIU carries carbon, biodiversity, and health attributes</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">RIU Supply Dynamics</h3>
              <div className="space-y-3">
                <div className="p-4 border rounded-lg bg-emerald-50">
                  <p className="font-semibold text-sm text-emerald-900">Annual Issuance</p>
                  <p className="text-2xl font-bold text-emerald-600">450M</p>
                  <p className="text-xs text-emerald-700">RIUs issued (certified & verified)</p>
                </div>

                <div className="p-4 border rounded-lg bg-blue-50">
                  <p className="font-semibold text-sm text-blue-900">Annual Retirement</p>
                  <p className="text-2xl font-bold text-blue-600">320M</p>
                  <p className="text-xs text-blue-700">RIUs permanently removed from circulation</p>
                </div>

                <div className="p-4 border rounded-lg bg-purple-50">
                  <p className="font-semibold text-sm text-purple-900">Net Growth</p>
                  <p className="text-2xl font-bold text-purple-600">130M</p>
                  <p className="text-xs text-purple-700">Additional regeneration impact created</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
