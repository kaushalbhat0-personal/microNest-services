/**
 * microNest E2E Test Suite
 *
 * Tests: Signup → Onboarding → Dashboard → Ecosystem activation
 *
 * Run: node scripts/e2e-test.js
 *
 * NOTE: Supabase rate-limits email signups (4/hour). If you get
 * "email rate limit exceeded", wait ~1 hour or disable email
 * confirmation in Supabase Dashboard → Authentication → Settings.
 */

const { createClient } = require('@supabase/supabase-js')

const URL = 'https://dwhlndnvlaszpyanisko.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3aGxuZG52bGFzenB5YW5pc2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTcxOTQsImV4cCI6MjA5NjE3MzE5NH0.XnzqNmxO6Wqev41wTT2xoQUZdUYnUxAIpP5KfLKZQwE'

function log(...args) {
  console.log(`[${new Date().toISOString().slice(11, 19)}]`, ...args)
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function signup(supabase, email, password, fullName) {
  log('Signing up:', email)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
  if (error) return { error }
  return { data, session: data.session, userId: data.user?.id }
}

async function login(supabase, email, password) {
  log('Logging in:', email)
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error }
  return { data, session: data.session }
}

async function completeOnboarding(supabase, orgName, ecosystemIds) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // 1. Create organisation
  const slug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 100)
  const { data: org, error: orgErr } = await supabase
    .from('organizations')
    .insert({ name: orgName, slug, created_by: user.id })
    .select('*')
    .single()
  if (orgErr) return { error: `Org creation failed: ${orgErr.message}` }

  // 2. Add self as owner
  const { error: memberErr } = await supabase
    .from('organization_members')
    .insert({ organization_id: org.id, user_id: user.id, role: 'owner' })
  if (memberErr) return { error: `Member insert failed: ${memberErr.message}` }

  // 3. Look up ecosystem IDs
  const { data: ecos, error: ecoErr } = await supabase
    .from('ecosystems')
    .select('id, slug, name')
    .in('slug', ecosystemIds)
  if (ecoErr) return { error: `Ecosystem lookup failed: ${ecoErr.message}` }

  // 4. Activate each
  for (const eco of ecos) {
    const { error: actErr } = await supabase
      .from('organization_ecosystems')
      .insert({ organization_id: org.id, ecosystem_id: eco.id, settings: {} })
    if (actErr) return { error: `Failed to activate ${eco.slug}: ${actErr.message}` }
  }

  return { org, ecosystems: ecos }
}

