import { createServerClient } from '@micronest/auth'
import { MarketingNav, Footer, FloatingCTA } from '@micronest/ui'

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNav isLoggedIn={!!user} />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <FloatingCTA />
    </div>
  )
}
