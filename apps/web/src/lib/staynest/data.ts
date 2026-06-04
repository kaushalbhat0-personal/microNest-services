// === Visitor Log ===

export type VisitorStatus = 'checked-in' | 'checked-out'

export interface Visitor {
  id: string
  name: string
  phone: string
  purpose: string
  roomNumber: string
  checkIn: string
  checkOut: string | null
  status: VisitorStatus
}

export const VISITOR_PLACEHOLDERS: Visitor[] = [
  {
    id: 'v1',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    purpose: 'Friend visit',
    roomNumber: '203',
    checkIn: '2026-06-05T10:30:00',
    checkOut: '2026-06-05T14:00:00',
    status: 'checked-out',
  },
  {
    id: 'v2',
    name: 'Priya Patel',
    phone: '+91 87654 32109',
    purpose: 'Family member',
    roomNumber: '105',
    checkIn: '2026-06-05T09:00:00',
    checkOut: null,
    status: 'checked-in',
  },
  {
    id: 'v3',
    name: 'Amit Kumar',
    phone: '+91 76543 21098',
    purpose: 'Maintenance visit',
    roomNumber: '301',
    checkIn: '2026-06-04T16:00:00',
    checkOut: '2026-06-04T17:30:00',
    status: 'checked-out',
  },
  {
    id: 'v4',
    name: 'Neha Gupta',
    phone: '+91 65432 10987',
    purpose: 'Delivery',
    roomNumber: '102',
    checkIn: '2026-06-05T11:15:00',
    checkOut: null,
    status: 'checked-in',
  },
]

// === Complaints ===

export type ComplaintPriority = 'low' | 'medium' | 'high'
export type ComplaintStatus = 'open' | 'in-progress' | 'resolved'

export interface Complaint {
  id: string
  title: string
  description: string
  raisedBy: string
  roomNumber: string
  date: string
  priority: ComplaintPriority
  status: ComplaintStatus
}

export const COMPLAINT_PLACEHOLDERS: Complaint[] = [
  {
    id: 'c1',
    title: 'AC not cooling',
    description: 'The AC in room 203 has been blowing warm air since yesterday evening.',
    raisedBy: 'Vikram Singh',
    roomNumber: '203',
    date: '2026-06-04',
    priority: 'high',
    status: 'in-progress',
  },
  {
    id: 'c2',
    title: 'Leaking washroom tap',
    description: 'The washroom tap is leaking continuously and water is pooling on the floor.',
    raisedBy: 'Sneha Reddy',
    roomNumber: '105',
    date: '2026-06-03',
    priority: 'medium',
    status: 'open',
  },
  {
    id: 'c3',
    title: 'WiFi not working',
    description: 'Internet connection in room 301 has been down since morning.',
    raisedBy: 'Arjun Nair',
    roomNumber: '301',
    date: '2026-06-02',
    priority: 'high',
    status: 'resolved',
  },
  {
    id: 'c4',
    title: 'Broken cupboard door',
    description: 'The cupboard door hinge is broken and the door is hanging loose.',
    raisedBy: 'Priya Patel',
    roomNumber: '105',
    date: '2026-06-01',
    priority: 'low',
    status: 'resolved',
  },
]

// === Rent Reminder ===

export type RentStatus = 'paid' | 'pending' | 'overdue'

export interface RentEntry {
  id: string
  tenantName: string
  roomNumber: string
  amount: number
  dueDate: string
  status: RentStatus
  paidDate: string | null
  month: string
}

export const RENT_PLACEHOLDERS: RentEntry[] = [
  {
    id: 'r1',
    tenantName: 'Vikram Singh',
    roomNumber: '203',
    amount: 8000,
    dueDate: '2026-06-05',
    status: 'pending',
    paidDate: null,
    month: 'June 2026',
  },
  {
    id: 'r2',
    tenantName: 'Sneha Reddy',
    roomNumber: '105',
    amount: 12000,
    dueDate: '2026-06-01',
    status: 'overdue',
    paidDate: null,
    month: 'June 2026',
  },
  {
    id: 'r3',
    tenantName: 'Arjun Nair',
    roomNumber: '301',
    amount: 10000,
    dueDate: '2026-06-10',
    status: 'paid',
    paidDate: '2026-06-03',
    month: 'June 2026',
  },
  {
    id: 'r4',
    tenantName: 'Neha Gupta',
    roomNumber: '102',
    amount: 9000,
    dueDate: '2026-06-07',
    status: 'pending',
    paidDate: null,
    month: 'June 2026',
  },
  {
    id: 'r5',
    tenantName: 'Rahul Sharma',
    roomNumber: '202',
    amount: 7500,
    dueDate: '2026-05-30',
    status: 'overdue',
    paidDate: null,
    month: 'May 2026',
  },
]

// === Overview Stats ===

export interface StayNestStats {
  totalRooms: number
  occupiedRooms: number
  availableRooms: number
  occupancyRate: number
  openComplaints: number
  pendingRentCount: number
  pendingRentAmount: number
  monthlyRevenue: number
}

export const STATS: StayNestStats = {
  totalRooms: 20,
  occupiedRooms: 16,
  availableRooms: 4,
  occupancyRate: 80,
  openComplaints: 2,
  pendingRentCount: 3,
  pendingRentAmount: 30000,
  monthlyRevenue: 78000,
}
