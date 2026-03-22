import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDemoContext } from "./DemoContext";
import { Download, Check } from "lucide-react";
import { toast } from "sonner";
import { downloadInvoicePdf } from "@/lib/exports/invoice-pdf";

interface Props { open: boolean; onOpenChange: (open: boolean) => void; tripNumber: string; }

const Blurred = ({ text = "████████████████" }: { text?: string }) => (
  <span className="select-none text-muted-foreground/60" style={{ filter: "blur(4px)" }}>{text}</span>
);

export const DemoInvoiceDialog = ({ open, onOpenChange, tripNumber }: Props) => {
  const demo = useDemoContext();
  if (!demo) return null;

  const trip = demo.allTrips.find(t => t.trip_number === tripNumber);
  const invoice = demo.invoices.find(inv => inv.trip_number === tripNumber);
  const client = demo.clients.find(c => c.id === trip?.client_id);
  if (!trip) return null;

  const invoiceNumber = invoice?.invoice_number || `INV-${tripNumber.replace("TRP-", "")}`;
  const isConfirmed = invoice?.status === "confirmed";

  const handleConfirm = () => {
    if (!invoice) demo.raiseInvoice(tripNumber);
    demo.confirmInvoice(invoiceNumber);
    toast.success(`Invoice ${invoiceNumber} confirmed`);
  };

  const handleDownloadPdf = () => {
    downloadInvoicePdf({
      layout: "modern", primaryColour: "#E86510",
      companyName: demo.company.company_name,
      companyAddress: "██████████████████████████",
      companyPhone: "████████████", companyEmail: demo.company.email,
      companyVatNumber: "████████████", companyRegistrationNumber: "████████████",
      companyBankName: "CBZ Bank", companyAccountNumber: "████████████",
      companyBranchCode: "████████", vatRegistered: false, vatRate: 0,
      invoiceNumber, invoiceDate: "2026-03-23", dueDate: "",
      paymentTermsDays: client?.payment_terms_days || 45,
      status: "confirmed",
      clientCompanyName: client?.company_name || trip.client_name,
      clientAddress: "██████████████████████████",
      clientVatNumber: "████████████",
      clientContactPerson: client?.contact_person || "",
      clientVatTreatment: "exempt",
      tripNumber: trip.trip_number, tripType: trip.trip_type,
      origin: trip.origin, destination: trip.destination, loadType: "Containers",
      subtotalUsd: trip.rate_usd, vatAmountUsd: 0, totalUsd: trip.rate_usd,
      amountPaidUsd: 0, amountOutstandingUsd: trip.rate_usd, payments: [],
    });
    toast.success("Invoice PDF downloaded");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-mono text-foreground">{invoiceNumber}</DialogTitle></DialogHeader>
        <div className="space-y-5">
          {/* Company Header */}
          <div className="bg-accent text-accent-foreground p-4 -mx-6 -mt-2 rounded-t-sm">
            <h2 className="text-lg font-bold">{demo.company.company_name}</h2>
            <div className="text-xs mt-1 opacity-80"><Blurred text="123 Industrial Road, Harare, Zimbabwe" /> | <Blurred text="+263 242 123 456" /></div>
            <div className="text-xs opacity-80">VAT: <Blurred text="1234567890" /></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-medium">Invoice Date</div>
              <div className="text-sm font-mono">23/03/2026</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-medium">Status</div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${isConfirmed ? "bg-[hsl(var(--green))]/10 text-[hsl(var(--green))]" : "bg-muted text-muted-foreground"}`}>
                {isConfirmed ? "CONFIRMED" : "DRAFT"}
              </span>
            </div>
          </div>

          {/* Bill To */}
          <div className="border border-border p-3">
            <div className="text-[10px] text-muted-foreground uppercase font-medium mb-2">Bill To</div>
            <div className="text-sm font-medium text-foreground">{client?.company_name}</div>
            <div className="text-xs text-muted-foreground">Attn: {client?.contact_person}</div>
            <div className="text-xs"><Blurred text="456 Commerce Drive, Harare" /></div>
            <div className="text-xs">VAT: <Blurred text="9876543210" /></div>
            <div className="text-xs">Tel: <Blurred text="+263 242 987 654" /></div>
          </div>

          {/* Trip Reference */}
          <div className="border border-border p-3">
            <div className="text-[10px] text-muted-foreground uppercase font-medium mb-2">Trip Reference</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div><span className="text-muted-foreground">Trip #:</span> <span className="font-mono font-medium">{trip.trip_number}</span></div>
              <div><span className="text-muted-foreground">Route:</span> {trip.origin} → {trip.destination}</div>
              <div><span className="text-muted-foreground">Trip Type:</span> {trip.trip_type}</div>
              <div><span className="text-muted-foreground">Distance:</span> {trip.distance_km}km</div>
              <div><span className="text-muted-foreground">Vehicle:</span> <span className="font-mono">{trip.truck_reg}</span></div>
              <div><span className="text-muted-foreground">Driver:</span> {trip.driver_name}</div>
              <div><span className="text-muted-foreground">Load Type:</span> Containers</div>
            </div>
          </div>

          {/* Line Items */}
          <table className="w-full text-sm border border-border">
            <thead className="bg-foreground text-background">
              <tr>
                <th className="text-left px-3 py-2 text-xs">Description</th>
                <th className="text-center px-3 py-2 text-xs w-16">Qty</th>
                <th className="text-right px-3 py-2 text-xs w-28">Rate (USD)</th>
                <th className="text-right px-3 py-2 text-xs w-28">Amount (USD)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="px-3 py-2 text-xs">Freight — {trip.origin} to {trip.destination} — {trip.trip_type}</td>
                <td className="px-3 py-2 text-xs text-center">1</td>
                <td className="px-3 py-2 text-xs text-right font-mono">${trip.rate_usd.toLocaleString()}.00</td>
                <td className="px-3 py-2 text-xs text-right font-mono">${trip.rate_usd.toLocaleString()}.00</td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1">
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">${trip.rate_usd.toLocaleString()}.00</span></div>
              <div className="border-t border-border pt-2">
                <div className="flex justify-between text-base font-bold">
                  <span className="text-foreground">Total Due</span>
                  <span className="font-mono text-accent">${trip.rate_usd.toLocaleString()}.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="border border-border p-3">
            <div className="text-[10px] text-muted-foreground uppercase font-medium mb-2">Payment Details</div>
            <div className="text-xs space-y-0.5">
              <div><span className="text-muted-foreground">Bank:</span> CBZ Bank</div>
              <div><span className="text-muted-foreground">Account:</span> <Blurred text="1234567890123" /></div>
              <div><span className="text-muted-foreground">Reference:</span> <span className="font-mono">{invoiceNumber}</span></div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          {!isConfirmed && (
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleConfirm}>
              <Check className="h-4 w-4 mr-1" /> Confirm Invoice
            </Button>
          )}
          {isConfirmed && (
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleDownloadPdf}>
              <Download className="h-4 w-4 mr-1" /> Download PDF
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
