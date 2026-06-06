export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ── Enums ────────────────────────────────────────────────────────────

export type OrganizationRole = 'owner' | 'admin' | 'member'

export type SubscriptionStatus =
  | 'active'
  | 'trial'
  | 'past_due'
  | 'cancelled'
  | 'expired'

export type EcosystemSlug =
  | 'staynest'
  | 'clinicnest'
  | 'freelancenest'
  | 'propertynest'

import type { SupabaseClient } from '@supabase/supabase-js'

export type DBClient = SupabaseClient<Database, any, any, any, any>

// ── Tables ───────────────────────────────────────────────────────────

export interface Organization {
  id: string
  name: string
  slug: string
  logo_url: string | null
  late_fee_type: 'fixed' | 'per_day'
  late_fee_amount: number
  late_fee_grace_period: number
  rent_due_day: number
  created_by: string
  created_at: string
  updated_at: string
}

export interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role: OrganizationRole
  created_at: string
}

export interface Ecosystem {
  id: string
  slug: EcosystemSlug
  name: string
  description: string | null
  is_active: boolean
  created_at: string
}

export interface OrganizationEcosystem {
  id: string
  organization_id: string
  ecosystem_id: string
  settings: Json
  activated_at: string
}

export interface Subscription {
  id: string
  organization_id: string
  plan_name: string
  status: SubscriptionStatus
  trial_ends_at: string | null
  current_period_starts_at: string
  current_period_ends_at: string | null
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  organization_id: string | null
  user_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  metadata: Json
  created_at: string
}

// ── Ecosystem tables ─────────────────────────────────────────────────

