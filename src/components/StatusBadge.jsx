import './StatusBadge.css'

const STATUS_CONFIG = {
  delivered: { label: 'Delivered',      bg: '#e8faef', border: '#d2f3df', color: '#189c4c' },
  review:    { label: 'To approve',     bg: '#f3efff', border: '#e8dffe', color: '#7a57e2' },
  action:    { label: 'Not delivered',  bg: '#f3f4f8', border: '#e5e7ef', color: '#747884' },
  sent:      { label: 'Sent to DSPs',   bg: '#f3efff', border: '#e8dffe', color: '#7a57e2' },
  takedown:  { label: 'Not delivered',  bg: '#f3f4f8', border: '#e5e7ef', color: '#747884' },
  draft:               { label: 'Draft',               bg: '#f3f4f8', border: '#e5e7ef', color: '#747884' },
  awaiting_correction: { label: 'Awaiting correction', bg: '#fef2f2', border: '#fecaca', color: '#e63a52' },
  removed:   { label: 'Taken down',      bg: '#f3f4f8', border: '#e5e7ef', color: '#747884' },
}

const EDIT_ICON = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M11 2l3 3-8 8H3v-3l8-8z"/>
  </svg>
)

const SCHEDULE_ICON = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="8" cy="8" r="6"/>
    <path d="M8 5v3.5l2 2"/>
  </svg>
)

const WITH_EDIT_ICON = new Set(['draft', 'awaiting_correction'])

export default function StatusBadge({ status, count }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.takedown
  const label = (status === 'delivered' && count != null) ? `${cfg.label} (${count})` : cfg.label
  return (
    <span
      className="status-badge"
      style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}
    >
      {WITH_EDIT_ICON.has(status) && EDIT_ICON}
      {status === 'review' && SCHEDULE_ICON}
      {label}
    </span>
  )
}
