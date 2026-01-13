# LynkFleet Garage Workshop Module
## Complete Specification Document

---

## 1. Executive Summary

The Garage Workshop Module is the final extension to the LynkFleet fleet management system. This module digitizes and streamlines workshop operations, inventory management, and vehicle maintenance tracking. It creates a comprehensive digital vehicle logbook system while managing parts inventory, supplier relationships, and payment tracking.

### Key Objectives
- Digitize vehicle maintenance records (digital logbook)
- Track parts inventory (warehouse/storage management)
- Monitor parts usage per vehicle
- Manage supplier relationships and payment status
- Integrate seamlessly with existing fleet and trip management

---

## 2. Module Overview

### 2.1 Core Functions

**Inventory Management**
- Track all parts, consumables, tyres, and oil in storage
- Real-time stock levels with low-stock alerts
- Part categorization and searchability
- Serial number tracking for critical components

**Vehicle Logbook**
- Complete maintenance history per vehicle
- Service records with parts used
- Labor tracking and costs
- Scheduled maintenance reminders

**Supplier Management**
- Supplier database with contact details
- Part-to-supplier mapping
- Purchase order tracking
- Payment status monitoring

---

## 3. Detailed Feature Specifications

### 3.1 Inventory/Warehouse Management

#### 3.1.1 Parts Catalog
**Database Structure:**
- Part Number (unique identifier)
- Part Name/Description
- Category (Engine Parts, Brake System, Electrical, Body Parts, Tyres, Fluids, Filters, etc.)
- Sub-category
- Unit of Measure (pieces, liters, sets, etc.)
- Current Stock Level
- Minimum Stock Level (reorder point)
- Maximum Stock Level
- Unit Cost (average)
- Storage Location (shelf/bay reference)
- Part Condition (New, Refurbished, Used)
- Compatible Vehicles/Models
- Part Image (optional)
- Supplier(s) - can have multiple suppliers per part
- Date Added
- Last Updated

**Inventory Categories:**
1. **Engine Parts**
   - Pistons, rings, bearings
   - Gaskets and seals
   - Timing components
   - Fuel injection parts
   - Turbocharger components

2. **Brake System**
   - Brake pads/shoes
   - Brake discs/drums
   - Brake lines/hoses
   - Brake fluid
   - Air brake components

3. **Electrical Components**
   - Batteries
   - Alternators/starters
   - Lights and bulbs
   - Sensors
   - Wiring harnesses

4. **Suspension & Steering**
   - Springs (leaf/coil)
   - Shock absorbers
   - Bushings
   - Steering components
   - Wheel bearings

5. **Tyres**
   - Drive tyres (by size)
   - Steer tyres (by size)
   - Trailer tyres (by size)
   - Inner tubes
   - Tyre condition tracking

6. **Fluids & Lubricants**
   - Engine oil (by grade)
   - Transmission oil
   - Differential oil
   - Hydraulic fluid
   - Coolant/antifreeze
   - AdBlue/DEF
   - Grease

7. **Filters**
   - Oil filters
   - Fuel filters
   - Air filters
   - Cabin filters

8. **Body & Accessories**
   - Mirrors
   - Wipers
   - Mudflaps
   - Lights/reflectors
   - Bumpers

9. **Trailer Parts**
   - King pins
   - Landing gear
   - Coupling components
   - Trailer axle parts

#### 3.1.2 Stock Management Features

**Stock In (Receiving)**
- Record new stock arrivals
- Link to supplier
- Enter quantity received
- Unit cost and total cost
- Invoice/Receipt number
- Date received
- Condition upon arrival
- Auto-update stock levels

**Stock Out (Usage)**
- Record parts used
- Link to specific vehicle/job
- Quantity used
- Auto-deduct from stock
- Track wastage separately
- Reason for usage (service, repair, accident, breakdown)

**Stock Adjustments**
- Manual stock corrections
- Reason tracking (damage, theft, count discrepancy)
- Audit trail
- Authorization required for adjustments

**Stock Alerts**
- Low stock warnings (below minimum level)
- Out of stock alerts
- Expiry date warnings (for fluids with shelf life)
- Scheduled reorder reminders

**Stock Valuation**
- Current inventory value
- FIFO/LIFO/Average costing methods
- Stock aging report
- Dead stock identification

**Physical Stock Take**
- Scheduled count functionality
- Variance reporting
- Adjustment workflow
- Count history

---

### 3.2 Digital Vehicle Logbook

#### 3.2.1 Service Records

