/**
 * TEMPLATE 3 — Invoice PDF
 * Three layouts: Classic, Modern, Minimal
 * Client-facing. Company logo. VAT conditional. Legal document.
 */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface InvoiceData {
  layout: "classic" | "modern" | "minimal";
  primaryColour?: string;
  secondaryColour?: string;
  // Company
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyVatNumber?: string;
  companyLogoUrl?: string;
  companyBankName?: string;
  companyAccountNumber?: string;
  companyBranchCode?: string;
  companyRegistrationNumber?: string;
  vatRegistered: boolean;
  vatRate: number;
  // Invoice
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentTermsDays: number;
  status: string;
  notes?: string;
  // Client
  clientCompanyName: string;
  clientTradingName?: string;
  clientAddress?: string;
  clientVatNumber?: string;
  clientContactPerson: string;
  clientEmail?: string;
  clientVatTreatment?: string;
  // Trip
  tripNumber: string;
  tripType: string;
  origin: string;
  destination: string;
  loadType: string;
  tonnage?: number;
  containerNumber?: string;
  sealNumber?: string;
  // Financials
  subtotalUsd: number;
  vatAmountUsd: number;
  totalUsd: number;
  amountPaidUsd: number;
  amountOutstandingUsd: number;
  // Payments
  payments: { date: string; amount: number; method: string; reference?: string }[];
}

