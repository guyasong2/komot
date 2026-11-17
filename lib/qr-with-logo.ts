import QRCode from 'qrcode'
import { createCanvas, loadImage, Canvas } from 'canvas'
import path from 'path'
import fs from 'fs'

export async function generateQRWithLogo(url: string): Promise<string> {
  // Generate base QR code with higher error correction to allow logo overlay
  const qrCanvas = createCanvas(512, 512)
  await QRCode.toCanvas(qrCanvas, url, {
    width: 512,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'H' // High error correction allows up to 30% damage
  })

  const ctx = qrCanvas.getContext('2d')

  // Load KOMOT logo
  const logoPath = path.join(process.cwd(), 'public', 'images', 'komot-logo.png')

  if (fs.existsSync(logoPath)) {
    const logo = await loadImage(logoPath)

    // Calculate logo size (about 20% of QR code size)
    const logoSize = 100
    const logoX = (512 - logoSize) / 2
    const logoY = (512 - logoSize) / 2

    // Draw white background circle for logo
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(256, 256, logoSize / 2 + 10, 0, 2 * Math.PI)
    ctx.fill()

    // Draw logo in center
    ctx.drawImage(logo, logoX, logoY, logoSize, logoSize)
  }

  // Convert to data URL
  return qrCanvas.toDataURL('image/png')
}
