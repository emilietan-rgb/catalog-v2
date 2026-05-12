import './StatusBadge.css'

const STATUS_CONFIG = {
  delivered: { label: 'Delivered',   bg: '#e8faef', border: '#d2f3df', color: '#189c4c' },
  review:    { label: 'In review',   bg: '#fff8e6', border: '#ffedb0', color: '#b45309' },
  action:    { label: 'Action req.', bg: '#ffecef', border: '#ffd9de', color: '#e63a52' },
  sent:      { label: 'Sent',        bg: '#ede9ff', border: '#d9d2f7', color: '#7a57e2' },
  takedown:  { label: 'Takedown',    bg: '#f3f4f8', border: '#ebeff5', color: '#0f1012' },
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
