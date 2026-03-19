/**
 * TEMPLATE 7 — Vehicle Detail PDF
 * Compliance record. May be presented to authorities.
 */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface VehicleDetailData {
  companyName: string;
  registrationNumber: string;
  fleetNumber?: string;
  status: string;
  vehicleType: string;
  make?: string;
  model?: string;
  year?: number;
  vin?: string;
  fuelTankCapacity?: number;
  kmPerLitreLoaded?: number;
  kmPerLitreUnloaded?: number;
  odometerTracking: boolean;
  currentOdometer?: number;
  totalKm: number;
  costPerKm?: number;
  complianceDocuments: { name: string; issueDate: string; expiryDate: string; status: string }[];
  totalFuelCost: number;
  totalWorkshopCost: number;
  totalPartsCost: number;
  totalCost: number;
  recentMovements: { date: string; from: string; to: string; distance: number; driver: string; type: string }[];
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

export function generateVehicleDetailPdf(data: VehicleDetailData): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const m = 15;
  let y = m;

  // Header
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pw, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("courier", "bold");
  doc.text(data.registrationNumber, m, 14);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  if (data.fleetNumber) doc.text(`Fleet: ${data.fleetNumber}`, m, 21);
  doc.text(data.status.replace(/_/g, " ").toUpperCase(), pw - m, 14, { align: "right" });
  doc.setFontSize(7);
  doc.text(data.companyName, pw - m, 21, { align: "right" });
  y = 34;

  // Vehicle overview
  doc.setTextColor(...NAVY);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("VEHICLE OVERVIEW", m, y);
  y += 5;
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  const info = [
    `Type: ${data.vehicleType}  |  ${[data.make, data.model, data.year].filter(Boolean).join(" ")}`,
    data.vin ? `VIN: ${data.vin}` : "",
    `Tank: ${data.fuelTankCapacity || "—"}L  |  Loaded: ${data.kmPerLitreLoaded || "—"} km/L  |  Unloaded: ${data.kmPerLitreUnloaded || "—"} km/L`,
    `Total KM: ${data.totalKm.toLocaleString()}${data.odometerTracking && data.currentOdometer ? `  |  Odometer: ${data.currentOdometer.toLocaleString()}` : ""}`,
    data.costPerKm ? `Cost/km: $${data.costPerKm.toFixed(3)}` : "",
  ].filter(Boolean);
  doc.text(info, m, y);
  y += info.length * 3.5 + 6;

  // Compliance
  if (data.complianceDocuments.length > 0) {
    doc.setTextColor(...NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("COMPLIANCE DOCUMENTS", m, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Document", "Issue Date", "Expiry Date", "Status"]],
      body: data.complianceDocuments.map((d) => [d.name, fmtDate(d.issueDate), fmtDate(d.expiryDate), d.status]),
      margin: { left: m, right: m },
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: NAVY, textColor: [255, 255, 255], fontStyle: "bold" },
      didParseCell: (hookData: any) => {
        if (hookData.column.index === 3 && hookData.section === "body") {
          const s = String(hookData.cell.raw).toLowerCase();
          if (s === "expired") hookData.cell.styles.textColor = [220, 38, 38];
          else if (s.includes("expiring")) hookData.cell.styles.textColor = [245, 158, 11];
          else hookData.cell.styles.textColor = [22, 163, 74];
        }
      },
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  // Cost summary
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("COST SUMMARY (ALL TIME)", m, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    head: [["Fuel Cost", "Workshop Cost", "Parts Cost", "Total Cost"]],
    body: [[`$${fmtCurrency(data.totalFuelCost)}`, `$${fmtCurrency(data.totalWorkshopCost)}`, `$${fmtCurrency(data.totalPartsCost)}`, `$${fmtCurrency(data.totalCost)}`]],
    margin: { left: m, right: m },
    styles: { fontSize: 8, halign: "center", cellPadding: 3, font: "courier" },
    headStyles: { fillColor: [240, 240, 240], textColor: [50, 50, 50], fontStyle: "bold", font: "helvetica" },
  });
  y = (doc as any).lastAutoTable.finalY + 6;

  // Recent movements
  if (data.recentMovements.length > 0) {
    doc.setTextColor(...NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("RECENT MOVEMENTS (LAST 10)", m, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Date", "From", "To", "Distance (km)", "Driver", "Type"]],
      body: data.recentMovements.map((mv) => [fmtDate(mv.date), mv.from, mv.to, mv.distance.toLocaleString(), mv.driver, mv.type]),
      margin: { left: m, right: m },
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: NAVY, textColor: [255, 255, 255], fontStyle: "bold" },
    });
  }

  // Footer
  doc.setFontSize(6);
  doc.setTextColor(150, 150, 150);
  doc.setFont("courier", "normal");
  doc.text(`Generated by LynkFleet  |  ${data.companyName}`, m, ph - 8);

  return doc;
}

export function downloadVehicleDetailPdf(data: VehicleDetailData) {
  const doc = generateVehicleDetailPdf(data);
  doc.save(`Vehicle_${data.registrationNumber.replace(/\s+/g, "_")}.pdf`);
}
