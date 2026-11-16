'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { User, Building2, Image as ImageIcon } from 'lucide-react'
import { AvatarSelector, GenderSelector } from '@/components/profile/avatar-selector'
import { Avatar } from '@/components/ui/avatar'
import { Gender, getRandomDefaultAvatar } from '@/lib/utils/avatar'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [accountType, setAccountType] = useState<'individual' | 'organization' | null>(null)
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [oauthImageUrl, setOauthImageUrl] = useState<string | null>(null)
  const [gender, setGender] = useState<Gender | null>(null)
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Fetch OAuth profile image on mount
  useEffect(() => {
    const fetchOAuthImage = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          // Extract OAuth image from user metadata
          let imageUrl: string | null = null

          if (user.app_metadata.provider === 'google') {
            imageUrl = user.user_metadata.avatar_url ||
                      user.user_metadata.picture ||
                      null
          } else if (user.app_metadata.provider === 'github') {
            imageUrl = user.user_metadata.avatar_url || null
          }

          setOauthImageUrl(imageUrl)
        }
      } catch (error) {
        console.error('Error fetching OAuth image:', error)
      }
    }

    fetchOAuthImage()
  }, [supabase])

  const handleAccountTypeSelect = (type: 'individual' | 'organization') => {
    setAccountType(type)
    setStep(2)
  }

  const handleGenderSelect = (selectedGender: Gender) => {
    setGender(selectedGender)
    // Auto-assign a random default avatar based on gender
    const randomAvatar = getRandomDefaultAvatar(selectedGender)
    setSelectedAvatar(randomAvatar)
  }

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError) {
        console.error('Auth error:', authError)
        throw new Error(`Authentication error: ${authError.message}`)
      }

      if (!user) {
        console.error('No user session found')
        throw new Error('Not authenticated. Please log in again.')
      }

      // Check if username is available
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .single()

      if (existingProfile) {
        throw new Error('Username already taken')
      }

      // Determine profile image URL priority:
      // 1. OAuth image
      // 2. Selected default avatar
      const profileImageUrl = oauthImageUrl || selectedAvatar

      // Create profile with image
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          account_type: accountType,
          username: username.toLowerCase(),
          full_name: accountType === 'individual' ? fullName : null,
          email: user.email,
          profile_image_url: profileImageUrl,
          gender: gender,
        })

      if (profileError) throw profileError

      // If organization, create organization record
      if (accountType === 'organization') {
        const { error: orgError } = await supabase
          .from('organizations')
          .insert({
            profile_id: user.id,
            organization_name: organizationName,
          })

        if (orgError) throw orgError

        // Add user as organization owner
        const { data: org } = await supabase
          .from('organizations')
          .select('id')
          .eq('profile_id', user.id)
          .single()

        if (org) {
          await supabase
            .from('organization_members')
            .insert({
              organization_id: org.id,
              user_id: user.id,
              role: 'owner',
            })
        }
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      setError(error.message || 'Failed to complete onboarding')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-accent rounded-lg" />
            <span className="text-2xl font-bold">KOMOT</span>
          </div>
          <h1 className="text-3xl font-bold">Complete your profile</h1>
          <p className="text-muted-foreground">Let's get you set up</p>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Choose your account type</CardTitle>
              <CardDescription>Select how you want to use KOMOT</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => handleAccountTypeSelect('individual')}
                className="p-6 border-2 border-border rounded-lg hover:border-accent transition-colors text-left space-y-3"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Individual</h3>
                  <p className="text-sm text-muted-foreground">
                    For students, professionals, freelancers, and creators
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleAccountTypeSelect('organization')}
                className="p-6 border-2 border-border rounded-lg hover:border-accent transition-colors text-left space-y-3"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Organization</h3>
                  <p className="text-sm text-muted-foreground">
                    For companies, startups, universities, and communities
                  </p>
                </div>
              </button>
            </CardContent>
          </Card>
        )}

        {step === 2 && accountType && (
          <Card>
            <CardHeader>
              <CardTitle>
                {accountType === 'individual' ? 'Personal Information' : 'Organization Details'}
              </CardTitle>
              <CardDescription>This information will be visible on your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCompleteOnboarding} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-lg">
                    {error}
                  </div>
                )}

                {/* Profile Image Section */}
                {oauthImageUrl ? (
                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar src={oauthImageUrl} size={64} />
                      <div>
                        <p className="text-sm font-medium">Profile image from OAuth</p>
                        <p className="text-xs text-muted-foreground">
                          We've automatically imported your profile picture
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      <label className="text-sm font-medium">Choose your avatar</label>
                    </div>

                    {!gender ? (
                      <GenderSelector selected={gender} onSelect={handleGenderSelect} />
                    ) : (
                      <div className="space-y-4">
                        <AvatarSelector
                          gender={gender}
                          selectedAvatar={selectedAvatar}
                          onSelect={setSelectedAvatar}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setGender(null)
                            setSelectedAvatar(null)
                          }}
                          disabled={isLoading}
                        >
                          Change avatar style
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Username *
                  </label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="yourname"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    required
                    disabled={isLoading}
                    pattern="[a-z0-9_\-]+"
                    title="Only lowercase letters, numbers, hyphens and underscores"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your unique KOMOT identifier: komot.online/{accountType === 'individual' ? 'u' : 'o'}/{username}
                  </p>
                </div>

                {accountType === 'individual' ? (
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium">
                      Full Name *
                    </label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label htmlFor="organizationName" className="text-sm font-medium">
                      Organization Name *
                    </label>
                    <Input
                      id="organizationName"
                      type="text"
                      placeholder="Your Organization"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? 'Creating profile...' : 'Complete setup'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
