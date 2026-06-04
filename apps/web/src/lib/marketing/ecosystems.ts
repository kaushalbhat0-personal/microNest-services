export type EcosystemStatus = 'active' | 'coming-soon'

export interface ExplorerEcosystem {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  href: string
  status: EcosystemStatus
  toolCount: number
  color: string
  icon: string
}

export const EXPLORER_ECOSYSTEMS: ExplorerEcosystem[] = [
  {
    id: 'staynest',
    name: 'StayNest',
    slug: 'staynest',
    tagline: 'For PG & Hostel Owners',
    description:
      'Manage listings, tenants, payments, and operations for paying guest accommodations and hostels.',
    href: '/ecosystems/staynest',
    status: 'active',
    toolCount: 3,
    color: 'amber',
    icon: 'S',
  },
  {
    id: 'clinicnest',
    name: 'ClinicNest',
    slug: 'clinicnest',
    tagline: 'For Clinics & Practices',
    description:
      'Appointment scheduling, patient records, billing, and practice management for clinics.',
    href: '/ecosystems/clinicnest',
    status: 'active',
    toolCount: 3,
    color: 'teal',
    icon: 'C',
  },
  {
    id: 'freelancenest',
    name: 'FreelanceNest',
    slug: 'freelancenest',
    tagline: 'For Freelancers',
    description:
      'Project tracking, invoicing, client management, and portfolio tools for freelancers.',
    href: '/ecosystems/freelancenest',
    status: 'coming-soon',
    toolCount: 0,
    color: 'blue',
    icon: 'F',
  },
  {
    id: 'propertynest',
    name: 'PropertyNest',
    slug: 'propertynest',
    tagline: 'For Real Estate',
    description:
      'Property listings, inquiries, tours, and deal management for real estate professionals.',
    href: '/ecosystems/propertynest',
    status: 'coming-soon',
    toolCount: 0,
    color: 'purple',
    icon: 'P',
  },
]
