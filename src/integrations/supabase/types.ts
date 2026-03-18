export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          alert_type: string
          company_id: string
          created_at: string
          description: string | null
          id: string
          is_read: boolean
          is_resolved: boolean
          module: string
          reference_id: string | null
          reference_type: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          title: string
        }
        Insert: {
          alert_type: string
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_read?: boolean
          is_resolved?: boolean
          module: string
          reference_id?: string | null
          reference_type?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title: string
        }
        Update: {
          alert_type?: string
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_read?: boolean
          is_resolved?: boolean
          module?: string
          reference_id?: string | null
          reference_type?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          changes: Json | null
          company_id: string
          created_at: string
          id: string
          ip_address: string | null
          module: string
          record_id: string | null
          record_type: string
          session_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          changes?: Json | null
          company_id: string
          created_at?: string
          id?: string
          ip_address?: string | null
          module: string
          record_id?: string | null
          record_type: string
          session_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          changes?: Json | null
          company_id?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          module?: string
          record_id?: string | null
          record_type?: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          company_id: string
          company_name: string
          contact_person: string
          created_at: string
          credit_limit_usd: number | null
          email: string | null
          id: string
          is_deleted: boolean
          notes: string | null
          payment_terms_days: number
          phone: string
          physical_address: string | null
          trading_name: string | null
          vat_number: string | null
          vat_treatment: Database["public"]["Enums"]["vat_treatment"]
        }
        Insert: {
          company_id: string
          company_name: string
          contact_person: string
          created_at?: string
          credit_limit_usd?: number | null
          email?: string | null
          id?: string
          is_deleted?: boolean
          notes?: string | null
          payment_terms_days?: number
          phone: string
          physical_address?: string | null
          trading_name?: string | null
          vat_number?: string | null
          vat_treatment?: Database["public"]["Enums"]["vat_treatment"]
        }
        Update: {
          company_id?: string
          company_name?: string
          contact_person?: string
          created_at?: string
          credit_limit_usd?: number | null
          email?: string | null
          id?: string
          is_deleted?: boolean
          notes?: string | null
          payment_terms_days?: number
          phone?: string
          physical_address?: string | null
          trading_name?: string | null
          vat_number?: string | null
          vat_treatment?: Database["public"]["Enums"]["vat_treatment"]
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      common_faults: {
        Row: {
          category: string
          company_id: string
          created_at: string
          description: string
          id: string
          is_active: boolean
          sort_order: number
        }
        Insert: {
          category: string
          company_id: string
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          sort_order?: number
        }
        Update: {
          category?: string
          company_id?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "common_faults_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"]
          company_name: string
          country: string
          created_at: string
          date_format: string
          default_fuel_variance_threshold: number
          default_payment_terms: number
          default_terrain_allowance: number
          email: string
          financial_year_start: number
          founding_fleet: boolean
          founding_fleet_free_months_remaining: number | null
          fuel_mode: Database["public"]["Enums"]["fuel_mode"]
          grn_next_sequence: number
          grn_prefix: string
          id: string
          inspection_timing: Database["public"]["Enums"]["inspection_timing"]
          invoice_layout: Database["public"]["Enums"]["invoice_layout"]
          invoice_next_sequence: number
          invoice_prefix: string
          invoice_primary_colour: string | null
          invoice_secondary_colour: string | null
          jc_next_sequence: number
          jc_prefix: string
          logo_url: string | null
          phone: string
          physical_address: string
          po_approval_threshold_high: number
          po_approval_threshold_low: number
          po_next_sequence: number
          po_prefix: string
          registration_number: string | null
          timezone: string
          trading_name: string | null
          trial_ends_at: string | null
          trip_next_sequence: number
          trip_prefix: string
          updated_at: string
          vat_number: string | null
          vat_rate: number
          vat_registered: boolean
          zimra_bp_number: string | null
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"]
          company_name: string
          country?: string
          created_at?: string
          date_format?: string
          default_fuel_variance_threshold?: number
          default_payment_terms?: number
          default_terrain_allowance?: number
          email: string
          financial_year_start?: number
          founding_fleet?: boolean
          founding_fleet_free_months_remaining?: number | null
          fuel_mode?: Database["public"]["Enums"]["fuel_mode"]
          grn_next_sequence?: number
          grn_prefix?: string
          id?: string
          inspection_timing?: Database["public"]["Enums"]["inspection_timing"]
          invoice_layout?: Database["public"]["Enums"]["invoice_layout"]
          invoice_next_sequence?: number
          invoice_prefix?: string
          invoice_primary_colour?: string | null
          invoice_secondary_colour?: string | null
          jc_next_sequence?: number
          jc_prefix?: string
          logo_url?: string | null
          phone?: string
          physical_address?: string
          po_approval_threshold_high?: number
          po_approval_threshold_low?: number
          po_next_sequence?: number
          po_prefix?: string
          registration_number?: string | null
          timezone?: string
          trading_name?: string | null
          trial_ends_at?: string | null
          trip_next_sequence?: number
          trip_prefix?: string
          updated_at?: string
          vat_number?: string | null
          vat_rate?: number
          vat_registered?: boolean
          zimra_bp_number?: string | null
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"]
          company_name?: string
          country?: string
          created_at?: string
          date_format?: string
          default_fuel_variance_threshold?: number
          default_payment_terms?: number
          default_terrain_allowance?: number
          email?: string
          financial_year_start?: number
          founding_fleet?: boolean
          founding_fleet_free_months_remaining?: number | null
          fuel_mode?: Database["public"]["Enums"]["fuel_mode"]
          grn_next_sequence?: number
          grn_prefix?: string
          id?: string
          inspection_timing?: Database["public"]["Enums"]["inspection_timing"]
          invoice_layout?: Database["public"]["Enums"]["invoice_layout"]
          invoice_next_sequence?: number
          invoice_prefix?: string
          invoice_primary_colour?: string | null
          invoice_secondary_colour?: string | null
          jc_next_sequence?: number
          jc_prefix?: string
          logo_url?: string | null
          phone?: string
          physical_address?: string
          po_approval_threshold_high?: number
          po_approval_threshold_low?: number
          po_next_sequence?: number
          po_prefix?: string
          registration_number?: string | null
          timezone?: string
          trading_name?: string | null
          trial_ends_at?: string | null
          trip_next_sequence?: number
          trip_prefix?: string
          updated_at?: string
          vat_number?: string | null
          vat_rate?: number
          vat_registered?: boolean
          zimra_bp_number?: string | null
        }
        Relationships: []
      }
      compliance_documents: {
        Row: {
          company_id: string
          created_at: string
          document_category: string
          document_number: string | null
          document_type: string
          expiry_date: string
          file_url: string | null
          id: string
          is_deleted: boolean
          issue_date: string | null
          notes: string | null
          reference_id: string
          reference_type: string
          status: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          document_category?: string
          document_number?: string | null
          document_type: string
          expiry_date: string
          file_url?: string | null
          id?: string
          is_deleted?: boolean
          issue_date?: string | null
          notes?: string | null
          reference_id: string
          reference_type?: string
          status?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          document_category?: string
          document_number?: string | null
          document_type?: string
          expiry_date?: string
          file_url?: string | null
          id?: string
          is_deleted?: boolean
          issue_date?: string | null
          notes?: string | null
          reference_id?: string
          reference_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_centres: {
        Row: {
          company_id: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          reference_id: string | null
          type: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          reference_id?: string | null
          type?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          reference_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "cost_centres_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      disciplinary_records: {
        Row: {
          action_taken: string | null
          category: string
          company_id: string
          created_at: string
          created_by: string | null
          description: string
          employee_id: string
          id: string
          incident_date: string
        }
        Insert: {
          action_taken?: string | null
          category: string
          company_id: string
          created_at?: string
          created_by?: string | null
          description: string
          employee_id: string
          id?: string
          incident_date?: string
        }
        Update: {
          action_taken?: string | null
          category?: string
          company_id?: string
          created_at?: string
          created_by?: string | null
          description?: string
          employee_id?: string
          id?: string
          incident_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "disciplinary_records_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disciplinary_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          bank_account_number: string | null
          bank_name: string | null
          basic_salary_usd: number | null
          branch_code: string | null
          company_id: string
          created_at: string
          date_of_birth: string | null
          department: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employment_type: string
          full_name: string
          id: string
          id_number: string | null
          is_deleted: boolean
          is_driver: boolean
          job_title: string | null
          notes: string | null
          passport_number: string | null
          phone: string | null
          start_date: string | null
        }
        Insert: {
          bank_account_number?: string | null
          bank_name?: string | null
          basic_salary_usd?: number | null
          branch_code?: string | null
          company_id: string
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employment_type?: string
          full_name: string
          id?: string
          id_number?: string | null
          is_deleted?: boolean
          is_driver?: boolean
          job_title?: string | null
          notes?: string | null
          passport_number?: string | null
          phone?: string | null
          start_date?: string | null
        }
        Update: {
          bank_account_number?: string | null
          bank_name?: string | null
          basic_salary_usd?: number | null
          branch_code?: string | null
          company_id?: string
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employment_type?: string
          full_name?: string
          id?: string
          id_number?: string | null
          is_deleted?: boolean
          is_driver?: boolean
          job_title?: string | null
          notes?: string | null
          passport_number?: string | null
          phone?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_events: {
        Row: {
          amount_usd: number
          company_id: string
          cost_centre_id: string | null
          created_at: string
          created_by: string | null
          credit_account: string
          debit_account: string
          description: string
          event_date: string
          event_type: string
          id: string
          is_reversal: boolean
          reference_id: string | null
          reference_type: string | null
          reversal_of: string | null
        }
        Insert: {
          amount_usd: number
          company_id: string
          cost_centre_id?: string | null
          created_at?: string
          created_by?: string | null
          credit_account: string
          debit_account: string
          description: string
          event_date?: string
          event_type: string
          id?: string
          is_reversal?: boolean
          reference_id?: string | null
          reference_type?: string | null
          reversal_of?: string | null
        }
        Update: {
          amount_usd?: number
          company_id?: string
          cost_centre_id?: string | null
          created_at?: string
          created_by?: string | null
          credit_account?: string
          debit_account?: string
          description?: string
          event_date?: string
          event_type?: string
          id?: string
          is_reversal?: boolean
          reference_id?: string | null
          reference_type?: string | null
          reversal_of?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_events_cost_centre_id_fkey"
            columns: ["cost_centre_id"]
            isOneToOne: false
            referencedRelation: "cost_centres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_events_reversal_of_fkey"
            columns: ["reversal_of"]
            isOneToOne: false
            referencedRelation: "financial_events"
            referencedColumns: ["id"]
          },
        ]
      }
      founding_applications: {
        Row: {
          company_name: string
          country: string
          created_at: string
          email: string
          full_name: string
          id: string
          source: string
          trucks: string
        }
        Insert: {
          company_name: string
          country: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          source?: string
          trucks: string
        }
        Update: {
          company_name?: string
          country?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          source?: string
          trucks?: string
        }
        Relationships: []
      }
      fuel_anomalies: {
        Row: {
          actual_litres: number
          company_id: string
          created_at: string
          expected_litres: number
          id: string
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          threshold_percent: number
          trip_id: string
          truck_id: string
          variance_percent: number
        }
        Insert: {
          actual_litres: number
          company_id: string
          created_at?: string
          expected_litres: number
          id?: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          threshold_percent: number
          trip_id: string
          truck_id: string
          variance_percent: number
        }
        Update: {
          actual_litres?: number
          company_id?: string
          created_at?: string
          expected_litres?: number
          id?: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          threshold_percent?: number
          trip_id?: string
          truck_id?: string
          variance_percent?: number
        }
        Relationships: [
          {
            foreignKeyName: "fuel_anomalies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_anomalies_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_anomalies_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_transactions: {
        Row: {
          authorised_by: string | null
          company_id: string
          cost_centre_id: string | null
          created_at: string
          created_by: string | null
          how_paid: Database["public"]["Enums"]["how_paid"]
          id: string
          litres: number
          non_trip_purpose:
            | Database["public"]["Enums"]["non_trip_purpose"]
            | null
          posted_to_accounts: boolean
          price_per_litre_usd: number
          slip_url: string | null
          supplier_id: string | null
          total_cost_usd: number
          transaction_date: string
          transaction_type: Database["public"]["Enums"]["fuel_transaction_type"]
          trip_id: string | null
          truck_id: string
          zig_reference_amount: number | null
        }
        Insert: {
          authorised_by?: string | null
          company_id: string
          cost_centre_id?: string | null
          created_at?: string
          created_by?: string | null
          how_paid?: Database["public"]["Enums"]["how_paid"]
          id?: string
          litres: number
          non_trip_purpose?:
            | Database["public"]["Enums"]["non_trip_purpose"]
            | null
          posted_to_accounts?: boolean
          price_per_litre_usd: number
          slip_url?: string | null
          supplier_id?: string | null
          total_cost_usd: number
          transaction_date?: string
          transaction_type: Database["public"]["Enums"]["fuel_transaction_type"]
          trip_id?: string | null
          truck_id: string
          zig_reference_amount?: number | null
        }
        Update: {
          authorised_by?: string | null
          company_id?: string
          cost_centre_id?: string | null
          created_at?: string
          created_by?: string | null
          how_paid?: Database["public"]["Enums"]["how_paid"]
          id?: string
          litres?: number
          non_trip_purpose?:
            | Database["public"]["Enums"]["non_trip_purpose"]
            | null
          posted_to_accounts?: boolean
          price_per_litre_usd?: number
          slip_url?: string | null
          supplier_id?: string | null
          total_cost_usd?: number
          transaction_date?: string
          transaction_type?: Database["public"]["Enums"]["fuel_transaction_type"]
          trip_id?: string | null
          truck_id?: string
          zig_reference_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fuel_transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_transactions_cost_centre_id_fkey"
            columns: ["cost_centre_id"]
            isOneToOne: false
            referencedRelation: "cost_centres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_transactions_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_transactions_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_transactions_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      goods_received_notes: {
        Row: {
          company_id: string
          confirmed: boolean
          created_at: string
          created_by: string | null
          grn_number: string
          how_paid: Database["public"]["Enums"]["how_paid"]
          id: string
          notes: string | null
          po_id: string | null
          received_date: string
          reference: string | null
          supplier_id: string
          total_cost_usd: number
        }
        Insert: {
          company_id: string
          confirmed?: boolean
          created_at?: string
          created_by?: string | null
          grn_number: string
          how_paid?: Database["public"]["Enums"]["how_paid"]
          id?: string
          notes?: string | null
          po_id?: string | null
          received_date?: string
          reference?: string | null
          supplier_id: string
          total_cost_usd?: number
        }
        Update: {
          company_id?: string
          confirmed?: boolean
          created_at?: string
          created_by?: string | null
          grn_number?: string
          how_paid?: Database["public"]["Enums"]["how_paid"]
          id?: string
          notes?: string | null
          po_id?: string | null
          received_date?: string
          reference?: string | null
          supplier_id?: string
          total_cost_usd?: number
        }
        Relationships: [
          {
            foreignKeyName: "goods_received_notes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goods_received_notes_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goods_received_notes_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      grn_lines: {
        Row: {
          company_id: string
          created_at: string
          grn_id: string
          id: string
          part_id: string
          quantity: number
          total_usd: number
          unit_cost_usd: number
        }
        Insert: {
          company_id: string
          created_at?: string
          grn_id: string
          id?: string
          part_id: string
          quantity: number
          total_usd: number
          unit_cost_usd: number
        }
        Update: {
          company_id?: string
          created_at?: string
          grn_id?: string
          id?: string
          part_id?: string
          quantity?: number
          total_usd?: number
          unit_cost_usd?: number
        }
        Relationships: [
          {
            foreignKeyName: "grn_lines_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grn_lines_grn_id_fkey"
            columns: ["grn_id"]
            isOneToOne: false
            referencedRelation: "goods_received_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grn_lines_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts_catalogue"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_items: {
        Row: {
          company_id: string
          created_at: string
          id: string
          inspection_id: string
          item_name: string
          notes: string | null
          result: string
          section: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          inspection_id: string
          item_name: string
          notes?: string | null
          result?: string
          section: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          inspection_id?: string
          item_name?: string
          notes?: string | null
          result?: string
          section?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_items_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "vehicle_inspections"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_templates: {
        Row: {
          company_id: string
          created_at: string
          id: string
          is_active: boolean
          item_name: string
          section_name: string
          sort_order: number
          template_type: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          item_name: string
          section_name: string
          sort_order?: number
          template_type?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          item_name?: string
          section_name?: string
          sort_order?: number
          template_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_outstanding_usd: number
          amount_paid_usd: number
          client_id: string
          company_id: string
          created_at: string
          created_by: string | null
          due_date: string
          id: string
          invoice_date: string
          invoice_number: string
          is_voided: boolean
          layout_used: Database["public"]["Enums"]["invoice_layout"]
          notes: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal_usd: number
          total_usd: number
          trip_id: string
          vat_amount_usd: number
        }
        Insert: {
          amount_outstanding_usd: number
          amount_paid_usd?: number
          client_id: string
          company_id: string
          created_at?: string
          created_by?: string | null
          due_date: string
          id?: string
          invoice_date?: string
          invoice_number: string
          is_voided?: boolean
          layout_used?: Database["public"]["Enums"]["invoice_layout"]
          notes?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal_usd: number
          total_usd: number
          trip_id: string
          vat_amount_usd?: number
        }
        Update: {
          amount_outstanding_usd?: number
          amount_paid_usd?: number
          client_id?: string
          company_id?: string
          created_at?: string
          created_by?: string | null
          due_date?: string
          id?: string
          invoice_date?: string
          invoice_number?: string
          is_voided?: boolean
          layout_used?: Database["public"]["Enums"]["invoice_layout"]
          notes?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal_usd?: number
          total_usd?: number
          trip_id?: string
          vat_amount_usd?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: true
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      job_card_labour: {
        Row: {
          company_id: string
          created_at: string
          hours: number | null
          how_paid: Database["public"]["Enums"]["how_paid"] | null
          id: string
          job_card_id: string
          labour_type: string
          mechanic_name: string | null
          notes: string | null
          reference: string | null
          sublet_cost_usd: number | null
          sublet_invoice_number: string | null
          sublet_invoice_url: string | null
          sublet_workshop_name: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          hours?: number | null
          how_paid?: Database["public"]["Enums"]["how_paid"] | null
          id?: string
          job_card_id: string
          labour_type?: string
          mechanic_name?: string | null
          notes?: string | null
          reference?: string | null
          sublet_cost_usd?: number | null
          sublet_invoice_number?: string | null
          sublet_invoice_url?: string | null
          sublet_workshop_name?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          hours?: number | null
          how_paid?: Database["public"]["Enums"]["how_paid"] | null
          id?: string
          job_card_id?: string
          labour_type?: string
          mechanic_name?: string | null
          notes?: string | null
          reference?: string | null
          sublet_cost_usd?: number | null
          sublet_invoice_number?: string | null
          sublet_invoice_url?: string | null
          sublet_workshop_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_card_labour_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_card_labour_job_card_id_fkey"
            columns: ["job_card_id"]
            isOneToOne: false
            referencedRelation: "job_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      job_card_works: {
        Row: {
          assigned_to: string | null
          company_id: string
          created_at: string
          description: string
          fault_category: string | null
          id: string
          job_card_id: string
          notes: string | null
          status: string
        }
        Insert: {
          assigned_to?: string | null
          company_id: string
          created_at?: string
          description: string
          fault_category?: string | null
          id?: string
          job_card_id: string
          notes?: string | null
          status?: string
        }
        Update: {
          assigned_to?: string | null
          company_id?: string
          created_at?: string
          description?: string
          fault_category?: string | null
          id?: string
          job_card_id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_card_works_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_card_works_job_card_id_fkey"
            columns: ["job_card_id"]
            isOneToOne: false
            referencedRelation: "job_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      job_cards: {
        Row: {
          assigned_to: Database["public"]["Enums"]["assigned_to_type"]
          closed_at: string | null
          company_id: string
          cost_centre_id: string | null
          created_by: string | null
          description: string | null
          id: string
          is_deleted: boolean
          job_card_number: string
          job_source: Database["public"]["Enums"]["job_source"]
          job_type: Database["public"]["Enums"]["job_type"]
          opened_at: string
          status: Database["public"]["Enums"]["job_card_status"]
          sublet_cost_usd: number | null
          sublet_invoice_number: string | null
          sublet_invoice_url: string | null
          sublet_supplier_id: string | null
          total_parts_cost_usd: number
          trip_id: string | null
          truck_id: string
        }
        Insert: {
          assigned_to?: Database["public"]["Enums"]["assigned_to_type"]
          closed_at?: string | null
          company_id: string
          cost_centre_id?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_deleted?: boolean
          job_card_number: string
          job_source?: Database["public"]["Enums"]["job_source"]
          job_type?: Database["public"]["Enums"]["job_type"]
          opened_at?: string
          status?: Database["public"]["Enums"]["job_card_status"]
          sublet_cost_usd?: number | null
          sublet_invoice_number?: string | null
          sublet_invoice_url?: string | null
          sublet_supplier_id?: string | null
          total_parts_cost_usd?: number
          trip_id?: string | null
          truck_id: string
        }
        Update: {
          assigned_to?: Database["public"]["Enums"]["assigned_to_type"]
          closed_at?: string | null
          company_id?: string
          cost_centre_id?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_deleted?: boolean
          job_card_number?: string
          job_source?: Database["public"]["Enums"]["job_source"]
          job_type?: Database["public"]["Enums"]["job_type"]
          opened_at?: string
          status?: Database["public"]["Enums"]["job_card_status"]
          sublet_cost_usd?: number | null
          sublet_invoice_number?: string | null
          sublet_invoice_url?: string | null
          sublet_supplier_id?: string | null
          total_parts_cost_usd?: number
          trip_id?: string | null
          truck_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_cards_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_cards_cost_centre_id_fkey"
            columns: ["cost_centre_id"]
            isOneToOne: false
            referencedRelation: "cost_centres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_cards_sublet_supplier_id_fkey"
            columns: ["sublet_supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_cards_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_cards_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      non_trip_movements: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          destination: string
          distance_km: number
          driver_id: string | null
          id: string
          movement_date: string
          notes: string | null
          origin: string
          purpose: Database["public"]["Enums"]["movement_purpose"]
          truck_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          destination: string
          distance_km: number
          driver_id?: string | null
          id?: string
          movement_date?: string
          notes?: string | null
          origin: string
          purpose?: Database["public"]["Enums"]["movement_purpose"]
          truck_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          destination?: string
          distance_km?: number
          driver_id?: string | null
          id?: string
          movement_date?: string
          notes?: string | null
          origin?: string
          purpose?: Database["public"]["Enums"]["movement_purpose"]
          truck_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "non_trip_movements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "non_trip_movements_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "non_trip_movements_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      parts_catalogue: {
        Row: {
          category: string | null
          company_id: string
          created_at: string
          current_stock: number
          default_supplier_id: string | null
          disposal_method: string
          id: string
          is_deleted: boolean
          min_stock_threshold: number
          name: string
          part_number: string
          reorder_quantity: number
          unit_of_measure: string
          weighted_avg_cost: number
        }
        Insert: {
          category?: string | null
          company_id: string
          created_at?: string
          current_stock?: number
          default_supplier_id?: string | null
          disposal_method?: string
          id?: string
          is_deleted?: boolean
          min_stock_threshold?: number
          name: string
          part_number: string
          reorder_quantity?: number
          unit_of_measure?: string
          weighted_avg_cost?: number
        }
        Update: {
          category?: string | null
          company_id?: string
          created_at?: string
          current_stock?: number
          default_supplier_id?: string | null
          disposal_method?: string
          id?: string
          is_deleted?: boolean
          min_stock_threshold?: number
          name?: string
          part_number?: string
          reorder_quantity?: number
          unit_of_measure?: string
          weighted_avg_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "parts_catalogue_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parts_catalogue_default_supplier_id_fkey"
            columns: ["default_supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      payments_received: {
        Row: {
          amount_usd: number
          client_id: string
          company_id: string
          created_at: string
          created_by: string | null
          how_paid: Database["public"]["Enums"]["how_paid"]
          id: string
          invoice_id: string
          payment_date: string
          reference: string | null
        }
        Insert: {
          amount_usd: number
          client_id: string
          company_id: string
          created_at?: string
          created_by?: string | null
          how_paid: Database["public"]["Enums"]["how_paid"]
          id?: string
          invoice_id: string
          payment_date?: string
          reference?: string | null
        }
        Update: {
          amount_usd?: number
          client_id?: string
          company_id?: string
          created_at?: string
          created_by?: string | null
          how_paid?: Database["public"]["Enums"]["how_paid"]
          id?: string
          invoice_id?: string
          payment_date?: string
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_received_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_received_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_received_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_entries: {
        Row: {
          allowances_usd: number
          basic_salary_usd: number
          company_id: string
          created_at: string
          deductions_usd: number
          employee_id: string
          gross_pay_usd: number
          id: string
          net_pay_usd: number
          nssa_usd: number
          overtime_usd: number
          paye_usd: number
          payroll_period_id: string
          trip_bookouts_total_usd: number
        }
        Insert: {
          allowances_usd?: number
          basic_salary_usd?: number
          company_id: string
          created_at?: string
          deductions_usd?: number
          employee_id: string
          gross_pay_usd?: number
          id?: string
          net_pay_usd?: number
          nssa_usd?: number
          overtime_usd?: number
          paye_usd?: number
          payroll_period_id: string
          trip_bookouts_total_usd?: number
        }
        Update: {
          allowances_usd?: number
          basic_salary_usd?: number
          company_id?: string
          created_at?: string
          deductions_usd?: number
          employee_id?: string
          gross_pay_usd?: number
          id?: string
          net_pay_usd?: number
          nssa_usd?: number
          overtime_usd?: number
          paye_usd?: number
          payroll_period_id?: string
          trip_bookouts_total_usd?: number
        }
        Relationships: [
          {
            foreignKeyName: "payroll_entries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_entries_payroll_period_id_fkey"
            columns: ["payroll_period_id"]
            isOneToOne: false
            referencedRelation: "payroll_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_periods: {
        Row: {
          company_id: string
          created_at: string
          end_date: string
          id: string
          is_locked: boolean
          locked_at: string | null
          locked_by: string | null
          period_name: string
          start_date: string
        }
        Insert: {
          company_id: string
          created_at?: string
          end_date: string
          id?: string
          is_locked?: boolean
          locked_at?: string | null
          locked_by?: string | null
          period_name: string
          start_date: string
        }
        Update: {
          company_id?: string
          created_at?: string
          end_date?: string
          id?: string
          is_locked?: boolean
          locked_at?: string | null
          locked_by?: string | null
          period_name?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_periods_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          email: string
          first_name: string
          id: string
          is_authoriser: boolean
          last_active_at: string | null
          last_login_at: string | null
          last_name: string
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
          theme_preference: Database["public"]["Enums"]["theme_preference"]
          two_factor_enabled: boolean
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          email: string
          first_name: string
          id: string
          is_authoriser?: boolean
          last_active_at?: string | null
          last_login_at?: string | null
          last_name: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          theme_preference?: Database["public"]["Enums"]["theme_preference"]
          two_factor_enabled?: boolean
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          email?: string
          first_name?: string
          id?: string
          is_authoriser?: boolean
          last_active_at?: string | null
          last_login_at?: string | null
          last_name?: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          theme_preference?: Database["public"]["Enums"]["theme_preference"]
          two_factor_enabled?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_lines: {
        Row: {
          company_id: string
          created_at: string
          id: string
          part_id: string
          po_id: string
          quantity: number
          received_quantity: number
          total_usd: number
          unit_cost_usd: number
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          part_id: string
          po_id: string
          quantity: number
          received_quantity?: number
          total_usd: number
          unit_cost_usd: number
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          part_id?: string
          po_id?: string
          quantity?: number
          received_quantity?: number
          total_usd?: number
          unit_cost_usd?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_lines_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_lines_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts_catalogue"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_lines_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          company_id: string
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          po_number: string
          status: Database["public"]["Enums"]["po_status"]
          supplier_id: string
          total_amount_usd: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          po_number: string
          status?: Database["public"]["Enums"]["po_status"]
          supplier_id: string
          total_amount_usd?: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          po_number?: string
          status?: Database["public"]["Enums"]["po_status"]
          supplier_id?: string
          total_amount_usd?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          id: string
          movement_type: Database["public"]["Enums"]["stock_movement_type"]
          notes: string | null
          part_id: string
          quantity: number
          reference_id: string | null
          reference_type: string | null
          unit_cost_usd: number
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          movement_type: Database["public"]["Enums"]["stock_movement_type"]
          notes?: string | null
          part_id: string
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
          unit_cost_usd?: number
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          movement_type?: Database["public"]["Enums"]["stock_movement_type"]
          notes?: string | null
          part_id?: string
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          unit_cost_usd?: number
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts_catalogue"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          bank_account_number: string | null
          bank_name: string | null
          branch_code: string | null
          company_id: string
          contact_person: string
          created_at: string
          email: string | null
          id: string
          is_deleted: boolean
          notes: string | null
          payment_terms_days: number
          phone: string
          physical_address: string | null
          supplier_name: string
          vat_number: string | null
        }
        Insert: {
          bank_account_number?: string | null
          bank_name?: string | null
          branch_code?: string | null
          company_id: string
          contact_person: string
          created_at?: string
          email?: string | null
          id?: string
          is_deleted?: boolean
          notes?: string | null
          payment_terms_days?: number
          phone: string
          physical_address?: string | null
          supplier_name: string
          vat_number?: string | null
        }
        Update: {
          bank_account_number?: string | null
          bank_name?: string | null
          branch_code?: string | null
          company_id?: string
          contact_person?: string
          created_at?: string
          email?: string | null
          id?: string
          is_deleted?: boolean
          notes?: string | null
          payment_terms_days?: number
          phone?: string
          physical_address?: string | null
          supplier_name?: string
          vat_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_expenses: {
        Row: {
          amount_usd: number
          category: string
          company_id: string
          created_at: string
          created_by: string | null
          description: string | null
          expense_date: string
          how_paid: Database["public"]["Enums"]["how_paid"]
          id: string
          receipt_url: string | null
          reference: string | null
          trip_id: string
        }
        Insert: {
          amount_usd: number
          category: string
          company_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          expense_date?: string
          how_paid?: Database["public"]["Enums"]["how_paid"]
          id?: string
          receipt_url?: string | null
          reference?: string | null
          trip_id: string
        }
        Update: {
          amount_usd?: number
          category?: string
          company_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          expense_date?: string
          how_paid?: Database["public"]["Enums"]["how_paid"]
          id?: string
          receipt_url?: string | null
          reference?: string | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_expenses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_expenses_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_status_history: {
        Row: {
          changed_by: string | null
          company_id: string
          created_at: string
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["trip_status"]
          trip_id: string
        }
        Insert: {
          changed_by?: string | null
          company_id: string
          created_at?: string
          id?: string
          notes?: string | null
          status: Database["public"]["Enums"]["trip_status"]
          trip_id: string
        }
        Update: {
          changed_by?: string | null
          company_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["trip_status"]
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_status_history_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_status_history_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          bookout_border_fees_usd: number | null
          bookout_food_usd: number | null
          bookout_other_usd: number | null
          bookout_reconciled: boolean | null
          bookout_tolls_usd: number | null
          bookout_unspent_usd: number | null
          border_post: string | null
          client_id: string
          closed_at: string | null
          company_id: string
          container_number: string | null
          cost_centre_id: string | null
          created_at: string
          created_by: string | null
          destination: string
          distance_km: number
          driver_id: string
          id: string
          is_cross_border: boolean
          is_deleted: boolean
          load_status: Database["public"]["Enums"]["load_status"]
          load_type: Database["public"]["Enums"]["load_type"]
          notes: string | null
          number_of_packages: number | null
          origin: string
          package_type: string | null
          pod_exceptions: string | null
          pod_received: boolean | null
          pod_sent_to_client: boolean | null
          rate_usd: number
          seal_number: string | null
          status: Database["public"]["Enums"]["trip_status"]
          tonnage: number | null
          trailer_id: string | null
          trip_bookout_usd: number | null
          trip_number: string
          trip_type: Database["public"]["Enums"]["trip_type"]
          truck_id: string
        }
        Insert: {
          bookout_border_fees_usd?: number | null
          bookout_food_usd?: number | null
          bookout_other_usd?: number | null
          bookout_reconciled?: boolean | null
          bookout_tolls_usd?: number | null
          bookout_unspent_usd?: number | null
          border_post?: string | null
          client_id: string
          closed_at?: string | null
          company_id: string
          container_number?: string | null
          cost_centre_id?: string | null
          created_at?: string
          created_by?: string | null
          destination: string
          distance_km: number
          driver_id: string
          id?: string
          is_cross_border?: boolean
          is_deleted?: boolean
          load_status?: Database["public"]["Enums"]["load_status"]
          load_type?: Database["public"]["Enums"]["load_type"]
          notes?: string | null
          number_of_packages?: number | null
          origin: string
          package_type?: string | null
          pod_exceptions?: string | null
          pod_received?: boolean | null
          pod_sent_to_client?: boolean | null
          rate_usd: number
          seal_number?: string | null
          status?: Database["public"]["Enums"]["trip_status"]
          tonnage?: number | null
          trailer_id?: string | null
          trip_bookout_usd?: number | null
          trip_number: string
          trip_type?: Database["public"]["Enums"]["trip_type"]
          truck_id: string
        }
        Update: {
          bookout_border_fees_usd?: number | null
          bookout_food_usd?: number | null
          bookout_other_usd?: number | null
          bookout_reconciled?: boolean | null
          bookout_tolls_usd?: number | null
          bookout_unspent_usd?: number | null
          border_post?: string | null
          client_id?: string
          closed_at?: string | null
          company_id?: string
          container_number?: string | null
          cost_centre_id?: string | null
          created_at?: string
          created_by?: string | null
          destination?: string
          distance_km?: number
          driver_id?: string
          id?: string
          is_cross_border?: boolean
          is_deleted?: boolean
          load_status?: Database["public"]["Enums"]["load_status"]
          load_type?: Database["public"]["Enums"]["load_type"]
          notes?: string | null
          number_of_packages?: number | null
          origin?: string
          package_type?: string | null
          pod_exceptions?: string | null
          pod_received?: boolean | null
          pod_sent_to_client?: boolean | null
          rate_usd?: number
          seal_number?: string | null
          status?: Database["public"]["Enums"]["trip_status"]
          tonnage?: number | null
          trailer_id?: string | null
          trip_bookout_usd?: number | null
          trip_number?: string
          trip_type?: Database["public"]["Enums"]["trip_type"]
          truck_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_cost_centre_id_fkey"
            columns: ["cost_centre_id"]
            isOneToOne: false
            referencedRelation: "cost_centres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_trailer_id_fkey"
            columns: ["trailer_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      trucks: {
        Row: {
          anomaly_threshold_percent: number
          company_id: string
          cost_centre_id: string | null
          created_at: string
          current_odometer_km: number | null
          default_driver_id: string | null
          default_trailer_id: string | null
          estimated_fuel_level_litres: number
          fleet_number: string | null
          fuel_tank_capacity_litres: number | null
          id: string
          is_deleted: boolean
          km_per_litre_loaded: number | null
          km_per_litre_unloaded: number | null
          make: string | null
          model: string | null
          odometer_tracking: boolean
          registration_number: string
          status: Database["public"]["Enums"]["vehicle_status"]
          terrain_allowance_percent: number
          total_km: number
          updated_at: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          vin_number: string | null
          year: number | null
        }
        Insert: {
          anomaly_threshold_percent?: number
          company_id: string
          cost_centre_id?: string | null
          created_at?: string
          current_odometer_km?: number | null
          default_driver_id?: string | null
          default_trailer_id?: string | null
          estimated_fuel_level_litres?: number
          fleet_number?: string | null
          fuel_tank_capacity_litres?: number | null
          id?: string
          is_deleted?: boolean
          km_per_litre_loaded?: number | null
          km_per_litre_unloaded?: number | null
          make?: string | null
          model?: string | null
          odometer_tracking?: boolean
          registration_number: string
          status?: Database["public"]["Enums"]["vehicle_status"]
          terrain_allowance_percent?: number
          total_km?: number
          updated_at?: string
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
          vin_number?: string | null
          year?: number | null
        }
        Update: {
          anomaly_threshold_percent?: number
          company_id?: string
          cost_centre_id?: string | null
          created_at?: string
          current_odometer_km?: number | null
          default_driver_id?: string | null
          default_trailer_id?: string | null
          estimated_fuel_level_litres?: number
          fleet_number?: string | null
          fuel_tank_capacity_litres?: number | null
          id?: string
          is_deleted?: boolean
          km_per_litre_loaded?: number | null
          km_per_litre_unloaded?: number | null
          make?: string | null
          model?: string | null
          odometer_tracking?: boolean
          registration_number?: string
          status?: Database["public"]["Enums"]["vehicle_status"]
          terrain_allowance_percent?: number
          total_km?: number
          updated_at?: string
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
          vin_number?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_trucks_default_trailer"
            columns: ["default_trailer_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trucks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trucks_cost_centre_id_fkey"
            columns: ["cost_centre_id"]
            isOneToOne: false
            referencedRelation: "cost_centres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trucks_default_driver_id_fkey"
            columns: ["default_driver_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      tyre_records: {
        Row: {
          brand: string | null
          company_id: string
          condition: string
          created_at: string
          id: string
          installed_date: string
          notes: string | null
          position: string
          removed_date: string | null
          size: string | null
          truck_id: string
        }
        Insert: {
          brand?: string | null
          company_id: string
          condition?: string
          created_at?: string
          id?: string
          installed_date?: string
          notes?: string | null
          position: string
          removed_date?: string | null
          size?: string | null
          truck_id: string
        }
        Update: {
          brand?: string | null
          company_id?: string
          condition?: string
          created_at?: string
          id?: string
          installed_date?: string
          notes?: string | null
          position?: string
          removed_date?: string | null
          size?: string | null
          truck_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tyre_records_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tyre_records_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          company_id: string
          has_access: boolean
          id: string
          module: string
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          has_access?: boolean
          id?: string
          module: string
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          has_access?: boolean
          id?: string
          module?: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_inspections: {
        Row: {
          company_id: string
          created_at: string
          id: string
          inspection_date: string
          inspector_id: string | null
          job_card_id: string | null
          notes: string | null
          overall_result: string
          truck_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          inspection_date?: string
          inspector_id?: string | null
          job_card_id?: string | null
          notes?: string | null
          overall_result?: string
          truck_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          inspection_date?: string
          inspector_id?: string | null
          job_card_id?: string | null
          notes?: string | null
          overall_result?: string
          truck_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_inspections_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_inspections_job_card_id_fkey"
            columns: ["job_card_id"]
            isOneToOne: false
            referencedRelation: "job_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_inspections_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_company_id: { Args: never; Returns: string }
      get_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      account_status:
        | "trial"
        | "active"
        | "read_only"
        | "suspended"
        | "cancelled"
      assigned_to_type: "inhouse" | "sublet" | "both"
      fuel_mode: "company_tank" | "direct_purchase" | "hybrid"
      fuel_transaction_type: "issuance" | "delivery" | "adjustment"
      how_paid: "cash" | "bank_transfer" | "eft" | "ecocash" | "on_account"
      inspection_timing: "before_trip" | "on_workshop_entry" | "both"
      invoice_layout: "classic" | "modern" | "minimal"
      invoice_status:
        | "draft"
        | "confirmed"
        | "partially_paid"
        | "paid"
        | "overdue"
      job_card_status: "open" | "in_progress" | "pending_parts" | "closed"
      job_source:
        | "planned"
        | "breakdown"
        | "vehicle_inspection_failure"
        | "driver_reported"
        | "workshop_inspection"
      job_type: "routine_service" | "repair" | "inspection" | "accident_repair"
      load_status: "loaded" | "empty"
      load_type:
        | "bulk"
        | "containers"
        | "bags"
        | "pallets"
        | "breakbulk"
        | "livestock"
        | "hazardous"
        | "other"
      movement_purpose:
        | "empty_repositioning"
        | "depot_transfer"
        | "maintenance_run"
        | "workshop_transfer"
        | "yard_movement"
        | "other"
      non_trip_purpose:
        | "yard_movement"
        | "maintenance_run"
        | "repositioning"
        | "standby"
        | "other"
      po_status: "draft" | "approved" | "confirmed" | "sent_to_supplier"
      stock_movement_type:
        | "grn_receipt"
        | "job_card_issue"
        | "job_card_return"
        | "truck_assignment"
        | "truck_return_serviceable"
        | "truck_return_damaged"
        | "truck_return_scrapped"
        | "write_off"
        | "stock_adjustment"
      theme_preference: "light" | "dark"
      trip_status:
        | "confirmed"
        | "loading"
        | "in_transit"
        | "at_border"
        | "offloading"
        | "delivered"
        | "invoiced"
        | "closed"
      trip_type: "local" | "export" | "import"
      user_role:
        | "principal"
        | "operations_manager"
        | "dispatcher"
        | "finance_manager"
        | "workshop_manager"
        | "storeroom_clerk"
        | "hr_manager"
        | "viewer"
      user_status: "pending" | "active" | "inactive"
      vat_treatment: "standard" | "zero_rated" | "exempt"
      vehicle_status:
        | "standby"
        | "on_road"
        | "in_workshop"
        | "off_road"
        | "disposed"
      vehicle_type:
        | "horse"
        | "rigid"
        | "interlink"
        | "flatbed"
        | "tanker"
        | "tipper"
        | "trailer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_status: [
        "trial",
        "active",
        "read_only",
        "suspended",
        "cancelled",
      ],
      assigned_to_type: ["inhouse", "sublet", "both"],
      fuel_mode: ["company_tank", "direct_purchase", "hybrid"],
      fuel_transaction_type: ["issuance", "delivery", "adjustment"],
      how_paid: ["cash", "bank_transfer", "eft", "ecocash", "on_account"],
      inspection_timing: ["before_trip", "on_workshop_entry", "both"],
      invoice_layout: ["classic", "modern", "minimal"],
      invoice_status: [
        "draft",
        "confirmed",
        "partially_paid",
        "paid",
        "overdue",
      ],
      job_card_status: ["open", "in_progress", "pending_parts", "closed"],
      job_source: [
        "planned",
        "breakdown",
        "vehicle_inspection_failure",
        "driver_reported",
        "workshop_inspection",
      ],
      job_type: ["routine_service", "repair", "inspection", "accident_repair"],
      load_status: ["loaded", "empty"],
      load_type: [
        "bulk",
        "containers",
        "bags",
        "pallets",
        "breakbulk",
        "livestock",
        "hazardous",
        "other",
      ],
      movement_purpose: [
        "empty_repositioning",
        "depot_transfer",
        "maintenance_run",
        "workshop_transfer",
        "yard_movement",
        "other",
      ],
      non_trip_purpose: [
        "yard_movement",
        "maintenance_run",
        "repositioning",
        "standby",
        "other",
      ],
      po_status: ["draft", "approved", "confirmed", "sent_to_supplier"],
      stock_movement_type: [
        "grn_receipt",
        "job_card_issue",
        "job_card_return",
        "truck_assignment",
        "truck_return_serviceable",
        "truck_return_damaged",
        "truck_return_scrapped",
        "write_off",
        "stock_adjustment",
      ],
      theme_preference: ["light", "dark"],
      trip_status: [
        "confirmed",
        "loading",
        "in_transit",
        "at_border",
        "offloading",
        "delivered",
        "invoiced",
        "closed",
      ],
      trip_type: ["local", "export", "import"],
      user_role: [
        "principal",
        "operations_manager",
        "dispatcher",
        "finance_manager",
        "workshop_manager",
        "storeroom_clerk",
        "hr_manager",
        "viewer",
      ],
      user_status: ["pending", "active", "inactive"],
      vat_treatment: ["standard", "zero_rated", "exempt"],
      vehicle_status: [
        "standby",
        "on_road",
        "in_workshop",
        "off_road",
        "disposed",
      ],
      vehicle_type: [
        "horse",
        "rigid",
        "interlink",
        "flatbed",
        "tanker",
        "tipper",
        "trailer",
      ],
    },
  },
} as const
