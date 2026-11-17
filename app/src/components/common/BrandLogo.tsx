interface BrandLogoProps {
  /** clases de tamaño del <img> (altura). Por defecto la versión de barra de navegación. */
  className?: string
  /** clases del slogan en texto vivo. Por defecto no se muestra. */
  sloganClassName?: string
  align?: 'start' | 'center'
  /** variante para fondos oscuros: wordmark en blanco. */
  inverted?: boolean
  /** solo el isotipo, para barras laterales colapsadas. No admite slogan. */
  icon?: boolean
}

export function BrandLogo({
  className = 'h-8',
  sloganClassName,
  align = 'start',
  inverted = false,
  icon = false,
}: BrandLogoProps) {
  const centered = align === 'center'
  const src = icon
    ? '/brand/voxia-icon.svg'
    : inverted
      ? '/brand/voxia-logo-horizontal-inverse.svg'
      : '/brand/voxia-logo-horizontal.svg'

  return (
    <span className={`flex w-fit flex-col gap-0.5 ${centered ? 'items-center' : 'items-start'}`}>
      <img src={src} alt="Voxia" className={className} />
      {sloganClassName && (
        <span className={`vx-slogan ${sloganClassName}`}>comunicación inteligente</span>
      )}
    </span>
  )
}
