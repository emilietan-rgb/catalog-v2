import './CompletenessBar.css'

export default function CompletenessBar({ pct, label }) {
  const isReady = pct >= 100
  const color = isReady ? '#189c4c' : '#b45309'
  const trackColor = isReady ? '#e8faef' : '#fff3ea'
  return (
    <div className="completeness">
      <div className="completeness-bar" style={{ background: trackColor }}>
        <div className="completeness-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="completeness-label" style={{ color }}>{label}</span>
    </div>
  )
}
