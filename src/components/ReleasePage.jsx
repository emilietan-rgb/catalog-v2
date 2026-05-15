import { useState, useEffect } from 'react'
import StatusBadge from './StatusBadge'
import TrackManagementModal from './TrackManagementModal'
import './ReleasePage.css'

// ─── Release state derivation ────────────────────────────────────────────────

function getReleaseState(release) {
  const { status, info, tracklist = [] } = release
  if (status === 'draft')     return 'draft'
  if (status === 'review')    return 'review'
  if (status === 'sent')      return 'sent'
  if (status === 'action')    return 'action'
  if (status === 'takedown')  return info === 'In progress' ? 'takedown_progress' : 'takedown_done'
  if (status === 'delivered') {
    if (tracklist.length > 0 && tracklist.every(t => t.status === 'takedown-progress' || t.status === 'takedown'))
      return 'tracks_all_takedown'
    return tracklist.some(t => t.status === 'takedown' || t.status === 'takedown-progress')
      ? 'delivered_partial'
      : 'delivered'
  }
  return 'delivered'
}

const TRACK_OVERRIDE = {
  draft:               'draft',
  review:              'pending',
  sent:                'pending',
  action:              'pending',
  takedown_progress:   'takedown',
  takedown_done:       'takedown',
  delivered:           null,
  delivered_partial:   null,
  tracks_all_takedown: null,
}

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

function StoreRowOverride({ store, statusLabel, statusColor, onArrow }) {
  return (
    <div className="rp-store-row">
      <StoreLogo abbr={store.abbr} color={store.color} />
      <span className="rp-store-name">{store.name}</span>
      <div className="rp-store-right">
        <span className="rp-store-status" style={{ color: statusColor }}>{statusLabel}</span>
      </div>
      {onArrow
        ? <button className="rp-store-arrow" onClick={() => onArrow(store.name)}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
          </button>
        : <div className="rp-store-arrow-placeholder" />
      }
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
        <div className="rp-dialog-header">
          <h3 className="rp-dialog-title">Open on {storeName}</h3>
          <button className="rp-dialog-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M3 3l10 10M13 3L3 13"/>
            </svg>
          </button>
        </div>
        <p className="rp-dialog-body">
          This will redirect you to the release page on {storeName}.<br />
          Expected behavior: redirect to the DSP's release link.
        </p>
        <p className="rp-dialog-note">Prototype — link not active</p>
      </div>
    </div>
  )
}

// ─── Distribution tab ─────────────────────────────────────────────────────────

const REGIONS = [
  { name: 'Europe', countries: ['France','Germany','UK','Spain','Italy','Netherlands','Belgium','Sweden','Norway','Denmark','Finland','Poland','Portugal','Austria','Switzerland','Czech Republic','Hungary','Romania','Greece','Croatia','Slovakia','Slovenia','Bulgaria','Serbia','Ukraine','Ireland','Luxembourg','Malta','Cyprus','Estonia','Latvia','Lithuania','Iceland','Albania','Bosnia','Kosovo','North Macedonia','Moldova','Montenegro','Armenia','Azerbaijan','Georgia','Belarus','Kazakhstan','Kyrgyzstan'] },
  { name: 'North America', countries: ['USA','Canada','Mexico'] },
  { name: 'Latin America', countries: ['Brazil','Argentina','Colombia','Chile','Peru','Venezuela','Ecuador','Bolivia','Paraguay','Uruguay','Costa Rica','Panama','Guatemala','Honduras','El Salvador','Nicaragua','Cuba','Dominican Republic','Puerto Rico','Jamaica'] },
  { name: 'Asia Pacific', countries: ['Japan','South Korea','Australia','China','India','Indonesia','Philippines','Thailand','Vietnam','Malaysia','Singapore','New Zealand','Taiwan','Hong Kong','Pakistan','Bangladesh','Sri Lanka','Nepal','Myanmar','Cambodia','Laos','Mongolia','Papua New Guinea','Fiji','Samoa','Tonga','Vanuatu','Solomon Islands','Brunei','Timor-Leste','Maldives','Bhutan','Afghanistan','Uzbekistan','Tajikistan','Turkmenistan','Kyrgyzstan','North Korea','Macau','French Polynesia','New Caledonia','Guam','Palau','Marshall Islands','Micronesia','Kiribati','Tuvalu','Nauru','Cook Islands'] },
  { name: 'Middle East', countries: ['UAE','Saudi Arabia','Egypt','Israel','Turkey','Jordan','Lebanon','Kuwait','Qatar','Bahrain','Oman','Iraq','Iran','Syria','Yemen','Palestine','Libya','Tunisia','Algeria','Morocco'] },
  { name: 'Africa', countries: ['South Africa','Nigeria','Kenya','Ghana','Ethiopia','Tanzania','Uganda','Senegal','Ivory Coast','Cameroon','Angola','Mozambique','Zimbabwe','Zambia','Madagascar','Rwanda','Botswana','Namibia','Malawi','Mali','Burkina Faso','Niger','Guinea','Benin','Togo','Sierra Leone','Liberia','Mauritania','Chad','Sudan','Somalia','Congo DR','Congo Republic','Gabon','Equatorial Guinea','Central African Republic','South Sudan','Eritrea','Djibouti','Comoros','Mauritius','Seychelles','Cape Verde','São Tomé','Gambia','Guinea-Bissau','Lesotho','Swaziland','Burundi'] },
  { name: 'Rest of World', countries: ['Russia','Greenland','Faroe Islands','and other territories'] },
]
const TOTAL_TERRITORIES = REGIONS.reduce((sum, r) => sum + r.countries.length, 0)

