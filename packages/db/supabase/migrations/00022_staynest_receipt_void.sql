-- Migration 00022: Receipt void/regenerate support
-- Adds status tracking and regeneration chain to staynest_receipts

ALTER TABLE staynest_receipts
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'voided')),
  ADD COLUMN IF NOT EXISTS void_reason TEXT,
  ADD COLUMN IF NOT EXISTS voided_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS voided_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS regenerated_from_id UUID REFERENCES staynest_receipts(id);

CREATE INDEX IF NOT EXISTS idx_receipts_status ON staynest_receipts(status);
CREATE INDEX IF NOT EXISTS idx_receipts_voided_by ON staynest_receipts(voided_by);
