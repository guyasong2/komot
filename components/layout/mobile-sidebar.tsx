'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  User,
  FileText,
  BarChart3,
  QrCode,
  Users,
  Settings,
  X
} from 'lucide-react'

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/journey', icon: FileText, label: 'Journey' },
    { href: '/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/dashboard/qr-codes', icon: QrCode, label: 'QR Codes' },
    { href: '/connections', icon: Users, label: 'Connections' },
    { href: '/settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Close button for mobile */}
          <div className="flex items-center justify-between mb-8 lg:justify-center">
            <Image
              src="/images/komot-logo-sidebar-rect.png"
              alt="KOMOT"
              width={240}
              height={70}
              className="object-contain w-40"
              priority
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.slice(0, 6).map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}

            <div className="pt-4 mt-4 border-t border-gray-200">
              <Link
                href="/settings"
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  pathname === '/settings'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </div>
          </nav>

          <button className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
            <span>Quick Add</span>
            <div className="w-6 h-6 bg-white text-gray-900 rounded-full flex items-center justify-center text-lg font-bold">
              +
            </div>
          </button>
        </div>
      </aside>
    </>
  )
}
