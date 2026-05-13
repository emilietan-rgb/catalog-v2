import { useState, useEffect } from 'react'
import StatusBadge from './StatusBadge'
import './ReleasePage.css'

// ─── Data ────────────────────────────────────────────────────────────────────

const TOP_STORES = [
  { name: 'Spotify',       abbr: 'SP', color: '#1DB954', status: 'delivered',    info: 'Update info done', date: 'Mar 27, 2026' },
  { name: 'Apple Music',   abbr: 'AM', color: '#FA233B', status: 'delivered',    info: 'Update info done', date: 'Mar 28, 2026' },
  { name: 'Deezer',        abbr: 'DZ', color: '#A238FF', status: 'delivered',    info: 'Update info done', date: 'Mar 27, 2026' },
  { name: 'Amazon Music',  abbr: 'AZ', color: '#1a1a2e', status: 'error',        info: 'Insert failed',    date: 'Jun 25, 2023' },
  { name: 'YouTube Music', abbr: 'YT', color: '#FF0000', status: 'delivered',    info: 'Update info done', date: 'Mar 28, 2026' },
  { name: 'TikTok',        abbr: 'TK', color: '#111',    status: 'delivered',    info: 'Update info done', date: 'Mar 27, 2026' },
]

const ALL_STORES = [
  { name: '7Digital',      abbr: '7D', color: '#EE3B23', status: 'delivered',     info: 'Update info done', date: 'Mar 27, 2026' },
  { name: 'ACR Cloud',     abbr: 'AC', color: '#2B90D9', status: 'delivered',     info: 'Update info done', date: 'Mar 27, 2026' },
  { name: 'Amazon Music',  abbr: 'AZ', color: '#1a1a2e', status: 'error',         info: 'Insert failed',    date: 'Jun 25, 2023' },
  { name: 'Anghami',       abbr: 'AN', color: '#C91C2F', status: 'delivered',     info: 'Update info done', date: 'Mar 28, 2026' },
  { name: 'Apple Music',   abbr: 'AM', color: '#FA233B', status: 'delivered',     info: 'Update info done', date: 'Mar 28, 2026' },
  { name: 'Audiomack',     abbr: 'AU', color: '#F97F0F', status: 'not_eligible',  info: null,               date: null            },
  { name: 'AWA',           abbr: 'AW', color: '#E54B3C', status: 'delivered',     info: 'Update info done', date: 'Mar 28, 2026' },
  { name: 'Beatport',      abbr: 'BP', color: '#01CC7B', status: 'not_delivered', info: null,               date: null            },
  { name: 'Beatsource',    abbr: 'BS', color: '#4361EE', status: 'delivered',     info: 'Update info done', date: 'Mar 27, 2026' },
  { name: 'Bmat',          abbr: 'BM', color: '#9B59B6', status: 'delivered',     info: 'Update info done', date: 'Mar 27, 2026' },
  { name: 'Boomplay',      abbr: 'BL', color: '#FF5500', status: 'delivered',     info: 'Update info done', date: 'Mar 28, 2026' },
  { name: 'CapCut',        abbr: 'CC', color: '#333',    status: 'error',         info: 'Insert failed',    date: 'Jan 12, 2026' },
  { name: 'Deezer',        abbr: 'DZ', color: '#A238FF', status: 'delivered',     info: 'Update info done', date: 'Mar 27, 2026' },
  { name: 'Facebook',      abbr: 'FB', color: '#1877F2', status: 'not_delivered', info: null,               date: null            },
  { name: 'Instagram',     abbr: 'IG', color: '#E1306C', status: 'delivered',     info: 'Update info done', date: 'Mar 27, 2026' },
]

const STORE_STATUS = {
  delivered:     { color: '#189c4c', label: 'Delivered'     },
  error:         { color: '#e63a52', label: 'Error'         },
  not_delivered: { color: '#9aa0b0', label: 'Not delivered' },
  not_eligible:  { color: '#9aa0b0', label: 'Not eligible'  },
}

// ─── Store components ─────────────────────────────────────────────────────────

function StoreLogo({ abbr, color }) {
  return <span className="rp-store-logo" style={{ background: color }}>{abbr}</span>
}

function StoreRow({ store, onArrow }) {
  const cfg = STORE_STATUS[store.status] || STORE_STATUS.not_delivered
  return (
    <div className="rp-store-row">
      <StoreLogo abbr={store.abbr} color={store.color} />
      <span className="rp-store-name">{store.name}</span>
      <div className="rp-store-right">
        <span className="rp-store-status" style={{ color: cfg.color }}>{cfg.label}</span>
        {store.info && <span className="rp-store-sep">·</span>}
        {store.info && <span className="rp-store-meta">{store.info}</span>}
        {store.date && <span className="rp-store-sep">·</span>}
        {store.date && <span className="rp-store-meta">{store.date}</span>}
      </div>
      <button className="rp-store-arrow" onClick={() => onArrow(store.name)}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8h10M9 4l4 4-4 4"/>
        </svg>
      </button>
    </div>
  )
}

