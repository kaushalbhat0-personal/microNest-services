import type { DBClient } from '../types'

export async function isOrganizationEmpty(
  supabase: DBClient,
  organizationId: string
): Promise<boolean> {
  const tables = [
    'staynest_rooms',
    'staynest_residents',
    'staynest_rent_records',
    'staynest_complaints',
    'staynest_visitors',
    'staynest_notices',
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
  { room_number: '101', room_type: 'single', capacity: 1, monthly_rent: 8000 },
  { room_number: '102', room_type: 'single', capacity: 1, monthly_rent: 7500 },
  { room_number: '103', room_type: 'single', capacity: 1, monthly_rent: 8500 },
  { room_number: '104', room_type: 'single', capacity: 1, monthly_rent: 7000 },
  { room_number: '105', room_type: 'single', capacity: 1, monthly_rent: 9000 },
  { room_number: '201', room_type: 'double', capacity: 2, monthly_rent: 6000 },
  { room_number: '202', room_type: 'double', capacity: 2, monthly_rent: 5500 },
  { room_number: '203', room_type: 'double', capacity: 2, monthly_rent: 6500 },
  { room_number: '204', room_type: 'double', capacity: 2, monthly_rent: 5000 },
  { room_number: '205', room_type: 'double', capacity: 2, monthly_rent: 7000 },
  { room_number: '301', room_type: 'triple', capacity: 3, monthly_rent: 4500 },
  { room_number: '302', room_type: 'triple', capacity: 3, monthly_rent: 4000 },
  { room_number: '303', room_type: 'triple', capacity: 3, monthly_rent: 5000 },
  { room_number: '304', room_type: 'triple', capacity: 3, monthly_rent: 4200 },
  { room_number: '305', room_type: 'triple', capacity: 3, monthly_rent: 4800 },
]

// ── Resident data ────────────────────────────────────────────────────

const RESIDENT_DATA = [
  { full_name: 'Rahul Sharma', phone: '9876543210', gender: 'male', guardian_name: 'Suresh Sharma', guardian_phone: '9812345670', room_number: '101', joining_date: '2026-01-15' },
  { full_name: 'Amit Verma', phone: '9876543211', gender: 'male', guardian_name: 'Raj Verma', guardian_phone: '9812345671', room_number: '101', joining_date: '2026-02-01' },
  { full_name: 'Sneha Reddy', phone: '9876543212', gender: 'female', guardian_name: 'Krishna Reddy', guardian_phone: '9812345672', room_number: '102', joining_date: '2026-01-10' },
  { full_name: 'Priya Patel', phone: '9876543213', gender: 'female', guardian_name: 'Ashok Patel', guardian_phone: '9812345673', room_number: '103', joining_date: '2026-03-05' },
  { full_name: 'Arjun Nair', phone: '9876543214', gender: 'male', guardian_name: 'Gopal Nair', guardian_phone: '9812345674', room_number: '104', joining_date: '2026-01-20' },
  { full_name: 'Neha Gupta', phone: '9876543215', gender: 'female', guardian_name: 'Ravi Gupta', guardian_phone: '9812345675', room_number: '105', joining_date: '2026-02-15' },
  { full_name: 'Vikram Singh', phone: '9876543216', gender: 'male', guardian_name: 'Dharam Singh', guardian_phone: '9812345676', room_number: '201', joining_date: '2026-01-05' },
  { full_name: 'Ananya Joshi', phone: '9876543217', gender: 'female', guardian_name: 'Mohan Joshi', guardian_phone: '9812345677', room_number: '201', joining_date: '2026-02-20' },
  { full_name: 'Rohit Malhotra', phone: '9876543218', gender: 'male', guardian_name: 'Sunil Malhotra', guardian_phone: '9812345678', room_number: '202', joining_date: '2026-03-01' },
  { full_name: 'Pooja Deshmukh', phone: '9876543219', gender: 'female', guardian_name: 'Vijay Deshmukh', guardian_phone: '9812345679', room_number: '202', joining_date: '2026-01-25' },
  { full_name: 'Karan Mehta', phone: '9876543220', gender: 'male', guardian_name: 'Deepak Mehta', guardian_phone: '9812345680', room_number: '203', joining_date: '2026-02-10' },
  { full_name: 'Divya Kulkarni', phone: '9876543221', gender: 'female', guardian_name: 'Sanjay Kulkarni', guardian_phone: '9812345681', room_number: '203', joining_date: '2026-03-15' },
  { full_name: 'Manish Tiwari', phone: '9876543222', gender: 'male', guardian_name: 'Akash Tiwari', guardian_phone: '9812345682', room_number: '204', joining_date: '2026-01-12' },
  { full_name: 'Swati Bansal', phone: '9876543223', gender: 'female', guardian_name: 'Rakesh Bansal', guardian_phone: '9812345683', room_number: '204', joining_date: '2026-02-05' },
  { full_name: 'Harsh Vardhan', phone: '9876543224', gender: 'male', guardian_name: 'Om Vardhan', guardian_phone: '9812345684', room_number: '205', joining_date: '2026-03-10' },
  { full_name: 'Isha Saxena', phone: '9876543225', gender: 'female', guardian_name: 'Ajay Saxena', guardian_phone: '9812345685', room_number: '205', joining_date: '2026-01-18' },
  { full_name: 'Gaurav Yadav', phone: '9876543226', gender: 'male', guardian_name: 'Ram Yadav', guardian_phone: '9812345686', room_number: '301', joining_date: '2026-02-22' },
  { full_name: 'Kriti Agarwal', phone: '9876543227', gender: 'female', guardian_name: 'Shyam Agarwal', guardian_phone: '9812345687', room_number: '301', joining_date: '2026-03-20' },
  { full_name: 'Ravi Shankar', phone: '9876543228', gender: 'male', guardian_name: 'Mohan Shankar', guardian_phone: '9812345688', room_number: '301', joining_date: '2026-04-01' },
  { full_name: 'Tanvi Kapoor', phone: '9876543229', gender: 'female', guardian_name: 'Anil Kapoor', guardian_phone: '9812345689', room_number: '302', joining_date: '2026-01-28' },
  { full_name: 'Aditya Bhat', phone: '9876543230', gender: 'male', guardian_name: 'Keshav Bhat', guardian_phone: '9812345690', room_number: '302', joining_date: '2026-02-14' },
  { full_name: 'Nandini Rao', phone: '9876543231', gender: 'female', guardian_name: 'Prakash Rao', guardian_phone: '9812345691', room_number: '302', joining_date: '2026-03-25' },
  { full_name: 'Siddharth Jain', phone: '9876543232', gender: 'male', guardian_name: 'Lalit Jain', guardian_phone: '9812345692', room_number: '303', joining_date: '2026-04-05' },
  { full_name: 'Aisha Khan', phone: '9876543233', gender: 'female', guardian_name: 'Imran Khan', guardian_phone: '9812345693', room_number: '303', joining_date: '2026-01-08' },
  { full_name: 'Pranav Mishra', phone: '9876543234', gender: 'male', guardian_name: 'Shiv Mishra', guardian_phone: '9812345694', room_number: '303', joining_date: '2026-02-18' },
  { full_name: 'Shreya Pandey', phone: '9876543235', gender: 'female', guardian_name: 'Vishal Pandey', guardian_phone: '9812345695', room_number: '304', joining_date: '2026-03-12' },
  { full_name: 'Lokesh Chauhan', phone: '9876543236', gender: 'male', guardian_name: 'Dinesh Chauhan', guardian_phone: '9812345696', room_number: '304', joining_date: '2026-04-10' },
  { full_name: 'Megha Thakur', phone: '9876543237', gender: 'female', guardian_name: 'Raj Thakur', guardian_phone: '9812345697', room_number: '304', joining_date: '2026-01-30' },
  { full_name: 'Nikhil Dutta', phone: '9876543238', gender: 'male', guardian_name: 'Arun Dutta', guardian_phone: '9812345698', room_number: '305', joining_date: '2026-02-25' },
  { full_name: 'Kavita Joshi', phone: '9876543239', gender: 'female', guardian_name: 'Mahesh Joshi', guardian_phone: '9812345699', room_number: '305', joining_date: '2026-03-30' },
]

// ── Complaint data ───────────────────────────────────────────────────

const COMPLAINT_DATA = [
  { title: 'AC not cooling properly', description: 'The AC in the room has been blowing warm air since last night.', raised_by: 'Rahul Sharma', room_number: '101', priority: 'high' },
  { title: 'Leaking washroom tap', description: 'The washroom sink tap is leaking continuously. Water is pooling on the floor.', raised_by: 'Sneha Reddy', room_number: '102', priority: 'medium' },
  { title: 'WiFi not working', description: 'Internet connection has been down since morning. Need immediate fix.', raised_by: 'Arjun Nair', room_number: '104', priority: 'high' },
  { title: 'Broken cupboard door', description: 'The cupboard door hinge is broken and the door is hanging loose.', raised_by: 'Priya Patel', room_number: '103', priority: 'low' },
  { title: 'Water cooler not working', description: 'The common area water cooler is not dispensing cold water.', raised_by: 'Vikram Singh', room_number: '201', priority: 'medium' },
  { title: 'Geyser not heating', description: 'The geyser in bathroom is not heating water properly.', raised_by: 'Rohit Malhotra', room_number: '202', priority: 'high' },
  { title: 'Window glass cracked', description: 'The window glass in the room got cracked during the storm yesterday.', raised_by: 'Divya Kulkarni', room_number: '203', priority: 'low' },
  { title: 'Mosquito problem', description: 'Too many mosquitoes in the room. Need fumigation.', raised_by: 'Harsh Vardhan', room_number: '205', priority: 'medium' },
  { title: 'Fan regulator stuck', description: 'The ceiling fan regulator is stuck and the fan runs at full speed only.', raised_by: 'Kriti Agarwal', room_number: '301', priority: 'low' },
  { title: 'Main gate lock broken', description: 'The main entry gate lock is jammed and cannot be opened from outside.', raised_by: 'Tanvi Kapoor', room_number: '302', priority: 'high' },
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

const NOTICE_DATA = [
  { title: 'Annual Maintenance Week', content: 'The building will undergo annual maintenance from June 20 to June 25. Water supply will be interrupted between 10 AM and 4 PM on these days. We apologize for the inconvenience.' },
  { title: 'Diwali Celebration - June 15th', content: 'We are organizing a Diwali celebration in the common hall on June 15th at 7 PM. All residents are cordially invited. Please bring a dish to share. Contact the warden for more details.' },
  { title: 'New WiFi Password', content: 'The WiFi password has been updated for security reasons. New password: StayNest@2026. Please update your devices. Contact the front desk if you face any issues.' },
  { title: 'Cleaning Schedule Update', content: 'Starting this week, common area cleaning will happen on Mondays, Wednesdays, and Fridays instead of daily. Room cleaning requests can be submitted at the front desk.' },
  { title: 'Guest Entry Policy Reminder', content: 'All guests must register at the front desk before entering. Guest entry is allowed between 8 AM and 9 PM. Overnight guests require prior approval from the warden. Please cooperate.' },
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
        status: 'active',
        occupied_count: 0,
        created_by: userId,
      }))
    )
    .select('id, room_number')

  if (!rooms) throw new Error('Failed to create rooms')
  const roomMap = new Map(rooms.map((r) => [r.room_number, r.id]))

  // 2. Seed residents and track resident IDs + room occupancy
  const residentInserts = RESIDENT_DATA.map((r) => ({
    organization_id: organizationId,
    ...r,
    status: 'active' as const,
    notes: null,
    email: null,
    created_by: userId,
  }))

  const { data: residents } = await supabase
    .from('staynest_residents')
    .insert(residentInserts)
    .select('id, full_name, room_number')

  if (!residents) throw new Error('Failed to create residents')

  // Update room occupancy counts
  const roomOccupancy = new Map<string, number>()
  for (const r of residents) {
    roomOccupancy.set(r.room_number, (roomOccupancy.get(r.room_number) ?? 0) + 1)
  }
  for (const [roomNumber, count] of roomOccupancy) {
    await supabase
      .from('staynest_rooms')
      .update({ occupied_count: count })
      .eq('organization_id', organizationId)
      .eq('room_number', roomNumber)
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
    const amount = room?.monthly_rent ?? 5000
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

  // 4. Seed complaints
  const complaintInserts = COMPLAINT_DATA.map((c, i) => ({
    organization_id: organizationId,
    ...c,
    status: (['open', 'in-progress', 'resolved'] as const)[i % 3],
    resolved_at: null,
    resolved_by: null,
    created_by: userId,
  }))

  const { error: complaintError } = await supabase
    .from('staynest_complaints')
    .insert(complaintInserts)
  if (complaintError) throw new Error('Failed to create complaints')

  // 5. Seed visitors
  const visitorInserts = VISITOR_DATA.map((v, i) => {
    const checkedOut = i % 3 !== 0
    return {
      organization_id: organizationId,
      ...v,
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

  // 6. Seed notices
  const noticeInserts = NOTICE_DATA.map((n, i) => ({
    organization_id: organizationId,
    ...n,
    status: 'published' as const,
    published_at: getDaysAgo(i * 3 + 1),
    created_by: userId,
  }))

  const { error: noticeError } = await supabase
    .from('staynest_notices')
    .insert(noticeInserts)
  if (noticeError) throw new Error('Failed to create notices')
}
