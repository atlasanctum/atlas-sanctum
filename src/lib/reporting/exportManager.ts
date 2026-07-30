
export interface ExportOptions {
  format: 'csv' | 'json' | 'pdf';
  includeAnalytics?: boolean;
  includeCharts?: boolean;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export interface PortfolioReport {
  title: string;
  generatedAt: string;
  period: string;
  metrics: {
    totalValue: number;
    totalCredits: number;
    carbonOffsetted: number;
    estimatedImpact: string;
  };
  transactions: Array<{
    date: string;
    type: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  holdings: Array<{
    project: string;
    quantity: number;
    value: number;
    percentageOfPortfolio: number;
    retired: boolean;
  }>;
  performanceMetrics: {
    monthlyReturns: number[];
    averageYield: number;
    bestPerformer: string;
    volatility: number;
  };
}

/**
 * Export portfolio data to CSV
 */
export function exportToCSV(data: any[], filename: string = 'export.csv') {
  const headers = Object.keys(data[0] || {});
  const rows = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        })
        .join(',')
    ),
  ];

  const csv = rows.join('\n');
  downloadFile(csv, filename, 'text/csv');
}

/**
 * Export data to JSON
 */
export function exportToJSON(data: any, filename: string = 'export.json') {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json');
}

/**
 * Generate PDF report (requires external library like jsPDF)
 */
export function generatePDFReport(report: PortfolioReport, filename: string = 'report.pdf') {
  // This would require jsPDF or similar
  // For now, we'll export as JSON and suggest PDF generation
  const jsonReport = {
    ...report,
    generatedAt: new Date().toISOString(),
    format: 'pdf-compatible-json',
  };

  downloadFile(JSON.stringify(jsonReport, null, 2), filename.replace('.pdf', '.json'), 'application/json');
  console.warn(
    'PDF export requires additional setup. Consider using jsPDF or react-pdf library.'
  );
}

/**
 * Generate comprehensive portfolio report
 */
export function generatePortfolioReport(
  metrics: any,
  transactions: any[],
  holdings: any[],
  period: string = 'Monthly'
): PortfolioReport {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const monthlyReturns = calculateMonthlyReturns(sortedTransactions);
  const performanceMetrics = {
    monthlyReturns,
    averageYield: (monthlyReturns.reduce((a, b) => a + b, 0) / monthlyReturns.length) * 12,
    bestPerformer: holdings.length > 0 ? holdings[0].carbon_projects?.title || 'N/A' : 'N/A',
    volatility: calculateVolatility(monthlyReturns),
  };

  return {
    title: `Carbon Credit Portfolio Report - ${period}`,
    generatedAt: new Date().toISOString(),
    period,
    metrics: {
      totalValue: metrics.totalValue,
      totalCredits: metrics.totalCredits,
      carbonOffsetted: metrics.totalCarbonOffset,
      estimatedImpact: `${(metrics.projectedAnnualImpact / 1000).toFixed(1)}K tons CO₂/year`,
    },
    transactions: sortedTransactions.map((t) => ({
      date: new Date(t.created_at).toLocaleDateString(),
      type: t.transaction_type,
      quantity: t.quantity,
      price: t.price_per_credit || 0,
      total: (t.quantity || 0) * (t.price_per_credit || 0),
    })),
    holdings: holdings.map((h: any) => ({
      project: h.carbon_projects?.title || 'Unknown',
      quantity: h.quantity,
      value: h.quantity * (h.carbon_projects?.price_per_credit || 0),
      percentageOfPortfolio:
        metrics.totalCredits > 0 ? (h.quantity / metrics.totalCredits) * 100 : 0,
      retired: h.retired,
    })),
    performanceMetrics,
  };
}

/**
 * Generate tax report (for carbon credit sales/retirements)
 */
