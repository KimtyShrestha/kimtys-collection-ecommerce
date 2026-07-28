// Centre-crops product images to square and resizes to 800x800.
// Fixes inconsistent aspect ratios and reduces page weight.
// Safe to re-run: already-square 800px images are skipped.
// Usage: npm run images:optimise

import { readdir, rename, unlink } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const DIR = 'uploads/products'
const SIZE = 800
const VALID = ['.jpg', '.jpeg', '.png', '.webp']

async function main() {
  const files = (await readdir(DIR)).filter((file) =>
    VALID.includes(path.extname(file).toLowerCase())
  )

  if (files.length === 0) {
    console.log(`No images found in ${DIR}`)
    return
  }

  let processed = 0
  let skipped = 0

  for (const file of files) {
    const source = path.join(DIR, file)
    const temp = path.join(DIR, `tmp-${file}`)

    try {
      const metadata = await sharp(source).metadata()

      if (metadata.width === SIZE && metadata.height === SIZE) {
        skipped += 1
        continue
      }

      // sharp cannot write to the file it is reading — use a temp file.
      await sharp(source)
        .resize(SIZE, SIZE, { fit: 'cover', position: 'attention' })
        .jpeg({ quality: 85 })
        .toFile(temp)

      await unlink(source)
      await rename(temp, source)

      console.log(
        `squared  ${file}  (${metadata.width}x${metadata.height} -> ${SIZE}x${SIZE})`
      )
      processed += 1
    } catch (error) {
      console.error(`failed   ${file}: ${error.message}`)
      try { await unlink(temp) } catch { /* nothing to clean */ }
    }
  }

  console.log(`\nProcessed: ${processed} · Already square: ${skipped}`)
}

main()