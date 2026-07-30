import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const MarketplaceApisTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ESG Integration APIs</CardTitle>
          <CardDescription>Seamless corporate accounting integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-blue-50">
              <h4 className="font-semibold text-sm text-blue-900 mb-2">XBRL Compatibility</h4>
              <p className="text-sm text-blue-800">
                RIU holdings automatically export to eXtensible Business Reporting Language for SEC filings
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-purple-50">
              <h4 className="font-semibold text-sm text-purple-900 mb-2">GRI Standards</h4>
              <p className="text-sm text-purple-800">
                ESG metrics pre-formatted for Global Reporting Initiative sustainability disclosures
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-emerald-50">
              <h4 className="font-semibold text-sm text-emerald-900 mb-2">TCFD Alignment</h4>
              <p className="text-sm text-emerald-800">
                Climate risk data integrated with Task Force on Climate-related Financial Disclosures frameworks
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-amber-50">
              <h4 className="font-semibold text-sm text-amber-900 mb-2">ISO 14064</h4>
              <p className="text-sm text-amber-800">
                Carbon accounting meets international standards for greenhouse gas quantification and reporting
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Available Endpoints</h3>
            <div className="font-mono text-xs space-y-2 p-4 bg-slate-50 rounded-lg overflow-x-auto">
              <p><span className="text-emerald-600">POST</span> /api/v1/riu/purchase</p>
              <p><span className="text-blue-600">GET</span> /api/v1/portfolio/holdings</p>
              <p><span className="text-purple-600">GET</span> /api/v1/riu/price-history</p>
              <p><span className="text-amber-600">POST</span> /api/v1/riu/retire</p>
              <p><span className="text-red-600">GET</span> /api/v1/esg/metrics</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