const NAVY: [number, number, number] = [13, 27, 46];
const ORANGE: [number, number, number] = [232, 101, 10];

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function fmtDate(val: string): string {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function fmtCurrency(val: number): string {
  return val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function generateInvoicePdf(data: InvoiceData): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const m = 15;
  let y = m;

  const primary = data.layout === "modern" && data.primaryColour ? hexToRgb(data.primaryColour) : ORANGE;
  const secondary = data.layout === "modern" && data.secondaryColour ? hexToRgb(data.secondaryColour) : NAVY;

  // === HEADER ===
  if (data.layout === "modern") {
    doc.setFillColor(...primary);
    doc.rect(0, 0, pw, 35, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(data.companyName.toUpperCase(), m, 15);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text([data.companyAddress, `Tel: ${data.companyPhone}  |  ${data.companyEmail}`].filter(Boolean) as string[], m, 22);
    if (data.companyVatNumber && data.vatRegistered) {
      doc.text(`VAT: ${data.companyVatNumber}`, m, 30);
    }
    y = 42;
  } else {
    doc.setTextColor(...NAVY);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(data.companyName, m, y + 5);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    const companyLines = [data.companyAddress, `Tel: ${data.companyPhone}  |  ${data.companyEmail}`];
    if (data.companyVatNumber && data.vatRegistered) companyLines.push(`VAT: ${data.companyVatNumber}`);
    doc.text(companyLines, m, y + 10);
    if (data.layout === "classic") {
      doc.setDrawColor(...ORANGE);
      doc.setLineWidth(0.5);
      doc.line(m, y + 22, pw - m, y + 22);
    }
    y += 26;
  }

  // === INVOICE META ===
  doc.setTextColor(...(data.layout === "minimal" ? [0, 0, 0] as [number, number, number] : NAVY));
  doc.setFontSize(18);
  doc.setFont("courier", "bold");
  doc.text(data.invoiceNumber, m, y + 5);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Invoice Date: ${fmtDate(data.invoiceDate)}  |  Due Date: ${fmtDate(data.dueDate)}  |  Terms: ${data.paymentTermsDays} days`, m, y + 11);

  // Status badge
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  const statusText = data.status.replace(/_/g, " ").toUpperCase();
  const statusW = doc.getTextWidth(statusText) + 8;
  doc.setFillColor(...(data.status === "paid" ? [34, 197, 94] as [number, number, number] : data.status === "overdue" ? [239, 68, 68] as [number, number, number] : ORANGE));
  doc.roundedRect(pw - m - statusW, y, statusW, 7, 1, 1, "F");
  doc.setTextColor(255, 255, 255);
  doc.text(statusText, pw - m - statusW + 4, y + 5);
  y += 18;

  // === BILL TO ===
  doc.setTextColor(...NAVY);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", m, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  const clientLines = [data.clientCompanyName];
  if (data.clientTradingName && data.clientTradingName !== data.clientCompanyName) clientLines.push(`t/a ${data.clientTradingName}`);
  if (data.clientAddress) clientLines.push(data.clientAddress);
  if (data.clientVatNumber) clientLines.push(`VAT: ${data.clientVatNumber}`);
  clientLines.push(`Attn: ${data.clientContactPerson}`);
  if (data.clientEmail) clientLines.push(data.clientEmail);
  doc.text(clientLines, m, y + 4);
  y += 4 + clientLines.length * 3.5 + 4;

  // === TRIP REFERENCE ===
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("TRIP REFERENCE", m, y);
  doc.setFont("courier", "normal");
  doc.setTextColor(50, 50, 50);
  doc.text(data.tripNumber, m, y + 4);
  doc.setFont("helvetica", "normal");
  const tripDetails = [`${data.origin} → ${data.destination}  |  ${data.tripType}  |  ${data.loadType}`];
  if (data.tonnage) tripDetails.push(`Tonnage: ${data.tonnage}t`);
  if (data.containerNumber) tripDetails.push(`Container: ${data.containerNumber}`);
  if (data.sealNumber) tripDetails.push(`Seal: ${data.sealNumber}`);
  doc.text(tripDetails, m + 30, y + 4);
  y += 12;

  // === LINE ITEMS ===
  autoTable(doc, {
    startY: y,
    head: [["Description", "Qty", "Unit Rate (USD)", "Amount (USD)"]],
    body: [["Freight — " + data.origin + " to " + data.destination, "1", fmtCurrency(data.subtotalUsd), fmtCurrency(data.subtotalUsd)]],
    margin: { left: m, right: m },
    styles: { fontSize: 8, cellPadding: 3, textColor: [30, 30, 30] },
    headStyles: {
      fillColor: data.layout === "minimal" ? [240, 240, 240] as [number, number, number] : secondary,
      textColor: data.layout === "minimal" ? [30, 30, 30] as [number, number, number] : [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { halign: "center", cellWidth: 20 },
      2: { halign: "right", cellWidth: 35, font: "courier" },
      3: { halign: "right", cellWidth: 35, font: "courier" },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 6;

  // === TOTALS ===
  const totalsX = pw - m - 70;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);

  doc.text("Subtotal", totalsX, y);
  doc.setFont("courier", "normal");
  doc.text(`$${fmtCurrency(data.subtotalUsd)}`, pw - m, y, { align: "right" });
  y += 5;

  const showVat = data.vatRegistered && data.clientVatTreatment !== "exempt" && data.vatAmountUsd > 0;
  if (showVat) {
    doc.setFont("helvetica", "normal");
    doc.text(`VAT (${data.vatRate}%)`, totalsX, y);
    doc.setFont("courier", "normal");
    doc.text(`$${fmtCurrency(data.vatAmountUsd)}`, pw - m, y, { align: "right" });
    y += 5;
  }

  doc.setDrawColor(200, 200, 200);
  doc.line(totalsX, y, pw - m, y);
  y += 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...(data.layout === "minimal" ? [0, 0, 0] as [number, number, number] : primary));
  doc.text("TOTAL DUE", totalsX, y);
  doc.setFont("courier", "bold");
  doc.text(`$${fmtCurrency(data.totalUsd)}`, pw - m, y, { align: "right" });
  y += 8;

  // Payments
  if (data.payments.length > 0) {
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...NAVY);
    doc.text("PAYMENTS RECEIVED", m, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Date", "Amount (USD)", "Method", "Reference"]],
      body: data.payments.map((p) => [fmtDate(p.date), fmtCurrency(p.amount), p.method, p.reference || "—"]),
      margin: { left: m, right: m },
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [240, 240, 240], textColor: [50, 50, 50], fontStyle: "bold" },
    });
    y = (doc as any).lastAutoTable.finalY + 4;
  }

  // Outstanding
  if (data.amountOutstandingUsd > 0) {
    doc.setFillColor(255, 245, 235);
    doc.rect(m, y, pw - 2 * m, 10, "F");
    doc.setTextColor(...ORANGE);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`AMOUNT OUTSTANDING: $${fmtCurrency(data.amountOutstandingUsd)}`, m + 4, y + 7);
    y += 14;
  }

  // Payment details
  if (data.companyBankName) {
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...NAVY);
    doc.text("PAYMENT DETAILS", m, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text([
      `Bank: ${data.companyBankName}`,
      `Account: ${data.companyAccountNumber || "—"}`,
      `Branch: ${data.companyBranchCode || "—"}`,
      `Reference: ${data.invoiceNumber}`,
    ], m, y + 4);
    y += 20;
  }

  // Notes
  if (data.notes) {
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    doc.text(`Notes: ${data.notes}`, m, y);
  }

  // Footer
  doc.setFontSize(6);
  doc.setTextColor(150, 150, 150);
  doc.setFont("courier", "normal");
  doc.text(`Generated by LynkFleet  |  ${data.companyName}${data.companyRegistrationNumber ? `  |  Reg: ${data.companyRegistrationNumber}` : ""}`, m, ph - 8);

  return doc;
}

export function downloadInvoicePdf(data: InvoiceData) {
  const doc = generateInvoicePdf(data);
  doc.save(`${data.invoiceNumber}.pdf`);
}
