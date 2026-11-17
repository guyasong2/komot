import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import Image from 'next/image'
import {
  Home,
  User,
  FileText,
  BarChart3,
  QrCode,
  Users,
  Settings,
  Download,
  Edit,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Calendar,
  MoreVertical,
  Menu,
  Bell
} from 'lucide-react'
import Link from 'next/link'
import { QRCodeDisplay } from '@/components/qr/qr-code-display'
import { CreateQRDialog } from '@/components/qr/create-qr-dialog'

export default async function QRCodesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/onboarding')
  }

  // Fetch all QR codes with scan counts
  const { data: qrCodes } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false })

  // Get scan counts for each QR code
  const qrCodesWithStats = await Promise.all(
    (qrCodes || []).map(async (qr) => {
      const { count } = await supabase
        .from('qr_scans')
        .select('*', { count: 'exact', head: true })
        .eq('qr_code_id', qr.id)

      return {
        ...qr,
        scan_count: count || 0
      }
    })
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8 px-4">
            <Image
              src="/images/komot-logo-sidebar-rect.png"
              alt="KOMOT"
              width={240}
              height={70}
              className="object-contain w-full"
              priority
            />
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>

            <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>

            <Link href="/dashboard/journey" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <FileText className="w-5 h-5" />
              <span>Journey</span>
            </Link>

            <Link href="/dashboard/analytics" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </Link>

            <Link href="/dashboard/qr-codes" className="flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium transition-colors">
              <QrCode className="w-5 h-5" />
              <span>QR Codes</span>
            </Link>

            <Link href="/dashboard/connections" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Users className="w-5 h-5" />
              <span>Connections</span>
            </Link>

            <div className="pt-4 mt-4 border-t border-gray-200">
              <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </div>
          </nav>

          {/* Quick Add Button */}
          <button className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
            <span>Quick Add</span>
            <div className="w-6 h-6 bg-white text-gray-900 rounded-full flex items-center justify-center text-lg font-bold">
              +
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="lg:hidden">
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>

              <Avatar src={profile.profile_image_url} size={40} />
            </div>
          </div>
        </header>

        {/* Page Header */}
        <div className="px-8 py-6 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">QR Codes</h1>
            <CreateQRDialog profileId={user.id} username={profile.username} />
          </div>
        </div>

        <div className="px-8 py-8">
          {qrCodesWithStats.length === 0 ? (
            <div className="text-center py-12">
              <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No QR codes yet</h3>
              <p className="text-gray-600 mb-6">Create your first QR code to share your profile</p>
              <CreateQRDialog profileId={user.id} username={profile.username} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {qrCodesWithStats.map((qr) => (
                <Card key={qr.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{qr.qr_name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-medium">
                            {qr.qr_type}
                          </span>
                          {qr.is_active ? (
                            <span className="flex items-center gap-1 text-xs text-emerald-600">
                              <Eye className="w-3 h-3" />
                              Active
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <EyeOff className="w-3 h-3" />
                              Disabled
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-4 flex items-center justify-center">
                      <QRCodeDisplay
                        qrToken={qr.qr_token}
                        username={profile.username}
                        size={180}
                      />
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total Scans</span>
                        <span className="font-semibold text-gray-900">{qr.scan_count}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Created
                        </span>
                        <span className="text-gray-900">
                          {new Date(qr.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center gap-2"
                        asChild
                      >
                        <a href={`/api/qr/download?token=${qr.qr_token}&format=png`} download>
                          <Download className="w-4 h-4" />
                          PNG
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center gap-2"
                        asChild
                      >
                        <a href={`/api/qr/download?token=${qr.qr_token}&format=svg`} download>
                          <Download className="w-4 h-4" />
                          SVG
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-2"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
