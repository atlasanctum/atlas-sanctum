import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Sample price data
const priceHistory = [
  { date: "Jan", riu: 68.5, index: 72.3 },
  { date: "Feb", riu: 71.2, index: 75.1 },
  { date: "Mar", riu: 73.8, index: 77.6 },
  { date: "Apr", riu: 76.5, index: 80.2 },
  { date: "May", riu: 79.2, index: 83.4 },
  { date: "Jun", riu: 82.1, index: 86.7 },
];

export const MarketplaceOverviewTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>RIU Price & Trading Volume</CardTitle>
          <CardDescription>6-month historical data</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="riu" stroke="#10b981" strokeWidth={2} name="RIU Price ($)" />
              <Line type="monotone" dataKey="index" stroke="#06b6d4" strokeWidth={2} name="Regen Index" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Market Infrastructure</CardTitle>
          <CardDescription>How RIUs are traded and settled</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Trading Venues</h3>
              <div className="space-y-3">
                <div className="p-4 border rounded-lg bg-emerald-50">
                  <p className="font-semibold text-sm text-emerald-900">Primary Exchange (Regen Markets)</p>
                  <p className="text-xs text-emerald-800 mt-1">
                    24/7 trading, real-time settlement, order books for all tier buyers
                  </p>
                  <p className="text-xs text-emerald-700 mt-1">Volume: 67% of total trades</p>
                </div>

                <div className="p-4 border rounded-lg bg-blue-50">
                  <p className="font-semibold text-sm text-blue-900">OTC Markets</p>
                  <p className="text-xs text-blue-800 mt-1">
                    Large block trades, institutional arrangements, direct peer-to-peer sales
                  </p>
                  <p className="text-xs text-blue-700 mt-1">Volume: 28% of total trades</p>
                </div>

                <div className="p-4 border rounded-lg bg-purple-50">
                  <p className="font-semibold text-sm text-purple-900">Community Markets</p>
                  <p className="text-xs text-purple-800 mt-1">
                    Local exchanges, farm-to-consumer, community-level trading
                  </p>
                  <p className="text-xs text-purple-700 mt-1">Volume: 5% of total trades</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Settlement & Custody</h3>
              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold text-sm mb-1">T+0 Settlement</p>
                  <p className="text-xs text-muted-foreground">
                    Credits transferred immediately upon trade execution; blockchain-backed for permanence records
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="font-semibold text-sm mb-1">Multi-Asset Support</p>
                  <p className="text-xs text-muted-foreground">
                    RIUs traded in USD, EUR, blockchain tokens, or direct carbon retirement
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="font-semibold text-sm mb-1">Immutable Ownership</p>
                  <p className="text-xs text-muted-foreground">
                    All RIU transfers recorded on distributed ledger; no double-spending possible
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="font-semibold text-sm mb-1">Retirement Tracking</p>
                  <p className="text-xs text-muted-foreground">
                    When RIUs are retired (carbon removed from sale), marked permanently on public record
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
