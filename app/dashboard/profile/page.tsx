'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar } from '@/components/ui/avatar'
import Image from 'next/image'
import {
  User,
  Users,
  QrCode,
  Settings,
  Home,
  BarChart3,
  FileText,
  Menu,
  Upload,
  Loader2,
  Check,
  X,
  AlertCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SocialLinksEditor } from '@/components/profile/social-links-editor'

interface ProfileData {
  id: string
  full_name: string | null
  bio: string | null
  location: string | null
  phone: string | null
  email: string | null
  website: string | null
  profile_image_url: string | null
  cover_image_url: string | null
  username: string
  account_type: string
}

interface ProfessionalData {
  current_role: string
  career_aspirations: string
  interests: string[]
  achievements: string
}

export default function ProfileEditorPage() {
  const router = useRouter()
  const supabase = createClient()

  // State management
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [activeTab, setActiveTab] = useState('personal')
  const [userId, setUserId] = useState<string | null>(null)

  // Profile data
  const [profileData, setProfileData] = useState<ProfileData>({
    id: '',
    full_name: '',
    bio: '',
    location: '',
    phone: '',
    email: '',
    website: '',
    profile_image_url: '',
    cover_image_url: '',
    username: '',
    account_type: 'individual'
  })

  // Professional data (stored as JSONB or separate fields if available)
  const [professionalData, setProfessionalData] = useState<ProfessionalData>({
    current_role: '',
    career_aspirations: '',
    interests: [],
    achievements: ''
  })

  const [interestsInput, setInterestsInput] = useState('')

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch profile data on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        setUserId(user.id)

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        if (profile) {
          setProfileData({
            id: profile.id,
            full_name: profile.full_name || '',
            bio: profile.bio || '',
            location: profile.location || '',
            phone: profile.phone || '',
            email: profile.email || user.email || '',
            website: profile.website || '',
            profile_image_url: profile.profile_image_url || '',
            cover_image_url: profile.cover_image_url || '',
            username: profile.username || '',
            account_type: profile.account_type || 'individual'
          })
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        setMessage({ type: 'error', text: 'Failed to load profile data' })
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router, supabase])

  // Handle input changes
  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleProfessionalChange = (field: keyof ProfessionalData, value: string | string[]) => {
    setProfessionalData(prev => ({ ...prev, [field]: value }))
  }

  // Add interest tag
  const addInterest = () => {
    if (interestsInput.trim() && !professionalData.interests.includes(interestsInput.trim())) {
      setProfessionalData(prev => ({
        ...prev,
        interests: [...prev.interests, interestsInput.trim()]
      }))
      setInterestsInput('')
    }
  }

  const removeInterest = (interest: string) => {
    setProfessionalData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }))
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!profileData.full_name?.trim()) {
      newErrors.full_name = 'Full name is required'
    }

    if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (profileData.website && !/^https?:\/\/.+/.test(profileData.website)) {
      newErrors.website = 'Website must be a valid URL (http:// or https://)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Save profile
  const handleSave = async () => {
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors before saving' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          bio: profileData.bio,
          location: profileData.location,
          phone: profileData.phone,
          website: profileData.website,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

      setMessage({ type: 'success', text: 'Profile updated successfully!' })

      // Auto-hide success message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error saving profile:', error)
      setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  // Cancel changes
  const handleCancel = () => {
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
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
            <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </a>

            <a href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium transition-colors">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </a>

            <a href="/dashboard/journey" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <FileText className="w-5 h-5" />
              <span>Journey</span>
            </a>

            <a href="/dashboard/analytics" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </a>

            <a href="/dashboard/qr-codes" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <QrCode className="w-5 h-5" />
              <span>QR Codes</span>
            </a>

            <a href="/dashboard/connections" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Users className="w-5 h-5" />
              <span>Connections</span>
            </a>

            <div className="pt-4 mt-4 border-t border-gray-200">
              <a href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </a>
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
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>

              <Avatar src={profileData.profile_image_url} size={40} />
            </div>
          </div>
        </header>

        {/* Profile Editor Content */}
        <div className="px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Edit Profile</h1>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>

          {/* Success/Error Messages */}
          {message && (
            <div className={`mb-6 px-4 py-3 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.type === 'success' ? (
                <Check className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="social">Social Links</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form Card */}
                <div className="lg:col-span-2">
                  <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>

                      <div className="space-y-5">
                        {/* Full Name */}
                        <div>
                          <Label htmlFor="full_name">Full Name *</Label>
                          <Input
                            id="full_name"
                            type="text"
                            value={profileData.full_name || ''}
                            onChange={(e) => handleInputChange('full_name', e.target.value)}
                            placeholder="Enter your full name"
                            className={`mt-1.5 ${errors.full_name ? 'border-red-500' : ''}`}
                          />
                          {errors.full_name && (
                            <p className="text-sm text-red-600 mt-1">{errors.full_name}</p>
                          )}
                        </div>

                        {/* Bio */}
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={profileData.bio || ''}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            placeholder="Tell us about yourself..."
                            className="mt-1.5"
                            rows={4}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {(profileData.bio || '').length} / 500 characters
                          </p>
                        </div>

                        {/* Location and Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              type="text"
                              value={profileData.location || ''}
                              onChange={(e) => handleInputChange('location', e.target.value)}
                              placeholder="City, Country"
                              className="mt-1.5"
                            />
                          </div>

                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={profileData.phone || ''}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              placeholder="+1 (555) 000-0000"
                              className="mt-1.5"
                            />
                          </div>
                        </div>

                        {/* Email (readonly) and Website */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={profileData.email || ''}
                              className="mt-1.5 bg-gray-100 cursor-not-allowed"
                              readOnly
                              disabled
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Email cannot be changed here
                            </p>
                          </div>

                          <div>
                            <Label htmlFor="website">Website</Label>
                            <Input
                              id="website"
                              type="url"
                              value={profileData.website || ''}
                              onChange={(e) => handleInputChange('website', e.target.value)}
                              placeholder="https://yourwebsite.com"
                              className={`mt-1.5 ${errors.website ? 'border-red-500' : ''}`}
                            />
                            {errors.website && (
                              <p className="text-sm text-red-600 mt-1">{errors.website}</p>
                            )}
                          </div>
                        </div>

                        {/* Image Upload Placeholders */}
                        <div>
                          <Label>Profile Image</Label>
                          <div className="mt-1.5 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-1">
                              Click to upload profile image
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG up to 5MB
                            </p>
                          </div>
                        </div>

                        <div>
                          <Label>Cover Image</Label>
                          <div className="mt-1.5 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-1">
                              Click to upload cover image
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG up to 5MB (Recommended: 1200x300)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Preview Card */}
                <div className="lg:col-span-1">
                  <Card className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
                    <div className="p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-6">Preview</h2>

                      <div className="space-y-4">
                        <div className="flex flex-col items-center">
                          <Avatar
                            src={profileData.profile_image_url}
                            size={80}
                            className="ring-4 ring-gray-100 mb-3"
                          />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {profileData.full_name || 'Your Name'}
                          </h3>
                          {profileData.location && (
                            <p className="text-sm text-gray-600">{profileData.location}</p>
                          )}
                        </div>

                        {profileData.bio && (
                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {profileData.bio}
                            </p>
                          </div>
                        )}

                        <div className="pt-4 border-t border-gray-200 space-y-2">
                          {profileData.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <span className="text-gray-700 truncate">{profileData.email}</span>
                            </div>
                          )}

                          {profileData.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                              </div>
                              <span className="text-gray-700">{profileData.phone}</span>
                            </div>
                          )}

                          {profileData.website && (
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                              </div>
                              <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline truncate">
                                {profileData.website.replace(/^https?:\/\//, '')}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Professional Tab */}
            <TabsContent value="professional">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form Card */}
                <div className="lg:col-span-2">
                  <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-6">Professional Information</h2>

                      <div className="space-y-5">
                        {/* Current Role/Title */}
                        <div>
                          <Label htmlFor="current_role">Current Role / Title</Label>
                          <Input
                            id="current_role"
                            type="text"
                            value={professionalData.current_role}
                            onChange={(e) => handleProfessionalChange('current_role', e.target.value)}
                            placeholder="e.g., Senior UX Designer"
                            className="mt-1.5"
                          />
                        </div>

                        {/* Career Aspirations */}
                        <div>
                          <Label htmlFor="career_aspirations">Career Aspirations</Label>
                          <Textarea
                            id="career_aspirations"
                            value={professionalData.career_aspirations}
                            onChange={(e) => handleProfessionalChange('career_aspirations', e.target.value)}
                            placeholder="What are your career goals and aspirations?"
                            className="mt-1.5"
                            rows={3}
                          />
                        </div>

                        {/* Interests (Tags) */}
                        <div>
                          <Label htmlFor="interests">Interests</Label>
                          <div className="mt-1.5">
                            <div className="flex gap-2 mb-3">
                              <Input
                                id="interests"
                                type="text"
                                value={interestsInput}
                                onChange={(e) => setInterestsInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    addInterest()
                                  }
                                }}
                                placeholder="Add an interest (press Enter)"
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                onClick={addInterest}
                                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                              >
                                Add
                              </Button>
                            </div>

                            {professionalData.interests.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {professionalData.interests.map((interest, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm"
                                  >
                                    {interest}
                                    <button
                                      type="button"
                                      onClick={() => removeInterest(interest)}
                                      className="ml-1 hover:text-emerald-900"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Add tags for your professional interests and areas of expertise
                          </p>
                        </div>

                        {/* Achievements */}
                        <div>
                          <Label htmlFor="achievements">Achievements</Label>
                          <Textarea
                            id="achievements"
                            value={professionalData.achievements}
                            onChange={(e) => handleProfessionalChange('achievements', e.target.value)}
                            placeholder="Describe your key achievements and accomplishments..."
                            className="mt-1.5"
                            rows={4}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Highlight your professional accomplishments and milestones
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Info Card */}
                <div className="lg:col-span-1">
                  <Card className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
                    <div className="p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Profile</h2>

                      <div className="space-y-4">
                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-emerald-900 mb-1">
                                Build Your Profile
                              </h3>
                              <p className="text-xs text-emerald-700 leading-relaxed">
                                Complete your professional information to help others understand your expertise and career goals.
                              </p>
                            </div>
                          </div>
                        </div>

                        {professionalData.current_role && (
                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Current Role</p>
                            <p className="text-sm font-medium text-gray-900">{professionalData.current_role}</p>
                          </div>
                        )}

                        {professionalData.interests.length > 0 && (
                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Interests</p>
                            <div className="flex flex-wrap gap-1.5">
                              {professionalData.interests.map((interest, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Social Links Tab */}
            <TabsContent value="social">
              <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  {userId && <SocialLinksEditor profileId={userId} onSave={() => {
                    setMessage({ type: 'success', text: 'Social links saved successfully!' })
                    setTimeout(() => setMessage(null), 3000)
                  }} />}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

