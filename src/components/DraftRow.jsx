import { useState } from 'react'
import CompletenessBar from './CompletenessBar'
import './DraftRow.css'

function TypeIcon({ type }) {
  if (type === 'video') return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="3" width="10" height="10" rx="1"/><path d="M12 6l3-2v8l-3-2"/></svg>
  )
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 3v7.5a2.5 2.5 0 1 1-2-2.45V3h2z"/><path d="M9 5l4 1"/></svg>
  )
}

export default function DraftRow({ draft, selected, onSelect }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`draft-row${selected ? ' selected' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="release-cell-check">
        <input
          type="checkbox"
          checked={selected}
          onChange={e => onSelect(e.target.checked)}
          onClick={e => e.stopPropagation()}
        />
      </div>

      <div className="release-cell-release">
        <div className="release-cover">
          <div className="cover-placeholder">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 3v7.5a2.5 2.5 0 1 1-2-2.45V3h2z"/></svg>
          </div>
        </div>
        <div className="release-info">
          <div className="release-title-row">
            <span className="release-type-icon"><TypeIcon type={draft.type} /></span>
            <span className="release-title">{draft.title}</span>
            {draft.subtype && draft.subtype !== 'Music' && (
              <span className="subtype-badge">{draft.subtype}</span>
            )}
          </div>
          <div className="release-meta">
            <span>{draft.artist}</span>
            <span className="meta-sep">·</span>
            <span>{draft.trackCount} {draft.trackCount === 1 ? 'track' : 'tracks'}</span>
            {draft.upc && <><span className="meta-sep">·</span><span className="mono release-upc">{draft.upc}</span></>}
          </div>
        </div>
      </div>

      <div className="release-cell release-cell-account">{draft.account}</div>

      <div className="release-cell release-cell-date">
        <span>{draft.date || '—'}</span>
      </div>

      <div className="release-cell release-cell-status">
        <CompletenessBar pct={draft.completeness} label={draft.completenessLabel} />
      </div>

      <div className="release-cell release-cell-actions">
        {hovered && (
          <button className="row-menu-btn" onClick={e => e.stopPropagation()}>···</button>
        )}
      </div>
    </div>
  )
}
