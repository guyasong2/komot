'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CreateQRDialogProps {
  profileId: string
  username: string
}

export function CreateQRDialog({ profileId, username }: CreateQRDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    qr_name: '',
    qr_type: 'individual' as 'individual' | 'organization',
    visibility: {
      personal_info: true,
      contact: true,
      social_links: true,
      journey: true
    }
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile_id: profileId,
          qr_name: formData.qr_name,
          qr_type: formData.qr_type,
          visibility: formData.visibility
        }),
      })

      if (response.ok) {
        setIsOpen(false)
        setFormData({
          qr_name: '',
          qr_type: 'individual',
          visibility: {
            personal_info: true,
            contact: true,
            social_links: true,
            journey: true
          }
        })
        router.refresh()
      } else {
        console.error('Failed to create QR code')
      }
    } catch (error) {
      console.error('Error creating QR code:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white"
      >
        <Plus className="w-4 h-4" />
        Create QR Code
      </Button>
    )
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Create New QR Code</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code Name
                </label>
                <input
                  type="text"
                  value={formData.qr_name}
                  onChange={(e) => setFormData({ ...formData, qr_name: e.target.value })}
                  placeholder="e.g., Professional, Personal, Academic"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code Type
                </label>
                <select
                  value={formData.qr_type}
                  onChange={(e) => setFormData({ ...formData, qr_type: e.target.value as 'individual' | 'organization' })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="individual">Individual</option>
                  <option value="organization">Organization</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Visibility Settings
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.visibility.personal_info}
                      onChange={(e) => setFormData({
                        ...formData,
                        visibility: { ...formData.visibility, personal_info: e.target.checked }
                      })}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">Personal Information</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.visibility.contact}
                      onChange={(e) => setFormData({
                        ...formData,
                        visibility: { ...formData.visibility, contact: e.target.checked }
                      })}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">Contact Information</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.visibility.social_links}
                      onChange={(e) => setFormData({
                        ...formData,
                        visibility: { ...formData.visibility, social_links: e.target.checked }
                      })}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">Social Links</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.visibility.journey}
                      onChange={(e) => setFormData({
                        ...formData,
                        visibility: { ...formData.visibility, journey: e.target.checked }
                      })}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">Journey</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create QR Code'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
