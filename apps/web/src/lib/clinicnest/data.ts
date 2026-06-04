// === Appointments ===

export type AppointmentStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled'

export interface Appointment {
  id: string
  patientName: string
  phone: string
  reason: string
  doctorName: string
  date: string
  time: string
  status: AppointmentStatus
}

export const APPOINTMENT_PLACEHOLDERS: Appointment[] = [
  {
    id: 'a1',
    patientName: 'Ananya Verma',
    phone: '+91 99887 76655',
    reason: 'General checkup',
    doctorName: 'Dr. Sharma',
    date: '2026-06-05',
    time: '09:00',
    status: 'scheduled',
  },
  {
    id: 'a2',
    patientName: 'Rohit Mehta',
    phone: '+91 88776 65544',
    reason: 'Follow-up',
    doctorName: 'Dr. Patel',
    date: '2026-06-05',
    time: '10:30',
    status: 'in-progress',
  },
  {
    id: 'a3',
    patientName: 'Kavita Joshi',
    phone: '+91 77665 54433',
    reason: 'Vaccination',
    doctorName: 'Dr. Sharma',
    date: '2026-06-05',
    time: '11:00',
    status: 'completed',
  },
  {
    id: 'a4',
    patientName: 'Suresh Kumar',
    phone: '+91 66554 43322',
    reason: 'Chest pain',
    doctorName: 'Dr. Patel',
    date: '2026-06-04',
    time: '14:00',
    status: 'completed',
  },
  {
    id: 'a5',
    patientName: 'Meera Nair',
    phone: '+91 55443 32211',
    reason: 'Eye infection',
    doctorName: 'Dr. Khan',
    date: '2026-06-05',
    time: '15:00',
    status: 'scheduled',
  },
]

// === Patient Records ===

export interface Patient {
  id: string
  name: string
  phone: string
  age: number
  gender: string
  lastVisit: string | null
  condition: string
}

export const PATIENT_PLACEHOLDERS: Patient[] = [
  {
    id: 'p1',
    name: 'Ananya Verma',
    phone: '+91 99887 76655',
    age: 28,
    gender: 'Female',
    lastVisit: '2026-06-05',
    condition: 'General checkup',
  },
  {
    id: 'p2',
    name: 'Rohit Mehta',
    phone: '+91 88776 65544',
    age: 45,
    gender: 'Male',
    lastVisit: '2026-06-05',
    condition: 'Follow-up',
  },
  {
    id: 'p3',
    name: 'Kavita Joshi',
    phone: '+91 77665 54433',
    age: 32,
    gender: 'Female',
    lastVisit: '2026-06-05',
    condition: 'Vaccination',
  },
  {
    id: 'p4',
    name: 'Suresh Kumar',
    phone: '+91 66554 43322',
    age: 58,
    gender: 'Male',
    lastVisit: '2026-06-04',
    condition: 'Chest pain',
  },
  {
    id: 'p5',
    name: 'Meera Nair',
    phone: '+91 55443 32211',
    age: 35,
    gender: 'Female',
    lastVisit: '2026-05-28',
    condition: 'Eye infection',
  },
]

// === Prescriptions ===

export type PrescriptionStatus = 'active' | 'completed'

export interface Prescription {
  id: string
  patientName: string
  medication: string
  dosage: string
  prescribedBy: string
  date: string
  status: PrescriptionStatus
}

export const PRESCRIPTION_PLACEHOLDERS: Prescription[] = [
  {
    id: 'rx1',
    patientName: 'Rohit Mehta',
    medication: 'Amlodipine 5mg',
    dosage: 'Once daily',
    prescribedBy: 'Dr. Patel',
    date: '2026-06-05',
    status: 'active',
  },
  {
    id: 'rx2',
    patientName: 'Kavita Joshi',
    medication: 'Paracetamol 650mg',
    dosage: 'Twice daily for 3 days',
    prescribedBy: 'Dr. Sharma',
    date: '2026-06-05',
    status: 'active',
  },
  {
    id: 'rx3',
    patientName: 'Suresh Kumar',
    medication: 'Aspirin 100mg',
    dosage: 'Once daily',
    prescribedBy: 'Dr. Patel',
    date: '2026-06-04',
    status: 'active',
  },
  {
    id: 'rx4',
    patientName: 'Ananya Verma',
    medication: 'Multivitamin',
    dosage: 'Once daily',
    prescribedBy: 'Dr. Sharma',
    date: '2026-05-30',
    status: 'completed',
  },
]

// === Overview Stats ===

export interface ClinicStats {
  todayAppointments: number
  completedToday: number
  totalPatients: number
  activePrescriptions: number
  doctorsOnDuty: number
}

export const CLINIC_STATS: ClinicStats = {
  todayAppointments: 12,
  completedToday: 5,
  totalPatients: 248,
  activePrescriptions: 34,
  doctorsOnDuty: 3,
}
