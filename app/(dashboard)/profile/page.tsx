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
import { MobileSidebar } from '@/components/layout/mobile-sidebar'
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

interface Project {
  id: string
  title: string
  description: string
  status: 'active' | 'completed' | 'on-hold'
  startDate: string
  endDate?: string
  tags: string[]
  url?: string
}

interface SocialLink {
  id: string
  platform: string
  url: string
  username: string
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  // Projects data
  const [projects, setProjects] = useState<Project[]>([])
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    status: 'active',
    startDate: '',
    tags: [],
    url: ''
  })
  const [projectTagInput, setProjectTagInput] = useState('')

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

  // Project management functions
  const addProjectTag = () => {
    if (projectTagInput.trim() && !newProject.tags?.includes(projectTagInput.trim())) {
      setNewProject(prev => ({
        ...prev,
        tags: [...(prev.tags || []), projectTagInput.trim()]
      }))
      setProjectTagInput('')
    }
  }

  const removeProjectTag = (tag: string) => {
    setNewProject(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tag)
    }))
  }

  const handleProjectChange = (field: keyof Project, value: string | string[]) => {
    setNewProject(prev => ({ ...prev, [field]: value }))
  }

  const resetProjectForm = () => {
    setNewProject({
      title: '',
      description: '',
      status: 'active',
      startDate: '',
      tags: [],
      url: ''
    })
    setProjectTagInput('')
    setEditingProject(null)
    setShowProjectForm(false)
  }

  const saveProject = () => {
    if (!newProject.title?.trim()) {
      setMessage({ type: 'error', text: 'Project title is required' })
      return
    }

    if (editingProject) {
      // Update existing project
      setProjects(prev => prev.map(p =>
        p.id === editingProject.id ? { ...editingProject, ...newProject } as Project : p
      ))
      setMessage({ type: 'success', text: 'Project updated successfully!' })
    } else {
      // Add new project
      const project: Project = {
        id: Date.now().toString(),
        title: newProject.title!,
        description: newProject.description || '',
        status: newProject.status as 'active' | 'completed' | 'on-hold',
        startDate: newProject.startDate || new Date().toISOString().split('T')[0],
        endDate: newProject.endDate,
        tags: newProject.tags || [],
        url: newProject.url
      }
      setProjects(prev => [...prev, project])
      setMessage({ type: 'success', text: 'Project added successfully!' })
    }

    resetProjectForm()
    setTimeout(() => setMessage(null), 3000)
  }

  const editProject = (project: Project) => {
    setEditingProject(project)
    setNewProject({
      title: project.title,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      tags: project.tags,
      url: project.url
    })
    setShowProjectForm(true)
  }

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId))
    setMessage({ type: 'success', text: 'Project deleted successfully!' })
    setTimeout(() => setMessage(null), 3000)
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
      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 fixed h-full z-30">
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

            <a href="/profile" className="flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium transition-colors">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </a>

            <a href="/journey" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <FileText className="w-5 h-5" />
              <span>Journey</span>
            </a>

            <a href="/analytics" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </a>

            <a href="/qr-codes" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <QrCode className="w-5 h-5" />
              <span>QR Codes</span>
            </a>

            <a href="/connections" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Users className="w-5 h-5" />
              <span>Connections</span>
            </a>

            <div className="pt-4 mt-4 border-t border-gray-200">
              <a href="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
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
      <main className="flex-1 w-full lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Edit Profile</h1>
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
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl font-semibold text-gray-900 hidden sm:block">Edit Profile</h1>

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
              <TabsTrigger value="projects">Projects</TabsTrigger>
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

            {/* Projects Tab */}
            <TabsContent value="projects">
              <div className="space-y-6">
                {/* Header with Add Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
                    <p className="text-sm text-gray-600 mt-1">Showcase your work and projects</p>
                  </div>
                  <Button
                    onClick={() => setShowProjectForm(!showProjectForm)}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    {showProjectForm ? (
                      <>
                        <X className="w-4 h-4" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <span className="text-lg">+</span>
                        Add Project
                      </>
                    )}
                  </Button>
                </div>

                {/* Project Form */}
                {showProjectForm && (
                  <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">
                        {editingProject ? 'Edit Project' : 'New Project'}
                      </h3>

                      <div className="space-y-4">
                        {/* Title */}
                        <div>
                          <Label htmlFor="project_title">Project Title *</Label>
                          <Input
                            id="project_title"
                            type="text"
                            value={newProject.title || ''}
                            onChange={(e) => handleProjectChange('title', e.target.value)}
                            placeholder="Enter project title"
                            className="mt-1.5"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <Label htmlFor="project_description">Description</Label>
                          <Textarea
                            id="project_description"
                            value={newProject.description || ''}
                            onChange={(e) => handleProjectChange('description', e.target.value)}
                            placeholder="Describe your project..."
                            className="mt-1.5"
                            rows={3}
                          />
                        </div>

                        {/* Status and Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="project_status">Status</Label>
                            <select
                              id="project_status"
                              value={newProject.status || 'active'}
                              onChange={(e) => handleProjectChange('status', e.target.value)}
                              className="mt-1.5 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="active">Active</option>
                              <option value="completed">Completed</option>
                              <option value="on-hold">On Hold</option>
                            </select>
                          </div>

                          <div>
                            <Label htmlFor="project_start">Start Date</Label>
                            <Input
                              id="project_start"
                              type="date"
                              value={newProject.startDate || ''}
                              onChange={(e) => handleProjectChange('startDate', e.target.value)}
                              className="mt-1.5"
                            />
                          </div>

                          <div>
                            <Label htmlFor="project_end">End Date</Label>
                            <Input
                              id="project_end"
                              type="date"
                              value={newProject.endDate || ''}
                              onChange={(e) => handleProjectChange('endDate', e.target.value)}
                              className="mt-1.5"
                            />
                          </div>
                        </div>

                        {/* URL */}
                        <div>
                          <Label htmlFor="project_url">Project URL</Label>
                          <Input
                            id="project_url"
                            type="url"
                            value={newProject.url || ''}
                            onChange={(e) => handleProjectChange('url', e.target.value)}
                            placeholder="https://project-website.com"
                            className="mt-1.5"
                          />
                        </div>

                        {/* Tags */}
                        <div>
                          <Label htmlFor="project_tags">Tags</Label>
                          <div className="mt-1.5">
                            <div className="flex gap-2 mb-3">
                              <Input
                                id="project_tags"
                                type="text"
                                value={projectTagInput}
                                onChange={(e) => setProjectTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    addProjectTag()
                                  }
                                }}
                                placeholder="Add a tag (press Enter)"
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                onClick={addProjectTag}
                                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                              >
                                Add
                              </Button>
                            </div>

                            {(newProject.tags || []).length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {newProject.tags?.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                                  >
                                    {tag}
                                    <button
                                      type="button"
                                      onClick={() => removeProjectTag(tag)}
                                      className="ml-1 hover:text-gray-900"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4">
                          <Button
                            onClick={saveProject}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            {editingProject ? 'Update Project' : 'Add Project'}
                          </Button>
                          <Button
                            onClick={resetProjectForm}
                            variant="outline"
                            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Projects List */}
                {projects.length === 0 && !showProjectForm ? (
                  <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                      <p className="text-gray-600 mb-6">Start showcasing your work by adding your first project</p>
                      <Button
                        onClick={() => setShowProjectForm(true)}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Add Your First Project
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                      <Card key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
                              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                project.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                                project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => editProject(project)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => deleteProject(project.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {project.description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                          )}

                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{new Date(project.startDate).toLocaleDateString()}</span>
                              {project.endDate && <span> - {new Date(project.endDate).toLocaleDateString()}</span>}
                            </div>
                          </div>

                          {project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                              View Project
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

