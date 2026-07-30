import jsPDF from 'jspdf';

export interface ReportDonation {
  date: string;
  project: string;
  category: string;
  amount: number;
  impact: string;
  status: string;
  txHash?: string;
  taxDeductible?: boolean;
}

export interface ImpactReportInput {
  donorName: string;
  donorEmail?: string;
  from: Date;
  to: Date;
  donations: ReportDonation[];
  totals: { donated: number; offsetTons: number; projects: number };
  /**
   * Optional base URL for on-chain verification links.
   * The transaction hash / reference is appended to this URL.
   * Example: "https://polygonscan.com/tx/"
   */
  explorerUrlBase?: string;
}

const brand = { primary: [16, 143, 90] as const, dark: [17, 24, 39] as const, muted: [107, 114, 128] as const };

export function generateImpactReport(input: ImpactReportInput): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 48;
  let y = M;
  const explorer = input.explorerUrlBase ?? 'https://polygonscan.com/tx/';

  // Header band
  doc.setFillColor(...brand.primary);
  doc.rect(0, 0, pageW, 90, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Atlas Genesis · Impact Report', M, 44);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`${input.from.toLocaleDateString()} – ${input.to.toLocaleDateString()}`, M, 66);
  y = 120;

  doc.setTextColor(...brand.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Prepared for', M, y); y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(input.donorName, M, y); y += 14;
  if (input.donorEmail) { doc.text(input.donorEmail, M, y); y += 14; }
  y += 12;

  // Summary cards
  const cards = [
    { label: 'Total Donated', value: `$${input.totals.donated.toLocaleString()}` },
    { label: 'CO₂ Offset', value: `${input.totals.offsetTons.toLocaleString()} tons` },
    { label: 'Projects Supported', value: `${input.totals.projects}` },
  ];
  const cw = (pageW - M * 2 - 24) / 3;
  cards.forEach((c, i) => {
    const x = M + i * (cw + 12);
    doc.setDrawColor(230); doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, y, cw, 70, 6, 6, 'FD');
    doc.setTextColor(...brand.muted); doc.setFontSize(10);
    doc.text(c.label, x + 12, y + 22);
    doc.setTextColor(...brand.dark); doc.setFont('helvetica', 'bold'); doc.setFontSize(16);
    doc.text(c.value, x + 12, y + 48);
    doc.setFont('helvetica', 'normal');
  });
  y += 96;

  // Donations table
  doc.setTextColor(...brand.dark); doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
  doc.text('Donations', M, y); y += 16;

  const cols = [
    { key: 'date', label: 'Date', w: 70 },
    { key: 'project', label: 'Project', w: 150 },
    { key: 'category', label: 'Category', w: 60 },
    { key: 'amount', label: 'Amount', w: 70 },
    { key: 'impact', label: 'Impact', w: 80 },
    { key: 'status', label: 'Status', w: 55 },
    { key: 'verify', label: 'Verify', w: 80 },
  ];

  doc.setFillColor(...brand.primary); doc.setTextColor(255, 255, 255);
  doc.rect(M, y, pageW - M * 2, 22, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
  let x = M + 8;
  cols.forEach((c) => { doc.text(c.label, x, y + 15); x += c.w; });
  y += 22;

  doc.setFont('helvetica', 'normal'); doc.setTextColor(...brand.dark); doc.setFontSize(10);
  input.donations.forEach((d, i) => {
    if (y > pageH - 80) { doc.addPage(); y = M; }
    if (i % 2 === 0) { doc.setFillColor(249, 250, 251); doc.rect(M, y, pageW - M * 2, 20, 'F'); }
    let cx = M + 8;
    const row = [
      new Date(d.date).toLocaleDateString(),
      d.project.length > 26 ? d.project.slice(0, 24) + '…' : d.project,
      d.category,
      `$${d.amount.toLocaleString()}`,
      d.impact,
      d.status,
    ];
    row.forEach((v, idx) => { doc.text(String(v), cx, y + 14); cx += cols[idx].w; });
    // Verify column with clickable on-chain link
    if (d.txHash) {
      const short = d.txHash.length > 12 ? d.txHash.slice(0, 10) + '…' : d.txHash;
      const url = /^0x[a-fA-F0-9]{6,}$/.test(d.txHash) ? `${explorer}${d.txHash}` : `${explorer}${d.txHash}`;
      doc.setTextColor(...brand.primary);
      doc.textWithLink(short, cx, y + 14, { url });
      doc.setTextColor(...brand.dark);
    } else {
      doc.setTextColor(...brand.muted);
      doc.text('pending', cx, y + 14);
      doc.setTextColor(...brand.dark);
    }
    y += 20;
  });

  // Breakdown by initiative
  if (y > pageH - 200) { doc.addPage(); y = M; } else { y += 20; }
  doc.setTextColor(...brand.dark); doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
  doc.text('Breakdown by Initiative', M, y); y += 16;

  const byInit = new Map<string, { amount: number; offset: number; count: number; category: string }>();
  for (const d of input.donations) {
    if (d.status !== 'completed') continue;
    const entry = byInit.get(d.project) ?? { amount: 0, offset: 0, count: 0, category: d.category };
    entry.amount += d.amount;
    entry.offset += parseFloat(d.impact) || 0;
    entry.count += 1;
    byInit.set(d.project, entry);
  }

  const bCols = [
    { label: 'Initiative', w: 220 },
    { label: 'Category', w: 90 },
    { label: 'Donations', w: 70 },
    { label: 'Total', w: 80 },
    { label: 'CO₂ (tons)', w: 60 },
  ];
  doc.setFillColor(...brand.primary); doc.setTextColor(255, 255, 255);
  doc.rect(M, y, pageW - M * 2, 22, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
  let bx = M + 8;
  bCols.forEach((c) => { doc.text(c.label, bx, y + 15); bx += c.w; });
  y += 22;

  doc.setFont('helvetica', 'normal'); doc.setTextColor(...brand.dark); doc.setFontSize(10);
  const initiatives = [...byInit.entries()].sort((a, b) => b[1].amount - a[1].amount);
  initiatives.forEach(([name, agg], i) => {
    if (y > pageH - 60) { doc.addPage(); y = M; }
    if (i % 2 === 0) { doc.setFillColor(249, 250, 251); doc.rect(M, y, pageW - M * 2, 20, 'F'); }
    let cx = M + 8;
    const display = name.length > 40 ? name.slice(0, 38) + '…' : name;
    const cells = [display, agg.category, String(agg.count), `$${agg.amount.toLocaleString()}`, agg.offset.toFixed(2)];
    cells.forEach((v, idx) => { doc.text(String(v), cx, y + 14); cx += bCols[idx].w; });
    y += 20;
  });

  if (initiatives.length === 0) {
    doc.setTextColor(...brand.muted);
    doc.text('No completed donations in this range.', M, y + 14);
    doc.setTextColor(...brand.dark);
    y += 20;
  }

  // Verification note
  y += 16;
  if (y > pageH - 60) { doc.addPage(); y = M; }
  doc.setFontSize(9); doc.setTextColor(...brand.muted);
  doc.text(
    'Verify column links open the on-chain attestation for each donation on the public block explorer.',
    M, y,
  );

  // Footer on every page
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setDrawColor(230); doc.line(M, pageH - 40, pageW - M, pageH - 40);
    doc.setTextColor(...brand.muted); doc.setFontSize(9);
    doc.text(`Generated ${new Date().toLocaleString()}`, M, pageH - 24);
    doc.text(`Page ${p} of ${pageCount}`, pageW - M, pageH - 24, { align: 'right' });
    doc.text('Atlas Genesis — Regenerative Impact Ledger', pageW / 2, pageH - 24, { align: 'center' });
  }

  return doc;
}