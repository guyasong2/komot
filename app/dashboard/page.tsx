'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { MobileSidebar } from '@/components/layout/mobile-sidebar'
import {
  Users,
  FileText,
  Heart,
  Lock,
  MapPin,
  Settings,
  Menu,
  QrCode,
  BarChart3,
  Home as HomeIcon,
  LogOut,
  User,
  Sun,
  Moon
} from 'lucide-react'

interface Profile {
  id: string
  username: string
  full_name: string
  bio: string
  location: string
  profile_image_url: string
  cover_image_url: string
  account_type: string
}

interface Post {
  id: string
  title: string
  image_url: string
  is_locked: boolean
  is_premium: boolean
  created_at: string
}

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [activeTab, setActiveTab] = useState('posts')
  const [loading, setLoading] = useState(true)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState({
    subscribers: 3487,
    posts: 28,
    likes: 1593
  })

  const supabase = createClient()

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  // Function to get default project image based on index
  const getDefaultProjectImage = (index: number) => {
    const colors = [
      'from-purple-400 to-pink-600',
      'from-blue-400 to-cyan-600',
      'from-green-400 to-emerald-600',
      'from-yellow-400 to-orange-600',
      'from-red-400 to-pink-600',
      'from-indigo-400 to-purple-600'
    ]
    return colors[index % colors.length]
  }

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setCurrentUser(profile)

      // Mock posts for now
      setPosts([
        {
          id: '1',
          title: 'My new project',
          image_url: '/images/placeholder-project.jpg',
          is_locked: true,
          is_premium: false,
          created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          title: 'My first photoshoot',
          image_url: '/images/placeholder-photoshoot.jpg',
          is_locked: false,
          is_premium: true,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  function getTimeAgo(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut()
      window.location.href = '/login'
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 fixed h-full z-30">
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
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium transition-colors">
              <HomeIcon className="w-5 h-5" />
              <span>Home</span>
            </Link>

            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Users className="w-5 h-5" />
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

          <button
            onClick={() => setShowQuickAdd(true)}
            className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            <span>Quick Add</span>
            <div className="w-6 h-6 bg-white text-gray-900 rounded-full flex items-center justify-center text-lg font-bold">
              +
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-gray-600" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="focus:outline-none"
                >
                  <Avatar src={currentUser?.profile_image_url} size={40} />
                </button>

                {showProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">
                          {currentUser?.full_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          @{currentUser?.username}
                        </p>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>View Profile</span>
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>

                      <div className="border-t border-gray-200 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <div className="w-full">
          {/* Cover Image */}
          <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-r from-emerald-500 to-green-600 overflow-hidden">
            {currentUser?.cover_image_url ? (
              <Image
                src={currentUser.cover_image_url}
                alt="Cover"
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600" />
            )}
          </div>

          {/* Profile Header */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative">
            <div className="flex items-end justify-between mb-4 sm:mb-6">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden">
                  <Avatar
                    src={currentUser?.profile_image_url}
                    size={128}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">🔥</span>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {currentUser?.full_name || 'User Name'}
                    </h1>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    {currentUser?.bio || 'Commercial photographer'}
                  </p>
                  {currentUser?.location && (
                    <div className="flex items-center gap-1 text-gray-500 mt-1">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">{currentUser.location}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Projects Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 px-4 sm:px-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Projects</h2>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8 px-4 sm:px-0">
              {posts.map((post, index) => (
                <Card key={post.id} className="group relative overflow-hidden rounded-2xl bg-gray-100 border-none hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-[4/3] relative">
                    {post.image_url ? (
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${getDefaultProjectImage(index)}`} />
                    )}

                    {post.is_locked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="px-4 py-2 bg-gray-900/90 text-white rounded-full flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          <span className="text-sm font-medium">Locked</span>
                        </div>
                      </div>
                    )}

                    {post.is_premium && (
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded">
                          Premium
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-gray-900">{post.title}</h3>
                      <span className="text-sm text-gray-500">{getTimeAgo(post.created_at)}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowQuickAdd(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Quick Add</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">What would you like to add?</p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Link
                  href="/journey"
                  className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                  onClick={() => setShowQuickAdd(false)}
                >
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-900 text-center">Journey Entry</span>
                </Link>

                <Link
                  href="/dashboard/qr-codes"
                  className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                  onClick={() => setShowQuickAdd(false)}
                >
                  <QrCode className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-900 text-center">QR Code</span>
                </Link>

                <Link
                  href="/connections"
                  className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                  onClick={() => setShowQuickAdd(false)}
                >
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-900 text-center">Connection</span>
                </Link>

                <Link
                  href="/profile"
                  className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                  onClick={() => setShowQuickAdd(false)}
                >
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-900 text-center">Project</span>
                </Link>
              </div>

              <button
                onClick={() => setShowQuickAdd(false)}
                className="w-full mt-4 sm:mt-6 px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
