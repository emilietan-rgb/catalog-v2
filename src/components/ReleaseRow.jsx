import StatusBadge from './StatusBadge'
import './ReleaseRow.css'

function tooltipLabel(type, subtype) {
  if (subtype === 'Physical') return 'Physical distribution'
  if (type === 'video') return 'Video'
  if (type === 'ring') return 'Ringtone'
  return null
}

function TypeIconWithTooltip({ type, subtype }) {
  const label = tooltipLabel(type, subtype)
  if (!label) return null

  return (
    <span className="type-icon-wrap">
      {subtype === 'Physical' ? (
        <svg className="type-icon type-icon--physical" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="8" cy="8" r="6"/>
          <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none"/>
        </svg>
      ) : type === 'video' ? (
        <svg className="type-icon" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <rect x="2" y="3" width="10" height="10" rx="1"/>
          <path d="M12 6l3-2v8l-3-2"/>
        </svg>
      ) : (
        <svg className="type-icon" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M8 2a5 5 0 0 1 5 5v2.5l1 1.5H2l1-1.5V7a5 5 0 0 1 5-5z"/>
          <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/>
        </svg>
      )}
      <span className="type-tooltip">{label}</span>
    </span>
  )
}

function getInfoColor(status, info) {
  if (!info) return '#9aa0b0'
  if (status === 'action') return '#e63a52'
  if (info.includes('taken down') || info === 'In progress') return '#b45309'
  return '#9aa0b0'
}

function InfoLine({ text, color }) {
  if (!text) return null
  return <span className="release-info-line" style={{ color: color || '#9aa0b0' }}>{text}</span>
}

export default function ReleaseRow({ release, selected, onSelect, onOpen }) {
  const hasAction = release.status === 'action'

  return (
    <div className={`release-row${selected ? ' selected' : ''}${hasAction ? ' has-action' : ''}`} onClick={onOpen}>
      {/* Checkbox */}
      <div className="release-cell-check">
        <input
          type="checkbox"
          checked={selected}
          onChange={e => onSelect(e.target.checked)}
          onClick={e => e.stopPropagation()}
        />
      </div>

      {/* Entity cell: cover + title/subtitle */}
      <div className="release-cell-release">
        <div className="release-cover">
          {release.coverImage
            ? <img src={release.coverImage} alt={release.title} width="48" height="48" />
            : <div className="cover-placeholder">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M9 3v7.5a2.5 2.5 0 1 1-2-2.45V3h2z"/>
                </svg>
              </div>
          }
        </div>
        <div className="release-info">
          <div className="release-title-row">
            <span className="release-type-icon">
              <TypeIconWithTooltip type={release.type} subtype={release.subtype} />
            </span>
            <span className="release-title">{release.title}</span>
          </div>
          <div className="release-meta">
            <span className="release-artist">{release.artist}</span>
            <span className="meta-sep">·</span>
            <span>{release.trackCount === 0 ? '—' : `${release.trackCount} ${release.trackCount === 1 ? 'track' : 'tracks'}`}</span>
            <span className="meta-sep">·</span>
            <span className="mono release-upc">{release.upc || '—'}</span>
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="release-cell release-cell-account">{release.account}</div>

      {/* Release date */}
      <div className="release-cell release-cell-date">
        <span>{release.releaseDate}</span>
        {release.releaseTime && <span className="mono release-time">{release.releaseTime}</span>}
      </div>

      {/* Status */}
      <div className="release-cell release-cell-status">
        <StatusBadge status={release.status} />
      </div>

      {/* Information */}
      <div className="release-cell release-cell-info">
        <InfoLine text={release.info} color={getInfoColor(release.status, release.info)} />
      </div>

      {/* Actions */}
      <div className="release-cell release-cell-actions">
        <button className="row-menu-btn" onClick={e => e.stopPropagation()}>···</button>
      </div>
    </div>
  )
}
