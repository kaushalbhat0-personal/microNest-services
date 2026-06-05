-- ============================================================================
-- Seed ecosystems reference table
-- ============================================================================
-- The ecosystems table is a static lookup. No INSERT ever existed in migrations
-- so the table has zero rows. All onboarding flows fail at
-- "Selected ecosystems not found." because .select('id, slug').in('slug', ...)
-- returns an empty array.
-- ============================================================================

insert into ecosystems (slug, name, description) values
  ('staynest',       'StayNest',       'Visitor, resident, and room management for hostels and PGs'),
  ('clinicnest',     'ClinicNest',     'Clinic and patient management'),
  ('freelancenest',  'FreelanceNest',  'Freelancer project and client management'),
  ('propertynest',   'PropertyNest',   'Property listing and rental management');
