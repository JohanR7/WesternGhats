import { useState } from 'react'
import Reveal from '../components/Reveal'

const LOGO_URL =
  'https://raw.githubusercontent.com/azure-2k4/WesternGhatsBrochure/d2edb106ea36ae4d9b6fe6ae23cf4fe9aaed42e4/Jun%2010%2C%202026%2C%2011_58_03%20AM.png'

export default function Contact() {
  const [logoError, setLogoError] = useState(false)

  return (
    <div className="section-wrap cream" id="contact">
      <div className="inner">
        <div className="contact-grid">
          <div>
            <Reveal as="div" className="eyebrow">
              Contact
            </Reveal>
            <Reveal as="h2" delay={0.1} className="display">
              Let&rsquo;s Build This
              <br />
              <em>Together</em>
            </Reveal>
            <Reveal as="div" delay={0.2} className="rule" />
            <Reveal as="p" delay={0.3} className="body-text" style={{ marginBottom: 36 }}>
              Reach out directly to discuss investment terms, ask questions about the business,
              or schedule a call with the founding team.
            </Reveal>
            <Reveal as="div" delay={0.1} className="c-item">
              <div className="c-icon">✉️</div>
              <div>
                <div className="c-lbl">Email</div>
                <div className="c-val">westernghatsorigin@gmail.com</div>
              </div>
            </Reveal>
            <Reveal as="div" delay={0.2} className="c-item">
              <div className="c-icon">📞</div>
              <div>
                <div className="c-lbl">Phone &amp; WhatsApp</div>
                <div className="c-val">+91 70122 78703</div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="contact-brand">
            {!logoError && (
              <img
                src={LOGO_URL}
                alt="Western Ghats"
                className="contact-brand-img"
                onError={() => setLogoError(true)}
              />
            )}
            <div className="contact-tagline">
              &ldquo;Every product tells a story.
              <br />
              Every rupee invested
              <br />
              preserves a tradition.&rdquo;
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
