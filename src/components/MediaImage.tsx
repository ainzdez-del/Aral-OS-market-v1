import { useEffect, useState } from 'react'

export function MediaImage({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
  }, [src])

  return (
    <img
      src={src}
      alt={alt}
      onLoad={() => setLoaded(true)}
      className={`h-full w-full object-cover transition-[filter,transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-60 blur-md scale-105'
      } ${className}`}
    />
  )
}
