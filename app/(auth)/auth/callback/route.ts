import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * OAuth callback handler
 * Exchanges authorization code for session and extracts profile image from OAuth provider
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/onboarding'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Extract OAuth profile image URL
      let oauthImageUrl: string | null = null

      // Check for Google OAuth image
      if (data.user.app_metadata.provider === 'google') {
        oauthImageUrl = data.user.user_metadata.avatar_url ||
                       data.user.user_metadata.picture ||
                       null
      }

      // Check for GitHub OAuth image
      if (data.user.app_metadata.provider === 'github') {
        oauthImageUrl = data.user.user_metadata.avatar_url || null
      }

      // Store OAuth image URL in session for onboarding to use
      if (oauthImageUrl) {
        // We'll pass this through the onboarding page via session
        // The onboarding page will read it and store it in the profile
        const response = NextResponse.redirect(`${origin}${next}`)
        response.cookies.set('oauth_image_url', oauthImageUrl, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 600, // 10 minutes - enough for onboarding
          path: '/',
        })
        return response
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to login if there's an error
  return NextResponse.redirect(`${origin}/login`)
}
