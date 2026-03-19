/**
 * TEMPLATE 4 — Client Statement PDF
 * Shows complete billing relationship for one client over a selected period.
 */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface StatementTransaction {
  date: string;
  type: "Invoice" | "Payment Received" | "Credit Note";
  reference: string;
  tripNumber?: string;
  description: string;
  debitUsd?: number;
  creditUsd?: number;
  balanceUsd: number;
  daysOutstanding?: number;
  status?: string;
}

export interface ClientStatementData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyLogoUrl?: string;
  companyBankName?: string;
  companyAccountNumber?: string;
  companyBranchCode?: string;
  clientName: string;
  clientAddress?: string;
  clientContactPerson: string;
  periodFrom: string;
  periodTo: string;
  openingBalance: number;
  closingBalance: number;
  transactions: StatementTransaction[];
  aging: { current: number; days30: number; days60: number; days90: number; days90plus: number };
}

const NAVY: [number, number, number] = [13, 27, 46];
const ORANGE: [number, number, number] = [232, 101, 10];

function fmtDate(val: string): string {
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function fmtCurrency(val: number): string {
  return val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function generateClientStatementPdf(data: ClientStatementData): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const m = 15;
  let y = m;

  // Header
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pw, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("CLIENT STATEMENT", m, 14);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(data.companyName, pw - m, 10, { align: "right" });
  doc.setFontSize(7);
  doc.text(`${fmtDate(data.periodFrom)} to ${fmtDate(data.periodTo)}`, m, 22);
  y = 36;

  // Client info
  doc.setTextColor(...NAVY);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("TO:", m, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  const cl = [data.clientName];
  if (data.clientAddress) cl.push(data.clientAddress);
  cl.push(`Attn: ${data.clientContactPerson}`);
  doc.text(cl, m + 8, y);
  y += cl.length * 3.5 + 6;

  // Opening balance
  doc.setFillColor(245, 245, 245);
  doc.rect(m, y, pw - 2 * m, 8, "F");
  doc.setTextColor(...NAVY);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Opening Balance", m + 4, y + 5.5);
  doc.setFont("courier", "bold");
  doc.text(`$${fmtCurrency(data.openingBalance)}`, pw - m - 4, y + 5.5, { align: "right" });
  y += 12;

  // Transactions table
  autoTable(doc, {
    startY: y,
    head: [["Date", "Type", "Reference", "Trip #", "Description", "Debit (USD)", "Credit (USD)", "Balance (USD)"]],
    body: data.transactions.map((t) => [
      fmtDate(t.date), t.type, t.reference, t.tripNumber || "—", t.description,
      t.debitUsd ? fmtCurrency(t.debitUsd) : "", t.creditUsd ? fmtCurrency(t.creditUsd) : "", fmtCurrency(t.balanceUsd),
    ]),
    margin: { left: m, right: m },
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: NAVY, textColor: [255, 255, 255], fontStyle: "bold" },
    columnStyles: { 2: { font: "courier" }, 3: { font: "courier" }, 5: { halign: "right" }, 6: { halign: "right" }, 7: { halign: "right", font: "courier" } },
  });
  y = (doc as any).lastAutoTable.finalY + 6;

  // Closing balance
  doc.setFillColor(...ORANGE);
  doc.rect(m, y, pw - 2 * m, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("CLOSING BALANCE", m + 4, y + 7);
  doc.setFont("courier", "bold");
  doc.text(`$${fmtCurrency(data.closingBalance)}`, pw - m - 4, y + 7, { align: "right" });
  y += 16;

  // Aging
  doc.setTextColor(...NAVY);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("AGING SUMMARY", m, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    head: [["Current", "30 Days", "60 Days", "90 Days", "90+ Days"]],
    body: [[fmtCurrency(data.aging.current), fmtCurrency(data.aging.days30), fmtCurrency(data.aging.days60), fmtCurrency(data.aging.days90), fmtCurrency(data.aging.days90plus)]],
    margin: { left: m, right: m },
    styles: { fontSize: 8, halign: "center", cellPadding: 3 },
    headStyles: { fillColor: [240, 240, 240], textColor: [50, 50, 50], fontStyle: "bold" },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // Payment instructions
  if (data.companyBankName) {
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...NAVY);
    doc.text("PAYMENT INSTRUCTIONS", m, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text([`Bank: ${data.companyBankName}`, `Account: ${data.companyAccountNumber || "—"}`, `Branch: ${data.companyBranchCode || "—"}`], m, y + 4);
  }

  // Footer
  doc.setFontSize(6);
  doc.setTextColor(150, 150, 150);
  doc.setFont("courier", "normal");
  doc.text(`Generated by LynkFleet  |  ${data.companyName}`, m, ph - 8);

  return doc;
}

export function downloadClientStatementPdf(data: ClientStatementData) {
  const doc = generateClientStatementPdf(data);
  doc.save(`Statement_${data.clientName.replace(/\s+/g, "_")}_${fmtDate(data.periodTo).replace(/\//g, "-")}.pdf`);
}
