'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { MobileSidebar } from '@/components/layout/mobile-sidebar'
import { Home, User, FileText, BarChart3, QrCode, Users, Settings, Search, UserPlus, Mail, Phone, MapPin, Menu } from 'lucide-react'

interface Connection {
  id: string
  full_name: string
  email: string
  phone?: string
  company?: string
  position?: string
  location?: string
  notes?: string
  created_at: string
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadConnections()
  }, [])

  async function loadConnections() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('connections')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false })

      if (data) setConnections(data)
    } catch (error) {
      console.error('Error loading connections:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredConnections = connections.filter(conn =>
    conn.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.company?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            <Link href="/analytics" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </Link>
            <Link href="/dashboard/qr-codes" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <QrCode className="w-5 h-5" />
              <span>QR Codes</span>
            </Link>
            <Link href="/connections" className="flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium transition-colors">
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
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Connections</h1>
            </div>
            <Button className="bg-gray-900 text-white hover:bg-gray-800 text-sm sm:text-base">
              <UserPlus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Add Connection</span>
            </Button>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search connections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredConnections.length === 0 ? (
            <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No connections found' : 'No connections yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? 'Try a different search term' : 'Start building your professional network'}
              </p>
              {!searchQuery && (
                <Button className="bg-gray-900 text-white hover:bg-gray-800">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add First Connection
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConnections.map((connection) => (
                <Card key={connection.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar size={48} className="flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{connection.full_name}</h3>
                      {connection.position && connection.company && (
                        <p className="text-sm text-gray-600 truncate">{connection.position} at {connection.company}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {connection.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{connection.email}</span>
                      </div>
                    )}
                    {connection.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{connection.phone}</span>
                      </div>
                    )}
                    {connection.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{connection.location}</span>
                      </div>
                    )}
                  </div>

                  {connection.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 line-clamp-2">{connection.notes}</p>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">View</Button>
                    <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-8">
            <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Connection Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Connections</p>
                  <p className="text-3xl font-bold text-gray-900">{connections.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">This Month</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {connections.filter(c => new Date(c.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">This Week</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {connections.filter(c => new Date(c.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
