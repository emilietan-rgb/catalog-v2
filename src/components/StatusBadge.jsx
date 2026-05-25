import './StatusBadge.css'

const STATUS_CONFIG = {
  delivered: { label: 'Delivered',      bg: '#e8faef', border: '#d2f3df', color: '#189c4c' },
  review:    { label: 'To approve',     bg: '#f3efff', border: '#e8dffe', color: '#7a57e2' },
  action:    { label: 'Not delivered',  bg: '#f3f4f8', border: '#e5e7ef', color: '#747884' },
  sent:      { label: 'Sent to DSPs',   bg: '#f3efff', border: '#e8dffe', color: '#7a57e2' },
  takedown:  { label: 'Not delivered',  bg: '#f3f4f8', border: '#e5e7ef', color: '#747884' },
  draft:     { label: 'Draft',          bg: '#f3f4f8', border: '#e5e7ef', color: '#747884' },
}

export default function StatusBadge({ status, count }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.takedown
  const label = (status === 'delivered' && count != null) ? `${cfg.label} (${count})` : cfg.label
  return (
    <span
      className="status-badge"
      style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}
    >
      {label}
    </span>
  )
}
