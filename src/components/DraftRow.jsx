import './ReleaseRow.css'
import './DraftRow.css'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
function formatDate(dateStr) {
  if (!dateStr) return '—'
  const [dd, mm, yyyy] = dateStr.split('/')
  if (!dd || !mm || !yyyy) return dateStr
  return `${dd} ${MONTHS[parseInt(mm, 10) - 1]} ${yyyy}`
}

function TypeIconWithTooltip({ type, subtype }) {
  if (subtype === 'Physical') return (
    <span className="type-icon-wrap">
      <svg className="type-icon type-icon--physical" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none"/>
      </svg>
      <span className="type-tooltip">Physical distribution</span>
    </span>
  )
  if (type === 'video') return (
    <span className="type-icon-wrap">
      <svg className="type-icon" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="2" y="3" width="10" height="10" rx="1"/><path d="M12 6l3-2v8l-3-2"/>
      </svg>
      <span className="type-tooltip">Video</span>
    </span>
  )
  if (type === 'ring') return (
    <span className="type-icon-wrap">
      <svg className="type-icon" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M8 2a5 5 0 0 1 5 5v2.5l1 1.5H2l1-1.5V7a5 5 0 0 1 5-5z"/>
        <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/>
      </svg>
      <span className="type-tooltip">Ringtone</span>
    </span>
  )
  return null
}

function CompletionDot({ complete }) {
  return <span className={`completion-dot${complete ? ' completion-dot--green' : ' completion-dot--amber'}`} />
}

function CompletionPill({ label, complete }) {
  return (
    <span className="completion-pill">
      <CompletionDot complete={complete} />
      {label}
    </span>
  )
}

function CompletionCell({ completion }) {
  const { info, stores, art, audio } = completion
  return (
    <div className="completion-indicators">
      <CompletionPill label="Info"   complete={info}   />
      <CompletionPill label="Stores" complete={stores} />
      <CompletionPill label="Art"    complete={art}    />
      <CompletionPill label="Audio"  complete={audio}  />
    </div>
  )
}

export default function DraftRow({ draft, selected, onSelect }) {
  return (
    <div className={`draft-row${selected ? ' selected' : ''}`}>
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
          {draft.coverImage
            ? <img src={draft.coverImage} alt={draft.title} width="48" height="48" />
            : <div className="cover-placeholder">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M9 3v7.5a2.5 2.5 0 1 1-2-2.45V3h2z"/>
                </svg>
              </div>
          }
        </div>
        <div className="release-info">
          <div className="release-title-row">
            <TypeIconWithTooltip type={draft.type} subtype={draft.subtype} />
            <span className="release-title">{draft.title}</span>
          </div>
          <div className="release-meta">
            <span className="release-trackcount">{draft.trackCount === 0 ? '—' : `${draft.trackCount} ${draft.trackCount === 1 ? 'track' : 'tracks'}`}</span>
            <span className="meta-sep">·</span>
            <span className="release-artist">{draft.artist}</span>
          </div>
        </div>
      </div>

      <div className="release-cell release-cell-account">
        <span className="release-account">{draft.account}</span>
      </div>

      <div className="release-cell release-cell-date">
        <span className="release-date-value">{formatDate(draft.releaseDate)}</span>
      </div>

      <div className="release-cell release-cell-completion">
        <CompletionCell completion={draft.completion} />
      </div>

      <div className="release-cell release-cell-actions">
        <button className="row-menu-btn" onClick={e => e.stopPropagation()}>···</button>
      </div>
    </div>
  )
}
