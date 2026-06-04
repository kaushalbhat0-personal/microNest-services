-- ============================================================================
-- MicroNest Seed Data
-- ============================================================================

INSERT INTO ecosystems (slug, name, description, is_active) VALUES
  ('staynest',      'StayNest',      'PG & hostel management — listings, tenants, payments.',        true),
  ('clinicnest',    'ClinicNest',    'Clinic management — appointments, patients, prescriptions.',   true),
  ('freelancenest', 'FreelanceNest', 'Freelancer tools — projects, invoicing, clients.',            false),
  ('propertynest',  'PropertyNest',  'Real estate — listings, inquiries, tours, deals.',            false)
ON CONFLICT (slug) DO NOTHING;
