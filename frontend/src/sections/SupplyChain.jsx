import Reveal from '../components/Reveal'
import RevealGroup from '../components/RevealGroup'

const STEPS = [
  {
    title: 'Raw Material Sourcing',
    body: 'Core ingredients — wild mangoes, wild ginger, forest pepper, natural honey, and other seasonal forest produce — are collected directly from the forests of Malappuram and Wayanad by indigenous communities with deep traditional knowledge of the region and its biodiversity.',
  },
  {
    title: 'Community-Based Manufacturing',
    body: 'Products are traditionally manufactured by tribal women within their forest villages using recipes and techniques preserved through generations. Production focuses on:',
    list: [
      'Traditional preparation methods',
      'Authentic regional flavor profiles',
      'Clean and hygienic manufacturing practices',
      'Preservation of cultural and ethnic food identity',
    ],
  },
  {
    title: 'Quality Control & Packaging Unit',
    body: 'Finished products are transported to a nearby leased operational facility managed by Western Ghats, where every batch undergoes:',
    list: [
      'Quality inspection & verification',
      'Batch validation',
      'Labeling and branding',
      'Premium packaging & box assembly',
      'Inventory management',
    ],
  },
  {
    title: 'Distribution & Delivery',
    body: 'Packaged products are dispatched directly to customers through our distribution network:',
    list: ['Direct website orders', 'Instagram & online commerce', 'Pre-order launches', 'Future C&F & distribution partnerships'],
  },
]

const TAGS = [
  'Consistent Product Supply',
  'Long-Term Manufacturing Continuity',
  'Ethical Sourcing Practices',
  'Fair Community Participation',
  'Traditional Knowledge Protection',
]

export default function SupplyChain() {
  return (
    <div className="section-wrap ivory" id="supply-chain">
      <div className="inner">
        <Reveal>
          <div className="eyebrow">Manufacturing &amp; Supply Chain</div>
          <h2 className="display">
            A Supply Chain
            <br />
            <em>Built for Authenticity at Scale</em>
          </h2>
          <div className="rule" />
          <p className="body-text">
            Western Ghats follows a community-driven manufacturing and sourcing model designed
            to preserve authentic tribal food traditions while ensuring product quality,
            operational consistency, and long-term supply sustainability.
          </p>
        </Reveal>
        <RevealGroup className="msc-grid" y={20}>
          {STEPS.map((s, i) => (
            <div className="msc-step" key={s.title}>
              <div className="msc-num">{String(i + 1).padStart(2, '0')}</div>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
              {s.list && (
                <ul className="msc-list">
                  {s.list.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              )}
              {i < STEPS.length - 1 && <div className="msc-arrow">→</div>}
            </div>
          ))}
        </RevealGroup>

        <Reveal className="msc-agreement" delay={0.1}>
          <h4>Sustainable Partnership Agreements — A Foundation for the Long Term</h4>
          <p>
            To ensure this work can continue for years to come, Western Ghats plans to establish
            formal agreements with the tribal communities involved in sourcing and manufacturing
            — developed with institutional guidance from KIRTADS. This turns an informal
            relationship into a structured, fair, and lasting partnership.
          </p>
          <div className="msc-tags">
            {TAGS.map((t) => (
              <span className="msc-tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal className="msc-foot" delay={0.2}>
          <p>
            &ldquo;Western Ghats is building a supply chain where authenticity is preserved at
            the source — while quality control, packaging, and commercial scalability are
            managed centrally.&rdquo;
          </p>
        </Reveal>
      </div>
    </div>
  )
}
