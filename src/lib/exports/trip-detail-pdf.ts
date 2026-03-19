/**
 * TEMPLATE 8 — Trip Detail PDF
 * Full operational record. All fields, expenses, fuel, status history, invoice, payments.
 */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface TripDetailData {
  companyName: string;
  tripNumber: string;
  tripType: string;
  status: string;
  clientName: string;
  truckRegistration: string;
  trailerRegistration?: string;
  driverName: string;
  origin: string;
  destination: string;
  distanceKm: number;
  loadStatus: string;
  loadType: string;
  isCrossBorder: boolean;
  borderPost?: string;
  tonnage?: number;
  containerNumber?: string;
  sealNumber?: string;
  numberOfPackages?: number;
  rateUsd: number;
  tripBookoutUsd?: number;
  totalExpensesUsd: number;
  totalFuelCostUsd: number;
  estimatedMarginUsd: number;
  costPerKmUsd: number;
  statusHistory: { status: string; timestamp: string; changedBy: string }[];
  expenses: { date: string; category: string; amount: number; howPaid: string; recordedBy: string }[];
  fuelIssuances: { date: string; litres: number; pricePerLitre: number; totalCost: number; station: string }[];
  fuelAnomaly?: { expectedLitres: number; actualLitres: number; variancePercent: number; status: string; resolution?: string };
  bookout?: { advance: number; tolls: number; borderFees: number; food: number; other: number; unspent: number; reconciled: boolean };
  pod?: { received: boolean; sentToClient: boolean; exceptions?: string };
  invoice?: { invoiceNumber: string; date: string; totalUsd: number; amountPaid: number; amountOutstanding: number; status: string };
}

const NAVY: [number, number, number] = [13, 27, 46];
const ORANGE: [number, number, number] = [232, 101, 10];

function fmtDate(val: string): string {
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}
function fmtDateTime(val: string): string {
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return `${fmtDate(val)} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function fmtCurrency(val: number): string {
  return val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function generateTripDetailPdf(data: TripDetailData): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const m = 15;
  let y = m;

  // Header
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pw, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("courier", "bold");
  doc.text(data.tripNumber, m, 14);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.clientName}  |  ${data.status.replace(/_/g, " ").toUpperCase()}`, m, 21);
  doc.text(data.companyName, pw - m, 14, { align: "right" });
  y = 34;

  // Trip overview
  doc.setTextColor(...NAVY);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("TRIP OVERVIEW", m, y);
  y += 5;
  autoTable(doc, {
    startY: y,
    body: [
      ["Type", data.tripType, "Truck", data.truckRegistration],
      ["Origin", data.origin, "Trailer", data.trailerRegistration || "—"],
      ["Destination", data.destination, "Driver", data.driverName],
      ["Distance", `${data.distanceKm.toLocaleString()} km`, "Load", `${data.loadType} (${data.loadStatus})`],
      ["Cross Border", data.isCrossBorder ? "Yes" : "No", "Border", data.borderPost || "—"],
      ["Rate", `$${fmtCurrency(data.rateUsd)}`, "Margin", `$${fmtCurrency(data.estimatedMarginUsd)}`],
      ["Total Expenses", `$${fmtCurrency(data.totalExpensesUsd)}`, "Cost/km", `$${data.costPerKmUsd.toFixed(3)}`],
    ],
    margin: { left: m, right: m },
    styles: { fontSize: 7, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: "bold", textColor: [100, 100, 100] }, 2: { fontStyle: "bold", textColor: [100, 100, 100] } },
    theme: "plain",
  });
  y = (doc as any).lastAutoTable.finalY + 6;

  // Status history
  if (data.statusHistory.length > 0) {
    doc.setTextColor(...NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("STATUS HISTORY", m, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Status", "Timestamp", "Changed By"]],
      body: data.statusHistory.map((s) => [s.status.replace(/_/g, " "), fmtDateTime(s.timestamp), s.changedBy]),
      margin: { left: m, right: m },
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: NAVY, textColor: [255, 255, 255], fontStyle: "bold" },
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  // Expenses
  if (data.expenses.length > 0) {
    doc.setTextColor(...NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("TRIP EXPENSES", m, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Date", "Category", "Amount (USD)", "How Paid", "Recorded By"]],
      body: data.expenses.map((e) => [fmtDate(e.date), e.category, fmtCurrency(e.amount), e.howPaid, e.recordedBy]),
      margin: { left: m, right: m },
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: NAVY, textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: { 2: { halign: "right", font: "courier" } },
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  // Fuel
  if (data.fuelIssuances.length > 0) {
    doc.setTextColor(...NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("FUEL ISSUED", m, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Date", "Litres", "Price/L (USD)", "Total (USD)", "Station"]],
      body: data.fuelIssuances.map((f) => [fmtDate(f.date), f.litres.toFixed(2), f.pricePerLitre.toFixed(4), fmtCurrency(f.totalCost), f.station]),
      margin: { left: m, right: m },
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: NAVY, textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: { 1: { halign: "right" }, 2: { halign: "right" }, 3: { halign: "right" } },
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  // Invoice
  if (data.invoice) {
    doc.setTextColor(...NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("INVOICE", m, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      body: [
        ["Invoice #", data.invoice.invoiceNumber, "Status", data.invoice.status.replace(/_/g, " ")],
        ["Total", `$${fmtCurrency(data.invoice.totalUsd)}`, "Paid", `$${fmtCurrency(data.invoice.amountPaid)}`],
        ["Outstanding", `$${fmtCurrency(data.invoice.amountOutstanding)}`, "", ""],
      ],
      margin: { left: m, right: m },
      styles: { fontSize: 7, cellPadding: 2 },
      columnStyles: { 0: { fontStyle: "bold", textColor: [100, 100, 100] }, 2: { fontStyle: "bold", textColor: [100, 100, 100] } },
      theme: "plain",
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  // Footer
  doc.setFontSize(6);
  doc.setTextColor(150, 150, 150);
  doc.setFont("courier", "normal");
  doc.text(`Generated by LynkFleet  |  ${data.companyName}`, m, ph - 8);

  return doc;
}

export function downloadTripDetailPdf(data: TripDetailData) {
  const doc = generateTripDetailPdf(data);
  doc.save(`${data.tripNumber}.pdf`);
}
