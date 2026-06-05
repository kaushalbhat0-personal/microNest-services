import { DashboardNav } from '@micronest/ui'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}
