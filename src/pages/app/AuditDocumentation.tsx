import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";

const AuditDocumentation = () => {
  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Print Controls - Hidden when printing */}
      <div className="print:hidden sticky top-0 z-50 bg-card border-b border-border p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <svg viewBox="0 0 32 32" className="w-full h-full">
                <path
                  d="M6 6 L26 6 L26 12 L14 12 L14 18 L22 18"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <circle cx="6" cy="6" r="2" fill="hsl(var(--accent))" />
                <circle cx="26" cy="6" r="2" fill="hsl(var(--accent))" />
                <circle cx="14" cy="12" r="2" fill="hsl(var(--accent))" />
              </svg>
            </div>
            <span className="font-bold text-primary text-lg">LynkFleet Audit Documentation</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => window.history.back()} variant="outline">
              ← Back
            </Button>
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Export to PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className="container mx-auto py-8 px-4 max-w-4xl print:max-w-none print:py-0 print:px-8">
        
        {/* Cover Page */}
        <div className="print:h-screen print:flex print:flex-col print:justify-center mb-16 print:mb-0">
          <div className="text-center py-16 border-b-4 border-primary">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <path
                    d="M6 6 L26 6 L26 12 L14 12 L14 18 L22 18"
                    stroke="#1e3a8a"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <circle cx="6" cy="6" r="2" fill="#f97316" />
                  <circle cx="26" cy="6" r="2" fill="#f97316" />
                  <circle cx="14" cy="12" r="2" fill="#f97316" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold text-primary mb-4">LynkFleet</h1>
            <p className="text-xl text-muted-foreground mb-8">Fleet Management Platform</p>
            
            <div className="bg-muted rounded-lg p-8 inline-block">
              <h2 className="text-3xl font-semibold text-foreground mb-2">Project Audit</h2>
              <p className="text-lg text-muted-foreground">Business & Technical Documentation</p>
            </div>
            
            <div className="mt-12 text-muted-foreground">
              <p className="font-medium">Document Generated</p>
              <p className="text-lg">{currentDate}</p>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="print:page-break-before mb-12">
          <h2 className="text-2xl font-bold text-primary border-b-2 border-primary pb-2 mb-6">Table of Contents</h2>
          <ol className="space-y-2 text-lg">
            <li className="flex justify-between"><span>1. Core Purpose</span><span className="text-muted-foreground">3</span></li>
            <li className="flex justify-between"><span>2. Feature List</span><span className="text-muted-foreground">4</span></li>
            <li className="flex justify-between"><span>3. Technology Stack</span><span className="text-muted-foreground">7</span></li>
            <li className="flex justify-between"><span>4. User Flow</span><span className="text-muted-foreground">8</span></li>
            <li className="flex justify-between"><span>5. Database Schema</span><span className="text-muted-foreground">9</span></li>
            <li className="flex justify-between"><span>6. Business Logic & Rules</span><span className="text-muted-foreground">12</span></li>
          </ol>
        </div>

        {/* Section 1: Core Purpose */}
        <section className="mb-12 print:page-break-before">
          <h2 className="text-2xl font-bold text-primary border-b-2 border-primary pb-2 mb-6">1. Core Purpose</h2>
          
          <p className="text-lg mb-4">
            <strong>LynkFleet</strong> is a comprehensive fleet management platform built specifically for 
            <strong> Southern African trucking and logistics companies</strong>. The platform enables transport operators to:
          </p>
          
          <ul className="space-y-3 ml-6 mb-6">
            <li className="flex gap-2">
              <span className="text-accent font-bold">•</span>
              <span><strong>Digitize operations:</strong> Replace paper-based tracking with a centralized digital system</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent font-bold">•</span>
              <span><strong>Manage trips end-to-end:</strong> From deployment to completion with full cost tracking</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent font-bold">•</span>
              <span><strong>Track finances:</strong> Invoicing, expenses, daily transactions, and trip bookouts</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent font-bold">•</span>
              <span><strong>Monitor fleet health:</strong> Vehicle maintenance, document expiry alerts, and inventory</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent font-bold">•</span>
              <span><strong>Control costs:</strong> Fuel calculations, expense approvals, and financial reporting</span>
            </li>
          </ul>

          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">Target Users</h3>
            <p>Small-to-medium fleet operators (5-100+ vehicles) in Zimbabwe, South Africa, Botswana, Zambia, and surrounding regions who currently rely on spreadsheets and paper records.</p>
          </div>
        </section>

        {/* Section 2: Feature List */}
        <section className="mb-12 print:page-break-before">
          <h2 className="text-2xl font-bold text-primary border-b-2 border-primary pb-2 mb-6">2. Feature List</h2>
          
          {/* Operations Module */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4 bg-primary/10 px-4 py-2 rounded">Operations Module</h3>
            <ul className="space-y-2 ml-6">
              <li>✅ <strong>Dashboard</strong> - Real-time KPIs (cash balance, receivables, revenue, active trips, pending expenses)</li>
              <li>✅ <strong>GPS Tracking Widget</strong> - Fleet position overview with status indicators</li>
              <li>✅ <strong>Trip Management</strong> - Create, deploy, track, and complete trips</li>
              <li>✅ <strong>Trip Deployment</strong> - Assign vehicle, driver, client, route, fuel allocation</li>
              <li>✅ <strong>Trip Bookout</strong> - Driver cash disbursement with itemized breakdown</li>
              <li>✅ <strong>Active Trip Monitoring</strong> - Progress tracking with status updates</li>
            </ul>
          </div>

          {/* Fleet Module */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4 bg-primary/10 px-4 py-2 rounded">Fleet Module</h3>
            <ul className="space-y-2 ml-6">
              <li>✅ <strong>Vehicle Registry</strong> - Registration, make/model, year, VIN, color</li>
              <li>✅ <strong>Fuel Parameters</strong> - Tank capacity, consumption rates (loaded/empty)</li>
              <li>✅ <strong>Odometer Tracking</strong> - Current mileage per vehicle</li>
              <li>✅ <strong>Document Expiry Tracking</strong> - Insurance, license, roadworthy certificates</li>
              <li>✅ <strong>Vehicle Status Management</strong> - Available, in-transit, maintenance</li>
            </ul>
          </div>

          {/* Workshop Module */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4 bg-primary/10 px-4 py-2 rounded">Workshop Module</h3>
            <ul className="space-y-2 ml-6">
              <li>✅ <strong>Maintenance Log</strong> - Service history and repairs</li>
              <li>✅ <strong>Inventory Management</strong> - Parts and supplies tracking</li>
            </ul>
          </div>

          {/* Personnel Module */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4 bg-primary/10 px-4 py-2 rounded">Personnel Module</h3>
            <ul className="space-y-2 ml-6">
              <li>✅ <strong>Driver Management</strong> - Full profiles with ID, license, contact, emergency info</li>
              <li>✅ <strong>License Expiry Tracking</strong> - Driver license validity monitoring</li>
              <li>✅ <strong>Employment Status</strong> - Active/inactive driver tracking</li>
            </ul>
          </div>

          {/* Accounting Module */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4 bg-primary/10 px-4 py-2 rounded">Accounting Module</h3>
            <ul className="space-y-2 ml-6">
              <li>✅ <strong>Daily Transactions</strong> - Multi-entry transaction recording with receipt upload</li>
              <li>✅ <strong>Invoice Management</strong> - Create, send, track payment status (Draft → Sent → Paid)</li>
              <li>✅ <strong>Expense Recording</strong> - Categorized expenses with approval workflow</li>
              <li>✅ <strong>Receipt/Document Upload</strong> - Paperless expense documentation</li>
              <li>✅ <strong>Chart of Accounts</strong> - Standard accounting structure</li>
              <li>✅ <strong>Journal Entries</strong> - Double-entry bookkeeping support</li>
              <li>✅ <strong>Payment Records</strong> - Track incoming/outgoing payments</li>
              <li>✅ <strong>Financial Reports</strong> - Aggregated financial data</li>
            </ul>
          </div>

          {/* Client & Supplier Module */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4 bg-primary/10 px-4 py-2 rounded">Client & Supplier Module</h3>
            <ul className="space-y-2 ml-6">
              <li>✅ <strong>Client Registry</strong> - Contact info, payment terms, notes</li>
              <li>✅ <strong>Supplier Management</strong> - Vendor tracking</li>
            </ul>
          </div>

          {/* Tools */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4 bg-primary/10 px-4 py-2 rounded">Utility Tools</h3>
            <ul className="space-y-2 ml-6">
              <li>✅ <strong>Fuel Calculator</strong> - Route-based fuel estimation using vehicle consumption rates</li>
              <li>✅ <strong>Document Reminders</strong> - Expiring document alerts</li>
            </ul>
          </div>

          {/* Authentication */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4 bg-primary/10 px-4 py-2 rounded">Authentication & Admin</h3>
            <ul className="space-y-2 ml-6">
              <li>✅ <strong>User Registration/Login</strong> - Email/password via Supabase Auth</li>
              <li>✅ <strong>Company Onboarding</strong> - Multi-tenant company setup</li>
              <li>✅ <strong>Role-Based Access</strong> - Admin, User roles</li>
              <li>✅ <strong>Admin Panel</strong> - View founding member applications</li>
              <li>✅ <strong>Landing Page</strong> - Marketing with lead capture form</li>
            </ul>
          </div>
        </section>

        {/* Section 3: Technology Stack */}
        <section className="mb-12 print:page-break-before">
          <h2 className="text-2xl font-bold text-primary border-b-2 border-primary pb-2 mb-6">3. Technology Stack</h2>
          
          <h3 className="text-xl font-semibold mb-4">Frontend</h3>
          <table className="w-full border-collapse mb-8">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="border border-border p-3 text-left">Technology</th>
                <th className="border border-border p-3 text-left">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-border p-3">React 18.3</td><td className="border border-border p-3">UI Framework</td></tr>
              <tr className="bg-muted"><td className="border border-border p-3">TypeScript</td><td className="border border-border p-3">Type Safety</td></tr>
              <tr><td className="border border-border p-3">Vite</td><td className="border border-border p-3">Build Tool & Dev Server</td></tr>
              <tr className="bg-muted"><td className="border border-border p-3">React Router 6</td><td className="border border-border p-3">Client-side Routing</td></tr>
              <tr><td className="border border-border p-3">Tailwind CSS</td><td className="border border-border p-3">Utility-first Styling</td></tr>
              <tr className="bg-muted"><td className="border border-border p-3">shadcn/ui</td><td className="border border-border p-3">Component Library (Radix primitives)</td></tr>
              <tr><td className="border border-border p-3">Framer Motion</td><td className="border border-border p-3">Animations</td></tr>
              <tr className="bg-muted"><td className="border border-border p-3">TanStack React Query</td><td className="border border-border p-3">Server State Management</td></tr>
              <tr><td className="border border-border p-3">Recharts</td><td className="border border-border p-3">Data Visualization</td></tr>
              <tr className="bg-muted"><td className="border border-border p-3">React Hook Form + Zod</td><td className="border border-border p-3">Form Handling & Validation</td></tr>
            </tbody>
          </table>

          <h3 className="text-xl font-semibold mb-4">Backend (Supabase)</h3>
          <table className="w-full border-collapse mb-8">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="border border-border p-3 text-left">Service</th>
                <th className="border border-border p-3 text-left">Usage</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-border p-3">PostgreSQL Database</td><td className="border border-border p-3">All business data storage</td></tr>
              <tr className="bg-muted"><td className="border border-border p-3">Auth</td><td className="border border-border p-3">User authentication & sessions</td></tr>
              <tr><td className="border border-border p-3">Row Level Security (RLS)</td><td className="border border-border p-3">Multi-tenant data isolation</td></tr>
              <tr className="bg-muted"><td className="border border-border p-3">Storage</td><td className="border border-border p-3">Receipt/document file uploads</td></tr>
              <tr><td className="border border-border p-3">Database Functions</td><td className="border border-border p-3">get_user_company_id(), has_role(), generate_invoice_number()</td></tr>
            </tbody>
          </table>
        </section>

        {/* Section 4: User Flow */}
        <section className="mb-12 print:page-break-before">
          <h2 className="text-2xl font-bold text-primary border-b-2 border-primary pb-2 mb-6">4. User Flow</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold text-lg">1. Discovery</h4>
              <p className="text-muted-foreground">Landing Page → Hero → Value Props → Features → Founding Program</p>
            </div>
            
            <div className="border-l-4 border-accent pl-4">
              <h4 className="font-semibold text-lg">2. Lead Capture</h4>
              <p className="text-muted-foreground">Application Form → Submit (WhatsApp, Email, Company, Region, Vehicles)</p>
            </div>
            
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold text-lg">3. Registration</h4>
              <p className="text-muted-foreground">/signup → Email + Password + Full Name → Supabase Auth creates user</p>
            </div>
            
            <div className="border-l-4 border-accent pl-4">
              <h4 className="font-semibold text-lg">4. Onboarding</h4>
              <p className="text-muted-foreground">/onboarding → Create Company → Profile linked → Chart of Accounts seeded</p>
            </div>
            
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold text-lg">5. Main App Access</h4>
              <p className="text-muted-foreground">/app/dashboard → KPI Overview + GPS Widget</p>
            </div>
            
            <div className="border-l-4 border-accent pl-4">
              <h4 className="font-semibold text-lg">6. Daily Operations Flow</h4>
              <ul className="text-muted-foreground ml-4 mt-2 space-y-1">
                <li>→ Add Vehicles, Drivers, Clients</li>
                <li>→ Create/Deploy Trip (assign vehicle, driver, client, route)</li>
                <li>→ Trip Bookout (record cash given to driver)</li>
                <li>→ During Trip: GPS Tracking, Record Expenses with receipts</li>
                <li>→ Complete Trip → Invoice Client</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold text-lg">7. Financial Management</h4>
              <ul className="text-muted-foreground ml-4 mt-2 space-y-1">
                <li>→ Daily Transactions</li>
                <li>→ Expense Approval Workflow</li>
                <li>→ Invoice Status Tracking</li>
                <li>→ Reports</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5: Database Schema */}
        <section className="mb-12 print:page-break-before">
          <h2 className="text-2xl font-bold text-primary border-b-2 border-primary pb-2 mb-6">5. Database Schema</h2>
          
          <h3 className="text-xl font-semibold mb-4">Core Tables</h3>
          <table className="w-full border-collapse mb-8 text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="border border-border p-2 text-left">Table</th>
                <th className="border border-border p-2 text-left">Purpose</th>
                <th className="border border-border p-2 text-left">Key Columns</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-border p-2 font-medium">companies</td><td className="border border-border p-2">Multi-tenant company records</td><td className="border border-border p-2">id, name, owner_name, email, phone, currency</td></tr>
              <tr className="bg-muted"><td className="border border-border p-2 font-medium">profiles</td><td className="border border-border p-2">User profiles linked to auth</td><td className="border border-border p-2">id, user_id, company_id, full_name, email</td></tr>
              <tr><td className="border border-border p-2 font-medium">user_roles</td><td className="border border-border p-2">Role assignments</td><td className="border border-border p-2">id, user_id, role (enum)</td></tr>
            </tbody>
          </table>

          <h3 className="text-xl font-semibold mb-4">Operations Tables</h3>
          <table className="w-full border-collapse mb-8 text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="border border-border p-2 text-left">Table</th>
                <th className="border border-border p-2 text-left">Purpose</th>
                <th className="border border-border p-2 text-left">Key Columns</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-border p-2 font-medium">vehicles</td><td className="border border-border p-2">Fleet registry</td><td className="border border-border p-2">registration_number, make, model, current_odometer, status</td></tr>
              <tr className="bg-muted"><td className="border border-border p-2 font-medium">drivers</td><td className="border border-border p-2">Driver profiles</td><td className="border border-border p-2">full_name, id_number, license_number, license_expiry</td></tr>
              <tr><td className="border border-border p-2 font-medium">clients</td><td className="border border-border p-2">Customer registry</td><td className="border border-border p-2">name, contact_person, email, payment_terms_days</td></tr>
              <tr className="bg-muted"><td className="border border-border p-2 font-medium">trips</td><td className="border border-border p-2">Trip records</td><td className="border border-border p-2">trip_reference, origin, destination, status, vehicle_id, driver_id</td></tr>
            </tbody>
          </table>

          <h3 className="text-xl font-semibold mb-4">Financial Tables</h3>
          <table className="w-full border-collapse mb-8 text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="border border-border p-2 text-left">Table</th>
                <th className="border border-border p-2 text-left">Purpose</th>
                <th className="border border-border p-2 text-left">Key Columns</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-border p-2 font-medium">transactions</td><td className="border border-border p-2">General ledger</td><td className="border border-border p-2">transaction_number, transaction_type, total_amount, status</td></tr>
              <tr className="bg-muted"><td className="border border-border p-2 font-medium">journal_entries</td><td className="border border-border p-2">Double-entry lines</td><td className="border border-border p-2">transaction_id, account_code, debit_amount, credit_amount</td></tr>
              <tr><td className="border border-border p-2 font-medium">invoices</td><td className="border border-border p-2">Customer invoices</td><td className="border border-border p-2">invoice_number, client_id, total_amount, status</td></tr>
              <tr className="bg-muted"><td className="border border-border p-2 font-medium">expense_records</td><td className="border border-border p-2">Expense tracking</td><td className="border border-border p-2">expense_type, amount, status, receipt_photo_url</td></tr>
              <tr><td className="border border-border p-2 font-medium">payment_records</td><td className="border border-border p-2">Payment tracking</td><td className="border border-border p-2">payment_type, payment_method, amount, invoice_id</td></tr>
              <tr className="bg-muted"><td className="border border-border p-2 font-medium">trip_bookouts</td><td className="border border-border p-2">Driver cash disbursement</td><td className="border border-border p-2">total_cash_given, food_allowance, toll_fees, variance</td></tr>
              <tr><td className="border border-border p-2 font-medium">chart_of_accounts</td><td className="border border-border p-2">Account structure</td><td className="border border-border p-2">account_code, account_name, account_type, category</td></tr>
            </tbody>
          </table>

          <h3 className="text-xl font-semibold mb-4">Storage Buckets</h3>
          <table className="w-full border-collapse mb-8 text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="border border-border p-2 text-left">Bucket</th>
                <th className="border border-border p-2 text-left">Purpose</th>
                <th className="border border-border p-2 text-left">Access</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-border p-2 font-medium">receipts</td><td className="border border-border p-2">Expense receipts & documents</td><td className="border border-border p-2">Company-scoped RLS (10MB limit)</td></tr>
            </tbody>
          </table>
        </section>

        {/* Section 6: Business Logic & Rules */}
        <section className="mb-12 print:page-break-before">
          <h2 className="text-2xl font-bold text-primary border-b-2 border-primary pb-2 mb-6">6. Business Logic & Rules</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Multi-Tenancy & Security</h3>
              <ul className="space-y-2 ml-6">
                <li>• <strong>Company Isolation:</strong> All data filtered by company_id = get_user_company_id() via RLS</li>
                <li>• <strong>Admin Check:</strong> has_role(user_id, 'admin') for elevated permissions</li>
                <li>• <strong>Restrictive Policies:</strong> All RLS policies are Permissive: No (strict mode)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Vehicle Rules</h3>
              <ul className="space-y-2 ml-6">
                <li>• <strong>Soft Delete:</strong> Vehicles set is_active = false instead of deletion</li>
                <li>• <strong>Default Values:</strong> tank_capacity = 800L, consumption_empty = 30 L/100km, consumption_loaded = 38 L/100km</li>
                <li>• <strong>Status Options:</strong> available, in_transit, maintenance</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Trip Lifecycle</h3>
              <div className="bg-muted p-4 rounded-lg font-mono text-center mb-4">
                planned → in_transit → completed | cancelled
              </div>
              <ul className="space-y-2 ml-6">
                <li>• <strong>Progress:</strong> progress_percent (0-100) tracks completion</li>
                <li>• <strong>Load Status:</strong> loaded | empty</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Invoice Workflow</h3>
              <div className="bg-muted p-4 rounded-lg font-mono text-center mb-4">
                DRAFT → SENT (sent_at) → PAID (paid_at)
              </div>
              <ul className="space-y-2 ml-6">
                <li>• <strong>Auto-generation:</strong> generate_invoice_number() DB function</li>
                <li>• <strong>Payment Terms:</strong> Default 30 days, configurable per client</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Expense Approval Workflow</h3>
              <div className="bg-muted p-4 rounded-lg font-mono text-center mb-4">
                PENDING → APPROVED (approved_by, approved_at) | REJECTED (rejection_reason)
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Trip Bookout Reconciliation</h3>
              <ul className="space-y-2 ml-6">
                <li>• <strong>Variance Calculation:</strong> variance = total_cash_given - amount_spent - amount_returned</li>
                <li>• <strong>Status Flow:</strong> PENDING → RECONCILED</li>
                <li>• <strong>Itemized Tracking:</strong> Food, accommodation, tolls, border fees, emergency fund, airtime, other</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">File Upload Rules</h3>
              <ul className="space-y-2 ml-6">
                <li>• <strong>Bucket:</strong> receipts</li>
                <li>• <strong>Max Size:</strong> 10MB per file</li>
                <li>• <strong>Path Format:</strong> {'{company_id}'}/{'{uuid}'}-{'{filename}'}</li>
                <li>• <strong>RLS:</strong> Users can only access files within their company folder</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Summary Statistics */}
        <section className="mb-12 print:page-break-before">
          <h2 className="text-2xl font-bold text-primary border-b-2 border-primary pb-2 mb-6">Summary Statistics</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-primary">15</p>
              <p className="text-muted-foreground">Database Tables</p>
            </div>
            <div className="bg-accent/10 rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-accent">1</p>
              <p className="text-muted-foreground">Storage Bucket</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-primary">25+</p>
              <p className="text-muted-foreground">React Pages</p>
            </div>
            <div className="bg-accent/10 rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-accent">8+</p>
              <p className="text-muted-foreground">Custom Hooks</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-primary">50+</p>
              <p className="text-muted-foreground">UI Components</p>
            </div>
            <div className="bg-accent/10 rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-accent">3</p>
              <p className="text-muted-foreground">DB Functions</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t-2 border-primary pt-8 mt-16 text-center text-muted-foreground">
          <div className="flex justify-center mb-4">
            <div className="relative w-12 h-12">
              <svg viewBox="0 0 32 32" className="w-full h-full">
                <path
                  d="M6 6 L26 6 L26 12 L14 12 L14 18 L22 18"
                  stroke="#1e3a8a"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <circle cx="6" cy="6" r="2" fill="#f97316" />
                <circle cx="26" cy="6" r="2" fill="#f97316" />
                <circle cx="14" cy="12" r="2" fill="#f97316" />
              </svg>
            </div>
          </div>
          <p className="font-semibold text-foreground">LynkFleet</p>
          <p>Fleet Management Platform for Southern Africa</p>
          <p className="mt-4 text-sm">Document generated: {currentDate}</p>
          <p className="text-sm">© {new Date().getFullYear()} LynkFleet. All rights reserved.</p>
        </footer>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:page-break-before { page-break-before: always; }
          .print\\:hidden { display: none !important; }
          @page { margin: 1in; size: A4; }
        }
      `}</style>
    </div>
  );
};

export default AuditDocumentation;