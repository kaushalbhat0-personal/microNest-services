export const APP_NAME = 'MicroNest'
export const APP_DESCRIPTION =
  'A unified platform for niche ecosystems — manage your business, your way.'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export const ECOSYSTEMS = [
  {
    id: 'staynest',
    name: 'StayNest',
    slug: 'staynest',
    tagline: 'For PG & Hostel Owners',
    description:
      'Manage listings, tenants, payments, and operations for paying guest accommodations and hostels.',
    href: '/ecosystems/staynest',
  },
  {
    id: 'clinicnest',
    name: 'ClinicNest',
    slug: 'clinicnest',
    tagline: 'For Clinics & Practices',
    description:
      'Appointment scheduling, patient records, billing, and practice management for clinics.',
    href: '/ecosystems/clinicnest',
  },
  {
    id: 'freelancenest',
    name: 'FreelanceNest',
    slug: 'freelancenest',
    tagline: 'For Freelancers',
    description:
      'Project tracking, invoicing, client management, and portfolio tools for freelancers.',
    href: '/ecosystems/freelancenest',
  },
  {
    id: 'propertynest',
    name: 'PropertyNest',
    slug: 'propertynest',
    tagline: 'For Real Estate',
    description:
      'Property listings, inquiries, tours, and deal management for real estate professionals.',
    href: '/ecosystems/propertynest',
  },
] as const

export type EcosystemId = (typeof ECOSYSTEMS)[number]['id']
