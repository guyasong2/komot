'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

interface QRCodeDisplayProps {
  qrToken: string
  username: string
  size?: number
}

export function QRCodeDisplay({ qrToken, username, size = 200 }: QRCodeDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('')

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://komot.online'}/u/${username}?qr=${qrToken}`
        const dataUrl = await QRCode.toDataURL(url, {
          width: size,
          margin: 2,
          color: {
            dark: '#10b981', // Green color (emerald-500)
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        })
        setQrDataUrl(dataUrl)
      } catch (error) {
        console.error('Error generating QR code:', error)
      }
    }

    generateQR()
  }, [qrToken, username, size])

  if (!qrDataUrl) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 rounded"
        style={{ width: size, height: size }}
      >
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <img
      src={qrDataUrl}
      alt={`QR Code for ${username}`}
      width={size}
      height={size}
      className="rounded"
    />
  )
}
