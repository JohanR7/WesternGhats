import { useState } from 'react'
import Reveal from '../components/Reveal'
import RevealGroup from '../components/RevealGroup'

const LOGO_URL =
  'https://raw.githubusercontent.com/azure-2k4/WesternGhatsBrochure/d2edb106ea36ae4d9b6fe6ae23cf4fe9aaed42e4/Jun%2010%2C%202026%2C%2011_58_03%20AM.png'

const PILLARS = [
  { title: 'Ethical Foundation', body: 'Government-guided practices that protect community interests' },
  { title: 'Long-Term Continuity', body: 'Formal agreements support lasting, respectful partnership' },
  { title: 'Verified Impact', body: 'A documented, transparent story of community benefit' },
  { title: 'Trust & Stability', body: 'Community trust built on consistency and fair treatment' },
  { title: 'Cultural Authenticity', body: 'Government-recognised, genuine heritage — not appropriated' },
  { title: 'A Model Worth Repeating', body: 'A framework other preservation efforts can learn from' },
]

export default function Community() {
  const [logoError, setLogoError] = useState(false)

  return (
    <div className="section-wrap ivory" id="community">
      <div className="inner">
        <div className="kit-grid">
          <div>
            <Reveal as="div" className="eyebrow">
              Trusted Partnership
            </Reveal>
            <Reveal as="h2" delay={0.1} className="display">
              Government-Backed
              <br />
              <em>Institutional Support</em>
            </Reveal>
            <Reveal as="div" delay={0.2} className="rule" />
            <Reveal as="div" delay={0.3}>
              <div className="logo-card">
                {!logoError ? (
                  <img
                    src={LOGO_URL}
                    style={{ height: 56, width: 'auto' }}
                    alt="Atmranya"
                    loading="lazy"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div style={{ fontSize: '2.4rem' }}>🌿</div>
                )}
                <h4>Atmranya</h4>
                <p>Forest-Origin Heritage Food Brand</p>
              </div>
              <div className="kit-sep">×</div>
              <div className="logo-card">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Government_of_Kerala_Logo.svg"
                  style={{ height: 56, width: 'auto' }}
                  alt="KIRTADS"
                  loading="lazy"
                />
                <h4>KIRTADS</h4>
                <p>Kerala Institute for Research, Training &amp; Development Studies · Government of Kerala</p>
              </div>
            </Reveal>
          </div>
          <Reveal as="div" delay={0.1}>
            <div className="body-text" style={{ marginBottom: 18 }}>
              <p>
                KIRTADS — a Government of Kerala statutory body — is actively guiding Atmranya
                on respectful community engagement, ethical sourcing, and fair tribal
                partnership. This gives our preservation work real institutional grounding, from
                a body with direct responsibility for tribal welfare.
              </p>
            </div>
            <div className="body-text" style={{ marginBottom: 30 }}>
              <p>
                Through Dr. Pradeep Kumar K.S., Deputy Director (Training), KIRTADS helps ensure
                that this work is done properly — with consent, fairness, and long-term
                community benefit at the centre of it.
              </p>
            </div>
            <RevealGroup className="pillars" y={16}>
              {PILLARS.map((p) => (
                <div className="pillar" key={p.title}>
                  <h5>{p.title}</h5>
                  <p>{p.body}</p>
                </div>
              ))}
            </RevealGroup>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
