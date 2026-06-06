-- Migration 00023: Notification integrity — unique constraints + provider_message_id
-- Adds UNIQUE constraints to prevent duplicate subscriptions and ecosystem activations
-- Adds provider_message_id column to notification_logs for BYOP tracking

-- ── 1. Deduplicate subscriptions before adding constraint ──────────────────

-- Keep only the most recent subscription per organization_id
DELETE FROM subscriptions
WHERE id NOT IN (
  SELECT DISTINCT ON (organization_id) id
  FROM subscriptions
  ORDER BY organization_id, created_at DESC
);

-- Add UNIQUE constraint (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'subscriptions_organization_id_key'
  ) THEN
    ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_organization_id_key
      UNIQUE (organization_id);
  END IF;
END $$;

-- ── 2. Deduplicate organization_ecosystems before adding constraint ─────────

-- Keep only the most recent activation per (organization_id, ecosystem_id)
DELETE FROM organization_ecosystems
WHERE id NOT IN (
  SELECT DISTINCT ON (organization_id, ecosystem_id) id
  FROM organization_ecosystems
  ORDER BY organization_id, ecosystem_id, activated_at DESC
);

-- Add UNIQUE constraint (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'org_ecosystems_org_eco_key'
  ) THEN
    ALTER TABLE organization_ecosystems ADD CONSTRAINT org_ecosystems_org_eco_key
      UNIQUE (organization_id, ecosystem_id);
  END IF;
END $$;

-- ── 3. Add provider_message_id to notification_logs (idempotent) ────────────

ALTER TABLE staynest_notification_logs
  ADD COLUMN IF NOT EXISTS provider_message_id TEXT;

-- Index for provider message ID lookups
CREATE INDEX IF NOT EXISTS idx_notification_logs_provider_msg
  ON staynest_notification_logs(provider_message_id)
  WHERE provider_message_id IS NOT NULL;

-- Index for pending notification queries (used by sendPendingNotifications)
CREATE INDEX IF NOT EXISTS idx_notification_logs_pending_org
  ON staynest_notification_logs(organization_id, status)
  WHERE status = 'pending';
