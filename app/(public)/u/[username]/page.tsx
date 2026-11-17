import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileAvatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  MapPin,
  Globe,
  Mail,
  Briefcase,
  GraduationCap,
  Award,
  Wrench,
  FolderGit2,
  Link as LinkIcon,
  Calendar,
} from 'lucide-react'

interface PageProps {
  params: Promise<{ username: string }>
}

async function getPublicProfile(username: string) {
  const supabase = await createClient()

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from('komot.profiles')
    .select('*')
    .eq('username', username)
    .eq('is_public', true)
    .eq('account_type', 'individual')
    .single()

  if (profileError || !profile) {
    return null
  }

  // Increment profile views
  await supabase.from('komot.profile_views').insert({
    profile_id: profile.id,
    viewed_at: new Date().toISOString(),
  })

  // Fetch social links
  const { data: socialLinks } = await supabase
    .from('komot.social_links')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('is_visible', true)
    .order('display_order', { ascending: true })

  // Fetch education
  const { data: education } = await supabase
    .from('komot.education')
    .select('*')
    .eq('profile_id', profile.id)
    .order('display_order', { ascending: true })

  // Fetch work experience
  const { data: workExperience } = await supabase
    .from('komot.work_experience')
    .select('*')
    .eq('profile_id', profile.id)
    .order('display_order', { ascending: true })

  // Fetch skills
  const { data: skills } = await supabase
    .from('komot.skills')
    .select('*')
    .eq('profile_id', profile.id)
    .order('display_order', { ascending: true })

  // Fetch projects
  const { data: projects } = await supabase
    .from('komot.projects')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('is_visible', true)
    .order('display_order', { ascending: true })

  return {
    profile,
    socialLinks: socialLinks || [],
    education: education || [],
    workExperience: workExperience || [],
    skills: skills || [],
    projects: projects || [],
  }
}

function formatDate(date: string | null, isCurrent?: boolean) {
  if (isCurrent) return 'Present'
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

export default async function IndividualProfilePage({ params }: PageProps) {
  const { username } = await params
  const data = await getPublicProfile(username)

  if (!data) {
    notFound()
  }

  const { profile, socialLinks, education, workExperience, skills, projects } = data

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      {profile.cover_image_url && (
        <div className="relative h-48 md:h-64 w-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
          <img
            src={profile.cover_image_url}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Profile Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${profile.cover_image_url ? '-mt-16' : 'pt-8'} pb-6`}>
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
            {/* Profile Image */}
            <div className={`${profile.cover_image_url ? 'ring-4 ring-background' : ''}`}>
              <ProfileAvatar profile={profile} size={128} />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{profile.full_name || profile.username}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
              {profile.bio && <p className="mt-2 text-base">{profile.bio}</p>}

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </span>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    <Globe className="w-4 h-4" />
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="default">Connect</Button>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </div>

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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Work Experience */}
            {workExperience.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Work Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {workExperience.map((work) => (
                    <div key={work.id} className="border-l-2 border-border pl-4">
                      <h3 className="font-semibold">{work.position}</h3>
                      <p className="text-muted-foreground">{work.company}</p>
                      {work.location && (
                        <p className="text-sm text-muted-foreground">{work.location}</p>
                      )}
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(work.start_date)} - {formatDate(work.end_date, work.is_current)}
                      </p>
                      {work.description && (
                        <p className="mt-2 text-sm">{work.description}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {education.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="border-l-2 border-border pl-4">
                      <h3 className="font-semibold">{edu.institution}</h3>
                      <p className="text-muted-foreground">
                        {edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(edu.start_date)} - {formatDate(edu.end_date, edu.is_current)}
                      </p>
                      {edu.achievements && (
                        <p className="mt-2 text-sm">{edu.achievements}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderGit2 className="w-5 h-5" />
                    Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-border rounded-lg p-4">
                      {project.image_url && (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-48 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h3 className="font-semibold">{project.title}</h3>
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
                          View Project
                        </a>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            {skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1 text-sm rounded-full bg-muted border border-border"
                      >
                        {skill.skill_name}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params
  const data = await getPublicProfile(username)

  if (!data) {
    return {
      title: 'Profile Not Found',
    }
  }

  const { profile } = data
  const title = `${profile.full_name || profile.username} - KOMOT`
  const description = profile.bio || `View ${profile.full_name || profile.username}'s profile on KOMOT`

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
