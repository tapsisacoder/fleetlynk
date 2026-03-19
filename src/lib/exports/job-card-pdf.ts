/**
 * TEMPLATE 6 — Job Card Detail PDF
 * Operational document with inspection, works, parts, labour, costs.
 */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface JobCardPdfData {
  companyName: string;
  jobCardNumber: string;
  truckRegistration: string;
  fleetNumber?: string;
  make?: string;
  model?: string;
  year?: number;
  vin?: string;
  currentOdometer?: number;
  jobType: string;
  jobSource: string;
  assignedTo: string;
  status: string;
  linkedTripNumber?: string;
  description?: string;
  openedAt: string;
  closedAt?: string;
  openedBy?: string;
  closedBy?: string;
  authorisedBy?: string;
  inspectionSections: { name: string; items: { name: string; result: string; notes?: string }[] }[];
  worksRequired: { number: number; description: string; assignedTo?: string; status: string }[];
  partsIssued: { partNumber: string; name: string; qty: number; wac: number; lineTotal: number }[];
  inhouseLabour: { mechanicName: string; worksLine?: string; hours: number; notes?: string }[];
  subletSupplier?: string;
  subletInvoiceNumber?: string;
  subletCostUsd?: number;
  totalPartsCostUsd: number;
  grandTotalUsd: number;
  costCentre?: string;
}

const NAVY: [number, number, number] = [13, 27, 46];
const ORANGE: [number, number, number] = [232, 101, 10];

function fmtDate(val: string): string {
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function fmtCurrency(val: number): string {
  return val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function generateJobCardPdf(data: JobCardPdfData): jsPDF {
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
  doc.text(data.jobCardNumber, m, 14);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.truckRegistration}${data.fleetNumber ? ` (${data.fleetNumber})` : ""}`, m, 20);
  doc.text(data.status.replace(/_/g, " ").toUpperCase(), pw - m, 14, { align: "right" });
  doc.setFontSize(7);
  doc.text(data.companyName, pw - m, 20, { align: "right" });
  y = 34;

  // Vehicle info
  doc.setTextColor(...NAVY);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("VEHICLE", m, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  const vLines = [`${[data.make, data.model, data.year].filter(Boolean).join(" ")}`];
  if (data.vin) vLines.push(`VIN: ${data.vin}`);
  if (data.currentOdometer) vLines.push(`Odometer: ${data.currentOdometer.toLocaleString()} km`);
  doc.text(vLines, m, y + 4);

  // Job info on right
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...NAVY);
  doc.text("JOB DETAILS", pw / 2, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.text([
    `Type: ${data.jobType}  |  Source: ${data.jobSource}`,
    `Assigned: ${data.assignedTo}${data.linkedTripNumber ? `  |  Trip: ${data.linkedTripNumber}` : ""}`,
    `Opened: ${fmtDate(data.openedAt)}${data.closedAt ? `  |  Closed: ${fmtDate(data.closedAt)}` : ""}`,
  ], pw / 2, y + 4);
  y += 18;

  // Inspection
  if (data.inspectionSections.length > 0) {
    doc.setTextColor(...NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("VEHICLE INSPECTION", m, y);
    y += 4;
    for (const section of data.inspectionSections) {
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80, 80, 80);
      doc.text(section.name.toUpperCase(), m, y);
      y += 3;
      autoTable(doc, {
        startY: y,
        head: [["Item", "Result", "Notes"]],
        body: section.items.map((item) => [item.name, item.result, item.notes || ""]),
        margin: { left: m, right: m },
        styles: { fontSize: 6.5, cellPadding: 1.5 },
        headStyles: { fillColor: [240, 240, 240], textColor: [50, 50, 50], fontStyle: "bold" },
        columnStyles: {
          1: { fontStyle: "bold", textColor: (null as any) },
        },
        didParseCell: (hookData: any) => {
          if (hookData.column.index === 1 && hookData.section === "body") {
            if (hookData.cell.raw === "fail") hookData.cell.styles.textColor = [220, 38, 38];
            else if (hookData.cell.raw === "pass") hookData.cell.styles.textColor = [22, 163, 74];
          }
        },
      });
      y = (doc as any).lastAutoTable.finalY + 4;
    }
  }

  // Works required
  if (data.worksRequired.length > 0) {
    doc.setTextColor(...NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("WORKS REQUIRED", m, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["#", "Description", "Assigned To", "Status"]],
      body: data.worksRequired.map((w) => [String(w.number), w.description, w.assignedTo || "—", w.status]),
      margin: { left: m, right: m },
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: NAVY, textColor: [255, 255, 255], fontStyle: "bold" },
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  // Parts
  if (data.partsIssued.length > 0) {
    doc.setTextColor(...NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("PARTS ISSUED", m, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Part #", "Name", "Qty", "WAC (USD)", "Total (USD)"]],
      body: data.partsIssued.map((p) => [p.partNumber, p.name, String(p.qty), fmtCurrency(p.wac), fmtCurrency(p.lineTotal)]),
      margin: { left: m, right: m },
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: NAVY, textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: { 0: { font: "courier" }, 3: { halign: "right" }, 4: { halign: "right" } },
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  // Costs summary
  doc.setFillColor(245, 245, 245);
  doc.rect(m, y, pw - 2 * m, 18, "F");
  doc.setTextColor(...NAVY);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("COSTS SUMMARY", m + 4, y + 5);
  doc.setFont("courier", "normal");
  doc.text(`Parts: $${fmtCurrency(data.totalPartsCostUsd)}`, m + 4, y + 10);
  if (data.subletCostUsd) doc.text(`Sublet: $${fmtCurrency(data.subletCostUsd)}`, m + 60, y + 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...ORANGE);
  doc.text(`TOTAL: $${fmtCurrency(data.grandTotalUsd)}`, pw - m - 4, y + 14, { align: "right" });
  y += 24;

  // Sign-off
  doc.setTextColor(...NAVY);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(`Opened by: ${data.openedBy || "—"}`, m, y);
  doc.text(`Closed by: ${data.closedBy || "—"}`, m + 60, y);
  doc.text(`Authorised by: ${data.authorisedBy || "—"}`, m + 120, y);

  // Footer
  doc.setFontSize(6);
  doc.setTextColor(150, 150, 150);
  doc.setFont("courier", "normal");
  doc.text(`Generated by LynkFleet  |  ${data.companyName}`, m, ph - 8);

  return doc;
}

export function downloadJobCardPdf(data: JobCardPdfData) {
  const doc = generateJobCardPdf(data);
  doc.save(`${data.jobCardNumber}.pdf`);
}
