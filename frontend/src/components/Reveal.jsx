import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  y = 26,
  duration = 0.7,
  className = '',
  ...props
}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, y })
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () =>
          gsap.to(el, { opacity: 1, y: 0, duration, delay, ease: 'power2.out' }),
      })
    }, ref)
    return () => ctx.revert()
  }, [delay, y, duration])

  return (
    <Tag ref={ref} className={className} {...props}>
      {children}
    </Tag>
  )
}