async function verifyDashboard(supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get orgs
  const { data: orgs } = await supabase
    .from('organizations')
    .select('id, name, slug')

  // Get activated ecosystems
  const { data: activations } = await supabase
    .from('organization_ecosystems')
    .select('*, ecosystem:ecosystems(*)')


  const activatedSlugs = (activations || []).map(
    (a) => a.ecosystem?.slug || a.ecosystem_id
  )

  return {
    user: user.id,
    organizations: orgs || [],
    activatedEcosystems: activatedSlugs,
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

const PASS = '\x1b[32mPASS\x1b[0m'
const FAIL = '\x1b[31mFAIL\x1b[0m'
const SKIP = '\x1b[33mSKIP\x1b[0m'

async function run() {
  let passed = 0
  let failed = 0
  let skipped = 0

  function check(ok, label, detail) {
    if (ok) {
      console.log(`  ${PASS} ${label}`)
      passed++
    } else {
      console.log(`  ${FAIL} ${label}`)
      if (detail) console.log(`       ${detail}`)
      failed++
    }
  }

  // -----------------------------------------------------------------------
  // TEST 1: Single ecosystem (StayNest)
  // -----------------------------------------------------------------------
  log('\n══════════════════════════════════════════')
  log('TEST 1: StayNest-only user')
  log('══════════════════════════════════════════\n')

  const sup1 = createClient(URL, ANON_KEY)
  const ts1 = Date.now().toString().slice(-8)
  const email1 = `e2e.a.${ts1}@micronest.test`
  const pw1 = 'E2eTest2026!'

  const r1 = await signup(sup1, email1, pw1, 'E2E Test A')
  if (r1.error && r1.error.message.includes('rate limit')) {
    console.log(`  ${SKIP} Signup — rate limited (try again later)`)
    skipped++
  } else if (r1.error) {
    console.log(`  ${FAIL} Signup: ${r1.error.message}`)
    failed++
  } else {
    check(!!r1.userId, 'Signup returns user ID')

    // Try login (in case email auto-confirmed)
    let session = r1.session
    if (!session) {
      const r1b = await login(sup1, email1, pw1)
      if (r1b.error) {
        check(false, 'Login after signup', r1b.error.message)
      } else {
        session = r1b.session
        check(!!session, 'Login after signup')
      }
    } else {
      check(!!session, 'Session obtained from signup')
    }

    if (session) {
      const onboarding = await completeOnboarding(sup1, `Org A ${ts1}`, ['staynest'])
      check(!onboarding.error, 'Onboarding completes', onboarding.error)
      check(onboarding.ecosystems?.length === 1, 'Exactly 1 ecosystem activated')
      check(
        onboarding.ecosystems?.[0]?.slug === 'staynest',
        'Activated ecosystem is StayNest'
      )

      const dashboard = await verifyDashboard(sup1)
      check(
        dashboard.activatedEcosystems.includes('staynest'),
        'Dashboard shows StayNest'
      )
      check(
        !dashboard.activatedEcosystems.includes('clinicnest'),
        'Dashboard does NOT show ClinicNest'
      )
      check(
        !dashboard.activatedEcosystems.includes('freelancenest'),
        'Dashboard does NOT show FreelanceNest'
      )
      check(
        !dashboard.activatedEcosystems.includes('propertynest'),
        'Dashboard does NOT show PropertyNest'
      )
    }
  }

  // -----------------------------------------------------------------------
  // TEST 2: Multiple ecosystems (StayNest + ClinicNest)
  // -----------------------------------------------------------------------
  log('\n══════════════════════════════════════════')
  log('TEST 2: StayNest + ClinicNest user')
  log('══════════════════════════════════════════\n')

  const sup2 = createClient(URL, ANON_KEY)
  const ts2 = (Date.now() + 1).toString().slice(-8)
  const email2 = `e2e.b.${ts2}@micronest.test`
  const pw2 = 'E2eTest2026!'

  const r2 = await signup(sup2, email2, pw2, 'E2E Test B')
  if (r2.error && r2.error.message.includes('rate limit')) {
    console.log(`  ${SKIP} Signup — rate limited (try again later)`)
    skipped++
  } else if (r2.error) {
    console.log(`  ${FAIL} Signup: ${r2.error.message}`)
    failed++
  } else {
    check(!!r2.userId, 'Signup returns user ID')

    let session = r2.session
    if (!session) {
      const r2b = await login(sup2, email2, pw2)
      if (r2b.error) {
        check(false, 'Login after signup', r2b.error.message)
      } else {
        session = r2b.session
        check(!!session, 'Login after signup')
      }
    } else {
      check(!!session, 'Session obtained from signup')
    }

    if (session) {
      const onboarding = await completeOnboarding(sup2, `Org B ${ts2}`, [
        'staynest',
        'clinicnest',
      ])
      check(!onboarding.error, 'Onboarding completes', onboarding.error)
      check(onboarding.ecosystems?.length === 2, 'Exactly 2 ecosystems activated')
      check(
        onboarding.ecosystems?.some((e) => e.slug === 'staynest'),
        'Activated ecosystems include StayNest'
      )
      check(
        onboarding.ecosystems?.some((e) => e.slug === 'clinicnest'),
        'Activated ecosystems include ClinicNest'
      )

      const dashboard = await verifyDashboard(sup2)
      check(
        dashboard.activatedEcosystems.includes('staynest'),
        'Dashboard shows StayNest'
      )
      check(
        dashboard.activatedEcosystems.includes('clinicnest'),
        'Dashboard shows ClinicNest'
      )
      check(
        !dashboard.activatedEcosystems.includes('freelancenest'),
        'Dashboard does NOT show FreelanceNest'
      )
      check(
        !dashboard.activatedEcosystems.includes('propertynest'),
        'Dashboard does NOT show PropertyNest'
      )
    }
  }

  // -----------------------------------------------------------------------
  // TEST 3: Ecosystem page verification (requires Auth)
  // -----------------------------------------------------------------------
  log('\n══════════════════════════════════════════')
  log('TEST 3: /dashboard/ecosystems page')
  log('══════════════════════════════════════════\n')

  // This test needs to navigate to a Next.js page, so it requires the
  // dev server to be running on localhost:3355 and a session cookie.
  // We check the data layer instead.
  log('  (data-layer verification using sup2 session)')

  const sup3 = createClient(URL, ANON_KEY)
  const r3 = await login(sup3, email2, pw2)
  if (r3.error) {
    console.log(`  ${SKIP} Could not log in Test B user`)
    skipped++
  } else {
    // Set the auth session
    await sup3.auth.setSession(r3.session)

    // Get all ecosystems
    const { data: allEcosystems } = await sup3
      .from('ecosystems')
      .select('id, slug, name')
    check(allEcosystems?.length === 4, 'Exactly 4 ecosystems exist')

    // Get user's activated ecosystems
    const { data: userOrgs } = await sup3
      .from('organizations')
      .select('id, name')
    const { data: activations } = await sup3
      .from('organization_ecosystems')
      .select('*, ecosystem:ecosystems(slug, name)')
    const activatedSlugs = (activations || []).map(
      (a) => a.ecosystem?.slug || a.ecosystem_id
    )

    const allSlugs = (allEcosystems || []).map((e) => e.slug)
    const availableSlugs = allSlugs.filter((s) => !activatedSlugs.includes(s))

    check(
      activatedSlugs.includes('staynest'),
      'Activated section shows StayNest'
    )
    check(
      activatedSlugs.includes('clinicnest'),
      'Activated section shows ClinicNest'
    )
    check(
      availableSlugs.includes('freelancenest'),
      'Available section shows FreelanceNest'
    )
    check(
      availableSlugs.includes('propertynest'),
      'Available section shows PropertyNest'
    )
    check(
      !availableSlugs.includes('staynest'),
      'StayNest NOT in available section'
    )
    check(
      !availableSlugs.includes('clinicnest'),
      'ClinicNest NOT in available section'
    )
  }

  // -----------------------------------------------------------------------
  // Summary
  // -----------------------------------------------------------------------
  log('\n══════════════════════════════════════════')
  log(`Results: ${passed} passed, ${failed} failed, ${skipped} skipped`)
  log('══════════════════════════════════════════\n')

  process.exit(failed > 0 ? 1 : 0)
}

run().catch((err) => {
  console.error('Test suite error:', err)
  process.exit(1)
})
