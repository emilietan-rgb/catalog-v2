import { useState, useEffect } from 'react'
import './TrackManagementModal.css'

export default function TrackManagementModal({ track, occurrences, releaseTitle, artist, onConfirm, onClose, initialSelected }) {
  const [selected, setSelected] = useState(() =>
    initialSelected ? new Set(initialSelected) : new Set([track.id])
  )

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const toggle = id => setSelected(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const releaseCount = new Set(occurrences.map(() => releaseTitle)).size

  return (
    <div className="tmm-overlay" onMouseDown={onClose}>
      <div className="tmm-modal" onMouseDown={e => e.stopPropagation()}>

        <div className="tmm-header">
          <h3 className="tmm-title">Track details</h3>
          <button className="tmm-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M3 3l10 10M13 3L3 13"/>
            </svg>
          </button>
        </div>

        <div className="tmm-meta">
          <div className="tmm-meta-row">
            <span className="tmm-meta-label">Track</span>
            <span className="tmm-meta-value">{track.title}{track.version ? ` — ${track.version}` : ''}</span>
          </div>
          <div className="tmm-meta-row">
            <span className="tmm-meta-label">ISRC</span>
            <span className="tmm-meta-value mono">{track.isrc || '—'}</span>
          </div>
          <div className="tmm-meta-row">
            <span className="tmm-meta-label">Artist(s)</span>
            <span className="tmm-meta-value">{artist}</span>
          </div>
          <div className="tmm-meta-row">
            <span className="tmm-meta-label">Release</span>
            <span className="tmm-meta-value">{releaseTitle}</span>
          </div>
        </div>

        <div className="tmm-divider" />

        <div className="tmm-usage">
          <span className="tmm-usage-heading">Sound recording usage</span>
          <p className="tmm-usage-desc">
            This recording appears in {occurrences.length} {occurrences.length === 1 ? 'track' : 'tracks'} across {releaseCount} {releaseCount === 1 ? 'release' : 'releases'}.
          </p>
          <div className="tmm-occurrences">
            {occurrences.map(t => (
              <label key={t.id} className="tmm-occurrence">
                <input
                  type="checkbox"
                  className="tmm-checkbox"
                  checked={selected.has(t.id)}
                  onChange={() => toggle(t.id)}
                />
                <span className="tmm-occ-info">
                  <span className="tmm-occ-title">{t.title}{t.version ? ` — ${t.version}` : ''}</span>
                  <span className={`tmm-occ-badge tmm-occ-badge--${t.status}`}>
                    {t.status === 'live' ? 'Live' : 'Takedown'}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          className="tmm-confirm"
          disabled={selected.size === 0}
          onClick={() => onConfirm([...selected])}
        >
          Takedown selected ({selected.size})
        </button>

      </div>
    </div>
  )
}
