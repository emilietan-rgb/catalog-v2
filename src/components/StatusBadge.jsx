import './StatusBadge.css'

const STATUS_CONFIG = {
  delivered: { label: 'Delivered',      bg: 'transparent', border: '#d2f3df', color: '#189c4c' },
  review:    { label: 'To approve',     bg: 'transparent', border: '#e8dffe', color: '#7a57e2' },
  action:    { label: 'Not delivered',  bg: 'transparent', border: '#e5e7ef', color: '#747884' },
  sent:      { label: 'Sent to DSPs',   bg: 'transparent', border: '#e8dffe', color: '#7a57e2' },
  takedown:  { label: 'Not delivered',  bg: 'transparent', border: '#e5e7ef', color: '#747884' },
  draft:               { label: 'Draft',               bg: 'transparent', border: '#e5e7ef', color: '#747884' },
  awaiting_correction: { label: 'Awaiting correction', bg: 'transparent', border: '#fecaca', color: '#e63a52' },
  removed:   { label: 'Taken down',      bg: 'transparent', border: '#fecaca', color: '#e63a52' },
  on_hold:   { label: 'On hold',         bg: 'transparent', border: '#fde68a', color: '#b45309' },
}

const NOISE_CONTROL_OFF_ICON = (
  <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor" style={{ flexShrink: 0 }}>
    <circle cx="3" cy="3" r="3"/>
  </svg>
)

export default function StatusBadge({ status, count }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.takedown
  const label = (status === 'delivered' && count != null) ? `${cfg.label} (${count})` : cfg.label
  return (
    <span
      className="status-badge"
      style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}
    >
      {NOISE_CONTROL_OFF_ICON}
      {label}
    </span>
  )
}
