import './StatusBadge.css'

const STATUS_CONFIG = {
  delivered: { label: 'Delivered',      bg: '#e8faef', border: '#d2f3df', color: '#189c4c' },
  review:    { label: 'Under review',   bg: '#fff3ea', border: '#ffe7d5', color: '#e67828' },
  action:    { label: 'Action required',bg: '#ffecef', border: '#ffd9de', color: '#e63a52' },
  sent:      { label: 'Sent to DSPs',   bg: '#e8dffe', border: '#f3efff', color: '#7a57e2' },
  takedown:  { label: 'Taken down',     bg: '#f3f4f8', border: '#ebeff5', color: '#0f1012' },
}

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.takedown
  return (
    <span
      className="status-badge"
      style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}
    >
      {cfg.label}
    </span>
  )
}
