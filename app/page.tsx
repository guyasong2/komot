'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, User, Building2, QrCode, BarChart3, Users, Sparkles } from 'lucide-react'

export default function AnimatedHomePage() {
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const section1Ref = useRef<HTMLDivElement>(null)
  const section2Ref = useRef<HTMLDivElement>(null)
  const section3Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    }, observerOptions)

    const sections = [section1Ref, section2Ref, section3Ref]
    sections.forEach(ref => {
      if (ref.current) observer.observe(ref.current)
    })

    return () => observer.disconnect()
  }, [])

  const heroOpacity = Math.max(0, 1 - scrollY / 600)
  const heroTranslateY = scrollY * 0.3

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Fixed Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50 ? 'bg-white/90 backdrop-blur-lg shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              KOMOT
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
            <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="min-h-screen flex items-center justify-center px-6 pt-20"
        style={{
          opacity: heroOpacity,
          transform: `translateY(${heroTranslateY}px)`
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm bg-emerald-50 px-4 py-2 rounded-full">
              DIGITAL IDENTITY PLATFORM
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Put yourself
            <br />
            out there.
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Create your universal digital identity. Share your journey, achievements,
            and connections through one powerful QR code.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/signup"
              className="group bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 font-semibold flex items-center gap-2"
            >
              Create Your Profile
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-all duration-200 font-semibold"
            >
              Learn More
            </Link>
          </div>

          <div className="relative w-full max-w-4xl mx-auto mt-20">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gray-50 rounded-xl">
                  <User className="w-8 h-8 mx-auto mb-3 text-emerald-600" />
                  <p className="font-semibold text-gray-900">Individual</p>
                  <p className="text-sm text-gray-500 mt-1">Profiles</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-xl">
                  <Building2 className="w-8 h-8 mx-auto mb-3 text-emerald-600" />
                  <p className="font-semibold text-gray-900">Organization</p>
                  <p className="text-sm text-gray-500 mt-1">Pages</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-xl">
                  <QrCode className="w-8 h-8 mx-auto mb-3 text-emerald-600" />
                  <p className="font-semibold text-gray-900">QR Codes</p>
                  <p className="text-sm text-gray-500 mt-1">Instant Share</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Indicator */}
      <div
        className="fixed bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-300"
        style={{ opacity: Math.max(0, 1 - scrollY / 300) }}
      >
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full p-1">
            <div className="w-1.5 h-3 bg-gray-300 rounded-full mx-auto animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* Feature Section 1 */}
      <section
        ref={section1Ref}
        id="features"
        className="section-fade min-h-screen flex items-center justify-center px-6 py-32"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block mb-6">
                <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm">
                  YOUR DIGITAL JOURNEY
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Everything about you,
                <br />
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  in one place.
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Showcase your education, work experience, skills, certifications, and projects.
                Build a comprehensive profile that tells your complete story.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Dynamic Profiles</h3>
                    <p className="text-gray-600">Update your journey in real-time as you grow</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Track Engagement</h3>
                    <p className="text-gray-600">See who views your profile and clicks your links</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Build Connections</h3>
                    <p className="text-gray-600">Connect with professionals and organizations</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-4">
                  <div className="h-12 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg animate-pulse"></div>
                  <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg animate-pulse delay-75"></div>
                  <div className="h-24 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg animate-pulse delay-150"></div>
                  <div className="h-20 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2 */}
      <section
        ref={section2Ref}
        id="how-it-works"
        className="section-fade min-h-screen flex items-center justify-center px-6 py-32 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 flex items-center justify-center">
                <QrCode className="w-48 h-48 text-emerald-500" strokeWidth={1.5} />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-block mb-6">
                <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm">
                  ONE QR CODE
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Share everything
                <br />
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  instantly.
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Generate a unique QR code that links to your complete digital presence.
                Perfect for networking events, business cards, and social media.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Dynamic QR codes that update with your profile
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Customizable visibility settings
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Track scans and engagement
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 3 */}
      <section
        ref={section3Ref}
        id="about"
        className="section-fade min-h-screen flex items-center justify-center px-6 py-32"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm">
              FOR EVERYONE
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
            Built for individuals
            <br />
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              and organizations.
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed">
            Whether you're a student, professional, freelancer, or running a company,
            KOMOT helps you create a powerful digital presence.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Individuals</h3>
              <p className="text-gray-600">
                Students, professionals, freelancers, and creators building their personal brand
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Organizations</h3>
              <p className="text-gray-600">
                Companies, startups, universities, and communities sharing their story
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Networks</h3>
              <p className="text-gray-600">
                Connect with like-minded individuals and grow your professional network
              </p>
            </div>
          </div>

          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-10 py-5 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 font-semibold text-lg group"
          >
            Get Started Free
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <span className="text-2xl font-bold">KOMOT</span>
              </div>
              <p className="text-gray-400">
                Put yourself out there with the universal digital identity platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 KOMOT. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .section-fade {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .section-fade.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(8px);
          }
        }

        .animate-bounce {
          animation: bounce 2s infinite;
        }

        .delay-75 {
          animation-delay: 75ms;
        }

        .delay-150 {
          animation-delay: 150ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}
