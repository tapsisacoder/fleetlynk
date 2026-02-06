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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      chart_of_accounts: {
        Row: {
          account_code: string
          account_name: string
          account_type: string
          category: string | null
          company_id: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_system: boolean | null
          parent_code: string | null
          updated_at: string | null
        }
        Insert: {
          account_code: string
          account_name: string
          account_type: string
          category?: string | null
          company_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          parent_code?: string | null
          updated_at?: string | null
        }
        Update: {
          account_code?: string
          account_name?: string
          account_type?: string
          category?: string | null
          company_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          parent_code?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chart_of_accounts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          company_id: string
          contact_person: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          payment_terms_days: number | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          company_id: string
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          payment_terms_days?: number | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          company_id?: string
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          payment_terms_days?: number | null
          phone?: string | null
          updated_at?: string | null
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
      companies: {
        Row: {
          address: string | null
          created_at: string | null
          currency: string | null
          email: string | null
          id: string
          logo_url: string | null
          name: string
          owner_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      document_alerts: {
        Row: {
          alert_type: string
          company_id: string
          created_at: string | null
          expires_at: string
          id: string
          status: string | null
          title: string
          vehicle_id: string | null
        }
        Insert: {
          alert_type: string
          company_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          status?: string | null
          title: string
          vehicle_id?: string | null
        }
        Update: {
          alert_type?: string
          company_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          status?: string | null
          title?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_alerts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_alerts_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          address: string | null
          company_id: string
          created_at: string | null
          email: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          employment_status: string | null
          full_name: string
          hire_date: string | null
          id: string
          id_number: string | null
          is_active: boolean | null
          license_expiry: string | null
          license_number: string | null
          phone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          company_id: string
          created_at?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          employment_status?: string | null
          full_name: string
          hire_date?: string | null
          id?: string
          id_number?: string | null
          is_active?: boolean | null
          license_expiry?: string | null
          license_number?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          company_id?: string
          created_at?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          employment_status?: string | null
          full_name?: string
          hire_date?: string | null
          id?: string
          id_number?: string | null
          is_active?: boolean | null
          license_expiry?: string | null
          license_number?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_records: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          company_id: string
          created_at: string | null
          currency: string | null
          description: string
          driver_id: string | null
          expense_date: string
          expense_type: string
          id: string
          location: string | null
          receipt_photo_url: string | null
          receipt_uploaded_at: string | null
          rejection_reason: string | null
          status: string | null
          transaction_id: string | null
          trip_id: string | null
          vehicle_id: string | null
          vendor: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          company_id: string
          created_at?: string | null
          currency?: string | null
          description: string
          driver_id?: string | null
          expense_date: string
          expense_type: string
          id?: string
          location?: string | null
          receipt_photo_url?: string | null
          receipt_uploaded_at?: string | null
          rejection_reason?: string | null
          status?: string | null
          transaction_id?: string | null
          trip_id?: string | null
          vehicle_id?: string | null
          vendor?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          company_id?: string
          created_at?: string | null
          currency?: string | null
          description?: string
          driver_id?: string | null
          expense_date?: string
          expense_type?: string
          id?: string
          location?: string | null
          receipt_photo_url?: string | null
          receipt_uploaded_at?: string | null
          rejection_reason?: string | null
          status?: string | null
          transaction_id?: string | null
          trip_id?: string | null
          vehicle_id?: string | null
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_records_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_records_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_records_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers_basic"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_records_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_records_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      founding_applications: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          region: string
          timestamp: string
          vehicles: string
          whatsapp: string
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          id?: string
          region: string
          timestamp?: string
          vehicles: string
          whatsapp: string
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          region?: string
          timestamp?: string
          vehicles?: string
          whatsapp?: string
        }
        Relationships: []
      }
      gps_integrations: {
        Row: {
          additional_config: Json | null
          api_key: string
          api_secret: string | null
          api_url: string
          company_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          provider_name: string
          updated_at: string | null
        }
        Insert: {
          additional_config?: Json | null
          api_key: string
          api_secret?: string | null
          api_url: string
          company_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          provider_name: string
          updated_at?: string | null
        }
        Update: {
          additional_config?: Json | null
          api_key?: string
          api_secret?: string | null
          api_url?: string
          company_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          provider_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          category: string | null
          company_id: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          last_restocked_at: string | null
          location: string | null
          min_stock_level: number | null
          name: string
          part_number: string
          quantity: number
          supplier: string | null
          unit_cost: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          company_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_restocked_at?: string | null
          location?: string | null
          min_stock_level?: number | null
          name: string
          part_number: string
          quantity?: number
          supplier?: string | null
          unit_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          company_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_restocked_at?: string | null
          location?: string | null
          min_stock_level?: number | null
          name?: string
          part_number?: string
          quantity?: number
          supplier?: string | null
          unit_cost?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          client_email: string | null
          client_id: string | null
          client_name: string | null
          client_phone: string | null
          company_id: string
          created_at: string | null
          created_by: string | null
          currency: string | null
          distance_km: number | null
          due_date: string
          id: string
          invoice_date: string
          invoice_number: string
          notes: string | null
          paid_at: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_terms_days: number | null
          pdf_generated_at: string | null
          pdf_url: string | null
          route: string | null
          sent_at: string | null
          status: string | null
          terms_and_conditions: string | null
          total_amount: number
          trip_id: string | null
          updated_at: string | null
          viewed_at: string | null
        }
        Insert: {
          client_email?: string | null
          client_id?: string | null
          client_name?: string | null
          client_phone?: string | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          distance_km?: number | null
          due_date: string
          id?: string
          invoice_date: string
          invoice_number: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_terms_days?: number | null
          pdf_generated_at?: string | null
          pdf_url?: string | null
          route?: string | null
          sent_at?: string | null
          status?: string | null
          terms_and_conditions?: string | null
          total_amount: number
          trip_id?: string | null
          updated_at?: string | null
          viewed_at?: string | null
        }
        Update: {
          client_email?: string | null
          client_id?: string | null
          client_name?: string | null
          client_phone?: string | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          distance_km?: number | null
          due_date?: string
          id?: string
          invoice_date?: string
          invoice_number?: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_terms_days?: number | null
          pdf_generated_at?: string | null
          pdf_url?: string | null
          route?: string | null
          sent_at?: string | null
          status?: string | null
          terms_and_conditions?: string | null
          total_amount?: number
          trip_id?: string | null
          updated_at?: string | null
          viewed_at?: string | null
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
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          account_code: string
          account_name: string
          created_at: string | null
          credit_amount: number | null
          currency: string | null
          debit_amount: number | null
          description: string | null
          id: string
          transaction_id: string
        }
        Insert: {
          account_code: string
          account_name: string
          created_at?: string | null
          credit_amount?: number | null
          currency?: string | null
          debit_amount?: number | null
          description?: string | null
          id?: string
          transaction_id: string
        }
        Update: {
          account_code?: string
          account_name?: string
          created_at?: string | null
          credit_amount?: number | null
          currency?: string | null
          debit_amount?: number | null
          description?: string | null
          id?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          attachments: Json | null
          company_id: string
          created_at: string | null
          description: string
          driver_id: string | null
          id: string
          labor_cost: number | null
          next_service_date: string | null
          next_service_odometer: number | null
          notes: string | null
          odometer_reading: number | null
          parts_cost: number | null
          parts_used: Json | null
          performed_by: string | null
          priority: string | null
          service_category: string | null
          service_date: string
          service_type: string
          status: string | null
          total_cost: number | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          attachments?: Json | null
          company_id: string
          created_at?: string | null
          description: string
          driver_id?: string | null
          id?: string
          labor_cost?: number | null
          next_service_date?: string | null
          next_service_odometer?: number | null
          notes?: string | null
          odometer_reading?: number | null
          parts_cost?: number | null
          parts_used?: Json | null
          performed_by?: string | null
          priority?: string | null
          service_category?: string | null
          service_date: string
          service_type: string
          status?: string | null
          total_cost?: number | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          attachments?: Json | null
          company_id?: string
          created_at?: string | null
          description?: string
          driver_id?: string | null
          id?: string
          labor_cost?: number | null
          next_service_date?: string | null
          next_service_odometer?: number | null
          notes?: string | null
          odometer_reading?: number | null
          parts_cost?: number | null
          parts_used?: Json | null
          performed_by?: string | null
          priority?: string | null
          service_category?: string | null
          service_date?: string
          service_type?: string
          status?: string | null
          total_cost?: number | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_records_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers_basic"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_schedules: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          interval_days: number | null
          interval_km: number | null
          is_active: boolean | null
          last_service_date: string | null
          last_service_odometer: number | null
          next_due_date: string | null
          next_due_odometer: number | null
          service_type: string
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          interval_days?: number | null
          interval_km?: number | null
          is_active?: boolean | null
          last_service_date?: string | null
          last_service_odometer?: number | null
          next_due_date?: string | null
          next_due_odometer?: number | null
          service_type: string
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          interval_days?: number | null
          interval_km?: number | null
          is_active?: boolean | null
          last_service_date?: string | null
          last_service_odometer?: number | null
          next_due_date?: string | null
          next_due_odometer?: number | null
          service_type?: string
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_schedules_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_records: {
        Row: {
          amount: number
          bank_account: string | null
          client_id: string | null
          company_id: string
          created_at: string | null
          created_by: string | null
          currency: string | null
          id: string
          invoice_id: string | null
          notes: string | null
          payment_date: string
          payment_method: string
          payment_type: string
          reference: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          bank_account?: string | null
          client_id?: string | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date: string
          payment_method: string
          payment_type: string
          reference?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          bank_account?: string | null
          client_id?: string | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method?: string
          payment_type?: string
          reference?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_records_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_records_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_records_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_records_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
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
      purchase_orders: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          company_id: string
          created_at: string | null
          created_by: string | null
          currency: string | null
          expected_delivery_date: string | null
          id: string
          items: Json
          notes: string | null
          order_date: string
          po_number: string
          received_date: string | null
          status: string | null
          subtotal: number | null
          supplier_contact: string | null
          supplier_email: string | null
          supplier_name: string
          tax_amount: number | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          expected_delivery_date?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_date: string
          po_number: string
          received_date?: string | null
          status?: string | null
          subtotal?: number | null
          supplier_contact?: string | null
          supplier_email?: string | null
          supplier_name: string
          tax_amount?: number | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          expected_delivery_date?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_date?: string
          po_number?: string
          received_date?: string | null
          status?: string | null
          subtotal?: number | null
          supplier_contact?: string | null
          supplier_email?: string | null
          supplier_name?: string
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      trailers: {
        Row: {
          axle_count: number | null
          capacity_tons: number | null
          company_id: string
          created_at: string | null
          id: string
          insurance_expiry: string | null
          is_active: boolean | null
          length_meters: number | null
          license_expiry: string | null
          make: string | null
          model: string | null
          notes: string | null
          registration_number: string
          roadworthy_expiry: string | null
          status: string | null
          trailer_type: string | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          axle_count?: number | null
          capacity_tons?: number | null
          company_id: string
          created_at?: string | null
          id?: string
          insurance_expiry?: string | null
          is_active?: boolean | null
          length_meters?: number | null
          license_expiry?: string | null
          make?: string | null
          model?: string | null
          notes?: string | null
          registration_number: string
          roadworthy_expiry?: string | null
          status?: string | null
          trailer_type?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          axle_count?: number | null
          capacity_tons?: number | null
          company_id?: string
          created_at?: string | null
          id?: string
          insurance_expiry?: string | null
          is_active?: boolean | null
          length_meters?: number | null
          license_expiry?: string | null
          make?: string | null
          model?: string | null
          notes?: string | null
          registration_number?: string
          roadworthy_expiry?: string | null
          status?: string | null
          trailer_type?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trailers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          attachments: Json | null
          client_id: string | null
          company_id: string
          created_at: string | null
          created_by: string | null
          currency: string | null
          description: string
          driver_id: string | null
          exchange_rate: number | null
          id: string
          notes: string | null
          posted_at: string | null
          posted_by: string | null
          reference: string | null
          status: string | null
          total_amount: number
          transaction_date: string
          transaction_number: string
          transaction_type: string
          trip_id: string | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          attachments?: Json | null
          client_id?: string | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description: string
          driver_id?: string | null
          exchange_rate?: number | null
          id?: string
          notes?: string | null
          posted_at?: string | null
          posted_by?: string | null
          reference?: string | null
          status?: string | null
          total_amount: number
          transaction_date: string
          transaction_number: string
          transaction_type: string
          trip_id?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          attachments?: Json | null
          client_id?: string | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string
          driver_id?: string | null
          exchange_rate?: number | null
          id?: string
          notes?: string | null
          posted_at?: string | null
          posted_by?: string | null
          reference?: string | null
          status?: string | null
          total_amount?: number
          transaction_date?: string
          transaction_number?: string
          transaction_type?: string
          trip_id?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers_basic"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_bookouts: {
        Row: {
          accommodation: number | null
          airtime: number | null
          amount_returned: number | null
          amount_spent: number | null
          bookout_date: string
          bookout_transaction_id: string | null
          border_fees: number | null
          company_id: string
          created_at: string | null
          currency: string | null
          driver_id: string
          driver_signature_url: string | null
          emergency_fund: number | null
          food_allowance: number | null
          id: string
          notes: string | null
          operator_name: string | null
          other_expenses: number | null
          reconciled_at: string | null
          reconciled_by: string | null
          reconciliation_transaction_id: string | null
          status: string | null
          toll_fees: number | null
          total_cash_given: number
          trip_id: string
          variance: number | null
          vehicle_id: string | null
        }
        Insert: {
          accommodation?: number | null
          airtime?: number | null
          amount_returned?: number | null
          amount_spent?: number | null
          bookout_date: string
          bookout_transaction_id?: string | null
          border_fees?: number | null
          company_id: string
          created_at?: string | null
          currency?: string | null
          driver_id: string
          driver_signature_url?: string | null
          emergency_fund?: number | null
          food_allowance?: number | null
          id?: string
          notes?: string | null
          operator_name?: string | null
          other_expenses?: number | null
          reconciled_at?: string | null
          reconciled_by?: string | null
          reconciliation_transaction_id?: string | null
          status?: string | null
          toll_fees?: number | null
          total_cash_given: number
          trip_id: string
          variance?: number | null
          vehicle_id?: string | null
        }
        Update: {
          accommodation?: number | null
          airtime?: number | null
          amount_returned?: number | null
          amount_spent?: number | null
          bookout_date?: string
          bookout_transaction_id?: string | null
          border_fees?: number | null
          company_id?: string
          created_at?: string | null
          currency?: string | null
          driver_id?: string
          driver_signature_url?: string | null
          emergency_fund?: number | null
          food_allowance?: number | null
          id?: string
          notes?: string | null
          operator_name?: string | null
          other_expenses?: number | null
          reconciled_at?: string | null
          reconciled_by?: string | null
          reconciliation_transaction_id?: string | null
          status?: string | null
          toll_fees?: number | null
          total_cash_given?: number
          trip_id?: string
          variance?: number | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_bookouts_bookout_transaction_id_fkey"
            columns: ["bookout_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_bookouts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_bookouts_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_bookouts_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers_basic"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_bookouts_reconciliation_transaction_id_fkey"
            columns: ["reconciliation_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_bookouts_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_bookouts_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          cargo_description: string | null
          client_id: string | null
          company_id: string
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          departure_date: string | null
          destination: string
          distance_km: number | null
          driver_id: string | null
          end_odometer: number | null
          eta: string | null
          fuel_allocated_liters: number | null
          fuel_used_liters: number | null
          id: string
          load_status: string | null
          notes: string | null
          origin: string
          progress_percent: number | null
          rate: number | null
          start_odometer: number | null
          status: string | null
          toll_fees: number | null
          tonnage: number | null
          trip_costs: number | null
          trip_reference: string
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          cargo_description?: string | null
          client_id?: string | null
          company_id: string
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          departure_date?: string | null
          destination: string
          distance_km?: number | null
          driver_id?: string | null
          end_odometer?: number | null
          eta?: string | null
          fuel_allocated_liters?: number | null
          fuel_used_liters?: number | null
          id?: string
          load_status?: string | null
          notes?: string | null
          origin: string
          progress_percent?: number | null
          rate?: number | null
          start_odometer?: number | null
          status?: string | null
          toll_fees?: number | null
          tonnage?: number | null
          trip_costs?: number | null
          trip_reference: string
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          cargo_description?: string | null
          client_id?: string | null
          company_id?: string
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          departure_date?: string | null
          destination?: string
          distance_km?: number | null
          driver_id?: string | null
          end_odometer?: number | null
          eta?: string | null
          fuel_allocated_liters?: number | null
          fuel_used_liters?: number | null
          id?: string
          load_status?: string | null
          notes?: string | null
          origin?: string
          progress_percent?: number | null
          rate?: number | null
          start_odometer?: number | null
          status?: string | null
          toll_fees?: number | null
          tonnage?: number | null
          trip_costs?: number | null
          trip_reference?: string
          updated_at?: string | null
          vehicle_id?: string | null
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
            foreignKeyName: "trips_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers_basic"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicle_documents: {
        Row: {
          company_id: string
          created_at: string | null
          document_name: string
          document_type: string
          document_url: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          notes: string | null
          reminder_days: number | null
          status: string | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          document_name: string
          document_type: string
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          notes?: string | null
          reminder_days?: number | null
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          document_name?: string
          document_type?: string
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          notes?: string | null
          reminder_days?: number | null
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_documents_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_trailers: {
        Row: {
          attached_at: string | null
          attached_by: string | null
          company_id: string
          detached_at: string | null
          id: string
          position: number
          trailer_id: string
          vehicle_id: string
        }
        Insert: {
          attached_at?: string | null
          attached_by?: string | null
          company_id: string
          detached_at?: string | null
          id?: string
          position?: number
          trailer_id: string
          vehicle_id: string
        }
        Update: {
          attached_at?: string | null
          attached_by?: string | null
          company_id?: string
          detached_at?: string | null
          id?: string
          position?: number
          trailer_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_trailers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_trailers_trailer_id_fkey"
            columns: ["trailer_id"]
            isOneToOne: false
            referencedRelation: "trailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_trailers_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          color: string | null
          company_id: string
          created_at: string | null
          current_odometer: number | null
          engine_type: string | null
          fuel_consumption_empty: number | null
          fuel_consumption_loaded: number | null
          id: string
          insurance_expiry: string | null
          is_active: boolean | null
          license_expiry: string | null
          make: string | null
          model: string | null
          registration_number: string
          roadworthy_expiry: string | null
          status: string | null
          tank_capacity_liters: number | null
          updated_at: string | null
          vin: string | null
          year: number | null
        }
        Insert: {
          color?: string | null
          company_id: string
          created_at?: string | null
          current_odometer?: number | null
          engine_type?: string | null
          fuel_consumption_empty?: number | null
          fuel_consumption_loaded?: number | null
          id?: string
          insurance_expiry?: string | null
          is_active?: boolean | null
          license_expiry?: string | null
          make?: string | null
          model?: string | null
          registration_number: string
          roadworthy_expiry?: string | null
          status?: string | null
          tank_capacity_liters?: number | null
          updated_at?: string | null
          vin?: string | null
          year?: number | null
        }
        Update: {
          color?: string | null
          company_id?: string
          created_at?: string | null
          current_odometer?: number | null
          engine_type?: string | null
          fuel_consumption_empty?: number | null
          fuel_consumption_loaded?: number | null
          id?: string
          insurance_expiry?: string | null
          is_active?: boolean | null
          license_expiry?: string | null
          make?: string | null
          model?: string | null
          registration_number?: string
          roadworthy_expiry?: string | null
          status?: string | null
          tank_capacity_liters?: number | null
          updated_at?: string | null
          vin?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      drivers_basic: {
        Row: {
          company_id: string | null
          employment_status: string | null
          full_name: string | null
          id: string | null
          is_active: boolean | null
        }
        Insert: {
          company_id?: string | null
          employment_status?: string | null
          full_name?: string | null
          id?: string | null
          is_active?: boolean | null
        }
        Update: {
          company_id?: string | null
          employment_status?: string | null
          full_name?: string | null
          id?: string | null
          is_active?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      generate_invoice_number: { Args: never; Returns: string }
      generate_transaction_number: { Args: never; Returns: string }
      generate_trip_reference: { Args: never; Returns: string }
      get_user_company_id: { Args: never; Returns: string }
      has_elevated_role: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "owner" | "manager" | "driver" | "accountant"
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
      app_role: ["admin", "user", "owner", "manager", "driver", "accountant"],
    },
  },
} as const
