import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { nanoid } from 'nanoid'
import { generateQRWithLogo } from '@/lib/qr-with-logo'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { profile_id, qr_name, qr_type, visibility } = body

    // Verify the profile belongs to the user
    if (profile_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Generate unique QR token
    const qr_token = nanoid(24)

    // Insert QR code into database
    const { data: qrCode, error: qrError } = await supabase
      .from('qr_codes')
      .insert({
        profile_id,
        qr_name,
        qr_token,
        qr_type,
        is_active: true
      })
      .select()
      .single()

    if (qrError) {
      console.error('Error creating QR code:', qrError)
      return NextResponse.json(
        { error: 'Failed to create QR code' },
        { status: 500 }
      )
    }

    // Insert visibility settings
    const visibilityEntries = Object.entries(visibility).map(([section_name, is_visible]) => ({
      qr_code_id: qrCode.id,
      section_name,
      is_visible: is_visible as boolean
    }))

    const { error: visibilityError } = await supabase
      .from('qr_visibility')
      .insert(visibilityEntries)

    if (visibilityError) {
      console.error('Error setting visibility:', visibilityError)
    }

    // Get profile username for QR URL
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', profile_id)
      .single()

    // Generate QR code data URL with KOMOT logo in center
    const qrUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://komot.online'}/u/${profile?.username}?qr=${qr_token}`

    const qrDataUrl = await generateQRWithLogo(qrUrl)

    return NextResponse.json({
      success: true,
      qr_code: {
        ...qrCode,
        qr_data_url: qrDataUrl,
        qr_url: qrUrl
      }
    })

  } catch (error) {
    console.error('Error in QR generation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
