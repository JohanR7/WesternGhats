import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

export default function RevealGroup({
  children,
  as: Tag = 'div',
  className = '',
  stagger = 0.1,
  y = 24,
  duration = 0.7,
  ...props
}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    const items = el.children
    const ctx = gsap.context(() => {
      gsap.set(items, { opacity: 0, y })
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () =>
          gsap.to(items, { opacity: 1, y: 0, duration, stagger, ease: 'power2.out' }),
      })
    }, ref)
    return () => ctx.revert()
  }, [stagger, y, duration])

  return (
    <Tag ref={ref} className={className} {...props}>
      {children}
    </Tag>
  )
}
