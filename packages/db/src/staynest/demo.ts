import type { DBClient } from '../types'

export async function isOrganizationEmpty(
  supabase: DBClient,
  organizationId: string
): Promise<boolean> {
  const tables = [
    'staynest_rooms',
    'staynest_residents',
    'staynest_rent_records',
    'staynest_maintenance_requests',
    'staynest_visitors',
    'staynest_announcements',
  ] as const

  for (const table of tables) {
    const { count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
    if ((count ?? 0) > 0) return false
  }

  return true
}

// ── Room data ────────────────────────────────────────────────────────

const ROOM_DATA = [
  { room_number: '101', floor: 1, capacity: 1, rent_per_bed: 8000 },
  { room_number: '102', floor: 1, capacity: 1, rent_per_bed: 7500 },
  { room_number: '103', floor: 1, capacity: 1, rent_per_bed: 8500 },
  { room_number: '104', floor: 1, capacity: 1, rent_per_bed: 7000 },
  { room_number: '105', floor: 1, capacity: 1, rent_per_bed: 9000 },
  { room_number: '201', floor: 2, capacity: 2, rent_per_bed: 6000 },
  { room_number: '202', floor: 2, capacity: 2, rent_per_bed: 5500 },
  { room_number: '203', floor: 2, capacity: 2, rent_per_bed: 6500 },
  { room_number: '204', floor: 2, capacity: 2, rent_per_bed: 5000 },
  { room_number: '205', floor: 2, capacity: 2, rent_per_bed: 7000 },
  { room_number: '301', floor: 3, capacity: 3, rent_per_bed: 4500 },
  { room_number: '302', floor: 3, capacity: 3, rent_per_bed: 4000 },
  { room_number: '303', floor: 3, capacity: 3, rent_per_bed: 5000 },
  { room_number: '304', floor: 3, capacity: 3, rent_per_bed: 4200 },
  { room_number: '305', floor: 3, capacity: 3, rent_per_bed: 4800 },
]

// ── Resident data ────────────────────────────────────────────────────

const RESIDENT_DATA = [
  { full_name: 'Rahul Sharma', phone: '9876543210', gender: 'male', emergency_contact_name: 'Suresh Sharma', emergency_contact_phone: '9812345670', room_number: '101', check_in_date: '2026-01-15' },
  { full_name: 'Amit Verma', phone: '9876543211', gender: 'male', emergency_contact_name: 'Raj Verma', emergency_contact_phone: '9812345671', room_number: '101', check_in_date: '2026-02-01' },
  { full_name: 'Sneha Reddy', phone: '9876543212', gender: 'female', emergency_contact_name: 'Krishna Reddy', emergency_contact_phone: '9812345672', room_number: '102', check_in_date: '2026-01-10' },
  { full_name: 'Priya Patel', phone: '9876543213', gender: 'female', emergency_contact_name: 'Ashok Patel', emergency_contact_phone: '9812345673', room_number: '103', check_in_date: '2026-03-05' },
  { full_name: 'Arjun Nair', phone: '9876543214', gender: 'male', emergency_contact_name: 'Gopal Nair', emergency_contact_phone: '9812345674', room_number: '104', check_in_date: '2026-01-20' },
  { full_name: 'Neha Gupta', phone: '9876543215', gender: 'female', emergency_contact_name: 'Ravi Gupta', emergency_contact_phone: '9812345675', room_number: '105', check_in_date: '2026-02-15' },
  { full_name: 'Vikram Singh', phone: '9876543216', gender: 'male', emergency_contact_name: 'Dharam Singh', emergency_contact_phone: '9812345676', room_number: '201', check_in_date: '2026-01-05' },
  { full_name: 'Ananya Joshi', phone: '9876543217', gender: 'female', emergency_contact_name: 'Mohan Joshi', emergency_contact_phone: '9812345677', room_number: '201', check_in_date: '2026-02-20' },
  { full_name: 'Rohit Malhotra', phone: '9876543218', gender: 'male', emergency_contact_name: 'Sunil Malhotra', emergency_contact_phone: '9812345678', room_number: '202', check_in_date: '2026-03-01' },
  { full_name: 'Pooja Deshmukh', phone: '9876543219', gender: 'female', emergency_contact_name: 'Vijay Deshmukh', emergency_contact_phone: '9812345679', room_number: '202', check_in_date: '2026-01-25' },
  { full_name: 'Karan Mehta', phone: '9876543220', gender: 'male', emergency_contact_name: 'Deepak Mehta', emergency_contact_phone: '9812345680', room_number: '203', check_in_date: '2026-02-10' },
  { full_name: 'Divya Kulkarni', phone: '9876543221', gender: 'female', emergency_contact_name: 'Sanjay Kulkarni', emergency_contact_phone: '9812345681', room_number: '203', check_in_date: '2026-03-15' },
  { full_name: 'Manish Tiwari', phone: '9876543222', gender: 'male', emergency_contact_name: 'Akash Tiwari', emergency_contact_phone: '9812345682', room_number: '204', check_in_date: '2026-01-12' },
  { full_name: 'Swati Bansal', phone: '9876543223', gender: 'female', emergency_contact_name: 'Rakesh Bansal', emergency_contact_phone: '9812345683', room_number: '204', check_in_date: '2026-02-05' },
  { full_name: 'Harsh Vardhan', phone: '9876543224', gender: 'male', emergency_contact_name: 'Om Vardhan', emergency_contact_phone: '9812345684', room_number: '205', check_in_date: '2026-03-10' },
  { full_name: 'Isha Saxena', phone: '9876543225', gender: 'female', emergency_contact_name: 'Ajay Saxena', emergency_contact_phone: '9812345685', room_number: '205', check_in_date: '2026-01-18' },
  { full_name: 'Gaurav Yadav', phone: '9876543226', gender: 'male', emergency_contact_name: 'Ram Yadav', emergency_contact_phone: '9812345686', room_number: '301', check_in_date: '2026-02-22' },
  { full_name: 'Kriti Agarwal', phone: '9876543227', gender: 'female', emergency_contact_name: 'Shyam Agarwal', emergency_contact_phone: '9812345687', room_number: '301', check_in_date: '2026-03-20' },
  { full_name: 'Ravi Shankar', phone: '9876543228', gender: 'male', emergency_contact_name: 'Mohan Shankar', emergency_contact_phone: '9812345688', room_number: '301', check_in_date: '2026-04-01' },
  { full_name: 'Tanvi Kapoor', phone: '9876543229', gender: 'female', emergency_contact_name: 'Anil Kapoor', emergency_contact_phone: '9812345689', room_number: '302', check_in_date: '2026-01-28' },
  { full_name: 'Aditya Bhat', phone: '9876543230', gender: 'male', emergency_contact_name: 'Keshav Bhat', emergency_contact_phone: '9812345690', room_number: '302', check_in_date: '2026-02-14' },
  { full_name: 'Nandini Rao', phone: '9876543231', gender: 'female', emergency_contact_name: 'Prakash Rao', emergency_contact_phone: '9812345691', room_number: '302', check_in_date: '2026-03-25' },
  { full_name: 'Siddharth Jain', phone: '9876543232', gender: 'male', emergency_contact_name: 'Lalit Jain', emergency_contact_phone: '9812345692', room_number: '303', check_in_date: '2026-04-05' },
  { full_name: 'Aisha Khan', phone: '9876543233', gender: 'female', emergency_contact_name: 'Imran Khan', emergency_contact_phone: '9812345693', room_number: '303', check_in_date: '2026-01-08' },
  { full_name: 'Pranav Mishra', phone: '9876543234', gender: 'male', emergency_contact_name: 'Shiv Mishra', emergency_contact_phone: '9812345694', room_number: '303', check_in_date: '2026-02-18' },
  { full_name: 'Shreya Pandey', phone: '9876543235', gender: 'female', emergency_contact_name: 'Vishal Pandey', emergency_contact_phone: '9812345695', room_number: '304', check_in_date: '2026-03-12' },
  { full_name: 'Lokesh Chauhan', phone: '9876543236', gender: 'male', emergency_contact_name: 'Dinesh Chauhan', emergency_contact_phone: '9812345696', room_number: '304', check_in_date: '2026-04-10' },
  { full_name: 'Megha Thakur', phone: '9876543237', gender: 'female', emergency_contact_name: 'Raj Thakur', emergency_contact_phone: '9812345697', room_number: '304', check_in_date: '2026-01-30' },
  { full_name: 'Nikhil Dutta', phone: '9876543238', gender: 'male', emergency_contact_name: 'Arun Dutta', emergency_contact_phone: '9812345698', room_number: '305', check_in_date: '2026-02-25' },
  { full_name: 'Kavita Joshi', phone: '9876543239', gender: 'female', emergency_contact_name: 'Mahesh Joshi', emergency_contact_phone: '9812345699', room_number: '305', check_in_date: '2026-03-30' },
]

// ── Maintenance request data ─────────────────────────────────────────

const MAINTENANCE_DATA = [
  { title: 'AC not cooling properly', description: 'The AC in the room has been blowing warm air since last night.', category: 'electrical', priority: 'high' },
  { title: 'Leaking washroom tap', description: 'The washroom sink tap is leaking continuously.', category: 'plumbing', priority: 'medium' },
  { title: 'WiFi not working', description: 'Internet connection has been down since morning.', category: 'internet', priority: 'high' },
  { title: 'Broken cupboard door', description: 'The cupboard door hinge is broken.', category: 'furniture', priority: 'low' },
  { title: 'Water cooler not working', description: 'Common area water cooler not dispensing cold water.', category: 'plumbing', priority: 'medium' },
  { title: 'Geyser not heating', description: 'The geyser in bathroom is not heating water properly.', category: 'electrical', priority: 'high' },
  { title: 'Window glass cracked', description: 'Window glass got cracked during the storm.', category: 'other', priority: 'low' },
  { title: 'Mosquito problem', description: 'Too many mosquitoes in the room. Need fumigation.', category: 'cleaning', priority: 'medium' },
  { title: 'Fan regulator stuck', description: 'Ceiling fan regulator is stuck at full speed.', category: 'electrical', priority: 'low' },
  { title: 'Main gate lock broken', description: 'Main entry gate lock is jammed.', category: 'furniture', priority: 'high' },
]

// ── Visitor data ─────────────────────────────────────────────────────

const VISITOR_DATA = [
  { name: 'Rohan Gupta', phone: '9988776651', purpose: 'Friend visit', room_number: '101' },
  { name: 'Meera Sharma', phone: '9988776652', purpose: 'Family member', room_number: '102' },
  { name: 'Ajay Kumar', phone: '9988776653', purpose: 'Maintenance visit', room_number: '104' },
  { name: 'Sunita Devi', phone: '9988776654', purpose: 'Mother visit', room_number: '103' },
  { name: 'Vijay Pandey', phone: '9988776655', purpose: 'Friend visit', room_number: '201' },
  { name: 'Anjali Singh', phone: '9988776656', purpose: 'Sister visit', room_number: '202' },
  { name: 'Deepak Verma', phone: '9988776657', purpose: 'Delivery', room_number: '203' },
  { name: 'Kiran Joshi', phone: '9988776658', purpose: 'Friend visit', room_number: '204' },
  { name: 'Manoj Tiwari', phone: '9988776659', purpose: 'Father visit', room_number: '205' },
  { name: 'Pooja Nair', phone: '9988776660', purpose: 'Family member', room_number: '105' },
  { name: 'Rakesh Yadav', phone: '9988776661', purpose: 'Friend visit', room_number: '301' },
  { name: 'Neelam Agarwal', phone: '9988776662', purpose: 'Mother visit', room_number: '302' },
  { name: 'Sanjay Kapoor', phone: '9988776663', purpose: 'Brother visit', room_number: '303' },
  { name: 'Aarti Bhat', phone: '9988776664', purpose: 'Friend visit', room_number: '304' },
  { name: 'Ganesh Rao', phone: '9988776665', purpose: 'Maintenance visit', room_number: '305' },
  { name: 'Lalita Jain', phone: '9988776666', purpose: 'Family member', room_number: '101' },
  { name: 'Prakash Mishra', phone: '9988776667', purpose: 'Friend visit', room_number: '102' },
  { name: 'Kavita Thakur', phone: '9988776668', purpose: 'Friend visit', room_number: '201' },
  { name: 'Suresh Dutta', phone: '9988776669', purpose: 'Delivery', room_number: '301' },
  { name: 'Renu Shankar', phone: '9988776670', purpose: 'Family member', room_number: '302' },
]

const ANNOUNCEMENT_DATA = [
  { title: 'Annual Maintenance Week', message: 'The building will undergo annual maintenance from June 20 to June 25. Water supply will be interrupted between 10 AM and 4 PM on these days.', priority: 'important' },
  { title: 'Diwali Celebration', message: 'We are organizing a Diwali celebration in the common hall on June 15th at 7 PM. All residents are cordially invited.', priority: 'normal' },
  { title: 'New WiFi Password', message: 'The WiFi password has been updated. New password: StayNest@2026. Please update your devices.', priority: 'important' },
  { title: 'Cleaning Schedule Update', message: 'Common area cleaning will now happen on Mondays, Wednesdays, and Fridays.', priority: 'normal' },
  { title: 'Guest Entry Policy Reminder', message: 'All guests must register at the front desk. Guest entry is allowed between 8 AM and 9 PM.', priority: 'urgent' },
]

function getDaysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

export async function seedDemoData(
  supabase: DBClient,
  organizationId: string,
  userId: string
): Promise<void> {
  // 1. Seed rooms
  const { data: rooms } = await supabase
    .from('staynest_rooms')
    .insert(
      ROOM_DATA.map((room) => ({
        organization_id: organizationId,
        ...room,
        status: 'available',
        occupied_beds: 0,
        created_by: userId,
      }))
    )
    .select('id, room_number')

  if (!rooms) throw new Error('Failed to create rooms')
  const roomMap = new Map(rooms.map((r) => [r.room_number, r.id]))

  // 2. Seed residents and track resident IDs + room occupancy
  const residentInserts = RESIDENT_DATA.map((r) => ({
    organization_id: organizationId,
    full_name: r.full_name,
    phone: r.phone,
    gender: r.gender,
    emergency_contact_name: r.emergency_contact_name,
    emergency_contact_phone: r.emergency_contact_phone,
    email: null,
    id_proof_type: null,
    id_proof_number: null,
    room_id: roomMap.get(r.room_number) ?? null,
    check_in_date: r.check_in_date,
    status: 'active' as const,
    created_by: userId,
  }))

  const { data: residents } = await supabase
    .from('staynest_residents')
    .insert(residentInserts)
    .select('id, full_name, room_id')

  if (!residents) throw new Error('Failed to create residents')

  // Update room occupancy
  const roomOccupancy = new Map<string, number>()
  for (const r of residents) {
    if (r.room_id) {
      roomOccupancy.set(r.room_id, (roomOccupancy.get(r.room_id) ?? 0) + 1)
    }
  }
  for (const [roomId, count] of roomOccupancy) {
    const status = count >= (ROOM_DATA.find((rd) => roomMap.get(rd.room_number) === roomId)?.capacity ?? 1)
      ? 'full' : 'partially_occupied'
    await supabase
      .from('staynest_rooms')
      .update({ occupied_beds: count, status })
      .eq('id', roomId)
      .eq('organization_id', organizationId)
  }

  // 3. Seed rent records (mix of paid, pending, overdue)
  const rentRecords: {
    organization_id: string
    resident_id: string
    room_id: string | null
    billing_month: number
    billing_year: number
    amount: number
    due_date: string
    status: 'pending' | 'paid' | 'overdue'
    paid_at: string | null
    payment_method: string | null
    notes: string | null
    created_by: string
  }[] = []

  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  const PAYMENT_METHODS = ['cash', 'upi', 'bank_transfer'] as const

  for (let rIdx = 0; rIdx < residents.length; rIdx++) {
    const resident = residents[rIdx]
    const roomNumber = RESIDENT_DATA[rIdx].room_number
    const room = ROOM_DATA.find((rd) => rd.room_number === roomNumber)
    const amount = room?.rent_per_bed ?? 5000
    const roomId = roomMap.get(roomNumber) ?? null

    for (let offset = 0; offset < 3; offset++) {
      let month = currentMonth - offset
      let year = currentYear
      if (month <= 0) { month += 12; year -= 1 }

      const dueDate = new Date(year, month - 1, 5)
      const idx = rIdx * 3 + offset

      const STATUSES: ('pending' | 'paid' | 'overdue')[][] = [
        ['pending', 'paid', 'pending', 'pending', 'paid', 'paid'],
        ['paid', 'paid', 'paid', 'pending', 'overdue', 'paid'],
        ['paid', 'paid', 'overdue', 'paid', 'paid', 'paid'],
      ]

      let status = STATUSES[offset][idx % 6]
      let paidAt: string | null = null
      let paymentMethod: string | null = null

      if (status === 'paid') {
        paidAt = getDaysAgo((idx % 20) + 5)
        paymentMethod = PAYMENT_METHODS[idx % 3]
      }

      rentRecords.push({
        organization_id: organizationId,
        resident_id: resident.id,
        room_id: roomId,
        billing_month: month,
        billing_year: year,
        amount,
        due_date: dueDate.toISOString(),
        status,
        paid_at: paidAt,
        payment_method: paymentMethod,
        notes: null,
        created_by: userId,
      })
    }
  }

  const { error: rentError } = await supabase
    .from('staynest_rent_records')
    .insert(rentRecords)
  if (rentError) throw new Error('Failed to create rent records')

  // 4. Seed maintenance requests
  const maintInserts = MAINTENANCE_DATA.map((m, i) => ({
    organization_id: organizationId,
    ...m,
    status: (['open', 'in_progress', 'resolved', 'assigned', 'closed'] as const)[i % 5],
    resident_id: residents?.[i % residents.length]?.id ?? null,
    room_id: residents?.[i % residents.length]?.room_id ?? null,
    created_by: userId,
  }))

  const { error: maintError } = await supabase
    .from('staynest_maintenance_requests')
    .insert(maintInserts)
  if (maintError) throw new Error('Failed to create maintenance requests')

  // 5. Seed visitors
  const visitorInserts = VISITOR_DATA.map((v, i) => {
    const checkedOut = i % 3 !== 0
    return {
      organization_id: organizationId,
      name: v.name,
      phone: v.phone,
      purpose: v.purpose,
      room_number: v.room_number,
      resident_id: residents?.[i % residents.length]?.id ?? null,
      status: checkedOut ? 'checked-out' : 'checked-in',
      check_in_at: getDaysAgo(Math.floor(i / 2)),
      check_out_at: checkedOut ? getDaysAgo(Math.floor(i / 3)) : null,
      created_by: userId,
    }
  })

  const { error: visitorError } = await supabase
    .from('staynest_visitors')
    .insert(visitorInserts)
  if (visitorError) throw new Error('Failed to create visitors')

  // 6. Seed announcements
  const announcementInserts = ANNOUNCEMENT_DATA.map((a, i) => ({
    organization_id: organizationId,
    title: a.title,
    message: a.message,
    priority: a.priority,
    publish_date: getDaysAgo(i * 3 + 1).slice(0, 10),
    created_by: userId,
  }))

  const { error: announcementError } = await supabase
    .from('staynest_announcements')
    .insert(announcementInserts)
  if (announcementError) throw new Error('Failed to create announcements')
}
