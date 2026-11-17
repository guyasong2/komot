'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { MobileSidebar } from '@/components/layout/mobile-sidebar'
import { Home, User, FileText, BarChart3, QrCode, Users, Settings, Eye, TrendingUp, TrendingDown, Calendar, Menu } from 'lucide-react'

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    profileViews: 0,
    qrScans: 0,
    connections: 0,
    journeyEntries: 0
  })
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadAnalytics()
  }, [])

  async function loadAnalytics() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [viewsResult, scansResult, connectionsResult, journeyResult] = await Promise.all([
        supabase.from('profile_views').select('*', { count: 'exact', head: true }).eq('viewed_profile_id', user.id),
        supabase.from('qr_scans').select('*', { count: 'exact', head: true }).eq('profile_id', user.id),
        supabase.from('connections').select('*', { count: 'exact', head: true }).eq('profile_id', user.id),
        supabase.from('journey_entries').select('*', { count: 'exact', head: true }).eq('profile_id', user.id)
      ])

      setStats({
        profileViews: viewsResult.count || 0,
        qrScans: scansResult.count || 0,
        connections: connectionsResult.count || 0,
        journeyEntries: journeyResult.count || 0
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6">
          <div className="flex items-center justify-center mb-8 px-4">
            <Image src="/images/komot-logo-sidebar-rect.png" alt="KOMOT" width={240} height={70} className="object-contain w-full" priority />
          </div>
          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>
            <Link href="/journey" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <FileText className="w-5 h-5" />
              <span>Journey</span>
            </Link>
            <Link href="/analytics" className="flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium transition-colors">
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </Link>
            <Link href="/dashboard/qr-codes" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <QrCode className="w-5 h-5" />
              <span>QR Codes</span>
            </Link>
            <Link href="/connections" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Users className="w-5 h-5" />
              <span>Connections</span>
            </Link>
            <div className="pt-4 mt-4 border-t border-gray-200">
              <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </div>
          </nav>
        </div>
      </aside>

      <main className="flex-1 w-full lg:ml-64">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Analytics</h1>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Profile Views</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.profileViews}</p>
              <p className="text-sm text-gray-500 mt-2">Total views</p>
            </Card>

            <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-purple-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">QR Scans</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.qrScans}</p>
              <p className="text-sm text-gray-500 mt-2">Total scans</p>
            </Card>

            <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Connections</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.connections}</p>
              <p className="text-sm text-gray-500 mt-2">Total connections</p>
            </Card>

            <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Journey Entries</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.journeyEntries}</p>
              <p className="text-sm text-gray-500 mt-2">Milestones recorded</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Profile viewed</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">QR code scanned</p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New connection</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Engagement Overview</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Profile Views</span>
                    <span className="text-sm font-medium text-gray-900">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">QR Scans</span>
                    <span className="text-sm font-medium text-gray-900">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Connections</span>
                    <span className="text-sm font-medium text-gray-900">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
