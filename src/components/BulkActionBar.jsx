import './BulkActionBar.css'

export default function BulkActionBar({ count, onClear, actions }) {
  if (count === 0) return null
  return (
    <div className="bulk-bar">
      <span className="bulk-count">{count} selected</span>
      <div className="bulk-actions">
        {actions.map(a => (
          <button key={a.label} className="bulk-btn" onClick={a.onClick} disabled={a.disabled}>
            {a.label}
          </button>
        ))}
        <button className="bulk-btn bulk-close" onClick={onClear} aria-label="Clear selection">✕</button>
      </div>
    </div>
  )
}