function StoreDialog({ storeName, onClose }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="rp-overlay" onMouseDown={onClose}>
      <div className="rp-dialog" onMouseDown={e => e.stopPropagation()}>
        <h3 className="rp-dialog-title">Open on {storeName}?</h3>
        <p className="rp-dialog-body">
          This will redirect you to the release page on {storeName}.<br />
          Expected behavior: redirect to the DSP's release link.
        </p>
        <p className="rp-dialog-note">Prototype — link not active</p>
        <div className="rp-dialog-actions">
          <button className="rp-dialog-cancel" onClick={onClose}>Cancel</button>
          <button className="rp-dialog-open" onClick={onClose}>Open {storeName} →</button>
        </div>
      </div>
    </div>
  )
}

// ─── Distribution tab ─────────────────────────────────────────────────────────

function DistributionTab() {
  const [dialog, setDialog] = useState(null)
  const [storeFilter, setStoreFilter] = useState('all')

  const visible = storeFilter === 'all'          ? ALL_STORES
    : storeFilter === 'delivered'                ? ALL_STORES.filter(s => s.status === 'delivered')
    : storeFilter === 'not_delivered'            ? ALL_STORES.filter(s => s.status === 'not_delivered' || s.status === 'not_eligible')
    : ALL_STORES.filter(s => s.status === 'error')

  const FILTER_TABS = [
    { key: 'all',           label: 'All (81)'           },
    { key: 'delivered',     label: 'Delivered (52)'     },
    { key: 'not_delivered', label: 'Not delivered (24)' },
    { key: 'error',         label: 'Error (5)'          },
  ]

  return (
    <div className="rp-tab-content">
      <div className="rp-section">
        <span className="rp-section-label">Top stores</span>
        <div className="rp-store-list">
          {TOP_STORES.map(s => <StoreRow key={s.name} store={s} onArrow={setDialog} />)}
        </div>
      </div>

      <div className="rp-section-divider" />

      <div className="rp-section">
        <span className="rp-section-label">All stores</span>
        <div className="rp-store-filter-tabs">
          {FILTER_TABS.map(f => (
            <button
              key={f.key}
              className={`rp-store-filter-tab${storeFilter === f.key ? ' rp-store-filter-tab--active' : ''}`}
              onClick={() => setStoreFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="rp-store-list">
          {visible.map(s => <StoreRow key={s.name} store={s} onArrow={setDialog} />)}
        </div>
      </div>

      {dialog && <StoreDialog storeName={dialog} onClose={() => setDialog(null)} />}
    </div>
  )
}

// ─── Tracks tab ───────────────────────────────────────────────────────────────

function TrackBadge({ status }) {
  const cfg = status === 'live'
    ? { bg: '#e8faef', border: '#d2f3df', color: '#189c4c', label: 'Live' }
    : { bg: '#f3f4f8', border: '#ebeff5', color: '#0f1012', label: 'Takedown' }
  return (
    <span className="rp-track-badge" style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}>
      {cfg.label}
    </span>
  )
}

function TracksTab({ tracks, artist }) {
  const [statuses, setStatuses] = useState(() => Object.fromEntries(tracks.map(t => [t.id, t.status])))
  const [openMenu, setOpenMenu] = useState(null)

  useEffect(() => {
    const handler = () => setOpenMenu(null)
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggle = id => { setStatuses(p => ({ ...p, [id]: p[id] === 'live' ? 'takedown' : 'live' })); setOpenMenu(null) }

  return (
    <div className="rp-tab-content">
      <div className="rp-tracks-table">
        <div className="rp-tracks-header">
          <span className="rp-th">#</span>
          <span className="rp-th">Title</span>
          <span className="rp-th">Version</span>
          <span className="rp-th">Artist</span>
          <span className="rp-th">ISRC</span>
          <span className="rp-th">Duration</span>
          <span className="rp-th">Status</span>
          <span className="rp-th"></span>
        </div>
        {tracks.map(t => (
          <div key={t.id} className="rp-track-row">
            <span className="rp-td rp-td--muted">{t.num}</span>
            <span className="rp-td rp-track-title">{t.title}</span>
            <span className="rp-td rp-td--muted">{t.version || '—'}</span>
            <span className="rp-td">{t.artist || artist}</span>
            {t.isrc ? (
              <span
                className="rp-td rp-isrc-cell"
                onClick={() => navigator.clipboard?.writeText(t.isrc)}
                title="Copy ISRC"
              >
                <span className="mono rp-isrc-text">{t.isrc}</span>
                <span className="rp-isrc-icon">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="5" width="8" height="8" rx="1.5"/>
                    <path d="M3 11V3h8"/>
                  </svg>
                </span>
              </span>
            ) : (
              <span className="rp-td rp-td--muted">—</span>
            )}
            <span className="rp-td rp-td--muted">{t.duration}</span>
            <span className="rp-td"><TrackBadge status={statuses[t.id]} /></span>
            <span className="rp-td rp-td--actions">
              <div
                className="rp-track-menu-wrap"
                onMouseDown={e => e.stopPropagation()}
              >
                <button
                  className="rp-track-menu-btn"
                  onClick={() => setOpenMenu(openMenu === t.id ? null : t.id)}
                >
                  ···
                </button>
                {openMenu === t.id && (
                  <div className="rp-track-menu">
                    {statuses[t.id] === 'live' ? (
                      <button className="rp-menu-item rp-menu-item--danger" onClick={() => toggle(t.id)}>
                        Takedown track
                      </button>
                    ) : (
                      <button className="rp-menu-item" onClick={() => toggle(t.id)}>
                        Cancel takedown
                      </button>
                    )}
                    <button className="rp-menu-item" onClick={() => setOpenMenu(null)}>
                      See distribution
                    </button>
                  </div>
                )}
              </div>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function InfoRow({ label, value }) {
  return (
    <div className="rp-info-row">
      <span className="rp-info-label">{label}</span>
      <span className="rp-info-value">{value}</span>
    </div>
  )
}

function OverviewTab({ release }) {
  return (
    <div className="rp-tab-content rp-overview-grid">
      <div className="rp-overview-card">
        <span className="rp-card-heading">Release info</span>
        <InfoRow label="Label"               value={release.account || '—'} />
        <InfoRow label="UPC"                 value={release.upc || '—'} />
        <InfoRow label="Genre"               value="Electronic / Dance" />
        <InfoRow label="Explicit lyrics"     value="No" />
        <InfoRow label="Release date"        value={release.releaseDate || '—'} />
        <InfoRow label="Distribution"        value={release.subtype === 'Physical' ? 'Physical' : 'Digital'} />
        <InfoRow label="Territories"         value="Worldwide" />
        <InfoRow label="Price tier"          value="Standard" />
        <InfoRow label="Allow download"      value="Yes" />
        <InfoRow label="YT reference match"  value="Yes" />
        <InfoRow label="FB reference match"  value="Yes" />
      </div>
      <div className="rp-overview-card">
        <span className="rp-card-heading">Rights & credits</span>
        <InfoRow label="© Copyright"     value={`${release.account || '—'}, 2026`} />
        <InfoRow label="℗ Producer"      value={release.artist || '—'} />
        <InfoRow label="Production year" value="2026" />
        <InfoRow label="Composer"        value="Alexis Dubois" />
        <InfoRow label="Author"          value="Alexis Dubois" />
      </div>
    </div>
  )
}

// ─── Header type/distribution icons ──────────────────────────────────────────

function VideoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="2" y="3" width="10" height="10" rx="1"/>
      <path d="M12 6l3-2v8l-3-2"/>
    </svg>
  )
}

function RingtoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M8 2a5 5 0 0 1 5 5v2.5l1 1.5H2l1-1.5V7a5 5 0 0 1 5-5z"/>
      <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/>
    </svg>
  )
}

function VinylIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: '#ff852f' }}>
      <circle cx="8" cy="8" r="6"/>
      <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ReleasePage({ release, onBack }) {
  const [tab, setTab] = useState('distribution')

  const typeLabel = release.type === 'video' ? 'Video' : release.type === 'ring' ? 'Ringtone' : 'Audio'
  const typeIcon  = release.type === 'video' ? <VideoIcon /> : release.type === 'ring' ? <RingtoneIcon /> : null
  const distLabel = release.subtype === 'Physical' ? 'Physical distribution' : 'Digital'
  const distIcon  = release.subtype === 'Physical' ? <VinylIcon /> : null

  return (
    <div className="rp-container">
      <button className="rp-back-btn" onClick={onBack}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 3L4 8l6 5"/>
        </svg>
        Back to Releases
      </button>

      <div className="rp-header">
        <div className="rp-header-left">
          <div className="rp-cover">
            {release.coverImage
              ? <img src={release.coverImage} alt={release.title} width="64" height="64" />
              : <div className="rp-cover-placeholder" />}
          </div>
          <div className="rp-header-info">
            <StatusBadge status={release.status} />
            <h1 className="rp-title">{release.title}</h1>
            <p className="rp-artist-line">By {release.artist}</p>
          </div>
        </div>
        <div className="rp-header-right">
          <div className="rp-detail-col">
            <span className="rp-detail-label">UPC</span>
            <span className="rp-detail-value mono">{release.upc || '—'}</span>
          </div>
          <div className="rp-detail-col">
            <span className="rp-detail-label">Product type</span>
            <span className="rp-detail-value rp-detail-with-icon">{typeIcon}{typeLabel}</span>
          </div>
          <div className="rp-detail-col">
            <span className="rp-detail-label">Distribution</span>
            <span className="rp-detail-value rp-detail-with-icon">{distIcon}{distLabel}</span>
          </div>
        </div>
      </div>

      <div className="rp-tabs">
        {[
          { key: 'overview',     label: 'Overview'               },
          { key: 'tracks',       label: `Tracks (${(release.tracklist || []).length})` },
          { key: 'distribution', label: 'Distribution'           },
        ].map(t => (
          <button
            key={t.key}
            className={`rp-tab${tab === t.key ? ' rp-tab--active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'distribution' && <DistributionTab />}
      {tab === 'tracks'       && <TracksTab tracks={release.tracklist || []} artist={release.artist} />}
      {tab === 'overview'     && <OverviewTab release={release} />}
    </div>
  )
}
