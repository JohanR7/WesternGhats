import Reveal from './Reveal'

export default function TaglineBanner({ variant = 'cream', children }) {
  return (
    <Reveal as="div" className={`tagline-banner on-${variant}`}>
      <span className="tagline-mark">&ldquo;</span>
      <p className="tagline-text">{children}</p>
    </Reveal>
  )
}
