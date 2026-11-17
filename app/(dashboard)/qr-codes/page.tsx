import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import {
  QrCode,
  Download,
  Edit,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  TrendingUp,
  Calendar,
  MoreVertical
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

          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </Link>

            <Link href="/qr-codes" className="flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium transition-colors">
              <QrCode className="w-5 h-5" />
              <span>QR Codes</span>
            </Link>

            <Link href="/analytics" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <TrendingUp className="w-5 h-5" />
              <span>Analytics</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">QR Codes</h1>
            <CreateQRDialog profileId={user.id} username={profile.username} />
          </div>
        </header>

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
