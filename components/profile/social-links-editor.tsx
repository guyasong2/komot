'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react'
import {
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaGithub,
  FaGitlab,
  FaYoutube,
  FaTiktok,
  FaSnapchat,
  FaPinterest,
  FaReddit,
  FaDiscord,
  FaTelegram,
  FaWhatsapp,
  FaTwitch,
  FaSpotify,
  FaSoundcloud,
  FaMedium,
  FaBehance,
  FaDribbble,
  FaDev,
  FaStackOverflow,
  FaProductHunt,
  FaMastodon,
  FaGlobe,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa'
import { SiSubstack, SiThreads, SiBluesky } from 'react-icons/si'

// Social platform definitions with their logos and colors
const SOCIAL_PLATFORMS = [
  { id: 'twitter', name: 'Twitter/X', icon: FaTwitter, color: '#000000', placeholder: 'https://twitter.com/username' },
  { id: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, color: '#0A66C2', placeholder: 'https://linkedin.com/in/username' },
  { id: 'facebook', name: 'Facebook', icon: FaFacebook, color: '#1877F2', placeholder: 'https://facebook.com/username' },
  { id: 'instagram', name: 'Instagram', icon: FaInstagram, color: '#E4405F', placeholder: 'https://instagram.com/username' },
  { id: 'github', name: 'GitHub', icon: FaGithub, color: '#181717', placeholder: 'https://github.com/username' },
  { id: 'gitlab', name: 'GitLab', icon: FaGitlab, color: '#FC6D26', placeholder: 'https://gitlab.com/username' },
  { id: 'youtube', name: 'YouTube', icon: FaYoutube, color: '#FF0000', placeholder: 'https://youtube.com/@username' },
  { id: 'tiktok', name: 'TikTok', icon: FaTiktok, color: '#000000', placeholder: 'https://tiktok.com/@username' },
  { id: 'snapchat', name: 'Snapchat', icon: FaSnapchat, color: '#FFFC00', placeholder: 'https://snapchat.com/add/username' },
  { id: 'pinterest', name: 'Pinterest', icon: FaPinterest, color: '#E60023', placeholder: 'https://pinterest.com/username' },
  { id: 'reddit', name: 'Reddit', icon: FaReddit, color: '#FF4500', placeholder: 'https://reddit.com/user/username' },
  { id: 'discord', name: 'Discord', icon: FaDiscord, color: '#5865F2', placeholder: 'username#0000' },
  { id: 'telegram', name: 'Telegram', icon: FaTelegram, color: '#26A5E4', placeholder: 'https://t.me/username' },
  { id: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, color: '#25D366', placeholder: '+1234567890' },
  { id: 'twitch', name: 'Twitch', icon: FaTwitch, color: '#9146FF', placeholder: 'https://twitch.tv/username' },
  { id: 'spotify', name: 'Spotify', icon: FaSpotify, color: '#1DB954', placeholder: 'https://open.spotify.com/user/username' },
  { id: 'soundcloud', name: 'SoundCloud', icon: FaSoundcloud, color: '#FF3300', placeholder: 'https://soundcloud.com/username' },
  { id: 'medium', name: 'Medium', icon: FaMedium, color: '#000000', placeholder: 'https://medium.com/@username' },
  { id: 'substack', name: 'Substack', icon: SiSubstack, color: '#FF6719', placeholder: 'https://username.substack.com' },
  { id: 'behance', name: 'Behance', icon: FaBehance, color: '#1769FF', placeholder: 'https://behance.net/username' },
  { id: 'dribbble', name: 'Dribbble', icon: FaDribbble, color: '#EA4C89', placeholder: 'https://dribbble.com/username' },
  { id: 'devto', name: 'Dev.to', icon: FaDev, color: '#0A0A0A', placeholder: 'https://dev.to/username' },
  { id: 'stackoverflow', name: 'Stack Overflow', icon: FaStackOverflow, color: '#F58025', placeholder: 'https://stackoverflow.com/users/id/username' },
  { id: 'producthunt', name: 'Product Hunt', icon: FaProductHunt, color: '#DA552F', placeholder: 'https://producthunt.com/@username' },
  { id: 'threads', name: 'Threads', icon: SiThreads, color: '#000000', placeholder: 'https://threads.net/@username' },
  { id: 'mastodon', name: 'Mastodon', icon: FaMastodon, color: '#6364FF', placeholder: 'https://mastodon.social/@username' },
  { id: 'bluesky', name: 'Bluesky', icon: SiBluesky, color: '#0085FF', placeholder: 'https://bsky.app/profile/username' },
  { id: 'website', name: 'Website', icon: FaGlobe, color: '#6B7280', placeholder: 'https://yourwebsite.com' },
  { id: 'email', name: 'Email', icon: FaEnvelope, color: '#6B7280', placeholder: 'email@example.com' },
  { id: 'phone', name: 'Phone', icon: FaPhone, color: '#6B7280', placeholder: '+1234567890' },
]

interface SocialLink {
  id?: string
  platform: string
  label: string
  url: string
  icon?: string
  is_visible: boolean
  display_order: number
}

interface Props {
  profileId: string
  onSave?: () => void
}

export function SocialLinksEditor({ profileId, onSave }: Props) {
  const supabase = createClient()
  const [links, setLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAddMenu, setShowAddMenu] = useState(false)

  useEffect(() => {
    loadSocialLinks()
  }, [profileId])

  async function loadSocialLinks() {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('profile_id', profileId)
        .order('display_order')

      if (error) throw error

      setLinks(data || [])
    } catch (error) {
      console.error('Error loading social links:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveSocialLinks() {
    setSaving(true)
    try {
      // Delete all existing links
      await supabase
        .from('social_links')
        .delete()
        .eq('profile_id', profileId)

      // Insert new links
      if (links.length > 0) {
        const { error } = await supabase
          .from('social_links')
          .insert(
            links.map((link, index) => ({
              profile_id: profileId,
              platform: link.platform,
              label: link.label,
              url: link.url,
              icon: link.icon,
              is_visible: link.is_visible,
              display_order: index
            }))
          )

        if (error) throw error
      }

      onSave?.()
    } catch (error) {
      console.error('Error saving social links:', error)
      alert('Failed to save social links')
    } finally {
      setSaving(false)
    }
  }

  function addSocialLink(platformId: string) {
    const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId)
    if (!platform) return

    const newLink: SocialLink = {
      platform: platform.id,
      label: platform.name,
      url: '',
      icon: platform.id, // Store platform id instead of icon component
      is_visible: true,
      display_order: links.length
    }

    setLinks([...links, newLink])
    setShowAddMenu(false)
  }

  function updateLink(index: number, field: keyof SocialLink, value: any) {
    const newLinks = [...links]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setLinks(newLinks)
  }

  function removeLink(index: number) {
    setLinks(links.filter((_, i) => i !== index))
  }

  function toggleVisibility(index: number) {
    updateLink(index, 'is_visible', !links[index].is_visible)
  }

  if (loading) {
    return <div className="text-center py-4">Loading social links...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Social Links</h3>
        <Button
          onClick={() => setShowAddMenu(!showAddMenu)}
          variant="outline"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </Button>
      </div>

      {/* Add Platform Menu */}
      {showAddMenu && (
        <Card className="p-4 bg-gray-50 border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {SOCIAL_PLATFORMS.map((platform) => {
              const IconComponent = platform.icon
              return (
                <button
                  key={platform.id}
                  onClick={() => addSocialLink(platform.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-left"
                  disabled={links.some(link => link.platform === platform.id)}
                >
                  <IconComponent className="text-lg" style={{ color: platform.color }} />
                  <span className="text-sm font-medium text-gray-900">{platform.name}</span>
                </button>
              )
            })}
          </div>
        </Card>
      )}

      {/* Social Links List */}
      <div className="space-y-3">
        {links.map((link, index) => {
          const platform = SOCIAL_PLATFORMS.find(p => p.id === link.platform)
          if (!platform) return null

          const IconComponent = platform.icon

          return (
            <Card key={index} className="p-4 bg-white border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="cursor-move text-gray-400 hover:text-gray-600">
                    <GripVertical className="w-4 h-4" />
                  </button>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: platform.color }}
                  >
                    <IconComponent className="text-xl" />
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{platform.name}</span>
                  </div>
                  <Input
                    value={link.url}
                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                    placeholder={platform.placeholder}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleVisibility(index)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {link.is_visible ? (
                      <Eye className="w-4 h-4 text-gray-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => removeLink(index)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {links.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No social links added yet.</p>
          <p className="text-sm">Click "Add Link" to get started.</p>
        </div>
      )}

      {/* Save Button */}
      {links.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={saveSocialLinks}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {saving ? 'Saving...' : 'Save Social Links'}
          </Button>
        </div>
      )}
    </div>
  )
}