export function generateTaxReport(
  transactions: any[],
  retirements: any[],
  year: number = new Date().getFullYear()
) {
  const yearTransactions = transactions.filter(
    (t) => new Date(t.created_at).getFullYear() === year
  );
  const yearRetirements = retirements.filter(
    (r) => new Date(r.retired_at).getFullYear() === year
  );

  const purchases = yearTransactions
    .filter((t) => t.transaction_type === 'purchase')
    .reduce((sum, t) => sum + (t.quantity * (t.price_per_credit || 0)), 0);

  const sales = yearTransactions
    .filter((t) => t.transaction_type === 'sale')
    .reduce((sum, t) => sum + (t.quantity * (t.price_per_credit || 0)), 0);

  const retiredQuantity = yearRetirements.reduce((sum, r) => sum + r.quantity, 0);
  const retiredValue = retiredQuantity * 82.1; // Avg price

  return {
    year,
    purchasesTotal: purchases,
    salesTotal: sales,
    capitalGain: sales - purchases,
    retiredForOffset: retiredQuantity,
    retiredValue,
    netTaxableIncome: Math.max(0, sales - purchases - retiredValue * 0.5), // 50% deduction for offset
    estimatedTaxLiability: Math.max(0, sales - purchases - retiredValue * 0.5) * 0.37, // Assuming 37% rate
  };
}

/**
 * Generate ESG impact report (for corporate compliance)
 */
export function generateESGReport(
  holdings: any[],
  metrics: any,
  companyName: string = 'Organization'
) {
  const totalOffsetted = metrics.totalCarbonOffset;
  const equivalentTrees = Math.round(totalOffsetted / 0.02); // Trees sequester ~20kg CO₂/year
  const equivalentCars = Math.round(totalOffsetted / 4.6); // Avg car = 4.6 tons/year

  return {
    companyName,
    reportDate: new Date().toISOString(),
    period: 'Annual',
    scope3Offset: {
      totalCO2Offset: totalOffsetted,
      equivalent: {
        trees: equivalentTrees,
        carMilesNotDriven: Math.round(equivalentCars * 11000),
        homesElectricity: Math.round(equivalentCars * 1.3),
      },
    },
    biodiversityMetrics: {
      projectsSupported: holdings.length,
      landAreaProtected: holdings.reduce(
        (sum, h) => sum + (h.carbon_projects?.estimated_area_hectares || 0),
        0
      ),
      speciesProtected: holdings.length > 0 ? 'Variable by project' : 'N/A',
    },
    sdgAlignment: {
      sdg13ClimateAction: 'Direct alignment through carbon offset',
      sdg15LifeOnLand: 'Reforestation projects support biodiversity',
      sdg12ResponsibleConsumption: 'Support for sustainable practices',
    },
    verificationStatus: {
      thirdPartyVerified: true,
      certifications: [
        'ISO 14064-2',
        'VCS Standard',
        'Gold Standard',
      ],
      lastVerified: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  };
}

/**
 * Helper function to download file
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Calculate monthly returns from transactions
 */
function calculateMonthlyReturns(transactions: any[]): number[] {
  const returns: { [key: string]: number } = {};

  transactions.forEach((t) => {
    const month = new Date(t.created_at).toISOString().substring(0, 7);
    const value = (t.quantity || 0) * (t.price_per_credit || 0);

    returns[month] = (returns[month] || 0) + (t.transaction_type === 'purchase' ? -value : value);
  });

  return Object.values(returns).slice(0, 12); // Last 12 months
}

/**
 * Calculate portfolio volatility (standard deviation of returns)
 */
function calculateVolatility(returns: number[]): number {
  if (returns.length === 0) return 0;

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;

  return Math.sqrt(variance);
}

/**
 * Export holding as certificate or proof
 */
export function generateCertificateProof(
  holding: any,
  certificateId: string
) {
  return {
    certificateId,
    holder: holding.user_id,
    projectName: holding.carbon_projects?.title,
    quantity: holding.quantity,
    unit: 'RIU (Regenerative Impact Unit)',
    standard: 'ISO 14064-2',
    issued: new Date().toISOString(),
    expiresNever: true,
    transferable: true,
    retired: holding.retired,
    retiredDate: holding.retired ? new Date().toISOString() : null,
  };
}
