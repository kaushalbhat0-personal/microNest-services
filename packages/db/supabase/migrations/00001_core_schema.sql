-- ============================================================================
-- MicroNest Core Schema — Migration 00001
-- Multi-tenant, multi-ecosystem foundation
-- ============================================================================

-- 0. ENUMS -------------------------------------------------------------------

CREATE TYPE organization_role AS ENUM ('owner', 'admin', 'member');
CREATE TYPE subscription_status AS ENUM ('active', 'trial', 'past_due', 'cancelled', 'expired');
CREATE TYPE ecosystem_slug AS ENUM ('staynest', 'clinicnest', 'freelancenest', 'propertynest');

-- 1. PROFILES (extends auth.users) ------------------------------------------

CREATE TABLE profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. ORGANIZATIONS (multi-tenant containers) ---------------------------------

CREATE TABLE organizations (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  slug        TEXT        NOT NULL UNIQUE,
  logo_url    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. ORGANIZATION MEMBERS ----------------------------------------------------

CREATE TABLE organization_members (
  id              UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID              NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id         UUID              NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role            organization_role NOT NULL DEFAULT 'member',
  created_at      TIMESTAMPTZ       NOT NULL DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- 4. ECOSYSTEMS (reference / lookup) ----------------------------------------

CREATE TABLE ecosystems (
  id          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        ecosystem_slug  NOT NULL UNIQUE,
  name        TEXT            NOT NULL,
  description TEXT,
  is_active   BOOLEAN         NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ     NOT NULL DEFAULT now()
);

-- 5. ORGANIZATION ⟷ ECOSYSTEM activation ------------------------------------

CREATE TABLE organization_ecosystems (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  ecosystem_id    UUID        NOT NULL REFERENCES ecosystems(id) ON DELETE CASCADE,
  settings        JSONB       DEFAULT '{}',
  activated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, ecosystem_id)
);

-- 6. SUBSCRIPTIONS -----------------------------------------------------------

CREATE TABLE subscriptions (
  id                      UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id         UUID                NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  plan_name               TEXT                NOT NULL DEFAULT 'free',
  status                  subscription_status NOT NULL DEFAULT 'trial',
  trial_ends_at           TIMESTAMPTZ,
  current_period_starts_at TIMESTAMPTZ        NOT NULL DEFAULT now(),
  current_period_ends_at   TIMESTAMPTZ,
  created_at              TIMESTAMPTZ         NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ         NOT NULL DEFAULT now()
);

-- 7. AUDIT LOGS --------------------------------------------------------------

CREATE TABLE audit_logs (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID        REFERENCES organizations(id) ON DELETE SET NULL,
  user_id         UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  action          TEXT        NOT NULL,
  entity_type     TEXT        NOT NULL,
  entity_id       UUID,
  metadata        JSONB       DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. INDEXES -----------------------------------------------------------------

CREATE INDEX idx_profiles_email                  ON profiles(email);
CREATE INDEX idx_organization_members_user       ON organization_members(user_id);
CREATE INDEX idx_organization_members_org        ON organization_members(organization_id);
CREATE INDEX idx_organization_ecosystems_org     ON organization_ecosystems(organization_id);
CREATE INDEX idx_subscriptions_org               ON subscriptions(organization_id);
CREATE INDEX idx_audit_logs_org                  ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_user                 ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created              ON audit_logs(created_at DESC);
CREATE INDEX idx_organizations_slug              ON organizations(slug);
CREATE INDEX idx_ecosystems_slug                 ON ecosystems(slug);

-- 9. TRIGGERS -----------------------------------------------------------------

-- Auto-create profile row when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at on row mutation
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 10. ROW-LEVEL SECURITY -----------------------------------------------------

ALTER TABLE profiles                ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations           ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members    ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_ecosystems ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs              ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystems              ENABLE ROW LEVEL SECURITY;

-- Profiles: users own their own row
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Organizations: members can view orgs they belong to
CREATE POLICY "organizations_select_member"
  ON organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = id AND user_id = auth.uid()
    )
  );

-- Organization members: members can view the member list
CREATE POLICY "org_members_select_member"
  ON organization_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = organization_members.organization_id
        AND user_id = auth.uid()
    )
  );

-- Organization ecosystems: members can view
CREATE POLICY "org_ecosystems_select_member"
  ON organization_ecosystems FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = organization_ecosystems.organization_id
        AND user_id = auth.uid()
    )
  );

-- Subscriptions: members can view
CREATE POLICY "subscriptions_select_member"
  ON subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = subscriptions.organization_id
        AND user_id = auth.uid()
    )
  );

-- Audit logs: members can view logs for their org, or global logs
CREATE POLICY "audit_logs_select_member"
  ON audit_logs FOR SELECT
  USING (
    organization_id IS NULL
    OR EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = audit_logs.organization_id
        AND user_id = auth.uid()
    )
  );

-- Ecosystems lookup: everyone can read (public reference)
CREATE POLICY "ecosystems_select_all"
  ON ecosystems FOR SELECT
  USING (true);
