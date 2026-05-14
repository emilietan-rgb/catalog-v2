import './CompletenessBar.css'

export default function CompletenessBar({ pct }) {
  const isReady = pct >= 100
  const color = isReady ? '#189c4c' : '#b45309'
  const trackColor = isReady ? '#e8faef' : '#fff3ea'
  const label = isReady ? 'Ready to submit' : 'Missing fields'
  return (
    <div className="completeness">
      <div className="completeness-bar" style={{ background: trackColor }}>
        <div className="completeness-fill" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
      </div>
      <span className="completeness-label" style={{ color }}>{label}</span>
    </div>
  )
}