export interface StayNestVisitor {
  id: string
  organization_id: string
  name: string
  phone: string
  purpose: string
  room_number: string
  resident_id: string | null
  notes: string | null
  status: 'checked-in' | 'checked-out'
  check_in_at: string
  check_out_at: string | null
  deleted_at: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface StayNestComplaint {
  id: string
  organization_id: string
  title: string
  description: string
  raised_by: string
  room_number: string
  priority: 'low' | 'medium' | 'high'
  status: 'open' | 'in-progress' | 'resolved'
  resolved_at: string | null
  resolved_by: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface StayNestResident {
  id: string
  organization_id: string
  full_name: string
  phone: string
  email: string | null
  gender: 'male' | 'female' | 'other' | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  id_proof_type: 'aadhaar' | 'pan' | 'voter' | 'driving_license' | 'passport' | 'other' | null
  id_proof_number: string | null
  room_id: string | null
  bed_number: number | null
  check_in_date: string
  check_out_date: string | null
  status: 'active' | 'notice_period' | 'checked_out'
  deleted_at: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface StayNestRoom {
  id: string
  organization_id: string
  room_number: string
  floor: number | null
  capacity: number
  occupied_beds: number
  rent_per_bed: number
  status: 'available' | 'partially_occupied' | 'full' | 'maintenance'
  deleted_at: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface StayNestMaintenanceRequest {
  id: string
  organization_id: string
  title: string
  description: string
  category: 'electrical' | 'plumbing' | 'furniture' | 'internet' | 'cleaning' | 'other'
  priority: 'low' | 'medium' | 'high'
  status: 'open' | 'in_progress' | 'resolved'
  resident_id: string | null
  room_id: string | null
  assigned_to: string | null
  resolved_at: string | null
  resolved_by: string | null
  notes: string | null
  resolved_notes: string | null
  deleted_at: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface StayNestAnnouncement {
  id: string
  organization_id: string
  title: string
  message: string
  priority: 'normal' | 'important' | 'urgent'
  publish_date: string
  expiry_date: string | null
  deleted_at: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface StayNestNotice {
  id: string
  organization_id: string
  title: string
  content: string
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface StayNestRentRecord {
  id: string
  organization_id: string
  resident_id: string
  room_id: string | null
  billing_month: number
  billing_year: number
  rent_amount: number
  late_fee: number
  amount: number
  paid_amount: number
  due_date: string
  payment_date: string | null
  payment_method: 'cash' | 'upi' | 'bank_transfer' | 'other' | null
  status: 'pending' | 'paid' | 'partially_paid' | 'overdue'
  receipt_number: string | null
  notes: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface StayNestReceipt {
  id: string
  organization_id: string
  rent_record_id: string
  receipt_number: string
  amount_paid: number
  payment_method: 'cash' | 'upi' | 'bank_transfer' | 'other'
  payment_date: string
  notes: string | null
  status: 'active' | 'voided'
  void_reason: string | null
  voided_at: string | null
  voided_by: string | null
  regenerated_from_id: string | null
  created_by: string
  created_at: string
}

export interface StayNestReceiptWithDetails extends StayNestReceipt {
  resident_name: string
  resident_phone: string
  room_number: string | null
  billing_month: number
  billing_year: number
  rent_amount: number
}

export interface ResidentPaymentSummary {
  total_paid: number
  total_due: number
  outstanding: number
  last_payment: string | null
  last_payment_amount: number | null
}

export interface StayNestNotificationTemplate {
  id: string
  organization_id: string | null
  event: 'rent_due' | 'rent_overdue' | 'announcement_created' | 'maintenance_resolved'
  channel: 'whatsapp' | 'email' | 'sms'
  template_text: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface StayNestNotificationLog {
  id: string
  organization_id: string
  template_id: string | null
  event: string
  channel: string
  recipient: string
  rendered_message: string
  status: 'pending' | 'sent' | 'failed'
  error_message: string | null
  sent_at: string | null
  provider_message_id: string | null
  created_at: string
}

export interface NotificationProviderResult {
  success: boolean
  providerMessageId?: string
  error?: string
}

export interface StayNestNotificationRule {
  id: string
  organization_id: string
  name: string
  trigger_event: 'rent_due' | 'rent_overdue' | 'announcement_created' | 'maintenance_resolved'
  trigger_config: Record<string, any>
  template_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface NotificationEngineStats {
  total_sent: number
  total_pending: number
  total_failed: number
  total_logs: number
  success_rate: number
  by_event: Record<string, { sent: number; pending: number; failed: number }>
  last_execution: string | null
}

export type FeedbackCategory =
  | 'rent' | 'rooms' | 'complaints' | 'visitors'
  | 'electricity' | 'staff' | 'food' | 'deposits'
  | 'attendance' | 'other'

export type FeedbackStatus = 'new' | 'reviewed' | 'planned' | 'implemented'

export interface ProductFeedback {
  id: string
  name: string
  business_name: string
  phone: string
  ecosystem: string
  category: FeedbackCategory
  problem: string
  status: FeedbackStatus
  created_at: string
}

// ── Database type map ────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: Organization
        Insert: Omit<Organization, 'id' | 'created_at' | 'updated_at' | 'logo_url'> & { logo_url?: string | null }
        Update: Partial<Omit<Organization, 'id'>>
        Relationships: []
      }
      organization_members: {
        Row: OrganizationMember
        Insert: Omit<OrganizationMember, 'id' | 'created_at'>
        Update: Partial<Omit<OrganizationMember, 'id'>>
        Relationships: []
      }
      ecosystems: {
        Row: Ecosystem
        Insert: Omit<Ecosystem, 'id' | 'created_at'>
        Update: Partial<Omit<Ecosystem, 'id'>>
        Relationships: []
      }
      organization_ecosystems: {
        Row: OrganizationEcosystem
        Insert: Omit<OrganizationEcosystem, 'id' | 'activated_at'>
        Update: Partial<Omit<OrganizationEcosystem, 'id'>>
        Relationships: []
      }
      subscriptions: {
        Row: Subscription
        Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Subscription, 'id'>>
        Relationships: []
      }
      audit_logs: {
        Row: AuditLog
        Insert: Omit<AuditLog, 'id' | 'created_at'>
        Update: never
        Relationships: []
      }
      staynest_visitors: {
        Row: StayNestVisitor
        Insert: Omit<StayNestVisitor, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<StayNestVisitor, 'id'>>
        Relationships: []
      }
      staynest_complaints: {
        Row: StayNestComplaint
        Insert: Omit<StayNestComplaint, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<StayNestComplaint, 'id'>>
        Relationships: []
      }
      staynest_residents: {
        Row: StayNestResident
        Insert: Omit<StayNestResident, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<StayNestResident, 'id'>>
        Relationships: []
      }
      staynest_rooms: {
        Row: StayNestRoom
        Insert: Omit<StayNestRoom, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<StayNestRoom, 'id'>>
        Relationships: []
      }
      staynest_rent_records: {
        Row: StayNestRentRecord
        Insert: Omit<StayNestRentRecord, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<StayNestRentRecord, 'id'>>
        Relationships: []
      }
      staynest_notices: {
        Row: StayNestNotice
        Insert: Omit<StayNestNotice, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<StayNestNotice, 'id'>>
        Relationships: []
      }
      staynest_maintenance_requests: {
        Row: StayNestMaintenanceRequest
        Insert: Omit<StayNestMaintenanceRequest, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<StayNestMaintenanceRequest, 'id'>>
        Relationships: []
      }
      staynest_announcements: {
        Row: StayNestAnnouncement
        Insert: Omit<StayNestAnnouncement, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<StayNestAnnouncement, 'id'>>
        Relationships: []
      }
      product_feedback: {
        Row: ProductFeedback
        Insert: Omit<ProductFeedback, 'id' | 'created_at'>
        Update: Partial<Omit<ProductFeedback, 'id'>>
        Relationships: []
      }
      staynest_receipts: {
        Row: StayNestReceipt
        Insert: Omit<StayNestReceipt, 'id' | 'created_at' | 'status' | 'void_reason' | 'voided_at' | 'voided_by' | 'regenerated_from_id'>
        Update: Partial<Omit<StayNestReceipt, 'id'>>
        Relationships: []
      }
      staynest_notification_templates: {
        Row: StayNestNotificationTemplate
        Insert: Omit<StayNestNotificationTemplate, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<StayNestNotificationTemplate, 'id'>>
        Relationships: []
      }
      staynest_notification_logs: {
        Row: StayNestNotificationLog
        Insert: Omit<StayNestNotificationLog, 'id' | 'created_at'>
        Update: Partial<Omit<StayNestNotificationLog, 'id'>>
        Relationships: []
      }
      staynest_notification_rules: {
        Row: StayNestNotificationRule
        Insert: Omit<StayNestNotificationRule, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<StayNestNotificationRule, 'id'>>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      organization_role: OrganizationRole
      subscription_status: SubscriptionStatus
      ecosystem_slug: EcosystemSlug
    }
  }
}
