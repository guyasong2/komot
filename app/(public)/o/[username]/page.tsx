import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileAvatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Link as LinkIcon,
  Package,
} from 'lucide-react'

interface PageProps {
  params: Promise<{ username: string }>
}

async function getOrganizationProfile(username: string) {
  const supabase = await createClient()

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from('komot.profiles')
    .select('*')
    .eq('username', username)
    .eq('is_public', true)
    .eq('account_type', 'organization')
    .single()

  if (profileError || !profile) {
    return null
  }

  // Increment profile views
  await supabase.from('komot.profile_views').insert({
    profile_id: profile.id,
    viewed_at: new Date().toISOString(),
  })

  // Fetch organization details
  const { data: organization } = await supabase
    .from('komot.organizations')
    .select('*')
    .eq('profile_id', profile.id)
    .single()

  // Fetch social links
  const { data: socialLinks } = await supabase
    .from('komot.social_links')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('is_visible', true)
    .order('display_order', { ascending: true })

  // Fetch projects (products/services)
  const { data: projects } = await supabase
    .from('komot.projects')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('is_visible', true)
    .order('display_order', { ascending: true })

  return {
    profile,
    organization: organization || null,
    socialLinks: socialLinks || [],
    projects: projects || [],
  }
}

export default async function OrganizationProfilePage({ params }: PageProps) {
  const { username } = await params
  const data = await getOrganizationProfile(username)

  if (!data) {
    notFound()
  }

  const { profile, organization, socialLinks, projects } = data

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      {profile.cover_image_url && (
        <div className="relative h-48 md:h-64 w-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-600">
          <img
            src={profile.cover_image_url}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Organization Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${profile.cover_image_url ? '-mt-16' : 'pt-8'} pb-6`}>
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
            {/* Logo */}
            <div className={`${profile.cover_image_url ? 'ring-4 ring-background' : ''}`}>
              <ProfileAvatar profile={profile} size={128} />
            </div>

            {/* Organization Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Building2 className="w-8 h-8" />
                {organization?.organization_name || profile.full_name || profile.username}
              </h1>
              <p className="text-muted-foreground">@{profile.username}</p>
              {organization?.category && (
                <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-muted border border-border">
                  {organization.category}
                </span>
              )}
              {(organization?.description || profile.bio) && (
                <p className="mt-3 text-base">{organization?.description || profile.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                {organization?.address && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {organization.address}
                  </span>
                )}
                {organization?.founded_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Founded {new Date(organization.founded_date).getFullYear()}
                  </span>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div>
              <Button variant="default">
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        {(profile.website || organization?.official_email || organization?.official_phone) && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="truncate">{profile.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
                {organization?.official_email && (
                  <a
                    href={`mailto:${organization.official_email}`}
                    className="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{organization.official_email}</span>
                  </a>
                )}
                {organization?.official_phone && (
                  <a
                    href={`tel:${organization.official_phone}`}
                    className="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <Phone className="w-4 h-4" />
                    {organization.official_phone}
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Products/Services */}
        {projects.length > 0 && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Products & Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow">
                    {project.image_url && (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h3 className="font-semibold text-lg">{project.title}</h3>
                    {project.description && (
                      <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs rounded-full bg-muted"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-3 text-sm text-primary hover:underline"
                      >
                        <Globe className="w-4 h-4" />
                        Learn More
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params
  const data = await getOrganizationProfile(username)

  if (!data) {
    return {
      title: 'Organization Not Found',
    }
  }

  const { profile, organization } = data
  const title = `${organization?.organization_name || profile.full_name || profile.username} - KOMOT`
  const description = organization?.description || profile.bio || `View ${organization?.organization_name || profile.username} on KOMOT`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile.profile_image_url ? [profile.profile_image_url] : [],
    },
  }
}
