import Lenis from 'lenis'
import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis()
    const raf = (time) => lenis.raf(time * 1000)

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // Trigger positions are cached from layout at mount time; web fonts and
    // images loading after that shift section offsets, so re-measure once
    // everything has actually settled.
    document.fonts?.ready?.then(() => ScrollTrigger.refresh())
    window.addEventListener('load', () => ScrollTrigger.refresh())

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])
}
