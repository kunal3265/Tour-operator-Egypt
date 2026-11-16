import type { ImgHTMLAttributes } from 'react'

import { IMAGE_ALT, IMAGES, type PhotoKey } from '../lib/images'

/** Every photograph goes through here, so swapping a file in lib/images.ts updates the site. */
export function Photo({ name, alt, ...rest }: { name: PhotoKey; alt?: string } & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>) {
  return <img src={IMAGES[name]} alt={alt ?? IMAGE_ALT[name]} decoding="async" {...rest} />
}
