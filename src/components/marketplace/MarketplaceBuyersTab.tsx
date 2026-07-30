import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const buyers = [
  { tier: "Individual", min: "$100", max: "$10K", count: 24500, allocation: "Micro-credits, education", icon: "👤" },
  { tier: "Corporate", min: "$100K", max: "$10M", count: 450, allocation: "ESG compliance, bonds", icon: "🏢" },
  { tier: "Institutional", min: "$1M+", max: "Unlimited", count: 85, allocation: "Large portfolios, funds", icon: "🏦" },
  { tier: "Government", min: "$10M+", max: "Unlimited", count: 12, allocation: "Climate policy, NDCs", icon: "🏛️" },
];

export const MarketplaceBuyersTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tiered Buyer System</CardTitle>
          <CardDescription>Scale participation from individuals to nations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {buyers.map((buyer, idx) => (
              <div key={idx} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{buyer.icon}</span>
                      <h4 className="font-bold text-lg">{buyer.tier}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {buyer.min} - {buyer.max} per transaction
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{buyer.count.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Active participants</p>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded">
                  <p className="text-sm font-semibold mb-1">Primary Use Case</p>
                  <p className="text-sm text-slate-700">{buyer.allocation}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Individual Buyer: Micro-Credits</CardTitle>
          <CardDescription>Starting at just $100, anyone can invest in regeneration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border-l-4 border-l-emerald-500 bg-emerald-50 rounded-lg">
            <p className="text-sm text-emerald-800">
              <strong>Example:</strong> Buy 1 RIU for $82 on your phone, support mangrove restoration in Indonesia, retire it to offset your carbon footprint—all within 5 minutes.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">Mobile App</p>
              <p className="text-xs text-muted-foreground">iOS & Android, simple UX</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">Direct Retirement</p>
              <p className="text-xs text-muted-foreground">Own the impact permanently</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">Community Stories</p>
              <p className="text-xs text-muted-foreground">See impact in real-time</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">Social Features</p>
              <p className="text-xs text-muted-foreground">Share achievements with friends</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
