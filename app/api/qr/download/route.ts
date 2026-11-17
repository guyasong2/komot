import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateQRWithLogo } from '@/lib/qr-with-logo'
import QRCode from 'qrcode'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')
    const format = searchParams.get('format') || 'png'

    if (!token) {
      return NextResponse.json(
        { error: 'QR token is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get QR code from database
    const { data: qrCode, error: qrError } = await supabase
      .from('qr_codes')
      .select('*, profiles!inner(username)')
      .eq('qr_token', token)
      .single()

    if (qrError || !qrCode) {
      return NextResponse.json(
        { error: 'QR code not found' },
        { status: 404 }
      )
    }

    // Check authentication - only owner can download
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || qrCode.profile_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // @ts-ignore - profiles is joined
    const username = qrCode.profiles?.username

    const qrUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://komot.online'}/u/${username}?qr=${token}`

    if (format === 'svg') {
      // Generate SVG
      const svgString = await QRCode.toString(qrUrl, {
        type: 'svg',
        width: 512,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      })

      return new NextResponse(svgString, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Content-Disposition': `attachment; filename="qr-${qrCode.qr_name.toLowerCase().replace(/\s+/g, '-')}.svg"`
        }
      })
    } else {
      // Generate PNG with logo
      const qrDataUrl = await generateQRWithLogo(qrUrl)

      // Convert data URL to buffer
      const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '')
      const pngBuffer = Buffer.from(base64Data, 'base64')

      return new NextResponse(pngBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="qr-${qrCode.qr_name.toLowerCase().replace(/\s+/g, '-')}.png"`
        }
      })
    }

  } catch (error) {
    console.error('Error generating QR download:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}
