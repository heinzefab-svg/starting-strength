import sharp from 'sharp'
import { readFileSync } from 'fs'

const svg = readFileSync('./public/icon.svg')

const sizes = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 16, name: 'favicon-16x16.png' }
]

async function generateIcons() {
  console.log('Generating icons...')

  for (const { size, name } of sizes) {
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(`./public/${name}`)
    console.log(`✓ Generated ${name} (${size}x${size})`)
  }

  console.log('\nAll icons generated successfully!')
}

generateIcons().catch(console.error)