function TerritoriesTab({ releaseState }) {
  const [expanded, setExpanded] = useState({})
  const toggle = name => setExpanded(prev => ({ ...prev, [name]: !prev[name] }))

  if (releaseState === 'draft') {
    return (
      <div className="rp-empty-state">
        <svg width="32" height="32" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" style={{ color: '#cdd3e2' }}>
          <circle cx="8" cy="8" r="6"/><path d="M4 8h8M8 4v8"/>
        </svg>
        <p className="rp-empty-title">No territory scope configured yet</p>
        <p className="rp-empty-sub">Territories will appear once the release is submitted.</p>
      </div>
    )
  }

  return (
    <div className="rp-territories">
      {REGIONS.map(r => (
        <div key={r.name} className="rp-territory-region">
          <button className="rp-territory-header" onClick={() => toggle(r.name)}>
            <span className="rp-territory-name">{r.name}</span>
            <span className="rp-territory-count">{r.countries.length} countries</span>
            <svg
              className={`rp-territory-chevron${expanded[r.name] ? ' rp-territory-chevron--open' : ''}`}
              width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M6 3l5 5-5 5"/>
            </svg>
          </button>
          <div className={`rp-territory-countries${expanded[r.name] ? ' rp-territory-countries--open' : ''}`}>
            <div className="rp-territory-countries-inner">
              <div className="rp-territory-pills">
                {r.countries.map(c => <span key={c} className="rp-country-pill">{c}</span>)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function DistributionTab({ releaseState }) {
  const [distSubTab, setDistSubTab] = useState('stores')
  const [dialog, setDialog] = useState(null)
  const [storeFilter, setStoreFilter] = useState('all')

  const EMPTY_MESSAGES = {
    draft:  'This release has not been submitted yet. Distribution data will appear once delivered.',
    review: 'This release is under review. Distribution data will appear once delivered.',
    action: 'Correction required before distribution.',
  }
  const OVERRIDE_CFG = {
    sent:              { label: 'In progress',          color: '#b45309', showArrow: false },
    takedown_progress: { label: 'Takedown in progress', color: '#b45309', showArrow: false },
    takedown_done:     { label: 'Takedown done',        color: '#189c4c', showArrow: true  },
  }

  const renderStores = () => {
    if (EMPTY_MESSAGES[releaseState]) {
      return (
        <div className="rp-empty-state">
          <svg width="32" height="32" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" style={{ color: '#cdd3e2' }}>
            <circle cx="8" cy="8" r="6"/><path d="M8 5v4"/><circle cx="8" cy="11" r="0.6" fill="currentColor" stroke="none"/>
          </svg>
          <p className="rp-empty-title">Distribution not available</p>
          <p className="rp-empty-sub">{EMPTY_MESSAGES[releaseState]}</p>
        </div>
      )
    }

    const override = OVERRIDE_CFG[releaseState]
    if (override) {
      const onArrow = override.showArrow ? setDialog : null
      return (
        <>
          <div className="rp-section">
            <span className="rp-section-label">Top stores</span>
            <div className="rp-store-list">
              {TOP_STORES.map(s => <StoreRowOverride key={s.name} store={s} statusLabel={override.label} statusColor={override.color} onArrow={onArrow} />)}
            </div>
          </div>
          <div className="rp-section-divider" />
          <div className="rp-section">
            <span className="rp-section-label">All stores</span>
            <div className="rp-store-list">
              {ALL_STORES.map(s => <StoreRowOverride key={s.name} store={s} statusLabel={override.label} statusColor={override.color} onArrow={onArrow} />)}
            </div>
          </div>
          {dialog && <StoreDialog storeName={dialog} onClose={() => setDialog(null)} />}
        </>
      )
    }

    const isPartial = releaseState === 'delivered_partial'
    const visible = storeFilter === 'all'           ? ALL_STORES
      : storeFilter === 'delivered'                 ? ALL_STORES.filter(s => s.status === 'delivered')
      : storeFilter === 'not_delivered'             ? ALL_STORES.filter(s => s.status === 'not_delivered' || s.status === 'not_eligible')
      : ALL_STORES.filter(s => s.status === 'error')

    const FILTER_TABS = [
      { key: 'all',           label: 'All (81)'           },
      { key: 'delivered',     label: 'Delivered (52)'     },
      { key: 'not_delivered', label: 'Not delivered (24)' },
      { key: 'error',         label: 'Error (5)'          },
    ]

    return (
      <>
        {isPartial && (
          <div className="rp-partial-notice">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2L1.5 13h13L8 2z"/><path d="M8 7v3"/><circle cx="8" cy="12" r="0.5" fill="currentColor" stroke="none"/>
            </svg>
            Partial takedown active
          </div>
        )}
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
      </>
    )
  }

  const DELIVERED_STATES = new Set(['delivered','delivered_partial','tracks_all_takedown','takedown_progress','takedown_done'])
  const storesCount = DELIVERED_STATES.has(releaseState) ? 52 : 0

  return (
    <div className="rp-tab-content">
      <div className="rp-dist-subtabs">
        <button className={`rp-dist-subtab${distSubTab === 'stores' ? ' rp-dist-subtab--active' : ''}`} onClick={() => setDistSubTab('stores')}>
          Stores<span className="rp-dist-subtab-count">{storesCount}</span>
        </button>
        <button className={`rp-dist-subtab${distSubTab === 'territories' ? ' rp-dist-subtab--active' : ''}`} onClick={() => setDistSubTab('territories')}>
          Territories<span className="rp-dist-subtab-count">{TOTAL_TERRITORIES}</span>
        </button>
      </div>
      {distSubTab === 'territories' ? <TerritoriesTab releaseState={releaseState} /> : renderStores()}
    </div>
  )
}

// ─── Tracks tab ───────────────────────────────────────────────────────────────

function TrackBadge({ status }) {
  const cfgs = {
    live:               { bg: '#e8faef', border: '#d2f3df', color: '#189c4c', label: 'Live'                },
    takedown:           { bg: '#f3f4f8', border: '#ebeff5', color: '#3a3c42', label: 'Takedown'            },
    'takedown-progress':{ bg: '#fef3c7', border: '#fde68a', color: '#b45309', label: 'Takedown in progress'},
    pending:            { bg: '#f3f4f8', border: '#ebeff5', color: '#9aa0b0', label: 'Pending'             },
    draft:              { bg: '#f3f4f8', border: '#ebeff5', color: '#9aa0b0', label: 'Draft'               },
  }
  const cfg = cfgs[status] || cfgs.takedown
  return (
    <span className="rp-track-badge" style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}>
      {cfg.label}
    </span>
  )
}

function TracksTab({ tracks, artist, releaseTitle, trackStatusOverride, statuses, onConfirmTakedown, onCancelTakedown }) {
  const [openMenu, setOpenMenu] = useState(null)
  const [pendingTakedown, setPendingTakedown] = useState(null)
  const [playingId, setPlayingId] = useState(null)
  const togglePlay = id => setPlayingId(prev => prev === id ? null : id)

  useEffect(() => {
    const handler = () => setOpenMenu(null)
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const cancelTakedown = id => { onCancelTakedown(id); setOpenMenu(null) }
  const effectiveStatus = id => trackStatusOverride || statuses[id]

  const openTakedownModal = t => {
    const occurrences = t.isrc
      ? tracks.filter(t2 => t2.isrc === t.isrc)
      : [t]
    setOpenMenu(null)
    setPendingTakedown({ track: t, occurrences })
  }

  const confirmTakedown = ids => {
    onConfirmTakedown(ids)
    setPendingTakedown(null)
  }

  return (
    <div className="rp-tab-content">
      <div className="rp-tracks-table">
        <div className="rp-tracks-header">
          <span className="rp-th"></span>
          <span className="rp-th">#</span>
          <span className="rp-th">Title</span>
          <span className="rp-th">Artist</span>
          <span className="rp-th">ISRC</span>
          <span className="rp-th">Duration</span>
          <span className="rp-th">Status</span>
          <span className="rp-th rp-th--reason">Reason</span>
          <span className="rp-th"></span>
        </div>
        {tracks.map((t, idx) => {
          const isPlaying = playingId === t.id
          return (
          <div key={t.id} className={`rp-track-row${isPlaying ? ' rp-track-row--playing' : ''}`}>
            <span className="rp-td rp-td--actions" style={{ paddingRight: 0 }}>
              <button
                className={`rp-play-btn${isPlaying ? ' rp-play-btn--playing' : ''}`}
                onClick={() => togglePlay(t.id)}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying
                  ? <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx="1"/><rect x="9" y="2" width="4" height="12" rx="1"/></svg>
                  : <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M5 3l9 5-9 5V3z"/></svg>
                }
              </button>
            </span>
            <span className="rp-td rp-td--muted">
              {isPlaying
                ? <span className="rp-eq-bars"><span className="rp-eq-bar"/><span className="rp-eq-bar"/><span className="rp-eq-bar"/><span className="rp-eq-bar"/></span>
                : idx + 1
              }
            </span>
            <span className="rp-td rp-track-title">{t.title}</span>
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
            <span className="rp-td"><TrackBadge status={effectiveStatus(t.id)} /></span>
            <span className="rp-td rp-td--reason">{t.takedownReason || ''}</span>
            <span className="rp-td rp-td--actions">
              {!trackStatusOverride && (
                <div className="rp-track-menu-wrap" onMouseDown={e => e.stopPropagation()}>
                  <button className="rp-track-menu-btn" onClick={() => setOpenMenu(openMenu === t.id ? null : t.id)}>···</button>
                  {openMenu === t.id && (
                    <div className="rp-track-menu">
                      {statuses[t.id] === 'live' ? (
                        <button className="rp-menu-item rp-menu-item--danger" onClick={() => openTakedownModal(t)}>Takedown track</button>
                      ) : (
                        <button className="rp-menu-item" onClick={() => cancelTakedown(t.id)}>Cancel takedown</button>
                      )}
                      <button className="rp-menu-item" onClick={() => setOpenMenu(null)}>See distribution</button>
                    </div>
                  )}
                </div>
              )}
            </span>
          </div>
        )
        })}
      </div>
      {pendingTakedown && (
        <TrackManagementModal
          track={pendingTakedown.track}
          occurrences={pendingTakedown.occurrences}
          releaseTitle={releaseTitle}
          artist={artist}
          onConfirm={confirmTakedown}
          onClose={() => setPendingTakedown(null)}
        />
      )}
    </div>
  )
}

// ─── Status block ─────────────────────────────────────────────────────────────

const STATUS_ACCENT = {
  delivered: { color: '#189c4c', rgb: '24,156,76'   },
  review:    { color: '#e67828', rgb: '230,120,40'  },
  action:    { color: '#e63a52', rgb: '230,58,82'   },
  sent:      { color: '#7a57e2', rgb: '122,87,226'  },
  takedown:  { color: '#3a3c42', rgb: '58,60,66'    },
  draft:     { color: '#9aa0b0', rgb: '154,160,176' },
}

function StatusBlock({ releaseState, release, effectiveTracklist }) {
  const TODAY = new Date(2026, 4, 13)

  const parseDD = str => {
    if (!str || str === '—') return null
    const [d, m, y] = str.split('/')
    return d && m && y ? new Date(+y, +m - 1, +d) : null
  }

  const urgency = dateStr => {
    const dt = parseDD(dateStr)
    if (!dt) return null
    const days = Math.ceil((dt - TODAY) / 86400000)
    if (days < 0) return { date: dateStr, label: 'Release date passed', color: '#e63a52' }
    const relative = days === 0 ? 'Today' : `In ${days} day${days !== 1 ? 's' : ''}`
    const warn  = days <= 3 ? ' ⚠' : ''
    const color = days <= 3 ? '#e63a52' : days <= 14 ? '#b45309' : '#9aa0b0'
    return { date: dateStr, label: relative + warn, color }
  }

  const progressCount  = effectiveTracklist.filter(t => t.status === 'takedown-progress').length
  const takenDownCount = effectiveTracklist.filter(t => t.status === 'takedown').length

  let badgeStatus, context, contextColor = null, secondLine = null, dateLine = null

  switch (releaseState) {
    case 'draft':
      badgeStatus = 'draft'
      context = 'In progress'
      dateLine = urgency(release.releaseDate)
      break
    case 'review':
      badgeStatus = 'review'
      context = release.info || 'Under review'
      dateLine = urgency(release.releaseDate)
      break
    case 'action':
      badgeStatus = 'action'
      context = release.info || 'Action required'
      dateLine = urgency(release.releaseDate)
      break
    case 'sent':
      badgeStatus = 'sent'
      context = 'Scheduled'
      dateLine = urgency(release.releaseDate)
      break
    case 'delivered':
      badgeStatus = 'delivered'
      context = `Live since ${release.releaseDate || '—'}`
      break
    case 'delivered_partial':
      badgeStatus = 'delivered'
      context = `Live since ${release.releaseDate || '—'}`
      secondLine = progressCount > 0
        ? { text: `Removing ${progressCount} track${progressCount !== 1 ? 's' : ''}`, color: '#b45309' }
        : takenDownCount > 0
          ? { text: `${takenDownCount} track${takenDownCount !== 1 ? 's' : ''} taken down`, color: '#b45309' }
          : null
      break
    case 'tracks_all_takedown':
    case 'takedown_progress':
      badgeStatus = 'takedown'
      context = 'In progress'
      contextColor = '#b45309'
      break
    case 'takedown_done': {
      badgeStatus = 'takedown'
      context = release.info || 'Removed'
      const removedStr = release.info?.startsWith('Removed ') ? release.info.replace('Removed ', '') : null
      if (release.releaseDate && removedStr)
        secondLine = { text: `Was live ${release.releaseDate} → ${removedStr}`, color: '#9aa0b0' }
      break
    }
    default:
      badgeStatus = release.status
      context = release.info || ''
  }

  const accent = STATUS_ACCENT[badgeStatus] || STATUS_ACCENT.draft

  return (
    <div
      className="rp-status-block"
      style={{ borderLeftColor: accent.color, background: `rgba(${accent.rgb},0.04)` }}
    >
      <span className="rp-status-heading">Release status</span>
      <div className="rp-status-row">
        <div className="rp-status-left">
          <StatusBadge status={badgeStatus} />
          {context && <p className="rp-status-context" style={contextColor ? { color: contextColor } : undefined}>{context}</p>}
          {secondLine && <p className="rp-status-line" style={{ color: secondLine.color }}>{secondLine.text}</p>}
        </div>
        {dateLine && (
          <div className="rp-status-right">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: dateLine.color, flexShrink: 0 }}>
              <rect x="2" y="3" width="12" height="11" rx="1.5"/>
              <path d="M5 1v4M11 1v4M2 7h12"/>
            </svg>
            <div className="rp-status-right-info">
              <span className="rp-status-right-date">Expected live · {dateLine.date}</span>
              <span className="rp-status-urgency" style={{ color: dateLine.color }}>{dateLine.label}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function UpcRow({ upc }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(upc)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="rp-info-row">
      <span className="rp-info-label">UPC</span>
      <span className="rp-upc-cell">
        <span className="mono">{upc || '—'}</span>
        {upc && (
          <span className="rp-upc-copy-wrap">
            <button className="rp-upc-copy-btn" onClick={copy}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="5" width="8" height="8" rx="1.5"/><path d="M3 11V3h8"/>
              </svg>
            </button>
            {copied && <span className="rp-upc-tooltip">Copied!</span>}
          </span>
        )}
      </span>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="rp-info-row">
      <span className="rp-info-label">{label}</span>
      <span className="rp-info-value">{value}</span>
    </div>
  )
}

function OverviewTab({ release, releaseState, effectiveTracklist }) {
  const typeLabel = release.type === 'video' ? 'Video' : release.type === 'ring' ? 'Ringtone' : 'Audio'
  const typeIcon  = release.type === 'video'
    ? <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="3" width="10" height="10" rx="1"/><path d="M12 6l3-2v8l-3-2"/></svg>
    : release.type === 'ring'
      ? <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 2a5 5 0 0 1 5 5v2.5l1 1.5H2l1-1.5V7a5 5 0 0 1 5-5z"/><path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/></svg>
      : null
  const distLabel = release.subtype === 'Physical' ? 'Physical distribution' : 'Digital'
  const distIcon  = release.subtype === 'Physical'
    ? <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: '#ff852f' }}><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none"/></svg>
    : null
  const dateValue = release.releaseDate
    ? [release.releaseDate, release.releaseTime ? `${release.releaseTime} UTC` : null].filter(Boolean).join(' · ')
    : '—'

  return (
    <div className="rp-tab-content">
      <StatusBlock releaseState={releaseState} release={release} effectiveTracklist={effectiveTracklist} />
      <div className="rp-overview-grid">
        <div className="rp-overview-card">
          <span className="rp-card-heading">Release info</span>
          <UpcRow upc={release.upc} />
          <InfoRow label="Product type"       value={<span className="rp-detail-with-icon">{typeIcon}{typeLabel}</span>} />
          <InfoRow label="Distribution"       value={<span className="rp-detail-with-icon">{distIcon}{distLabel}</span>} />
          <InfoRow label="Label"              value={release.account || '—'} />
          <InfoRow label="Genre"              value="Electronic / Dance" />
          <InfoRow label="Explicit lyrics"    value="No" />
          <InfoRow label="Release date"       value={dateValue} />
          <InfoRow label="Territories"        value="Worldwide" />
          <InfoRow label="Price tier"         value="Standard" />
          <InfoRow label="Allow download"     value="Yes" />
          <InfoRow label="YT reference match" value="Yes" />
          <InfoRow label="FB reference match" value="Yes" />
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
    </div>
  )
}

// ─── Rights tab ───────────────────────────────────────────────────────────────

function RightsTab() {
  return (
    <div className="rp-tab-content rp-empty-state">
      <svg width="32" height="32" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" style={{ color: '#cdd3e2' }}>
        <path d="M8 2l5 2v4c0 3-2.5 5.5-5 6-2.5-.5-5-3-5-6V4l5-2z"/>
      </svg>
      <p className="rp-empty-title">No rights information</p>
      <p className="rp-empty-sub">Rights and ownership data for this release will appear here.</p>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ReleasePage({ release, onBack, isFavorited, onToggleFavorite, trackOverrides = {}, onTrackStatusChange }) {
  const [tab, setTab] = useState('overview')
  const [artistDialog, setArtistDialog] = useState(false)
  const [releaseTakedownModal, setReleaseTakedownModal] = useState(false)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setMoreMenuOpen(false)
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const releaseOverrides = trackOverrides[release.id] || {}
  const effectiveTracklist = (release.tracklist || []).map(t => ({
    ...t, status: releaseOverrides[t.id] ?? t.status
  }))
  const allTakenDown = effectiveTracklist.length > 0 &&
    effectiveTracklist.every(t => t.status === 'takedown-progress' || t.status === 'takedown')

  const effectiveRelease    = { ...release, tracklist: effectiveTracklist }
  const releaseState        = getReleaseState(effectiveRelease)
  const trackStatusOverride = TRACK_OVERRIDE[releaseState]

  const trackStatuses = Object.fromEntries(
    (release.tracklist || []).map(t => [t.id, releaseOverrides[t.id] ?? t.status])
  )
  const handleConfirmTakedown = ids => onTrackStatusChange?.(release.id, ids, 'takedown-progress')
  const handleCancelTakedown  = id  => onTrackStatusChange?.(release.id, [id], 'live')

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
            <h1 className="rp-title">{release.title}</h1>
            <p className="rp-artist-line">By <span className="rp-artist-link" onClick={() => setArtistDialog(true)}>{release.artist}</span></p>
          </div>
        </div>
        <div className="rp-header-actions">
          <button className="rp-action-btn">Edit release</button>
          <div className="rp-track-menu-wrap" onMouseDown={e => e.stopPropagation()}>
            <button className="rp-action-btn rp-action-btn--more" onClick={() => setMoreMenuOpen(o => !o)}>···</button>
            {moreMenuOpen && release.status === 'delivered' && !allTakenDown && (
              <div className="rp-track-menu" style={{ minWidth: 160 }}>
                <button
                  className="rp-menu-item rp-menu-item--danger"
                  onMouseDown={() => { setMoreMenuOpen(false); setReleaseTakedownModal(true) }}
                >
                  Takedown release
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rp-tabs">
        {[
          { key: 'overview',     label: 'Overview'               },
          { key: 'tracks',       label: `Tracks (${(release.tracklist || []).length})` },
          { key: 'distribution', label: 'Distribution'           },
          { key: 'rights',       label: 'Rights'                 },
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

      {tab === 'distribution' && <DistributionTab releaseState={releaseState} />}
      {tab === 'tracks'       && <TracksTab tracks={release.tracklist || []} artist={release.artist} releaseTitle={release.title} trackStatusOverride={trackStatusOverride} statuses={trackStatuses} onConfirmTakedown={handleConfirmTakedown} onCancelTakedown={handleCancelTakedown} />}
      {tab === 'overview'     && <OverviewTab release={release} releaseState={releaseState} effectiveTracklist={effectiveTracklist} />}
      {tab === 'rights'       && <RightsTab />}

      {artistDialog && (
        <div className="rp-overlay" onMouseDown={() => setArtistDialog(false)}>
          <div className="rp-dialog" onMouseDown={e => e.stopPropagation()}>
            <div className="rp-dialog-header">
              <h3 className="rp-dialog-title">Open artist page</h3>
              <button className="rp-dialog-close" onClick={() => setArtistDialog(false)} aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M3 3l10 10M13 3L3 13"/>
                </svg>
              </button>
            </div>
            <p className="rp-dialog-body">This will redirect you to the artist page for {release.artist}.</p>
            <p className="rp-dialog-note">Prototype — link not active</p>
          </div>
        </div>
      )}

      {releaseTakedownModal && (
        <TrackManagementModal
          track={{ id: null, title: release.title, isrc: release.upc ? `UPC ${release.upc}` : '—', version: null }}
          occurrences={effectiveTracklist}
          releaseTitle={release.title}
          artist={release.artist}
          initialSelected={effectiveTracklist.map(t => t.id)}
          hideUsage
          onConfirm={ids => { handleConfirmTakedown(ids); setReleaseTakedownModal(false) }}
          onClose={() => setReleaseTakedownModal(false)}
        />
      )}
    </div>
  )
}