**Service Entry Structure:**
- Service Date
- Vehicle (dropdown from fleet)
- Odometer Reading
- Service Type:
  - Scheduled Maintenance (10k, 20k, 50k service)
  - Repair (Breakdown)
  - Pre-trip Inspection Fix
  - Accident Repair
  - Modification/Upgrade
- Service Category:
  - Engine Work
  - Transmission/Drivetrain
  - Brakes
  - Suspension
  - Electrical
  - Body Work
  - Tyre Service
  - General Service
- Work Description (text field)
- Labor Hours
- Labor Cost
- Mechanic/Technician Name
- Start Date/Time
- Completion Date/Time
- Service Status (Scheduled, In Progress, Completed, On Hold)
- Priority (Low, Medium, High, Critical)
- Next Service Date/Mileage

**Parts Used Section (within each service record):**
- Part Name (searchable dropdown from inventory)
- Part Number
- Quantity Used
- Unit Cost
- Total Cost
- Stock Source (From Inventory, Purchased Direct, Customer Supplied)
- Supplier (if purchased direct)
- Payment Status (Paid, Unpaid, Partially Paid)
- Invoice/Receipt Reference

**Photos/Documents:**
- Before photos
- During work photos
- After photos
- Inspection reports
- Warranty documents
- Supplier invoices

**Approvals:**
- Estimated cost approval (if required)
- Completion sign-off
- Quality check approval

#### 3.2.2 Vehicle Maintenance Dashboard

**Per-Vehicle View:**
- Complete service history timeline
- Total maintenance cost (lifetime)
- Maintenance cost per km
- Upcoming service reminders
- Parts replacement history
- Downtime tracking
- Most frequent issues
- Current health status indicators

**Service Intervals:**
- Oil change (every X km or X months)
- Filter replacement schedules
- Brake inspection/service
- Tyre rotation
- Major service milestones
- Roadworthy test dates
- License renewal dates

---

### 3.3 Supplier Management

#### 3.3.1 Supplier Database

**Supplier Profile:**
- Supplier Name
- Supplier Code (unique)
- Contact Person
- Phone Numbers (primary, secondary)
- Email Address
- Physical Address
- Website
- Tax ID/Registration Number
- Supplier Type:
  - Parts Distributor
  - Original Equipment Manufacturer (OEM)
  - Tyre Supplier
  - Fluid/Lubricant Supplier
  - General Workshop Supplies
- Payment Terms (Cash, 7 days, 30 days, 60 days)
- Preferred Supplier (Yes/No)
- Rating (1-5 stars)
- Notes
- Active Status

#### 3.3.2 Purchase Orders

**Purchase Order Creation:**
- PO Number (auto-generated)
- Supplier
- PO Date
- Expected Delivery Date
- Items:
  - Part Description
  - Part Number
  - Quantity
  - Unit Price
  - Total Price
- Subtotal
- Tax
- Total Amount
- Delivery Address
- Special Instructions
- Status (Draft, Sent, Partially Received, Received, Cancelled)

**PO Tracking:**
- Outstanding POs
- Overdue deliveries
- Received vs Ordered comparison
- Link to stock-in records

#### 3.3.3 Supplier Payment Tracking

**Payment Records:**
- Invoice Number
- Invoice Date
- Supplier
- Invoice Amount
- Payment Status:
  - Unpaid
  - Partially Paid
  - Paid
- Amount Paid
- Payment Date
- Payment Method (Cash, EFT, Cheque, Credit)
- Payment Reference
- Balance Outstanding
- Due Date
- Days Overdue

**Payment Dashboard:**
- Total outstanding to all suppliers
- Overdue payments highlighted
- Payment schedule/calendar
- Supplier balance per supplier
- Payment history

**Supplier Statements:**
- Generate supplier statement of account
- Show all transactions (purchases, payments, credits)
- Current balance
- Aging analysis (30, 60, 90+ days)

---

## 4. Integration with Existing LynkFleet Modules

### 4.1 Fleet Management Integration

**Bi-directional Data Flow:**
- Pull vehicle details from fleet registry
- Push maintenance records back to vehicle profiles
- Update vehicle status (In Service, Under Repair, Available)
- Track vehicle downtime and availability

**Compliance Integration:**
- Roadworthy certificate upload to workshop module
- Automatic compliance alerts in fleet dashboard
- Service history required for license renewals

### 4.2 Trip Management Integration

**Pre-trip & Post-trip Maintenance:**
- Flag vehicles requiring service before next trip
- Automatic service bookings post-trip
- Breakdown reports linked to workshop repairs
- Trip-related damage claims

