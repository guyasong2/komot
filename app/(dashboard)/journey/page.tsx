'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MobileSidebar } from '@/components/layout/mobile-sidebar'
import { Home, User, FileText, BarChart3, QrCode, Users, Settings, Plus, Calendar, Briefcase, GraduationCap, Award, X, Menu } from 'lucide-react'

interface JourneyEntry {
  id: string
  title: string
  description: string
  date: string
  type: 'work' | 'education' | 'achievement' | 'milestone'
  created_at: string
}

export default function JourneyPage() {
  const [entries, setEntries] = useState<JourneyEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [newEntry, setNewEntry] = useState({
    title: '',
    description: '',
    date: '',
    type: 'work' as 'work' | 'education' | 'achievement' | 'milestone'
  })
  const supabase = createClient()

  useEffect(() => {
    loadEntries()
  }, [])

  async function loadEntries() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('journey_entries')
        .select('*')
        .eq('profile_id', user.id)
        .order('date', { ascending: false })

      if (data) setEntries(data)
    } catch (error) {
      console.error('Error loading journey entries:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addEntry() {
    if (!newEntry.title || !newEntry.date) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('journey_entries')
        .insert({
          profile_id: user.id,
          title: newEntry.title,
          description: newEntry.description,
          date: newEntry.date,
          type: newEntry.type
        })
        .select()
        .single()

      if (!error && data) {
        setEntries([data, ...entries])
        setNewEntry({ title: '', description: '', date: '', type: 'work' })
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error adding entry:', error)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'work': return <Briefcase className="w-5 h-5" />
      case 'education': return <GraduationCap className="w-5 h-5" />
      case 'achievement': return <Award className="w-5 h-5" />
      default: return <Calendar className="w-5 h-5" />
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'work': return 'bg-blue-100 text-blue-600'
      case 'education': return 'bg-purple-100 text-purple-600'
      case 'achievement': return 'bg-yellow-100 text-yellow-600'
      default: return 'bg-gray-100 text-gray-600'
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
            <Link href="/journey" className="flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium transition-colors">
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
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Journey</h1>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="bg-gray-900 text-white hover:bg-gray-800 text-sm sm:text-base">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add Entry</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
          {showForm && (
            <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">New Journey Entry</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <Input value={newEntry.title} onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })} placeholder="e.g., Started at Google" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <Textarea value={newEntry.description} onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })} placeholder="Describe this milestone..." rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <Input type="date" value={newEntry.date} onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={newEntry.type} onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as any })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="work">Work</option>
                      <option value="education">Education</option>
                      <option value="achievement">Achievement</option>
                      <option value="milestone">Milestone</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={addEntry} className="bg-emerald-600 text-white hover:bg-emerald-700">Add Entry</Button>
                  <Button onClick={() => setShowForm(false)} variant="outline">Cancel</Button>
                </div>
              </div>
            </Card>
          )}

          {entries.length === 0 ? (
            <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No journey entries yet</h3>
              <p className="text-gray-600 mb-6">Start documenting your professional journey</p>
              <Button onClick={() => setShowForm(true)} className="bg-gray-900 text-white hover:bg-gray-800">
                <Plus className="w-4 h-4 mr-2" />
                Add First Entry
              </Button>
            </Card>
          ) : (
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
              <div className="space-y-6">
                {entries.map((entry) => (
                  <div key={entry.id} className="relative pl-14">
                    <div className={`absolute left-0 w-12 h-12 rounded-full ${getColor(entry.type)} flex items-center justify-center`}>
                      {getIcon(entry.type)}
                    </div>
                    <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
                          <p className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getColor(entry.type)}`}>
                          {entry.type}
                        </span>
                      </div>
                      {entry.description && (
                        <p className="text-gray-600 mt-2">{entry.description}</p>
                      )}
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
