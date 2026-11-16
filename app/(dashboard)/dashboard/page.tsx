import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Building2, QrCode, BarChart3, Users, Sparkles } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user has completed onboarding
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // If no profile exists or is incomplete, redirect to onboarding
  if (!profile || !profile.full_name) {
    redirect('/onboarding')
  }

  // Fetch user stats
  const { count: journeyCount } = await supabase
    .from('journey_entries')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', user.id)

  const { count: connectionCount } = await supabase
    .from('connections')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', user.id)

  const { count: qrScanCount } = await supabase
    .from('qr_scans')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', user.id)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {profile.full_name}! 👋</h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your profile
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.view_count || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total profile views
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">QR Scans</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qrScanCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              QR code scans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Journey Entries</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{journeyCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Entries in your journey
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectionCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              People you've connected with
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">View Profile</CardTitle>
                <p className="text-sm text-muted-foreground">See your public profile</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">Add to Journey</CardTitle>
                <p className="text-sm text-muted-foreground">Add a new entry</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <QrCode className="w-6 h-6 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">QR Codes</CardTitle>
                <p className="text-sm text-muted-foreground">Manage your QR codes</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity to display</p>
            <p className="text-sm mt-2">Start building your profile to see activity here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
