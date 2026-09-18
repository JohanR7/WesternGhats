import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

export default function StatNumber({ value, className = '' }) {
  const ref = useRef(null)
  const match = String(value).match(/^(\d+)(.*)$/)
  const target = match ? Number(match[1]) : null
  const suffix = match ? match[2] : ''

  useLayoutEffect(() => {
    const el = ref.current
    if (target === null) return
    const ctx = gsap.context(() => {
      const counter = { val: 0 }
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () =>
          gsap.to(counter, {
            val: target,
            duration: 1.4,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = Math.round(counter.val) + suffix
            },
          }),
      })
    }, ref)
    return () => ctx.revert()
  }, [target, suffix])

  return (
    <div ref={ref} className={className}>
      {target === null ? value : `0${suffix}`}
    </div>
  )
}
