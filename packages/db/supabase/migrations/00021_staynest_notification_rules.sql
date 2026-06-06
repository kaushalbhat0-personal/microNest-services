-- Migration 00021: Notification Rules for StayNest
-- Adds automation rules table for notification scheduling

-- ── Notification Rules ─────────────────────────────────────────────

CREATE TABLE staynest_notification_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_event TEXT NOT NULL CHECK (trigger_event IN ('rent_due', 'rent_overdue', 'announcement_created', 'maintenance_resolved')),
  trigger_config JSONB DEFAULT '{}'::jsonb,
  template_id UUID REFERENCES staynest_notification_templates(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notification_rules_org ON staynest_notification_rules(organization_id);
CREATE INDEX idx_notification_rules_event ON staynest_notification_rules(trigger_event);

ALTER TABLE staynest_notification_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notification rules are viewable by org members"
  ON staynest_notification_rules FOR SELECT
  USING (is_member_of_org(organization_id));

CREATE POLICY "Notification rules are insertable by org members"
  ON staynest_notification_rules FOR INSERT
  WITH CHECK (is_member_of_org(organization_id));

CREATE POLICY "Notification rules are updatable by org members"
  ON staynest_notification_rules FOR UPDATE
  USING (is_member_of_org(organization_id));

CREATE POLICY "Notification rules are deletable by org members"
  ON staynest_notification_rules FOR DELETE
  USING (is_member_of_org(organization_id));
