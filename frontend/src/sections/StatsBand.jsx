import RevealGroup from '../components/RevealGroup'
import StatNumber from '../components/StatNumber'

const STATS = [
  { num: '2', label: 'Indigenous Communities in Active Partnership' },
  { num: '10+', label: 'Traditional Recipes Being Preserved' },
  { num: '1', label: 'UNESCO Biodiversity Hotspot at the Source' },
  { num: '0', label: 'Comparable Efforts at This Scale, Today' },
]

export default function StatsBand() {
  return (
    <div className="stats-band">
      <RevealGroup className="stats-inner" y={16}>
        {STATS.map((s) => (
          <div className="stat-cell" key={s.label}>
            <StatNumber value={s.num} className="stat-num" />
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </RevealGroup>
    </div>
  )
}