**Cost Tracking:**
- Maintenance costs per trip
- Breakdown costs during trips
- Repair costs vs trip revenue analysis

### 4.3 Financial Integration

**Accounting Links:**
- Workshop expenses feed into cost tracking
- Supplier payment tracking
- Parts cost allocation to vehicles
- Labor cost tracking
- Workshop profitability analysis

---

## 5. User Interface Design

### 5.1 Dashboard Views

#### Workshop Overview Dashboard
- Active jobs (vehicles currently in workshop)
- Vehicles awaiting service
- Parts stock alerts (low/out of stock)
- Outstanding supplier payments
- This week's scheduled services
- Urgent repairs needed
- Quick stats:
  - Total vehicles serviced this month
  - Total parts used (value)
  - Workshop revenue
  - Average service time

#### Inventory Dashboard
- Stock level summary
- Recent stock movements
- Top 10 most used parts
- Stock value breakdown
- Reorder list (items below minimum)
- Stock expiry alerts

#### Vehicle Logbook Dashboard (per vehicle)
- Service history timeline
- Upcoming services
- Current issues/open jobs
- Cost summary
- Parts replacement schedule
- Health score

### 5.2 Key Screens

**Stock Management Screen:**
- Grid view of all parts
- Filters (category, supplier, stock level)
- Search functionality
- Quick actions (Stock In, Stock Out, Adjust)
- Export to CSV

**Service Entry Screen:**
- Vehicle selection
- Service details form
- Parts selector (search and add)
- Labor entry
- Photo upload
- Cost calculator
- Save and complete workflow

**Supplier Management Screen:**
- Supplier list
- Supplier details
- Outstanding payments
- Purchase order history
- Add/edit supplier

**Vehicle Logbook Screen:**
- Vehicle selector
- Complete service history
- Service details modal
- Document viewer
- Print logbook option

---

## 6. Reports & Analytics

### 6.1 Workshop Reports

**Service Reports:**
- Services completed (by date range)
- Services by vehicle
- Services by type
- Services by technician
- Average service time
- Service costs breakdown

**Parts Reports:**
- Parts usage report (by date, vehicle, category)
- Parts cost analysis
- Stock movement report
- Dead stock report
- Stock valuation report
- Reorder report

**Vehicle Reports:**
- Maintenance cost per vehicle
- Cost per kilometer
- Downtime analysis
- Service frequency
- Most problematic vehicles
- Parts consumption per vehicle

**Supplier Reports:**
- Purchases by supplier
- Outstanding payments report
- Supplier performance (delivery time, quality)
- Payment history report

**Financial Reports:**
- Workshop profit/loss
- Labor vs parts ratio
- Revenue by service type
- Cost trends over time

### 6.2 Scheduled Reports

- Weekly stock level report (email)
- Monthly workshop summary
- Quarterly vehicle maintenance overview
- Annual supplier performance review

---

## 7. Mobile Features

### 7.1 Mobile App Functionality

**For Mechanics:**
- Record service work on mobile
- Take photos and upload
- View assigned jobs
- Mark jobs as complete
- Request parts from inventory
- Clock in/out on jobs

**For Supervisors:**
- Approve service requests
- View workshop capacity
- Assign jobs to mechanics
- Review completed work
- Emergency authorization

---

## 8. Advanced Features (Optional/Future)

### 8.1 Predictive Maintenance
- Machine learning to predict part failures
- Service scheduling optimization
- Parts demand forecasting
- Preventive maintenance recommendations

### 8.2 Warranty Tracking
- Track parts under warranty
- Warranty claim management
- Automatic alerts before warranty expiry

### 8.3 Quality Control
- Service quality checklist
- Customer satisfaction ratings
- Rework tracking
- Common issues database

### 8.4 External Workshop Integration
- Track services done at third-party workshops
- Cost comparison (in-house vs external)
- External workshop ratings

### 8.5 Parts Marketplace
- Price comparison across suppliers
- Alternative parts suggestions
- Bulk purchase recommendations
- Supplier bidding system

---

## 9. Technical Specifications

### 9.1 Database Schema Overview

**Main Tables:**
1. `parts_inventory` - All parts catalog
2. `stock_movements` - All stock in/out transactions
3. `suppliers` - Supplier database
4. `purchase_orders` - PO tracking
5. `supplier_invoices` - Invoice and payment tracking
6. `service_records` - Vehicle service entries
7. `service_parts` - Junction table linking services to parts used
8. `vehicle_logbook` - Compiled logbook entries per vehicle
9. `mechanics` - Technician database
10. `workshop_labor` - Labor time tracking

