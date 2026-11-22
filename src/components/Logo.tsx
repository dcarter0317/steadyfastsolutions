import emblemUrl from '../assets/steadfast-emblem.svg'
import logoUrl from '../assets/steadfast-logo.svg'

export type LogoProps = {
  /** `full` is the badge with name ribbon and tagline; `emblem` is the house mark alone. */
  variant?: 'full' | 'emblem'
  /** Rendered width in px. Height follows the aspect ratio. */
  size?: number
  alt?: string
}

// Intrinsic ratios of the two SVG files, so the browser reserves space before they load.
const sources = {
  full: { src: logoUrl, width: 556, height: 566, alt: 'Steadfast Solutions, General Contracting & Repairs' },
  emblem: { src: emblemUrl, width: 556, height: 352, alt: 'Steadfast Solutions' },
}

/** Brand logo, served from src/assets. */
export function Logo({ variant = 'full', size = 240, alt }: LogoProps) {
  const logo = sources[variant]
  return (
    <img
      className="logo"
      src={logo.src}
      width={size}
      height={Math.round((size * logo.height) / logo.width)}
      alt={alt ?? logo.alt}
    />
  )
}
