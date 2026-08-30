import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-auth'
import { writeClient } from '@/sanity/lib/write-client'
import { pendingSubmissionsCountQuery } from '@/sanity/lib/queries'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminTopbar } from '@/components/admin/AdminTopbar'

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const user = await getAdminSession()
  if (!user) {
    redirect('/admin/login')
  }

  const pendingSubmissions = await writeClient.fetch<number>(pendingSubmissionsCountQuery)

  return (
    <div className="min-h-screen w-full bg-[#F7F7F8]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1512px]">
        <AdminSidebar pendingSubmissions={pendingSubmissions} user={user} />
        <div className="flex flex-1 flex-col">
          <AdminTopbar hasAlerts={pendingSubmissions > 0} user={user} />
          <main className="flex-1 px-4 pb-8 pt-3 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
