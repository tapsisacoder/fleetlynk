/**
 * LynkFleet Export System
 * 8 templates covering 71 exportable documents
 * 
 * BASE TEMPLATE 1: Universal Report PDF (pdf-report.ts)
 * BASE TEMPLATE 2: Universal CSV Export (csv-export.ts)
 * TEMPLATE 3: Invoice PDF (invoice-pdf.ts)
 * TEMPLATE 4: Client Statement PDF (client-statement-pdf.ts)
 * TEMPLATE 5: Payroll Summary PDF (payroll-pdf.ts)
 * TEMPLATE 6: Job Card Detail PDF (job-card-pdf.ts)
 * TEMPLATE 7: Vehicle Detail PDF (vehicle-detail-pdf.ts)
 * TEMPLATE 8: Trip Detail PDF (trip-detail-pdf.ts)
 */

export { generateCsv, downloadCsv } from "./csv-export";
export type { CsvColumnDef, CsvExportConfig } from "./csv-export";

export { generateReportPdf, downloadReportPdf } from "./pdf-report";
export type { ReportColumnDef, SummaryCard, ReportPdfConfig } from "./pdf-report";

export { generateInvoicePdf, downloadInvoicePdf } from "./invoice-pdf";
export type { InvoiceData } from "./invoice-pdf";

export { generateClientStatementPdf, downloadClientStatementPdf } from "./client-statement-pdf";
export type { ClientStatementData, StatementTransaction } from "./client-statement-pdf";

export { generatePayrollPdf, downloadPayrollPdf } from "./payroll-pdf";
export type { PayrollPdfData, PayrollEmployee } from "./payroll-pdf";

export { generateJobCardPdf, downloadJobCardPdf } from "./job-card-pdf";
export type { JobCardPdfData } from "./job-card-pdf";

export { generateVehicleDetailPdf, downloadVehicleDetailPdf } from "./vehicle-detail-pdf";
export type { VehicleDetailData } from "./vehicle-detail-pdf";

export { generateTripDetailPdf, downloadTripDetailPdf } from "./trip-detail-pdf";
export type { TripDetailData } from "./trip-detail-pdf";