### 9.2 API Endpoints

**Inventory:**
- `GET /api/inventory` - List all parts
- `POST /api/inventory` - Add new part
- `PUT /api/inventory/:id` - Update part
- `GET /api/inventory/:id/movements` - Stock movement history
- `POST /api/inventory/stock-in` - Record stock received
- `POST /api/inventory/stock-out` - Record stock used

**Service Records:**
- `GET /api/services` - List services
- `POST /api/services` - Create service record
- `GET /api/services/:id` - Service details
- `PUT /api/services/:id` - Update service
- `GET /api/vehicles/:id/logbook` - Vehicle service history

**Suppliers:**
- `GET /api/suppliers` - List suppliers
- `POST /api/suppliers` - Add supplier
- `GET /api/suppliers/:id/payments` - Payment status
- `POST /api/suppliers/:id/payment` - Record payment

### 9.3 Security & Permissions

**Role-Based Access:**
- Workshop Manager (full access)
- Mechanic (limited to assigned jobs)
- Parts Manager (inventory focused)
- Fleet Owner (read-only reports)
- Accountant (payment access)

**Audit Trail:**
- All stock adjustments logged
- Service record changes tracked
- Payment records immutable
- User activity logs

---

## 10. Implementation Roadmap

### Phase 1 (Weeks 1-2): Core Inventory
- Parts catalog setup
- Stock in/out functionality
- Basic stock alerts
- Inventory dashboard

### Phase 2 (Weeks 3-4): Vehicle Logbook
- Service record creation
- Parts usage linking
- Vehicle logbook view
- Service reminders

### Phase 3 (Weeks 5-6): Supplier Management
- Supplier database
- Payment tracking (simple yes/no)
- Purchase orders
- Supplier reports

### Phase 4 (Weeks 7-8): Integration & Reports
- Fleet module integration
- Financial reporting
- Mobile app features
- Advanced analytics

### Phase 5 (Weeks 9-10): Testing & Polish
- User acceptance testing
- Bug fixes
- Performance optimization
- Documentation

---

## 11. User Stories

### US-WS-01: Stock Parts Manager
**As a** Parts Manager  
**I want to** record new parts received from suppliers  
**So that** the inventory is always up to date and accurate

**Acceptance Criteria:**
- Can enter multiple parts in one stock-in transaction
- Must link to supplier
- Must enter quantity and cost
- System auto-updates stock levels
- Can attach invoice/receipt
- Generates stock-in receipt

### US-WS-02: Service Mechanic
**As a** Mechanic  
**I want to** create a service record and add parts used  
**So that** vehicle maintenance is properly documented

**Acceptance Criteria:**
- Can select vehicle from dropdown
- Can enter odometer reading
- Can search and add parts from inventory
- System auto-deducts parts from stock
- Can upload photos
- Can record labor hours
- Can mark service as complete

### US-WS-03: Fleet Owner Reports
**As a** Fleet Owner  
**I want to** view each vehicle's complete maintenance history  
**So that** I can see maintenance costs and make informed decisions

**Acceptance Criteria:**
- Shows chronological service history
- Shows total maintenance cost
- Shows cost per kilometer
- Can filter by date range
- Can export to PDF
- Shows upcoming services

### US-WS-04: Accountant Payment Tracking
**As an** Accountant  
**I want to** see which supplier invoices are paid and unpaid  
**So that** I can manage cash flow and supplier relationships

**Acceptance Criteria:**
- Shows all supplier invoices
- Clear paid/unpaid status
- Shows outstanding amount
- Can mark invoice as paid
- Shows payment history
- Can filter by supplier

### US-WS-05: Workshop Manager Alerts
**As a** Workshop Manager  
**I want to** receive alerts when parts are running low  
**So that** I can reorder before we run out

**Acceptance Criteria:**
- Dashboard shows low-stock items
- Email alerts for critical items
- Shows reorder quantity recommendation
- Can trigger purchase order from alert
- Shows lead time per supplier

---

## 12. Sample Workflows

### Workflow 1: Scheduled Service
1. System generates reminder (vehicle due for service)
2. Workshop Manager schedules service
3. Vehicle brought into workshop
4. Mechanic creates service record
5. Mechanic adds parts used (auto-deducted from stock)
6. Mechanic records labor hours
7. Photos taken and uploaded
8. Service marked complete
9. Service cost calculated automatically
10. Vehicle logbook updated
11. Vehicle status changed to "Available"
12. Fleet dashboard shows completed service

