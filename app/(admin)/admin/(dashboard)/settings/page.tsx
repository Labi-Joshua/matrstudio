import { requireAdminSession } from '@/lib/admin-auth'
import { list } from '@/lib/admin-users'
import { SettingsTabs } from '@/components/admin/SettingsTabs'

export default async function AdminSettingsPage() {
  const [currentUser, users] = await Promise.all([requireAdminSession(), list()])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
        Settings
      </h1>
      <SettingsTabs currentUser={currentUser} users={users} />
    </div>
  )
}
