import { format } from 'date-fns';

interface Holding {
  id: string;
  quantity: number;
  purchase_price: number;
  purchased_at: string;
  retired: boolean;
  retired_at?: string | null;
  certificate_id?: string | null;
  carbon_projects?: {
    title?: string;
    project_type?: string;
    co2_offset_per_credit?: number;
    country?: string;
    certification?: string;
  } | null;
}

interface Transaction {
  id: string;
  created_at: string;
  transaction_type: string;
  quantity: number;
  price_per_credit: number;
  total_amount: number;
  status: string;
  carbon_projects?: {
    title?: string;
  } | null;
}

interface PortfolioStats {
  totalCredits: number;
  totalOffset: number;
  totalValue: number;
  retiredCredits: number;
}

// Export holdings to CSV
export const exportHoldingsToCSV = (holdings: Holding[], stats: PortfolioStats): void => {
  const headers = [
    'Project',
    'Project Type',
    'Country',
    'Certification',
    'Quantity',
    'Purchase Price ($)',
    'Total Value ($)',
    'CO₂ Offset (tonnes)',
    'Purchased Date',
    'Status',
    'Retired Date',
    'Certificate ID'
  ];

  const rows = holdings.map(h => [
    h.carbon_projects?.title || 'Unknown',
    h.carbon_projects?.project_type || 'Unknown',
    h.carbon_projects?.country || 'Unknown',
    h.carbon_projects?.certification || 'Unknown',
    h.quantity.toString(),
    h.purchase_price.toFixed(2),
    (h.quantity * h.purchase_price).toFixed(2),
    (h.quantity * (h.carbon_projects?.co2_offset_per_credit || 1)).toFixed(2),
    format(new Date(h.purchased_at), 'yyyy-MM-dd'),
    h.retired ? 'Retired' : 'Active',
    h.retired_at ? format(new Date(h.retired_at), 'yyyy-MM-dd') : '',
    h.certificate_id || ''
  ]);

  // Add summary row
  rows.push([]);
  rows.push(['PORTFOLIO SUMMARY']);
  rows.push(['Total Credits', stats.totalCredits.toString()]);
  rows.push(['Total CO₂ Offset (tonnes)', stats.totalOffset.toFixed(2)]);
  rows.push(['Total Portfolio Value ($)', stats.totalValue.toFixed(2)]);
  rows.push(['Retired Credits', stats.retiredCredits.toString()]);
  rows.push(['Report Generated', format(new Date(), 'yyyy-MM-dd HH:mm:ss')]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  downloadFile(csvContent, `carbon-portfolio-holdings-${format(new Date(), 'yyyy-MM-dd')}.csv`, 'text/csv');
};

// Export transactions to CSV
export const exportTransactionsToCSV = (transactions: Transaction[]): void => {
  const headers = [
    'Date',
    'Project',
    'Type',
    'Quantity',
    'Price per Credit ($)',
    'Total Amount ($)',
    'Status'
  ];

  const rows = transactions.map(tx => [
    format(new Date(tx.created_at), 'yyyy-MM-dd HH:mm'),
    tx.carbon_projects?.title || 'Unknown',
    tx.transaction_type,
    tx.quantity.toString(),
    tx.price_per_credit.toFixed(2),
    tx.total_amount.toFixed(2),
    tx.status
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  downloadFile(csvContent, `carbon-transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`, 'text/csv');
};

// Export full portfolio report as JSON
export const exportPortfolioJSON = (
  holdings: Holding[],
  transactions: Transaction[],
  stats: PortfolioStats
): void => {
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalCredits: stats.totalCredits,
      totalCO2Offset: stats.totalOffset,
      totalPortfolioValue: stats.totalValue,
      retiredCredits: stats.retiredCredits,
      activeCredits: stats.totalCredits - stats.retiredCredits,
    },
    holdings: holdings.map(h => ({
      project: h.carbon_projects?.title || 'Unknown',
      projectType: h.carbon_projects?.project_type,
      country: h.carbon_projects?.country,
      certification: h.carbon_projects?.certification,
      quantity: h.quantity,
      purchasePrice: h.purchase_price,
      totalValue: h.quantity * h.purchase_price,
      co2Offset: h.quantity * (h.carbon_projects?.co2_offset_per_credit || 1),
      purchasedAt: h.purchased_at,
      status: h.retired ? 'Retired' : 'Active',
      retiredAt: h.retired_at,
      certificateId: h.certificate_id,
    })),
    transactions: transactions.map(tx => ({
      date: tx.created_at,
      project: tx.carbon_projects?.title || 'Unknown',
      type: tx.transaction_type,
      quantity: tx.quantity,
      pricePerCredit: tx.price_per_credit,
      totalAmount: tx.total_amount,
      status: tx.status,
    })),
  };

  const jsonContent = JSON.stringify(report, null, 2);
  downloadFile(jsonContent, `carbon-portfolio-report-${format(new Date(), 'yyyy-MM-dd')}.json`, 'application/json');
};

// Generate HTML report for printing
export const generatePrintableReport = (
  holdings: Holding[],
  stats: PortfolioStats,
  userName?: string
): void => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Carbon Portfolio Report - ${format(new Date(), 'MMMM d, yyyy')}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; padding: 40px; max-width: 900px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #22c55e; }
    .header h1 { color: #166534; font-size: 28px; margin-bottom: 8px; }
    .header .subtitle { color: #6b7280; font-size: 14px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 40px; }
    .stat-card { background: #f0fdf4; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #bbf7d0; }
    .stat-value { font-size: 24px; font-weight: 700; color: #166534; }
    .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
    .section { margin-bottom: 32px; }
    .section h2 { font-size: 18px; color: #166534; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { background: #f9fafb; font-weight: 600; color: #374151; }
    .text-right { text-align: right; }
    .status-active { color: #22c55e; font-weight: 500; }
    .status-retired { color: #6b7280; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px; }
    @media print { body { padding: 20px; } .stat-card { break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌱 Carbon Portfolio Report</h1>
    <p class="subtitle">${userName ? `${userName} • ` : ''}Generated on ${format(new Date(), 'MMMM d, yyyy \'at\' h:mm a')}</p>
  </div>
  
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-value">${stats.totalCredits.toLocaleString()}</div>
      <div class="stat-label">Total Credits</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${stats.totalOffset.toFixed(1)}t</div>
      <div class="stat-label">CO₂ Offset</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">$${stats.totalValue.toFixed(2)}</div>
      <div class="stat-label">Portfolio Value</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${stats.retiredCredits.toLocaleString()}</div>
      <div class="stat-label">Retired Credits</div>
    </div>
  </div>
  
  <div class="section">
    <h2>Holdings Summary</h2>
    <table>
      <thead>
        <tr>
          <th>Project</th>
          <th>Type</th>
          <th class="text-right">Quantity</th>
          <th class="text-right">CO₂ Offset</th>
          <th class="text-right">Value</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${holdings.map(h => `
          <tr>
            <td><strong>${h.carbon_projects?.title || 'Unknown'}</strong><br><small style="color:#6b7280">${h.carbon_projects?.country || ''}</small></td>
            <td>${h.carbon_projects?.project_type || '-'}</td>
            <td class="text-right">${h.quantity.toLocaleString()}</td>
            <td class="text-right">${(h.quantity * (h.carbon_projects?.co2_offset_per_credit || 1)).toFixed(1)}t</td>
            <td class="text-right">$${(h.quantity * h.purchase_price).toFixed(2)}</td>
            <td class="${h.retired ? 'status-retired' : 'status-active'}">${h.retired ? '✓ Retired' : 'Active'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  
  <div class="footer">
    <p>Atlas Sanctum • Regenerative Carbon Credit Platform</p>
    <p>This report is for informational purposes only.</p>
  </div>
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, '_blank');
  
  if (printWindow) {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  }
};

// Helper function to download file
const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
