'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  ArrowRight,
  User,
  Building2,
  QrCode,
  BarChart3,
  Users,
  Sparkles,
  CheckCircle
} from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      router.push('/home')
    }
  }

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
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </Link>

            <Link
              href="#features"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              <span>Features</span>
            </Link>

            <Link
              href="#about"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Users className="w-5 h-5" />
              <span>About</span>
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="mt-8 space-y-3">
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">KOMOT - Digital Identity Platform</h1>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="px-8 py-12">
          <div className="max-w-6xl mx-auto">

            {/* Hero */}
            <div className="mb-12">
              <div className="inline-block mb-4">
                <span className="text-emerald-600 font-semibold tracking-wider uppercase text-xs bg-emerald-50 px-3 py-1.5 rounded">
                  Social Professional Network
                </span>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Put yourself out there.
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Join a professional network where you can discover profiles, follow people,
                showcase your journey, and share your digital identity through QR codes.
              </p>
              <div className="flex gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
                    Create Your Profile
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Features Grid */}
            <div id="features" className="grid md:grid-cols-3 gap-5 mb-12">
              <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-5">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Discover & Follow</h3>
                  <p className="text-sm text-gray-600">
                    Search for professionals, follow their journey, and build meaningful connections in your network.
                  </p>
                </div>
              </Card>

              <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-5">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <User className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Privacy</h3>
                  <p className="text-sm text-gray-600">
                    Control your visibility - make your profile public for networking or private for personal use.
                  </p>
                </div>
              </Card>

              <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-5">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <QrCode className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Dynamic QR Codes</h3>
                  <p className="text-sm text-gray-600">
                    Generate unique QR codes for networking events. Share your complete digital presence instantly.
                  </p>
                </div>
              </Card>

              <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-5">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                  <p className="text-sm text-gray-600">
                    Track profile views, QR scans, followers, and engagement. See how your network grows.
                  </p>
                </div>
              </Card>

              <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-5">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Showcase Journey</h3>
                  <p className="text-sm text-gray-600">
                    Document your education, experience, skills, projects, and achievements in one place.
                  </p>
                </div>
              </Card>

              <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-5">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">For Organizations</h3>
                  <p className="text-sm text-gray-600">
                    Create organization profiles, manage teams, departments, and showcase your company story.
                  </p>
                </div>
              </Card>
            </div>

            {/* Key Features Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Professional Network</h2>
                  <p className="text-gray-600 mb-6">
                    Connect with professionals, discover new profiles, follow people's journeys, and build
                    your network - all while maintaining control over your privacy.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Search and discover profiles</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Follow/unfollow users</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Public or private profiles</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Control search visibility</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Complete Digital Identity</h2>
                  <p className="text-gray-600 mb-6">
                    Build a comprehensive profile with education, work experience, skills, certifications,
                    projects, and share it all through one QR code.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Dynamic QR codes that update with your profile</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Track views, scans, and engagement</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Comprehensive analytics dashboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Professional networking features</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Account Types */}
            <div id="about" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Built For Everyone</h2>
              <div className="grid md:grid-cols-3 gap-5">
                <Card className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Individuals</h3>
                    <p className="text-sm text-gray-600">
                      Students, professionals, freelancers, and creators building their personal brand
                    </p>
                  </div>
                </Card>

                <Card className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Organizations</h3>
                    <p className="text-sm text-gray-600">
                      Companies, startups, universities, and communities sharing their story
                    </p>
                  </div>
                </Card>

                <Card className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Networks</h3>
                    <p className="text-sm text-gray-600">
                      Connect with like-minded individuals and grow your professional network
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            {/* CTA Section */}
            <Card className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg shadow-sm border-0">
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-3">Ready to Get Started?</h2>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Join KOMOT today and start building your digital identity. Connect, discover, and grow your professional network.
                </p>
                <Link href="/signup">
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                    Create Your Profile Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>

          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="px-8 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <Image
                    src="/images/komot-logo-sidebar-rect.png"
                    alt="KOMOT"
                    width={120}
                    height={35}
                    className="object-contain mb-3"
                  />
                  <p className="text-sm text-gray-600">
                    Put yourself out there with the social professional network.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Product</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><a href="#features" className="hover:text-gray-900">Features</a></li>
                    <li><a href="#about" className="hover:text-gray-900">About</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Company</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><a href="#" className="hover:text-gray-900">About</a></li>
                    <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                    <li><a href="#" className="hover:text-gray-900">Careers</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Legal</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
                    <li><a href="#" className="hover:text-gray-900">Terms</a></li>
                    <li><a href="#" className="hover:text-gray-900">Security</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-200 mt-8 pt-6 text-center">
                <p className="text-sm text-gray-600">&copy; 2026 KOMOT. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