### Workflow 2: Emergency Breakdown Repair
1. Driver reports breakdown during trip
2. Workshop creates urgent service record
3. Parts checked in inventory
4. If parts missing, emergency purchase order created
5. Parts received and entered as stock-in
6. Parts used in repair (linked to supplier)
7. Supplier invoice entered (marked as unpaid)
8. Service completed
9. Cost added to trip expenses
10. Supplier payment scheduled

### Workflow 3: Supplier Payment Process
1. Supplier delivers parts with invoice
2. Parts entered as stock-in, linked to invoice
3. Invoice recorded in system (unpaid status)
4. Invoice visible on accountant's payment dashboard
5. Accountant verifies invoice against delivery
6. Payment approved and made
7. Payment details entered in system
8. Invoice status changed to "Paid"
9. Payment reflected in supplier statement

---

## 13. Key Performance Indicators (KPIs)

### Workshop Efficiency
- Average service completion time
- Workshop utilization rate
- Jobs completed per mechanic
- First-time fix rate
- Rework percentage

### Cost Management
- Maintenance cost per vehicle per month
- Maintenance cost per kilometer
- Parts cost vs labor cost ratio
- Workshop profitability
- Cost savings through preventive maintenance

### Inventory Management
- Stock turnover rate
- Dead stock percentage
- Stock-out frequency
- Average stock holding value
- Reorder accuracy

### Supplier Performance
- On-time delivery rate
- Part quality (return rate)
- Average delivery lead time
- Payment terms compliance
- Price competitiveness

---

## 14. FAQs & Business Rules

### Stock Management Rules
- **Can parts be negative?** No, system prevents stock-out if quantity unavailable
- **Manual adjustments?** Require manager approval and reason
- **Part return?** Use stock-in with "Return" transaction type
- **Damaged parts?** Record as adjustment with "Damaged" reason

### Service Record Rules
- **Can edit completed service?** Yes, but creates audit log
- **Delete service?** Only draft services; completed services archived only
- **Parts from external supplier?** Mark as "Direct Purchase" in service record
- **Free warranty work?** Mark labor cost as R0, flag as warranty

### Payment Rules
- **Partial payments?** Supported, status shows "Partially Paid"
- **Overpayment?** Creates credit note for next purchase
- **Cash discount?** Enter actual amount paid
- **Payment method?** Track for accounting reconciliation

---

## 15. Success Metrics

### 6 Months Post-Launch Targets
- 100% of services digitally recorded
- 95% inventory accuracy
- Zero critical stockouts
- 80% supplier payments on time
- 50% reduction in manual paperwork
- 30% improvement in maintenance cost visibility
- 20% reduction in vehicle downtime

---

## 16. Pricing Impact on LynkFleet Plans

### Suggested Module Pricing

**Bronze Plan Enhancement:**
- Garage module: +R100/month
- Basic inventory (up to 50 parts)
- Service records for 3 trucks
- 1 supplier tracking

**Silver Plan Enhancement:**
- Garage module: +R200/month
- Full inventory (up to 500 parts)
- Service records for 10 trucks
- Up to 10 suppliers
- Basic reports

**Gold Plan Enhancement:**
- Garage module: +R350/month
- Unlimited inventory
- Service records for 25 trucks
- Unlimited suppliers
- Advanced analytics
- Predictive maintenance alerts

**Enterprise:**
- Custom pricing based on fleet size
- Multi-workshop support
- API access for external systems

---

## 17. Conclusion

The Garage Workshop Module completes the LynkFleet ecosystem by bringing maintenance and inventory management under one roof. This creates a truly comprehensive fleet management solution where:

1. **Fleet operators** can see real-time vehicle health and plan maintenance
2. **Workshop managers** can efficiently manage jobs and inventory
3. **Accountants** have clear visibility of maintenance costs and supplier payments
4. **Owners** get complete cost analysis and profitability insights

The module's seamless integration with existing trip and fleet management means LynkFleet becomes the single source of truth for all fleet operations—from booking a trip to fueling, tracking, servicing, and invoicing.

**Key Differentiator:** Unlike standalone garage management systems, this module understands the unique challenges of long-haul trucking operations and ties maintenance directly to trip performance and profitability.

---

## 18. Next Steps

1. **Review and refine** this specification with stakeholders
2. **Prioritize features** for MVP vs future releases
3. **Design database schema** and relationships
4. **Create wireframes** for key screens
5. **Develop API specifications** for integration
6. **Plan user training** and onboarding materials
7. **Set implementation timeline** and milestones

---

**Document Version:** 1.0  
**Date:** January 2026  
**Status:** Draft for Review  
**Author:** LynkFleet Development Team
