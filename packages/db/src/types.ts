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

// ── Tables ───────────────────────────────────────────────────────────

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  logo_url: string | null
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
  status: 'checked-in' | 'checked-out'
  check_in_at: string
  check_out_at: string | null
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
  guardian_name: string | null
  guardian_phone: string | null
  room_number: string
  joining_date: string
  status: 'active' | 'inactive'
  notes: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface StayNestRoom {
  id: string
  organization_id: string
  room_number: string
  room_type: 'single' | 'double' | 'triple' | 'dorm' | 'other' | null
  capacity: number
  occupied_count: number
  monthly_rent: number
  status: 'active' | 'inactive' | 'maintenance'
  notes: string | null
  created_by: string
  created_at: string
  updated_at: string
}

// ── Database type map ────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id'>>
      }
      organizations: {
        Row: Organization
        Insert: Omit<Organization, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Organization, 'id'>>
      }
      organization_members: {
        Row: OrganizationMember
        Insert: Omit<OrganizationMember, 'id' | 'created_at'>
        Update: Partial<Omit<OrganizationMember, 'id'>>
      }
      ecosystems: {
        Row: Ecosystem
        Insert: Omit<Ecosystem, 'id' | 'created_at'>
        Update: Partial<Omit<Ecosystem, 'id'>>
      }
      organization_ecosystems: {
        Row: OrganizationEcosystem
        Insert: Omit<OrganizationEcosystem, 'id' | 'activated_at'>
        Update: Partial<Omit<OrganizationEcosystem, 'id'>>
      }
      subscriptions: {
        Row: Subscription
        Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Subscription, 'id'>>
      }
      audit_logs: {
        Row: AuditLog
        Insert: Omit<AuditLog, 'id' | 'created_at'>
        Update: never
      }
      staynest_visitors: {
        Row: StayNestVisitor
        Insert: Omit<StayNestVisitor, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<StayNestVisitor, 'id'>>
      }
      staynest_complaints: {
        Row: StayNestComplaint
        Insert: Omit<StayNestComplaint, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<StayNestComplaint, 'id'>>
      }
      staynest_residents: {
        Row: StayNestResident
        Insert: Omit<StayNestResident, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<StayNestResident, 'id'>>
      }
      staynest_rooms: {
        Row: StayNestRoom
        Insert: Omit<StayNestRoom, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<StayNestRoom, 'id'>>
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
